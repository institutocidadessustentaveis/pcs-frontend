import { Component, OnInit, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { SubDivisao } from 'src/app/model/SubDivisao';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { PaisDTO, ProvinciaEstadoDTO } from '../cidade-form/cidade-form.component';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import { Cidade } from 'src/app/model/cidade';
import { CidadeService } from 'src/app/services/cidade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { PaisService } from 'src/app/services/pais.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { ImagemBoaPratica } from 'src/app/model/imagem-boa-pratica';
import * as L from 'leaflet';
import { latLng, tileLayer, geoJSON, circle, marker, circleMarker } from 'leaflet';
import { Arquivo } from 'src/app/model/arquivo';
import { environment } from 'src/environments/environment';
declare var $;

@Component({
  selector: 'app-editar-dados-cidade',
  templateUrl: './editar-dados-cidade.component.html',
  styleUrls: ['./editar-dados-cidade.component.css']
})
export class EditarDadosCidadeComponent implements OnInit {

  public fotoCidade: ImagemBoaPratica = new ImagemBoaPratica();

  public cidade: Cidade = new Cidade();
  subdivisao = new SubDivisao();
  displayedColumns = ['nome', 'remover'];
  dataSource = new MatTableDataSource<SubDivisao>();
  exibeCampos = false;

  paisesCombo: Array<PaisDTO> = new Array<PaisDTO>();
  provinciaEstadoCombo: Array<ProvinciaEstadoDTO> = new Array<ProvinciaEstadoDTO>();
  paisEscolhido: Number;
  estadoEscolhido: number;

  latitudeSelecionada: number;
  longitudeSelecionada: number;


  scrollUp: any;

  private map: L.Map;
  private layerControl;
  private overlays = {};
  private importFeatureGroup = L.featureGroup();

  private baseLayers = {
    MAPA: L.tileLayer(environment.MAP_TILE_SERVER, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 2,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    }),
  };

  public mapOptions = {
    zoom: 10,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227]),
    layers: [this.baseLayers.MAPA]
  };

  public drawOptions = {
    position: 'topright',
    draw: {
      polyline: false,
      circle: {
        shapeOptions: {
          color: '#aaaaaa'
        }
      }
    },
    edit: {
      featureGroup: this.importFeatureGroup,
      remove: {},
      edit: {
        selectedPathOptions: {
          stroke: false,
          color: '#e10010',
          weight: 500
        }
      }
    }

  };

  public layersControl = [
    circleMarker([ -15.03144, -53.09227], { radius: 10, fillColor: 'red', color: 'red', fillOpacity: 1, weight: 1 })
  ]


  constructor(public cidadeService: CidadeService, public paisService: PaisService,
              public activatedRoute: ActivatedRoute, public router: Router,
              public provinciaEstadoService: ProvinciaEstadoService,
              public domSanitizer: DomSanitizer,
              private element: ElementRef) {
                this.scrollUp = this.router.events.subscribe((path) => {
                  element.nativeElement.scrollIntoView();
                });
              }

  ngOnInit() {
    this.carregarComboPaises();
    this.initLayerControl();
    this.cidade.latitude = -15.03144
    this.cidade.longitude = -53.09227
  }

  private buscarCidade(): void {
    this.activatedRoute.params.subscribe(params => {
      const dadosPrefeitura = JSON.parse(localStorage.getItem('usuarioLogado')).dadosPrefeitura;
      if (dadosPrefeitura) {
        this.exibeCampos = true;
        this.cidadeService.buscarCidadeParaEditarViaPrefeitura(dadosPrefeitura.cidade.id).subscribe(response => {
          this.cidade = response;
          this.paisEscolhido = this.cidade.provinciaEstado.pais.id;
          this.estadoEscolhido = this.cidade.provinciaEstado.id;
          this.provinciaEstadoCombo = this.paisesCombo.find(x => x.id === this.cidade.provinciaEstado.pais.id).provinciaEstado;
          this.dataSource = new MatTableDataSource(this.cidade.subdivisoes);


          if (this.cidade.urlFotoCidade != null) {
            this.fotoCidade.safeUrl = `${environment.API_URL}${this.cidade.urlFotoCidade}`;
          }

          this.addMarkerOnMap(this.cidade.latitude, this.cidade.longitude);
          this.map.setView([this.cidade.latitude, this.cidade.longitude]);

          if (this.cidade.shapeZoneamento) {
            this.exibirShapeFileVetorial(this.cidade.shapeZoneamento);
            //this.fromGeoJson(this.cidade.shapeZoneamento);
          }
        });
      } else {
        this.router.navigate(['/institucional']);
        PcsUtil.swal().fire({
          title: 'Cidade',
          text: `Você não possui permissão de acesso!`,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
        }, error => { });
      }
    });
  }

  salvar() {
    this.editarCidade();
  }

  editarCidade() {
    let objeto: ProvinciaEstado = new ProvinciaEstado();
    this.toGeoJson();
    this.provinciaEstadoService.buscarProvinciaEstado(this.estadoEscolhido).subscribe(response => {
      this.cidade.provinciaEstado = response as ProvinciaEstado;
      this.cidadeService.editar(this.cidade).subscribe(response => {
        PcsUtil.swal().fire({
          title: 'Cidade',
          text: `Cidade ${this.cidade.nome} atualizada.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
        });
      });
    });
  }

  carregarComboPaises() {
    this.paisService.buscarTodosPaisEstado().subscribe(response => {
      this.paisesCombo = response;
      this.paisesCombo = response as Array<PaisDTO>;
      this.buscarCidade();
    });
  }

  async paisSelecionado(event: any) {
    this.provinciaEstadoCombo = this.paisesCombo.find(x => x.id === event).provinciaEstado;
  }

  changeEstado(event: number) {
    this.estadoEscolhido = event;
  }

  adicionarSubdivisao(event: any) {
    if (this.cidade.subdivisoes.length < 2) {
      this.cidade.subdivisoes.push(this.subdivisao);
      this.dataSource = new MatTableDataSource(this.cidade.subdivisoes);
      this.subdivisao = new SubDivisao();
    } else {
      PcsUtil.swal().fire({
        title: 'Cidade',
        text: `Maximo de duas Subdivisões por cidade!`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
    }
  }

  deletarSubdivisao(event: any) {
    this.cidade.subdivisoes.splice(this.cidade.subdivisoes.indexOf(event), 1);
    this.dataSource = new MatTableDataSource(this.cidade.subdivisoes);
  }

  addMarkerOnMap(latitude: number, longitude: number) {
    let options = { radius: 10, fillColor: 'red', color: 'red', fillOpacity: 1, weight: 1 }
    let marker: circleMarker = circleMarker([ latitude, longitude], options)

    this.layersControl = []
    this.layersControl.push(marker);
  }

  latitudeChange(newValue) {
    this.addMarkerOnMap(newValue, this.cidade.longitude);
    this.map.setView([newValue, this.cidade.longitude]);
  }

  longitudeChange(newValue) {
    this.addMarkerOnMap(this.cidade.latitude, newValue);
    this.map.setView([this.cidade.latitude, newValue]);
  }

  public processImage(eventInput: any) {
    const file: File = eventInput.target.files[0];
    const reader = new FileReader();
    reader.onload = this._handleReaderLoadedPrincipal.bind(this);
    reader.readAsBinaryString(file);
  }

  _handleReaderLoadedPrincipal(readerEvt) {
    this.fotoCidade = new ImagemBoaPratica();
    this.fotoCidade.conteudo = btoa(readerEvt.target.result);
    this.fotoCidade.safeUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + this.fotoCidade.conteudo);
    this.cidade.fotoCidade = this.fotoCidade.conteudo;
  }

  public deletarFotoCidade() {
    this.fotoCidade = null;
    this.cidade.fotoCidade = null;
  }

  public async processFilePlanoMetas(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      const arquivo = new Arquivo();
      arquivo.nomeArquivo = event.target.files[0].name;
      arquivo.extensao = reader.result.toString().split(',')[0];
      arquivo.conteudo = reader.result.toString().split(',')[1];

      this.cidade.arquivoPlanoMetas = arquivo;
    };
  }

  public deletarPlanoMetas() {
    this.cidade.arquivoPlanoMetas = null;
  }


  public async processFileRelatorioContas(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      const arquivo = new Arquivo();
      arquivo.nomeArquivo = event.target.files[0].name;
      arquivo.extensao = reader.result.toString().split(',')[0];
      arquivo.conteudo = reader.result.toString().split(',')[1];

      this.cidade.arquivoRelatorioContas = arquivo;
    };
  }

  public deletarRelatorioContas() {
    this.cidade.arquivoRelatorioContas = null;
  }

  private initLayerControl() {
    this.layerControl = L.control.layers(this.baseLayers, this.overlays, { collapsed: false });
  }

  public onMapReady(map: L.Map) {
    this.map = map;
    this.layerControl.addTo(this.map);
    this.importFeatureGroup.addTo(this.map);

    map.on('click', (e) => {
      this.addMarkerOnMap(e.latlng.lat, e.latlng.lng);

      this.cidade.latitude = e.latlng.lat;
      this.cidade.longitude = e.latlng.lng;
    });

  }

  public toGeoJson() {
    let geoJsonData = {
      "type": "FeatureCollection",
      "features": []
    }
    this.importFeatureGroup.getLayers().map(layer => {
      if (layer instanceof L.Circle) {
        let gjson = layer.toGeoJSON();
        gjson.properties.radius = layer.getRadius(); // add radius of circle shape to the properties field
        geoJsonData.features.push(gjson);
      }
      if (layer instanceof L.Polygon) {
        let gjson = layer.toGeoJSON();
        geoJsonData.features.push(gjson);
      }
    });
    this.cidade.shapeZoneamento = geoJsonData.features;
    return geoJsonData;
  }

  // public exibirShapeFileVetorial(features: Array<any>) {
  //   features.forEach(feature => {
  //     const options = {
  //       color: "#000022",
  //       weight: 1,
  //       opacity: 1,
  //       fillOpacity: 0.6
  //     };
  //     const geoJson = geoJSON([feature.geometry], options);
  //     this.importFeatureGroup.addLayer(geoJson);
  //   });
  // }

  public fromGeoJson(features) {
    features.map(feature => {
      if (feature.geometry.type == "Polygon") {
        let points = [];
        feature.geometry.coordinates[0].map(coordinate => {
          let point = [];
          // reverse geojson x,y to LatLng
          point.push(coordinate[1]);
          point.push(coordinate[0]);
          points.push(point);
        })
        L.polygon(points).addTo(this.importFeatureGroup);
      }
      if (feature.geometry.type == "Point" && feature.properties.radius != undefined) {
        L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { radius: feature.properties.radius }).addTo(this.importFeatureGroup);
      }
    });
    // adjust map
    const bounds = this.importFeatureGroup.getBounds();
    this.map.fitBounds(bounds);
  }

  public exibirShapeFileVetorial(features: Array<any>) {
      let _this = this;
      features.map(feature => {
        if (feature.geometry.type == 'MultiPolygon') {
          const optionsStyle = {
            color: '#666666',
            fillColor : '#c0c3ac',
            weight: 0,
            fillOpacity: .5,
            strokeOpacity: 0.5,
            fill : true,
          };
          const propriedades = feature.properties;
          feature.geometry.coordinates.forEach(function(shapeCoords, i) {
            const polygon = {type: 'Polygon', coordinates: shapeCoords};
            L.geoJson(polygon, {
              onEachFeature(feature, layer) {
                layer.setStyle(optionsStyle);
                layer.properties = propriedades;
                _this.importFeatureGroup.addLayer(layer);
              }
            });
          });

        }
        if (feature.geometry.type == 'Polygon') {
          const options = {
              color: '#666666',
              fillColor : '#c0c3ac',
              weight: 0,
              fillOpacity: .5,
              strokeOpacity: 0.5,
              fill : true,
          };
          const points = [];
          feature.geometry.coordinates[0].map(coordinate => {
            const point = [];
            point.push(coordinate[1]);
            point.push(coordinate[0]);
            points.push(point);
          });

          const polygon = L.polygon(points, options);
          polygon.properties = feature.properties;
          polygon.id = feature.id;
          polygon.addTo(this.importFeatureGroup);
        }
        if (feature.geometry.type.includes('Point') && feature.properties.radius != undefined) {
          const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
          const circle = L.circle([coordenadas[1], coordenadas[0]],  feature.properties.radius , { });
          circle.properties = feature.properties;
          circle.id = feature.id;
          circle.addTo(this.importFeatureGroup);
        }
        if (feature.geometry.type.includes('Point') && feature.properties.radius == undefined) {
          const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
          const marker: L.circleMarker = L.circleMarker([coordenadas[1], coordenadas[0]], {
            radius: 10,
            fillColor: '#c0c3ac',
            color: '#ffffff',
            fillOpacity: 1,
            weight: 0.3
          });
          marker.properties = feature.properties;
          marker.id = feature.id;
          marker.addTo(this.importFeatureGroup);
        } else if (feature.geometry.type.includes('LineString')) {
          const optionsLine = {
              color: '#666666',
              fillColor : '#c0c3ac',
              weight: 4,
              opacity: 0.5,
              draggable: true,
              transform: true,
            };
          const options = $.extend(optionsLine, feature.properties);

          const points = [];
          feature.geometry.coordinates.map(coordinate => {
            const point = [];
            point.push(coordinate[1]);
            point.push(coordinate[0]);
            points.push(point);
          });

          const polyline: L.polyline = L.polyline(points, options);

          polyline.properties = feature.properties;
          polyline.id = feature.id;
          polyline.addTo(this.importFeatureGroup);
        }
      });
  }


}
