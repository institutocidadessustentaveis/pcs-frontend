import { SubDivisao } from 'src/app/model/SubDivisao';
import { TipoSubdivisao } from 'src/app/model/tipoSubdivisao';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { TipoSubdivisaoService } from 'src/app/services/tipoSubdivisao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as L from "leaflet";
import { latLng, tileLayer, geoJSON } from "leaflet";
import { environment } from 'src/environments/environment';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import * as shp from 'shpjs/dist/shp';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import 'leaflet-draw-drag';
import { SubdivisaoService } from 'src/app/services/subdivisao.service';
import { MatTableDataSource } from '@angular/material';
import { ShapeFileMerged } from 'src/app/model/shapeFileMerged';
import { ShapeItemService } from 'src/app/services/shape-item.service';
import * as omnivore from 'leaflet-omnivore/leaflet-omnivore';
import { LeafletUtilService } from 'src/app/services/leaflet-util.service';
declare const KML: any;

declare var $;

@Component({
  selector: 'app-lista-subdivisao',
  templateUrl: './lista-subdivisao.component.html',
  styleUrls: ['./lista-subdivisao.component.css']
})
export class ListaSubdivisaoComponent implements OnInit {
  private map: L.Map;
  private layerControl;
  private overlays = {};
  public loading = false;
  private objetosSelecionados = [];
  private objetosSelecionadosMap = new Map();
  private editableFeatureGroupSelecionados = L.featureGroup();

  public tipoArquivo;
  public arquivoZip: File;
  public usuario: Usuario;
  public canEditar = false;
  public canExcluir = false;
  public canCadastrar = false;
  public editarSubdivisao = false;
  public subdivisoes: SubDivisao[];
  public subdivisoesPai: SubDivisao[];
  public subdivisaoSelecionada : SubDivisao;
  public tiposSubdivisoes: TipoSubdivisao[];
  public salvarSelecionados:boolean = false;
  public editableFeatureGroup = L.featureGroup();
  public dataSource: MatTableDataSource<SubDivisao>;
  public listaTipoArquivo: string[] = ['.ZIP', '.KML'];
  public displayedColumns: string[] = ['nome', 'tipoSubdivisao','subdivisaoPai', 'acoes'];


  private stylelayer = {
    default: {
      color: '#666666',
      weight: 5,
      fillOpacity: .5,
      strokeOpacity: 0.5,
    },
    defecto: {
        weight: 0,
    },
    highlight: {
        weight: 5,
        color: '#0D8BE7',
        dashArray: '',
        fillOpacity: 0.7
    },
    selected: {
        color: '#00ff2f',
        weight: 9,
        opacity: 1
    },
    selectedPathOptions: {
      stroke : true,
      color : '#00ff2f',
      weight : 9,
      opacity : 1,
      dashArray: null,
      dashOffset: null,
      lineCap : 'null',
      lineJoin : null,
      clickable : true,
      noClip : true,
    },
    lineDefecto: {
      color: '#666666',
      weight: 5,
      opacity: 0.5
  },

};

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

