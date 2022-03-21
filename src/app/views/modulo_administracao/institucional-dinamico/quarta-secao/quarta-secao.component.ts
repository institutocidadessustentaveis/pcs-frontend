import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as L from 'leaflet';
import { geoJSON, circleMarker , marker} from 'leaflet';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import "leaflet.markercluster";
import { InstitucionalDinamicoSecao4 } from 'src/app/model/institucional-dinamico-secao4';
import { GestureHandling } from "leaflet-gesture-handling";

declare var $;

@Component({
  selector: 'app-quarta-secao',
  templateUrl: './quarta-secao.component.html',
  styleUrls: ['./quarta-secao.component.css']
})

export class QuartaSecaoComponent implements OnInit {

 
  @Input() paginaChild: InstitucionalDinamicoSecao4;

  
  @Input()
  set quartaSecao(pagina: InstitucionalDinamicoSecao4 ){
      this.paginaChild = pagina;
  }
  get quartaSecao(){
      return this.paginaChild;
  }


  constructor(public shapeFileService: ShapeFileService,
              private prefeituraService: PrefeituraService) {
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
        color: '#3388ff',
        weight: 0,
        fillOpacity: .5,
        strokeOpacity: 0.5
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

  private getColor(d: any) {
    if (d == 1) {
      return '#FFC164';
    }

    if (d == 2) {
      return '#FF9C00';
    }

    if (d >= 3 && d <= 5) {
      return '#FF7701';
    }

    if (d >= 6 && d <= 7) {
      return '#E24800';
    }

    if (d >= 8 && d <= 10) {
      return '#B31F00';
    }

    if (d > 10) {
      return '#860200';
    }
    return '#FFC164';
  }

  ngOnInit() {
  }

  public btnIrPara(url: string){
    window.open(url, "_blank");
  }

  public onMapReady(map) {
    this.map = map;

    this.layerControl = L.control.layers(null, null, {
      collapsed: false}).addTo(map);

  }


  private async prepararListaShapeFiles(pag: any) {

    this.loading = true;

    const shapes = await this.shapeFileService.buscarShapesListagemMapa().toPromise();
    let firstDefault = true;

    for (const shapeid of pag.shapeFiles) {
      let featureGroup = L.featureGroup();
      const shape =  shapes.find(x=> x.id === shapeid);
      this.shapeFileService.buscarFeaturesPorShapeId(shapeid).subscribe((resp) => {
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
    if (changes && changes.quartaSecao) {
      const pag = changes.quartaSecao.currentValue;
      if (pag.shapeFiles) {
        this.prepararListaShapeFiles(pag);
      }
    }
  }



  private adicionarShapesLayersMerged(featureGroup: any, features: any[]) {
    if (features) {
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
        if (feature.geometry.type == 'Point' && feature.properties.radius != undefined) {
          const circle = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { radius: feature.properties.radius });
          circle.setStyle(this.stylelayer.defecto);
          circle.bindPopup(this.propriedadesToString(feature.properties));
          circle.on('mouseover', (e) => {
          e.target.openPopup();
          });
          circle.on('mouseout', (e) => {
            e.target.closePopup();
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
            e.target.closePopup();
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
            e.target.closePopup();
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
            e.target.closePopup();
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
