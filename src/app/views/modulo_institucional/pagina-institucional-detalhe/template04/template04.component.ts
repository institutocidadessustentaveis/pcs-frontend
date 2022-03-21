import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { InstitucionalInterno } from 'src/app/model/institucional-interno';
import { environment } from 'src/environments/environment';
import * as L from 'leaflet';
import { geoJSON, circleMarker , marker} from 'leaflet';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import "leaflet.markercluster";
import { MapaTematicoService } from 'src/app/services/mapa-tematico.service';
import { ClasseMapaTematico } from 'src/app/model/classeMapaTematico';
import { GestureHandling } from "leaflet-gesture-handling";

declare var $;

@Component({
  selector: 'app-template04',
  templateUrl: './template04.component.html',
  styleUrls: ['./template04.component.css']
})

export class Template04Component implements OnInit , OnChanges{

  @Input() pagina: InstitucionalInterno;

  primeiroTexto: string;
  segundoTexto: string;
  esconderMapa = true;
  legendaEditavel: any;
  classesMapaTematico: ClasseMapaTematico[] = [];
  private dadosLegenda = {
    grades : [''],
    labels : [''],
    classesTematicas: []
  };

  constructor(public shapeFileService: ShapeFileService,
              private prefeituraService: PrefeituraService,
              private mapaTematicoService: MapaTematicoService) { 
                L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
              }