  private customLabels() {
    L.drawLocal = {
      draw: {
        toolbar: {
          // #TODO: this should be reorganized where actions are nested in actions
          // ex: actions.undo  or actions.cancel
          actions: {
            title: 'Cancelar desenho',
            text: 'Cancelar',
          },
          undo: {
            title: 'Apagar último ponto desenhado',
            text: 'Apagar último ponto',
          },
          buttons: {
            polyline: 'Desenhar uma linha',
            polygon: 'Desenhar um polígono',
            rectangle: 'Desenhar um retângulo',
            circle: 'Desenhar um círculo',
            marker: 'Desenhar um marcador',
          },
          finish: {
            title: 'Desenho Finalizado',
            text: 'Finalizar',
          },
        },
        handlers: {
          circle: {
            tooltip: {
              start: 'Clique e arraste para desenhar um círculo.',
            },
          },
          circlemarker: {
            tooltip: {
              start: 'Marcador circular',
            },
          },
          marker: {
            tooltip: {
              start: 'Clique no mapa para posicionar um marcador.',
            },
          },
          polygon: {
            drawError:
              '<strong>Error:</strong> As arestas não podem se cruzar!',
            tooltip: {
              start: 'Clique para começar a desenhar um polígono.',
              cont: 'Clique para continuar desenhando.',
              end: 'Clique no primeiro ponto para terminar.',
            },
          },
          polyline: {
            error: '<strong>Erro:</strong> arestas não podem se cruzar!',
            tooltip: {
              start: 'Clique para desenhar linha.',
              cont: 'Clique para continuar desenhando.',
              end: 'Clique duas vezes para terminar.',
            },
          },
          rectangle: {
            tooltip: {
              start: 'Clique e arraste para desenhar um retângulo.',
            },
          },
          simpleshape: {
            tooltip: {
              end: 'Solte o botão do mouse para terminar.',
            },
          },
        },
      },
      edit: {
        toolbar: {
          actions: {
            save: {
              title: 'Concluir mudanças depois de editar/excluir',
              text: 'Concluir',
            },
            cancel: {
              title: 'Cancelar edição, descartar mudanças',
              text: 'Descartar mudanças',
            },
            clearAll: {
              title: 'Excluir todos',
              text: 'Excluir todos',
            },
          },
          buttons: {
            edit: 'Editar camada',
            editDisabled: 'Sem camadas para editar.',
            remove: 'Apagar desenho.',
            removeDisabled: 'Sem camadas para apagar.',
          },
        },
        handlers: {
          edit: {
            tooltip: {
              text: 'Arraste os quadrados, ou marcador para editar.',
              // subtext: "Clique cancelar para desfazer.",
            },
          },
          remove: {
            tooltip: {
              text: 'Clique em um desenho para remover.',
            },
          },
        },
      },
    };
  }

  public mapOptions = {
    zoom: 8,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    layers: [this.baseLayers.MAPA]
  };

  public drawOptions: any = {
    position: 'topright',
    draw: {
      polyline: {
        shapeOptions: {
          color: '#666666',
        }
      },
      circle: {
        shapeOptions: {
          color: '#666666',
          fillColor : '#c0c3ac',
          weight: 4,
          showRadius: false
        }
      },
      polygon: {
        shapeOptions: {
          color: '#666666',
          fillColor : '#c0c3ac',
          weight: 4
        }
      },
      rectangle:  {
        shapeOptions: {
          color: '#666666',
          fillColor : '#c0c3ac',
          weight: 4
        }
      }
    },
    edit: {
      featureGroup: this.editableFeatureGroup,
      remove: {},
      edit: true
    }
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private leafletUtil: LeafletUtilService,
    public shapeItemService: ShapeItemService,
    private shapeFileService: ShapeFileService,
    private subdivisaoService: SubdivisaoService,
    private tipoSubdivisaoService: TipoSubdivisaoService,
    ) { }

  ngOnInit() {
    this.buscarUsuarioLogado()
    this.initLayerControl();
    this.subdivisaoSelecionada = new SubDivisao();
    this.subdivisaoSelecionada.subdivisaoPai = new SubDivisao();
    //this.tipoArquivo = this.listaTipoArquivo[0];
  }


  public mostrarMensagemAjuda() {
    PcsUtil.swal().fire({
      // tslint:disable-next-line: max-line-length
      html: 'As áreas selecionadas são destacadas com um contorno verde.',
      type: 'question',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
    }, error => { });
  }

  private initLayerControl() {
    this.layerControl = L.control.layers(this.baseLayers, this.overlays, { collapsed: false });
  }

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

  public onMapReady(map: L.Map) {
    this.map = map;
    this.layerControl.addTo(this.map);
    this.customLabels();

    this.map.on('draw:created', (object) => {
      object.layer.on('click', e => {
        this.selecionarLayer(e)
      })
    })

    this.editableFeatureGroup.addTo(this.map);
  }

  public setVisualizacaoNaCidadeUsuario() {
    if (this.usuario.prefeitura != null && this.usuario.prefeitura.cidade != null) {
      this.setVisualizacaoLatLng(this.usuario.prefeitura.cidade.latitude, this.usuario.prefeitura.cidade.longitude)
    }
    else {
      this.setVisualizacaoLatLng(-15.03144, -53.09227)
    }
  }

  public setVisualizacaoLatLng(lat: number, long: number) {
    const latLng = L.latLng(lat, long)   
    this.map.setView(latLng)
  }

  public buscarUsuarioLogado() {
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;
      this.setVisualizacaoNaCidadeUsuario()
      this.buscarSubdivisaoTiposSubdivisoes()
    });
  }

  public buscarSubdivisaoTiposSubdivisoes() {
    this.subdivisaoService.buscarTodosPorCidadeId(this.usuario.prefeitura.cidade.id).subscribe(subdivisao => {
      this.subdivisoes = subdivisao;
      this.subdivisoesPai = subdivisao;
      this.dataSource = new MatTableDataSource<SubDivisao>(this.subdivisoes);
    }, error => {
    });

    this.tipoSubdivisaoService.buscarTodosPorPrefeituraId(this.usuario.prefeitura.id).subscribe(tipoSubdivisao => {
      this.tiposSubdivisoes = tipoSubdivisao;
    }, error => {
    });
    this.verificarRole();
  }

  public verificarRole() {
    if (this.usuario) {
      this.verificarRoleUsuario();
    }
  }

  public verificarRoleUsuario() {
    let usuario = JSON.parse(this.authService.getUsuarioLogado());
    if (usuario.roles.includes('ROLE_EDITAR_TIPO_SUBDIVISAO')) {
      this.canEditar = true;
    }
    if (usuario.roles.includes('ROLE_CADASTRAR_TIPO_SUBDIVISAO') || usuario.roles.includes('ROLE_EDITAR_TIPO_SUBDIVISAO')) {
      this.canCadastrar = true;
    }
    if (usuario.roles.includes('ROLE_EXCLUIR_TIPO_SUBDIVISAO')) {
      this.canExcluir = true;
    }
  }

  public carregarArquivoVetorial(event) {

    var files = event.target.files;

    if (files.length == 0) {
      return;
    }

    this.arquivoZip = files[0];

    this.handleZipFile(this.arquivoZip);

  }

  public carregarArquivoKml(event) {

    var files = event.target.files;

    if (files.length == 0) {
      return;
    }

    this.handleKmlFile(files[0]);

  }


  public handleKmlFile(file){

    var _this = this;

    var customLayer = L.geoJson(null, {
      onEachFeature: function (feature, layer) {
        var features = [];
        if(feature.geometry.type == 'GeometryCollection'){
          feature.geometry.geometries.forEach(geometry=>{

            let featureAux = {
              'id' : feature.id,
              'properties' : feature.properties,
              'geometry' : geometry };
            features.push(featureAux);

          });
        } else {
          features.push(feature);
        }

        _this.exbirShapeFile(features);
      }
    });


    var reader = new FileReader();
    reader.onload = function(){
        var runLayer = omnivore.kml(this.result, null, customLayer)
    };
    reader.readAsDataURL(file);
  }

  public handleZipFile(file){
    var _this = this;
    var reader = new FileReader();
    reader.onload = function(){
      if (reader.readyState != 2 || reader.error){
        return;
      } else {
        shp(reader.result).then(function(geojson) {

          _this.exbirShapeFile(geojson.features);

        });
      }
    };
    reader.readAsArrayBuffer(file);
  }

  public exbirShapeFile(features: any){
      var _this = this;
      features.map(feature => {

        if (feature.geometry.type == 'MultiPolygon') {
          const optionsStyle = {
            color: '#666666',
            fillColor : '#c0c3ac',
            weight: 1,
            fillOpacity: .5,
            strokeOpacity: 0.5,
            fill : true,
          };

          const propriedades = feature.properties;

          feature.geometry.coordinates.forEach((shapeCoords, i) => {
            const polygon = {type: 'Polygon', coordinates: shapeCoords};
            L.geoJson(polygon, {
              onEachFeature(feature, layer) {
                layer.setStyle(optionsStyle);
                layer.properties = propriedades;
                _this.editableFeatureGroup.addLayer(layer);
              }
            });
          });

        } else if (feature.geometry.type == 'Polygon') {
          const options = {
              color: '#666666',
              fillColor : '#c0c3ac',
              weight: 1,
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
          polygon.on('click', (e) => {
            this.selecionarLayer(e)
          })
          polygon.addTo(_this.editableFeatureGroup);
        } else if (feature.geometry.type.includes('Point') && feature.properties.radius != undefined) {
          const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
          const circle = L.circle([coordenadas[1], coordenadas[0]],  feature.properties.radius , { draggable: true });
          circle.properties = feature.properties;
          circle.id = feature.id;
          circle.on('click', (e) => {
            this.selecionarLayer(e)
          })

          circle.addTo(_this.editableFeatureGroup);
        } else if (feature.geometry.type.includes('Point') && feature.properties.radius == undefined) {
          const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
          const marker: L.circleMarker = L.circleMarker([coordenadas[1], coordenadas[0]], {
            radius: 10,
            fillColor: _this.getColor(1),
            color: '#ffffff',
            fillOpacity: 1,
            weight: 0.3
          });
          marker.properties = feature.properties;
          marker.id = feature.id;
          marker.on('click', (e) => {
            this.selecionarLayer(e)
          })
          marker.addTo(_this.editableFeatureGroup);

        } else if (feature.geometry.type.includes('MultiLineString')) {
          const optionsLine = {
              color: '#666666',
              fillColor : '#c0c3ac',
              weight: 4,
              opacity: 0.5,
            };
          const options = $.extend(optionsLine, feature.properties);
          feature.geometry.coordinates.map(coordinates => {
            coordinates.map(coordinate => {
              const coord1 = coordinate[1];
              const coord2 = coordinate[0];
              coordinate[0] = coord1;
              coordinate[1] = coord2;
            });
          });
          const polyline: L.polyline = L.polyline(feature.geometry.coordinates, options);

          polyline.properties = feature.properties;
          polyline.id = feature.id;
          polyline.on('click', (e) => {
            this.selecionarLayer(e)
          })
          polyline.addTo(_this.editableFeatureGroup);

        } else if (feature.geometry.type.includes('LineString')) {
          const optionsLine = {
              color: '#666666',
              fillColor : '#c0c3ac',
              weight: 4,
              opacity: 0.5,
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
          polyline.on('click', (e) => {
            this.selecionarLayer(e)
          })
          polyline.addTo(_this.editableFeatureGroup);
        }
        this.loading = false;
      })      
  }

  selecionarLayer(e) {
    let _this = this;
      let layer = e.target;
      const id = layer._leaflet_id;
      if ( this.objetosSelecionados.indexOf(id) === -1 ) {
        layer.optionsColorBefore = {};
        layer.optionsColorBefore.color = layer.options.color;
        layer.optionsColorBefore.weight = layer.options.weight;
        layer.optionsColorBefore.fillOpacity = layer.options.fillOpacity;
        layer.optionsColorBefore.strokeOpacity = layer.options.strokeOpacity;
        layer.optionsColorBefore.fillColor = layer.options.fillColor;
        layer.optionsColorBefore.opacity = layer.options.opacity;

        this.objetosSelecionados.push(id);
        layer.addTo(_this.editableFeatureGroupSelecionados);
        this.objetosSelecionadosMap.set(id, layer);
        if (this.leafletUtil.getLayerType(layer) == 'circle' ||
            this.leafletUtil.getLayerType(layer) == 'circlemarker' ||
            (!layer._layers && this.leafletUtil.getLayerType(layer) == 'polygon')) {
          const style: any = Object.assign({}, this.stylelayer.selected);
          if (layer.options.fillColor) {
            style.fillColor = layer.options.fillColor;
          } else {
            style.fillColor = layer.options.color;
          }
          layer.setStyle(style);
          if (layer.editing) {
            layer.editing.disable();
          }

        } else if (this.leafletUtil.getLayerType(layer) === 'LineString') {
            if (layer.options.color !== this.stylelayer.selected.color) {
              layer.setStyle(this.stylelayer.selected);
            } else {
              layer.setStyle(this.stylelayer.lineDefecto);
            }
            if (layer.editing) {
              layer.editing.disable();
            }

        } else if (this.leafletUtil.getLayerType(layer) !== 'marker') {
          const layers = layer._layers;
          const indices = Object.getOwnPropertyNames(layers);
          for (const i of indices) {
            const layer = layers[i];
            const style: any = Object.assign({}, this.stylelayer.selected);

            layer.optionsColorBefore = {};
            layer.optionsColorBefore = Object.assign({}, layer.options);           

            if (layer.options.fillColor) {
              style.fillColor = layer.options.fillColor;
            } else {
              style.fillColor = layer.options.color;
            }
            layer.setStyle(style);
            if (layer.editing) {
              layer.editing.disable();
            }
          }
        } else if (this.leafletUtil.getLayerType(layer) === 'marker') {
          const iconSelected = L.icon({
            iconUrl: '../../../../assets/marker-icon-selected.png'
          });
          layer.setIcon(iconSelected);
          if (layer.editing) {
            layer.editing.disable();
          }
        }
      } else {
        const indice = this.objetosSelecionados.indexOf(id);
        this.objetosSelecionados.splice(indice, 1);
        this.objetosSelecionadosMap.delete(id);

        if (this.leafletUtil.getLayerType(layer) == 'circle' ||
            this.leafletUtil.getLayerType(layer) == 'circlemarker' ||
            (!layer._layers && this.leafletUtil.getLayerType(layer) == 'polygon')) {
          layer.options = this.copiarPropriedadesOption(layer.optionsColorBefore, layer.options);
          layer.setStyle(layer.options);
          if (layer.editing) {
            layer.editing.disable();
          }

        } else if (this.leafletUtil.getLayerType(layer) === 'LineString') {
          layer.options = this.copiarPropriedadesOption(layer.optionsColorBefore, layer.options);
          layer.setStyle(layer.options);
          if (layer.editing) {
            layer.editing.disable();
          }
        } else if (this.leafletUtil.getLayerType(layer) === 'marker') {
          const iconDefault = L.icon({
            iconUrl: require('leaflet/dist/images/marker-icon.png')});
          layer.setIcon(iconDefault);
          if (layer.editing) {
            layer.editing.disable();
          }
        } else if (this.leafletUtil.getLayerType(layer) !== 'marker') {
          const layers = layer._layers;
          const indices = Object.getOwnPropertyNames(layers);
          for (const i of indices) {
            const layer = layers[i];
            layer.options = this.copiarPropriedadesOption(layer.optionsColorBefore, layer.options);            
            layer.setStyle(layer.options);
            if (layer.editing) {
              layer.editing.disable();
            }
          }
        } 
      }
  }

  copiarPropriedadesOption(optionsColorBefore, options){
    options.color = optionsColorBefore.color != null && optionsColorBefore.color != undefined ? optionsColorBefore.color : options.color;
    options.weight = optionsColorBefore.weight != null && optionsColorBefore.weight != undefined  ? optionsColorBefore.weight : options.weight;
    options.fillOpacity = optionsColorBefore.fillOpacity != null && optionsColorBefore.fillOpacity != undefined ? optionsColorBefore.fillOpacity : options.fillOpacity;
    options.strokeOpacity = optionsColorBefore.strokeOpacity != null && optionsColorBefore.strokeOpacity != undefined ? optionsColorBefore.strokeOpacity : options.strokeOpacity;
    options.fillColor = optionsColorBefore.fillColor != null && optionsColorBefore.fillColor != undefined ? optionsColorBefore.fillColor : options.fillColor;
    options.opacity = optionsColorBefore.opacity != null && optionsColorBefore.opacity != undefined ? optionsColorBefore.opacity : options.opacity;

    return options;
  }

  public buscarShapeFilePorId(idShapeFile : any){
    this.shapeFileService.buscarShapeFilePorId(idShapeFile).subscribe(shapeFile => {
      this.exbirShapeFile(shapeFile.shapes);
    });
  }

  public buscarShapeFileIdPorSubdivisaoId(idSubdivisao : number){
    this.shapeFileService.buscarShapeFileIdPorSubdivisaoId(idSubdivisao).subscribe(response => {
      const idShapeFile = response as any;
      if(idShapeFile){
        this.buscarShapeFilePorId(idShapeFile);
      }else{
        this.loading = false;
      }
    });
  }

  public editar(subdivisao: SubDivisao){
    this.editarSubdivisao =  true;

    this.editableFeatureGroup.clearLayers();

    this.loading = true;
    this.subdivisaoSelecionada = subdivisao;
    this.buscarShapeFileIdPorSubdivisaoId(this.subdivisaoSelecionada.id);

    this.subdivisoesPai = this.subdivisoes.filter(element => {
      return element.id != subdivisao.id;
    });

    this.subdivisoesPai.filter(element => {
       if(element.id == subdivisao.subdivisaoPai.id){
         this.subdivisaoSelecionada.subdivisaoPai = element;
       };
    });

    this.tiposSubdivisoes.filter(element => {
      if(element.id == subdivisao.tipoSubdivisao.id){
        this.subdivisaoSelecionada.tipoSubdivisao = element;
      };
    });
    this.tipoArquivo = null;

  }

  public excluir(id: number): void {

    this.subdivisaoService.buscarTodasSubdivisaoRelacionadasComSubdivisaoPai(id).subscribe(response => {
      const lista = response as SubDivisao[];

      let output = lista.map((i) => {
        return `${i.nome}<br>`;
     });


      if(lista && lista.length > 0){
        PcsUtil.swal().fire('Não foi possível excluir a Subdivisão', `Esta relacionada com:<br>${output}`, 'warning');
      }else{
        const swalWithBootstrapButtons = PcsUtil.swal().mixin({
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: true,
        });

        PcsUtil.swal().fire({
          title: 'Deseja Continuar?',
          text: `Deseja realmente excluir a SubDivisão selecionada?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          reverseButtons: false
        }).then((result) => {
          if (result.value) {
            this.subdivisaoService.excluirSubdivisao(id).subscribe(response => {
              PcsUtil.swal().fire('Excluído!', `SubDivisão excluída.`, 'success');
              this.buscarSubdivisaoTiposSubdivisoes();
            });
          }
        });
      }
    }, error => {
    });

  }

  public salvarVetorial() {
    this.loading = true;

    delete this.subdivisaoSelecionada.tipoSubdivisao.prefeitura;
    this.subdivisaoSelecionada.cidade = this.usuario.prefeitura.cidade.id;

    this.shapeFileService.salvarVetorialSubDivisao(this.subdivisaoSelecionada, this.arquivoZip).subscribe(response => {
      this.loading = false;
      this.router.navigate(['/subdivisao/administracao-subdivisao']);
    }, error => {
      this.loading = false;
      PcsUtil.swal().fire('Não foi possível cadastrar', `${error.error.message}`, 'error');
    });
  }

  public limpar(){
    this.subdivisaoSelecionada = new SubDivisao();
    this.salvarSelecionados = false;
    this.editableFeatureGroup.clearLayers();
    this.editarSubdivisao = false;
  }

  validaObjetosDesenhados() {
    if (this.editableFeatureGroup && this.editableFeatureGroup.getLayers() && this.editableFeatureGroup.getLayers().length <= 0) {
      PcsUtil.swal().fire({
        title: 'A subdivisao precisa ter pelo menos um objeto desenhado.',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
      return false;
    }
    return true;
  }

  validaObjetosSelecionados() {
    if (this.objetosSelecionados.length <= 0 && this.objetosSelecionadosMap.size <= 0) {
      this.loading = false;
      PcsUtil.swal().fire({
        title: 'A subdivisão precisa ter pelo menos um objeto selecionado.',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
      return false;
    }
    return true;
  }

  salvarObjetosSelecionados(features: any) {
      features = this.populateFeatures(this.editableFeatureGroupSelecionados, features);
      this.editableFeatureGroupSelecionados.clearLayers();
      this.subdivisaoSelecionada.features = features;
      this.inserirSubdivisaoShapeFile(this.subdivisaoSelecionada)

  }

  public salvarSubdivisaoShapeFile() {
    if (this.validaObjetosDesenhados() === true) {
      this.loading = true;
  
      delete this.subdivisaoSelecionada.tipoSubdivisao.prefeitura;
      this.subdivisaoSelecionada.cidade = this.usuario.prefeitura.cidade.id;
  
      let  features = null;
      if (this.salvarSelecionados) {     
        if (this.validaObjetosSelecionados() === true) {
          this.salvarObjetosSelecionados(features)
        } 
      } else {
        if (this.editableFeatureGroup && this.editableFeatureGroup.getLayers().length > 0) {
          features = this.populateFeatures(this.editableFeatureGroup, features);
          this.editableFeatureGroup.clearLayers();
        }
        this.subdivisaoSelecionada.features = features;
        this.inserirSubdivisaoShapeFile(this.subdivisaoSelecionada)
      } 
      this.tipoArquivo = null;
    } 
  }

  private inserirSubdivisaoShapeFile(subdivisaoSelecionada) {
    this.shapeItemService.inserirSubdivisaoShapeFile(subdivisaoSelecionada).subscribe(response => {
      this.limpar();
      this.loading = false;
      if (response.shapePertenceAPrefeitura && !response.temIntersecacoNaAreaDaPrefeitura) {
        this.mostrarAlertaShapeForaDoMunicipio();
      } else {
        this.mostrarAlertaShapeCadastrado(response.idShapeFile);
      }
      this.buscarSubdivisaoTiposSubdivisoes();
    }, error => {
      this.loading = false;
      this.mostrarAlertaShapeForaDoMunicipio();
      this.buscarSubdivisaoTiposSubdivisoes();
    });
  }

  private populateFeatures(layersMerged: any , features: any): any {
    if (features) {
      return features.concat(this.toGeoJsonPopulateFeatures(layersMerged));
    } else {
      return this.toGeoJsonPopulateFeatures(layersMerged);
    }
  }

  public toGeoJsonPopulateFeatures(layersMerged: any) {
    const geoJsonData = {
      type: 'FeatureCollection',
      features: []
    };
    layersMerged.getLayers().map(layer => {
      const gjson = layer.toGeoJSON();
      if (layer.properties) {
        gjson.properties = layer.properties;
      }
      gjson._leaflet_id = layer._leaflet_id;
      if (layer instanceof L.Circle) {
        gjson.properties.radius = layer.getRadius();
        geoJsonData.features.push(gjson);
      } else if ( gjson.type === 'FeatureCollection') {
        if (gjson.features[0].properties) {
          gjson.features[0].properties.cidade = layer.options.cidade;
        }
        if (layer.options.qtdBP) {
          gjson.features[0].properties.qtdBP = layer.options.qtdBP;
        }
        if (layer.options.variavel) {
          gjson.features[0].properties.variavel = layer.options.variavel;
        }
        if (layer.options.valorTexto) {
          gjson.features[0].properties.valorTexto = layer.options.valorTexto;
        }
        if (layer.options.indicador) {
          gjson.features[0].properties.indicador = layer.options.indicador;
        }
        if (layer.options.valor) {
          gjson.features[0].properties.valor = layer.options.valor;
        }
        gjson.features[0]._leaflet_id = layer._leaflet_id;
        geoJsonData.features.push(gjson.features[0]);
      } else {

        if (layer.options.cidade) {
          gjson.properties.cidade = layer.options.cidade;
        }
        if (layer.options.qtdBP) {
          gjson.properties.qtdBP = layer.options.qtdBP;
        }
        if (layer.options.variavel) {
          gjson.properties.variavel = layer.options.variavel;
        }
        if (layer.options.valorTexto) {
          gjson.properties.valorTexto = layer.options.valorTexto;
        }
        if (layer.options.indicador) {
          gjson.properties.indicador = layer.options.indicador;
        }
        if (layer.options.valor) {
          gjson.properties.valor = layer.options.valor;
        }
        geoJsonData.features.push(gjson);
      }

    });

    return geoJsonData.features;
  }

  public mostrarAlertaShapeForaDoMunicipio() {
    PcsUtil.swal().fire({
      title: 'Subdivisão fora dos limites do município',
      text: 'A subdivisão não foi salva, ela precisa se encontrar dentro dos limites do município.',
      type: 'error',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
      this.editableFeatureGroup.clearLayers();
    }, error => { });
  }

  public mostrarAlertaShapeCadastrado(idShapeFile: any) {
    PcsUtil.swal().fire({
      title: 'Nova camada',
      text: `Nova camada cadastrada`,
      type: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
      this.editableFeatureGroup.clearLayers();

    }, error => { });
}
}