  private baseLayers = {
    Mapa: L.tileLayer(environment.MAP_TILE_SERVER, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 2,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    }),
    Satélite: L.tileLayer(environment.MAP_TILE_SERVER_SAT, {
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    })
  };

  public options = {
    zoom: 4,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: L.latLng([-15.03144, -53.09227]),
    layers: [this.baseLayers.Mapa]
  };

  public loading = false;

  markerClusters: any;

  private map;


  layerControl = null;

  stylelayer = {
    defecto: {
      color: "#666666",
      draggable: true,
      fillColor: "#c0c3ac",
      fillOpacity: 0.5,
      opacity: 1,
      strokeOpacity: 0.5,
      transform: true,
      weight: 5
    },
    highlight: {
        weight: 5,
        color: '#0D8BE7',
        dashArray: '',
        fillOpacity: 0.7
    },
    selected: {
        color: '#0D8BE7',
        weight: 4,
        fillOpacity: .9,
        strokeOpacity: 1
    }

  };

  ngOnInit() {
  }

  public buscarMapaTematico(shapeLayer, idCamada) {           
    this.mapaTematicoService.buscarMapaTematicoExibirAuto(idCamada).subscribe(mapa => {
      if (mapa){        
        this.gerarMapaTematico(mapa, shapeLayer, idCamada)
        this.gerarLegenda()
      }
        })
  }

  gerarMapaTematico(mapa, camada, idCamada) {    
    const selectedLayer = camada;
    const layerName = mapa.layerName;
    let selectedAttribute = mapa.attributeName;
    let selectedType = mapa.type;
    this.classesMapaTematico = mapa.classes

    if (selectedType === 'CATEGORIZADO') {
      if (Object.keys(selectedLayer._layers)) {       
        const keys = Object.keys(selectedLayer._layers);
        for (const key of keys) {
          var layer = selectedLayer._layers[key];
          const layerJSON = layer.toGeoJSON();
          var properties = null;
          var propertyValue = null;

          if (layerJSON.features) {
            properties = layer.toGeoJSON().features[0].properties;
            propertyValue = properties[selectedAttribute];
          } else if (layer.properties) {
            properties = layer.properties;
            propertyValue = properties[selectedAttribute];
          } else if (layer.options) {
            properties = layer.options;
            propertyValue = properties[selectedAttribute];
          } else {
            properties = {};
          }
          
          const classes = this.classesMapaTematico.filter((clazz) => clazz.value == propertyValue);
          if (classes.length > 0) {
            const clazz = classes[0];            
            layer.setStyle({color: '#0a0303', fillColor: clazz.color, opacity: 1, fillOpacity: 1, weight: 1});
          }
        }
      }
      this.getClassesTematicas(
        {nome: layerName,
        classes: this.classesMapaTematico,
        exibirLegenda: mapa.exibirLegenda});
    }

    if (selectedType === 'GRADUADO') {
      if (Object.keys(selectedLayer._layers)) {
        const keys = Object.keys(selectedLayer._layers);
        for (const key of keys) {
          var layer = selectedLayer._layers[key];
          const layerJSON = layer.toGeoJSON();
          let properties = null;
          let propertyValue = null;

          if (layerJSON.features) {
            properties = layer.toGeoJSON().features[0].properties;
            propertyValue = properties[selectedAttribute];
          } else if (layer.properties) {
            properties = layer.properties;
            propertyValue = properties[selectedAttribute];
          } else if (layer.options) {
            properties = layer.options;
            propertyValue = properties[selectedAttribute];
          } else {
            properties = {};
          }
          const classes = this.classesMapaTematico.filter((clazz) => propertyValue >= clazz.minimo && propertyValue < (clazz.maximo + 0.00001) );

          if (classes.length > 0) {
            const clazz = classes[0];
            layer.setStyle({color: clazz.color, fillColor: clazz.color, opacity: 1, fillOpacity: 1});
          }
        }
      }
      this.getClassesTematicas(
        {nome: layerName,
        classes: this.classesMapaTematico,
        exibirLegenda: mapa.exibirLegenda});
    }
  }

  private gerarLegenda() {    
    if (this.legendaEditavel) {
      this.map.removeControl(this.legendaEditavel);
    }
    let _this = this;
    this.legendaEditavel = L.control({position: 'bottomright'});
    this.legendaEditavel.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'info legend');
          const divCamadaTematica = L.DomUtil.create('div', 'legenda-camada-tematica');
          const grades = _this.dadosLegenda.grades;
          const labels = _this.dadosLegenda.labels;
          
          const camadasTematicas = _this.dadosLegenda.classesTematicas;
          
          if (camadasTematicas.length > 0 && grades.length > 0 && grades[0].length > 0) {
            div.innerHTML += '<strong>Legenda</strong><br>';
          }
          else {
            div.innerHTML += '';
          }

          if (camadasTematicas.length > 0 && grades.length > 0 && grades[0].length > 0) {
            div.innerHTML += `<br>`;
          }
        
          if (camadasTematicas.length > 0) {
            for (let i = 0; i < camadasTematicas.length; i++) {
              divCamadaTematica.innerHTML += `<strong>${camadasTematicas[i].nome}</strong><br>`;
              camadasTematicas[i].classes.forEach(classe => {
                divCamadaTematica.innerHTML += classe.value + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  classe.color + '\'></i>') + '<br>';
              });
            }
          }
          else {
            divCamadaTematica.innerHTML = ''
          }
          
          div.innerHTML += divCamadaTematica.innerHTML
          if (div.innerHTML.length > 0) {
            return div;
          }
          else {
            return L.DomUtil.create('div');
          }
        };
    this.legendaEditavel.addTo(this.map);

    this.map.on('browser-print-start', function(e) {
      _this.legendaEditavel.addTo(e.printMap);
        });

    this.map.on('browser-print-end', function(e) {
      _this.legendaEditavel.addTo(_this.map);
    });
  }

  getClassesTematicas(mapaTematico) {   
    let encontrado = false;
    if (mapaTematico.exibirLegenda) {
      this.dadosLegenda.classesTematicas.forEach(item => {
        if (item.nome == mapaTematico.nome ) {       
          item.classes = mapaTematico.classes;
          encontrado = true;
          this.gerarLegenda()
        }
      });
      if (!encontrado) {
          this.dadosLegenda.classesTematicas.push(mapaTematico);
        this.getClassesTematicas(mapaTematico)
        this.gerarLegenda()
      }
    }
    else {
      this.removeClassesTematicas(mapaTematico)
    }
  }

  removeClassesTematicas(mapaTematico) {
    if (mapaTematico.layers) {
      for (let layer of mapaTematico.layers) {
        layer.setStyle({color: "#666666",
        draggable: true,
        fillColor: "#c0c3ac",
        fillOpacity: 0.5,
        opacity: 1,
        strokeOpacity: 0.5,
        transform: true,
        weight: 5})
      }
    }
    this.dadosLegenda.classesTematicas = this.dadosLegenda.classesTematicas.filter(item => item.nome !== mapaTematico.nome);
    this.gerarLegenda();
  }

  public btnIrPara(url: string){
    window.open(url, "_blank");
  }

  public onMapReady(map) {
    this.map = map;

    this.layerControl = L.control.layers(null, null, {
      collapsed: false}).addTo(map);

  }


  private async prepararListaShapeFiles(pag: InstitucionalInterno) {

    this.loading = true;

    const shapes = await this.shapeFileService.buscarShapesListagemMapa().toPromise();
    let firstDefault = true;

    for (const shapeid of pag.template04.shapeFiles) {
      let featureGroup = L.featureGroup();
      const shape =  shapes.find(x=> x.id === shapeid);
      this.shapeFileService.buscarFeaturesPorShapeId(shapeid).subscribe((resp) => {
        this.buscarMapaTematico(featureGroup, shapeid)
        this.adicionarShapesLayersMerged(featureGroup, resp);
        this.layerControl.addOverlay(featureGroup, shape.nome);
        if (firstDefault) {
          featureGroup.addTo(this.map);
          firstDefault = false;
        }
      });
    }

    this.loading = false;
  }

  ngOnChanges(changes): void {
    const pag = changes.pagina.currentValue;
    if (pag && pag.template04) {
      this.carregarTextos(pag);
      if (pag.template04.shapeFiles) {
        this.prepararListaShapeFiles(pag);
      }
    }
  }

  public carregarTextos(pag: InstitucionalInterno) {
    this.primeiroTexto = pag.template04.primeiroTexto;
    this.segundoTexto = pag.template04.segundoTexto;
  }

  private adicionarShapesLayersMerged(featureGroup: any, features: any[]) {
    if (features) {
      this.esconderMapa = false;
      let markerClusters = L.markerClusterGroup({
        maxClusterRadius: 30,
        iconCreateFunction: function(cluster) {
          var childCount = cluster.getChildCount();

          var c = " marker-cluster-";

          if (childCount > 0) {
            c += "large";
          }
          return new L.DivIcon({
            html: "<div><span>" + childCount + "</span></div>",
            className: "marker-cluster" + c,
            iconSize: new L.Point(30, 30)
          });
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });

      features.forEach(feature => {
        let clicouNoShape = false;   
        if (feature.geometry.type == 'Point' && feature.properties.radius != undefined) {
          const circle = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { radius: feature.properties.radius });
          circle.setStyle(this.stylelayer.defecto);
          circle.bindPopup(this.propriedadesToString(feature.properties));
          circle.on('mouseover', (e) => {
          e.target.openPopup();
          });
          circle.on('mouseout', (e) => {
            if(!clicouNoShape){
              e.target.closePopup();
            }
          });
          circle.on("click", (e) => {
            clicouNoShape = !clicouNoShape;
          });
          circle.addTo(featureGroup);
        } else if (feature.geometry.type == 'Point' && feature.properties.radius == undefined) {
          let options = {
            radius: 10,
            fillColor: "#E02020",
            color: "#C04040",
            fillOpacity: 0.75,
            weight: 1
          };
          let marker: circleMarker = circleMarker(
            [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], options,
            options
          );

          marker.bindPopup(this.propriedadesToString(feature.properties));
          marker.on('mouseover', (e) => {
            e.target.openPopup();
          });
          marker.on('mouseout', (e) => {
            if(!clicouNoShape){
              e.target.closePopup();
            }
          });
          marker.on("click", (e) => {
            clicouNoShape = !clicouNoShape;
          });

          markerClusters.addLayer(marker);
          markerClusters.addTo(featureGroup);
        } 
         else if(feature.geometry.type == 'MultiPoint' && feature.geometry.coordinates[0][1] && feature.geometry.coordinates[0][0]){           
          let options = {
            radius: 10,
            fillColor: "#E02020",
            color: "#C04040",
            fillOpacity: 0.75,
            weight: 1
          };
          let marker: circleMarker = circleMarker(
            [feature.geometry.coordinates[0][1], feature.geometry.coordinates[0][0]], options,
            options
          );

          marker.bindPopup(this.propriedadesToString(feature.properties));
          marker.on('mouseover', (e) => {
            e.target.openPopup();
          });
          marker.on('mouseout', (e) => {
            if(!clicouNoShape){
              e.target.closePopup();
            }
          });
          marker.on("click", (e) => {
            clicouNoShape = !clicouNoShape;
          });

          markerClusters.addLayer(marker);
          markerClusters.addTo(featureGroup);
        }
          else { 
          const optionsShapes = {
            color: '#000022',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
          };

          const options = $.extend(optionsShapes, feature.properties);
          const geoJson = geoJSON([feature], options);
          geoJson.setStyle(this.stylelayer.defecto);

          geoJson.bindPopup(this.propriedadesToString(feature.properties));

          geoJson.on('mouseover', (e) => {
            e.target.openPopup();
          });

          geoJson.on('mouseout', (e) => {
            if(!clicouNoShape){
              e.target.closePopup();
            }
          });

          geoJson.on("click", (e) => {
            clicouNoShape = !clicouNoShape;
          });

          geoJson.addTo(featureGroup);
        }
      });
    }
  }

  private propriedadesToString(properties: any): string {
    let aux = '';
    for (const proper in properties) {
      if (properties.hasOwnProperty(proper)) {
        const element = properties[proper];
        aux = aux + proper + ' : ' + element + ' <br> ';
      }
    }
    return aux;
  }


}
