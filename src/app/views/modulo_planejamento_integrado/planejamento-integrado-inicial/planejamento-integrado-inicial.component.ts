import { AuthService } from 'src/app/services/auth.service';
import { Titulo } from './../../../model/titulo';
import { LatLong } from 'src/app/model/lat-long';
import { CidadeComBoaPratica } from '../../../model/cidadeComBoaPratica';
import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild, Host } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import * as L from 'leaflet';
import { VariavelPreenchidaMapa } from 'src/app/model/variavelPreenchidaMapa';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { PcsUtilSVG } from 'src/app/services/pcs-util-svg.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { MVT } from 'src/app/model/mvt';
import { MVTfields } from 'src/app/model/mvt-fields';
import { BoaPraticaItem } from 'src/app/model/boaPraticaItem';
import { FiltroCidadesComBoasPraticas } from 'src/app/model/filtroCidadesComBoasPraticas';
import { IndicadorPreenchidoMapa } from 'src/app/model/indicadorPreenchidoMapa';
import { geoJSON, icon, marker } from 'leaflet';
import { environment } from 'src/environments/environment';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { saveAs } from 'file-saver';
import { ShapeItemService } from 'src/app/services/shape-item.service';
import 'leaflet.markercluster';
import 'leaflet-contextmenu';
import 'leaflet-path-drag';
import 'leaflet-draw-drag';
import 'leaflet-path-transform';
import { ShapeFileMerged } from 'src/app/model/shapeFileMerged';

import { ShapeAtributo } from 'src/app/model/shape-atributo';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { EditarAtributosComponent } from './editar-atributos/editar-atributos.component';
import 'leaflet.control.layers.tree';
import { ShapeFile } from 'src/app/model/shapeFile';
import LatLon from 'geodesy/latlon-ellipsoidal-vincenty';
import { MatSidenav } from '@angular/material/sidenav';
import { CriarPoligonoComponent } from './criar-poligono/criar-poligono.component';
import { PoligonoDados } from 'src/app/model/poligono-dados';
import { MatIconRegistry, MatSnackBar } from '@angular/material';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { LeafletUtilService } from 'src/app/services/leaflet-util.service';
import { LassoHandler} from 'leaflet-lasso/dist/leaflet-lasso.umd';
import 'leaflet.browser.print/dist/leaflet.browser.print';
import { CriarLegendaComponent } from './criar-legenda/criar-legenda.component';
import { EditarPropriedadesComponent } from './editar-propriedades/editar-propriedades.component';

import * as XLSX from 'xlsx';

import 'leaflet-measure/dist/leaflet-measure.pt_BR';
import { EditarPropriedadesTituloComponent } from './editar-propriedades-titulo/editar-propriedades-titulo.component';

import * as formula from 'hot-formula-parser';

import 'leaflet.vectorgrid/dist/Leaflet.VectorGrid';
import { IntegracaoService } from 'src/app/services/integracao.service';
import { LeafletUtil } from '@asymmetrik/ngx-leaflet';
import 'leaflet-snap';
import 'leaflet-geometryutil';
import domtoimage from 'dom-to-image';

import * as turf from '@turf/turf';
import { LeftTabStop } from 'docx';
import { Subscription } from 'rxjs';
import { MapaTematicoService } from 'src/app/services/mapa-tematico.service';
import { MapaTematico } from 'src/app/model/mapaTematico';
import { ClasseMapaTematico } from 'src/app/model/classeMapaTematico';
import { DadosDownload } from 'src/app/model/dados-download';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { LeafletMarkerClusterDirective } from '@asymmetrik/ngx-leaflet-markercluster';
import { type } from 'os';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { RelatorioVisualizacaoCartograficaService } from 'src/app/services/relatorio-visualizacao-cartografica.service';
import "leaflet-mouse-position";
import { lastDayOfISOYear } from 'date-fns';
import { ShapefileDetalheDTO } from 'src/app/model/shapefileDetalheDTO';
import moment from 'moment';
import * as chroma from 'chroma-js';
import { AjusteGeralService } from 'src/app/services/ajuste-geral.service';

var cloneLayer = require('leaflet-clonelayer');

declare var $;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

interface LassoHandlerFinishedEventData {
  latLngs: L.LatLng[];
  layers: L.Layer[];
}

interface LassoHandlerOptions {
  polygon?: L.PolylineOptions;
  intersect?: boolean;
}


@Component({
  selector: 'app-planejamento-integrado-inicial',
  templateUrl: './planejamento-integrado-inicial.component.html',
  styleUrls: ['./planejamento-integrado-inicial.component.css', '../../../../animate.css', './planejamento-integrado-inicial.component.scss'],
})



export class PlanejamentoIntegradoInicialComponent implements OnInit  {
  @ViewChild('sidenav') sidenav: MatSidenav;

  constructor(public shapeFileService: ShapeFileService,
              private router: Router, private element: ElementRef,
              public activatedRoute: ActivatedRoute,
              private _scrollToService: ScrollToService,
              public shapeItemService: ShapeItemService,
              private changeDetectorRefs: ChangeDetectorRef,
              public dialog: MatDialog,
              private iconService: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private leafletUtil: LeafletUtilService,
              private titleService: Title,
              private authService: AuthService,
              private integracaoService: IntegracaoService,
              private mapaTematicoService: MapaTematicoService,
              private dadosDownloadService: DadosDownloadService,
              private usuarioService: UsuarioService,
              private relatorioVisualizaoCartografica: RelatorioVisualizacaoCartograficaService,
              private ajusteGeralService: AjusteGeralService,
              private _snackBar: MatSnackBar) {
     this.scrollUp = this.router.events.subscribe(() => {
      element.nativeElement.scrollIntoView();
     });
     this.iconService.addSvgIcon(
      'json',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/code-json.svg'));
     this.iconService.addSvgIcon(
      'file-export',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/file-export.svg'));
     this.iconService.addSvgIcon(
        'excel',
        this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/file-excel-outline.svg'));
     this.iconService.addSvgIcon(
          'shape',
          this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/shape-polygon-plus.svg'));
     this.iconService.addSvgIcon(
          'table-merge',
          this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/table-merge-cells.svg'));
  }


  public latitude;
  public longitude;

  public loading = false;

  public painelFiltrosBoasPraticas = false;
  public painelFiltroVariaveis = false;
  public painelCatalogoShapes = false;
  public painelDefinirLatLong = false;
  public painelFiltroIndicadores = false;
  public painelImportarPontos = false;
  public sidenavOpen = false;

  private legendaTemperatura;
  private legendaPrecipitacao;
  private legendaQualidadeAgua;
  private legendaSubBaciaHidrografica;
  private legendaVulnerabilidadeInundacao;
  private legendaPopulacaoGrade5km;
  private legendaEntornoGrade1km;
  private legendaBioma;
  private legendaUsoCoberturaTerra;


  public boasPraticasCarregadasNoMapa = false;
  public variaveisCarregadasNoMapa = false;
  public indicadoresCarregadosNoMapa = false;

  public listBoasPraticas: BoaPraticaItem[];
  public listaContinentes: ItemCombo[];
  public listaPaises: ItemCombo[];
  public listaProvinciasEstados: ItemCombo[];
  public listaCidades: ItemCombo[];
  public listaPaisesBkp: ItemCombo[];
  public listaProvinciasEstadosBkp: ItemCombo[];
  public listaCidadesBkp: ItemCombo[];
  public listaEixos: ItemCombo[];
  public listaOds: ItemCombo[];
  public listaMetaOds: ItemCombo[];
  public listaOdsBkp: ItemCombo[];
  public listaMetaOdsBkp: ItemCombo[];
  public filtroCidadesComBoasPraticas: FiltroCidadesComBoasPraticas = new FiltroCidadesComBoasPraticas();

  public ngxScrollToDestination: string;

  private map: L.Map;
  private overlays = {};
  private layerscontrol: any;
  

  public boasPraticasFeatureGroup = L.featureGroup();
  private legendaBoaPratica: any;

  public variaveisFeatureGroup = L.featureGroup();
  private legendaVariavel: any;

  public indicadoesFeatureGroup = L.featureGroup();
  public listaIndicadorPreenchidoMapa;
  public indicadorSelecionado;

  private scrollUp: any;

  private layersGroup = L.layerGroup();
  private zoomControl: any = {};


  private boasPraticasComPontos = true;
  private idsCidadesBoasPraticas = null;

  private variaveisComPontos = true;
  private idsCidadesVariaveis = null;

  private indicadoresComPontos = true;
  private idsCidadesIndicadores = null;

  private layersMerged = null;

  private shapeFileParaEditar = new ShapeFile();
  public atributosParaEditar: Array<ShapeAtributo> = [];
  public shapeParaEditar: any;
  public modoDeletar = false;
  public modoDeletarShape = false;

  private polygonCreateLng: any = null;
  private polygonCreateLat: any = null;

  private poligonosDados: Array<PoligonoDados> = [new PoligonoDados()];
  private itemSelecionado: any = null;

  public modoEdicao = false;
  public modoImpressao = false;
  private apagarShapeBtn;
  private ctrlMenu;
  private ctrlExport;
  private ctrlTree;
  private ctrlModoImpressao;
  private ctrlInserirTituloImpressao;
  private ctrlInserirLegendaImpressao;
  private ctrlExportarAtributosECoordenadas;
  private modoHabilitarImpressao;
  private modoSairImpressao = null;
  private modoEditarShapeBtn = null;
  private modoSairEditarShapeBtn = null;
  private idShapeFileEditar = null;
  public tituloShapeFileEditar = '';
  private lasso;
  private ctrlSelecaoShapes;
  private ctrlCancelarSelecaoShapes;
  private legendaEditavel;
  private ctrlModoMedida;
  private ctrlFiltro;
  public ctrlMenuSelecionado = false;
  public ctrlFiltroSelecionado = false;
  private ctrlLimparSelecaoShapes;

  public currentDate = moment().toDate();

  dadosDownload = new DadosDownload;
  usuario: Usuario;

  private tituloCamadaParams;
  inscricao: Subscription;

  private exibirAutoCamadasConfirmacao =  false;
  private exibirAutoCamadas =  false;

  nomeIndicadorRelatorioVisualizacao: string;
  idCidadeRelatorioVisualizacao: Number;

  public listaTiposAtributos = new Array<any>();

  public listaCidadeRegiaoMVTColor = new Array<{cidade?: string, color?: string}>();
  public listaUnidadesConservacaoMVTColor = new Array<{codigoCnu?: string, color?: string}>();

  private dadosLegenda = {
    grades : [''],
    labels : [''],
    classesTematicas: [],
    camadasComLegenda: [{
      legenda: '',
      cor: '',
      nomeCamada: '',
    }],
  };

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
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      maxNativeZoom: 23,
      maxZoom: 20,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    }),
    FundoBranco: L.tileLayer(environment.MAP_TILE_BLANK, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 2,
      maxNativeZoom: 23,
      maxZoom: 23,
      crossOrigin: true
    })
  };

  public options = {
    zoom: 4,
    zoomControl: false,
    gestureHandling: false,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: L.latLng([-15.03144, -53.09227]),
    zoomSnap: 0.25,
    //zoomDelta: 0.25,
    //wheelPxPerZoomLevel: 50,
    layers: [this.baseLayers.Mapa]
  };

  public editableFeatureGroup = L.featureGroup();
  private editableFeatureGroupAux = L.featureGroup();
  public pontosImportadosFeatureGroup = L.featureGroup();
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
      edit: false
    },
  };

  baseTree = {
  };

  baseMaps = {
    "Mapa": this.baseLayers.Mapa,
    "Satélite": this.baseLayers.Satélite,
    "Fundo em Branco": this.baseLayers.FundoBranco
  };

  overlaysTree = [
    {
      label: '<b>Camadas em exibição</b>',
      children: []
    }, {
      label: '<b>Camadas PCS</b>',
      children: [],
      collapsed: true
    }, {
      label: '<b>Camadas Prefeitura</b>',
      children: [],
      collapsed: true
    }, {
      label: '<b>Camadas CGEE/OICS</b>',
      children: [],
      collapsed: true
  }];

  menuShapesLayer = [];

  menuShapesLayerCGEE = [];

  shapesColors = {};

  shapesSelecionados = [];
  shapesSelecionadosPorSelecaoArea = [];

  objetosSelecionados = [];
  objetosSelecionadosMap = new Map();

  classesMapaTematico: ClasseMapaTematico[] = [];

  stylelayer = {
    default: {
      color: '#666666',
      weight: 3,
      fillOpacity: .5,
      strokeOpacity: 0.5,
    },
    defecto: {
      color: '#666666',
      weight: 5,
      fillOpacity: .5,
      strokeOpacity: 0.5,
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
      // fill : true,
      // fillColor : '#3388ff',
      // fillOpacity : 0.5,
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
  marcadorLatLng = null;

  criandoPoligonoAzimute = false;
  criandoTitulo = false;
  tituloParaAdicionar = new Titulo();
  public nomesShapesSelecionados;
  public tituloImpressaoMapa;
  atributos = new Set();
  tabelaAtributos = [];
  keysShapeFiles = [];
  formulaParser = new formula.Parser();
  centroides: any = [];
  estaLogado: boolean = false;

  ngOnInit() {
    this.titleService.setTitle(`Planejamento Integrado - Cidades Sustentáveis`);

    this.inscricao = this.activatedRoute.queryParams.subscribe(
      (queryParams: any) => {
        this.tituloCamadaParams = queryParams['camada'];
      }
    );

    this.estaLogado = this.authService.isAuthenticated();
      if(this.estaLogado == true) {
        this.buscarDadosUsuariosLogadosDownload();
      } 
  }
    

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  private initLayerControl() {

    L.Control.Layers2 = L.Control.Layers.extend({
      _initLayout: function () {
        L.Control.Layers.prototype._initLayout.call(this);

  
        let ownclasses = this._layersLink.getAttribute('class');
        this._layersLink.setAttribute('class', 'leaflet-control-layers-toggle leaflet-control-layers-toggle-2');
      }
    });

    L.control.layers2 = function (...args) {
      return new L.Control.Layers2(...args);
    };


    this.layerscontrol = L.control.layers2(this.baseMaps, this.overlays, {collapsed: true}).addTo(this.map);
    this.layersGroup.addTo(this.map);
  }

  zoomIn() {
    this.map.setZoom(this.map.getZoom() + 1);
  }

  zoomOut() {
    this.map.setZoom(this.map.getZoom() - 1);
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

  private buscarCamadasCGEE() {

    let _this = this;

    const vectorTileOptions = {
      interactive: true,
      // getFeatureId: function(f) {
      //   console.log(f.properties);
			// 	return f.properties.wb_a3;
			// },
      rendererFactory: L.canvas.tile,
      vectorTileLayerStyles: {
          temperatura(properties, zoom) {
            const level = properties.vlr_temper;
            let color = '#FFFFFF';
            if (level == 1) {color = '#9F98FF'; }
            if (level == 2) {color = '#AC8DD8'; }
            if (level == 3) {color = '#BA81B1'; }
            if (level == 4) {color = '#C7768A'; }
            if (level == 5) {color = '#D46A63'; }
            if (level == 6) {color = '#D3504A'; }
            return {
                    weight: 0,
                  fillColor: color,
                  fillOpacity: 1,
                  fill: true
              };
          },

          preciptacao(properties, zoom) {
            const level = properties.vlr_precip;
            let color = '#FFFFFF';
            if (level == 1) {color = '#FFFAD5'; }
            if (level == 2) {color = '#E4EBDC'; }
            if (level == 3) {color = '#C9DCE3'; }
            if (level == 4) {color = '#AECDEA'; }
            if (level == 5) {color = '#93BEF1'; }
            if (level == 6) {color = '#78B0F8'; }
            return {
                    weight: 0,
                  fillColor: color,
                  fillOpacity: 1,
                  fill: true
              };
          },

          qualidade_da_agua(properties, zoom) {
            const level = properties.vlr_me1iqa;
            let color = '#FFFFFF';
            if (level < 19) {color = '#d7191c'; }
            if (level >= 19) {color = '#fdae61'; }
            if (level >= 36) {color = '#ffffbf'; }
            if (level >= 51) {color = '#abd9e9'; }
            if (level >= 79) {color = '#00cdf4'; }
            return {
                  weight: 1,
                  fillColor: color,
                  fillOpacity: 1,
                  fill: true,
                  color: '#000000',
                  radius: 7,
              };
          },

          sub_bacia_hidrografica(properties, zoom) {
            let color = '#93d0fb';
            return {
                  weight: 1,
                  fillColor: color,
                  fillOpacity: 1,
                  fill: true,
                  color: '#000000'
              };
          },

          vulnerabilidade_a_inundacao(properties, zoom) {
            const level = properties.vlr_vulner;
            let color = '#000000';
            if (level == "Baixa") {color = '#b2b2b2'; }
            if (level == "Média") {color = '#ff8080'; }
            if (level == "Alta") {color = '#a50f15'; }
  
            return {
                  weight: 2,
                  fillColor: color,
                  fillOpacity: 1,
                  fill: true,
                  color: color
              };
          },

          populacao_grade_5_km(properties, zoom) {
            const level = properties.vlr_densidade_pop_km2;
            let color = '#FFFFFF';
            if (level < 330) {color = '#b2b2b2'; }
            if (level >= 330 && level < 1400 ) {color = '#ffbfbf'; }
            if (level >= 1400 && level < 3500 ) {color = '#ff8080'; }
            if (level >= 3500 && level < 9000 ) {color = '#ff4040'; }
            if (level >= 9000) {color = '#a80000'; }
  
            return {
                  weight: 0,
                  fillColor: color,
                  fillOpacity: 1,
                  fill: true,
              };
          },

          entorno_grade_1km(properties, zoom) {
            const level = properties.prop;
            let color = '#FFFFFF';
            if (level < 20) {color = '#b30000'; }
            if (level >= 20) {color = '#e34a33'; }
            if (level >= 40) {color = '#fc8d59'; }
            if (level >= 60) {color = '#fdcc8a'; }
            if (level >= 80) {color = '#fef0d9'; }
            return {
                    weight: 0,
                  fillColor: color,
                  fillOpacity: 1,
                  fill: true
              };
          },

          bioma(properties, zoom) {
            const level = properties.vlr_nom_bi;
            let color = '#FFFFFF';
            if (level == "Amazônia") {color = '#6A9369'; }
            if (level == "Caatinga") {color = '#C1C690'; }
            if (level == "Cerrado") {color = '#99A278'; }
            if (level == "Mata Atlântica") {color = '#C1E2BE'; }
            if (level == "Pampa") {color = '#92BA94'; }
            if (level == "Pantanal") {color = '#467a73'; }
  
            return {
                    weight: 0,
                  fillColor: color,
                  fillOpacity: 1,
                  fill: true
              };
          },

          uso_cobertura_terra(properties, zoom) {
            const level = properties.vlr_classe;
            let color = '#FFFFFF';
            if (level == 1) {color = '#fe0000'; }
            if (level == 2) {color = '#ebe628'; }
            if (level == 3) {color = '#cd8900'; }
            if (level == 4) {color = '#d4e885'; }
            if (level == 5) {color = '#00915a'; }
            if (level == 6) {color = '#73a800'; }
            if (level == 7) {color = '#beb8f4'; }
            if (level == 8) {color = '#c890a9'; }
            if (level == 9) {color = '#d69963'; }
            if (level == 10) {color = '#8cffff'; }
            if (level == 11) {color = '#2d99da'; }
            if (level == 12) {color = '#888888'; }
            return {
                    weight: 0,
                  fillColor: color,
                  fillOpacity: 1,
                  fill: true
              };
          },

          unidades_conservacao(properties, zoom) {
            if(_this.listaUnidadesConservacaoMVTColor.filter(item => item.codigoCnu === properties.codigo_cnu).length == 0) {
              const unidade = {codigoCnu: properties.codigo_cnu, color: chroma.random().hex()}
              _this.listaUnidadesConservacaoMVTColor.push(unidade);
            
              return {
                    color: '#666666',
                    fillColor : unidade.color,
                    weight: 2,
                    fillOpacity: 1,
                    fill: true
              };
            } else {
              const objRef = _this.listaUnidadesConservacaoMVTColor.find(item => item.codigoCnu === properties.codigo_cnu);
            
              return {
                color: '#666666',
                fillColor : objRef.color,
                weight: 2,
                fillOpacity: 1,
                fill: true
              };
            }
          },

         
          cidade_regiao(properties, zoom) {
            //console.log('properties',properties)
            if(_this.listaCidadeRegiaoMVTColor.filter(item => item.cidade === properties.nome_cr).length == 0) {
              const cidadeColor = {cidade: properties.nome_cr, color: chroma.random().hex()}
              _this.listaCidadeRegiaoMVTColor.push(cidadeColor);

              return {
                color: '#666666',
                fillColor : cidadeColor.color,
                weight: 2,
                fillOpacity: 1,
                fill: true
              };
            } else {
              const objRef = _this.listaCidadeRegiaoMVTColor.find(item => item.cidade === properties.nome_cr);

              return {
                color: '#666666',
                fillColor : objRef.color,
                weight: 2,
                fillOpacity: 1,
                fill: true
              };
            }
            
           
          },

          tipologia_ambiente_construido(properties, zoom) {
            //console.log('properties',properties)
            return {
                  color: '#666666',
                  fillColor : '#c0c3ac',
                  weight: 4,
                  fillOpacity: 1,
                  fill: true
              };
          },

          tipologia_energia(properties, zoom) {
            //console.log('properties',properties)
            return {
                  color: '#666666',
                  fillColor : '#c0c3ac',
                  weight: 4,
                  fillOpacity: 1,
                  fill: true
              };
          },

          tipologia_inovacao(properties, zoom) {
            //console.log('properties',properties)
            return {
                  color: '#666666',
                  fillColor : '#c0c3ac',
                  weight: 4,
                  fillOpacity: 1,
                  fill: true
              };
          },

          tipologia_mobilidade(properties, zoom) {
            //console.log('properties',properties)
            return {
                  color: '#666666',
                  fillColor : '#c0c3ac',
                  weight: 4,
                  fillOpacity: 1,
                  fill: true
              };
          },

          tipologia_saneamento_ambiental_agua(properties, zoom) {
            //console.log('properties',properties)
            return {
                  color: '#666666',
                  fillColor : '#c0c3ac',
                  weight: 4,
                  fillOpacity: 1,
                  fill: true
              };
          },

          tipologia_saneamento_residuos_solidos(properties, zoom) {
            //console.log('properties',properties)
            return {
                  color: '#666666',
                  fillColor : '#c0c3ac',
                  weight: 4,
                  fillOpacity: 1,
                  fill: true
              };
          },

          resiliencia_ambiental(properties, zoom) {
            //console.log('properties',properties)
            return {
                  color: '#666666',
                  fillColor : '#c0c3ac',
                  weight: 4,
                  fillOpacity: 1,
                  fill: true
              };
          },

          tipologia_desigualdade_social(properties, zoom) {
            //console.log('properties',properties)
            return {
                  color: '#666666',
                  fillColor : '#c0c3ac',
                  weight: 4,
                  fillOpacity: 1,
                  fill: true
              };
          },

          tipologia_governanca(properties, zoom) {
            //console.log('properties',properties)
            return {
                  color: '#666666',
                  fillColor : '#c0c3ac',
                  weight: 4,
                  fillOpacity: 1,
                  fill: true
              };
          },
    
      }
    };

    function popupProperties(err, latlng, content) {
      if (err) { return; }
      L.popup({ maxWidth: 800 })
        .setLatLng(latlng)
        .setContent(content)
        .openOn(this._map);
    }


    this.integracaoService.buscarCamadasCGEE().subscribe(async data => {
      let lista: Array<MVT> = [];
      for (const iterator of data) {
        const value = Object.values(iterator)[0] as MVT;
        if(this.filtroMVTCamadas(value)){
          lista.push(value);
        }
      }
      
      lista.forEach((ele, id) => {
        id = id + 10000;
        
        const resultado = ele.host.replace('http://api-sigweb.cgee.org.br/', 'https://api-sigweb.cgee.org.br/tile/');
        ele.host = resultado;
        const layerMVT = L.vectorGrid.protobuf(ele.host, vectorTileOptions);
        layerMVT.on('click', function(e) {
          if (e.layer.properties) {
            const prop = e.layer.properties;
            const latlng = [e.latlng.lat, e.latlng.lng];
            const dataHtml = _this.propriedadesToString(prop , '');
            const showResults = L.Util.bind(popupProperties, this);
            showResults(null, latlng, dataHtml);
          }
        });

        layerMVT['name'] = ele.name;
        layerMVT['mvt'] = true;
        this.menuShapesLayerCGEE[id] = layerMVT;

        if(ele.name === 'unidades_conservacao') {
          ele.name = 'unidades_conservacao_federal';
        }

        this.overlaysTree[3].children.push({ label: `<span style="margin-left:5px" zoom_min='${ele.zoom_min}' data-id='${id}' data-index='${id}' data-cgee='true' title='CGEE'>${ele.name}</span>
          <button matTooltip="Download da camada" style="border: 0; background-color: transparent; margin-left: 10px "> 
            <mat-icon  
              download_icon='true' 
              svgIcon="file-export" 
              class="mat-icon svg-icon notranslate material-icons mat-icon-no-color icon-download-camada-cgee" 
              style="line-height: .6; 
              display:none">
                <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg fill="#595959" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z" /></svg>
            </mat-icon>
          </button>`, 
          layer: this.menuShapesLayerCGEE[id] 
        });
      });

      this.ctrlTree.setOverlayTree(this.overlaysTree);
      this.gerarEventosMenuShape();
    });

  }

  private filtroMVTCamadas(camada : MVT) : boolean{

    switch (camada.name) {

			case 'bioma':
				return true;
			case 'uso_cobertura_terra':
				return true;
      case 'preciptacao':
        return true;
      case 'temperatura':
        return true;
      case 'qualidade_da_agua':
        return true;
      case 'sub_bacia_hidrografica':
        return true;
      case 'vulnerabilidade_a_inundacao':
        return true;
      case 'populacao_grade_5_km':
        return true;
      case 'entorno_grade_1km':
        return true;
      case 'unidades_conservacao':
        return true;
      case 'cidade_regiao':
        return true;
			default:
        return false;
		}
    
  }

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

  public selecionarAreaAtributos() {
    this.lasso.enable();
  }

  configurarLimiteMaximo(map) {
    const corner1 = L.latLng(-100, -190);
    const corner2 = L.latLng(100, 190);
    const bounds = L.latLngBounds(corner1, corner2);
    map.setMaxBounds(bounds);
  }

  configurarRosaDosVentos() {
    L.Control.Watermark = L.Control.extend({
      onAdd(map) {
          const img = L.DomUtil.create('img');

          img.src = '../../../../assets/bandeira_brasil.png';
          img.style.width = '100px';

          return img;
      },
    });
    L.control.watermark = function(opts) {
        return new L.Control.Watermark(opts);
    };
    L.control.watermark({ position: 'topright' }).addTo(this.map);
  }

  public onMapReady(map) {
    this.configurarLimiteMaximo(map);

    L.control.mousePosition({position:'bottomleft', prefix:'Longitude: ', separator: ' / Latitude: ',}).addTo(map);

    const scaleControl = L.control.scale({
      position: 'bottomleft',
      imperial: false
    });
    scaleControl.addTo(map);

    map.on('browser-print-start', function(e) {
      scaleControl.addTo(e.printMap);
    });

    map.on('browser-print-end', function(e) {
      scaleControl.addTo(map);
    });

    map.on('lasso.finished', (event: LassoHandlerFinishedEventData) => {
      this.shapesSelecionadosPorSelecaoArea = event.layers;

      this.shapesSelecionadosPorSelecaoArea.forEach(layer => {
        var id = layer._leaflet_id;
        const indice = _this.objetosSelecionados.indexOf(id);
        if(indice == -1){
          layer.optionsColorBefore = Object.assign({}, layer.options); 
          var e = {};
          e['target'] = layer;
          e['lasso'] = true;
          //this.highlightShapeSelecionado(layer);
          this.selecionarLayer(e)
        }
      });

      if (this.shapesSelecionadosPorSelecaoArea && this.shapesSelecionadosPorSelecaoArea.length < 1) {
        this.lasso.disable();
        $('.btnCancelarSel').hide();
      } else if (!this.shapesSelecionadosPorSelecaoArea) {
        this.lasso.disable();
        $('.btnCancelarSel').hide();
      }
    });

    this.lasso =  new LassoHandler(map);
    this.lasso.setOptions({ intersect: true })

    this.map = map;
    // this.configurarRosaDosVentos()
    this.editableFeatureGroup.addTo(this.map);
    this.editableFeatureGroupAux.addTo(this.map);
    this.customLabels();
    this.initLayerControl();

    this.gerarMenuShapes();

    let _this = this;
    this.map.on('draw:edited', function(e) {
      const layers = e.layers;
    });
    this.map.on('draw:deleted', function(e) {
      _this.removerTransform(e);
      _this.modoDeletar = false;
      const layers = e.layers;
      _this.configurarAtributos();
      _this.configurarTabelaAtributos();
    });
    this.map.on('draw:deletestart', function(e) {
      _this.modoDeletar = true;
      _this.removerTodosTransformsDoMapa();
    });
    this.map.on('draw:deletestop', function(e) {
      _this.modoDeletar = false;
    });
    this.map.on('draw:drawstop', function(e) {
      _this.configurarAtributos();
      _this.configurarTabelaAtributos();
    });
    this.map.on('draw:drawstart', function(e) {
    });
    this.map.on('draw:created', (object) => {
    object = this.converterObjetoEmObjetoLeaflet(object);

    object.layer.properties = {};
    object.layer.properties.layerType = object.layerType == 'polyline' ? 'LineString' : object.layerType;
    object.layer.layerType = object.layerType;
    _this.configurarAtributos();
    this.adicionarContextMenu(object.layer, 'Edição');

    object.layer.on('click', (e) => {
        this.selecionarLayer(e);
      });

    });

    this.map.on('click', function(e) {
      if (document.getElementById('map').style.cursor === 'crosshair') {
        if (!_this.polygonCreateLng) {
          _this.polygonCreateLng = e.latlng.lng;
          _this.polygonCreateLat = e.latlng.lat;
        }

        if (_this.itemSelecionado) {
          _this.itemSelecionado.latitude = e.latlng.lat;
          _this.itemSelecionado.longitude = e.latlng.lng;
        }

        if (_this.criandoPoligonoAzimute) {
          _this.openDialogPoligono();
        }
        if ( _this.criandoTitulo) {
          _this.concluirAdicaoTitulo(e.latlng.lat, e.latlng.lng);
        }
        document.getElementById('map').style.cursor == '';
      } else {
      }
           
    });



    this.mostrarCrtlBtnPolygon();

    this.mostrarCrtlMenu();
    this.mostrarCrtlFiltro();

    this.mostrarCrtlExport();
    this.mostrarCtrlExportarAtributosECoordenadas();
    this.mostrarCtrlHabilitaModoImpressao();
     
    this.mostrarCrtlBtnSelecionarShapes();

    this.mostrarCrtlBtnCancelarSelecaoShapes();
    $('.btnCancelarSel').hide();

    //this.mostrarApagarShapeBtn();


    this.initCfgGeoServer();

    

    this.mostrarCrtlBtnLimparSelecaoShapes();

    this.initLegendasCGEE();
    
    
  }
  

  initLegendasCGEE(){

    var _this = this;

    const labelsTemp = ['#9F98FF', '#AC8DD8', '#BA81B1', '#C7768A', '#D46A63', '#D3504A'];
    const gradesTemp = ['<= 19°C', '19 - 21ºC', '21 - 23°C', '23 - 25°C', '25 - 28°C', '> 28°C'];

    const labelsPrecipitacao = ['#FFFAD5', '#E4EBDC', '#C9DCE3', '#AECDEA', '#93BEF1', '#78B0F8'];
    const gradesPrecipitacao = ['<= 630mm', '630mm à 800mm', '800mm à 1.300mm', '1.300mm à 1.800mm', '1.800mm à 2.400mm', '> 2.400mm'];

    const labelsQualidadeAgua = ['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#00cdf4'];
    const gradesQualidadeAgua = ['Péssima', 'Ruim', 'Regular', 'Boa', 'Excelente'];

    const labelsSubBaciaHidrografica = ['#93d0fb'];
    const gradesSubBaciaHidrografica = ['Sub-bacia linhas'];


    const labelsVulnerabilidadeInundacao = ['#b2b2b2', '#ff8080', '#a50f15'];
    const gradesVulnerabilidadeInundacao = ['Baixa', 'Média', 'Alta'];

    const labelsPopulacaoGrade5km = ['#b2b2b2', '#ffbfbf', '#ff8080', '#ff4040', '#a80000'];
    const gradesPopulacaoGrade5km = ['menos de 300 hab/km2', '330 à 1.400 hab/km2', '1.400 à 3.500 hab/km2', '3.500 à 9.000 hab/km2', 'mais que 9.000 hab/km2'];

    const labelsEntornoGrade1km = ['#b30000', '#e34a33', '#fc8d59', '#fdcc8a', '#fef0d9'];
    const gradesEntornoGrade1km = ['Crítico', ' ', ' ', ' ', 'Favorável'];

    const labelsBioma = ['#6A9369', '#C1C690', '#99A278', '#C1E2BE', '#92BA94','#467a73' ];
    const gradesBioma = ['Amazônia', 'Caatinga', 'Cerrado', 'Mata Atlântica', 'Pampa', 'Pantanal'];

    const labelsUsoCoberturaTerra = ['#fe0000','#ebe628','#cd8900','#d4e885','#00915a','#73a800','#beb8f4','#c890a9','#d69963','#8cffff','#2d99da','#888888'];
    const gradesUsoCoberturaTerra = ["Área Artificial", "Área Agrícola", "Pastagem com Manejo","Mosaico de Ocupações em Área Florestal", 
    "Silvicultura", "Vegetação Florestal", "Área Úmida","Vegetação Campestre","Mosaico de Ocupações em Área Campestre",
    "Corpo d'Água Continental", "Corpo d'Água Costeiro", "Área Descoberta",];

    this.map.on('layeradd', function(eventLayer) {
      let layer =  eventLayer.layer
      if (layer && layer.name === 'temperatura') {
        _this.legendaTemperatura = L.control({position: 'bottomright'});
        _this.legendaTemperatura.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'info legend'), grades = gradesTemp, labels = labelsTemp;
          for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                grades[i] + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  labels[i] + '\'></i>') + '<br>';
          }
          return div;
        };
        _this.legendaTemperatura.addTo(_this.map);
      } else  if (layer && layer.name === 'preciptacao') {
        _this.legendaPrecipitacao = L.control({position: 'bottomright'});
        _this.legendaPrecipitacao.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'info legend'), grades = gradesPrecipitacao, labels = labelsPrecipitacao;
          for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                grades[i] + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  labels[i] + '\'></i>') + '<br>';
          }
          return div;
        };
        _this.legendaPrecipitacao.addTo(_this.map);
      } else  if (layer && layer.name === 'qualidade_da_agua') {
        _this.legendaQualidadeAgua = L.control({position: 'bottomright'});
        _this.legendaQualidadeAgua.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'info legend'), grades = gradesQualidadeAgua, labels = labelsQualidadeAgua;
          for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                grades[i] + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  labels[i] + '\'></i>') + '<br>';
          }
          return div;
        };
        _this.legendaQualidadeAgua.addTo(_this.map);
      } else  if (layer && layer.name === 'sub_bacia_hidrografica') {
        _this.legendaSubBaciaHidrografica = L.control({position: 'bottomright'});
        _this.legendaSubBaciaHidrografica.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'info legend'), grades = gradesSubBaciaHidrografica, labels = labelsSubBaciaHidrografica;
          for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                grades[i] + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  labels[i] + '\'></i>') + '<br>';
          }
          return div;
        };
        _this.legendaSubBaciaHidrografica.addTo(_this.map);
      } else  if (layer && layer.name === 'vulnerabilidade_a_inundacao') {
        _this.legendaVulnerabilidadeInundacao = L.control({position: 'bottomright'});
        _this.legendaVulnerabilidadeInundacao.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'info legend'), grades = gradesVulnerabilidadeInundacao, labels = labelsVulnerabilidadeInundacao;
          for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                grades[i] + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  labels[i] + '\'></i>') + '<br>';
          }
          return div;
        };
        _this.legendaVulnerabilidadeInundacao.addTo(_this.map);
      } else  if (layer && layer.name === 'populacao_grade_5_km') {
        _this.legendaPopulacaoGrade5km = L.control({position: 'bottomright'});
        _this.legendaPopulacaoGrade5km.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'info legend'), grades = gradesPopulacaoGrade5km, labels = labelsPopulacaoGrade5km;
          for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                grades[i] + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  labels[i] + '\'></i>') + '<br>';
          }
          return div;
        };
        _this.legendaPopulacaoGrade5km.addTo(_this.map);

      } else  if (layer && layer.name === 'entorno_grade_1km') {
        _this.legendaEntornoGrade1km = L.control({position: 'bottomright'});
        _this.legendaEntornoGrade1km.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'info legend'), grades = gradesEntornoGrade1km, labels = labelsEntornoGrade1km;
          for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                grades[i] + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  labels[i] + '\'></i>') + '<br>';
          }
          return div;
        };
        _this.legendaEntornoGrade1km.addTo(_this.map);
      } else  if (layer && layer.name === 'bioma') {
        _this.legendaBioma = L.control({position: 'bottomright'});
        _this.legendaBioma.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'info legend'), grades = gradesBioma, labels = labelsBioma;
          for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                grades[i] + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  labels[i] + '\'></i>') + '<br>';
          }
          return div;
        };
        _this.legendaBioma.addTo(_this.map);
      } else  if (layer && layer.name === 'uso_cobertura_terra') {
        _this.legendaUsoCoberturaTerra = L.control({position: 'bottomright'});
        _this.legendaUsoCoberturaTerra.onAdd = function(map) {
          const div = L.DomUtil.create('div', 'info legend'), grades = gradesUsoCoberturaTerra, labels = labelsUsoCoberturaTerra;
          for (let i = 0; i < grades.length; i++) {
                div.innerHTML +=
                grades[i] + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  labels[i] + '\'></i>') + '<br>';
          }
          return div;
        };
        _this.legendaUsoCoberturaTerra.addTo(_this.map);
      }
    });

    this.map.on('layerremove', function(eventLayer) {
      let layer =  eventLayer.layer
      if (layer && layer.name === 'temperatura') {
        _this.map.removeControl(_this.legendaTemperatura);
      } else if (layer && layer.name === 'preciptacao') {
        _this.map.removeControl(_this.legendaPrecipitacao);
      } else if (layer && layer.name === 'qualidade_da_agua') {
        _this.map.removeControl(_this.legendaQualidadeAgua);
      } else if (layer && layer.name === 'sub_bacia_hidrografica') {
        _this.map.removeControl(_this.legendaSubBaciaHidrografica);
      } else if (layer && layer.name === 'vulnerabilidade_a_inundacao') {
        _this.map.removeControl(_this.legendaVulnerabilidadeInundacao);
      } else if (layer && layer.name === 'populacao_grade_5_km') {
        _this.map.removeControl(_this.legendaPopulacaoGrade5km);
      } else if (layer && layer.name === 'entorno_grade_1km') {
        _this.map.removeControl(_this.legendaEntornoGrade1km);
      } else if (layer && layer.name === 'bioma') {
        _this.map.removeControl(_this.legendaBioma);
      } else if (layer && layer.name === 'uso_cobertura_terra') {
        _this.map.removeControl(_this.legendaUsoCoberturaTerra);
      }
    });
  }

  converterObjetoEmObjetoLeaflet(object) {
    const options = {
      color: '#666666',
      fillOpacity: .5,
      strokeOpacity: 0.5,
      fill: true,
      transform: true,
      draggable: true,
      fillColor : '#c0c3ac',
      weight: 4
    };

    const optionsLine = {
      color: '#666666',
      weight: 4,
      opacity: 0.5,
      transform: true,
      draggable: true,
    };

    if (object.layerType == 'rectangle' || object.layerType == 'polygon') {
      object.layer = L.polygon(object.layer._latlngs, options);

      object.layer.dragging.disable();

      return object;

    } else if (object.layerType == 'polyline') {

      object.layer = L.polyline(object.layer._latlngs, optionsLine);
      object.layer.dragging.disable();

      return object;

    } else if (object.layerType == 'circle') {
      let radius = object.layer._mRadius;

      const points = [];

      points.push(object.layer._latlng.lat);
      points.push(object.layer._latlng.lng);

      object.layer = L.circle(points, radius, options);

      object.layer.dragging.disable();

      return object;
    } else if (object.layerType == 'marker') {
      const points = [];

      points.push(object.layer._latlng.lat);
      points.push(object.layer._latlng.lng);

      object.layer = L.marker(points, options);

      setTimeout(() => {
        object.layer.dragging._marker.dragging.disable();
      }, 50);


      return object;
    } else {
      const points = [];

      points.push(object.layer._latlng.lat);
      points.push(object.layer._latlng.lng);

      object.layer = L.circleMarker(points, options);

      object.layer.dragging.disable();

      return object;
    }

  }

  removerTransform(e) {
    const keysEdicao = Object.keys(e.layers._layers);
    if (keysEdicao.length > 0) {
      keysEdicao.forEach(key => {
        e.layers._layers[key].transform ? e.layers._layers[key].transform.disable() : '';
      })
    }
  }

  private mostrarCrtlBtnPolygon() {
    let _this = this;
    const ctrlBtnPolygon = new L.Control({position: 'topright'}); ctrlBtnPolygon.onAdd = () => {
      const buttonCreatePolygon = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      buttonCreatePolygon.type = 'button';
      buttonCreatePolygon.id = 'btnCreatePolygon';
      buttonCreatePolygon.title = 'Criar polígono com coordenadas e azimutes';
      buttonCreatePolygon.style.padding = '0px';
      buttonCreatePolygon.style.height = '32px';
      buttonCreatePolygon.style.width = '35px';
      buttonCreatePolygon.style.minWidth = '0px';
      buttonCreatePolygon.style.lineHeight = '0px';
      buttonCreatePolygon.innerHTML = `<mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;">
      <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg fill="#595959" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M17,15.7V13H19V17L10,21L3,14L7,5H11V7H8.3L5.4,13.6L10.4,18.6L17,15.7M22,5V7H19V10H17V7H14V5H17V2H19V5H22Z" /></svg>
      </mat-icon>`;
      buttonCreatePolygon.onclick = function() {
          _this.openDialogPoligono();
      };
      return buttonCreatePolygon;
    };
    ctrlBtnPolygon.addTo(this.map);
  }

  private mostrarCrtlMenu() {
    let _this = this;
    this.ctrlMenu = new L.Control({position: 'topleft'}); this.ctrlMenu.onAdd = () => {
      const btnMenu = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      btnMenu.type = 'button';
      btnMenu.title = 'Menu SIG';
      btnMenu.style.padding = '0px';
      btnMenu.style.height = '32px';
      btnMenu.style.width = '35px';
      btnMenu.style.minWidth = '0px';
      btnMenu.style.lineHeight = '0px';
      btnMenu.innerHTML = PcsUtilSVG.menuSIG;
      btnMenu.onclick = function() {
        _this.ctrlMenuSelecionado = true;
        _this.ctrlFiltroSelecionado = false;
        _this.sidenav.toggle();
       };
      return btnMenu;
    };
    this.ctrlMenu.addTo(this.map);
  }

  private mostrarCrtlFiltro() {
    let _this = this;
    this.ctrlFiltro = new L.Control({position: 'topleft'}); this.ctrlFiltro.onAdd = () => {
      const btnFiltro = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      btnFiltro.type = 'button';
      btnFiltro.title = 'Filtro';
      btnFiltro.style.padding = '0px';
      btnFiltro.style.height = '32px';
      btnFiltro.style.width = '35px';
      btnFiltro.style.minWidth = '0px';
      btnFiltro.style.lineHeight = '0px';
      btnFiltro.innerHTML = PcsUtilSVG.filtroSIG;
      //btnFiltro.innerHTML = '<mat-icon class="mat-icon notranslate material-icons mat-icon-no-color" role="img" aria-hidden="true">filter_alt</mat-icon>';
      btnFiltro.onclick = function() {
        _this.ctrlMenuSelecionado = false;
        _this.ctrlFiltroSelecionado = true;
        _this.sidenav.toggle();
       };
      return btnFiltro;
    };
    this.ctrlFiltro.addTo(this.map);
  }

  private mostrarApagarShapeBtn() {
    let _this = this;

    this.apagarShapeBtn = new L.Control({position: 'topright'}); this.apagarShapeBtn.onAdd = () => {
      const buttonDeleteShape = L.DomUtil.create('input', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      buttonDeleteShape.type = 'button';
      buttonDeleteShape.title = 'Apagar shapes já salvos';
      buttonDeleteShape.value = 'Exclusão de shape';
      buttonDeleteShape.onclick = function() {
        if (_this.modoDeletarShape === false) {
          PcsUtil.swal().fire({
            title: 'Ativar o modo de exclusão?',
            text: `Isso vai ativar o modo de exclusão de shapes.
                    Clique no SIM para confirmar e depois no shape que deseja excluir.
                    Clique em NÃO para cancelar`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            reverseButtons: false
          }).then((result) => {
            if (result.value) {
              _this.modoDeletarShape = true;
            }
          });
        } else {
          _this.modoDeletarShape = false;
          PcsUtil.swal().fire('Modo de exclusão desativado!', ``, 'success');
        }
      };
      return buttonDeleteShape;
    };
    this.apagarShapeBtn.addTo(this.map);
  }

  private mostrarCrtlBtnSelecionarShapes() {
    let _this = this;
    this.ctrlSelecaoShapes = new L.Control({position: 'topright'});
    this.ctrlSelecaoShapes.onAdd = () => {
      const btnSelecionarShapes = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      btnSelecionarShapes.type = 'button';
      btnSelecionarShapes.id = 'btnSelecionarShapes';
      btnSelecionarShapes.title = 'Selecionar Shapes por área';
      btnSelecionarShapes.style.padding = '0px';
      btnSelecionarShapes.style.height = '32px';
      btnSelecionarShapes.style.width = '35px';
      btnSelecionarShapes.style.minWidth = '0px';
      btnSelecionarShapes.style.lineHeight = '0px';
      btnSelecionarShapes.innerHTML = `<mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;">
      <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg fill="#595959" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M1 9h2V7H1v2zm0 4h2v-2H1v2zm0-8h2V3c-1.1 0-2 .9-2 2zm8 16h2v-2H9v2zm-8-4h2v-2H1v2zm2 4v-2H1c0 1.1.9 2 2 2zM21 3h-8v6h10V5c0-1.1-.9-2-2-2zm0 14h2v-2h-2v2zM9 5h2V3H9v2zM5 21h2v-2H5v2zM5 5h2V3H5v2zm16 16c1.1 0 2-.9 2-2h-2v2zm0-8h2v-2h-2v2zm-8 8h2v-2h-2v2zm4 0h2v-2h-2v2z"/></svg>
      </mat-icon>`;
      btnSelecionarShapes.onclick = () => {
        this.selecionarAreaAtributos();
        $('.btnCancelarSel').show();
      };
      return btnSelecionarShapes;
    };
    this.ctrlSelecaoShapes.addTo(this.map);
  }

  private mostrarCrtlBtnCancelarSelecaoShapes() {
    let _this = this;
    this.ctrlCancelarSelecaoShapes = new L.Control({position: 'topright'});
    this.ctrlCancelarSelecaoShapes.onAdd = () => {
      const btnSelecionarShapes = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button btnCancelarSel');
      btnSelecionarShapes.type = 'button';
      btnSelecionarShapes.title = 'Cancelar Seleção de Shapes por área';
      btnSelecionarShapes.style.padding = '0px';
      btnSelecionarShapes.style.height = '32px';
      btnSelecionarShapes.style.minWidth = '0px';
      btnSelecionarShapes.style.lineHeight = '0px';
      btnSelecionarShapes.innerHTML = '  Cancelar Seleção  ';
      btnSelecionarShapes.onclick = () => {
        _this.lasso.disable();
        $('.btnCancelarSel').hide();
        _this.shapesSelecionadosPorSelecaoArea.forEach(layer => {
          layer.options = this.copiarPropriedadesOption(layer.optionsColorBefore, layer.options);
          layer.setStyle(layer.options);

          var id = layer._leaflet_id;
          id++
          const indice = _this.objetosSelecionados.indexOf(id);

          if(indice != -1){
            _this.objetosSelecionados.splice(indice, 1);
            _this.objetosSelecionadosMap.delete(id);
          }
        });
        this.shapesSelecionadosPorSelecaoArea = [];
      };
      return btnSelecionarShapes;
    };
    this.ctrlCancelarSelecaoShapes.addTo(this.map);
  }

  private mostrarCrtlBtnLimparSelecaoShapes() {
    let _this = this;
    this.ctrlLimparSelecaoShapes = new L.Control({position: 'topright'});
    this.ctrlLimparSelecaoShapes.onAdd = () => {
      const btnLimparShapes = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      btnLimparShapes.type = 'button';
      btnLimparShapes.title = 'Limpar Seleção';
      btnLimparShapes.id = 'btnLimparShapes';
      btnLimparShapes.style.padding = '0px';
      btnLimparShapes.style.height = '32px';
      btnLimparShapes.style.width = '35px';
      btnLimparShapes.style.minWidth = '0px';
      btnLimparShapes.style.lineHeight = '0px';
      btnLimparShapes.innerHTML = `<mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;">
      <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg fill="#595959" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 5h2V3H7v2zm0 8h2v-2H7v2zm0 8h2v-2H7v2zm4-4h2v-2h-2v2zm0 4h2v-2h-2v2zm-8 0h2v-2H3v2zm0-4h2v-2H3v2zm0-4h2v-2H3v2zm0-4h2V7H3v2zm0-4h2V3H3v2zm8 8h2v-2h-2v2zm8 4h2v-2h-2v2zm0-4h2v-2h-2v2zm0 8h2v-2h-2v2zm0-12h2V7h-2v2zm-8 0h2V7h-2v2zm8-6v2h2V3h-2zm-8 2h2V3h-2v2zm4 16h2v-2h-2v2zm0-8h2v-2h-2v2zm0-8h2V3h-2v2z"/></svg>
      </mat-icon>`;
      btnLimparShapes.onclick = () => {
        _this.map.eachLayer(function(layer) {
                _this.highlightShapeSelecionadoReset(layer);
        });
        _this.shapesSelecionadosPorSelecaoArea = [];
        _this.objetosSelecionados = [];
        _this.objetosSelecionadosMap = new Map();
      };
      return btnLimparShapes;
    };
    this.ctrlLimparSelecaoShapes.addTo(this.map);
  }

  private mostrarCrtlExport() {
    let _this = this;
    this.ctrlExport = new L.Control({position: 'topleft'});
    this.ctrlExport.onAdd = () => {
      const btnExport = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      btnExport.type = 'button';
      btnExport.title = 'Exportar ShapeFile';
      btnExport.style.padding = '0px';
      btnExport.style.height = '32px';
      btnExport.style.width = '35px';
      btnExport.style.minWidth = '0px';
      btnExport.style.lineHeight = '0px';
      btnExport.style.zIndex = '999';
      btnExport.innerHTML = `<mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6">
      <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg fill="#595959" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M17,11l-1.41-1.41L13,12.17V4h-2v8.17L8.41,9.59L7,11l5,5 L17,11z" /></svg>
      </mat-icon>`;
      btnExport.onclick = () => { 
        this.validacaoExportacaoShape();
      }; 
      return btnExport;
    };
    this.ctrlExport.addTo(this.map);
  }

  public openDialogPoligono(): void {
    this.criandoPoligonoAzimute = true;
    const poligonosDados = this.poligonosDados;
    const polygonCreateLng = this.polygonCreateLng;
    const polygonCreateLat = this.polygonCreateLat;
    const dialogRef = this.dialog.open(CriarPoligonoComponent, {
      width: '50%',
      data: {
        lat : polygonCreateLat,
        long : polygonCreateLng,
        lista : poligonosDados,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (!data) {
        this.limparCamposCriarPoligonoAzimuthdistancia();
      } else if (data && data.capturar) {
        document.getElementById('map').style.cursor = 'crosshair';
        this.poligonosDados = data.lista;
        this.itemSelecionado = data.itemSelecionado;
        this.polygonCreateLat = data.lat;
        this.polygonCreateLng = data.long;
      } else if (data != null) {
        const p1 = new LatLon( data.lat, data.long);
        const listaPoints = this.generatePoints(p1, data.lista);    
        if (listaPoints.length > 0) {
          const polygon = L.polygon(listaPoints);
          if (this.modoEdicao) {
            polygon.on('click', () => {
              this.prepararAtributos(polygon.properties, polygon);
              this.changeDetectorRefs.detectChanges();
            });
          } else {
            polygon.on('click', (e) => {
              this.selecionarLayer(e);
              this.changeDetectorRefs.detectChanges();
            });
          }
          this.editableFeatureGroup.addLayer(polygon);
        }
        this.limparCamposCriarPoligonoAzimuthdistancia();
      } else {
        document.getElementById('map').style.cursor = '';
        this.criandoPoligonoAzimute = false;
      }

    });
  }

  private limparCamposCriarPoligonoAzimuthdistancia() {
    this.poligonosDados = [new PoligonoDados()];
    this.itemSelecionado = null;
    this.polygonCreateLng = null;
    this.polygonCreateLat = null;
    document.getElementById('map').style.cursor = '';
    this.criandoPoligonoAzimute = false;
  }

  private generatePoints(p1: LatLon , result: any): any[] {
    const listaLatLng = [];
    listaLatLng.push([p1.lat, p1.lon]);
    const p1Aux = p1;
    let pAux = p1;
    let pAux2 = null;
    result.forEach(item => {
      if (item.selGrauDistancia) {
        if (item.distancia != null && item.azimuth != null) {
          pAux2 = pAux.destinationPoint(item.distancia, item.azimuth);
          listaLatLng.push([pAux2.lat, pAux2.lon]);
          pAux = pAux2;
        }
      }
      if (item.selLatLong) {
        if (item.latitude != null && item.longitude != null) {
          pAux2 = new LatLon(item.latitude, item.longitude, 0, LatLon.datums.WGS84);
          listaLatLng.push([pAux2.lat, pAux2.lon]);
          pAux = pAux2;
        }
      }
    });
    if (listaLatLng.length > 0) {
      listaLatLng.push([p1Aux.lat, p1Aux.lon]);
    }
    return listaLatLng;
  }

  public triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      target: 'destination'
    };
    this._scrollToService.scrollTo(config);
  }

  public showHideFiltroBoasPraticas() {
    this.painelFiltrosBoasPraticas = !this.painelFiltrosBoasPraticas;
    this.painelCatalogoShapes = false;
    this.painelFiltroVariaveis = false;
    this.painelDefinirLatLong = false;
    this.painelFiltroIndicadores = false;
    this.painelImportarPontos = false;
  }

  public showHideCatalogoShapes() {
    this.painelFiltroVariaveis = false;
    this.painelFiltrosBoasPraticas = false;
    this.painelCatalogoShapes = !this.painelCatalogoShapes;
    this.painelDefinirLatLong = false;
    this.painelFiltroIndicadores = false;
    this.painelImportarPontos = false;
  }

  public showHideFiltroVariaveis() {
    this.painelFiltroVariaveis = !this.painelFiltroVariaveis;
    this.painelCatalogoShapes = false;
    this.painelFiltrosBoasPraticas = false;
    this.painelDefinirLatLong = false;
    this.painelFiltroIndicadores = false;
    this.painelImportarPontos = false;
  }

  public showHideDefinirLatLong() {
    this.painelDefinirLatLong = !this.painelDefinirLatLong;
    this.painelCatalogoShapes = false;
    this.painelFiltrosBoasPraticas = false;
    this.painelFiltroVariaveis = false;
    this.painelFiltroIndicadores = false;
    this.painelImportarPontos = false;
  }

  public showHideFiltroIndicadores() {
    this.painelFiltroIndicadores = !this.painelFiltroIndicadores;
    this.painelDefinirLatLong = false;
    this.painelCatalogoShapes = false;
    this.painelFiltrosBoasPraticas = false;
    this.painelFiltroVariaveis = false;
    this.painelImportarPontos = false;
  }

  public showHideImportarPontos() {
    this.sidenavOpen = false;
    this.painelFiltroIndicadores = false;
    this.painelDefinirLatLong = false;
    this.painelCatalogoShapes = false;
    this.painelFiltrosBoasPraticas = false;
    this.painelFiltroVariaveis = false;
    this.painelImportarPontos = !this.painelImportarPontos;
  }

  private adicionarShapes(featureGroup: any, features: any[], txtPopup: string, options) {
    if (features) {
      features.forEach(feature => {
        if (feature.geometry.type.includes('Point') && feature.properties.radius != undefined) {
          const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
          const circle = L.circle([coordenadas[1], coordenadas[0]], { radius: feature.properties.radius });
          circle.properties = feature.properties;

          if (options.qtdBP) {
            circle.properties.quantidade = options.qtdBP;
          }
          if (options.cidade) {
            circle.properties.cidade = options.cidade;
          }
          if (options.variavel) {
            circle.properties.variavel = options.variavel;
          }
          if (options.valorTexto) {
            circle.properties.valor = options.valorTexto;
          }
          if (options.valor) {
            circle.properties.valor = options.valor;
          }
          if (options.indicador) {
            circle.properties.indicador = options.indicador;
          }

          circle.on('click', () => {
            this.triggerScrollTo();
          });

          this.adicionarContextMenu(circle, featureGroup.layerName);

          circle.on('click', (e) => {
            this.selecionarLayer(e);
          });
          circle.addTo(featureGroup);
        } else {

          const geoJson = geoJSON([feature], options);

          geoJson['properties'] = {};
          geoJson['filtros'] = true;

          if (options.qtdBP) {
            geoJson.properties['quantidade'] = options.qtdBP;
          }
          if (options.cidade) {
            geoJson.properties['cidade'] = options.cidade;
          }
          if (options.variavel) {
            geoJson.properties['variavel'] = options.variavel;
          }
          if (options.valorTexto) {
            geoJson.properties['valor'] = options.valorTexto;
          }
          if (options.valor) {
            geoJson.properties['valor'] = options.valor;
          }
          if (options.indicador) {
            geoJson.properties['indicador'] = options.indicador;
          }

          geoJson.on('click', () => {
            this.triggerScrollTo();
          });

          this.adicionarContextMenu(geoJson, featureGroup.layerName);

          geoJson.on('click', (e) => {
            this.selecionarLayer(e);
          });

          featureGroup.addLayer(geoJson);
        }
      });
    }
  }

  private adicionarPontos(featureGroup, latitude, longitude, propriedadeDeafult, txtPoup, options) {
    if (longitude !== null && latitude !== null) {
      const marker: L.circleMarker = L.circleMarker([latitude, longitude], options);
      marker.properties = {};
      if (options.qtdBP) {
        marker.properties.quantidade = options.qtdBP;
      }
      if (options.cidade) {
        marker.properties.cidade = options.cidade;
      }
      if (options.variavel) {
        marker.properties.variavel = options.variavel;
      }
      if (options.valorTexto) {
        marker.properties.valor = options.valorTexto;
      }
      if (options.valor) {
        marker.properties.valor = options.valor;
      }
      if (options.indicador) {
        marker.properties.indicador = options.indicador;
      }

      marker.on('click', () => {
        this.triggerScrollTo();
      });

      this.adicionarContextMenu(marker, featureGroup.layerName);

      marker.on('click', (e) => {
        this.selecionarLayer(e);
      });

      featureGroup.addLayer(marker);
    }
  }

  /* Filtro de Boas Práticas */
  public carregarBoasPraticasNoMapa(cidadesComBoasPraticas: CidadeComBoaPratica[]) {
    this.painelFiltrosBoasPraticas = false;
    if (cidadesComBoasPraticas.length === 0) {
      this.removerBoasPraticasDoMapa();
      PcsUtil.swal().fire({
        title: 'Resultado não encontrado!',
        text: `Não foi encontrado nenhum resultado com os filtros especificados`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });
    } else {
      if (this.boasPraticasCarregadasNoMapa) {
        this.layerscontrol.removeLayer(this.boasPraticasFeatureGroup);
        this.map.removeLayer(this.boasPraticasFeatureGroup);
      } else {
        // this.adicionarLegendaBoaPratica();
        this.boasPraticasCarregadasNoMapa = true;
      }

      this.boasPraticasFeatureGroup.layerName = 'Boas Práticas por Município';
      this.boasPraticasFeatureGroup.eachLayer((l) => {
        this.boasPraticasFeatureGroup.removeLayer(l);
      });

      this.idsCidadesBoasPraticas = new Array<string>();
      cidadesComBoasPraticas.forEach(cidadeComBoaPratica => {
        const optionsPontos = {
          radius: 5,
          fillColor: this.getColor(1),
          color: '#ffffff',
          fillOpacity: 1,
          weight: 0.3,
          title: cidadeComBoaPratica.nomeCidade + ' - Boas Praticas',
          cidade: cidadeComBoaPratica.nomeCidade,
          qtdBP: cidadeComBoaPratica.countBoasPraticas};
        const optionsShapes = {
            color: '#000022',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6,
            cidade: cidadeComBoaPratica.nomeCidade,
            qtdBP: cidadeComBoaPratica.countBoasPraticas};
        if (!cidadeComBoaPratica.visualizarComoPontos) {
          this.boasPraticasComPontos = false;
          if (cidadeComBoaPratica.shapeZoneamento) {
            this.idsCidadesBoasPraticas.push(cidadeComBoaPratica.idCidade);
          }
          this.adicionarShapes(this.boasPraticasFeatureGroup, cidadeComBoaPratica.shapeZoneamento, `<strong>${cidadeComBoaPratica.nomeCidade}</strong> <p>Quantidade de boas práticas: ${cidadeComBoaPratica.countBoasPraticas}</p>`, optionsShapes);
        } else {
          this.boasPraticasComPontos = true;
          this.adicionarPontos(this.boasPraticasFeatureGroup, cidadeComBoaPratica.latitude, cidadeComBoaPratica.longitude, cidadeComBoaPratica.nomeCidade + ' - Boas Praticas',
          `<strong>${cidadeComBoaPratica.nomeCidade}</strong> <p>Quantidade de boas práticas: ${cidadeComBoaPratica.countBoasPraticas}</p>`, optionsPontos);
        }
      });

      this.boasPraticasFeatureGroup.getLayers().map(layer => {
        layer.addTo(this.editableFeatureGroup);
      })

      ///Remove Boas Praticas/////
      var shapeLayer = this.menuShapesLayer[9999];
      if (shapeLayer) {
        const shapeLayer = this.menuShapesLayer[9999];
        const keysEdicao = Object.keys(shapeLayer._layers);
        if (keysEdicao.length > 0) {
          keysEdicao.forEach(key => {
            if (shapeLayer._layers[key]._layers) {
              const keysEdicao2 = Object.keys(shapeLayer._layers[key]._layers);
              if (keysEdicao2.length > 0) {
                keysEdicao2.forEach(key2 => {
                  shapeLayer._layers[key]._layers[key2].transform ? shapeLayer._layers[key]._layers[key2].transform.disable() : '';
                })
              }
            }
          })
        }
        shapeLayer.selecionado = false;
        this.layersGroup.removeLayer(shapeLayer);
        //this.removerShapeSelecionado('Municípios com Boas Práticas', 9999 );
        this.descelecionarObjetosCamada('Municípios com Boas Práticas');
        this.configurarAtributos();
        this.configurarTabelaAtributos();
      }


      this.boasPraticasFeatureGroup.selecionado = true;
      this.layersGroup.addLayer(this.boasPraticasFeatureGroup);
     // this.adicionarShapeSelecionado(this.boasPraticasFeatureGroup, 'Municípios com Boas Práticas', 9999);
      setTimeout(() => {
           this.compararListaDeCamadasEmExibicaoComDisponiveisSelecionadas();
      }, 1000)
      this.configurarAtributos();
      this.configurarTabelaAtributos();
      this.gerarMenuShapes();
    }
  }

  private compararListaDeCamadasEmExibicaoComDisponiveisSelecionadas(){    
    this.shapesSelecionados.forEach(selecionado => {  
      let childrenExist = false;

      this.overlaysTree[0].children.forEach(children => {  
        if(children.label.includes(selecionado.layerName)){ 
          childrenExist = true;   
        }
      })
      if(!childrenExist){
        this.overlaysTree[0].children.push({ label: `<span style="margin-left:10px" data-id='${selecionado.id}'>${selecionado.layerName}</span>` });
      }
    })
    this.addLayersFiltros(); 
    this.gerarMenuShapes();

  }
  
  private adicionarLegendaBoaPratica() {
    this.legendaBoaPratica = L.control({ position: 'bottomright' });

    this.legendaBoaPratica.onAdd = map => {

      let div = L.DomUtil.create('div', 'info legend'),
        grades = [1, 2, 3, 5, 6, 7, 8, 10],
        labels = [],
        from, to;

      const pairs: any[] = grades.reduce((result, value, index, array) => {
        if (index % 2 === 0) {
          result.push(array.slice(index, index + 2));
        }

        return result;
      }, []);

      for (let i = 0; i < pairs.length; i++) {
        from = pairs[i][0];
        to = pairs[i][1];

        if (i == 0) {
          labels.push('<i style="opacity:1;background:' + this.getColor(1) + '"></i> ' + from);
          labels.push('<i style="opacity:1;background:' + this.getColor(2) + '"></i> ' + to);
        } else {
          labels.push('<i style="opacity:1; background:' + this.getColor(from + 1) + '"></i> ' + from + (to ? '&ndash;' + to : '+'));
        }

        if (i == (pairs.length - 1)) {
          labels.push('<i style="opacity:1;background:' + this.getColor(to + 1) + '"></i> + ' + to);
        }
      }

      div.innerHTML = labels.join('<br>');

      return div;
    };

    this.legendaBoaPratica.addTo(this.map);
  }

  private addLayersFiltros() {
    let layersCountAux1 = 0;
    this.boasPraticasFeatureGroup.eachLayer((l) => {
      layersCountAux1 = layersCountAux1 + 1;
    });

    if (layersCountAux1 > 0 &&  !this.menuShapesLayer[9999]) {
      this.menuShapesLayer[9999] =  this.boasPraticasFeatureGroup;
      this.overlaysTree[1].children.push({ label: `<span style="margin-left:5px" data-id='9999' data-index='9999' title='Municípios com Boas Práticas'>Municípios com Boas Práticas</span>`,
      layer:   this.menuShapesLayer[9999] });

     // this.adicionarShapeSelecionado(this.menuShapesLayer[9999], 'Municípios com Boas Práticas', 9999);
      this.overlaysTree[0].children.push({ label: `<span style="margin-left:10px" data-id='9999'>Municípios com Boas Práticas</span>` });
    }

    let layersCountAux2 = 0;
    this.variaveisFeatureGroup.eachLayer((l) => {
      layersCountAux2 = layersCountAux2 + 1;
    });

    if (layersCountAux2 > 0 && !this.menuShapesLayer[9998]) {
      this.menuShapesLayer[9998] =  this.variaveisFeatureGroup;
      this.overlaysTree[1].children.push({ label: `<span style="margin-left:5px" data-id='9998' data-index='9998' title='Variáveis por Municípios'>Variáveis por Municípios</span>`,
      layer:   this.menuShapesLayer[9998] });

      //this.adicionarShapeSelecionado(this.menuShapesLayer[9998], 'Variáveis por Municípios', 9998);
      this.overlaysTree[0].children.push({ label: `<span style="margin-left:10px" data-id='9998'>Variáveis por Municípios</span>` });
    }

    let layersCountAux3 = 0;
    this.indicadoesFeatureGroup.eachLayer((l) => {
      layersCountAux3 = layersCountAux3 + 1;
    });

    if (layersCountAux3 > 0 && !this.menuShapesLayer[9997]) {
      this.menuShapesLayer[9997] =  this.indicadoesFeatureGroup;
      this.overlaysTree[1].children.push({ label: `<span style="margin-left:5px" data-id='9997' data-index='9997' title='Indicadores por Municípios'>Indicadores por Municípios</span>`,
      layer:   this.menuShapesLayer[9997] });

      //this.adicionarShapeSelecionado(this.menuShapesLayer[9997], 'Indicadores por Municípios', 9997);
      this.overlaysTree[0].children.push({ label: `<span style="margin-left:10px" data-id='9997'>Indicadores por Municípios</span>` });
    }

    this.ctrlTree.setOverlayTree(this.overlaysTree);
    this.gerarEventosMenuShape();
  }

  public buscarMapaTematico(shapeLayer, idCamada) { 
    this.mapaTematicoService.buscarMapaTematicoExibirAuto(idCamada).subscribe(mapa => {
      if (mapa){
        this.gerarMapa(mapa, shapeLayer, idCamada)
        this.gerarLegenda()
      }
    })
  }

  private filtrarCamadasComExibirAuto(camadas): number {
    let count = 0
    camadas.forEach((camada: any) => camada.exibirAuto === true ? count++ : '');
    return count
  }

  public gerarMenuShapes() {
    //this.addLayersFiltros();
    this.ajusteGeralService.buscarAjustePorLocalApp('JANELA-ABERTURA-SIG-TEXTO').subscribe(res => {

      let janelaAberturaSigTexto = res.conteudo;

      this.shapeFileService.buscarShapesListagemMapa().subscribe((camadas) => {
        let possueExibirAuto: number = this.filtrarCamadasComExibirAuto(camadas)
        if (possueExibirAuto > 0 && !this.exibirAutoCamadasConfirmacao && this.tituloCamadaParams == null) {
            PcsUtil.swal().fire({
              title: '',
              html: janelaAberturaSigTexto,
              type: 'info',
              width: 700,
              heightAuto: true,
              showCancelButton: true,
              confirmButtonText: 'Sim',
              cancelButtonText: 'Não',
              reverseButtons: false
            }).then((result) => {
                if(result.value){
                  this.exibirAutoCamadas = true;
                }
                this.exibirAutoCamadasConfirmacao = true;
                this.populaMenusShapes(camadas, result.value);
                setTimeout(() => {
                  this.buscarCamadasCGEE();
                }, 1000)
            }, (error) => {});
        }
        else if (this.tituloCamadaParams != null) {
          this.exibirAutoCamadas = true
          this.exibirAutoCamadasConfirmacao = true;
          this.populaMenusShapes(camadas, this.exibirAutoCamadas);
          setTimeout(() => {
            this.buscarCamadasCGEE();
          }, 1000)
        }
        else {
          this.populaMenusShapes(camadas, this.exibirAutoCamadas);
          setTimeout(() => {
            this.buscarCamadasCGEE();
          }, 1000)
        }
      });
    });

  }

  private exibeAutoPorParametro(camada){
    if(this.tituloCamadaParams != null) {
      camada.exibirAuto = false
      let params = this.tituloCamadaParams.split(",");
      params.forEach(param => {          
        if(param.toLowerCase() == camada.nome.toLowerCase()) {
          camada.exibirAuto = true;
        }
      });
    }
  }

  private populaMenusShapes(camadas: any, confirmaExibirAuto:any){
    camadas.forEach((camada, i) => {
      this.exibeAutoPorParametro(camada)
      if (camada.camadaPrefeitura) {   
        if (camada.exibirAuto == true && confirmaExibirAuto) {
          this.shapeFileService.buscarFeaturesPorShapeId(camada.id).subscribe((shapes) => {
            this.loading = true;
            var shapeLayer = L.featureGroup();
            shapeLayer['layerName'] = camada.nome;
            shapeLayer['selecionado'] = true;
            this.adicionarShapesLayersMerged(shapeLayer, shapes, false);
            this.layersGroup.addLayer(shapeLayer);
            this.buscarMapaTematico(shapeLayer, camada.id)
            this.menuShapesLayer[camada.id] = shapeLayer;
            this.adicionarShapeSelecionado(this.menuShapesLayer[camada.id], camada.nome, camada.id);
            this.configurarAtributos();
            this.configurarTabelaAtributos();

            let indexCidade = null;
    
            if(this.overlaysTree[2].children.map(function(e) { return e.nomeCidade; }).indexOf(camada.cidade) < 0){
          
              this.overlaysTree[2].children.push({label: `<span style="margin-left:5px" title='${camada.cidade}'>${camada.cidade}</span>`,
              collapsed: true,
              nomeCidade : camada.cidade,
              children: [
              ]});

              indexCidade = this.overlaysTree[2].children.map(function(e) { return e.nomeCidade; }).indexOf(camada.cidade);

              this.overlaysTree[2].children[indexCidade].children.push({
                label: `<span style="margin-left:5px" data-id='${camada.id}' data-index='${i}' title='${camada.cidade ? camada.cidade : 'PCS'}'>${camada.nome}</span>  <mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;display:none">
              <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
              </mat-icon>
              <button matTooltip="desabilitar mapa temático" style="border: 0; background-color: transparent; margin-left: -15px "> 
               <mat-icon svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color icon-remove-tematico" style="line-height: .6;display:none">
                <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M12 6.36c1.53 2 3.08 4.43 3.71 6.24l2.23 2.23c.03-.27.06-.55.06-.83 0-3.98-6-10.8-6-10.8s-1.18 1.35-2.5 3.19l1.44 1.44c.34-.51.7-1 1.06-1.47zM5.41 5.14L4 6.55l3.32 3.32C6.55 11.33 6 12.79 6 14c0 3.31 2.69 6 6 6 1.52 0 2.9-.57 3.95-1.5l2.63 2.63L20 19.72 5.41 5.14zM12 18c-2.21 0-4-1.79-4-4 0-.69.32-1.62.81-2.64l5.72 5.72c-.7.56-1.57.92-2.53.92z"/></svg>
              </mat-icon>
              </button>
              `, layer: this.menuShapesLayer[camada.id]
              });
  
              
            } else{

              indexCidade = this.overlaysTree[2].children.map(function(e) { return e.nomeCidade; }).indexOf(camada.cidade);

              this.overlaysTree[2].children[indexCidade].children.push({
                label: `<span style="margin-left:5px" data-id='${camada.id}' data-index='${i}' title='${camada.cidade ? camada.cidade : 'PCS'}'>${camada.nome}</span>  <mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;display:none">
              <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
              </mat-icon>
              <button matTooltip="desabilitar mapa temático" style="border: 0; background-color: transparent; margin-left: -15px "> 
               <mat-icon svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color icon-remove-tematico" style="line-height: .6;display:none">
                <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M12 6.36c1.53 2 3.08 4.43 3.71 6.24l2.23 2.23c.03-.27.06-.55.06-.83 0-3.98-6-10.8-6-10.8s-1.18 1.35-2.5 3.19l1.44 1.44c.34-.51.7-1 1.06-1.47zM5.41 5.14L4 6.55l3.32 3.32C6.55 11.33 6 12.79 6 14c0 3.31 2.69 6 6 6 1.52 0 2.9-.57 3.95-1.5l2.63 2.63L20 19.72 5.41 5.14zM12 18c-2.21 0-4-1.79-4-4 0-.69.32-1.62.81-2.64l5.72 5.72c-.7.56-1.57.92-2.53.92z"/></svg>
              </mat-icon>
              </button>
              `, layer: this.menuShapesLayer[camada.id]
              });


            }
          
            this.overlaysTree[0].children.push({ label: `<span style="margin-left:10px" data-id='${camada.id}'>${camada.nome}</span>` });
            this.loading = false;
          });
        } else {
          if (!this.menuShapesLayer[camada.id]) {
            this.menuShapesLayer[camada.id] = L.layerGroup([]);

            
            let indexCidade = null;
    
            if(this.overlaysTree[2].children.map(function(e) { return e.nomeCidade; }).indexOf(camada.cidade) < 0){
          
              this.overlaysTree[2].children.push({label: `<span style="margin-left:5px" title='${camada.cidade}'>${camada.cidade}</span>`,
              collapsed: true,
              nomeCidade : camada.cidade,
              children: [
              ]});

              indexCidade = this.overlaysTree[2].children.map(function(e) { return e.nomeCidade; }).indexOf(camada.cidade);

              this.overlaysTree[2].children[indexCidade].children.push({
                label: `<span style="margin-left:5px" data-id='${camada.id}' data-index='${i}' title='${camada.cidade ? camada.cidade : 'PCS'}'>${camada.nome}</span>  <mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;display:none">
              <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
              </mat-icon>
              <button matTooltip="desabilitar mapa temático" style="border: 0; background-color: transparent; margin-left: -15px "> 
               <mat-icon svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color icon-remove-tematico" style="line-height: .6;display:none">
                <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M12 6.36c1.53 2 3.08 4.43 3.71 6.24l2.23 2.23c.03-.27.06-.55.06-.83 0-3.98-6-10.8-6-10.8s-1.18 1.35-2.5 3.19l1.44 1.44c.34-.51.7-1 1.06-1.47zM5.41 5.14L4 6.55l3.32 3.32C6.55 11.33 6 12.79 6 14c0 3.31 2.69 6 6 6 1.52 0 2.9-.57 3.95-1.5l2.63 2.63L20 19.72 5.41 5.14zM12 18c-2.21 0-4-1.79-4-4 0-.69.32-1.62.81-2.64l5.72 5.72c-.7.56-1.57.92-2.53.92z"/></svg>
              </mat-icon>
              </button>
              `, layer: this.menuShapesLayer[camada.id]
              });
  
              
            } else{

              indexCidade = this.overlaysTree[2].children.map(function(e) { return e.nomeCidade; }).indexOf(camada.cidade);

              this.overlaysTree[2].children[indexCidade].children.push({
                label: `<span style="margin-left:5px" data-id='${camada.id}' data-index='${i}' title='${camada.cidade ? camada.cidade : 'PCS'}'>${camada.nome}</span>  <mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;display:none">
              <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
              </mat-icon>
              <button matTooltip="desabilitar mapa temático" style="border: 0; background-color: transparent; margin-left: -15px "> 
               <mat-icon svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color icon-remove-tematico" style="line-height: .6;display:none">
                <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M12 6.36c1.53 2 3.08 4.43 3.71 6.24l2.23 2.23c.03-.27.06-.55.06-.83 0-3.98-6-10.8-6-10.8s-1.18 1.35-2.5 3.19l1.44 1.44c.34-.51.7-1 1.06-1.47zM5.41 5.14L4 6.55l3.32 3.32C6.55 11.33 6 12.79 6 14c0 3.31 2.69 6 6 6 1.52 0 2.9-.57 3.95-1.5l2.63 2.63L20 19.72 5.41 5.14zM12 18c-2.21 0-4-1.79-4-4 0-.69.32-1.62.81-2.64l5.72 5.72c-.7.56-1.57.92-2.53.92z"/></svg>
              </mat-icon>
              </button>
              `, layer: this.menuShapesLayer[camada.id]
              });


            }
          
          }
        }
      } else {
        if (camada.exibirAuto == true && confirmaExibirAuto) {
          this.loading = true;
          this.shapeFileService.buscarFeaturesPorShapeId(camada.id).subscribe((shapes) => {
            var shapeLayer = L.featureGroup();
            shapeLayer['layerName'] = camada.nome;
            shapeLayer['selecionado'] = true;
            this.adicionarShapesLayersMerged(shapeLayer, shapes, false);
            this.layersGroup.addLayer(shapeLayer);
            this.buscarMapaTematico(shapeLayer, camada.id)
            this.menuShapesLayer[camada.id] = shapeLayer;
            this.adicionarShapeSelecionado(this.menuShapesLayer[camada.id], camada.nome, camada.id);
            this.configurarAtributos();
            this.configurarTabelaAtributos();
            this.overlaysTree[1].children.push({
              label: `<span style="margin-left:5px" data-id='${camada.id}' data-index='${i}' title='${camada.cidade ? camada.cidade : 'PCS'}'>${camada.nome}</span>  <mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;display:none">
          <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
          </mat-icon>
          <button matTooltip="desabilitar mapa temático" style="border: 0; background-color: transparent; margin-left: -15px "> 
           <mat-icon svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color icon-remove-tematico" style="line-height: .6;display:none">
             <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M12 6.36c1.53 2 3.08 4.43 3.71 6.24l2.23 2.23c.03-.27.06-.55.06-.83 0-3.98-6-10.8-6-10.8s-1.18 1.35-2.5 3.19l1.44 1.44c.34-.51.7-1 1.06-1.47zM5.41 5.14L4 6.55l3.32 3.32C6.55 11.33 6 12.79 6 14c0 3.31 2.69 6 6 6 1.52 0 2.9-.57 3.95-1.5l2.63 2.63L20 19.72 5.41 5.14zM12 18c-2.21 0-4-1.79-4-4 0-.69.32-1.62.81-2.64l5.72 5.72c-.7.56-1.57.92-2.53.92z"/></svg>
           </mat-icon>
          </button>
          `, layer: this.menuShapesLayer[camada.id]
            });
            
            this.overlaysTree[0].children.push({ label: `<span style="margin-left:10px" data-id='${camada.id}'>${camada.nome}</span>` });   
            this.loading = false;
          });
         
        } else {
          if (!this.menuShapesLayer[camada.id]) {
            this.menuShapesLayer[camada.id] = L.layerGroup([]);
            this.overlaysTree[1].children.push({
              label: `<span style="margin-left:5px" data-id='${camada.id}' data-index='${i}' title='${camada.cidade ? camada.cidade : 'PCS'}'>${camada.nome}</span>  <mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;display:none">
          <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"/></svg>
          </mat-icon>
          <button matTooltip="desabilitar mapa temático" style="border: 0; margin-left: -15px; background-color: transparent"> 
           <mat-icon svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color icon-remove-tematico" style="line-height: .6;display:none">
              <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path style="color:#0075ff" d="M12 6.36c1.53 2 3.08 4.43 3.71 6.24l2.23 2.23c.03-.27.06-.55.06-.83 0-3.98-6-10.8-6-10.8s-1.18 1.35-2.5 3.19l1.44 1.44c.34-.51.7-1 1.06-1.47zM5.41 5.14L4 6.55l3.32 3.32C6.55 11.33 6 12.79 6 14c0 3.31 2.69 6 6 6 1.52 0 2.9-.57 3.95-1.5l2.63 2.63L20 19.72 5.41 5.14zM12 18c-2.21 0-4-1.79-4-4 0-.69.32-1.62.81-2.64l5.72 5.72c-.7.56-1.57.92-2.53.92z"/></svg>
           </mat-icon>
          </button>
          `, layer: this.menuShapesLayer[camada.id]
            });
            
          }
        }
      }
      if (this.ctrlTree) {
        this.ctrlTree.setOverlayTree(this.overlaysTree);
      } 
      else {
        this.ctrlTree = L.control.layers.tree(this.baseTree, this.overlaysTree, {
          position: 'topleft', autoZIndex: true, sortLayers: true , labelIsSelector: 'checkbox/radiobutton'}).addTo(this.map);
      }
      this.gerarEventosMenuShape();
    });
  }

  abrirMenu(shapeId) {    
    for (let i = 1; i < this.overlaysTree.length; i++) { 
      this.overlaysTree[i].children.forEach(item => {
        if (item.label.includes(`${shapeId}`)) {
          this.overlaysTree[i].collapsed = false
          this.ctrlTree.setOverlayTree(this.overlaysTree)
        }
      })
    }
  }

  public gerarEventosMenuShape() {
    const checkboxes = document.querySelectorAll('input[type=checkbox]');
    const that = this;

    const carregarShape = (e) => {
      const checkbox = e.srcElement;
      const parent = checkbox.parentNode;
      const titleSpan = parent.querySelector('span');
      const titleDiv = titleSpan ? titleSpan.querySelector('span') : undefined;
      const layerName = titleDiv.innerHTML;
      const shapeId = titleDiv.getAttribute('data-id');
      const cgee = titleDiv.getAttribute('data-cgee');
      let zoom_min = titleDiv.getAttribute('zoom_min');
      if (!cgee && checkbox.checked) {
        if (titleDiv) {
          const shapeLayer = that.menuShapesLayer[shapeId];
          
          shapeLayer.selecionado = true;
          shapeLayer.layerName = layerName;
          let layersCount = 0;

          shapeLayer.eachLayer((l) => {
            layersCount = layersCount + 1;
          });

          if (layersCount == 0) {
            
                  that.loading = true;

                  that.shapeFileService.buscarFeaturesPorShapeId(shapeId).subscribe((resp) => {
                  shapeLayer.eachLayer((l) => {
                    shapeLayer.removeLayer(l);
                  });
                  resp.forEach(f => {
                    f.shapeId = shapeId;
                  });

                  this.buscarMapaTematico(shapeLayer, shapeId)
                  this.adicionarShapesLayersMerged(shapeLayer, resp, false);
                  this.layersGroup.addLayer(shapeLayer);
                  this.adicionarShapeSelecionado(shapeLayer, layerName, shapeId);
                  that.configurarAtributos();
                  that.configurarTabelaAtributos();
                  that.loading = false;
                });
          } else {
            this.layersGroup.addLayer(shapeLayer);
            this.adicionarShapeSelecionado(shapeLayer, layerName, shapeId);
            that.configurarAtributos();
            that.configurarTabelaAtributos();
          }

          this.buscarMapaTematico(shapeLayer, shapeId)
          this.overlaysTree[0].children.push({ label: `<span style="margin-left:10px" data-id='${shapeId}'>${layerName}</span>` });
          this.overlaysTree[3].collapsed = true
          this.ctrlTree.setOverlayTree(this.overlaysTree);
          this.abrirMenu(shapeId);
          this.gerarEventosMenuShape();
        }
      } else if (cgee && checkbox.checked) {     
          if (zoom_min){
            if (zoom_min <= 2){
              zoom_min = 4;
            }
          } else {
            zoom_min = 4;
          }

          that.map.setZoom(zoom_min);
          setTimeout(() => {
            that.map.setView([-15.7801, -47.9292]);
          }, 500)
          this.gerarEventosMenuShape();
      } 
 


      if (!cgee && checkbox.checked === false) {
        const shapeLayer = that.menuShapesLayer[shapeId];
        const keysEdicao = Object.keys(shapeLayer._layers);
        if (keysEdicao.length > 0) {
          keysEdicao.forEach(key => {
            if (shapeLayer._layers[key]._layers) {
              const keysEdicao2 = Object.keys(shapeLayer._layers[key]._layers);
              if (keysEdicao2.length > 0) {
                keysEdicao2.forEach(key2 => {
                  shapeLayer._layers[key]._layers[key2].transform ? shapeLayer._layers[key]._layers[key2].transform.disable() : '';
                })
              }
            }
          })
        }
        shapeLayer.selecionado = false;
        this.layersGroup.removeLayer(shapeLayer);
        this.removerShapeSelecionado(layerName, shapeId );
        this.removeClassesTematicas({nome: layerName})
        this.descelecionarObjetosCamada(layerName);
        that.configurarAtributos();
        that.configurarTabelaAtributos();
      } else if(cgee && checkbox.checked === false) {
        that.formatarOverlaysTreeCGEE();
      }

      
    };

    checkboxes.forEach((checkBox: any) => {
      checkBox.addEventListener('click', carregarShape);

      const isChecked = checkBox.checked;
      const parent = checkBox.parentNode;
      const titleSpan = parent.querySelector('span');
      const titleDiv = titleSpan ? titleSpan.querySelector('span') : undefined;

      const styleCheck = checkBox.style;
      styleCheck.cursor = 'pointer';

      const icon = parent.querySelector('mat-icon');
      const iconRemoverMapaTematico = parent.getElementsByClassName('icon-remove-tematico')
      const iconDownloadCamadaCGEE = parent.getElementsByClassName('icon-download-camada-cgee')
      
      if (icon) {
        const isIconDownload = icon.getAttribute('download_icon');
        
        const style = icon.style;
        style.cursor = 'pointer';

        if (isChecked) {
          style.display = 'inline';
        }

        if(!isIconDownload) {
          icon.addEventListener('click', function(event) {
            let shapeId = titleDiv.getAttribute('data-id');
            let shapeLayer = that.menuShapesLayer[shapeId];
            that.openDialogPropriedades(shapeLayer, true);
          });
        }
      }

      if (iconRemoverMapaTematico.length > 0 && isChecked) {
       
        const styleRemoveMapa = iconRemoverMapaTematico.item(0)
        if (styleRemoveMapa['style'] != null) {

          styleRemoveMapa.style.display = 'inline'
          styleRemoveMapa.style.cursor = 'pointer';
        }
        for (var i = 0; i < iconRemoverMapaTematico.length; i++) {
          iconRemoverMapaTematico[i].addEventListener('click', function(_) {
            let shapeId = titleDiv.getAttribute('data-id');
            let shapeLayer = that.menuShapesLayer[shapeId];
            PcsUtil.swal().fire({
              title: 'Redefinir tema da camada?',
              text: ` Clique no SIM para confirmar.
                      Clique em NÃO para cancelar`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sim',
              cancelButtonText: 'Não',
              reverseButtons: false
            }).then((result) => {
              if (result.value) {
                 that.removeClassesTematicas({nome: shapeLayer.layerName})
                 that.removeClassesTematicas(shapeLayer)
                PcsUtil.swal().fire('', 'Tema da camada redefinido.', 'success');
              }
            });
          }, false);
        }
      }

      if(iconDownloadCamadaCGEE.length > 0 && isChecked) {
        
        const styleIconDownload = iconDownloadCamadaCGEE.item(0);

        if(iconDownloadCamadaCGEE['style'] != null) {
          styleIconDownload.style.display = 'inline'
          styleIconDownload.style.cursor = 'pointer';
        }
        for (var i = 0; i < iconDownloadCamadaCGEE.length; i++) {
          iconDownloadCamadaCGEE[i].addEventListener('click', function(e) {
            const camada = titleDiv.childNodes[0].nodeValue;
            const nomeParaDownload = `CamadaCGEE-${camada}`
            PcsUtil.swal().fire({
              title: 'Deseja realizar o download desta camada?',
              text: ` Clique no SIM para confirmar.
                      Clique em NÃO para cancelar`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sim',
              cancelButtonText: 'Não',
              reverseButtons: false
            }).then((result) => {
              if (result.value) {
                that.downloadShapeFileCGEE(nomeParaDownload);
              }
            });
          }, false);
        }
      } else if(iconDownloadCamadaCGEE.length > 0 && !isChecked) {
        const styleIconDownload = iconDownloadCamadaCGEE.item(0);

        if(iconDownloadCamadaCGEE['style'] != null) {
          styleIconDownload.style.display = 'none'
        }
      }

    });
  }

  public downloadShapeFileCGEE(nome: string) {
    this.loading = true;
    this.shapeFileService.downloadShapeFileCGEE(nome).subscribe(res => {
      const blob = new Blob([res], { type: 'application/octet-stream' });

      const nomeArquivo = nome.toLowerCase() + '.' + 'zip';
      saveAs(blob, nomeArquivo);
      this.loading = false;
    });
    
  }

  public formatarOverlaysTreeCGEE() {
    this.overlaysTree[1].collapsed = true;
    this.overlaysTree[2].collapsed = true;
    this.overlaysTree[3].collapsed = false;
    this.ctrlTree.setOverlayTree(this.overlaysTree);
    this.gerarEventosMenuShape();
  }




  public adicionarShapeSelecionado(shape: any, layerName: string, id: number) {
    this.shapesSelecionados.push({layerName, shape, id});
  }


  public removerShapeSelecionado(layerName: string, idShape) {
    this.shapesSelecionados = this.shapesSelecionados.filter((shape) => shape.layerName !== layerName);
    let indiceExclusao = null;
    for (let i = 0; i  < this.overlaysTree[0].children.length ; i++) {
      const child = this.overlaysTree[0].children[i];
      if (child.label.startsWith(`<span style="margin-left:10px" data-id='${idShape}'>`)) {
        indiceExclusao = i;
        break;
      }
    }
    if (indiceExclusao != null) {
      const arvore = this.overlaysTree[0].children;
      arvore.splice(indiceExclusao, 1);
      this.overlaysTree[0].children = arvore;
    }
    this.overlaysTree[3].collapsed = true
    this.ctrlTree.setOverlayTree(this.overlaysTree);
    this.gerarEventosMenuShape();
  }

  public removerBoasPraticasDoMapa() {
    this.painelFiltrosBoasPraticas = false;
    if (this.boasPraticasCarregadasNoMapa) {
      this.boasPraticasCarregadasNoMapa = false;
      this.boasPraticasFeatureGroup.getLayers().map(layer => {
        this.editableFeatureGroup.removeLayer(layer)
      });
      this.layerscontrol.removeLayer(this.boasPraticasFeatureGroup);
      this.layersGroup.removeLayer(this.boasPraticasFeatureGroup);
      this.removerShapeSelecionado('Municípios com Boas Práticas', 9999 );
      
      this.descelecionarObjetosCamada('Municípios com Boas Práticas');
      this.configurarAtributos();
      this.configurarTabelaAtributos();
      this.removerBoasPraticasCamadasEmExibicao('Municípios com Boas Práticas', 9999);
      
    }
  }

  removerBoasPraticasCamadasEmExibicao(layerName: string, idShape){
    let indiceExclusao = null;
    for (let i = 0; i  < this.overlaysTree[1].children.length ; i++) {
      const child = this.overlaysTree[1].children[i];
      if (child.label.startsWith(`<span style="margin-left:5px" data-id='${idShape}'`)) {
        indiceExclusao = i;
        break;
        
      }
    }
    if (indiceExclusao != null) {
      const arvore = this.overlaysTree[1].children;
      arvore.splice(indiceExclusao, 1);
      this.overlaysTree[1].children = arvore;
    }
    this.overlaysTree[3].collapsed = true
    this.ctrlTree.setOverlayTree(this.overlaysTree);
    this.gerarEventosMenuShape();
  }
  /* ./Filtro de Boas Práticas */

   /* Filtro de Variáveis */
  public carregarVariaveisNoMapa(cidadesComVariavelPreenchida: VariavelPreenchidaMapa[]) {
    this.painelFiltroVariaveis = false;
    if (cidadesComVariavelPreenchida.length === 0) {
      this.removerVariaveisDoMapa();
      PcsUtil.swal().fire({
        title: 'Resultado não encontrado!',
        text: `Não foi encontrado nenhum resultado com os filtros especificados`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });
    } else {
      if (this.variaveisCarregadasNoMapa) {
        this.layerscontrol.removeLayer(this.variaveisFeatureGroup);
        this.map.removeLayer(this.variaveisFeatureGroup);
      } else {
        this.variaveisCarregadasNoMapa = true;
      }

      this.variaveisFeatureGroup.eachLayer((l) => {
        this.variaveisFeatureGroup.removeLayer(l);
      });

      this.variaveisFeatureGroup.layerName = 'Variáveis por Município';
      this.idsCidadesVariaveis = new Array<string>();
      cidadesComVariavelPreenchida.forEach(variavelPreenchida => {
        const optionsPontos = {
          radius: 5,
          fillColor: this.getColor(1),
          color: '#ffffff',
          fillOpacity: 1,
          weight: 0.3,
          title: variavelPreenchida.nomeCidade + ' - Variável Preenchida',
          cidade: variavelPreenchida.nomeCidade,
          variavel: variavelPreenchida.nomeVariavel,
          valorTexto: variavelPreenchida.valorTextoPreenchido};
        const optionsShapes = {
            color: '#000022',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6,
            cidade: variavelPreenchida.nomeCidade,
            variavel: variavelPreenchida.nomeVariavel,
            valorTexto: variavelPreenchida.valorTextoPreenchido};
        if (!variavelPreenchida.visualizarComoPontos) {
          this.variaveisComPontos = false;
          if (variavelPreenchida.shapeZoneamento) {
            this.idsCidadesVariaveis.push(variavelPreenchida.idCidade);
          }
          this.adicionarShapes(this.variaveisFeatureGroup, variavelPreenchida.shapeZoneamento, `<strong>${variavelPreenchida.nomeCidade}</strong> <p>Variável: ${variavelPreenchida.nomeVariavel}</p> <p>Valor preenchido: ${variavelPreenchida.valorTextoPreenchido}</p>`, optionsShapes);
        } else {
          this.variaveisComPontos = true;
          this.adicionarPontos(this.variaveisFeatureGroup, variavelPreenchida.latitude, variavelPreenchida.longitude, variavelPreenchida.nomeCidade + ' - Variável Preenchida',
          `<strong>${variavelPreenchida.nomeCidade}</strong> <p>Variável: ${variavelPreenchida.nomeVariavel}</p> <p>Valor preenchido: ${variavelPreenchida.valorTextoPreenchido}</p>`, optionsPontos);
        }
      });

      this.variaveisFeatureGroup.getLayers().map(layer => {
        layer.addTo(this.editableFeatureGroup)
      })

      ///Remove Variáveis/////
      var shapeLayer = this.menuShapesLayer[9998];
      if (shapeLayer) {
        const shapeLayer = this.menuShapesLayer[9998];
        const keysEdicao = Object.keys(shapeLayer._layers);
        if (keysEdicao.length > 0) {
          keysEdicao.forEach(key => {
            if (shapeLayer._layers[key]._layers) {
              const keysEdicao2 = Object.keys(shapeLayer._layers[key]._layers);
              if (keysEdicao2.length > 0) {
                keysEdicao2.forEach(key2 => {
                  shapeLayer._layers[key]._layers[key2].transform ? shapeLayer._layers[key]._layers[key2].transform.disable() : '';
                })
              }
            }
          })
        }
        shapeLayer.selecionado = false;
        this.layersGroup.removeLayer(shapeLayer);
        //this.removerShapeSelecionado('Variáveis por Municípios', 9998 );
        this.descelecionarObjetosCamada('Variáveis por Municípios');
        this.configurarAtributos();
        this.configurarTabelaAtributos();
      }
      ///////////////////////////////


      this.variaveisFeatureGroup.selecionado = true;
      this.layersGroup.addLayer(this.variaveisFeatureGroup);
      //this.adicionarShapeSelecionado(this.variaveisFeatureGroup, 'Variáveis por Municípios', 9998);
      setTimeout(() => {
           this.compararListaDeCamadasEmExibicaoComDisponiveisSelecionadas();
      }, 1000)
      this.configurarAtributos();
      this.configurarTabelaAtributos();
    }
  }

  public removerVariaveisDoMapa() {
    this.painelFiltroVariaveis = false;
    if (this.variaveisCarregadasNoMapa) {
      this.variaveisCarregadasNoMapa = false;
      this.variaveisFeatureGroup.getLayers().map(layer => {
        this.editableFeatureGroup.removeLayer(layer)
      });
      this.layerscontrol.removeLayer(this.variaveisFeatureGroup);
      this.layersGroup.removeLayer(this.variaveisFeatureGroup);
      this.removerShapeSelecionado('Variáveis por Municípios', 9998 );
      this.descelecionarObjetosCamada('Variáveis por Município');
      this.configurarAtributos();
      this.configurarTabelaAtributos();
      this.gerarMenuShapes();
    }
  }

  /* ./Filtro de Variáveis */

  public definirCoordernadas() {
    if (this.latitude != null  && this.longitude != null && this.latitude != undefined  && this.longitude != undefined ) {
      if (this.marcadorLatLng == null) {
        this.marcadorLatLng = L.marker([this.latitude, this.longitude]).addTo(this.map);
      } else {
        this.marcadorLatLng._latlng.lat = this.latitude;
        this.marcadorLatLng._latlng.lng = this.longitude;
      }
      this.map.setZoom(10);
      this.map.setView([this.latitude, this.longitude]);
    }
  }

  public removerMarcadorDaCoordenada() {
    if ( this.marcadorLatLng ) {
      this.map.removeLayer(this.marcadorLatLng);
      this.marcadorLatLng = null;
      this.latitude = null;
      this.longitude = null;
      this.map.setZoom(1);
    }
  }

   /* Filtro de Indicadores */
   public carregarIndicadoresNoMapa(cidadesComIndicadorPreenchido: IndicadorPreenchidoMapa[]) {
    this.listaIndicadorPreenchidoMapa = cidadesComIndicadorPreenchido;
    this.painelFiltroIndicadores = false;
    if (cidadesComIndicadorPreenchido.length === 0) {
      this.removerIndicadoresDoMapa();
      PcsUtil.swal().fire({
        title: 'Resultado não encontrado!',
        text: `Não foi encontrado nenhum resultado com os filtros especificados`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });
    } else {
      if (this.indicadoresCarregadosNoMapa) {
        this.layerscontrol.removeLayer(this.indicadoesFeatureGroup);
        this.map.removeLayer(this.indicadoesFeatureGroup);
      } else {
        this.indicadoresCarregadosNoMapa = true;
      }

      this.indicadoesFeatureGroup.eachLayer((l) => {
        this.indicadoesFeatureGroup.removeLayer(l);
      });

      this.indicadoesFeatureGroup.layerName = 'Indicadores por Município';

      this.idsCidadesIndicadores = new Array<string>();
      
      cidadesComIndicadorPreenchido.forEach(indicadorPreenchido => {
        const optionsPontos = {
          radius: 5,
          fillColor: this.getColor(1),
          color: '#ffffff',
          fillOpacity: 1,
          weight: 0.3,
          title: indicadorPreenchido.nomeCidade + ' - Indicador Preenchido',
          cidade: indicadorPreenchido.nomeCidade,
          indicador: indicadorPreenchido.nomeIndicador,
          valor: indicadorPreenchido.valorPreenchido};
        const optionsShapes = {
            color: '#000022',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6,
            cidade: indicadorPreenchido.nomeCidade,
            indicador: indicadorPreenchido.nomeIndicador,
            valor: indicadorPreenchido.valorPreenchido};
        if (!indicadorPreenchido.visualizarComoPontos) {
          this.indicadoresComPontos = false;
          if (indicadorPreenchido.shapeZoneamento) {
            this.idsCidadesIndicadores.push(indicadorPreenchido.idCidade);
          }
          this.adicionarShapes(this.indicadoesFeatureGroup, indicadorPreenchido.shapeZoneamento, `<strong>${indicadorPreenchido.nomeCidade}</strong> <p>Indicador: ${indicadorPreenchido.nomeIndicador}</p> <p>Valor preenchido: ${indicadorPreenchido.valorPreenchido}</p>`, optionsShapes);
        } else {
          this.indicadoresComPontos = true;
          this.adicionarPontos(this.indicadoesFeatureGroup, indicadorPreenchido.latitude, indicadorPreenchido.longitude, indicadorPreenchido.nomeCidade + ' - Indicador Preenchido',
            `<strong>${indicadorPreenchido.nomeCidade}</strong> <p>Indicador: ${indicadorPreenchido.nomeIndicador}</p> <p>Valor preenchido: ${indicadorPreenchido.valorPreenchido}</p>`, optionsPontos);
        }

        this.nomeIndicadorRelatorioVisualizacao = indicadorPreenchido.nomeIndicador;
        this.idCidadeRelatorioVisualizacao = indicadorPreenchido.idCidade;
      });

      this.indicadoesFeatureGroup.getLayers().map(layer => {
        layer.addTo(this.editableFeatureGroup)
      });
      

      ///Remove Indicadores/////
      var shapeLayer = this.menuShapesLayer[9997];
      if (shapeLayer) {
        const shapeLayer = this.menuShapesLayer[9997];
        const keysEdicao = Object.keys(shapeLayer._layers);
        if (keysEdicao.length > 0) {
          keysEdicao.forEach(key => {
            if (shapeLayer._layers[key]._layers) {
              const keysEdicao2 = Object.keys(shapeLayer._layers[key]._layers);
              if (keysEdicao2.length > 0) {
                keysEdicao2.forEach(key2 => {
                  shapeLayer._layers[key]._layers[key2].transform ? shapeLayer._layers[key]._layers[key2].transform.disable() : '';
                })
              }
            }
          })
        }
        shapeLayer.selecionado = false;
        this.layersGroup.removeLayer(shapeLayer);
        //this.removerShapeSelecionado('Indicadores por Municípios', 9997 );
        this.descelecionarObjetosCamada('Indicadores por Municípios');
        this.configurarAtributos();
        this.configurarTabelaAtributos();
      }
      ///////////////////////////////

      this.indicadoesFeatureGroup.selecionado = true;
      this.layersGroup.addLayer(this.indicadoesFeatureGroup);
      //this.adicionarShapeSelecionado(this.indicadoesFeatureGroup, 'Indicadores por Municípios', 9997);
      setTimeout(() => {
        this.compararListaDeCamadasEmExibicaoComDisponiveisSelecionadas();
      }, 1000)
      this.configurarAtributos();
      this.configurarTabelaAtributos();
    }
  }

  public removerIndicadoresDoMapa() {
    this.painelFiltroIndicadores = false;
    if (this.indicadoresCarregadosNoMapa) {
      this.indicadoresCarregadosNoMapa = false;
      this.indicadoesFeatureGroup.getLayers().map(layer => {
        this.editableFeatureGroup.removeLayer(layer)
      });
      this.layerscontrol.removeLayer(this.indicadoesFeatureGroup);
      this.indicadorSelecionado = null;
      this.listaIndicadorPreenchidoMapa = null;
      this.layersGroup.removeLayer(this.indicadoesFeatureGroup);
      this.removerShapeSelecionado('Indicadores por Municípios', 9997);
      this.descelecionarObjetosCamada('Indicadores por Município');
      this.configurarAtributos();
      this.configurarTabelaAtributos();
      this.gerarMenuShapes();

    }
  }



  public filtroAtributos(text: any, records: any): any {
    return records;
  }

  public exportarShape(filtro: string) {
    this.loading = true;

    const features = [];
    
    let titulo;
    let mensagem;
    let nome = '';
    if (this.boasPraticasFeatureGroup != null && filtro.includes('boas praticas')) {
      if (this.boasPraticasComPontos) {
        this.boasPraticasFeatureGroup.getLayers().map(layer => {
          if (layer instanceof L.CircleMarker) {
             const gjson = layer.toGeoJSON();
             gjson.properties = layer.options;
             features.push(gjson);
          }
        });
        nome = 'Boas Práticas - Municípios.zip';
        titulo = 'Boas Práticas não encontrada!',
        mensagem = 'Não foi encontrada nenhum município com Boas Práticas';
      } else {
        this.shapeFileService.exportarShapeFileCidades(this.idsCidadesBoasPraticas).subscribe((response) => {
          saveAs(response, 'shapeFileBoasPraticasPorMunicipio.zip');
        });

      }
    } else  if (this.variaveisFeatureGroup != null && filtro.includes('variaveis')) {
      if (this.variaveisComPontos) {
        this.variaveisFeatureGroup.getLayers().map(layer => {
          if (layer instanceof L.CircleMarker) {
             const gjson = layer.toGeoJSON();
             gjson.properties = layer.options;
             features.push(gjson);
          }
        });
        nome = 'Variáveis - Municípios.zip';
        titulo = 'Variáveis não encontrada!',
        mensagem = 'Não foi encontrada nenhuma variável por município';
      } else {
        this.shapeFileService.exportarShapeFileCidades(this.idsCidadesVariaveis).subscribe((response) => {
          saveAs(response, 'shapeFileVariaveisPorMunicipio.zip');
        });

      }
    } else  if (this.indicadoesFeatureGroup != null && filtro.includes('indicadores')) {
      if (this.indicadoresComPontos) {
        this.indicadoesFeatureGroup.getLayers().map(layer => {
          if (layer instanceof L.CircleMarker) {
             const gjson = layer.toGeoJSON();
             gjson.properties = layer.options;
             features.push(gjson);
          }
        });
        nome = 'Indicadores - Municípios.zip';
        titulo = 'Indicadores não encontrado!',
        mensagem = 'Não foi encontrado nenhum indicador por município';

        if(this.nomeIndicadorRelatorioVisualizacao !== null && this.nomeIndicadorRelatorioVisualizacao !== undefined){
          this.relatorioVisualizaoCartografica.inserirRelatorio(this.nomeIndicadorRelatorioVisualizacao, this.idCidadeRelatorioVisualizacao).subscribe();
        }
        
      } else {
        this.shapeFileService.exportarShapeFileCidades(this.idsCidadesIndicadores).subscribe((response) => {
          saveAs(response, 'shapeFileIndicadoresPorMunicipio.zip');
        });
        if(this.nomeIndicadorRelatorioVisualizacao !== null && this.nomeIndicadorRelatorioVisualizacao !== undefined){
          this.relatorioVisualizaoCartografica.inserirRelatorio(this.nomeIndicadorRelatorioVisualizacao, this.idCidadeRelatorioVisualizacao).subscribe();
        }
       
      }
      this.loading = false;
    }

    if (features.length > 0) {
      this.shapeFileService.exportarShapeFile(features, filtro).subscribe((response) => {
        saveAs(response, nome);
      });
    } else if (titulo != null) {
      PcsUtil.swal().fire({
        title: titulo,
        text: mensagem,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });
    }
  }

  public carregarPontosImportadosNoMapa(pontosImportados: LatLong[]) {
    pontosImportados.forEach(ponto => {
      if (ponto.longitude && ponto.latitude) {

        const marker: L.circleMarker = L.circleMarker([ponto.latitude, ponto.longitude], Object.assign( {
          radius: 10,
          fillColor: this.getColor(1),
          color: '#ffffff',
          fillOpacity: 1,
          draggable: true,
          weight: 0.3
        } , ponto.atributos ));


        marker.dragging.disable();

        marker.setStyle(this.stylelayer.default);
        marker.on('click', () => {
          this.triggerScrollTo();
        });
        this.adicionarContextMenu(marker, 'Edição');

        marker.properties = ponto.atributos;
        if (this.modoEdicao) {
          marker.on('click', () => {
            this.prepararAtributos(marker.properties, marker);
            this.triggerScrollTo();
            this.changeDetectorRefs.detectChanges();
          });
        } else {
          marker.on('click', (e) => {
            this.selecionarLayer(e);
            this.triggerScrollTo();
          });
        }
        this.editableFeatureGroup.addLayer(marker);
        this.pontosImportadosFeatureGroup.addLayer(marker);
      }
    });
    PcsUtil.swal().fire('Arquivo importado', 'Os pontos importados foram acrescentados ao mapa.', 'success').then(() => {
      this.configurarAtributos();
      this.configurarTabelaAtributos();
      this.fecharMenuSIG();
    });
  }

  public removerPontosImportados() {
    this.pontosImportadosFeatureGroup.getLayers().map(layer => {
      this.editableFeatureGroup.removeLayer(layer);
    });
    this.pontosImportadosFeatureGroup.clearLayers();
  }

  public salvarNovaCamadaShapeFile(shapeFileMerged: ShapeFileMerged ) {
    let  features = null;
    if (this.boasPraticasCarregadasNoMapa) {
      features = this.populateFeatures(this.boasPraticasFeatureGroup, features);
      this.removerBoasPraticasDoMapa();
    }
    if (this.variaveisCarregadasNoMapa) {
      features = this.populateFeatures(this.variaveisFeatureGroup, features);
      this.removerVariaveisDoMapa();
    }
    if (this.indicadoresCarregadosNoMapa) {
      features = this.populateFeatures(this.indicadoesFeatureGroup, features);
      this.removerIndicadoresDoMapa();
    }
    if (this.editableFeatureGroup && this.editableFeatureGroup.getLayers().length > 0) {
      features = this.populateFeatures(this.editableFeatureGroup, features);
      this.editableFeatureGroup.clearLayers();
    }
    if (this.layersMerged) {
      features = this.populateFeatures(this.layersMerged, features);
      this.layersMerged.clearLayers();
      this.layerscontrol.removeLayer(this.layersMerged);
      this.map.removeLayer(this.layersMerged);
    }

    // Shapes selecionados
    if (this.shapesSelecionados) {
      for (const objeto of this.shapesSelecionados) {
        const layers = objeto.shape._layers;
        const indices = Object.getOwnPropertyNames(layers);
        const camadaLayers: any = {
          layersObj: new Array(),
          getLayers(): any[] {
            return this.layersObj;
          }
        };
        for (const i of indices) {
          const layer = layers[i];
          camadaLayers.layersObj.push(layer);
          this.map.removeLayer(layer);
        }
        features = this.populateFeatures(camadaLayers, features);
      }
    }
    if (features) {
      this.layersMerged = L.markerClusterGroup({
        maxClusterRadius: 30,
        iconCreateFunction(cluster) {
          const childCount = cluster.getChildCount();
          let c = ' marker-cluster-';
          if (childCount > 0) {
            c += 'large';
          }
          return new L.DivIcon({
            html: '<div><span>' + childCount + '</span></div>',
            className: 'marker-cluster' + c,
            iconSize: new L.Point(40, 40)
          });
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });
      this.adicionarShapesLayersMerged(this.layersMerged, features, true);
      this.layersGroup.addLayer(this.layersMerged);
    }
    if (features) {
      shapeFileMerged.tipoArquivo = 'SHP';

      if ( this.objetosSelecionados.length > 0 ) {
        PcsUtil.swal().fire({
          title: 'Alguns objetos foram selecionados',
          text: `Como deseja criar a nova camada?`,
          type: 'info',
          allowOutsideClick: false,
          showCancelButton: false,
          confirmButtonText: 'Apenas os Selecionados',
          input: 'select',
          inputOptions : {
            selecionados: 'Apenas os Selecionados',
            naoSelecionados: 'Só objetos não Selecionados',
            todos: 'Todos os objetos',
          }
        }).then((result) => {
          const procedimento = result.value;
          switch (procedimento) {
            case 'selecionados':
              shapeFileMerged.features = [];
              for (const iFeature of features) {
                if (this.objetosSelecionados.indexOf(iFeature._leaflet_id) > -1) {
                  shapeFileMerged.features.push(iFeature);
                }
              }
              break;
            case 'naoSelecionados':
              shapeFileMerged.features = [];
              for (const iFeature of features) {
                if (this.objetosSelecionados.indexOf(iFeature._leaflet_id) === -1) {
                  shapeFileMerged.features.push(iFeature);
                }
              }
              break;
            case 'todos':
              shapeFileMerged.features = features;
              break;
          }
          this.leafletUtil.duplicarAtributos(shapeFileMerged.features);
          this.leafletUtil.definirAtributosNulos(shapeFileMerged.features);
          this.shapeItemService.inserirNovaCamadaShapeFile(shapeFileMerged).subscribe(async response => {
            this.removerTodosTransformsDoMapa();
            if (response.shapePertenceAPrefeitura && !response.temIntersecacoNaAreaDaPrefeitura) {
              this.mostrarAlertaShapeForaDoMunicipio();
            } else {
              this.mostrarAlertaShapeCadastrado(response.idShapeFile);
            }
          }, error => {
            this.mostrarAlertaShapeForaDoMunicipio();
          });
          this.limparFeatureGroups();
          this.descelecionarObjetos();
          this.removerTodosTransformsDoMapa();
        });
      } else {
        shapeFileMerged.features = features;
        this.leafletUtil.duplicarAtributos(shapeFileMerged.features);
        this.leafletUtil.definirAtributosNulos(shapeFileMerged.features);
        this.shapeItemService.inserirNovaCamadaShapeFile(shapeFileMerged).subscribe(async response => {
          this.removerTodosTransformsDoMapa();
          if (response.shapePertenceAPrefeitura && !response.temIntersecacoNaAreaDaPrefeitura) {
            this.limparFeatureGroups();
            this.mostrarAlertaShapeForaDoMunicipio();
          } else {
            this.limparFeatureGroups();
            this.mostrarAlertaShapeCadastrado(response.idShapeFile);
          }
        }, error => {
          this.limparFeatureGroups();
          this.mostrarAlertaShapeForaDoMunicipio();
        });

        this.descelecionarObjetos();
        this.removerTodosTransformsDoMapa();
      }
    } else {
      this.mostrarAlertaCamadaSemShape();
    }
  }

  public mostrarAlertaCamadaSemShape() {
    PcsUtil.swal().fire({
      title: 'Não foi possível salvar a camada',
      text: `Desenhe ao menos um Objeto no Mapa.`,
      type: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
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
        this.layersMerged.clearLayers();
        this.layersGroup.removeLayer(this.layersMerged);
       
        this.gerarMenuShapes();
        
        setTimeout(() => {
          const checkboxes: any = document.querySelectorAll('input[type=checkbox]');
          checkboxes.forEach((c) => {
            if(c.checked){
              c.click();
            }
            c.checked = false;
          });
          checkboxes.forEach((c) => {
            const parent = c.parentNode;
            const titleSpan = parent.querySelector('span');
            const titleDiv = titleSpan ? titleSpan.querySelector('span') : undefined;
            if (titleDiv) {
              const shapeId = titleDiv.getAttribute('data-id');
              if (shapeId == idShapeFile) {
                c.click();
                c.checked = true;
              }
            }
          });
        }, 1000);

      }, error => { });
  }

  public mostrarAlertaShapeForaDoMunicipio() {
    PcsUtil.swal().fire({
      title: 'Camada fora dos limites do município',
      text: 'A camada foi salva, porém se encontra fora dos limites do município.',
      type: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
      this.layersMerged.clearLayers();
      this.layersGroup.removeLayer(this.layersMerged);
      this.gerarMenuShapes();
    }, error => { });
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

  private adicionarShapesLayersMerged(featureGroup: any, features: any[], isNovaCamada: boolean) {
    this.loading = true;
    if (features) {
      features.forEach(feature => {
        //this.recebeFeatureParaVerificarTipo(feature);
        // const title = '';
        // if (!isNovaCamada && feature.properties) {
        //   for (const key in feature.properties) {
        //     if (feature.properties.hasOwnProperty(key)) {
        //           const element = feature.properties[key];
        //           title = title + key + ' : ' + element + ' | ';
        //     }
        //   }
        //   if (title) {
        //     feature.properties.title = title;
        //   } else {
        //     feature.properties.title = ' ';
        //   }
        // }
        if (feature.geometry.type.includes('Point') && feature.properties.radius != undefined) {
          const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
          const optionsPontos = {
            radius: feature.properties.radius,
            color: '#666666',
            fillColor : '#c0c3ac',
            weight: 5,
            fillOpacity: .5,
            strokeOpacity: 0.5,
            draggable: true,
            opacity: 1};
          const options = $.extend(optionsPontos, feature.properties);
          const circle = L.circle([coordenadas[1], coordenadas[0]], options);
          circle.setStyle(this.stylelayer.default);
          circle.properties = feature.properties;

          circle.dragging.disable();

          circle.on('click', () => {
            this.triggerScrollTo();
          });
          this.adicionarContextMenu(circle , featureGroup.layerName);
          circle.on('click', (e) => {
            this.selecionarLayer(e);
          });
          circle.addTo(featureGroup);
        } else if (feature.geometry.type.includes('Point') && feature.properties.radius == undefined) {
        delete feature.properties.radius;
        const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
        const optionsPontos = {
            radius: 5,
            color: '#666666',
            fillColor : '#c0c3ac',
            weight:  0.3,
            fillOpacity: .5,
            strokeOpacity: 0.5,
            draggable: true,
            opacity: 1
        };
        const options = $.extend(optionsPontos, feature.properties);
        const marker: L.circleMarker = L.circleMarker([coordenadas[1], coordenadas[0]], options);
        marker.properties = feature.properties;
        marker.setStyle(this.stylelayer.default);

        marker.dragging.disable();

        marker.on('click', () => {
            this.triggerScrollTo();
          });
        marker.on('click', (e) => {
            this.selecionarLayer(e);
          });
        this.adicionarContextMenu(marker, featureGroup.layerName);
        marker.addTo(featureGroup);

      } else if (feature.geometry.type.includes('MultiLineString')) {
          const optionsLine = {
            color: '#666666',
            weight: 4,
            opacity: 0.5,
            draggable: true,
            transform: true
          };
          feature.properties.layerType = feature.geometry.type;
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

          polyline.dragging.disable();

          polyline.properties = feature.properties;
          polyline.on('click', () => {
              this.triggerScrollTo();
            });
          polyline.on('click', (e) => {
            this.selecionarLayer(e);
          });
          this.adicionarContextMenu(polyline, featureGroup.layerName);
          polyline.addTo(featureGroup);

        } else if (feature.geometry.type.includes('LineString')) {
          const optionsLine = {
            color: '#666666',
            weight: 4,
            opacity: 1,
            draggable: true,
            transform: true
        };
          feature.properties.layerType = feature.geometry.type;
          const options = $.extend(optionsLine, feature.properties);
          const points = [];
          feature.geometry.coordinates.map(coordinate => {
            const point = [];
            point.push(coordinate[1]);
            point.push(coordinate[0]);
            points.push(point);
          });
          const polyline: L.polyline = L.polyline(points, options);

          polyline.dragging.disable();

          polyline.properties = feature.properties;
          polyline.on('click', () => {
              this.triggerScrollTo();
            });
          polyline.on('click', (e) => {
            this.selecionarLayer(e);
          });
          this.adicionarContextMenu(polyline, featureGroup.layerName);
          polyline.addTo(featureGroup);
          } else {
          const optionsShapes = {
            color: '#666666',
            fillColor : '#c0c3ac',
            weight: 5,
            fillOpacity: .5,
            strokeOpacity: 0.5,
            draggable: true,
            transform: true,
            opacity: 1
          };

          feature.properties.layerType = feature.geometry.type;
          // const options = $.extend(optionsShapes, feature.properties);

          const geoJson = geoJSON([feature], optionsShapes);

          if(geoJson._layers){
            const keys = Object.keys(geoJson._layers);
            keys.forEach(key => {
                geoJson._layers[key].dragging.disable();
              })
          }

          geoJson.setStyle(this.stylelayer.default);
          geoJson.on('click', (e) => {
            this.triggerScrollTo();

            if (this.modoDeletarShape) {
              const shapeId = e.layer.feature.shapeId;

              PcsUtil.swal().fire({
                title: 'Deseja Continuar?',
                text: `Deseja realmente excluir a Camada selecionada?`,
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                reverseButtons: false
              }).then((result) => {
                if (result.value) {
                  this.shapeFileService.excluirShapeFilePorId(shapeId).subscribe(response => {
                    this.map.removeLayer(e.layer);
                    PcsUtil.swal().fire('Excluído!', `Camada excluída.`, 'success');
                  });
                }
              }, (error) => {
                this.modoDeletarShape = false;
              });
            }
          });

          geoJson.on('click', (e) => {
            this.selecionarLayer(e);
          });
          this.adicionarContextMenu(geoJson, featureGroup.layerName);
          geoJson.addTo(featureGroup);
        }
      });
    }
    this.loading = false;
  }

  private propriedadesToString(properties: any, nomeCamada: string): string {
    let aux = nomeCamada ? `Camada : ${nomeCamada}<br>` : '';
    if (properties) {
      for (const proper in properties) {
        if (properties.hasOwnProperty(proper)) {
          if ((proper !== 'title') && (proper !== 'layerType')) {
            if (properties[proper] != null && properties[proper].length != 0) {
              let element = properties[proper];
            
              if (element.length == 0  ) {
                element = 'N/A' ;
              }

              if(!this.isNumber(element) && (element.includes('http') || element.includes('https'))) {
                  aux = `${aux} ${proper} : <a href="${element}" target="_blank">${element}</a> <br>`;
              } else if(this.isNumber(element)) {
                let elementFormated = element.toLocaleString('pt-BR');
                aux = `${aux} ${proper} : ${elementFormated} <br>`
              } else {
                aux = aux + proper + ' : ' + element + ' <br> ';
              }
              
            }
          }
        }
      }
    }
    return aux;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  private propriedadesToStringObjectComplete(objeto: any, nomeCamada: string): string {
    let aux = nomeCamada ? `Camada : ${nomeCamada}<br>` : '';
    if (objeto._latlng) {
      aux = aux + 'latitude : ' + objeto._latlng.lat + '<br>';
      aux = aux + 'longitude : ' + objeto._latlng.lng + '<br>';
    }
    return aux;

  }


  public sairModoEdicao(salvarShape: boolean) {


    if (salvarShape) {
      this.editarShapFile(salvarShape);
    }

    this.baseTree = {
    };

    this.overlaysTree = [
      {
        label: '<b>Camadas em exibição</b>',
        children: []
      }, {
        label: '<b>Camadas PCS</b>',
        children: []
      }, {
        label: '<b>Camadas Prefeitura</b>',
        children: []
      }, {
        label: '<b>Camadas CGEE/OICS</b>',
        children: []
    }];

    this.gerarMenuShapes();

    this.editableFeatureGroup.clearLayers();

    this.modoEdicao = false;

    this.map.removeControl(this.modoEditarShapeBtn);
    this.map.removeControl(this.modoSairEditarShapeBtn);
    this.modoEditarShapeBtn = null;
    this.modoSairEditarShapeBtn = null;

    this.mostrarCrtlExport();
    this.mostrarCtrlExportarAtributosECoordenadas();

    //this.mostrarCrtlBtnSelecionarShapes();

    this.mostrarCtrlHabilitaModoImpressao();

    this.tituloShapeFileEditar = '';
    this.idShapeFileEditar = null;

    this.descelecionarObjetos();
    this.configurarAtributos();
    this.configurarTabelaAtributos();


  }

  public initModoEdicaoShapeParaEditar(idShapeFile: number) {
    let shapeLegendaTematica;
    this.shapesSelecionados.forEach(item => {
      shapeLegendaTematica = { nome: item.layerName, layers: item.shape.getLayers() }
      this.removeClassesTematicas(shapeLegendaTematica);
    })
    
    this.menuShapesLayerCGEE.forEach(item => {
      this.map.removeLayer(item);
    });

    this.menuShapesLayerCGEE = [];


    this.modoEdicao = true;

    this.menuShapesLayer.forEach(item => {
      this.map.removeLayer(item);
    });

    this.menuShapesLayer = [];

    this.map.removeControl(this.ctrlExport);
    this.map.removeControl(this.ctrlTree);
    //this.map.removeControl(this.ctrlSelecaoShapes);
    this.map.removeControl(this.modoHabilitarImpressao);
    this.map.removeControl(this.ctrlExportarAtributosECoordenadas);
    this.ctrlTree = null;
    this.ctrlTree = null;

    let _this = this;

    if (!this.modoEditarShapeBtn) {
      this.modoEditarShapeBtn = new L.Control({position: 'topright'}); this.modoEditarShapeBtn.onAdd = () => {
        const buttonEditarSair = L.DomUtil.create('input', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
        buttonEditarSair.width = 1;
        buttonEditarSair.type = 'button';
        buttonEditarSair.title = 'Salvar os Shapes e Sair do Modo de Edição';
        buttonEditarSair.value = 'Salvar e Sair';
        buttonEditarSair.onclick = function() {
            PcsUtil.swal().fire({
              title: 'Salvar e Sair do modo de Edição?',
              text: ` Clique no SIM para confirmar.
                      Clique em NÃO para cancelar`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sim',
              cancelButtonText: 'Não',
              reverseButtons: false
            }).then((result) => {
              if (result.value) {
                _this.sairModoEdicao(true);
              }
            });
        };
        return buttonEditarSair;
      };
      this.modoEditarShapeBtn.addTo(this.map);
    }

    if (!this.modoSairEditarShapeBtn) {
      this.modoSairEditarShapeBtn = new L.Control({position: 'topright'}); this.modoSairEditarShapeBtn.onAdd = () => {
        const buttonEditarSair = L.DomUtil.create('input', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
        buttonEditarSair.width = 1;
        buttonEditarSair.type = 'button';
        buttonEditarSair.title = 'Sair do Modo de Edição';
        buttonEditarSair.value = 'Sair';
        buttonEditarSair.onclick = function() {
            PcsUtil.swal().fire({
              title: 'Deseja sair do modo de Edição sem Salvar?',
              text: ` Clique no SIM para confirmar.
                      Clique em NÃO para cancelar`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sim',
              cancelButtonText: 'Não',
              reverseButtons: false
            }).then((result) => {
              _this.removerTodosTransformsDoMapa();
              if (result.value) {
                _this.sairModoEdicao(false);
              }
            });
        };
        return buttonEditarSair;
      };
      this.modoSairEditarShapeBtn.addTo(this.map);
    }

    this.editableFeatureGroup.clearLayers();

    this.limparFeatureGroups();

    this.carregarShapeParaEditar(idShapeFile);

    this.fecharMenuSIG();
  }

  public verificarTipoAtributos(feature){
    let _this = this;
    const featureRef = Object.entries(feature);
    for(const atributo of featureRef) {
      if(atributo){
        _this.listaTiposAtributos.push({nome: atributo[0], tipo: atributo[1] ? typeof atributo[1] : null });
      }
    }
  }

  public recebeFeatureParaVerificarTipo(feature){
    let shapeFileFeature = feature;

    if (shapeFileFeature) { 
        this.verificarTipoAtributos(shapeFileFeature.properties);
       
    } else if (shapeFileFeature._layers) {
        const layers = shapeFileFeature._layers;
        const indices = Object.getOwnPropertyNames(layers);
        for (const i of indices) {
          if (shapeFileFeature.filtros){
              this.verificarTipoAtributos(shapeFileFeature.properties);
          } else {
              this.verificarTipoAtributos(shapeFileFeature.feature.properties);
          }
        }
      };
  }
    
  private carregarShapeParaEditar(idShapeFile: number) {
    this.loading = true;
    this.descelecionarObjetos();

    this.idShapeFileEditar = idShapeFile;

    this.shapeFileService.buscarShapeFilePorId(idShapeFile).subscribe(shapeFile => {
      this.shapeFileParaEditar = shapeFile;
      this.tituloShapeFileEditar =  shapeFile.titulo;
      let _this = this;

      //this.removeClassesTematicas(shapeFile.shapes);
      this.recebeFeatureParaVerificarTipo(shapeFile.shapes[0]);

      shapeFile.shapes.map(feature => {
        
        if (feature.geometry.type == 'MultiPolygon') {
          const optionsStyle = {
            color: '#666666',
            fillColor : '#c0c3ac',
            weight: 1,
            fillOpacity: .5,
            strokeOpacity: 0.5,
            fill : true,
            draggable: true,
            transform: true
          };

          const propriedades = feature.properties;
          const lenghtCoords = feature.geometry.coordinates.length;
          const idShapePai = feature.id;
          let layerGroupMultiPolygon = null;

          feature.geometry.coordinates.forEach(function(shapeCoords, i) {
            
            const polygon = {type: 'Polygon', coordinates: shapeCoords, properties: propriedades, idShapePai: idShapePai };

            L.geoJson(polygon, {
              onEachFeature(feature, layerFeature) {
                var polygonAux = L.polygon(layerFeature._latlngs, optionsStyle);
                  polygonAux.properties = propriedades;
                  polygonAux['layerType'] = 'polygon';
                  polygonAux.on('click', (e) => {
                    _this.selecionarLayer(e);
                    _this.triggerScrollTo();
                  });
               if(polygonAux.dragging){
                  polygonAux.dragging.disable();
                }
                if(polygonAux.transform){
                  polygonAux.transform.disable();
                }

                let ctxReference = function(objRef){
                  var ctx = {
                    contextmenu: true,
                    contextmenuInheritItems: false,
                    contextmenuItems: [
                      { text: 'Editar Atributos',  callback: (evt) => { _this.prepararAtributos(objRef.properties, polygon); _this.changeDetectorRefs.detectChanges(); } },
                      { text: 'Editar Shape',  callback: (evt) => {
                        if (!objRef.editing._enabled) {
                          objRef['_context'] = null;
                          objRef['_objetosNovos'] = null;
                          if (objRef.properties.layerType == 'LineString') {
                            if (objRef.editing._enabled) {
                              objRef.editing.disable();
                              objRef.setStyle(_this.stylelayer.lineDefecto);
                            } else {
                              objRef.editing.enable();
                              objRef.setStyle(_this.stylelayer.selected);
                            }
                          } else {
                            if (objRef.editing._enabled) {
                              objRef.editing.disable();
                              if(objRef.properties.layerType !== 'marker'){
                                objRef.setStyle(_this.stylelayer.default);
                              }
                            } else {
                              objRef.editing.enable();
                              if(objRef.properties.layerType !== 'marker'){
                                objRef.setStyle(_this.stylelayer.selectedPathOptions);
                              }
                            }
                          }
                          
                          if(objRef.dragging) {
                            objRef.dragging.disable();
                          }
                          if(objRef.transform){
                            objRef.transform.disable();
                          }
        
                          if (objRef.editing._enabled) {
                            if(objRef['layerType'] == 'circle'){
                              const circle = new L.Circle(objRef._latlng,objRef.options);
                              circle['layerType'] = objRef['layerType'];
                              circle['properties'] = objRef['properties'];
                              objRef['_before'] = circle;
                            } else if(objRef['layerType'] == 'circlemarker'){
                              const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                              circleMarker['layerType'] = objRef['layerType'];
                              circleMarker['properties'] = objRef['properties'];
                              objRef['_before'] = circleMarker;
                            }else{
                              const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                                style:  objRef.options,
                              });
                
                              geoJson['layerType'] = objRef['layerType'];
                              geoJson['properties'] = objRef['properties'];
                        
                              _this.adicionarContextMenu(geoJson, 'Edição');
                              if(geoJson['layerType'] !== 'marker'){
                                geoJson.setStyle(_this.stylelayer.lineDefecto);
                              }
                              if(geoJson._layers){
                                const keysEdicao = Object.keys(geoJson._layers);
                                if (keysEdicao.length > 0) {
                                  keysEdicao.forEach(key => {
                                    geoJson._layers[key]['properties'] = objRef['properties'];
                                    if(geoJson._layers[key].transform){
                                      geoJson._layers[key].transform.disable()
                                    }
                                    if(geoJson._layers[key].dragging){
                                      geoJson._layers[key].dragging.disable()
                                    }
                                  })
                                }
                              }
                              objRef['_before'] = geoJson;
                              objRef['_context'] = true;
                            }
                          }
                      }
      
                      }, },
                      { text: 'Mesclar Objetos',  callback: (evt) => {
                        _this.mesclarObjetos();
                      }},
                      { text: 'Cortar Objetos',  callback: (evt) => {
                        _this.cortarObjetos(objRef);
                      }},
                      { text: 'Separar Objetos',  callback: (evt) => {
                        _this.separarObjetos(objRef);
                      }},
                      { text: 'Snap To',  callback: (evt) => {
                        if (!objRef.editing._enabled) {
                          objRef['_context'] = null;
                          objRef['_objetosNovos'] = null;
                          if(objRef.transform && objRef.dragging) {
                            objRef.transform.disable();
                            objRef.dragging.disable();
                          }
            
                          if(!objRef.snapediting){
                            objRef.snapediting = new L.Handler.PolylineSnap(_this.map, objRef);
                            objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                          }
                          if(objRef['snap']){
                            objRef.snapediting.disable();
                            objRef.setStyle(_this.stylelayer.lineDefecto);
                          }else{
                            if(objRef['layerType'] == 'circle'){
                              const circle = new L.Circle(objRef._latlng,objRef.options);
                              circle['layerType'] = objRef['layerType'];
                              circle['properties'] = objRef['properties'];
                              objRef['_before'] = circle;
                            } else if(objRef['layerType'] == 'circlemarker'){
                              const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                              circleMarker['layerType'] = objRef['layerType'];
                              circleMarker['properties'] = objRef['properties'];
                              objRef['_before'] = circleMarker;
                            }else{
                              const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                                style:  objRef.options,
                              });
                              geoJson['layerType'] = objRef['layerType'];
                              geoJson['properties'] = objRef['properties'];
                        
                              _this.adicionarContextMenu(geoJson, 'Edição');
                              if(geoJson['layerType'] !== 'marker'){
                                geoJson.setStyle(_this.stylelayer.lineDefecto);
                              }
                              if(geoJson._layers){
                                const keysEdicao = Object.keys(geoJson._layers);
                                if (keysEdicao.length > 0) {
                                  keysEdicao.forEach(key => {
                                    geoJson._layers[key]['properties'] = objRef['properties'];
                                    if(geoJson._layers[key].transform){
                                      geoJson._layers[key].transform.disable()
                                    }
                                    if(geoJson._layers[key].dragging){
                                      geoJson._layers[key].dragging.disable()
                                    }
                                  })
                                }
                              }
                              objRef['_before'] = geoJson;
                              objRef['_context'] = true;
                            }
            
                            objRef.snapediting.enable();
                            if (objRef.properties && objRef.properties.layerType && objRef.properties.layerType == 'LineString') {
                              objRef.setStyle(_this.stylelayer.selected);
                            } else {
                              objRef.setStyle(_this.stylelayer.selectedPathOptions);
                            }
                          }
                          
                          objRef['snap'] ? objRef['snap'] =  false : objRef['snap'] =  true;
                        }
          
                        }
                      },
                      { text: 'Mover/Rotacionar Objeto',  callback: (evt) => {
                        objRef['_context'] = null;
                        objRef['_objetosNovos'] = null;
                        if(objRef.transform && !objRef.transform._enabled) {
                          objRef.transform.enable();
                        }

                        if(objRef.dragging && !objRef.dragging._enabled) {
                          objRef.dragging.enable();
                        }

                        
                        if(objRef.transform && objRef.dragging) {

                          if(objRef.transform._enabled || objRef.dragging._enabled){
                            let shape = cloneLayer(objRef);
                            shape['properties'] = objRef.properties;
                            shape['layerType'] = objRef.layerType;
                            objRef['_before'] = shape;
                          } 

                        }

                      }},


                      { text: 'Desfazer última ação',  callback: (evt) => {
                        var obj = objRef['_before'];
                        var isBindCtx = objRef['_context'];

                        var objNovos = objRef['_objetosNovos'];
                        if(objNovos){
                          objNovos.forEach((obj) => {
                            obj.removeFrom(_this.map);
                          });
                        }

                        if(obj && obj.length){
        
                          obj.forEach((objAux) => {
                            if(objAux){
                              if(!isBindCtx){
                                objAux.bindContextMenu(ctxReference(objAux));
                              }
                              objAux.snapediting = new L.Handler.PolylineSnap(_this.map, objAux);
                              objAux.snapediting.addGuideLayer(_this.editableFeatureGroup);
                              objAux.addTo(_this.editableFeatureGroup);
                              if(objAux.layerType !== 'marker'){
                                objAux.setStyle(_this.stylelayer.default);
                              }
                              objAux.on('click', (e) => {
                                _this.selecionarLayer(e);
                                _this.triggerScrollTo();
                              });
            
            
                              if(objAux.dragging) {
                                objAux.dragging.disable();
                              }
                              if(objAux.transform) {
                                objAux.transform.disable();
                              }
            
                              if(objRef.dragging) {
                                objRef.dragging.disable();
                              }
                              if(objRef.transform) {
                                objRef.transform.disable();
                              }
            
                              var id = objRef._leaflet_id;
                              const indice = _this.objetosSelecionados.indexOf(id);
                              _this.objetosSelecionados.splice(indice, 1);
                              _this.objetosSelecionadosMap.delete(id);

                              objRef.removeFrom(_this.map);
                              _this.editableFeatureGroup.removeLayer(objRef);
            
                            }
                          })
                        } else if(obj){
        
                          if(!isBindCtx){
                            obj.bindContextMenu(ctxReference(obj))
                          }
                          obj.snapediting = new L.Handler.PolylineSnap(_this.map, obj);
                          obj.snapediting.addGuideLayer(_this.editableFeatureGroup);
                          obj.addTo(_this.editableFeatureGroup);
                          if(obj.layerType !== 'marker'){
                            obj.setStyle(_this.stylelayer.default);
                          }
                          obj.on('click', (e) => {
                            _this.selecionarLayer(e);
                            _this.triggerScrollTo();
                          });
        
        
                          if(obj.dragging) {
                            obj.dragging.disable();
                          }
                          if(obj.transform) {
                            obj.transform.disable();
                          }
        
                          if(objRef.dragging) {
                            objRef.dragging.disable();
                          }
                          if(objRef.transform) {
                            objRef.transform.disable();
                          }
        
                          var id = objRef._leaflet_id;
                          const indice = _this.objetosSelecionados.indexOf(id);
                          _this.objetosSelecionados.splice(indice, 1);
                          _this.objetosSelecionadosMap.delete(id);

                          objRef.removeFrom(_this.map);
                          _this.editableFeatureGroup.removeLayer(objRef);
                        }

                        var layer = _this.editableFeatureGroup._layers[objRef._leaflet_id + 1];
                        if(layer){
                          _this.editableFeatureGroup.removeLayer(layer);
                        }
                        _this.configurarAtributos();
                        _this.configurarTabelaAtributos();
                      }},


                      { text: 'Sair',  callback: (evt) => {
                        if (objRef.snapediting) {
                          objRef.snapediting.disable();
                          objRef['snap'] = false;
                          if(objRef.properties.layerType !== 'marker'){
                            objRef.setStyle(_this.stylelayer.lineDefecto);
                          }
                        }
                        if (objRef.properties.layerType == 'LineString') {
                          if (objRef.editing && objRef.editing._enabled) {
                            objRef.editing.disable();
                            objRef.setStyle(_this.stylelayer.lineDefecto);
                          }
                        } else if (objRef.editing && objRef.editing._enabled) {
                          objRef.editing.disable();
                          if(objRef.properties.layerType !== 'marker'){
                            objRef.setStyle(_this.stylelayer.default);
                          }
                        }
                        if(objRef.dragging) {
                          objRef.dragging.disable();
                        }
                        if(objRef.transform) {
                          objRef.transform.disable();
                        }
                      }, }
                    ]
                  }
                  return ctx;
                }
                polygonAux.bindContextMenu(ctxReference(polygonAux));

                if(lenghtCoords > 1) {
                  if(!layerGroupMultiPolygon) {
                    layerGroupMultiPolygon = L.layerGroup();
                  }
                  layerGroupMultiPolygon['idShapePai'] = idShapePai;
                  layerGroupMultiPolygon['check'] = true;
                  layerGroupMultiPolygon['properties'] = propriedades;
                  layerGroupMultiPolygon['options'] = optionsStyle;

                  layerGroupMultiPolygon.addLayer(polygonAux);
                  
                } else {
                  polygonAux.addTo(_this.editableFeatureGroup);
                }
              }
            });
          });
          if(layerGroupMultiPolygon) {
            layerGroupMultiPolygon.addTo(_this.editableFeatureGroup)
          }
         
        }
        
        if (feature.geometry.type == 'Polygon') {
          const options = {
              color: '#666666',
              fillColor : '#c0c3ac',
              weight: 1,
              fillOpacity: .5,
              strokeOpacity: 0.5,
              fill : true,
              draggable: true,
              transform: true,
          };
          const points = [];
          feature.geometry.coordinates[0].map(coordinate => {
            const point = [];
            point.push(coordinate[1]);
            point.push(coordinate[0]);
            points.push(point);
          });

          const polygon = L.polygon(points, options);
          if(polygon.dragging){
            polygon.dragging.disable();
          }

          polygon.properties = feature.properties;
          polygon.id = feature.id;
          polygon.on('click', (e) => {
            _this.selecionarLayer(e);
            _this.triggerScrollTo();
          });

          let ctxReference = function(objRef){
            var ctx = {
              contextmenu: true,
              contextmenuInheritItems: false,
              contextmenuItems: [
                { text: 'Editar Atributos',  callback: (evt) => { _this.prepararAtributos(objRef.properties, objRef); _this.changeDetectorRefs.detectChanges(); } },
                { text: 'Editar Shape',  callback: (evt) => {

                    if (!objRef.editing._enabled) {
                
                        objRef['_context'] = null;
                        objRef['_objetosNovos'] = null;
                        if (objRef.properties.layerType == 'LineString') {
                          if (objRef.editing._enabled) {
                            objRef.editing.disable();
                            objRef.setStyle(_this.stylelayer.lineDefecto);
                          } else {
                            objRef.editing.enable();
                            objRef.setStyle(_this.stylelayer.selected);
                          }
                        } else {
                          if (objRef.editing._enabled) {
                            objRef.editing.disable();
                            if(objRef.properties.layerType !== 'marker'){
                              objRef.setStyle(_this.stylelayer.default);
                            }
                          } else {
                            objRef.editing.enable();
                            if(objRef.properties.layerType !== 'marker'){
                              objRef.setStyle(_this.stylelayer.selectedPathOptions);
                            }
                          }
                        }
                        
                        if(objRef.dragging) {
                          objRef.dragging.disable();
                        }
                        if(objRef.transform){
                          objRef.transform.disable();
                        }

                        if (objRef.editing._enabled) {
                          if(objRef['layerType'] == 'circle'){
                            const circle = new L.Circle(objRef._latlng,objRef.options);
                            circle['layerType'] = objRef['layerType'];
                            circle['properties'] = objRef['properties'];
                            objRef['_before'] = circle;
                          } else if(objRef['layerType'] == 'circlemarker'){
                            const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                            circleMarker['layerType'] = objRef['layerType'];
                            circleMarker['properties'] = objRef['properties'];
                            objRef['_before'] = circleMarker;
                          }else{
                            const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                              style:  objRef.options,
                            });
                            geoJson['layerType'] = objRef['layerType'];
                            geoJson['properties'] = objRef['properties'];
                      
                            _this.adicionarContextMenu(geoJson, 'Edição');
                            if(geoJson['layerType'] !== 'marker'){
                              geoJson.setStyle(_this.stylelayer.lineDefecto);
                            }
                            if(geoJson._layers){
                              const keysEdicao = Object.keys(geoJson._layers);
                              if (keysEdicao.length > 0) {
                                keysEdicao.forEach(key => {
                                  geoJson._layers[key]['properties'] = objRef['properties'];
                                  if(geoJson._layers[key].transform){
                                    geoJson._layers[key].transform.disable()
                                  }
                                  if(geoJson._layers[key].dragging){
                                    geoJson._layers[key].dragging.disable()
                                  }
                                })
                              }
                            }
                            objRef['_before'] = geoJson;
                            objRef['_context'] = true;
                          }
                        }
                    }
                }, },
                { text: 'Mesclar Objetos',  callback: (evt) => {
                  _this.mesclarObjetos();
                }},
                { text: 'Cortar Objetos',  callback: (evt) => {
                  _this.cortarObjetos(objRef);
                }},
                { text: 'Separar Objetos',  callback: (evt) => {
                  _this.separarObjetos(objRef);
                }},
                { text: 'Snap To',  callback: (evt) => {
                  if (!objRef.editing._enabled) {
                    objRef['_context'] = null;
                    objRef['_objetosNovos'] = null;
                    if(objRef.transform && objRef.dragging) {
                      objRef.transform.disable();
                      objRef.dragging.disable();
                    }
      
                    if(!objRef.snapediting){
                      objRef.snapediting = new L.Handler.PolylineSnap(_this.map, objRef);
                      objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                    }
                    if(objRef['snap']){
                      objRef.snapediting.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }else{
                      if(objRef['layerType'] == 'circle'){
                        const circle = new L.Circle(objRef._latlng,objRef.options);
                        circle['layerType'] = objRef['layerType'];
                        circle['properties'] = objRef['properties'];
                        objRef['_before'] = circle;
                      } else if(objRef['layerType'] == 'circlemarker'){
                        const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                        circleMarker['layerType'] = objRef['layerType'];
                        circleMarker['properties'] = objRef['properties'];
                        objRef['_before'] = circleMarker;
                      }else{
                        const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                          style:  objRef.options,
                        });
                        geoJson['layerType'] = objRef['layerType'];
                        geoJson['properties'] = objRef['properties'];
                  
                        _this.adicionarContextMenu(geoJson, 'Edição');
                        if(geoJson['layerType'] !== 'marker'){
                          geoJson.setStyle(_this.stylelayer.lineDefecto);
                        }
                        if(geoJson._layers){
                          const keysEdicao = Object.keys(geoJson._layers);
                          if (keysEdicao.length > 0) {
                            keysEdicao.forEach(key => {
                              geoJson._layers[key]['properties'] = objRef['properties'];
                              if(geoJson._layers[key].transform){
                                geoJson._layers[key].transform.disable()
                              }
                              if(geoJson._layers[key].dragging){
                                geoJson._layers[key].dragging.disable()
                              }
                            })
                          }
                        }
                        objRef['_before'] = geoJson;
                        objRef['_context'] = true;
                      }
      
                      objRef.snapediting.enable();
                      if (objRef.properties && objRef.properties.layerType && objRef.properties.layerType == 'LineString') {
                        objRef.setStyle(_this.stylelayer.selected);
                      } else {
                        objRef.setStyle(_this.stylelayer.selectedPathOptions);
                      }
                    }
                    
                    objRef['snap'] ? objRef['snap'] =  false : objRef['snap'] =  true;
                  }

    
                  }
                },
                { text: 'Mover/Rotacionar Objeto',  callback: (evt) => {
                  objRef['_context'] = null;
                  objRef['_objetosNovos'] = null;
                  if(objRef.dragging && objRef.transform) {
                   objRef.dragging._enabled ? objRef.dragging.disable() : objRef.dragging.enable();
                   objRef.transform._enabled ? objRef.transform.disable() : objRef.transform.enable();
                  }

                  
                  if(objRef.transform && objRef.dragging) {

                    if(objRef.transform._enabled || objRef.dragging._enabled){
                      let shape = cloneLayer(objRef);
                      shape['properties'] = objRef.properties;
                      shape['layerType'] = objRef.layerType;
                      objRef['_before'] = shape;
                    } 

                  }

                }},


                
                { text: 'Desfazer última ação',  callback: (evt) => {
                  var obj = objRef['_before'];
                  var isBindCtx = objRef['_context'];

                  var objNovos = objRef['_objetosNovos'];
                  if(objNovos){
                    objNovos.forEach((obj) => {
                      obj.removeFrom(_this.map);
                    });
                  }

                  if(obj && obj.length){
  
                    obj.forEach((objAux) => {
                      if(objAux){
                        if(!isBindCtx){
                          objAux.bindContextMenu(ctxReference(objAux));
                        }
                        objAux.snapediting = new L.Handler.PolylineSnap(_this.map, objAux);
                        objAux.snapediting.addGuideLayer(_this.editableFeatureGroup);
                        objAux.addTo(_this.editableFeatureGroup);
                        if(objAux.layerType !== 'marker'){
                          objAux.setStyle(_this.stylelayer.default);
                        }
                        objAux.on('click', (e) => {
                          _this.selecionarLayer(e);
                          _this.triggerScrollTo();
                        });
      
      
                        if(objAux.dragging) {
                          objAux.dragging.disable();
                        }
                        if(objAux.transform) {
                          objAux.transform.disable();
                        }
      
                        if(objRef.dragging) {
                          objRef.dragging.disable();
                        }
                        if(objRef.transform) {
                          objRef.transform.disable();
                        }
      
                        var id = objRef._leaflet_id;
                        const indice = _this.objetosSelecionados.indexOf(id);
                        _this.objetosSelecionados.splice(indice, 1);
                        _this.objetosSelecionadosMap.delete(id);

                        objRef.removeFrom(_this.map);
                        _this.editableFeatureGroup.removeLayer(objRef);
      
                      }
                    })
                  } else if(obj){
  
                    if(!isBindCtx){
                      obj.bindContextMenu(ctxReference(obj))
                    }
                    obj.snapediting = new L.Handler.PolylineSnap(_this.map, obj);
                    obj.snapediting.addGuideLayer(_this.editableFeatureGroup);
                    obj.addTo(_this.editableFeatureGroup);
                    if(obj.layerType !== 'marker'){
                      obj.setStyle(_this.stylelayer.default);
                    }
                    obj.on('click', (e) => {
                      _this.selecionarLayer(e);
                      _this.triggerScrollTo();
                    });
  
  
                    if(obj.dragging) {
                      obj.dragging.disable();
                    }
                    if(obj.transform) {
                      obj.transform.disable();
                    }
  
                    if(objRef.dragging) {
                      objRef.dragging.disable();
                    }
                    if(objRef.transform) {
                      objRef.transform.disable();
                    }
  
                    var id = objRef._leaflet_id;
                    const indice = _this.objetosSelecionados.indexOf(id);
                    _this.objetosSelecionados.splice(indice, 1);
                    _this.objetosSelecionadosMap.delete(id);

                    objRef.removeFrom(_this.map);
                    _this.editableFeatureGroup.removeLayer(objRef);
                  }

                  var layer = _this.editableFeatureGroup._layers[objRef._leaflet_id + 1];
                  if(layer){
                    _this.editableFeatureGroup.removeLayer(layer);
                  }
                  _this.configurarAtributos();
                  _this.configurarTabelaAtributos();
                }},


                { text: 'Sair',  callback: (evt) => {
                  if (objRef.snapediting) {
                    objRef.snapediting.disable();
                    objRef['snap'] = false;
                    if(objRef.properties.layerType !== 'marker'){
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }
                  }
                  if (objRef.properties.layerType == 'LineString') {
                    if (objRef.editing && objRef.editing._enabled) {
                      objRef.editing.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }
                  } else if (objRef.editing && objRef.editing._enabled) {
                    objRef.editing.disable();
                    if(objRef.properties.layerType !== 'marker'){
                      objRef.setStyle(_this.stylelayer.default);
                    }
                  }
                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform) {
                    objRef.transform.disable();
                  }
                }, }
              ]
            }
            return ctx;
          }

          polygon.bindContextMenu(ctxReference(polygon));

          polygon.addTo(this.editableFeatureGroup);
        }
        if (feature.geometry.type.includes('Point') && feature.properties.radius != undefined) {
          const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
          const circle = L.circle([coordenadas[1], coordenadas[0]],  feature.properties.radius , { draggable: true });
          circle.properties = feature.properties;
          circle.id = feature.id;
          circle.on('click', (e) => {
            _this.selecionarLayer(e);
            _this.triggerScrollTo();
          });

          circle.dragging.disable();

          
          let ctxReference = function(objRef){
            var ctx = {
              contextmenu: true,
              contextmenuInheritItems: false,
              contextmenuItems: [
                { text: 'Editar Atributos',  callback: (evt) => { _this.prepararAtributos(objRef.properties, objRef); _this.changeDetectorRefs.detectChanges(); } },
                { text: 'Editar Shape',  callback: (evt) => {
                  if (!objRef.editing._enabled) {
                      objRef['_context'] = null;
                      objRef['_objetosNovos'] = null;
                      if (objRef.properties.layerType == 'LineString') {
                        if (objRef.editing._enabled) {
                          objRef.editing.disable();
                          objRef.setStyle(_this.stylelayer.lineDefecto);
                        } else {
                          objRef.editing.enable();
                          objRef.setStyle(_this.stylelayer.selected);
                        }
                      } else {
                        if (objRef.editing._enabled) {
                          objRef.editing.disable();
                          if(objRef.properties.layerType !== 'marker'){
                            objRef.setStyle(_this.stylelayer.default);
                          }
                        } else {
                          objRef.editing.enable();
                          if(objRef.properties.layerType !== 'marker'){
                            objRef.setStyle(_this.stylelayer.selectedPathOptions);
                          }
                        }
                      }
                      
                      if(objRef.dragging) {
                        objRef.dragging.disable();
                      }
                      if(objRef.transform){
                        objRef.transform.disable();
                      }

                      if (objRef.editing._enabled) {
                        if(objRef['layerType'] == 'circle'){
                          const circle = new L.Circle(objRef._latlng,objRef.options);
                          circle['layerType'] = objRef['layerType'];
                          circle['properties'] = objRef['properties'];
                          objRef['_before'] = circle;
                        } else if(objRef['layerType'] == 'circlemarker'){
                          const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                          circleMarker['layerType'] = objRef['layerType'];
                          circleMarker['properties'] = objRef['properties'];
                          objRef['_before'] = circleMarker;
                        }else{
                          const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                            style:  objRef.options,
                          });
                          geoJson['layerType'] = objRef['layerType'];
                          geoJson['properties'] = objRef['properties'];
                    
                          _this.adicionarContextMenu(geoJson, 'Edição');
                          if(geoJson['layerType'] !== 'marker'){
                            geoJson.setStyle(_this.stylelayer.lineDefecto);
                          }
                          if(geoJson._layers){
                            const keysEdicao = Object.keys(geoJson._layers);
                            if (keysEdicao.length > 0) {
                              keysEdicao.forEach(key => {
                                geoJson._layers[key]['properties'] = objRef['properties'];
                                if(geoJson._layers[key].transform){
                                  geoJson._layers[key].transform.disable()
                                }
                                if(geoJson._layers[key].dragging){
                                  geoJson._layers[key].dragging.disable()
                                }
                              })
                            }
                          }
                          objRef['_before'] = geoJson;
                          objRef['_context'] = true;
                        }
                      }
                  }
                }, },
                { text: 'Mesclar Objetos',  callback: (evt) => {
                  _this.mesclarObjetos();
                }},
                { text: 'Cortar Objetos',  callback: (evt) => {
                  _this.cortarObjetos(objRef);
                }},
                { text: 'Separar Objetos',  callback: (evt) => {
                  _this.separarObjetos(objRef);
                }},
                { text: 'Snap To',  callback: (evt) => {
                  if (!objRef.editing._enabled) {
                    objRef['_context'] = null;
                    objRef['_objetosNovos'] = null;
                    if(objRef.transform && objRef.dragging) {
                      objRef.transform.disable();
                      objRef.dragging.disable();
                    }
      
                    if(!objRef.snapediting){
                      objRef.snapediting = new L.Handler.PolylineSnap(_this.map, objRef);
                      objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                    }
                    if(objRef['snap']){
                      objRef.snapediting.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }else{
                      if(objRef['layerType'] == 'circle'){
                        const circle = new L.Circle(objRef._latlng,objRef.options);
                        circle['layerType'] = objRef['layerType'];
                        circle['properties'] = objRef['properties'];
                        objRef['_before'] = circle;
                      } else if(objRef['layerType'] == 'circlemarker'){
                        const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                        circleMarker['layerType'] = objRef['layerType'];
                        circleMarker['properties'] = objRef['properties'];
                        objRef['_before'] = circleMarker;
                      }else{
                        const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                          style:  objRef.options,
                        });
                        geoJson['layerType'] = objRef['layerType'];
                        geoJson['properties'] = objRef['properties'];
                  
                        _this.adicionarContextMenu(geoJson, 'Edição');
                        if(geoJson['layerType'] !== 'marker'){
                          geoJson.setStyle(_this.stylelayer.lineDefecto);
                        }
                        if(geoJson._layers){
                          const keysEdicao = Object.keys(geoJson._layers);
                          if (keysEdicao.length > 0) {
                            keysEdicao.forEach(key => {
                              geoJson._layers[key]['properties'] = objRef['properties'];
                              if(geoJson._layers[key].transform){
                                geoJson._layers[key].transform.disable()
                              }
                              if(geoJson._layers[key].dragging){
                                geoJson._layers[key].dragging.disable()
                              }
                            })
                          }
                        }
                        objRef['_before'] = geoJson;
                        objRef['_context'] = true;
                      }
      
                      objRef.snapediting.enable();
                      if (objRef.properties && objRef.properties.layerType && objRef.properties.layerType == 'LineString') {
                        objRef.setStyle(_this.stylelayer.selected);
                      } else {
                        objRef.setStyle(_this.stylelayer.selectedPathOptions);
                      }
                    }
                    
                    objRef['snap'] ? objRef['snap'] =  false : objRef['snap'] =  true;
                  }
                 
    
                  }
                },
                { text: 'Mover Objeto',  callback: (evt) => {
                  objRef['_context'] = null;
                  objRef['_objetosNovos'] = null;
                  if(objRef.dragging) {
                    objRef.dragging._enabled ? objRef.dragging.disable() : objRef.dragging.enable();
                  }

                  if(objRef.dragging) {

                    if(objRef.dragging._enabled){
                      let shape = cloneLayer(objRef);
                      shape['properties'] = objRef.properties;
                      shape['layerType'] = objRef.layerType;
                      objRef['_before'] = shape;
                    } 

                  }

                }},


                { text: 'Desfazer última ação',  callback: (evt) => {
                  var obj = objRef['_before'];
                  var isBindCtx = objRef['_context'];

                  var objNovos = objRef['_objetosNovos'];
                  if(objNovos){
                    objNovos.forEach((obj) => {
                      obj.removeFrom(_this.map);
                    });
                  }

                  if(obj && obj.length){
  
                    obj.forEach((objAux) => {
                      if(objAux){
                        if(!isBindCtx){
                          objAux.bindContextMenu(ctxReference(objAux));
                        }
                        objAux.snapediting = new L.Handler.PolylineSnap(_this.map, objAux);
                        objAux.snapediting.addGuideLayer(_this.editableFeatureGroup);
                        objAux.addTo(_this.editableFeatureGroup);
                        if(objAux.layerType !== 'marker'){
                          objAux.setStyle(_this.stylelayer.default);
                        }
                        objAux.on('click', (e) => {
                          _this.selecionarLayer(e);
                          _this.triggerScrollTo();
                        });
      
      
                        if(objAux.dragging) {
                          objAux.dragging.disable();
                        }
                        if(objAux.transform) {
                          objAux.transform.disable();
                        }
      
                        if(objRef.dragging) {
                          objRef.dragging.disable();
                        }
                        if(objRef.transform) {
                          objRef.transform.disable();
                        }
      
                        var id = objRef._leaflet_id;
                        const indice = _this.objetosSelecionados.indexOf(id);
                        _this.objetosSelecionados.splice(indice, 1);
                        _this.objetosSelecionadosMap.delete(id);

                        objRef.removeFrom(_this.map);
                        _this.editableFeatureGroup.removeLayer(objRef);
      
                      }
                    })
                  } else if(obj){
  
                    if(!isBindCtx){
                      obj.bindContextMenu(ctxReference(obj))
                    }
                    obj.snapediting = new L.Handler.PolylineSnap(_this.map, obj);
                    obj.snapediting.addGuideLayer(_this.editableFeatureGroup);
                    obj.addTo(_this.editableFeatureGroup);
                    if(obj.layerType !== 'marker'){
                      obj.setStyle(_this.stylelayer.default);
                    }
                    obj.on('click', (e) => {
                      _this.selecionarLayer(e);
                      _this.triggerScrollTo();
                    });
  
  
                    if(obj.dragging) {
                      obj.dragging.disable();
                    }
                    if(obj.transform) {
                      obj.transform.disable();
                    }
  
                    if(objRef.dragging) {
                      objRef.dragging.disable();
                    }
                    if(objRef.transform) {
                      objRef.transform.disable();
                    }
  
                    var id = objRef._leaflet_id;
                    const indice = _this.objetosSelecionados.indexOf(id);
                    _this.objetosSelecionados.splice(indice, 1);
                    _this.objetosSelecionadosMap.delete(id);

                    objRef.removeFrom(_this.map);
                    _this.editableFeatureGroup.removeLayer(objRef);

                  }

                  var layer = _this.editableFeatureGroup._layers[objRef._leaflet_id + 1];
                  if(layer){
                    _this.editableFeatureGroup.removeLayer(layer);
                  }
                  _this.configurarAtributos();
                  _this.configurarTabelaAtributos();
                }},
  

                { text: 'Sair',  callback: (evt) => {
                  if (objRef.snapediting) {
                    objRef.snapediting.disable();
                    objRef['snap'] = false;
                    if(objRef.properties.layerType !== 'marker'){
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }
                  }
                  if (objRef.properties.layerType == 'LineString') {
                    if (objRef.editing && objRef.editing._enabled) {
                      objRef.editing.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }
                  } else if (objRef.editing && objRef.editing._enabled) {
                    objRef.editing.disable();
                    if(objRef.properties.layerType !== 'marker'){
                      objRef.setStyle(_this.stylelayer.default);
                    }
                  }
                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform) {
                    objRef.transform.disable();
                  }
                }, }
              ]
            }
            return ctx;
          }
          circle.bindContextMenu(ctxReference(circle));

          circle.addTo(this.editableFeatureGroup);
        }
        if (feature.geometry.type.includes('Point') && feature.properties.radius == undefined) {
          const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
          const marker: L.circleMarker = L.circleMarker([coordenadas[1], coordenadas[0]], {
            radius: 10,
            fillColor: this.getColor(1),
            color: '#ffffff',
            fillOpacity: 1,
            draggable: true,
            weight: 0.3
          });
          marker.properties = feature.properties;
          marker.id = feature.id;
          marker.on('click', (e) => {
            _this.selecionarLayer(e);
            _this.triggerScrollTo();
          });

          marker.dragging.disable();

          let ctxReference = function(objRef){
            var ctx = {
              contextmenu: true,
              contextmenuInheritItems: false,
              contextmenuItems: [
                { text: 'Editar Atributos',  callback: (evt) => { _this.prepararAtributos(objRef.properties, objRef); _this.changeDetectorRefs.detectChanges(); } },
                /*{ text: 'Editar Shape',  callback: (evt) => {
                  if (!objRef.editing._enabled) {
                      objRef['_context'] = null;
                      objRef['_objetosNovos'] = null;
                      if (objRef.properties.layerType == 'LineString') {
                        if (objRef.editing._enabled) {
                          objRef.editing.disable();
                          objRef.setStyle(_this.stylelayer.lineDefecto);
                        } else {
                          objRef.editing.enable();
                          objRef.setStyle(_this.stylelayer.selected);
                        }
                      } else {
                        if (objRef.editing._enabled) {
                          objRef.editing.disable();
                          if(objRef.properties.layerType !== 'marker'){
                            objRef.setStyle(_this.stylelayer.default);
                          }
                        } else {
                          objRef.editing.enable();
                          if(objRef.properties.layerType !== 'marker'){
                            objRef.setStyle(_this.stylelayer.selectedPathOptions);
                          }
                        }
                      }
                      
                      if(objRef.dragging) {
                        objRef.dragging.disable();
                      }
                      if(objRef.transform){
                        objRef.transform.disable();
                      }

                      if (objRef.editing._enabled) {
                        if(objRef['layerType'] == 'circle'){
                          const circle = new L.Circle(objRef._latlng,objRef.options);
                          circle['layerType'] = objRef['layerType'];
                          circle['properties'] = objRef['properties'];
                          objRef['_before'] = circle;
                        } else if(objRef['layerType'] == 'circlemarker'){
                          const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                          circleMarker['layerType'] = objRef['layerType'];
                          circleMarker['properties'] = objRef['properties'];
                          objRef['_before'] = circleMarker;
                        }else{
                          const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                            style:  objRef.options,
                          });
                          geoJson['layerType'] = objRef['layerType'];
                          geoJson['properties'] = objRef['properties'];
                    
                          _this.adicionarContextMenu(geoJson, 'Edição');
                          if(geoJson['layerType'] !== 'marker'){
                            geoJson.setStyle(_this.stylelayer.lineDefecto);
                          }
                          if(geoJson._layers){
                            const keysEdicao = Object.keys(geoJson._layers);
                            if (keysEdicao.length > 0) {
                              keysEdicao.forEach(key => {
                                geoJson._layers[key]['properties'] = objRef['properties'];
                                if(geoJson._layers[key].transform){
                                  geoJson._layers[key].transform.disable()
                                }
                                if(geoJson._layers[key].dragging){
                                  geoJson._layers[key].dragging.disable()
                                }
                              })
                            }
                          }
                          objRef['_before'] = geoJson;
                          objRef['_context'] = true;
                        }
                      }
                    }
                }, },*/
                { text: 'Mesclar Objetos',  callback: (evt) => {
                  _this.mesclarObjetos();
                }},
                { text: 'Cortar Objetos',  callback: (evt) => {
                  _this.cortarObjetos(objRef);
                }},
                { text: 'Separar Objetos',  callback: (evt) => {
                  _this.separarObjetos(objRef);
                }},
                /*{ text: 'Snap To',  callback: (evt) => {
                  if (!objRef.editing._enabled) {
                    objRef['_context'] = null;
                    objRef['_objetosNovos'] = null;
                    if(objRef.transform && objRef.dragging) {
                      objRef.transform.disable();
                      objRef.dragging.disable();
                    }
      
                    if(!objRef.snapediting){
                      objRef.snapediting = new L.Handler.PolylineSnap(_this.map, objRef);
                      objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                    } 
                    if(objRef['snap']){
                      objRef.snapediting.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }else{
                      if(objRef['layerType'] == 'circle'){
                        const circle = new L.Circle(objRef._latlng,objRef.options);
                        circle['layerType'] = objRef['layerType'];
                        circle['properties'] = objRef['properties'];
                        objRef['_before'] = circle;
                      } else if(objRef['layerType'] == 'circlemarker'){
                        const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                        circleMarker['layerType'] = objRef['layerType'];
                        circleMarker['properties'] = objRef['properties'];
                        objRef['_before'] = circleMarker;
                      }else{
                        
                        const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                          style:  objRef.options,
                        });
                        geoJson['layerType'] = objRef['layerType'];
                        geoJson['properties'] = objRef['properties'];

                        _this.adicionarContextMenu(geoJson, 'Edição');
                        if(geoJson['layerType'] !== 'marker'){
                          geoJson.setStyle(_this.stylelayer.lineDefecto);
                        }
                        if(geoJson._layers){
                          const keysEdicao = Object.keys(geoJson._layers);
                          if (keysEdicao.length > 0) {
                            keysEdicao.forEach(key => {
                              geoJson._layers[key]['properties'] = objRef['properties'];
                              if(geoJson._layers[key].transform){
                                geoJson._layers[key].transform.disable()
                              }
                              if(geoJson._layers[key].dragging){
                                geoJson._layers[key].dragging.disable()
                              }
                            })
                          }
                        }
                        objRef['_before'] = geoJson;
                        objRef['_context'] = true;
                      }
                      
                      objRef.snapediting.enable();

                      if (objRef.properties && objRef.properties.layerType && objRef.properties.layerType == 'LineString') {
                        objRef.setStyle(_this.stylelayer.selected);
                      } else {
                        objRef.setStyle(_this.stylelayer.selectedPathOptions);
                      }
                    }
                    
                    objRef['snap'] ? objRef['snap'] =  false : objRef['snap'] =  true;
                   }
                  
    
                  }
                },*/
                { text: 'Mover Objeto',  callback: (evt) => {
                  objRef['_context'] = null;
                  objRef['_objetosNovos'] = null;
                  if(objRef.dragging) {
                    objRef.dragging._enabled ? objRef.dragging.disable() : objRef.dragging.enable();
                  }
                  
                  if(objRef.dragging) {

                    if(objRef.dragging._enabled){
                      let shape = cloneLayer(objRef);
                      shape['properties'] = objRef.properties;
                      shape['layerType'] = objRef.layerType;
                      objRef['_before'] = shape;
                    } 

                  }

                }},


                { text: 'Desfazer última ação',  callback: (evt) => {
                  var obj = objRef['_before'];
                  var isBindCtx = objRef['_context'];

                  var objNovos = objRef['_objetosNovos'];
                  if(objNovos){
                    objNovos.forEach((obj) => {
                      obj.removeFrom(_this.map);
                    });
                  }

                  if(obj && obj.length){
  
                    obj.forEach((objAux) => {
                      if(objAux){
                        if(!isBindCtx){
                          objAux.bindContextMenu(ctxReference(objAux));
                        }
                        objAux.snapediting = new L.Handler.PolylineSnap(_this.map, objAux);
                        objAux.snapediting.addGuideLayer(_this.editableFeatureGroup);
                        objAux.addTo(_this.editableFeatureGroup);
                        if(objAux.layerType !== 'marker'){
                          objAux.setStyle(_this.stylelayer.default);
                        }
                        objAux.on('click', (e) => {
                          _this.selecionarLayer(e);
                          _this.triggerScrollTo();
                        });
      
      
                        if(objAux.dragging) {
                          objAux.dragging.disable();
                        }
                        if(objAux.transform) {
                          objAux.transform.disable();
                        }
      
                        if(objRef.dragging) {
                          objRef.dragging.disable();
                        }
                        if(objRef.transform) {
                          objRef.transform.disable();
                        }
      
                        var id = objRef._leaflet_id;
                        const indice = _this.objetosSelecionados.indexOf(id);
                        _this.objetosSelecionados.splice(indice, 1);
                        _this.objetosSelecionadosMap.delete(id);

                        objRef.removeFrom(_this.map);
                        _this.editableFeatureGroup.removeLayer(objRef);
      
                      }
                    })
                  } else if(obj){
  
                    if(!isBindCtx){
                      obj.bindContextMenu(ctxReference(obj))
                    }
                    obj.snapediting = new L.Handler.PolylineSnap(_this.map, obj);
                    obj.snapediting.addGuideLayer(_this.editableFeatureGroup);
                    obj.addTo(_this.editableFeatureGroup);
                    if(obj.layerType !== 'marker'){
                      obj.setStyle(_this.stylelayer.default);
                    }
                    obj.on('click', (e) => {
                      _this.selecionarLayer(e);
                      _this.triggerScrollTo();
                    });
  
  
                    if(obj.dragging) {
                      obj.dragging.disable();
                    }
                    if(obj.transform) {
                      obj.transform.disable();
                    }
  
                    if(objRef.dragging) {
                      objRef.dragging.disable();
                    }
                    if(objRef.transform) {
                      objRef.transform.disable();
                    }

                    var id = objRef._leaflet_id;
                    const indice = _this.objetosSelecionados.indexOf(id);
                    _this.objetosSelecionados.splice(indice, 1);
                    _this.objetosSelecionadosMap.delete(id);
  
                    objRef.removeFrom(_this.map);
                    _this.editableFeatureGroup.removeLayer(objRef);

                  }

                  var layer = _this.editableFeatureGroup._layers[objRef._leaflet_id + 1];
                  if(layer){
                    _this.editableFeatureGroup.removeLayer(layer);
                  }
                  _this.configurarAtributos();
                  _this.configurarTabelaAtributos();
                }},
  

                { text: 'Sair',  callback: (evt) => {
                  if (objRef.snapediting) {
                    objRef.snapediting.disable();
                    objRef['snap'] = false;
                    if(objRef.properties.layerType !== 'marker'){
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }
                  }
                  if (objRef.properties.layerType == 'LineString') {
                    if (objRef.editing && objRef.editing._enabled) {
                      objRef.editing.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }
                  } else if (objRef.editing && objRef.editing._enabled) {
                    objRef.editing.disable();
                    if(objRef.properties.layerType !== 'marker'){
                      objRef.setStyle(_this.stylelayer.default);
                    }
                  }
                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform) {
                    objRef.transform.disable();
                  }
                }, }
              ]
            }
            return ctx;
          }
          marker.bindContextMenu(ctxReference(marker));

          marker.addTo(this.editableFeatureGroup);

        } else if (feature.geometry.type.includes('MultiLineString')) {
          const optionsLine = {
              color: '#666666',
              fillColor : '#c0c3ac',
              weight: 4,
              opacity: 0.5,
              draggable: true,
              transform: true,
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

          polyline.on('click', (e) => {
            _this.selecionarLayer(e);
            _this.triggerScrollTo();
          });

          polyline.dragging.disable();

          polyline.properties = feature.properties;
          polyline.id = feature.id;

          let ctxReference = function(objRef){
            var ctx = {
              contextmenu: true,
              contextmenuInheritItems: false,
              contextmenuItems: [
                { text: 'Editar Atributos',  callback: (evt) => { _this.prepararAtributos(objRef.properties, objRef); _this.changeDetectorRefs.detectChanges(); } },
                { text: 'Editar Shape',  callback: (evt) => {
                  if (!objRef.editing._enabled) {
                      objRef['_context'] = null;
                      objRef['_objetosNovos'] = null;
                      if (objRef.properties.layerType == 'LineString') {
                        if (objRef.editing._enabled) {
                          objRef.editing.disable();
                          objRef.setStyle(_this.stylelayer.lineDefecto);
                        } else {
                          objRef.editing.enable();
                          objRef.setStyle(_this.stylelayer.selected);
                        }
                      } else {
                        if (objRef.editing._enabled) {
                          objRef.editing.disable();
                          if(objRef.properties.layerType !== 'marker'){
                            objRef.setStyle(_this.stylelayer.default);
                          }
                        } else {
                          objRef.editing.enable();
                          if(objRef.properties.layerType !== 'marker'){
                            objRef.setStyle(_this.stylelayer.selectedPathOptions);
                          }
                        }
                      }
                      
                      if(objRef.dragging) {
                        objRef.dragging.disable();
                      }
                      if(objRef.transform){
                        objRef.transform.disable();
                      }

                      if (objRef.editing._enabled) {
                        if(objRef['layerType'] == 'circle'){
                          const circle = new L.Circle(objRef._latlng,objRef.options);
                          circle['layerType'] = objRef['layerType'];
                          circle['properties'] = objRef['properties'];
                          objRef['_before'] = circle;
                        } else if(objRef['layerType'] == 'circlemarker'){
                          const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                          circleMarker['layerType'] = objRef['layerType'];
                          circleMarker['properties'] = objRef['properties'];
                          objRef['_before'] = circleMarker;
                        }else{
                          const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                            style:  objRef.options,
                          });
                          geoJson['layerType'] = objRef['layerType'];
                          geoJson['properties'] = objRef['properties'];
                    
                          _this.adicionarContextMenu(geoJson, 'Edição');
                          if(geoJson['layerType'] !== 'marker'){
                            geoJson.setStyle(_this.stylelayer.lineDefecto);
                          }
                          if(geoJson._layers){
                            const keysEdicao = Object.keys(geoJson._layers);
                            if (keysEdicao.length > 0) {
                              keysEdicao.forEach(key => {
                                geoJson._layers[key]['properties'] = objRef['properties'];
                                if(geoJson._layers[key].transform){
                                  geoJson._layers[key].transform.disable()
                                }
                                if(geoJson._layers[key].dragging){
                                  geoJson._layers[key].dragging.disable()
                                }
                              })
                            }
                          }
                          objRef['_before'] = geoJson;
                          objRef['_context'] = true;
                        }
                      }
                  }  
                }, },
                { text: 'Snap To',  callback: (evt) => {
                  if (!objRef.editing._enabled) {
                    objRef['_context'] = null;
                    objRef['_objetosNovos'] = null;
                    if(objRef.transform && objRef.dragging) {
                      objRef.transform.disable();
                      objRef.dragging.disable();
                    }
      
                    if(!objRef.snapediting){
                      objRef.snapediting = new L.Handler.PolylineSnap(_this.map, objRef);
                      objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                    }
                    if(objRef['snap']){
                      objRef.snapediting.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }else{
                      if(objRef['layerType'] == 'circle'){
                        const circle = new L.Circle(objRef._latlng,objRef.options);
                        circle['layerType'] = objRef['layerType'];
                        circle['properties'] = objRef['properties'];
                        objRef['_before'] = circle;
                      } else if(objRef['layerType'] == 'circlemarker'){
                        const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                        circleMarker['layerType'] = objRef['layerType'];
                        circleMarker['properties'] = objRef['properties'];
                        objRef['_before'] = circleMarker;
                      }else{
                        const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                          style:  objRef.options,
                        });
                        geoJson['layerType'] = objRef['layerType'];
                        geoJson['properties'] = objRef['properties'];
                  
                        _this.adicionarContextMenu(geoJson, 'Edição');
                        if(geoJson['layerType'] !== 'marker'){
                          geoJson.setStyle(_this.stylelayer.lineDefecto);
                        }
                        if(geoJson._layers){
                          const keysEdicao = Object.keys(geoJson._layers);
                          if (keysEdicao.length > 0) {
                            keysEdicao.forEach(key => {
                              geoJson._layers[key]['properties'] = objRef['properties'];
                              if(geoJson._layers[key].transform){
                                geoJson._layers[key].transform.disable()
                              }
                              if(geoJson._layers[key].dragging){
                                geoJson._layers[key].dragging.disable()
                              }
                            })
                          }
                        }
                        objRef['_before'] = geoJson;
                        objRef['_context'] = true;
                      }
      
                      objRef.snapediting.enable();
                      if (objRef.properties && objRef.properties.layerType && objRef.properties.layerType == 'LineString') {
                        objRef.setStyle(_this.stylelayer.selected);
                      } else {
                        objRef.setStyle(_this.stylelayer.selectedPathOptions);
                      }
                    }
                    
                    objRef['snap'] ? objRef['snap'] =  false : objRef['snap'] =  true;
                  }
    
                  }
                },
                { text: 'Mover/Rotacionar Objeto',  callback: (evt) => {
                  objRef['_context'] = null;
                  objRef['_objetosNovos'] = null;
                  if(objRef.dragging && objRef.transform) {
                    objRef.dragging._enabled ? objRef.dragging.disable() : objRef.dragging.enable();
                    objRef.transform._enabled ? objRef.transform.disable() : objRef.transform.enable();
                  }

                  
                  if(objRef.transform && objRef.dragging) {

                    if(objRef.transform._enabled || objRef.dragging._enabled){
                      let shape = cloneLayer(objRef);
                      shape['properties'] = objRef.properties;
                      shape['layerType'] = objRef.layerType;
                      objRef['_before'] = shape;
                    } 

                  }

                }},

                
                { text: 'Desfazer última ação',  callback: (evt) => {
                  var obj = objRef['_before'];
                  var isBindCtx = objRef['_context'];

                  var objNovos = objRef['_objetosNovos'];
                  if(objNovos){
                    objNovos.forEach((obj) => {
                      obj.removeFrom(_this.map);
                    });
                  }

                  if(obj && obj.length){
  
                    obj.forEach((objAux) => {
                      if(objAux){
                        if(!isBindCtx){
                          objAux.bindContextMenu(ctxReference(objAux));
                        }
                        objAux.snapediting = new L.Handler.PolylineSnap(_this.map, objAux);
                        objAux.snapediting.addGuideLayer(_this.editableFeatureGroup);
                        objAux.addTo(_this.editableFeatureGroup);
                        if(objAux.layerType !== 'marker'){
                          objAux.setStyle(_this.stylelayer.default);
                        }
                        objAux.on('click', (e) => {
                          _this.selecionarLayer(e);
                          _this.triggerScrollTo();
                        });
      
      
                        if(objAux.dragging) {
                          objAux.dragging.disable();
                        }
                        if(objAux.transform) {
                          objAux.transform.disable();
                        }
      
                        if(objRef.dragging) {
                          objRef.dragging.disable();
                        }
                        if(objRef.transform) {
                          objRef.transform.disable();
                        }
      
                        var id = objRef._leaflet_id;
                        const indice = _this.objetosSelecionados.indexOf(id);
                        _this.objetosSelecionados.splice(indice, 1);
                        _this.objetosSelecionadosMap.delete(id);

                        objRef.removeFrom(_this.map);
                        _this.editableFeatureGroup.removeLayer(objRef);
      
                      }
                    })
                  } else if(obj){
  
                    if(!isBindCtx){
                      obj.bindContextMenu(ctxReference(obj))
                    }
                    obj.snapediting = new L.Handler.PolylineSnap(_this.map, obj);
                    obj.snapediting.addGuideLayer(_this.editableFeatureGroup);
                    obj.addTo(_this.editableFeatureGroup);
                    if(obj.layerType !== 'marker'){
                      obj.setStyle(_this.stylelayer.default);
                    }
                    obj.on('click', (e) => {
                      _this.selecionarLayer(e);
                      _this.triggerScrollTo();
                    });
  
  
                    if(obj.dragging) {
                      obj.dragging.disable();
                    }
                    if(obj.transform) {
                      obj.transform.disable();
                    }
  
                    if(objRef.dragging) {
                      objRef.dragging.disable();
                    }
                    if(objRef.transform) {
                      objRef.transform.disable();
                    }
  
                    var id = objRef._leaflet_id;
                    const indice = _this.objetosSelecionados.indexOf(id);
                    _this.objetosSelecionados.splice(indice, 1);
                    _this.objetosSelecionadosMap.delete(id);

                    objRef.removeFrom(_this.map);
                    _this.editableFeatureGroup.removeLayer(objRef);

                  }

                  var layer = _this.editableFeatureGroup._layers[objRef._leaflet_id + 1];
                  if(layer){
                    _this.editableFeatureGroup.removeLayer(layer);
                  }
                  _this.configurarAtributos();
                  _this.configurarTabelaAtributos();
                }},


                { text: 'Sair',  callback: (evt) => {
                  if (objRef.snapediting) {
                    objRef.snapediting.disable();
                    objRef['snap'] = false;
                    if(objRef.properties.layerType !== 'marker'){
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }
                  }
                  if (objRef.properties.layerType == 'LineString') {
                    if (objRef.editing && objRef.editing._enabled) {
                      objRef.editing.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }
                  } else if (objRef.editing && objRef.editing._enabled) {
                    objRef.editing.disable();
                    if(objRef.properties.layerType !== 'marker'){
                      objRef.setStyle(_this.stylelayer.default);
                    }
                  }
                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform) {
                    objRef.transform.disable();
                  }
                }, }
              ]
            }
            return ctx;
          }
          polyline.bindContextMenu(ctxReference(polyline));
          polyline.addTo(this.editableFeatureGroup);

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

          polyline.dragging.disable();

          polyline.properties = feature.properties;
          polyline.id = feature.id;

          let ctxReference = function(objRef){
            var ctx = {
              contextmenu: true,
              contextmenuInheritItems: false,
              contextmenuItems: [
                { text: 'Editar Atributos',  callback: (evt) => { _this.prepararAtributos(objRef.properties, objRef); _this.changeDetectorRefs.detectChanges(); } },
                { text: 'Editar Shape',  callback: (evt) => {
                  if (!objRef.editing._enabled) {
                      objRef['_context'] = null;
                      objRef['_objetosNovos'] = null;
                      if (objRef.properties.layerType == 'LineString') {
                        if (objRef.editing._enabled) {
                          objRef.editing.disable();
                          objRef.setStyle(_this.stylelayer.lineDefecto);
                        } else {
                          objRef.editing.enable();
                          objRef.setStyle(_this.stylelayer.selected);
                        }
                      } else {
                        if (objRef.editing._enabled) {
                          objRef.editing.disable();
                          if(objRef.properties.layerType !== 'marker'){
                            objRef.setStyle(_this.stylelayer.default);
                          }
                        } else {
                          objRef.editing.enable();
                          if(objRef.properties.layerType !== 'marker'){
                            objRef.setStyle(_this.stylelayer.selectedPathOptions);
                          }
                        }
                      }
                      
                      if(objRef.dragging) {
                        objRef.dragging.disable();
                      }
                      if(objRef.transform){
                        objRef.transform.disable();
                      }

                      if (objRef.editing._enabled) {
                        if(objRef['layerType'] == 'circle'){
                          const circle = new L.Circle(objRef._latlng,objRef.options);
                          circle['layerType'] = objRef['layerType'];
                          circle['properties'] = objRef['properties'];
                          objRef['_before'] = circle;
                        } else if(objRef['layerType'] == 'circlemarker'){
                          const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                          circleMarker['layerType'] = objRef['layerType'];
                          circleMarker['properties'] = objRef['properties'];
                          objRef['_before'] = circleMarker;
                        }else{
                          const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                            style:  objRef.options,
                          });
                          geoJson['layerType'] = objRef['layerType'];
                          geoJson['properties'] = objRef['properties'];
                    
                          _this.adicionarContextMenu(geoJson, 'Edição');
                          if(geoJson['layerType'] !== 'marker'){
                            geoJson.setStyle(_this.stylelayer.lineDefecto);
                          }
                          if(geoJson._layers){
                            const keysEdicao = Object.keys(geoJson._layers);
                            if (keysEdicao.length > 0) {
                              keysEdicao.forEach(key => {
                                geoJson._layers[key]['properties'] = objRef['properties'];
                                if(geoJson._layers[key].transform){
                                  geoJson._layers[key].transform.disable()
                                }
                                if(geoJson._layers[key].dragging){
                                  geoJson._layers[key].dragging.disable()
                                }
                              })
                            }
                          }
                          objRef['_before'] = geoJson;
                          objRef['_context'] = true;
                        }
                      }
                  }   
                }, },
                { text: 'Snap To',  callback: (evt) => {
                  if (!objRef.editing._enabled) {
                    objRef['_context'] = null;
                    objRef['_objetosNovos'] = null;
                    if(objRef.transform && objRef.dragging) {
                      objRef.transform.disable();
                      objRef.dragging.disable();
                    }
      
                    if(!objRef.snapediting){
                      objRef.snapediting = new L.Handler.PolylineSnap(_this.map, objRef);
                      objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                    }
                    if(objRef['snap']){
                      objRef.snapediting.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }else{
                      if(objRef['layerType'] == 'circle'){
                        const circle = new L.Circle(objRef._latlng,objRef.options);
                        circle['layerType'] = objRef['layerType'];
                        circle['properties'] = objRef['properties'];
                        objRef['_before'] = circle;
                      } else if(objRef['layerType'] == 'circlemarker'){
                        const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                        circleMarker['layerType'] = objRef['layerType'];
                        circleMarker['properties'] = objRef['properties'];
                        objRef['_before'] = circleMarker;
                      }else{
                        const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                          style:  objRef.options,
                        });
                        geoJson['layerType'] = objRef['layerType'];
                        geoJson['properties'] = objRef['properties'];
                  
                        _this.adicionarContextMenu(geoJson, 'Edição');
                        if(geoJson['layerType'] !== 'marker'){
                          geoJson.setStyle(_this.stylelayer.lineDefecto);
                        }
                        if(geoJson._layers){
                          const keysEdicao = Object.keys(geoJson._layers);
                          if (keysEdicao.length > 0) {
                            keysEdicao.forEach(key => {
                              geoJson._layers[key]['properties'] = objRef['properties'];
                              if(geoJson._layers[key].transform){
                                geoJson._layers[key].transform.disable()
                              }
                              if(geoJson._layers[key].dragging){
                                geoJson._layers[key].dragging.disable()
                              }
                            })
                          }
                        }
                        objRef['_before'] = geoJson;
                        objRef['_context'] = true;
                      }
      
                      objRef.snapediting.enable();
                      if (objRef.properties && objRef.properties.layerType && objRef.properties.layerType == 'LineString') {
                        objRef.setStyle(_this.stylelayer.selected);
                      } else {
                        objRef.setStyle(_this.stylelayer.selectedPathOptions);
                      }
                    }
                    
                    objRef['snap'] ? objRef['snap'] =  false : objRef['snap'] =  true;
                  }
                  
    
                  }
                },
                { text: 'Mover/Rotacionar Objeto',  callback: (evt) => {
                  objRef['_context'] = null;
                  objRef['_objetosNovos'] = null;
                  if(objRef.dragging && objRef.transform) {
                    objRef.dragging._enabled ? objRef.dragging.disable() : objRef.dragging.enable();
                    objRef.transform._enabled ? objRef.transform.disable() : objRef.transform.enable();
                  }

                  if(objRef.transform && objRef.dragging) {

                    if(objRef.transform._enabled || objRef.dragging._enabled){
                      let shape = cloneLayer(objRef);
                      shape['properties'] = objRef.properties;
                      shape['layerType'] = objRef.layerType;
                      objRef['_before'] = shape;
                    } 

                  }
                }},
                
                { text: 'Desfazer última ação',  callback: (evt) => {
                  var obj = objRef['_before'];
                  var isBindCtx = objRef['_context'];

                  var objNovos = objRef['_objetosNovos'];
                  if(objNovos){
                    objNovos.forEach((obj) => {
                      obj.removeFrom(_this.map);
                    });
                  }

                  if(obj && obj.length){
  
                    obj.forEach((objAux) => {
                      if(objAux){
                        if(!isBindCtx){
                          objAux.bindContextMenu(ctxReference(objAux));
                        }
                        objAux.snapediting = new L.Handler.PolylineSnap(_this.map, objAux);
                        objAux.snapediting.addGuideLayer(_this.editableFeatureGroup);
                        objAux.addTo(_this.editableFeatureGroup);
                        if(objAux.layerType !== 'marker'){
                          objAux.setStyle(_this.stylelayer.default);
                        }
                        objAux.on('click', (e) => {
                          _this.selecionarLayer(e);
                          _this.triggerScrollTo();
                        });
      
      
                        if(objAux.dragging) {
                          objAux.dragging.disable();
                        }
                        if(objAux.transform) {
                          objAux.transform.disable();
                        }
      
                        if(objRef.dragging) {
                          objRef.dragging.disable();
                        }
                        if(objRef.transform) {
                          objRef.transform.disable();
                        }

                        var id = objRef._leaflet_id;
                        const indice = _this.objetosSelecionados.indexOf(id);
                        _this.objetosSelecionados.splice(indice, 1);
                        _this.objetosSelecionadosMap.delete(id);
      
                        objRef.removeFrom(_this.map);
                        _this.editableFeatureGroup.removeLayer(objRef);
      
                      }
                    })
                  } else if(obj){
  
                    if(!isBindCtx){
                      obj.bindContextMenu(ctxReference(obj))
                    }
                    obj.snapediting = new L.Handler.PolylineSnap(_this.map, obj);
                    obj.snapediting.addGuideLayer(_this.editableFeatureGroup);
                    obj.addTo(_this.editableFeatureGroup);
                    if(obj.layerType !== 'marker'){
                      obj.setStyle(_this.stylelayer.default);
                    }
                    obj.on('click', (e) => {
                      _this.selecionarLayer(e);
                      _this.triggerScrollTo();
                    });
  
  
                    if(obj.dragging) {
                      obj.dragging.disable();
                    }
                    if(obj.transform) {
                      obj.transform.disable();
                    }
  
                    if(objRef.dragging) {
                      objRef.dragging.disable();
                    }
                    if(objRef.transform) {
                      objRef.transform.disable();
                    }

                    var id = objRef._leaflet_id;
                    const indice = _this.objetosSelecionados.indexOf(id);
                    _this.objetosSelecionados.splice(indice, 1);
                    _this.objetosSelecionadosMap.delete(id);
  
                    objRef.removeFrom(_this.map);
                    _this.editableFeatureGroup.removeLayer(objRef);

                  }

                  var layer = _this.editableFeatureGroup._layers[objRef._leaflet_id + 1];
                  
                  if(layer){
                    _this.editableFeatureGroup.removeLayer(layer);
                  }
                  _this.configurarAtributos();
                  _this.configurarTabelaAtributos();
                }},

                { text: 'Sair',  callback: (evt) => {
                  if (objRef.snapediting) {
                    objRef.snapediting.disable();
                    objRef['snap'] = false;
                    if(objRef.properties.layerType !== 'marker'){
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }
                  }
                  if (objRef.properties.layerType == 'LineString') {
                    if (objRef.editing && objRef.editing._enabled) {
                      objRef.editing.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    }
                  } else if (objRef.editing && objRef.editing._enabled) {
                    objRef.editing.disable();
                    if(objRef.properties.layerType !== 'marker'){
                      objRef.setStyle(_this.stylelayer.default);
                    }
                  }
                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform) {
                    objRef.transform.disable();
                  }
                }, }
              ]
            }
            return ctx;
          }

          polyline.bindContextMenu(ctxReference(polyline));
          polyline.addTo(this.editableFeatureGroup);
        }
      });

      this.configurarAtributos();
      this.configurarTabelaAtributos();

      this.loading = false;
    });
  }

  public toGeoJson() {
    const geoJsonData = {
      type: 'FeatureCollection',
      features: []
    };

    const listaFeatures = [];
    const indices = Object.getOwnPropertyNames(this.editableFeatureGroup._layers);
    for (const i of indices) {
      const _layer = this.editableFeatureGroup._layers[i];
      if (_layer) {
        listaFeatures.push(_layer);
      }
    }

    this.leafletUtil.duplicarAtributos(listaFeatures);
    this.leafletUtil.definirAtributosNulos(listaFeatures);
 
    this.editableFeatureGroup.getLayers().map(layer => {
      let coordsAux = [];

      const gjson = layer.toGeoJSON();
      
      if (layer.properties) {
        gjson.properties = layer.properties;
      } else if (layer.options) {
        gjson.properties = layer.options;
      } else {
        gjson.properties = {};
      }
      
     if(layer.check) {
        for(let i = 0; i < gjson.features.length; i++){
         coordsAux.push(gjson.features[i]['geometry']['coordinates']);
        }

       gjson.features[0]['geometry']['coordinates'] = coordsAux;
       gjson.features[0]['properties'] = gjson['properties'];
       gjson.features[0].geometry['type'] = "MultiPolygon";

       geoJsonData.features.push(gjson.features[0]);

     } else if (layer instanceof L.Circle) {
    
        gjson.properties.radius = layer.getRadius();
        geoJsonData.features.push(gjson);

     } else if ( gjson.type === 'FeatureCollection') {
       
        geoJsonData.features.push(gjson.features[0]);
     } else {
        geoJsonData.features.push(gjson);
      }
    });

    

    if (this.boasPraticasCarregadasNoMapa) {
      geoJsonData.features = this.populateFeatures(this.boasPraticasFeatureGroup,  geoJsonData.features);
      this.removerBoasPraticasDoMapa();
    }

    if (this.variaveisCarregadasNoMapa) {
      geoJsonData.features = this.populateFeatures(this.variaveisFeatureGroup, geoJsonData.features);
      this.removerVariaveisDoMapa();
    }

    if (this.indicadoresCarregadosNoMapa) {
      geoJsonData.features = this.populateFeatures(this.indicadoesFeatureGroup, geoJsonData.features);
      this.removerIndicadoresDoMapa();
    }
    
    this.shapeFileParaEditar.shapes = geoJsonData.features;
  }

  public editarShapFile(sair: boolean) {
    this.loading = true;
    this.map.eachLayer(layer => {
      layer.transform ? layer.transform.disable() : '';
    });
   
    if (this.shapeFileParaEditar.id) {
      this.toGeoJson();
      this.shapeItemService.editarPorIdShapeFile(this.idShapeFileEditar, this.shapeFileParaEditar.shapes).subscribe(async resp => {
        if (!sair) {
          this.limparFeatureGroups();
          this.editableFeatureGroup.clearLayers();
          await this.carregarShapeParaEditar(this.shapeFileParaEditar.id);
          this.loading = false;
        } else {
          this.shapeFileParaEditar = null;
          this.loading = false;
        }

        this.configurarAtributos();
        this.configurarTabelaAtributos();
        this.removerTodosTransformsDoMapa();
        PcsUtil.swal().fire({
          title: 'Sucesso',
          text: `Camada Salva`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.loading = false;
        }, error => { });
      }, errorService => {
        this.loading = false;
        this.removerTodosTransformsDoMapa();
      });
    }
  }

  public prepararAtributos(atributos: Map<string, string>, shape: any) {
    if (!this.modoDeletar) {
      this.shapeParaEditar = shape;

      this.atributosParaEditar = [];

      for (const prop in atributos) {
        if (atributos.hasOwnProperty(prop)) {
          const atributo: ShapeAtributo = new ShapeAtributo();
          atributo.atributo = prop;
          atributo.valor = atributos[prop];
          this.atributosParaEditar.push(atributo);
        }
      }

      if (this.atributosParaEditar.length <= 0) {
        const atributo: ShapeAtributo = new ShapeAtributo();
        this.atributosParaEditar.push(atributo);
      }
      this.openDialog();
    }
  }

  public openDialog(): void {
    const dialogRef = this.dialog.open(EditarAtributosComponent, {
      width: '50%',
      height: '500px',
      data: {
        atributosParaEditar: this.atributosParaEditar,
        idShapeParaEditar: this.shapeParaEditar.id,
        listaTipoAtributos: this.listaTiposAtributos
      }
    });
    

    dialogRef.afterClosed().subscribe(result => {
      const atributos: Map<string, string> = new Map<string, string>();
      result.forEach(item => {
        if (item.atributo && item.atributo != 'undefined' && item.atributo.trim() != '') {
          atributos.set(item.atributo, item.valor);
        }
      });

      const jsonObject = {};
      
      atributos.forEach((value, key) => {
          jsonObject[key] = value;
      });

      this.shapeParaEditar.properties = jsonObject;
      //
      const listaGroups: any = [this.editableFeatureGroup, this.editableFeatureGroupAux];
      this.menuShapesLayer.forEach( _group => {
        if (_group.selecionado) {
          listaGroups.push(_group);
        }
      });

      const listaFeatures = [];
      for (const _featureGroup of listaGroups) {
        const indices = Object.getOwnPropertyNames(_featureGroup._layers);
        for (const i of indices) {
          const _layer = _featureGroup._layers[i];
          if (_layer) {
            if(_layer.check && this.shapeParaEditar.idShapePai == _layer['idShapePai']) {
             _layer['properties'] = this.shapeParaEditar.properties;
            }
            listaFeatures.push(_layer);
          }
        }
      }

      this.leafletUtil.duplicarAtributos(listaFeatures);
      this.leafletUtil.definirAtributosNulos(listaFeatures);
      this.configurarAtributos();
      this.configurarTabelaAtributos();
    });
  }

  private limparFeatureGroups() {
    if (this.boasPraticasFeatureGroup) {
      this.boasPraticasFeatureGroup.clearLayers();
    }
    if (this.variaveisFeatureGroup) {
      this.variaveisFeatureGroup.clearLayers();
    }
    if (this.indicadoesFeatureGroup) {
      this.indicadoesFeatureGroup.clearLayers();
    }
    if (this.editableFeatureGroup) {
      this.editableFeatureGroup.clearLayers();
    }
    if (this.editableFeatureGroupAux) {
      this.editableFeatureGroupAux.clearLayers();
    }
    this.shapesSelecionados = [];
    this.shapesSelecionadosPorSelecaoArea = [];
  }

  highlightFeature(e) {
    const layer = e.target;
    const id = layer._leaflet_id;
    if ( this.objetosSelecionados.indexOf(id) === -1 ) {
      if (this.leafletUtil.getLayerType(layer) !== 'marker') {
        layer.setStyle(this.stylelayer.highlight);
      }
    }
  }

  highlightShapeSelecionado(layer) {
    const id = layer._leaflet_id;
    if ( this.objetosSelecionados.indexOf(id) === -1 ) {

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

        this.objetosSelecionados.push(id);
        this.objetosSelecionadosMap.set(id, layer);

      } else if (this.leafletUtil.getLayerType(layer) === 'LineString') {
        if (layer.options.color !== this.stylelayer.selected.color) {
          layer.setStyle(this.stylelayer.selected);
        } else {
          layer.setStyle(this.stylelayer.lineDefecto);
        }
        this.objetosSelecionados.push(id);
        this.objetosSelecionadosMap.set(id, layer);

      } else if (this.leafletUtil.getLayerType(layer) !== 'marker') {
        const layers = layer._layers;
        const indices = Object.getOwnPropertyNames(layers);
        for (const i of indices) {
          const layer = layers[i];

          const style: any = Object.assign({}, this.stylelayer.selected);
          if (layer.options.fillColor) {
            style.fillColor = layer.options.fillColor;
          } else {
            style.fillColor = layer.options.color;
          }
          layer.setStyle(style);

          this.objetosSelecionados.push(id);
          this.objetosSelecionadosMap.set(id, layer);
        }
      } else if (this.leafletUtil.getLayerType(layer) === 'marker') {
        this.objetosSelecionados.push(id);
        this.objetosSelecionadosMap.set(id, layer);
        const iconSelected = L.icon({
          iconUrl: '../../../../assets/marker-icon-selected.png'
        });
        layer.setIcon(iconSelected);
      }
    }
  }


  highlightReset(e) {
    const layer = e.target;
    const id = layer._leaflet_id;
    if ( this.objetosSelecionados.indexOf(id) === -1 ) {
      if (this.leafletUtil.getLayerType(layer) !== 'marker') {
        layer.setStyle(this.stylelayer.defecto);
      }
    }
  }

  highlightShapeSelecionadoReset(layer) {
    const id = layer._leaflet_id;
    if ( this.objetosSelecionados.indexOf(id) !== -1 ) {
      const indice = this.objetosSelecionados.indexOf(id);
      this.objetosSelecionados.splice(indice, 1);
      this.objetosSelecionadosMap.delete(id);
      if (this.leafletUtil.getLayerType(layer) == 'circle' ||
          this.leafletUtil.getLayerType(layer) == 'circlemarker' ||
          (!layer._layers && this.leafletUtil.getLayerType(layer) == 'polygon')) {
            if(layer.optionsColorBefore.color) {
              const styleAux = {
                color: layer['optionsColorBefore']['color'],
                weight: layer['optionsColorBefore']['weight'],
                opacity: layer['optionsColorBefore']['opacity']
              }

              layer.setStyle(styleAux);
            } else {
              layer.setStyle(this.stylelayer.defecto);
            }
      } else if (this.leafletUtil.getLayerType(layer) === 'LineString') {
        if(layer.optionsColorBefore.color) {
          const styleAux = {
            color: layer['optionsColorBefore']['color'],
            weight: layer['optionsColorBefore']['weight'],
            opacity: layer['optionsColorBefore']['opacity']
          }

          layer.setStyle(styleAux);
        } else {
          layer.setStyle(this.stylelayer.defecto);
        }

      } else if (this.leafletUtil.getLayerType(layer) !== 'marker') {
        if (this.leafletUtil.getLayerType(layer) == 'LineString'){
          if(layer.optionsColorBefore.color) {
            const styleAux = {
              color: layer['optionsColorBefore']['color'],
              weight: layer['optionsColorBefore']['weight'],
              opacity: layer['optionsColorBefore']['opacity']
            }

            layer.setStyle(styleAux);
          } else {
            layer.setStyle(this.stylelayer.defecto);
          }
            
        } else {
          const layers = layer._layers;
          const indices = Object.getOwnPropertyNames(layers);
          for (const i of indices) {
            const layer = layers[i];
            if(layer.optionsColorBefore.color) {
              const styleAux = {
                color: layer['optionsColorBefore']['color'],
                weight: layer['optionsColorBefore']['weight'],
                opacity: layer['optionsColorBefore']['opacity']
              }

              layer.setStyle(styleAux);
            } else {
              layer.setStyle(this.stylelayer.defecto);
            }
          }

        }
      } else if (this.leafletUtil.getLayerType(layer) === 'marker') {
        const iconDefault = L.icon({
          iconUrl: require('leaflet/dist/images/marker-icon.png')
        });
        layer.setIcon(iconDefault);
      }
    }
  }
  highlightShapeSelecionadoSeparadoReset(layer) {
    const id = layer._leaflet_id;
      const indice = this.objetosSelecionados.indexOf(id);
      this.objetosSelecionados.splice(indice, 1);
      this.objetosSelecionadosMap.delete(id);

      if (this.leafletUtil.getLayerType(layer) == 'circle' ||
          this.leafletUtil.getLayerType(layer) == 'circlemarker' ||
          (!layer._layers && this.leafletUtil.getLayerType(layer) == 'polygon') || (!layer._layers && this.leafletUtil.getLayerType(layer) == 'MultiPolygon')) {
           if (layer.optionsColorBefore) {
            layer.setStyle(layer.optionsColorBefore);
           }
          
      } else if (this.leafletUtil.getLayerType(layer) === 'LineString') {
        if (layer.optionsColorBefore) {
          layer.setStyle(layer.optionsColorBefore);
         }
         else {
           layer.setStyle(this.stylelayer.lineDefecto);
         }

      } else if (this.leafletUtil.getLayerType(layer) !== 'marker') {
        if (this.leafletUtil.getLayerType(layer) == 'LineString'){
          if (layer.optionsColorBefore) {
            layer.setStyle(layer.optionsColorBefore);
           }
           else {
             layer.setStyle(this.stylelayer.lineDefecto);
           }
            
        } else {
          const layers = layer._layers;
          const indices = Object.getOwnPropertyNames(layers);
          for (const i of indices) {
            const layer = layers[i];
            if (layer.optionsColorBefore) {
              layer.setStyle(layer.optionsColorBefore);
             }
             else {
               layer.setStyle(this.stylelayer.lineDefecto);
             }
          }

        }
      } else if (this.leafletUtil.getLayerType(layer) === 'marker') {
        const iconDefault = L.icon({
          iconUrl: require('leaflet/dist/images/marker-icon.png')
        });
        layer.setIcon(iconDefault);
      }
  }

  removerTodosTransformsDoMapa() {
    this.map.eachLayer(layer => {
      layer.transform ? layer.transform.disable() : '';

      if(layer._layers){
        let keys = Object.keys(layer._layers);
        keys.forEach(key => {
          layer._layers[key].transform ?  layer._layers[key].transform.disable(): '';
          if(layer._layers[key]._layers){
            let keys2 = Object.keys(layer._layers[key]._layers);
            keys2.forEach(key2 => {
              layer._layers[key]._layers[key2].transform ? layer._layers[key]._layers[key2].transform.disable(): '';
            })
          }
        })
      }
    });

    if (this.keysShapeFiles.length > 0) {
      this.keysShapeFiles.forEach(layer => {
        if (layer.layer) {
          layer.layer.transform ? layer.layer.transform.disable() : '';
        }
      })
    }
  }


    selecionarLayer(e) {
    let _this = this;
    if (!_this.modoDeletar && !_this.modoImpressao) {
      let layer = e.target;
      let id = layer._leaflet_id;
      if(e['lasso']){
        id++;
      }
     
      if ( this.objetosSelecionados.indexOf(id) === -1 ) {
         //Seleciona
        layer.optionsColorBefore = {};
        layer.optionsColorBefore.color = layer.options.color;
        layer.optionsColorBefore.weight = layer.options.weight;
        layer.optionsColorBefore.fillOpacity = layer.options.fillOpacity;
        layer.optionsColorBefore.strokeOpacity = layer.options.strokeOpacity;
        layer.optionsColorBefore.fillColor = layer.options.fillColor;
        layer.optionsColorBefore.opacity = layer.options.opacity;
        
        
        this.objetosSelecionados.push(id);
        this.objetosSelecionadosMap.set(id, layer);
        if (this.leafletUtil.getLayerType(layer) == 'circle' ||
            this.leafletUtil.getLayerType(layer) == 'circlemarker' ||
            (!layer._layers && (this.leafletUtil.getLayerType(layer) == 'polygon') || (!layer._layers && this.leafletUtil.getLayerType(layer) == 'MultiPolygon'))) {
          const style: any = Object.assign({}, this.stylelayer.selected);
          if (layer.options.fillColor) {
            style.fillColor = layer.options.fillColor;
          } else {
            style.fillColor = layer.options.color;
          }
          layer.setStyle(style);
          this.desabilitarOpcoesContextMenuDoShape(layer);

        } else if (this.leafletUtil.getLayerType(layer) === 'LineString') {
            if (layer.options.color !== this.stylelayer.selected.color) {
              layer.setStyle(this.stylelayer.selected);
            } else {
              layer.setStyle(this.stylelayer.lineDefecto);
            }

            this.desabilitarOpcoesContextMenuDoShape(layer);

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

            this.desabilitarOpcoesContextMenuDoShape(layer);
          }
        } else if (this.leafletUtil.getLayerType(layer) === 'marker') {
          const iconSelected = L.icon({
            iconUrl: '../../../../assets/marker-icon-selected.png'
          });
          this.desabilitarOpcoesContextMenuDoShape(layer);
        }
      } else {
        //Desseleciona
        const indice = this.objetosSelecionados.indexOf(id);
        this.objetosSelecionados.splice(indice, 1);
        this.objetosSelecionadosMap.delete(id);

        if (this.leafletUtil.getLayerType(layer) == 'circle' ||
            this.leafletUtil.getLayerType(layer) == 'circlemarker' ||
            (!layer._layers && (this.leafletUtil.getLayerType(layer) == 'polygon') || (!layer._layers && this.leafletUtil.getLayerType(layer) == 'MultiPolygon'))) {
            layer.options = this.copiarPropriedadesOption(layer.optionsColorBefore, layer.options);
            layer.setStyle(layer.options);
           
            this.desabilitarOpcoesContextMenuDoShape(layer);

        } else if (this.leafletUtil.getLayerType(layer) === 'LineString') {
         layer.options = this.copiarPropriedadesOption(layer.optionsColorBefore, layer.options);
         layer.setStyle(layer.options);
         this.desabilitarOpcoesContextMenuDoShape(layer);

        } else if (this.leafletUtil.getLayerType(layer) === 'marker') {
          const iconDefault = L.icon({
            iconUrl: require('leaflet/dist/images/marker-icon.png')});
          layer.setIcon(iconDefault);
          this.desabilitarOpcoesContextMenuDoShape(layer);

        } else if (this.leafletUtil.getLayerType(layer) !== 'marker') {
          const layers = layer._layers;
          const indices = Object.getOwnPropertyNames(layers);
          for (const i of indices) {
            const layer = layers[i];
            layer.options = this.copiarPropriedadesOption(layer.optionsColorBefore, layer.options);            
            layer.setStyle(layer.options);

            this.desabilitarOpcoesContextMenuDoShape(layer);
          }
        } 
      }
    }
  }

  desabilitarOpcoesContextMenuDoShape(layer: any) {
    if (layer.editing) {
      layer.editing.disable();
    }
    if(layer['snap']){
      layer.snapediting.disable();
    }
    if(layer.dragging){
      layer.dragging.disable();
    }
    if(layer.transform) {
      layer.transform.disable();
    }
  }

  copiarPropriedadesOption(optionsColorBefore, options){
    /*options.color = optionsColorBefore.color != null && optionsColorBefore.color != undefined ? optionsColorBefore.color : options.color;
    options.weight = optionsColorBefore.weight != null && optionsColorBefore.weight != undefined  ? optionsColorBefore.weight : options.weight;
    options.fillOpacity = optionsColorBefore.fillOpacity != null && optionsColorBefore.fillOpacity != undefined ? optionsColorBefore.fillOpacity : options.fillOpacity;
    options.strokeOpacity = optionsColorBefore.strokeOpacity != null && optionsColorBefore.strokeOpacity != undefined ? optionsColorBefore.strokeOpacity : options.strokeOpacity;
    options.fillColor = optionsColorBefore.fillColor != null && optionsColorBefore.fillColor != undefined ? optionsColorBefore.fillColor : options.fillColor;
    options.opacity = optionsColorBefore.opacity != null && optionsColorBefore.opacity != undefined ? optionsColorBefore.opacity : options.opacity;

    return options;*/

    if(options.color == this.stylelayer.selected.color) {
      options.color = optionsColorBefore.color != null && optionsColorBefore.color != undefined ? optionsColorBefore.color : options.color;
    }

    if(options.weight == this.stylelayer.selected.weight) {
      options.weight = optionsColorBefore.weight != null && optionsColorBefore.weight != undefined  ? optionsColorBefore.weight : options.weight;
    }

    if(options.fillColor == '#c0c3ac') {
      options.fillColor = optionsColorBefore.fillColor != null && optionsColorBefore.fillColor != undefined ? optionsColorBefore.fillColor : options.fillColor;
    }
    
    if(options.fillOpacity == 0.5) {
      options.fillOpacity = optionsColorBefore.fillOpacity != null && optionsColorBefore.fillOpacity != undefined ? optionsColorBefore.fillOpacity : options.fillOpacity;
    }

    if(options.opacity == 1 || options.opacity == 0.5) {
      options.opacity = optionsColorBefore.opacity != null && optionsColorBefore.opacity != undefined ? optionsColorBefore.opacity : options.opacity;
    }

    if(options.strokeOpacity == 0.5) {
      options.strokeOpacity = optionsColorBefore.strokeOpacity != null && optionsColorBefore.strokeOpacity != undefined ? optionsColorBefore.strokeOpacity : options.strokeOpacity;
    }

    return options;
  }

  selecionarArea(obj) {
    const listaGroups: any = [this.editableFeatureGroup, this.editableFeatureGroupAux];
    // const listaGroups: any = [];
    this.menuShapesLayer.forEach( _group => {
      listaGroups.push(_group);
    });

    this.layersGroup.getLayers().forEach( layer  => {
      for (const l of layer.getLayers()) {
        listaGroups.push(l);
      }
    });

    const geoJSONSelecionado = this.leafletUtil.toGeoJSON(obj);

    for (const _featureGroup of listaGroups) {

      if (_featureGroup && ( this.leafletUtil.getLayerType(_featureGroup) === 'marker' ||
          this.leafletUtil.getLayerType(_featureGroup) === 'circle' ||
          this.leafletUtil.getLayerType(_featureGroup) === 'circlemarker' )) {
        const geoJSON = this.leafletUtil.toGeoJSON(_featureGroup);
        const overlaping: boolean =  this.leafletUtil.isOverlapWithIntersecting(geoJSONSelecionado, geoJSON);
        if (overlaping) {
          if (this.objetosSelecionados.indexOf(_featureGroup._leaflet_id) == -1 ) {
            this.objetosSelecionados.push(_featureGroup._leaflet_id);
            this.objetosSelecionadosMap.set(_featureGroup._leaflet_id,  _featureGroup);
            if (this.leafletUtil.getLayerType(_featureGroup) === 'marker') {
              const iconSelected = L.icon({
                iconUrl: '../../../../assets/marker-icon-selected.png'
              });
              _featureGroup.setIcon(iconSelected);
            } else {
              _featureGroup['optionsColorBefore'] = Object.assign({}, _featureGroup.options);
              _featureGroup.setStyle(this.stylelayer.selected);
             
            }
          }
        }
      // multipolygon
      } else {
        for (const _layer of _featureGroup.getLayers()) {
          if (_layer) {
            const geoJSON = this.leafletUtil.toGeoJSON(_layer);
            const overlaping: boolean =  this.leafletUtil.isOverlapWithIntersecting(geoJSONSelecionado, geoJSON);
            if (overlaping) {
              if (this.objetosSelecionados.indexOf(_layer._leaflet_id) == -1 ) {
                this.objetosSelecionados.push(_layer._leaflet_id);
                this.objetosSelecionadosMap.set(_layer._leaflet_id,  _layer);
                if (this.leafletUtil.getLayerType(_layer) === 'marker') {
                  const iconSelected = L.icon({
                    iconUrl: '../../../../assets/marker-icon-selected.png'
                  });
                  _layer.setIcon(iconSelected);
                } else {
                  _layer['optionsColorBefore'] = Object.assign({}, _layer.options);
                  _layer.setStyle(this.stylelayer.selected);
                }
              }
            }
          }
        }
      }
    }
  }

    exportarShapeDaView() {
    if (this.objetosSelecionados.length == 0 ) {
      this.exportarShapeDaViewProcesso({ value: 'todos'});
    } else {
      PcsUtil.swal().fire({
        title: 'Exportação para ShapeFile',
        text: `Quais objetos você deseja exportar?`,
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Exportar',
        cancelButtonText: 'Cancelar',
        input: 'select',
        inputOptions : {
          selecionados: 'Apenas os Selecionados',
          naoSelecionados: 'Só objetos não Selecionados',
          todos: 'Todos os objetos',
        }
      }).then((result) => {
        const escolha: any = result;
        if ( escolha.dismiss && escolha.dismiss === 'cancel') {
          return;
        }
        this.exportarShapeDaViewProcesso(escolha);
      });
    }

  }

    exportarShapeDaViewProcesso(escolha) {
    this.loading = true;
    const listaGroups: any = [this.editableFeatureGroup, this.editableFeatureGroupAux];


    
    this.layersGroup.getLayers().forEach( layer  => {
      for (const l of layer.getLayers()) {
        listaGroups.push(l);
      }
    });

    const listaFeatures = [];
    for (const _featureGroup of listaGroups) {
          let indices: Array<any> = [];
          if (_featureGroup._layers) {
            indices = Object.getOwnPropertyNames(_featureGroup._layers);
          } else {
            indices.push(_featureGroup._leaflet_id) ;
          }
          for (const i of indices) {
            let _layer: any;
            if (_featureGroup._layers) {
              _layer = _featureGroup._layers[i];
            } else {
              _layer = _featureGroup;
            }
            if (_layer) {
              switch (escolha.value) {
                case 'selecionados':
                  if (this.objetosSelecionados.indexOf(_layer._leaflet_id) > -1 || this.objetosSelecionados.indexOf(_layer._leaflet_id + 1) > -1 ) {
                    
                   /* if((geoJSON.geometry && geoJSON.geometry.type == 'MultiPolygon') ||
                        (geoJSON.feature && geoJSON.feature.geometry.type == 'MultiPolygon')){
                      const listaPoligonos = this.leafletUtil.multiPolygon2Polygons(geoJSON);
                      for (const poligono of listaPoligonos) {
                        listaFeatures.push(poligono);
                      }
                      listaFeatures.push(geoJSON);
                    } else {
                      listaFeatures.push(geoJSON);
                    //}*/

                    const geoJSON =  _layer.toGeoJSON();

                    listaFeatures.push(geoJSON);
                  }
                  break;
                case 'naoSelecionados':
                  if (this.objetosSelecionados.indexOf(_layer._leaflet_id) === -1 ) {
                    //const geoJSON = this.leafletUtil.toGeoJSON(_layer);
                    /*if((geoJSON.geometry && geoJSON.geometry.type == 'MultiPolygon') ||
                        (geoJSON.feature && geoJSON.feature.geometry.type == 'MultiPolygon')){
                     const listaPoligonos = this.leafletUtil.multiPolygon2Polygons(geoJSON);
                      for (const poligono of listaPoligonos) {
                        listaFeatures.push(poligono);
                      }
                    //} else {
                       listaFeatures.push(geoJSON);
                   // }*/

                   const geoJSON = _layer.toGeoJSON();

                   listaFeatures.push(geoJSON);
                  }
                  break;
                case 'todos':
                  //const geoJSON = this.leafletUtil.toGeoJSON(_layer);
                 
                  /*if((geoJSON.geometry && geoJSON.geometry.type == 'MultiPolygon') ||
                      (geoJSON.feature && geoJSON.feature.geometry.type == 'MultiPolygon')){
                    const listaPoligonos = this.leafletUtil.multiPolygon2Polygons(geoJSON);
                    for (const poligono of listaPoligonos) {
                      listaFeatures.push(poligono);
                    }
                   listaFeatures.push(geoJSON);
                  //} else {
                    listaFeatures.push(geoJSON)
                  //}*/

                  const geoJSON = _layer.toGeoJSON();

                  listaFeatures.push(geoJSON);

                  break;
                default:
                  break;
              }
            }
          }
        }
    if (listaFeatures.length > 0) {
     
      this.leafletUtil.criarEExportarShapeFile(listaFeatures);
    } else {
      PcsUtil.swal().fire({
        title: 'Não há objetos para serem exportados',
        text: `Por favor desenhe objetos no mapa para realizar a exportação`,
        type: 'error',
        showCancelButton: true,
        cancelButtonText: 'Fechar',
        showConfirmButton: false
      });
    }

    this.loading = false;
  }

    enviarParaFrente(objeto) {
    if (objeto.layer) {
      objeto.layer.bringToFront();
    } else {
      objeto.bringToFront();
    }

  }

    enviarParaTras(objeto) {
    if (objeto.layer) {
      objeto.layer.bringToBack();
    } else {
      objeto.bringToBack();
    }
  }

    adicionarContextMenu(objeto, nomeCamada) {
    if (objeto.layer) {
      try {
        const textoAtributos = this.propriedadesToString(objeto.layer.properties, nomeCamada);
        var _this = this;
        let ctxReference = function(objRef){
          var ctx = {
            contextmenu: true,
            contextmenuInheritItems: false,
            contextmenuItems: [
              { text: 'Selecionar tudo nessa área',  callback: (evt) => {_this.selecionarArea(objeto); } },
              { text: 'Enviar para frente',  callback: (evt) => {_this.enviarParaFrente(objeto); } },
              { text: 'Enviar para trás',  callback: (evt) => {_this.enviarParaTras(objeto); } },
              { text: 'Definir Rótulo',  callback: (evt) => {_this.definirRotulo(objeto); } },
              { text: 'Remover Rótulo',  callback: (evt) => {_this.fecharRotulo(objeto); } },
              { text: 'Visualizar Atributos',  callback: (evt) => {
                const textoPropriedades = _this.propriedadesToString(objRef.layer.feature.properties, nomeCamada);
                objRef.layer.bindPopup(nomeCamada,
                { maxHeight: 300,
                closeOnClick: true,
                keepInView: true,
                autoPan: false});
                
                objRef.layer.openPopup();
                objRef.layer.unbindPopup();
              } },
              { text: 'Editar Propriedades',  callback: (evt) => {_this.openDialogPropriedades(objRef.layer, false); } },
              { text: 'Editar Atributos',  callback: (evt) => {_this.prepararAtributos(objRef.layer.properties, objRef.layer); } },
              !objRef._radius ? { text: 'Editar Shape',  callback: (evt) => {
                if (!objRef.layer.editing._enabled) {
                    objRef.layer['_context'] = null;
                    objRef.layer['_objetosNovos'] = null;
                    if (objRef.layer.properties.layerType == 'LineString') {
                      if (objRef.layer.editing._enabled) {
                        objRef.layer.editing.disable();
                        objRef.layer.setStyle(_this.stylelayer.lineDefecto);
                      } else {
                        objRef.layer.editing.enable();
                        objRef.layer.setStyle(_this.stylelayer.selected);
                      }
                    } else {
                      if (objRef.layer.editing._enabled) {
                        objRef.layer.editing.disable();
                        if(objRef.layer.properties.layerType !== 'marker'){
                          objRef.layer.setStyle(_this.stylelayer.default);
                        }
                      } else {
                        objRef.layer.editing.enable();
                        if(objRef.layer.properties.layerType !== 'marker'){
                          objRef.layer.setStyle(_this.stylelayer.selectedPathOptions);
                        }
                      }
                    }
                    
                    if(objRef.layer.dragging) {
                      objRef.layer.dragging.disable();
                    }
                    if(objRef.layer.transform){
                      objRef.layer.transform.disable();
                    }

                    if (objRef.layer.editing._enabled) {
                      if(objRef.layer['layerType'] == 'circle'){
                        const circle = new L.Circle(objRef.layer._latlng,objRef.layer.options);
                        circle['layerType'] = objRef.layer['layerType'];
                        circle['properties'] = objRef.layer['properties'];
                        objRef.layer['_before'] = circle;
                      } else if(objRef.layer['layerType'] == 'circlemarker'){
                        const circleMarker = new L.CircleMarker(objRef.layer._latlng,objRef.layer.options);
                        circleMarker['layerType'] = objRef.layer['layerType'];
                        circleMarker['properties'] = objRef.layer['properties'];
                        objRef.layer['_before'] = circleMarker;
                      }else{
                        const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                          style:  objRef.options,
                        });
                        geoJson['layerType'] = objRef.layer['layerType'];
                        geoJson['properties'] = objRef.layer['properties'];
                  
                        _this.adicionarContextMenu(geoJson, 'Edição');
                        if(geoJson['layerType'] !== 'marker'){
                          geoJson.setStyle(_this.stylelayer.lineDefecto);
                        }
                        if(geoJson._layers){
                          const keysEdicao = Object.keys(geoJson._layers);
                          if (keysEdicao.length > 0) {
                            keysEdicao.forEach(key => {
                              geoJson._layers[key]['properties'] = objRef.layer['properties'];
                              if(geoJson._layers[key].transform){
                                geoJson._layers[key].transform.disable()
                              }
                              if(geoJson._layers[key].dragging){
                                geoJson._layers[key].dragging.disable()
                              }
                            })
                          }
                        }
                        objRef.layer['_before'] = geoJson;
                        objRef.layer['_context'] = true;
                      }
                    }
                }  
              }, } : {text: 'Editar Shape',  callback: (evt) => { _this._snackBar.open("Não é possível executar essa funcionalidade para essa camada.", 'Fechar', {
                duration: 4000,});  }},
              !objRef._radius ? { text: 'Snap To',  callback: (evt) => {
                if (!objRef.layer.editing._enabled) {
                  objRef.layer['_context'] = null;
                  objRef.layer['_objetosNovos'] = null;
                  if(objRef.layer.transform && objRef.layer.dragging) {
                    objRef.layer.transform.disable();
                    objRef.layer.dragging.disable();
                  }
  
                  if(!objRef.layer.snapediting && objRef.layer.properties.layerType !== 'marker'){
                    objRef.layer.snapediting = new L.Handler.PolylineSnap(_this.map, objRef);
                    objRef.layer.snapediting.addGuideLayer(_this.editableFeatureGroup);
                  } else if(!objRef.snapediting && objRef.layer.properties.layerType == 'marker') {
                    objRef.snapediting = new L.Handler.MarkerSnap(_this.map, objRef);
                    objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                  }
                  if(objRef.layer['snap']){
                    objRef.layer.snapediting.disable();
                    objRef.layer.setStyle(_this.stylelayer.lineDefecto);
                  }else{
                    if(objRef.layer['layerType'] == 'circle'){
                      const circle = new L.Circle(objRef.layer._latlng,objRef.layer.options);
                      circle['layerType'] = objRef.layer['layerType'];
                      circle['properties'] = objRef.layer['properties'];
                      objRef.layer['_before'] = circle;
                    } else if(objRef.layer['layerType'] == 'circlemarker'){
                      const circleMarker = new L.CircleMarker(objRef.layer._latlng,objRef.layer.options);
                      circleMarker['layerType'] = objRef.layer['layerType'];
                      circleMarker['properties'] = objRef.layer['properties'];
                      objRef.layer['_before'] = circleMarker;
                    }else{
                      const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                        style:  objRef.options,
                      });
                      geoJson['layerType'] = objRef.layer['layerType'];
                      geoJson['properties'] = objRef.layer['properties'];
                
                      _this.adicionarContextMenu(geoJson, 'Edição');
                      if(geoJson['layerType'] !== 'marker'){
                        geoJson.setStyle(_this.stylelayer.lineDefecto);
                      }
                      if(geoJson._layers){
                        const keysEdicao = Object.keys(geoJson._layers);
                        if (keysEdicao.length > 0) {
                          keysEdicao.forEach(key => {
                            geoJson._layers[key]['properties'] = objRef.layer['properties'];
                            if(geoJson._layers[key].transform){
                              geoJson._layers[key].transform.disable()
                            }
                            if(geoJson._layers[key].dragging){
                              geoJson._layers[key].dragging.disable()
                            }
                          })
                        }
                      }
                      objRef.layer['_before'] = geoJson;
                      objRef.layer['_context'] = true;
                    }
    
                

                    objRef.layer.snapediting.enable();
                    if (objRef.layer.properties && objRef.layer.properties.layerType && objRef.layer.properties.layerType == 'LineString') {
                      objRef.layer.setStyle(_this.stylelayer.selected);
                    } else {
                      objRef.layer.setStyle(_this.stylelayer.selectedPathOptions);
                    }
                  }
                  
                  objRef.layer['snap'] ? objRef.layer['snap'] =  false : objRef.layer['snap'] =  true;
                }


                }
              } : {text: 'Snap To',  callback: (evt) => { _this._snackBar.open("Não é possível executar essa funcionalidade para essa camada.", 'Fechar', {
                duration: 4000,});  }},
              { text: 'Mesclar Objetos',  callback: (evt) => {
                if(objRef.layer.dragging) {
                  objRef.layer.dragging.disable();
                 }
                if(objRef.layer.transform){
                  objRef.layer.transform.disable();
                 }
                _this.mesclarObjetos();
              }},
              { text: 'Cortar Objetos',  callback: (evt) => {
                if(objRef.layer.dragging) {
                  objRef.layer.dragging.disable();
                 }
                if(objRef.layer.transform){
                  objRef.layer.transform.disable();
                 }
                _this.cortarObjetos(objRef.layer);
              }},
              { text: 'Separar Objetos',  callback: (evt) => {
                if(objRef.layer.dragging) {
                  objRef.layer.dragging.disable();
                 }
                if(objRef.layer.transform){
                  objRef.layer.transform.disable();
                 }
                _this.separarObjetos(objRef.layer);
              }},
              { text: 'Mover/Rotacionar Objeto',  callback: (evt) => {
                objRef.layer['_context'] = null;
                objRef.layer['_objetosNovos'] = null;
                if(objRef.layer.dragging && objRef.layer.transform) {
                  objRef.layer.dragging._enabled ? objRef.layer.dragging.disable() : objRef.layer.dragging.enable();
                  objRef.layer.transform._enabled ? objRef.layer.transform.disable() : objRef.layer.transform.enable();
                }
                
                if(objRef.layer.transform && objRef.layer.dragging) {

                  if(objRef.layer.transform._enabled || objRef.layer.dragging._enabled){
                    let shape = cloneLayer(objRef.layer);
                    shape['properties'] = objRef.layer.properties;
                    shape['layerType'] = objRef.layer.layerType;
                    objRef.layer['_before'] = shape;
                  } 

                }

              }},
              { text: 'Medir Objeto',  callback: (evt) => {
                if(objRef.layerType == 'rectangle' || objRef.layerType == 'polygon') {
                 let geoJson = objRef.toGeoJSON();
                 let lengthObject: any = turf.length(geoJson).toFixed(5);
                 lengthObject = (lengthObject * 1000);
                 objRef.bindPopup(`Área: ${turf.area(geoJson).toLocaleString('pt-BR')} m²<br>
                                    Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                 objRef.openPopup();
                 objRef.unbindPopup();
  
                } else if (objRef.layerType == 'circle') {
                  let circle = turf.circle([objRef.getLatLng().lat, objRef.getLatLng().lng], objRef._mRadius);
                  let lengthObject: any = turf.length(circle).toFixed(5);
                  lengthObject = (lengthObject * 1000);
                  objRef.bindPopup(`Área: ${turf.area(circle).toLocaleString('pt-BR')} m² <br>
                                    Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                  objRef.openPopup();
                  objRef.unbindPopup();                  
                  
                } else if (objRef.properties.radius) {
                  let circle = turf.circle([objRef.getLatLng().lat, objRef.getLatLng().lng], objRef._mRadius);
                  let lengthObject: any = turf.length(circle).toFixed(5);
                  lengthObject = (lengthObject * 1000);
                  objRef.bindPopup(`Área: ${turf.area(circle).toLocaleString('pt-BR')} m² <br>
                                    Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                  objRef.openPopup();
                  objRef.unbindPopup();
                  
                } else if (objRef.layerType == 'polyline' || objRef.properties.layerType == 'LineString') {
                  let lengthObject: any = turf.length(objRef.toGeoJSON()).toFixed(5);
                  lengthObject = (lengthObject * 1000).toLocaleString('pt-BR');
                  objRef.bindPopup(`Comprimento: ${lengthObject} m`);
                  objRef.openPopup();
                  objRef.unbindPopup();
                }
              }},
  
              //IF ternario
              // objRef.layer.layerType == 'rectangle' || objRef.layer.layerType == 'polygon' || objRef.layer.layerType == 'polyline' ? { text: 'Mover/Rotacionar Objeto',  callback: (evt) => {
              //   if(objRef.layer.transform && objRef.layer.dragging) {
              //     objRef.layer.transform._enabled ? objRef.layer.transform.disable() : objRef.layer.transform.enable();
              //     objRef.layer.dragging._enabled ? objRef.layer.dragging.disable() : objRef.layer.dragging.enable();
              //   }
              // }} : { text: 'Mover Objeto',  callback: (evt) => {
              //   if(objRef.layer.dragging) {
              //     objRef.layer.dragging._enabled ? objRef.layer.dragging.disable() : objRef.layer.dragging.enable();
              //   }
              // }},
  
              { text: 'Desfazer última ação',  callback: (evt) => {
                var obj = objRef['_before'];
                var isBindCtx = objRef['_context'];

                var objNovos = objRef['_objetosNovos'];
                if(objNovos){
                  objNovos.forEach((obj) => {
                    obj.removeFrom(_this.map);
                  });
                }

                if(obj && obj.length){

                  obj.forEach((objAux) => {
                    if(objAux){
                      if(!isBindCtx){
                        objAux.bindContextMenu(ctxReference(objAux));
                      }
                      objAux.snapediting = new L.Handler.PolylineSnap(_this.map, objAux);
                      objAux.snapediting.addGuideLayer(_this.editableFeatureGroup);
                      objAux.addTo(_this.editableFeatureGroup);
                      if(objAux.layerType !== 'marker'){
                        objAux.setStyle(_this.stylelayer.default);
                      }
                      objAux.on('click', (e) => {
                        _this.selecionarLayer(e);
                        _this.triggerScrollTo();
                      });
    
    
                      if(objAux.dragging) {
                        objAux.dragging.disable();
                      }
                      if(objAux.transform) {
                        objAux.transform.disable();
                      }
    
                      if(objRef.layer.dragging) {
                        objRef.layer.dragging.disable();
                      }
                      if(objRef.layer.transform) {
                        objRef.layer.transform.disable();
                      }

                      var id = objRef.layer._leaflet_id;
                      const indice = _this.objetosSelecionados.indexOf(id);
                      _this.objetosSelecionados.splice(indice, 1);
                      _this.objetosSelecionadosMap.delete(id);
    
                      objRef.layer.removeFrom(_this.map);
                      _this.editableFeatureGroup.removeLayer(objRef.layer);
    
                    }
                  })
                } else if(obj){

                  if(!isBindCtx){
                    obj.bindContextMenu(ctxReference(obj))
                  }
                  obj.snapediting = new L.Handler.PolylineSnap(_this.map, obj);
                  obj.snapediting.addGuideLayer(_this.editableFeatureGroup);
                  obj.addTo(_this.editableFeatureGroup);
                  if(obj.layerType !== 'marker'){
                    obj.setStyle(_this.stylelayer.default);
                  }
                  obj.on('click', (e) => {
                    _this.selecionarLayer(e);
                    _this.triggerScrollTo();
                  });


                  if(obj.dragging) {
                    obj.dragging.disable();
                  }
                  if(obj.transform) {
                    obj.transform.disable();
                  }

                  if(objRef.layer.dragging) {
                    objRef.layer.dragging.disable();
                  }
                  if(objRef.layer.transform) {
                    objRef.layer.transform.disable();
                  }

                  var id = objRef.layer._leaflet_id;
                  const indice = _this.objetosSelecionados.indexOf(id);
                  _this.objetosSelecionados.splice(indice, 1);
                  _this.objetosSelecionadosMap.delete(id);

                  objRef.layer.removeFrom(_this.map);
                  _this.editableFeatureGroup.removeLayer(objRef.layer);

                }

                var layer = _this.editableFeatureGroup._layers[objRef.layer._leaflet_id + 1];
                if(layer){
                  _this.editableFeatureGroup.removeLayer(layer);
                }
                _this.configurarAtributos();
                _this.configurarTabelaAtributos();
              }},

              { text: 'Sair',  callback: (evt) => {
                if (objRef.layer.snapediting) {
                  objRef.layer.snapediting.disable();
                  objRef.layer['snap'] = false;
                  if(objRef.layer.properties.layerType !== 'marker'){
                    objRef.layer.setStyle(_this.stylelayer.lineDefecto);
                  }
                }
                if (objRef.layer.properties.layerType == 'LineString') {
                  if (objRef.layer.editing && objRef.editing._enabled) {
                    objRef.layer.editing.disable();
                    objRef.layer.setStyle(_this.stylelayer.lineDefecto);
                  }
                } else if (objRef.layer.editing && objRef.layer.editing._enabled) {
                  objRef.layer.editing.disable();
                  if(objRef.layer.properties.layerType !== 'marker'){
                    objRef.layer.setStyle(_this.stylelayer.default);
                  }
                }
                if(objRef.layer.dragging) {
                  objRef.layer.dragging.disable();
                }
                if(objRef.layer.transform) {
                  objRef.layer.transform.disable();
                }
              }, }
            ]
          }
          return ctx;
        }
        objeto.layer.bindContextMenu(ctxReference(objeto));
      } catch (error) {
      }
    } else if (objeto._layers) {
      const layers = objeto._layers;
      const indices = Object.getOwnPropertyNames(layers);
      for (const i of indices) {
        const layer = layers[i];
        try {
        var _this = this;
        let ctxReference = function(objRef){
          let ctx = {
          contextmenu: true,
          contextmenuInheritItems: false,
          contextmenuItems: [
            { text: 'Selecionar tudo nessa área',  callback: (evt) => {_this.selecionarArea(objRef); } },
            { text: 'Enviar para frente',  callback: (evt) => {_this.enviarParaFrente(objRef); } },
            { text: 'Enviar para trás',  callback: (evt) => {_this.enviarParaTras(objRef); } },
            { text: 'Definir Rótulo',  callback: (evt) => {_this.definirRotulo(objRef); } },
            { text: 'Remover Rótulo',  callback: (evt) => {_this.fecharRotulo(objRef); } },
            { text: 'Visualizar Atributos',  callback: (evt) => {
              var textoPropriedades;
              if(objeto.filtros){
                textoPropriedades = _this.propriedadesToString(objeto.properties, nomeCamada);
              }else{
                textoPropriedades = _this.propriedadesToString(objRef.feature.properties, nomeCamada);
              }
              objRef.bindPopup(textoPropriedades,
              { maxHeight: 200,
              closeOnClick: true,
              keepInView: true,
              autoPan: false});

              objRef.openPopup();
              objRef.unbindPopup();
            } },
            { text: 'Editar Propriedades',  callback: (evt) => {_this.openDialogPropriedades(objRef, false); } },
            { text: 'Editar Atributos',  callback: (evt) => {_this.prepararAtributos(objRef.feature.properties, objRef); } },
            !objRef._radius ? { text: 'Editar Shape',  callback: (evt) => {

              let corrigeArrayLatLngs = function() {
                if (objRef['_latlngs'][0][0].length > 1) {
                  objRef['_latlngs'][0] = objRef['_latlngs'][0][0]
                }
              }
              corrigeArrayLatLngs()
              if (!objRef.editing._enabled) {
                  objRef['_context'] = null;
                  objRef['_objetosNovos'] = null;
                  if (objRef.feature.properties.layerType == 'LineString') {
                    if (objRef.editing._enabled) {
                      objRef.editing.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    } else {
                      objRef.editing.enable();
                      objRef.setStyle(_this.stylelayer.selected);
                    }
                  } else {
                    if (objRef.editing._enabled) {
                      objRef.editing.disable();
                      if(objRef.feature.properties.layerType !== 'marker'){
                        objRef.setStyle(_this.stylelayer.default);
                      }
                    } else {
                      objRef.editing.enable();
                      if(objRef.feature.properties.layerType !== 'marker'){
                        objRef.setStyle(_this.stylelayer.selectedPathOptions);
                      }
                    }
                  }
                  
                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform){
                    objRef.transform.disable();
                  }

                  if (objRef.editing._enabled) {
                    if(objRef['feature']['properties']['layerType'] == 'circle'){
                      const circle = new L.Circle(objRef._latlng,objRef.options);
                      circle['layerType'] = objRef['feature']['properties']['layerType'];
                      circle['properties'] = objRef['feature']['properties'];
                      objRef['_before'] = circle;
                    } else if(objRef['feature']['properties']['layerType'] == 'circlemarker'){
                      const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                      circleMarker['layerType'] = objRef['feature']['properties']['layerType'];
                      circleMarker['properties'] = objRef['feature']['properties'];
                      objRef['_before'] = circleMarker;
                    }else{
                      const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                        style:  objRef.options,
                      });

                      geoJson['layerType'] = objRef['feature']['properties']['layerType'];
                      geoJson['properties'] = objRef['feature']['properties'];
                
                      _this.adicionarContextMenu(geoJson, 'Edição');
                      if(geoJson['layerType'] !== 'marker'){
                        geoJson.setStyle(_this.stylelayer.lineDefecto);
                      }
                      if(geoJson._layers){
                        const keysEdicao = Object.keys(geoJson._layers);
                        if (keysEdicao.length > 0) {
                          keysEdicao.forEach(key => {
                            geoJson._layers[key]['properties'] = objRef['feature']['properties'];
                            if(geoJson._layers[key].transform){
                              geoJson._layers[key].transform.disable()
                            }
                            if(geoJson._layers[key].dragging){
                              geoJson._layers[key].dragging.disable()
                            }
                          })
                        }
                      }
                      objRef['_before'] = geoJson;
                      objRef['_context'] = true;
                    }
                  }
              }

            }, } : {text: 'Editar Shape',  callback: (evt) => { _this._snackBar.open("Não é possível executar essa funcionalidade para essa camada.", 'Fechar', {
              duration: 4000,});  } },
            { text: 'Mesclar Objetos',  callback: (evt) => {
              if(objRef.dragging) {
                objRef.dragging.disable();
                }
              if(objRef.transform){
                  objRef.transform.disable();
                }
              _this.mesclarObjetos();
            }},
            { text: 'Cortar Objetos',  callback: (evt) => {
              if(objRef.dragging) {
                objRef.dragging.disable();
              }
              if(objRef.transform){
                objRef.transform.disable();
              }
              _this.cortarObjetos(objRef);
            }},
            { text: 'Separar Objetos',  callback: (evt) => {
              if(objRef.dragging) {
                objRef.dragging.disable();
                }
              if(objRef.transform){
                  objRef.transform.disable();
                }
              _this.separarObjetos(objRef);
            }},
            !objRef._radius ? { text: 'Snap To',  callback: (evt) => {
              if (!objRef.editing._enabled) {
                objRef['_context'] = null;
                objRef['_objetosNovos'] = null;
                if(objRef.transform && objRef.dragging) {
                  objRef.transform.disable();
                  objRef.dragging.disable();
                }
  
                if(!objRef.snapediting){
                  objRef.snapediting = new L.Handler.PolylineSnap(_this.map, objRef);
                  objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                }
                if(objRef['snap']){
                  objRef.snapediting.disable();
                  objRef.setStyle(_this.stylelayer.lineDefecto);
                }else{
                  if(objRef['feature']['properties']['layerType'] == 'circle'){
                    const circle = new L.Circle(objRef._latlng,objRef.options);
                    circle['layerType'] = objRef['feature']['properties']['layerType'];
                    circle['properties'] = objRef['feature']['properties'];
                    objRef['_before'] = circle;
                  } else if(objRef['feature']['properties']['layerType'] == 'circlemarker'){
                    const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                    circleMarker['layerType'] = objRef['feature']['properties']['layerType'];
                    circleMarker['properties'] = objRef['feature']['properties'];
                    objRef['_before'] = circleMarker;
                  }else{
                    const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                      style:  objRef.options,
                    });
                    geoJson['layerType'] = objRef['feature']['properties']['layerType'];
                    geoJson['properties'] = objRef['feature']['properties'];
              
                    _this.adicionarContextMenu(geoJson, 'Edição');
                    if(geoJson['layerType'] !== 'marker'){
                      geoJson.setStyle(_this.stylelayer.lineDefecto);
                    }
                    if(geoJson._layers){
                      const keysEdicao = Object.keys(geoJson._layers);
                      if (keysEdicao.length > 0) {
                        keysEdicao.forEach(key => {
                          geoJson._layers[key]['properties'] = objRef['feature']['properties'];
                          if(geoJson._layers[key].transform){
                            geoJson._layers[key].transform.disable()
                          }
                          if(geoJson._layers[key].dragging){
                            geoJson._layers[key].dragging.disable()
                          }
                        })
                      }
                    }
                    objRef['_before'] = geoJson;
                    objRef['_context'] = true;
                  }
  
                  objRef.snapediting.enable();
                  if (objRef.feature.properties && objRef.feature.properties.layerType && objRef.feature.properties.layerType == 'LineString') {
                    objRef.setStyle(_this.stylelayer.selected);
                  } else {
                    objRef.setStyle(_this.stylelayer.selectedPathOptions);
                  }
                }
                
                objRef['snap'] ? objRef['snap'] =  false : objRef['snap'] =  true;
              }

              }
            } : {text: 'Snap To',  callback: (evt) => { _this._snackBar.open("Não é possível executar essa funcionalidade para essa camada.", 'Fechar', {
              duration: 4000,});  } },
              { text: 'Mover/Rotacionar Objeto',  callback: (evt) => {
                objRef['_context'] = null;
                objRef['_objetosNovos'] = null;
                let latlng = objRef.getLatLngs();
                if(latlng[0].length == 1){
                  if(latlng[0][0].length == 1){
                    objRef.setLatLngs(latlng[0][0]);
                  }else {
                    objRef.setLatLngs(latlng[0]);
                  }
                }

                if(objRef.dragging && objRef.transform) {
                  objRef.dragging._enabled ? objRef.dragging.disable() : objRef.dragging.enable();
                  objRef.transform._enabled ? objRef.transform.disable() : objRef.transform.enable();
                }
                
                if(objRef.transform && objRef.dragging) {

                  if(objRef.transform._enabled || objRef.dragging._enabled){
                    let shape = cloneLayer(objRef);
                    shape['layerType'] = objRef.feature.properties.layerType;
                    shape['properties'] = objRef.feature.properties;
                    shape['feature'] = objRef.feature;
                    objRef['_before'] = shape;
                  } 
                  
                }

              }},
              { text: 'Medir Objeto',  callback: (evt) => {
                if(objRef.objRefType == 'rectangle' || objRef.objRefType == 'polygon' ||
                (objRef.feature && (objRef.feature.geometry.type.toLowerCase() == 'polygon' || objRef.feature.geometry.type.toLowerCase() == 'multipolygon'))) {
                  let geoJson = objRef.toGeoJSON();
                  let lengthObject: any = turf.length(geoJson).toFixed(5);
                  lengthObject = (lengthObject * 1000);
                  objRef.bindPopup(`Área: ${turf.area(geoJson).toLocaleString('pt-BR')} m²<br>
                                    Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                  objRef.openPopup();
                  objRef.unbindPopup();

                } else if (objRef.objRefType == 'circle') {
                  let circle = turf.circle([objRef.getLatLng().lat, objRef.getLatLng().lng], objRef._mRadius);
                  let lengthObject: any = turf.length(circle).toFixed(5);
                  lengthObject = (lengthObject * 1000);
                  objRef.bindPopup(`Área: ${turf.area(circle).toLocaleString('pt-BR')} m² <br>
                                    Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                  objRef.openPopup();
                  objRef.unbindPopup();
                } else if (objRef.feature && objRef.feature.properties && objRef.feature.properties.radius) {
                  let circle = turf.circle([objRef.getLatLng().lat, objRef.getLatLng().lng], objRef._mRadius);
                  let lengthObject: any = turf.length(circle).toFixed(5);
                  lengthObject = (lengthObject * 1000);
                  objRef.bindPopup(`Área: ${turf.area(circle).toLocaleString('pt-BR')} m² <br>
                                    Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                  objRef.openPopup();
                  objRef.unbindPopup();
                } else if (objRef.objRefType == 'polyline' || (objRef.feature && objRef.feature.properties.objRefType == 'LineString')) {
                  let lengthObject: any = turf.length(objRef.toGeoJSON()).toFixed(5);
                  lengthObject = (lengthObject * 1000).toLocaleString('pt-BR');
                  objRef.bindPopup(`Comprimento: ${lengthObject} m`);
                  objRef.openPopup();
                  objRef.unbindPopup();
                }
              }},

              { text: 'Desfazer última ação',  callback: (evt) => {
                var obj = objRef['_before'];
                var isBindCtx = objRef['_context'];

                var objNovos = objRef['_objetosNovos'];
                if(objNovos){
                  objNovos.forEach((obj) => {
                    obj.removeFrom(_this.map);
                  });
                }

                if(obj && obj.length){

                  obj.forEach((objAux) => {
                    if(objAux){
                      if(!isBindCtx){
                        if(objAux['feature']){
                          objAux.bindContextMenu(ctxReference(objAux));
                        }else{
                          objAux.bindContextMenu(ctxReferenceWithoutFeature(objAux));
                        }
                      }
                      objAux.snapediting = new L.Handler.PolylineSnap(_this.map, objAux);
                      objAux.snapediting.addGuideLayer(_this.editableFeatureGroup);
                      objAux.addTo(_this.editableFeatureGroup);
                      if(objAux.layerType !== 'marker'){
                        objAux.setStyle(_this.stylelayer.default);
                      }
                      objAux.on('click', (e) => {
                        _this.selecionarLayer(e);
                        _this.triggerScrollTo();
                      });
    
    
                      if(objAux.dragging) {
                        objAux.dragging.disable();
                      }
                      if(objAux.transform) {
                        objAux.transform.disable();
                      }
    
                      if(objRef.dragging) {
                        objRef.dragging.disable();
                      }
                      if(objRef.transform) {
                        objRef.transform.disable();
                      }
    
                      var id = objRef._leaflet_id;
                      const indice = _this.objetosSelecionados.indexOf(id);
                      _this.objetosSelecionados.splice(indice, 1);
                      _this.objetosSelecionadosMap.delete(id);

                      objRef.removeFrom(_this.map);
                      _this.editableFeatureGroup.removeLayer(objRef);
    
                    }
                  })
                } else if(obj){

                  if(!isBindCtx){
                    if(obj['feature']){
                      obj.bindContextMenu(ctxReference(obj));
                    }else{
                      obj.bindContextMenu(ctxReferenceWithoutFeature(obj));
                    }
                  }
                  obj.snapediting = new L.Handler.PolylineSnap(_this.map, obj);
                  obj.snapediting.addGuideLayer(_this.editableFeatureGroup);
                  obj.addTo(_this.editableFeatureGroup);
                  if(obj.layerType !== 'marker'){
                    obj.setStyle(_this.stylelayer.default);
                  }
                  obj.on('click', (e) => {
                    _this.selecionarLayer(e);
                    _this.triggerScrollTo();
                  });


                  if(obj.dragging) {
                    obj.dragging.disable();
                  }
                  if(obj.transform) {
                    obj.transform.disable();
                  }

                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform) {
                    objRef.transform.disable();
                  }

                  var id = objRef._leaflet_id;
                  const indice = _this.objetosSelecionados.indexOf(id);
                  _this.objetosSelecionados.splice(indice, 1);
                  _this.objetosSelecionadosMap.delete(id);

                  objRef.removeFrom(_this.map);
                  _this.editableFeatureGroup.removeLayer(objRef);

                }

                var layer = _this.editableFeatureGroup._layers[objRef._leaflet_id + 1];
                if(layer){
                  _this.editableFeatureGroup.removeLayer(layer);
                }
                _this.configurarAtributos();
                _this.configurarTabelaAtributos();
              }},


              { text: 'Sair',  callback: (evt) => {
                if (objRef.snapediting) {
                  objRef.snapediting.disable();
                  objRef['snap'] = false;
                  if(objRef.feature.properties.layerType !== 'marker'){
                    objRef.setStyle(_this.stylelayer.lineDefecto);
                  }
                }
                if (objRef.feature.properties.layerType == 'LineString') {
                  if (objRef.editing && objRef.editing._enabled) {
                    objRef.editing.disable();
                    objRef.setStyle(_this.stylelayer.lineDefecto);
                  }
                } else if (objRef.editing && objRef.editing._enabled) {
                  objRef.editing.disable();
                  if(objRef.feature.properties.layerType !== 'marker'){
                    objRef.setStyle(_this.stylelayer.default);
                  }
                }
                if(objRef.dragging) {
                  objRef.dragging.disable();
                }
                if(objRef.transform) {
                  objRef.transform.disable();
                }
              }, }
          ]
        }
        return ctx;
        };

        layer.bindContextMenu(ctxReference(layer));

        let ctxReferenceWithoutFeature = function(objRef){
          let ctx = {
            contextmenu: true,
            contextmenuInheritItems: false,
            contextmenuItems: [
              { text: 'Selecionar tudo nessa área',  callback: (evt) => {_this.selecionarArea(objRef); } },
              { text: 'Enviar para frente',  callback: (evt) => {_this.enviarParaFrente(objRef); } },
              { text: 'Enviar para trás',  callback: (evt) => {_this.enviarParaTras(objRef); } },
              { text: 'Definir Rótulo',  callback: (evt) => {_this.definirRotulo(objRef); } },
              { text: 'Remover Rótulo',  callback: (evt) => {_this.fecharRotulo(objRef); } },
              { text: 'Visualizar Atributos',  callback: (evt) => {
                const textoPropriedades = Object.keys(objRef.properties).length != 0 ? _this.propriedadesToString(objRef.properties, nomeCamada) : _this.propriedadesToStringObjectComplete(objRef, nomeCamada);
  
                objRef.bindPopup(textoPropriedades,
                { maxHeight: 200,
                closeOnClick: true,
                keepInView: true,
                autoPan: false});

                objRef.openPopup();
                objRef.unbindPopup();
              } },
              { text: 'Editar Propriedades',  callback: (evt) => {_this.openDialogPropriedades(objRef, false); } },
              { text: 'Editar Atributos',  callback: (evt) => {_this.prepararAtributos(objRef.properties, objRef); }, },
              { text: 'Editar Shape',  callback: (evt) => {
                if (!objRef.editing._enabled) {
                  objRef['_context'] = null;
                  objRef['_objetosNovos'] = null;
                  if (objRef.properties.layerType == 'LineString') {
                    if (objRef.editing._enabled) {
                      objRef.editing.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    } else {
                      objRef.editing.enable();
                      objRef.setStyle(_this.stylelayer.selected);
                    }
                  } else {
                    if (objRef.editing._enabled) {
                      objRef.editing.disable();
                      if(objRef.properties.layerType !== 'marker'){
                        objRef.setStyle(_this.stylelayer.default);
                      }
                    } else {
                      objRef.editing.enable();
                      if(objRef.properties.layerType !== 'marker'){
                        objRef.setStyle(_this.stylelayer.selectedPathOptions);
                      }
                    }
                  }
                  
                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform){
                    objRef.transform.disable();
                  }

                  if (objRef.editing._enabled) {
                    if(objRef['layerType'] == 'circle'){
                      const circle = new L.Circle(objRef._latlng,objRef.options);
                      circle['layerType'] = objRef['layerType'];
                      circle['properties'] = objRef['properties'];
                      objRef['_before'] = circle;
                    } else if(objRef['layerType'] == 'circlemarker'){
                      const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                      circleMarker['layerType'] = objRef['layerType'];
                      circleMarker['properties'] = objRef['properties'];
                      objRef['_before'] = circleMarker;
                    }else{
                      const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                        style:  objRef.options,
                      });
                      geoJson['layerType'] = objRef['layerType'];
                      geoJson['properties'] = objRef['properties'];
                
                      _this.adicionarContextMenu(geoJson, 'Edição');
                      if(geoJson['layerType'] !== 'marker'){
                        geoJson.setStyle(_this.stylelayer.lineDefecto);
                      }
                      if(geoJson._layers){
                        const keysEdicao = Object.keys(geoJson._layers);
                        if (keysEdicao.length > 0) {
                          keysEdicao.forEach(key => {
                            geoJson._layers[key]['properties'] = objRef['properties'];
                            if(geoJson._layers[key].transform){
                              geoJson._layers[key].transform.disable()
                            }
                            if(geoJson._layers[key].dragging){
                              geoJson._layers[key].dragging.disable()
                            }
                          })
                        }
                      }
                      objRef['_before'] = geoJson;
                      objRef['_context'] = true;
                    }
                  }
                }
              }, },

              { text: 'Mesclar Objetos',  callback: (evt) => {
                if(objRef.dragging) {
                  objRef.dragging.disable();
                }
                if(objRef.transform){
                  objRef.transform.disable();
                }
                _this.mesclarObjetos();
              }},
              { text: 'Cortar Objetos',  callback: (evt) => {
                if(objRef.dragging) {
                  objRef.dragging.disable();
                }
                if(objRef.transform){
                  objRef.transform.disable();
                }
                _this.cortarObjetos(objRef);
              }},
              { text: 'Separar Objetos',  callback: (evt) => {
                if(objRef.dragging) {
                  objRef.dragging.disable();
                }
                if(objRef.transform){
                  objRef.transform.disable();
                }
                _this.separarObjetos(objRef);
              }},
              { text: 'Snap To',  callback: (evt) => {
                if (!objRef.editing._enabled) {
                  objRef['_context'] = null;
                  objRef['_objetosNovos'] = null;
                  if(objRef.transform && objRef.dragging) {
                    objRef.transform.disable();
                    objRef.dragging.disable();
                  }
  
                  if(!objRef.snapediting){
                    objRef.snapediting = new L.Handler.PolylineSnap(_this.map, objRef);
                    objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                  } 
                  if(objRef['snap']){
                    objRef.snapediting.disable();
                    objRef.setStyle(_this.stylelayer.lineDefecto);
                  }else{
                    if(objRef['layerType'] == 'circle'){
                      const circle = new L.Circle(objRef._latlng,objRef.options);
                      circle['layerType'] = objRef['layerType'];
                      circle['properties'] = objRef['properties'];
                      objRef['_before'] = circle;
                    } else if(objRef['layerType'] == 'circlemarker'){
                      const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                      circleMarker['layerType'] = objRef['layerType'];
                      circleMarker['properties'] = objRef['properties'];
                      objRef['_before'] = circleMarker;
                    }else{
                      const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                        style:  objRef.options,
                      });
                      geoJson['layerType'] = objRef['layerType'];
                      geoJson['properties'] = objRef['properties'];
                
                      _this.adicionarContextMenu(geoJson, 'Edição');
                      if(geoJson['layerType'] !== 'marker'){
                        geoJson.setStyle(_this.stylelayer.lineDefecto);
                      }
                      if(geoJson._layers){
                        const keysEdicao = Object.keys(geoJson._layers);
                        if (keysEdicao.length > 0) {
                          keysEdicao.forEach(key => {
                            geoJson._layers[key]['properties'] = objRef['properties'];
                            if(geoJson._layers[key].transform){
                              geoJson._layers[key].transform.disable()
                            }
                            if(geoJson._layers[key].dragging){
                              geoJson._layers[key].dragging.disable()
                            }
                          })
                        }
                      }
                      objRef['_before'] = geoJson;
                      objRef['_context'] = true;
                    }
    
                    objRef.snapediting.enable();
                    if (objRef.properties && objRef.properties.layerType && objRef.properties.layerType == 'LineString') {
                      objRef.setStyle(_this.stylelayer.selected);
                    } else {
                      objRef.setStyle(_this.stylelayer.selectedPathOptions);
                    }
                  }
                  
                  objRef['snap'] ? objRef['snap'] =  false : objRef['snap'] =  true;
                }

                }
              },

                //IF ternario
              objRef.layerType == 'rectangle' || objRef.layerType == 'polygon' || objRef.layerType == 'polyline' ? { text: 'Mover/Rotacionar Objeto',  callback: (evt) => {
                objRef['_context'] = null;
                objRef['_objetosNovos'] = null;
                if(objRef.transform && objRef.dragging) {
                  objRef.transform._enabled ? objRef.transform.disable() : objRef.transform.enable();
                  objRef.dragging._enabled ? objRef.dragging.disable() : objRef.dragging.enable();
                }

                if(objRef.transform && objRef.dragging) {

                  if(objRef.transform._enabled || objRef.dragging._enabled){
                    let shape = cloneLayer(objRef);
                    shape['properties'] = objRef.properties;
                    shape['layerType'] = objRef.layerType;
                    objRef['_before'] = shape;
                  } 

                }

              }} : { text: 'Mover Objeto',  callback: (evt) => {
                objRef['_context'] = null;
                objRef['_objetosNovos'] = null;
                if(objRef.dragging) {
                  objRef.dragging._enabled ? objRef.dragging.disable() : objRef.dragging.enable();
                }
                
                if(objRef.dragging) {

                  if(objRef.dragging._enabled){
                    let shape = cloneLayer(objRef);
                    shape['properties'] = objRef.properties;
                    shape['layerType'] = objRef.layerType;
                    objRef['_before'] = shape;
                  } 

                }
              }},

            { text: 'Medir Objeto',  callback: (evt) => {
                if(objRef.layerType == 'rectangle' || objRef.layerType == 'polygon') {
                let geoJson = objRef.toGeoJSON();
                let lengthObject: any = turf.length(geoJson).toFixed(5);
                lengthObject = (lengthObject * 1000);
                objRef.bindPopup(`Área: ${turf.area(geoJson).toLocaleString('pt-BR')} m²<br>
                                    Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                objRef.openPopup();
                objRef.unbindPopup();

                } else if (objRef.layerType == 'circle') {
                let circle = turf.circle([objRef.getLatLng().lat, objRef.getLatLng().lng], objRef._mRadius);
                let lengthObject: any = turf.length(circle).toFixed(5);
                lengthObject = (lengthObject * 1000);
                objRef.bindPopup(`Área: ${turf.area(circle).toLocaleString('pt-BR')} m² <br>
                                  Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                objRef.openPopup();
                objRef.unbindPopup();
              } else if (objRef.properties.radius) {
                let circle = turf.circle([objRef.getLatLng().lat, objRef.getLatLng().lng], objRef._mRadius);
                let lengthObject: any = turf.length(circle).toFixed(5);
                lengthObject = (lengthObject * 1000);
                objRef.bindPopup(`Área: ${turf.area(circle).toLocaleString('pt-BR')} m² <br>
                                  Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                objRef.openPopup();
                objRef.unbindPopup();
              } else if (objRef.layerType == 'polyline' || objRef.properties.layerType == 'LineString') {
                let lengthObject: any = turf.length(objRef.toGeoJSON()).toFixed(5);
                lengthObject = (lengthObject * 1000).toLocaleString('pt-BR');
                objRef.bindPopup(`Comprimento: ${lengthObject} m`);
                objRef.openPopup();
                objRef.unbindPopup();
              }
              }}, 

              { text: 'Desfazer última ação',  callback: (evt) => {
                var obj = objRef['_before'];
                var isBindCtx = objRef['_context'];

                var objNovos = objRef['_objetosNovos'];
                if(objNovos){
                  objNovos.forEach((obj) => {
                    obj.removeFrom(_this.map);
                  });
                }

                if(obj && obj.length){

                  obj.forEach((objAux) => {
                    if(objAux){
                      if(!isBindCtx){
                        objAux.bindContextMenu(ctxReference(objAux));
                      }
                      objAux.snapediting = new L.Handler.PolylineSnap(_this.map, objAux);
                      objAux.snapediting.addGuideLayer(_this.editableFeatureGroup);
                      objAux.addTo(_this.editableFeatureGroup);
                      if(objAux.layerType !== 'marker'){
                        objAux.setStyle(_this.stylelayer.default);
                      }
                      objAux.on('click', (e) => {
                        _this.selecionarLayer(e);
                        _this.triggerScrollTo();
                      });
    
    
                      if(objAux.dragging) {
                        objAux.dragging.disable();
                      }
                      if(objAux.transform) {
                        objAux.transform.disable();
                      }
    
                      if(objRef.dragging) {
                        objRef.dragging.disable();
                      }
                      if(objRef.transform) {
                        objRef.transform.disable();
                      }
    
                      var id = objRef._leaflet_id;
                      const indice = _this.objetosSelecionados.indexOf(id);
                      _this.objetosSelecionados.splice(indice, 1);
                      _this.objetosSelecionadosMap.delete(id);

                      objRef.removeFrom(_this.map);
                      _this.editableFeatureGroup.removeLayer(objRef);
    
                    }
                  })
                } else if(obj){

                  if(!isBindCtx){
                    obj.bindContextMenu(ctxReference(obj))
                  }
                  obj.snapediting = new L.Handler.PolylineSnap(_this.map, obj);
                  obj.snapediting.addGuideLayer(_this.editableFeatureGroup);
                  obj.addTo(_this.editableFeatureGroup);
                  if(obj.layerType !== 'marker'){
                    obj.setStyle(_this.stylelayer.default);
                  }
                  obj.on('click', (e) => {
                    _this.selecionarLayer(e);
                    _this.triggerScrollTo();
                  });


                  if(obj.dragging) {
                    obj.dragging.disable();
                  }
                  if(obj.transform) {
                    obj.transform.disable();
                  }

                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform) {
                    objRef.transform.disable();
                  }

                  var id = objRef._leaflet_id;
                  const indice = _this.objetosSelecionados.indexOf(id);
                  _this.objetosSelecionados.splice(indice, 1);
                  _this.objetosSelecionadosMap.delete(id);

                  objRef.removeFrom(_this.map);
                  _this.editableFeatureGroup.removeLayer(objRef);
                  
                }

                var layer = _this.editableFeatureGroup._layers[objRef._leaflet_id + 1];
                if(layer){
                  _this.editableFeatureGroup.removeLayer(layer);
                }
                _this.configurarAtributos();
                _this.configurarTabelaAtributos();
              }},

              { text: 'Sair',  callback: (evt) => {
                if (objRef.snapediting) {
                  objRef.snapediting.disable();
                  objRef['snap'] = false;
                  if(objRef.properties.layerType !== 'marker'){
                    objRef.setStyle(_this.stylelayer.lineDefecto);
                  }
                }
                if (objRef.properties.layerType == 'LineString') {
                  if (objRef.editing && objRef.editing._enabled) {
                    objRef.editing.disable();
                    objRef.setStyle(_this.stylelayer.lineDefecto);
                  }
                } else if (objRef.editing && objRef.editing._enabled) {
                  objRef.editing.disable();
                  if(objRef.properties.layerType !== 'marker'){
                    objRef.setStyle(_this.stylelayer.default);
                  }
                }
                if(objRef.dragging) {
                  objRef.dragging.disable();
                }
                if(objRef.transform) {
                  objRef.transform.disable();
                }
              }, }

            ]
          }
          return ctx;
        };

        } catch (error) {
          console.log(error);
        }
      }
    } else {
      try {

        var _this = this;

        let ctxReference = function(objRef){
          let ctx = {
            contextmenu: true,
            contextmenuInheritItems: false,
            contextmenuItems: [
              { text: 'Selecionar tudo nessa área',  callback: (evt) => {_this.selecionarArea(objRef); } },
              { text: 'Enviar para frente',  callback: (evt) => {_this.enviarParaFrente(objRef); } },
              { text: 'Enviar para trás',  callback: (evt) => {_this.enviarParaTras(objRef); } },
              { text: 'Definir Rótulo',  callback: (evt) => {_this.definirRotulo(objRef); } },
              { text: 'Remover Rótulo',  callback: (evt) => {_this.fecharRotulo(objRef); } },
              { text: 'Visualizar Atributos',  callback: (evt) => {
                const textoPropriedades = Object.keys(objRef.properties).length != 0 ? _this.propriedadesToString(objRef.properties, nomeCamada) : _this.propriedadesToStringObjectComplete(objRef, nomeCamada);
                objRef.bindPopup(textoPropriedades,
                { maxHeight: 200,
                closeOnClick: true,
                keepInView: true,
                autoPan: false});

                objRef.openPopup();
                objRef.unbindPopup();
              } },
              { text: 'Editar Propriedades',  callback: (evt) => {_this.openDialogPropriedades(objRef, false); } },
              { text: 'Editar Atributos',  callback: (evt) => {_this.prepararAtributos(objRef.properties, objRef); }, },
              !objRef._radius ? { text: 'Editar Shape',  callback: (evt) => {
                if (!objRef.editing._enabled) {
                  objRef['_context'] = null;
                  objRef['_objetosNovos'] = null;
                  if (objRef.properties.layerType == 'LineString') {
                    if (objRef.editing._enabled) {
                      objRef.editing.disable();
                      objRef.setStyle(_this.stylelayer.lineDefecto);
                    } else {
                      objRef.editing.enable();
                      objRef.setStyle(_this.stylelayer.selected);
                    }
                  } else {
                    if (objRef.editing._enabled) {
                      objRef.editing.disable();
                      if(objRef.properties.layerType !== 'marker'){
                        objRef.setStyle(_this.stylelayer.default);
                      }
                    } else {
                      objRef.editing.enable();
                      if(objRef.properties.layerType !== 'marker'){
                        objRef.setStyle(_this.stylelayer.selectedPathOptions);
                      }
                    }
                  }
                  
                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform){
                    objRef.transform.disable();
                  }

                  if (objRef.editing._enabled) {
                    if(objRef['layerType'] == 'circle'){
                      const circle = new L.Circle(objRef._latlng,objRef.options);
                      circle['layerType'] = objRef['layerType'];
                      circle['properties'] = objRef['properties'];
                      objRef['_before'] = circle;
                    } else if(objRef['layerType'] == 'circlemarker'){
                      const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                      circleMarker['layerType'] = objRef['layerType'];
                      circleMarker['properties'] = objRef['properties'];
                      objRef['_before'] = circleMarker;
                    }else{
                      const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                        style:  objRef.options,
                      });
                      geoJson['layerType'] = objRef['layerType'];
                      geoJson['properties'] = objRef['properties'];
                
                      _this.adicionarContextMenu(geoJson, 'Edição');
                      if(geoJson['layerType'] !== 'marker'){
                        geoJson.setStyle(_this.stylelayer.lineDefecto);
                      }
                      if(geoJson._layers){
                        const keysEdicao = Object.keys(geoJson._layers);
                        if (keysEdicao.length > 0) {
                          keysEdicao.forEach(key => {
                            geoJson._layers[key]['properties'] = objRef['properties'];
                            if(geoJson._layers[key].transform){
                              geoJson._layers[key].transform.disable()
                            }
                            if(geoJson._layers[key].dragging){
                              geoJson._layers[key].dragging.disable()
                            }
                          })
                        }
                      }
                      objRef['_before'] = geoJson;
                      objRef['_context'] = true;
                    }
                  }
                }
              }, } : { text: 'Editar Shape',  callback: (evt) => { _this._snackBar.open("Não é possível executar essa funcionalidade para essa camada.", 'Fechar', {
                  duration: 4000,}); 
                } 
              },

              { text: 'Mesclar Objetos',  callback: (evt) => {
                if(objRef.dragging) {
                  objRef.dragging.disable();
                }
                if(objRef.transform){
                  objRef.transform.disable();
                }
                _this.mesclarObjetos();
              }},
              { text: 'Cortar Objetos',  callback: (evt) => {
                if(objRef.dragging) {
                  objRef.dragging.disable();
                }
                if(objRef.transform){
                  objRef.transform.disable();
                }
                _this.cortarObjetos(objRef);
              }},
              { text: 'Separar Objetos',  callback: (evt) => {
                if(objRef.dragging) {
                  objRef.dragging.disable();
                }
                if(objRef.transform){
                  objRef.transform.disable();
                }
                _this.separarObjetos(objRef);
              }},
              !objRef._radius ? { text: 'Snap To',  callback: (evt) => {
                if (!objRef.editing._enabled) {
                  objRef['_context'] = null;
                  objRef['_objetosNovos'] = null;
                  if(objRef.transform && objRef.dragging) {
                    objRef.transform.disable();
                    objRef.dragging.disable();
                  }
  
                  if(!objRef.snapediting && objRef.properties.layerType !== 'marker'){
                    objRef.snapediting = new L.Handler.PolylineSnap(_this.map, objRef);
                    objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                  } else if(!objRef.snapediting && objRef.properties.layerType == 'marker') {
                    objRef.snapediting = new L.Handler.MarkerSnap(_this.map, objRef);
                    objRef.snapediting.addGuideLayer(_this.editableFeatureGroup);
                  }
                  if(objRef['snap']){
                    objRef.snapediting.disable();
                    objRef.setStyle(_this.stylelayer.lineDefecto);
                  }else{
                    if(objRef['layerType'] == 'circle'){
                      const circle = new L.Circle(objRef._latlng,objRef.options);
                      circle['layerType'] = objRef['layerType'];
                      circle['properties'] = objRef['properties'];
                      objRef['_before'] = circle;
                    } else if(objRef['layerType'] == 'circlemarker'){
                      const circleMarker = new L.CircleMarker(objRef._latlng,objRef.options);
                      circleMarker['layerType'] = objRef['layerType'];
                      circleMarker['properties'] = objRef['properties'];
                      objRef['_before'] = circleMarker;
                    }else{
                      const geoJson = L.geoJSON(objRef.toGeoJSON(), {
                        style:  objRef.options,
                      });
                      geoJson['layerType'] = objRef['layerType'];
                      geoJson['properties'] = objRef['properties'];
                
                      _this.adicionarContextMenu(geoJson, 'Edição');
                      if(geoJson['layerType'] !== 'marker'){
                        geoJson.setStyle(_this.stylelayer.lineDefecto);
                      }
                      if(geoJson._layers){
                        const keysEdicao = Object.keys(geoJson._layers);
                        if (keysEdicao.length > 0) {
                          keysEdicao.forEach(key => {
                            geoJson._layers[key]['properties'] = objRef['properties'];
                            if(geoJson._layers[key].transform){
                              geoJson._layers[key].transform.disable()
                            }
                            if(geoJson._layers[key].dragging){
                              geoJson._layers[key].dragging.disable()
                            }
                          })
                        }
                      }
                      objRef['_before'] = geoJson;
                      objRef['_context'] = true;
                    }
    
                    objRef.snapediting.enable();
                    if (objRef.properties && objRef.properties.layerType && objRef.properties.layerType == 'LineString') {
                      objRef.setStyle(_this.stylelayer.selected);
                    } else if(objRef.properties.layerType !== 'marker') {
                      objRef.setStyle(_this.stylelayer.selectedPathOptions);
                    }
                  }
                  
                  objRef['snap'] ? objRef['snap'] =  false : objRef['snap'] =  true;
                }

                }
              } : { text: 'Snap To',  callback: (evt) => { _this._snackBar.open("Não é possível executar essa funcionalidade para essa camada.", 'Fechar', {
              duration: 4000,});  } },

                //IF ternario
              objRef.layerType == 'rectangle' || objRef.layerType == 'polygon' || objRef.layerType == 'polyline' ? { text: 'Mover/Rotacionar Objeto',  callback: (evt) => {
                objRef['_context'] = null;
                objRef['_objetosNovos'] = null;
                if(objRef.transform && objRef.dragging) {
                  objRef.transform._enabled ? objRef.transform.disable() : objRef.transform.enable();
                  objRef.dragging._enabled ? objRef.dragging.disable() : objRef.dragging.enable();
                }

                if(objRef.transform && objRef.dragging) {

                  if(objRef.transform._enabled || objRef.dragging._enabled){
                    let shape = cloneLayer(objRef);
                    shape['properties'] = objRef.properties;
                    shape['layerType'] = objRef.layerType;
                    objRef['_before'] = shape;
                  } 

                }

              }} : { text: 'Mover Objeto',  callback: (evt) => {
                objRef['_context'] = null;
                objRef['_objetosNovos'] = null;
                if(objRef.dragging) {
                  objRef.dragging._enabled ? objRef.dragging.disable() : objRef.dragging.enable();
                }
                
                if(objRef.dragging) {

                  if(objRef.dragging._enabled){
                    let shape = cloneLayer(objRef);
                    shape['properties'] = objRef.properties;
                    shape['layerType'] = objRef.layerType;
                    objRef['_before'] = shape;
                  } 

                }
              }},

            { text: 'Medir Objeto',  callback: (evt) => {
                if(objRef.layerType == 'rectangle' || objRef.layerType == 'polygon') {
                let geoJson = objRef.toGeoJSON();
                let lengthObject: any = turf.length(geoJson).toFixed(5);
                lengthObject = (lengthObject * 1000);
                objRef.bindPopup(`Área: ${turf.area(geoJson).toLocaleString('pt-BR')} m²<br>
                                    Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                objRef.openPopup();
                objRef.unbindPopup();

                } else if (objRef.layerType == 'circle') {
                let circle = turf.circle([objRef.getLatLng().lat, objRef.getLatLng().lng], objRef._mRadius);
                let lengthObject: any = turf.length(circle).toFixed(5);
                lengthObject = (lengthObject * 1000);
                objRef.bindPopup(`Área: ${turf.area(circle).toLocaleString('pt-BR')} m² <br>
                                  Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                objRef.openPopup();
                objRef.unbindPopup();
              } else if (objRef.properties.radius) {
                let circle = turf.circle([objRef.getLatLng().lat, objRef.getLatLng().lng], objRef._mRadius);
                let lengthObject: any = turf.length(circle).toFixed(5);
                lengthObject = (lengthObject * 1000);
                objRef.bindPopup(`Área: ${turf.area(circle).toLocaleString('pt-BR')} m² <br>
                                  Perímetro: ${lengthObject.toLocaleString('pt-BR')} m`);
                objRef.openPopup();
                objRef.unbindPopup();
              } else if (objRef.layerType == 'polyline' || objRef.properties.layerType == 'LineString') {
                let lengthObject: any = turf.length(objRef.toGeoJSON()).toFixed(5);
                lengthObject = (lengthObject * 1000).toLocaleString('pt-BR');
                objRef.bindPopup(`Comprimento: ${lengthObject} m`);
                objRef.openPopup();
                objRef.unbindPopup();
              }
              }}, 

              { text: 'Desfazer última ação',  callback: (evt) => {
                var obj = objRef['_before'];
                var isBindCtx = objRef['_context'];

                var objNovos = objRef['_objetosNovos'];
                if(objNovos){
                  objNovos.forEach((obj) => {
                    obj.removeFrom(_this.map);
                  });
                }

                if(obj && obj.length){

                  obj.forEach((objAux) => {
                    if(objAux){
                      if(!isBindCtx){
                        objAux.bindContextMenu(ctxReference(objAux));
                      }
                      objAux.snapediting = new L.Handler.PolylineSnap(_this.map, objAux);
                      objAux.snapediting.addGuideLayer(_this.editableFeatureGroup);
                      objAux.addTo(_this.editableFeatureGroup);
                      if(objAux.layerType !== 'marker'){
                        objAux.setStyle(_this.stylelayer.default);
                      }
                      objAux.on('click', (e) => {
                        _this.selecionarLayer(e);
                        _this.triggerScrollTo();
                      });
    
    
                      if(objAux.dragging) {
                        objAux.dragging.disable();
                      }
                      if(objAux.transform) {
                        objAux.transform.disable();
                      }
    
                      if(objRef.dragging) {
                        objRef.dragging.disable();
                      }
                      if(objRef.transform) {
                        objRef.transform.disable();
                      }
    
                      var id = objRef._leaflet_id;
                      const indice = _this.objetosSelecionados.indexOf(id);
                      _this.objetosSelecionados.splice(indice, 1);
                      _this.objetosSelecionadosMap.delete(id);

                      objRef.removeFrom(_this.map);
                      _this.editableFeatureGroup.removeLayer(objRef);
                      
    
                    }
                  })
                } else if(obj){

                  if(!isBindCtx){
                    obj.bindContextMenu(ctxReference(obj))
                  }
                  obj.snapediting = new L.Handler.PolylineSnap(_this.map, obj);
                  obj.snapediting.addGuideLayer(_this.editableFeatureGroup);
                  obj.addTo(_this.editableFeatureGroup);
                  if(obj.layerType !== 'marker'){
                    obj.setStyle(_this.stylelayer.default);
                  }
                  obj.on('click', (e) => {
                    _this.selecionarLayer(e);
                    _this.triggerScrollTo();
                  });


                  if(obj.dragging) {
                    obj.dragging.disable();
                  }
                  if(obj.transform) {
                    obj.transform.disable();
                  }

                  if(objRef.dragging) {
                    objRef.dragging.disable();
                  }
                  if(objRef.transform) {
                    objRef.transform.disable();
                  }

                  var id = objRef._leaflet_id;
                  const indice = _this.objetosSelecionados.indexOf(id);
                  _this.objetosSelecionados.splice(indice, 1);
                  _this.objetosSelecionadosMap.delete(id);

                  objRef.removeFrom(_this.map);
                  _this.editableFeatureGroup.removeLayer(objRef);
                  
                }
                  
                var layer = _this.editableFeatureGroup._layers[objRef._leaflet_id + 1];
                if(layer){
                  _this.editableFeatureGroup.removeLayer(layer);
                }

                _this.configurarAtributos();
                _this.configurarTabelaAtributos();
              }},

              { text: 'Sair',  callback: (evt) => {
                if (objRef.snapediting) {
                  objRef.snapediting.disable();
                  objRef['snap'] = false;
                  if(objRef.properties.layerType !== 'marker'){
                    objRef.setStyle(_this.stylelayer.lineDefecto);
                  }
                }
                if (objRef.properties.layerType == 'LineString') {
                  if (objRef.editing && objRef.editing._enabled) {
                    objRef.editing.disable();
                    objRef.setStyle(_this.stylelayer.lineDefecto);
                  }
                } else if (objRef.editing && objRef.editing._enabled) {
                  objRef.editing.disable();
                  if(objRef.properties.layerType !== 'marker'){
                    objRef.setStyle(_this.stylelayer.default);
                  }
                }
                if(objRef.dragging) {
                  objRef.dragging.disable();
                }
                if(objRef.transform) {
                  objRef.transform.disable();
                }
              }, }

            ]
          }
          return ctx;
        };

      objeto.bindContextMenu(ctxReference(objeto));

      } catch (erro) {
        console.log(erro);
      }
    }
    objeto = this.removerOpcaoIFTernario(objeto);
  }

  removerOpcaoIFTernario(objeto){
    if (objeto.options) {
      if (objeto.options.contextmenuItems) {
        objeto.options.contextmenuItems.forEach((context, index) => {
          if (context.text == 'remover objeto') {
            objeto.options.contextmenuItems.splice(index, 1)
          };
        })
      }
  }

    if(objeto._layers){
    const keys = Object.keys(objeto._layers);
    keys.forEach(key => {
      objeto._layers[key].options.contextmenuItems.forEach((context, index) => {
        if(context.text == 'remover objeto') {
          objeto._layers[key].options.contextmenuItems.splice(index, 1);
        }
      })
    })
  }

    return objeto;
  }

    mesclarObjetos() {
    const listaObjetos = [];
    this.objetosSelecionados.forEach((id) => {
      const objeto = this.objetosSelecionadosMap.get(id);
      if (objeto._layers) {
        let keys = Object.keys(objeto._layers);
        keys.forEach(key => {
          if (objeto._layers[key].transform) {
            objeto._layers[key].transform.disable();
          }

          if (objeto._layers[key].dragging) {
            objeto._layers[key].dragging.disable();
          }
        })
      }
      listaObjetos.push(objeto);
    });

    let mesclarProperties = null;


    const listaObjetosBefores = [];
    listaObjetos.forEach((obj) => {
      if(obj._layers){
        let keys = Object.keys(obj._layers);
        keys.forEach(key => {
          let shape = cloneLayer(obj._layers[key]);
          shape['properties'] = obj._layers[key].properties;
          shape['layerType'] = obj._layers[key].layerType;
          mesclarProperties = $.extend(mesclarProperties, obj._layers[key].properties);
          listaObjetosBefores.push(shape);
        })
      } else {
        let shape = cloneLayer(obj);
        shape['properties'] = obj.properties;
        shape['layerType'] = obj.layerType;
        mesclarProperties = $.extend(mesclarProperties, obj.properties);
        listaObjetosBefores.push(shape);
      }
    });


    if (listaObjetos.length > 1) {

      let objetoMesclado = this.leafletUtil.mesclarObjetos(listaObjetos);

      let isMultiPolygon = false;

      if(objetoMesclado.geometry.type == 'MultiPolygon'){
        isMultiPolygon = true;
        const polygonsSeparados = this.leafletUtil.multiPolygon2Polygons(objetoMesclado);

        let posicoesDePoligonos = [];
        let ultimaposicaoDePoligonos = []

        polygonsSeparados.forEach((polygon, index) => { 
          if(index < polygonsSeparados.length - 1) {
            posicoesDePoligonos.push(polygon.geometry.coordinates);
          }else {
            ultimaposicaoDePoligonos.push(polygon.geometry.coordinates);
          }
        })
        
        const poligonos = L.polygon(posicoesDePoligonos);
        const ultimoPoligono = L.polygon(ultimaposicaoDePoligonos);

        const polygonUnificadoFormatoTurf = turf.union(poligonos.toGeoJSON(), ultimoPoligono.toGeoJSON());

        objetoMesclado = L.polygon(polygonUnificadoFormatoTurf.geometry.coordinates);    
      }

      if (objetoMesclado != null) {

        const optionsShapes = {
          color: '#666666',
          fillColor: '#c0c3ac',
          weight: 5,
          fillOpacity: .5,
          strokeOpacity: 0.5,
          opacity: 1,
          transform: true,
          draggable: true,
        };

        const options = $.extend(optionsShapes, objetoMesclado.properties);
        
        let geoJson;
        if(isMultiPolygon){
          geoJson = geoJSON(objetoMesclado.toGeoJSON(), options);
        }else {
          geoJson = geoJSON([objetoMesclado], options);
        }

        if (geoJson._layers) {
          let keys = Object.keys(geoJson._layers);
          keys.forEach(key => {
            geoJson._layers[key]['_before'] = listaObjetosBefores;
            geoJson._layers[key]['properties'] = mesclarProperties;
            if (geoJson._layers[key].transform) {
              geoJson._layers[key].transform.disable();
            }

            if (geoJson._layers[key].dragging) {
              geoJson._layers[key].dragging.disable();
            }
          })
        } else {
          geoJson['properties'] = mesclarProperties;
          geoJson['_before'] = listaObjetosBefores;
          if (geoJson.transform) {
            geoJson.transform.disable();
          }
  
          if (geoJson.dragging) {
            geoJson.dragging.disable();
          }
        }
    
        geoJson.setStyle(this.stylelayer.default);
        geoJson.on('click', (e) => {
          this.selecionarLayer(e);
          this.triggerScrollTo();
        });
        this.adicionarContextMenu(geoJson, 'Edição');
        geoJson.addTo(this.editableFeatureGroup);
    }
      this.objetosSelecionados.forEach((id) => {
        try {
          const objeto = this.objetosSelecionadosMap.get(id);
          let chaveEncontrada = this.keysShapeFiles.filter(chave => chave.key == id);
          if (chaveEncontrada != undefined && chaveEncontrada != null && chaveEncontrada.length > 0) {
            if (chaveEncontrada[0].tipo == 'edicao') {
              this.editableFeatureGroup.removeLayer(objeto);
            } else if (this.shapesSelecionados) {
                for (const camada of this.shapesSelecionados) {
                  if (camada.layerName == chaveEncontrada[0].camada ) {
                    camada.shape.removeLayer(objeto);
                  }
                }
            }
            // this.map.removeLayer(objeto);
          } else {
            chaveEncontrada = this.keysShapeFiles.filter(chave => chave.key == id + 1);
            if (chaveEncontrada != undefined && chaveEncontrada != null && chaveEncontrada.length > 0) {
              if (chaveEncontrada[0].tipo == 'edicao') {
                this.editableFeatureGroup.removeLayer(objeto);
              } else if (this.shapesSelecionados) {
                  for (const camada of this.shapesSelecionados) {
                    if (camada.layerName == chaveEncontrada[0].camada ) {
                      const objeto2 = camada.shape._layers[`${id + 1}`];
                      camada.shape.removeLayer(objeto2);
                    }
                  }
              }
            }
          }
          this.map.removeLayer(objeto);
        } catch (e) {
          console.log(e);
        }

      });

      this.descelecionarObjetos();
      this.configurarAtributos();
      this.configurarTabelaAtributos();
    }
  }

  cortarObjetos(objRef) {
    objRef['objCorte'] = true;
    const listaObjetos = [];
    this.objetosSelecionados.forEach((id) => {
      const objeto = this.objetosSelecionadosMap.get(id);
      if (objeto._layers) {
        let keys = Object.keys(objeto._layers);
        keys.forEach(key => {
          if (objeto._layers[key].transform) {
            objeto._layers[key].transform.disable();
          }

          if (objeto._layers[key].dragging) {
            objeto._layers[key].dragging.disable();
          }
        })
      }
      listaObjetos.push(objeto);
    });

    const listaObjetosBefores = [];
    listaObjetos.forEach((obj) => {
      if(obj._layers){
        let keys = Object.keys(obj._layers);
        keys.forEach(key => {
          let shape = cloneLayer(obj._layers[key]);
          shape['properties'] = obj._layers[key].properties;
          shape['layerType'] = obj._layers[key].layerType;
          listaObjetosBefores.push(shape);
        })
      } else {
        let shape = cloneLayer(obj);
        shape['properties'] = obj.properties;
        shape['layerType'] = obj.layerType;
        listaObjetosBefores.push(shape);
      }
    });

    let listaObjetosCortados = this.leafletUtil.separarObjetos(listaObjetos);
    let listaObjetosNovos = [];


    if(listaObjetosCortados){

      listaObjetosCortados.forEach(objetoSeparado => {

        objetoSeparado['optionsColorBefore']['draggable'] = true;
        objetoSeparado['optionsColorBefore']['transform'] = true;

        if (objetoSeparado.geometry.coordinates.length > 1) {
          for (const coordenate of objetoSeparado.geometry.coordinates) {
            if (objetoSeparado.geometry.type == 'MultiPolygon') {
              for (const coord of coordenate) {
                const poligono = this.leafletUtil.gerarPoligono(coord, objetoSeparado['optionsColorBefore'], objetoSeparado.properties);
                const geoJson = geoJSON([poligono], objetoSeparado['optionsColorBefore']);
                if (geoJson._layers) {
                  let keys = Object.keys(geoJson._layers);
                  keys.forEach(key => {
                    geoJson._layers[key]['_before'] = listaObjetosBefores;
                    if (geoJson._layers[key].transform) {
                      geoJson._layers[key].transform.disable();
                    }

                    if (geoJson._layers[key].dragging) {
                      geoJson._layers[key].dragging.disable();
                    }

                    geoJson._layers[key]['properties'] =  objetoSeparado['properties'];
                    geoJson._layers[key]['layerType'] = objetoSeparado['layerType'];
                    listaObjetosNovos.push(geoJson._layers[key]);
                  })
                } else {
                  geoJson['_before'] = listaObjetosBefores;
                  if (geoJson.transform) {
                    geoJson.transform.disable();
                  }
          
                  if (geoJson.dragging) {
                    geoJson.dragging.disable();
                  }

                  geoJson['properties'] =  objetoSeparado['properties'];
                  geoJson['layerType'] = objetoSeparado['layerType'];
                  listaObjetosNovos.push(geoJson);

                }
                
                geoJson.on('click', (e) => {
                  this.selecionarLayer(e);
                  this.triggerScrollTo();
                });
                this.adicionarContextMenu(geoJson, 'Edição');
                geoJson.addTo(this.editableFeatureGroup);
              }
            } else {
              const poligono = this.leafletUtil.gerarPoligono(coordenate, objetoSeparado['optionsColorBefore'], objetoSeparado.properties);
              const geoJson = geoJSON([poligono], objetoSeparado['optionsColorBefore']);
              geoJson['_before'] = listaObjetosBefores;
              geoJson['properties'] =  objetoSeparado['properties'];
              geoJson['layerType'] = objetoSeparado['layerType'];
              listaObjetosNovos.push(geoJson);
              if(geoJson.transform){
                geoJson.transform.disable();
              }

              if(geoJson.dragging){
                geoJson.dragging.disable();
              }
            
              geoJson.on('click', (e) => {
                this.selecionarLayer(e);
                this.triggerScrollTo();
              });
              this.adicionarContextMenu(geoJson, 'Edição');
              geoJson.addTo(this.editableFeatureGroup);
            }


          }
        } else {
          const geoJson = geoJSON([objetoSeparado], objetoSeparado['optionsColorBefore']);
          if (geoJson._layers) {
            let keys = Object.keys(geoJson._layers);
            keys.forEach(key => {
              geoJson._layers[key]['_before'] = listaObjetosBefores;
              geoJson._layers[key]['properties'] =  objetoSeparado['properties'];
              geoJson._layers[key]['layerType'] = objetoSeparado['layerType'];
              listaObjetosNovos.push(geoJson._layers[key]);
              if (geoJson._layers[key].transform) {
                geoJson._layers[key].transform.disable();
              }

              if (geoJson._layers[key].dragging) {
                geoJson._layers[key].dragging.disable();
              }
            })
          } else {
            geoJson['_before'] = listaObjetosBefores;
            geoJson['properties'] =  objetoSeparado['properties'];
            geoJson['layerType'] = objetoSeparado['layerType'];
            listaObjetosNovos.push(geoJson);
            if (geoJson.transform) {
              geoJson.transform.disable();
            }

            if (geoJson.dragging) {
              geoJson.dragging.disable();
            }
          }

          geoJson.on('click', (e) => {
            this.selecionarLayer(e);
            this.triggerScrollTo();
          });
          this.adicionarContextMenu(geoJson, 'Edição');
          geoJson.addTo(this.editableFeatureGroup);
        }

      })
    

      if(listaObjetosNovos){
        listaObjetosNovos.forEach((obj) => {
          obj['_objetosNovos'] = listaObjetosNovos;
        });
      }


      this.objetosSelecionados.forEach((id) => {
        try {
          const objeto = this.objetosSelecionadosMap.get(id);
          let chaveEncontrada = this.keysShapeFiles.filter(chave => chave.key == id);
          if (chaveEncontrada != undefined && chaveEncontrada != null && chaveEncontrada.length > 0) {
            if (chaveEncontrada[0].tipo == 'edicao') {
              this.editableFeatureGroup.removeLayer(objeto);
            } else if (this.shapesSelecionados) {
                for (const camada of this.shapesSelecionados) {
                  if (camada.layerName == chaveEncontrada[0].camada ) {
                    camada.shape.removeLayer(objeto);
                  }
                }
            }
            // this.map.removeLayer(objeto);
          } else {
            chaveEncontrada = this.keysShapeFiles.filter(chave => chave.key == id + 1);
            if (chaveEncontrada != undefined && chaveEncontrada != null && chaveEncontrada.length > 0) {
              if (chaveEncontrada[0].tipo == 'edicao') {
                this.editableFeatureGroup.removeLayer(objeto);
              } else if (this.shapesSelecionados) {
                  for (const camada of this.shapesSelecionados) {
                    if (camada.layerName == chaveEncontrada[0].camada ) {
                      const objeto2 = camada.shape._layers[`${id + 1}`];
                      camada.shape.removeLayer(objeto2);
                    }
                  }
              }
            }
          }
          this.map.removeLayer(objeto);
        } catch (e) {
          console.log(e);
        }

      });

      this.descelecionarObjetos();
      this.configurarAtributos();
      this.configurarTabelaAtributos();
    }


    
  }

  separarObjetos(objRef) {
    objRef['objCorte'] = true;
    const listaObjetos = [];
    let propriedades = {};
    let opcoes = {};
    this.objetosSelecionados.forEach((id) => {
      const objeto = this.objetosSelecionadosMap.get(id);

      if (objeto._layers) {
        let keys = Object.keys(objeto._layers);
        keys.forEach(key => {
          if (objeto._layers[key].transform) {
            objeto._layers[key].transform.disable();
          }

          if (objeto._layers[key].dragging) {
            objeto._layers[key].dragging.disable();
          }
        })
      }
      listaObjetos.push(objeto);
    });

    const listaObjetosBefores = [];
    listaObjetos.forEach((obj) => {
      if(obj._layers){
        let keys = Object.keys(obj._layers);
        keys.forEach(key => {
          let shape = cloneLayer(obj._layers[key]);
          shape['properties'] = obj._layers[key].properties;
          shape['layerType'] = obj._layers[key].layerType;
          listaObjetosBefores.push(shape);
        })
      } else {
        let shape = cloneLayer(obj);
        shape['properties'] = obj.properties;
        shape['layerType'] = obj.layerType;
        listaObjetosBefores.push(shape);
      }
    });

    if (this.objetosSelecionados.length > 0) {
      const objetoInicial = this.objetosSelecionadosMap.get(this.objetosSelecionados[0]);
      if (objetoInicial._layers) {
        const keysIniciais = Object.keys(objetoInicial._layers);
        const keyInicial = keysIniciais[0];
        if (keysIniciais.length > 0) {
          if (objetoInicial._layers[keyInicial].properties) {
            propriedades = objetoInicial._layers[keysIniciais[0]].properties;
          } else if (objetoInicial._layers[keyInicial].feature.properties) {
            propriedades = objetoInicial._layers[keyInicial].feature.properties;
          }
        }
        if (keysIniciais.length > 0) {
          if (objetoInicial._layers[keyInicial].options) {
            opcoes = objetoInicial._layers[keysIniciais[0]].options;
          } else if (objetoInicial._layers[keyInicial].feature.options) {
            opcoes = objetoInicial._layers[keyInicial].feature.options;
          }
        }
      } else {
        if (objetoInicial.properties) {
          propriedades = objetoInicial.properties;
        }if (objetoInicial.options) {
          opcoes = objetoInicial.options;
        }
      }
    }

    let listaObjetosCortados = this.leafletUtil.separarObjetos(listaObjetos);
    if (listaObjetosCortados != null) {


   
      const options = $.extend(opcoes, propriedades);
      const listaObjetosNovos = [];

      listaObjetosCortados.forEach(objetoSeparado => {

          if (objetoSeparado.geometry.coordinates.length > 1) {
            for (const coordenate of objetoSeparado.geometry.coordinates) {
              if (objetoSeparado.geometry.type == 'MultiPolygon') {
                for (const coord of coordenate) {
                  const poligono = this.leafletUtil.gerarPoligono(coord, options, objetoSeparado.properties);
                  const geoJson = geoJSON([poligono], options);

                  if (geoJson._layers) {
                    let keys = Object.keys(geoJson._layers);
                    keys.forEach(key => {
                      geoJson._layers[key]['_before'] = listaObjetosBefores[0];
                      if (geoJson._layers[key].transform) {
                        geoJson._layers[key].transform.disable();
                      }

                      if (geoJson._layers[key].dragging) {
                        geoJson._layers[key].dragging.disable();
                      }
                      geoJson._layers[key]['properties'] =  objetoSeparado['properties'];
                      geoJson._layers[key]['layerType'] = objetoSeparado['layerType'];
                      geoJson._layers[key]['optionsColorBefore'] =  objetoSeparado['optionsColorBefore'];
                      listaObjetosNovos.push(geoJson._layers[key]);
                    })
                  } else {
                    geoJson['_before'] = listaObjetosBefores[0];
                    geoJson['properties'] =  objetoSeparado['properties'];
                    geoJson['layerType'] = objetoSeparado['layerType'];
                    geoJson['optionsColorBefore'] =  objetoSeparado['optionsColorBefore'];
                    listaObjetosNovos.push(geoJson);
                    if (geoJson.transform) {
                      geoJson.transform.disable();
                    }
          
                    if (geoJson.dragging) {
                      geoJson.dragging.disable();
                    }
                  }

                  geoJson.options = this.copiarPropriedadesOption(objetoSeparado['optionsColorBefore'], geoJson.options);
                  geoJson.setStyle(geoJson.options);
                  geoJson.on('click', (e) => {
                    this.selecionarLayer(e);
                    this.triggerScrollTo();
                  });
                  this.adicionarContextMenu(geoJson, 'Edição');
                  geoJson.addTo(this.editableFeatureGroup);
                }
              } else {
                const poligono = this.leafletUtil.gerarPoligono(coordenate, options, objetoSeparado.properties);
                const geoJson = geoJSON([poligono], options);

                if (geoJson._layers) {
                  let keys = Object.keys(geoJson._layers);
                  keys.forEach(key => {
                    geoJson._layers[key]['_before'] = listaObjetosBefores[0];
                    geoJson._layers[key]['properties'] =  objetoSeparado['properties'];
                    geoJson._layers[key]['layerType'] = objetoSeparado['layerType'];
                    geoJson._layers[key]['optionsColorBefore'] =  objetoSeparado['optionsColorBefore'];
                    listaObjetosNovos.push(geoJson._layers[key]);
                    if (geoJson._layers[key].transform) {
                      geoJson._layers[key].transform.disable();
                    }

                    if (geoJson._layers[key].dragging) {
                      geoJson._layers[key].dragging.disable();
                    }
                  })
                } else {
                  geoJson['_before'] = listaObjetosBefores[0];
                  geoJson['properties'] =  objetoSeparado['properties'];
                  geoJson['layerType'] = objetoSeparado['layerType'];
                  geoJson['optionsColorBefore'] =  objetoSeparado['optionsColorBefore'];
                  listaObjetosNovos.push(geoJson);
                  if (geoJson.transform) {
                    geoJson.transform.disable();
                  }
        
                  if (geoJson.dragging) {
                    geoJson.dragging.disable();
                  }
                }

                geoJson.options = this.copiarPropriedadesOption(objetoSeparado['optionsColorBefore'], geoJson.options);
                geoJson.setStyle(geoJson.options);
                geoJson.on('click', (e) => {
                  this.selecionarLayer(e);
                  this.triggerScrollTo();
                });
                this.adicionarContextMenu(geoJson, 'Edição');
                geoJson.addTo(this.editableFeatureGroup);
              }


            }
          } else {
            const geoJson = geoJSON([objetoSeparado], options);

            if (geoJson._layers) {
                    let keys = Object.keys(geoJson._layers);
                    keys.forEach(key => {
                      geoJson._layers[key]['_before'] = listaObjetosBefores[0];
                      geoJson._layers[key]['properties'] =  objetoSeparado['properties'];
                      geoJson._layers[key]['layerType'] = objetoSeparado['layerType'];
                      geoJson._layers[key]['optionsColorBefore'] =  objetoSeparado['optionsColorBefore'];
                      listaObjetosNovos.push(geoJson._layers[key]);
                      if (geoJson._layers[key].transform) {
                        geoJson._layers[key].transform.disable();
                      }

                      if (geoJson._layers[key].dragging) {
                        geoJson._layers[key].dragging.disable();
                      }
                    })
            }else{
              geoJson['_before'] = listaObjetosBefores[0];
              geoJson['properties'] =  objetoSeparado['properties'];
              geoJson['layerType'] = objetoSeparado['layerType'];
              geoJson['optionsColorBefore'] =  objetoSeparado['optionsColorBefore'];
              listaObjetosNovos.push(geoJson);
              if (geoJson.transform) {
                geoJson.transform.disable();
              }

              if (geoJson.dragging) {
                geoJson.dragging.disable();
              }
            }
            geoJson.options = this.copiarPropriedadesOption(objetoSeparado['optionsColorBefore'], geoJson.options);
            geoJson.setStyle(geoJson.options);
            geoJson.on('click', (e) => {
              this.selecionarLayer(e);
              this.triggerScrollTo();
            });

            // var objetoUtilizadoParaSeparar;
            // if (this.objetosSelecionados.length > 1) {
            // const idObjeto = this.objetosSelecionados[1];
            // objetoUtilizadoParaSeparar = this.objetosSelecionadosMap.get(idObjeto);
            // objetoUtilizadoParaSeparar['_before'] = null;
            // }
            
            this.adicionarContextMenu(geoJson, 'Edição');
            geoJson.addTo(this.editableFeatureGroup);
          }

      })
     
      if(listaObjetosNovos){
        listaObjetosNovos.forEach((obj) => {
          obj['_objetosNovos'] = listaObjetosNovos;
        });
      }


      this.objetosSelecionados.forEach((id) => {
        try {
          const objeto = this.objetosSelecionadosMap.get(id);
          let chaveEncontrada = this.keysShapeFiles.filter(chave => chave.key == id);
          if (chaveEncontrada != undefined && chaveEncontrada != null && chaveEncontrada.length > 0) {
            if (chaveEncontrada[0].tipo == 'edicao') {
              if(objeto['objCorte'] != false){
                this.editableFeatureGroup.removeLayer(objeto);
              }
            } else if (this.shapesSelecionados) {
                for (const camada of this.shapesSelecionados) {
                  if (camada.layerName == chaveEncontrada[0].camada ) {
                    if(objeto['objCorte'] != false){
                      camada.shape.removeLayer(objeto);
                    }
                  }
                }
            }
            // this.map.removeLayer(objeto);
          } else {
            chaveEncontrada = this.keysShapeFiles.filter(chave => chave.key == id + 1);
            if (chaveEncontrada != undefined && chaveEncontrada != null && chaveEncontrada.length > 0) {
              if (chaveEncontrada[0].tipo == 'edicao') {
                if(objeto['objCorte'] != false){
                  this.editableFeatureGroup.removeLayer(objeto);
                }
              } else if (this.shapesSelecionados) {
                  for (const camada of this.shapesSelecionados) {
                    if (camada.layerName == chaveEncontrada[0].camada ) {
                      const objeto2 = camada.shape._layers[`${id + 1}`];
                      if(objeto['objCorte'] != false){
                        camada.shape.removeLayer(objeto2);
                      }
                    }
                  }
              }
            }
          }
          if(objeto['objCorte'] != false){
            this.map.removeLayer(objeto);
          }
        } catch (e) {
          console.log(e);
        }

      });



      // if(listaObjetosNovos){
      //   listaObjetosNovos.forEach((obj) => {
      //     obj['_objetosNovos'] = listaObjetosNovos;
      //   });
      // }

      // if (this.objetosSelecionados.length > 0) {
      //   const idObjetoExcluir = this.objetosSelecionados[0];
      //   try {
      //     const objeto = this.objetosSelecionadosMap.get(idObjetoExcluir);
      //     let chaveEncontrada = this.keysShapeFiles.filter(chave => chave.key == idObjetoExcluir);
      //     if (chaveEncontrada != undefined && chaveEncontrada != null && chaveEncontrada.length > 0) {
      //       if (chaveEncontrada[0].tipo == 'edicao') {
      //         this.editableFeatureGroup.removeLayer(objeto);
      //       } else if (this.shapesSelecionados) {
      //           for (const camada of this.shapesSelecionados) {
      //             if (camada.layerName == chaveEncontrada[0].camada ) {
      //               camada.shape.removeLayer(objeto);
      //             }
      //           }
      //       }
      //       // this.map.removeLayer(objeto);
      //     } else {
      //       chaveEncontrada = this.keysShapeFiles.filter(chave => chave.key == idObjetoExcluir + 1);
      //       if (chaveEncontrada != undefined && chaveEncontrada != null && chaveEncontrada.length > 0) {
      //         if (chaveEncontrada[0].tipo == 'edicao') {
      //           this.editableFeatureGroup.removeLayer(objeto);
      //         } else if (this.shapesSelecionados) {
      //             for (const camada of this.shapesSelecionados) {
      //               if (camada.layerName == chaveEncontrada[0].camada ) {
      //                 const objeto2 = camada.shape._layers[`${idObjetoExcluir + 1}`];
      //                 camada.shape.removeLayer(objeto2);
      //               }
      //             }
      //         }
      //       }
      //     }
      //     this.map.removeLayer(objeto);
      //   } catch (e) {
      //     console.log(e);
      //   }
      // }

      this.descelecionarObjetosSeparados();
      this.configurarAtributos();
      this.configurarTabelaAtributos();
    }
  }

  private mostrarCtrlExportarAtributosECoordenadas() {
    let _this = this;
    this.ctrlExportarAtributosECoordenadas = new L.Control({position: 'topleft'});
    this.ctrlExportarAtributosECoordenadas.onAdd = () => {
      const btnModePrint = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      btnModePrint.type = 'button';
      btnModePrint.title = 'Exportar Atributos e Coordenadas';
      btnModePrint.style.padding = '0px';
      btnModePrint.style.height = '32px';
      btnModePrint.style.width = '35px';
      btnModePrint.style.minWidth = '0px';
      btnModePrint.style.lineHeight = '0px';
      btnModePrint.style.zIndex = '999';
      btnModePrint.innerHTML = `<mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6">
      <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg fill="#595959" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5z" /></svg>
      </mat-icon>`;
      btnModePrint.onclick = function() {
        _this.getNomesShapesSelecionados();
        _this.exportarAtributosECoordenadas(); 
    };
      return btnModePrint;
    };
    this.ctrlExportarAtributosECoordenadas.addTo(this.map);
  }

  private mostrarCtrlHabilitaModoImpressao() {
    let _this = this;
    this.modoHabilitarImpressao = new L.Control({position: 'topleft'});
    this.modoHabilitarImpressao.onAdd = () => {
      const btnModePrint = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button btnModePrint');
      btnModePrint.type = 'button';
      btnModePrint.title = 'Habilitar Modo de Impresão';
      btnModePrint.style.padding = '0px';
      btnModePrint.style.height = '32px';
      btnModePrint.style.width = '35px';
      btnModePrint.style.minWidth = '0px';
      btnModePrint.style.lineHeight = '0px';
      btnModePrint.style.zIndex = '999';
      btnModePrint.innerHTML = `<mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6;">
      <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg fill="#595959" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.1 17H22v-6c0-1.7-1.3-3-3-3h-9l9.1 9zm-.1-7c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-1-3V3H6v1.1L9 7zM1.2 1.8L0 3l4.9 5C3.3 8.1 2 9.4 2 11v6h4v4h11.9l3 3 1.3-1.3-21-20.9zM8 19v-5h2.9l5 5H8z"/></svg>
      </mat-icon>`;
      btnModePrint.onclick = function() {
        _this.getNomesShapesSelecionados();
        PcsUtil.swal().fire({
          title: 'Entrar no Módulo de Impressão?',
          text: 'Para sair do Módulo de Impressão deverá clicar no botão Sair',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sim',
          cancelButtonText: 'Não',
          reverseButtons: false
        }).then((result) => {
          if (result.value) {
            $('.btnModePrint').hide();
            _this.desabilitarCrtlsDefault();
            _this.habilitaComponentesModoImpressao();
            _this.modoImpressao = true;
            _this.gerarLegenda();

          }
        });
    };
      return btnModePrint;
    };
    this.modoHabilitarImpressao.addTo(this.map);
  }

  private mostrarComponenteImpressao() {
    let _this = this;
    let ctrlRenderizado = false;

    const habilitarCtrlModoImpressao = () => {
      let keysLayers = Object.keys(this.map._layers);
      let tipoMapa = "";

      keysLayers.forEach(key => {
        if (this.map._layers[key]._url) {
          if (this.map._layers[key]._url == environment.MAP_TILE_SERVER) {
            tipoMapa = "BASICO";
          }
          else if (this.map._layers[key]._url == environment.MAP_TILE_SERVER_SAT) {
            tipoMapa = "SATELITE";
          }
        }
      });

      if (tipoMapa == "BASICO") {
        this.ctrlModoImpressao = L.control.browserPrint({
          title: 'Imprimir',
          documentTitle: ' ',
          printLayer: L.tileLayer(environment.MAP_TILE_SERVER, {
            attribution: environment.MAP_ATTRIBUTION,
            subdomains: 'abcd',
            minZoom: 0,
            maxZoom: 20
          }),
          closePopupsOnPrint: true,
          printModes: [
            L.control.browserPrint.mode('Alert', 'Selecione uma área', '', customActionToPrint, true),
          ],
          manualMode: false
        }).addTo(this.map);
      } else if (tipoMapa == "SATELITE") {
        this.ctrlModoImpressao = L.control.browserPrint({
          title: 'Imprimir',
          documentTitle: ' ',
          printLayer: L.tileLayer(environment.MAP_TILE_SERVER_SAT, {
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: environment.MAP_ATTRIBUTION,
            minZoom: 0,
            maxZoom: 20
          }),
          closePopupsOnPrint: true,
          printModes: [
            L.control.browserPrint.mode('Alert', 'Selecione uma área', '', customActionToPrint, true),
          ],
          manualMode: false
        }).addTo(this.map);
      } else {
        this.ctrlModoImpressao = L.control.browserPrint({
          title: 'Imprimir',
          documentTitle: ' ',
          printLayer: L.tileLayer(environment.MAP_TILE_BLANK, {
            subdomains: 'abcde',
            attribution: environment.MAP_ATTRIBUTION,
            minZoom: 0,
            maxZoom: 20
          }),
          closePopupsOnPrint: true,
          printModes: [
            L.control.browserPrint.mode('Alert', 'Selecione uma área', '', customActionToPrint, true),
          ],
          manualMode: false
        }).addTo(this.map);
      }
    }

    const customActionToPrint = function(context, mode) {
      
      return function() {
        PcsUtil.swal().fire({
          title: 'Insira um título para Mapa',
          text: `Depois selecione a área de impressão`,
          type: 'info',
          showCancelButton: true,
          confirmButtonText: 'Ok',
          cancelButtonText: 'Cancelar',
          inputPlaceholder: 'Insira um título',
          input: 'text'
        }).then((result) => {
          _this.tituloImpressaoMapa = result.value;
          const escolha: any = result;
          if ( escolha.dismiss && escolha.dismiss === 'cancel') {
            return;
          }
          context._printCustom(mode);
        });
      };
    };

    if(!ctrlRenderizado) {
      habilitarCtrlModoImpressao();
      ctrlRenderizado = true;
    }

    const removerCtrlModoImpressao = () => {
      _this.map.removeControl(_this.ctrlModoImpressao);
    }
   

    this.map.on('baselayerchange', function(evt) {
      if(_this.modoImpressao) {
        _this.loading = true;
        removerCtrlModoImpressao();
        ctrlRenderizado = true;
        habilitarCtrlModoImpressao();
        _this.loading = false;
      }
    });

    this.map.on('browser-print-start', function (evt) {
      _this.loading = true;
    });

    this.map.on('browser-print-end', function (evt) {
      _this.loading = false;
      
    });

    function filter(node) {
      return (node.id !== 'loading-esconder');
    }

    window.print = function () {      
      return domtoimage
          .toJpeg(document.querySelector(".grid-print-container"),  { quality: 1, filter: filter})
          .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = "mapa" + '.jpg';
            link.href = dataUrl;
            link.click();
          });
    };

  }

  private mostrarComponenteMedida() {
    const that = this;

    this.ctrlModoMedida = L.control.measure({
      measureControl: true,
      position: 'topleft',
      primaryLengthUnit: 'metro',
      secondaryLengthUnit: '',
      primaryAreaUnit: 'sqmeters',
      secondaryAreaUnit: '',
      activeColor: '#db4a29',
      completedColor: '#9b2d14',
      popupOptions: {
        maxWidth: 800,
        closeButton: false,
        className: 'leaflet-measure-resultpopup some-other-class'
      },
      units: {
        metro: {
          display: 'metros - ',
          decimals: 2
        },
        sqmeters: {
          display: 'm²'
        }
      }
    });
    this.ctrlModoMedida.addTo(this.map);

    this.map.on('measurefinish', function(evt) {
      that.mostrarCtrllInserirTituloImpressao();
      that.mostrarCtrllInserirLegendaImpressao();
      that.mostrarComponenteImpressao();
    });
    this.map.on('measurestart', function(evt) {
      that.map.removeControl(that.ctrlModoImpressao);
      that.map.removeControl(that.ctrlInserirTituloImpressao);
      that.map.removeControl(that.ctrlInserirLegendaImpressao);
    });

  }

  private mostrarCtrlSairModoImpressao() {
    let _this = this;
    this.modoSairImpressao = new L.Control({position: 'topleft'});
    this.modoSairImpressao.onAdd = () => {
      const buttonImpressaoSair = L.DomUtil.create('input', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      buttonImpressaoSair.width = 1;
      buttonImpressaoSair.type = 'button';
      buttonImpressaoSair.title = 'Sair do Modo de Impressão';
      buttonImpressaoSair.value = 'Sair';
      buttonImpressaoSair.onclick = function() {
          PcsUtil.swal().fire({
            title: 'Deseja sair do modo de Impressão?',
            text: ` Clique no SIM para confirmar.
                    Clique em NÃO para cancelar`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            reverseButtons: false
          }).then((result) => {
            if (result.value) {
              _this.desabilitarModoImpressao();
              _this.modoImpressao = false;
              _this.gerarLegenda();
              _this.habilitarCtrlsDefault();
              _this.mostrarCtrlHabilitaModoImpressao();
            }
          });
      };
      return buttonImpressaoSair;
    };
    this.modoSairImpressao.addTo(this.map);
  }

  private habilitaComponentesModoImpressao() {
    this.mostrarCtrlSairModoImpressao();
    this.mostrarComponenteMedida();
    this.mostrarCtrllInserirTituloImpressao();
    this.mostrarCtrllInserirLegendaImpressao();
    this.mostrarComponenteImpressao();
  }

  private desabilitarModoImpressao() {
    this.map.removeControl(this.ctrlModoImpressao);
    this.map.removeControl(this.modoSairImpressao);
    this.map.removeControl(this.modoHabilitarImpressao);
    this.map.removeControl(this.ctrlInserirTituloImpressao);
    this.map.removeControl(this.ctrlInserirLegendaImpressao);
    this.map.removeControl(this.ctrlModoMedida);

    this.map.off('measurefinish');
    this.map.off('measurestart');
  }


  private desabilitarCrtlsDefault() {
    this.map.removeControl(this.ctrlMenu);
    this.map.removeControl(this.ctrlFiltro);
    this.map.removeControl(this.ctrlExport);
    this.map.removeControl(this.ctrlTree);
    this.map.removeControl(this.ctrlExportarAtributosECoordenadas);
    this.ctrlTree = null;
    $('.leaflet-draw').hide();
    $('#btnSelecionarShapes').hide();
    $('#btnCreatePolygon').hide();
    $('.leaflet-control-layers-expanded').hide();
    $('#btnLimparShapes').hide();
  }

  private habilitarCtrlsDefault() {
    this.mostrarCrtlMenu();
    this.mostrarCrtlFiltro();
    this.mostrarCrtlExport();
    this.mostrarCtrlExportarAtributosECoordenadas();
    this.baseTree = {
    };

    this.gerarMenuShapes();
    $('.leaflet-draw').show();
    $('#btnSelecionarShapes').show();
    $('#btnCreatePolygon').show();
    $('#btnLimparShapes').show();
    $('.leaflet-control-layers-expanded').show();

  }



  private mostrarCtrllInserirTituloImpressao() {
    let _this = this;
    this.ctrlInserirTituloImpressao = new L.Control({position: 'topleft'});
    this.ctrlInserirTituloImpressao.onAdd = () => {
      const buttonInserirTitulo = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      buttonInserirTitulo.type = 'button';
      buttonInserirTitulo.title = 'Inserir Rótulo';
      buttonInserirTitulo.style.padding = '0px';
      buttonInserirTitulo.style.height = '34px';
      buttonInserirTitulo.style.width = '34px';
      buttonInserirTitulo.style.minWidth = '0px';
      buttonInserirTitulo.style.lineHeight = '0px';
      buttonInserirTitulo.innerHTML = `<mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6; color: #595959">
      <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><g><g><path d="M2.5,4v3h5v12h3V7h5V4H2.5z M21.5,9h-9v3h3v7h3v-7h3V9z"/></g></g></g></svg>
      </mat-icon>`;
      buttonInserirTitulo.onclick = () => {
        this.adicionarTitulo(this.tituloParaAdicionar);
      };
      return buttonInserirTitulo;
    };
    this.ctrlInserirTituloImpressao.addTo(this.map);
  }

  private adicionarTitulo(tituloSelecionado: Titulo) {

    const titulo = tituloSelecionado;
    const dialogRef = this.dialog.open(EditarPropriedadesTituloComponent, {
      minWidth: '25%',
      maxWidth: '75%',
      height: '40%',
      data: {
        obj : titulo
      }
    });

    dialogRef.afterClosed().subscribe( response => {
      if (response) {
        this.tituloParaAdicionar = response as Titulo;
        document.getElementById('map').style.cursor = 'crosshair';
        this.criandoTitulo = true;
      }
    });
  }

  private concluirAdicaoTitulo(lat, long) {
    const markerTitulo: marker = marker([lat, long],
      {draggable: true ,
       icon: new L.DivIcon({
           className: 'my-div-icon',
          html: `<div style="color: ${this.tituloParaAdicionar.color};
          background-color:${this.tituloParaAdicionar.backgroundColor};
          font-size:${this.tituloParaAdicionar.fontSize}px;width: min-content;white-space: nowrap;">${this.tituloParaAdicionar.texto}</div>`
       })
      });
    markerTitulo.options.titulo = this.tituloParaAdicionar;
    markerTitulo.on('dragend', function(event) {
      const marker = event.target;
      const position = marker.getLatLng();
      marker.setLatLng(new L.LatLng(position.lat, position.lng), {draggable: 'true'});
    }).addTo(this.map);

    try {
      markerTitulo.bindContextMenu({
        contextmenu: true,
        contextmenuInheritItems: false,
        contextmenuItems: [
          { text: 'Editar',  callback: (evt) => { this.atualizarTituloSelecionado(markerTitulo.options.titulo, markerTitulo); } },
          { text: 'Excluir',  callback: (evt) => { markerTitulo.remove(); }},
          { text: 'Sair', hideOnSelect: true},
        ]
      });
    } catch (error) {
      console.log(error);
    }

    markerTitulo.addTo(this.map);
    this.criandoTitulo = false;
    this.tituloParaAdicionar = new Titulo();
    document.getElementById('map').style.cursor = '';
  }

  private atualizarTituloSelecionado(titulo: Titulo, marcador: any) {

    const dialogRef = this.dialog.open(EditarPropriedadesTituloComponent, {
      minWidth: '25%',
      maxWidth: '75%',
      height: '40%',
      data: {
        obj : titulo
      }
    });

    dialogRef.afterClosed().subscribe( response => {
      if (response) {
        marcador.options.titulo = response as Titulo;
        marcador.setIcon(new L.DivIcon({
          className: 'my-div-icon',
         html: `<div style="color: ${response.color};
         background-color:${response.backgroundColor};
         font-size:${response.fontSize}px; width: min-content;white-space: nowrap; ">${response.texto}</div>`
        }));

      }
    });
  }


  definirRotulo(layer: any) {
    if (layer.layer) {
      const propriedades = {};
      const keys = Object.keys( layer.layer.feature.properties );
      keys.forEach(e => propriedades[e] = e);

      PcsUtil.swal().fire({
        title: 'Rótulo',
        text: `Escolha um atributo para utilizar como rótulo.`,
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancelar',
        input: 'select',
        inputOptions: propriedades,
      }).then((result) => {
        if (result.value) {
          if (layer.layer.getTooltip) {
            const toolTip = layer.layer.getTooltip();
            if (toolTip) {
              this.map.closeTooltip(toolTip);
            }
          }
          layer.layer.bindTooltip(layer.layer.feature.properties[result.value], { permanent: true, direction: 'right'});
        }
      });
    } else if (layer.feature && layer.feature.properties) {
      const propriedades = {};
      const keys = Object.keys( layer.feature.properties );
      keys.forEach(e => propriedades[e] = e);

      PcsUtil.swal().fire({
        title: 'Rótulo',
        text: `Escolha um atributo para utilizar como rótulo.`,
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancelar',
        input: 'select',
        inputOptions: propriedades,
      }).then((result) => {
        if (result.value) {
          if (layer.getTooltip) {
            const toolTip = layer.getTooltip();
            if (toolTip) {
              this.map.closeTooltip(toolTip);
            }
          }
          layer.bindTooltip(layer.feature.properties[result.value] + '', { permanent: true, direction: 'right'});
        }
      });
    } else if (layer.options) {

      let propriedades;

      if (layer.options.qtdBP) {
        propriedades = {title: 'Cidade - Boas Práticas', cidade : 'Cidade', qtdBP: 'Quantidade'};
      } else if (layer.options.variavel) {
        propriedades = {title: 'Cidade - Variável Preenchida', cidade : 'Cidade', variavel: 'Variavel', valorTexto: 'Valor'};
      } else if (layer.options.indicador) {
        propriedades = {title: 'Cidade - Indicador Preenchido', cidade : 'Cidade', indicador: 'Indicador', valor: 'Valor'};
      } else if (layer.properties) {
        propriedades = {};
        const keys = Object.keys( layer.properties );
        keys.forEach(e => propriedades[e] = e);
      }

      PcsUtil.swal().fire({
        title: 'Rótulo',
        text: `Escolha um atributo para utilizar como rótulo.`,
        type: 'info',
        showCancelButton: true,
        confirmButtonText: 'Ok',
        cancelButtonText: 'Cancelar',
        input: 'select',
        inputOptions: propriedades,
      }).then((result) => {
        if (result.value) {
          if (layer.getTooltip) {
            const toolTip = layer.getTooltip();
            if (toolTip) {
              this.map.closeTooltip(toolTip);
            }
          }
          layer.bindTooltip(layer.options[result.value] + '', { permanent: true, direction: 'right'});
        }
      });
    }
  }

  fecharRotulo(layer) {
    if (layer.layer) {
      if (layer.layer.getTooltip) {
        const toolTip = layer.layer.getTooltip();
        if (toolTip) {
          this.map.closeTooltip(toolTip);
        }
      }
    } else {
      if (layer.getTooltip) {
        const toolTip = layer.getTooltip();
        if (toolTip) {
          this.map.closeTooltip(toolTip);
        }
      }
    }
  }

  private mostrarCtrllInserirLegendaImpressao() {
    let _this = this;
    this.ctrlInserirLegendaImpressao = new L.Control({position: 'topleft'});
    this.ctrlInserirLegendaImpressao.onAdd = () => {
      const buttonInserirTitulo = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom mat-flat-button');
      buttonInserirTitulo.type = 'button';
      buttonInserirTitulo.title = 'Inserir Legenda';
      buttonInserirTitulo.style.padding = '0px';
      buttonInserirTitulo.style.height = '34px';
      buttonInserirTitulo.style.width = '34px';
      buttonInserirTitulo.style.minWidth = '0px';
      buttonInserirTitulo.style.lineHeight = '0px';
      buttonInserirTitulo.innerHTML = `<mat-icon  svgIcon="file-export" class="mat-icon svg-icon notranslate material-icons mat-icon-no-color" style="line-height: .6; color:#595959;">
      <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>
      </mat-icon>`;
      buttonInserirTitulo.onclick = function() {
        _this.openDialogLegenda();
      };
      return buttonInserirTitulo;
    };
    this.ctrlInserirLegendaImpressao.addTo(this.map);
  }


  private initCfgGeoServer() {
    let _this = this;

    L.TileLayer.BetterWMS = L.TileLayer.WMS.extend({

      onAdd(map) {
        // Triggered when the layer is added to a map.
        //   Register a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onAdd.call(this, map);
        map.on('click', this.getFeatureInfo, this);
      },

      onRemove(map) {
        // Triggered when the layer is removed from a map.
        //   Unregister a click listener, then do all the upstream WMS things
        L.TileLayer.WMS.prototype.onRemove.call(this, map);
        map.off('click', this.getFeatureInfo, this);
      },

      getFeatureInfo(evt) {
        // Make an AJAX request to the server and hope for the best
        const url = this.getFeatureInfoUrl(evt.latlng), showResults = L.Util.bind(this.showGetFeatureInfo, this);
        $.ajax({
          url,
          success(data, status, xhr) {

            const dataHtml = _this.propriedadesToString(data.features[0].properties, '');

            const err = typeof data === 'string' ? null : data;
            showResults(null, evt.latlng, dataHtml);
          },
          error(xhr, status, error) {
            showResults(error);
          }
        });
      },

      getFeatureInfoUrl(latlng) {
        // Construct a GetFeatureInfo request URL given a point
        const point = this._map.latLngToContainerPoint(latlng, this._map.getZoom()),
          size = this._map.getSize(),

        params = {
          request: 'GetFeatureInfo',
          service: 'WMS',
          srs: 'EPSG:4326',
          styles: this.wmsParams.styles,
          transparent: this.wmsParams.transparent,
          version: this.wmsParams.version,
          format: this.wmsParams.format,
          bbox: this._map.getBounds().toBBoxString(),
          height: size.y,
          width: size.x,
          layers: this.wmsParams.layers,
          query_layers: this.wmsParams.layers,
          info_format: 'application/json'
        };

        params[params.version === '1.3.0' ? 'i' : 'x'] = point.x;
        params[params.version === '1.3.0' ? 'j' : 'y'] = point.y;

        return this._url + L.Util.getParamString(params, this._url, true);
      },

      showGetFeatureInfo(err, latlng, content) {
        if (err) { console.log(err); return; } // do nothing if there's an error

        // Otherwise show the content in a popup, or something.
        L.popup({ maxWidth: 800 })
          .setLatLng(latlng)
          .setContent(content)
          .openOn(this._map);
      }
    });

    L.tileLayer.betterWms = function(url, options) {
      return new L.TileLayer.BetterWMS(url, options);
    };

  }

  public openDialogLegenda(): void {
    let _this = this;

    if (this.legendaEditavel) {
      this.map.removeControl(this.legendaEditavel);
    } else {
      this.dadosLegenda.grades = [''];
      this.dadosLegenda.labels = [''];
    }

    const dadosLegenda = this.dadosLegenda;
    const dialogRef = this.dialog.open(CriarLegendaComponent, {
      minWidth: '40%',
      maxWidth: '75%',
      data: {
        listaGrades : dadosLegenda.grades,
        listaLabels : dadosLegenda.labels,
        camadasComLegenda: dadosLegenda.camadasComLegenda,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.dadosLegenda.grades = data.listaGrades;
        this.dadosLegenda.labels = data.listaLabels;
        this.dadosLegenda.camadasComLegenda = data.camadasComLegenda;
        this.gerarLegenda();
      }

    });
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
            const divCamadasComLegenda = L.DomUtil.create('div', 'camadas-com-legenda');
            const grades = _this.dadosLegenda.grades;
            const labels = _this.dadosLegenda.labels;
            const camadasTematicas = _this.dadosLegenda.classesTematicas;
            const camadasComLegenda = _this.dadosLegenda.camadasComLegenda;      

            if (_this.modoImpressao) {
              for (let i = 0; i < grades.length; i++) {
                if (grades[i] ) {
                  div.innerHTML +=
                  grades[i] + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  labels[i] + '\'></i>') + '<br>';
                }
              }
  
              if (div.innerHTML.length > 0 ) {
                const qtdCaracteres = div.innerHTML.length;
                const texto = div.innerHTML.substring(0, qtdCaracteres - 4);
                div.innerHTML = texto;
              }

              if (grades.length > 0 ) {
                for (let i = 0; i < camadasComLegenda.length; i++) {
                  if(camadasComLegenda[i].cor != '' ) {
                    if (camadasComLegenda[i].legenda != undefined && camadasComLegenda[i].legenda != '') {
                      divCamadasComLegenda.innerHTML += ('<div><i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1; word-break: break-word; background-color:' + camadasComLegenda[i].cor + '\'></i>' + ` <strong>${camadasComLegenda[i].legenda}</strong><br></div>`)
                    } else {
                      divCamadasComLegenda.innerHTML += ('<div><i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1; word-break: break-word; background-color:' + camadasComLegenda[i].cor + '\'></i>' + ` <strong>${camadasComLegenda[i].nomeCamada}</strong><br></div>`)
                    }
                  }
                   
                  }             
              }
              else {
                divCamadasComLegenda.innerHTML = ''
              }

            }
          
            if (camadasTematicas.length > 0) {
              for (let i = 0; i < camadasTematicas.length; i++) {
                divCamadaTematica.innerHTML += `<div><strong>${camadasTematicas[i].nome}</strong><br>`;
                camadasTematicas[i].classes.forEach(classe => {
                  divCamadaTematica.innerHTML += (classe.value == undefined ? 'vazio' : classe.value) + ('<i class=\'legend-toggle-icon fa fa-2x\' style=\'opacity:1;background-color:' +  classe.color + '\'></i></div>') + '<br>';
                });
              }
            }
            else {
              divCamadaTematica.innerHTML = '';
            }
            
            div.innerHTML += divCamadasComLegenda.innerHTML;
            div.innerHTML += divCamadaTematica.innerHTML;
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

  private openDialogPropriedades(layerSelecionada, isLayerGroup): void {
    const layer = layerSelecionada;
    const layerGroup = isLayerGroup;
    const dialogRef = this.dialog.open(EditarPropriedadesComponent, {
      height: '450px',
      data: {
        obj : layer,
        layer : layerGroup
      },
      autoFocus: false
    });
  }

  public carregarEstiloBoasPraticasNoMapa(estilo: any) {
    this.boasPraticasFeatureGroup.setStyle(estilo);
  }

  public carregarEstiloVariaveisNoMapa(estilo: any) {
    this.variaveisFeatureGroup.setStyle(estilo);
  }

  public carregarEstiloIndicadoresNoMapa(estilo: any) {
    this.indicadoesFeatureGroup.setStyle(estilo);
  }

  fecharMenuSIG() {
    this.sidenavOpen = false;
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

  gerarMapa(mapa, camada, idCamada) {    
    const selectedLayer = camada;
    const layerName = camada.layerName;
    let selectedAttribute = mapa.attributeName;
    let selectedType = mapa.type;
    this.classesMapaTematico = mapa.classes
    this.shapesSelecionados.forEach(shape => {
      camada = idCamada == shape.id ? shape : ''
    });

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
            layer.setStyle({color: clazz.color == undefined ? '#666666' : '#0a0303', fillColor: clazz.color == undefined ? '#c0c3ac' : clazz.color, opacity: 1, fillOpacity: clazz.color == undefined ? 0.4 : 1, weight: clazz.color == undefined ? 4 : 1});
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
          layer.setStyle({color: clazz.color == undefined ? '#666666' : '#0a0303', fillColor: clazz.color == undefined ? '#c0c3ac' : clazz.color, opacity: 1, fillOpacity: clazz.color == undefined ? 0.4 : 1, weight: clazz.color == undefined ? 4 : 1});
        }
      }
      this.getClassesTematicas(
        {nome: layerName,
        classes: this.classesMapaTematico,
      exibirLegenda: mapa.exibirLegenda});
      }
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
        weight: 3})
      }
    }
    else if (mapaTematico._layers) {
     Object.keys(mapaTematico._layers).forEach(layer => {
        mapaTematico._layers[layer].setStyle({color: "#666666",
        draggable: true,
        fillColor: "#c0c3ac",
        fillOpacity: 0.5,
        opacity: 1,
        strokeOpacity: 0.5,
        transform: true,
        weight: 3})
      })
    }
    this.dadosLegenda.classesTematicas = this.dadosLegenda.classesTematicas.filter(item => item.nome !== mapaTematico.nome);
    this.gerarLegenda();
  }

  public getNomesShapesSelecionados() {
    if (this.shapesSelecionados && this.shapesSelecionados.length > 0) {
      const lista = this.shapesSelecionados.map(item => item.layerName);
      this.nomesShapesSelecionados = lista.join('<br/>');
    } 
  }
  configurarAtributos() {
    this.configurarKeys();
    this.atributos = new Set();
    this.atributos.add('id-sig');
    this.atributos.add('camada');
    if (this.editableFeatureGroup._layers) {
      const keysEdicao = Object.keys(this.editableFeatureGroup._layers);
      for (const key of keysEdicao) {
        if (this.editableFeatureGroup._layers[key].properties) {
          const keysEncontradas = Object.keys(this.editableFeatureGroup._layers[key].properties);
          keysEncontradas.forEach(k => {this.atributos.add(k); });
        }
      }
    }
    if (this.shapesSelecionados) {
      for (const camada of this.shapesSelecionados) {
        const keysLayers = Object.keys(camada.shape._layers);

        for(const key of keysLayers) {
          if (camada.shape._layers[key].properties) {
            const keysEncontradas = Object.keys(camada.shape._layers[key].properties);
            keysEncontradas.forEach(k => {this.atributos.add(k); });
          } else if (camada.shape._layers[key]._layers) {
            const subKeysLayer = Object.keys(camada.shape._layers[key]._layers);

            for(const subKey of subKeysLayer) {
              Object.keys(camada.shape._layers[key]._layers[subKey].feature.properties)
              .forEach(k => {this.atributos.add(k);});
            }
            
          }
        }
        /*if ( keysLayers.length > 0) {
          const keyLayer = keysLayers[0];

          if (camada.shape._layers[keyLayer].properties) {
            const keysEncontradas = Object.keys(camada.shape._layers[keyLayer].properties);
            keysEncontradas.forEach(k => {this.atributos.add(k); });
          } else if (camada.shape._layers[keyLayer]._layers) {
            const subKeysLayer = Object.keys(camada.shape._layers[keyLayer]._layers);
            Object.keys(camada.shape._layers[keyLayer]._layers[subKeysLayer[0]].feature.properties)
              .forEach(k => {this.atributos.add(k);});
          }
        }*/
      }
    }
  }

  exportXlsAtributosECentroides(formatados: any) {
    if (formatados) {
      const registrosExportacao = formatados;
      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.aoa_to_sheet(registrosExportacao);
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
      XLSX.writeFile(workBook, 'planilha_atributos_e_coordenadas_pcs.xlsx');
    }
  }

  exportarAtributosECoordenadas() {
    let centroides = [];
    const camadas = this.shapesSelecionados.map(item => item.layerName);
    for (const chave of this.keysShapeFiles) {
      const registro = [chave.key, chave.camada];
      const centroide: any = this.leafletUtil.getCentroide(chave.layer);
      centroides.push(centroide);
    }
    let formatados: any[] = [];
    let listaAtributos: any[] = [];

    this.atributos.forEach(att => {
      listaAtributos.push(att);
    });
    listaAtributos.unshift('Longitude');
    listaAtributos.unshift('Latitude');
    formatados.push(listaAtributos);

    const tabela = Object.assign(this.tabelaAtributos);

    for (let index = 0; index < tabela.length; index++) {
      tabela[index].unshift(centroides[index][0]);
      tabela[index].unshift(centroides[index][1]);
    }

    centroides = null;

    tabela.forEach(att => {
      formatados.push(this.formatarRegistrosNumericosParaExportacao(att));
    });

    if(tabela && tabela.length > 0) {
      this.validacaoExportacaoAtributos(formatados);
    } else {
      PcsUtil.swal().fire('Não há objetos no mapa', `Por favor, desenhe ou selecione objetos no mapa para realizar a exportação dos Atributos e Coordenadas`, 'error');
    }
  }

  formatarRegistrosNumericosParaExportacao(item: Array<any>) {
    let arrayFormatado = [];

    arrayFormatado.push(item[0]);
    arrayFormatado.push(item[1]);

    for(let i = 2; i < item.length; i++) {
      if(item[i] && this.isNumber(item[i])) {
        arrayFormatado.push(item[i].toLocaleString('pt-BR'));
      } else {
        arrayFormatado.push(item[i]);
      }
    }

    return arrayFormatado;
  }

  configurarTabelaAtributos() {
    this.tabelaAtributos = [];
    for (const chave of this.keysShapeFiles) {

      const registro = [chave.key, chave.camada];

      if (chave.tipo == 'edicao') {
        this.atributos.forEach(atributo => {
          if ( atributo !== 'id-sig' && atributo !== 'camada') {
            let valor = '';
            try {
              valor = this.editableFeatureGroup._layers[`${chave.key}`].properties ? this.editableFeatureGroup._layers[`${chave.key}`].properties[atributo] : '' ;

            } catch (e ) {
              console.log(e);
            }
            registro.push(valor);
          }
        });
      }

      if (chave.tipo == 'selecionado') {
        if (this.shapesSelecionados) {
          for (const camada of this.shapesSelecionados) {
            if (camada.shape._layers[chave.key]) {
              if (camada.shape._layers[chave.key].properties) {
                this.atributos.forEach(atributo => {
                  if (atributo !== 'id-sig' && atributo !== 'camada') {
                    const valor = camada.shape._layers[chave.key].properties[`${atributo}`] ? camada.shape._layers[chave.key].properties[`${atributo}`] : '';
                    registro.push(valor);
                  }
                });

              } else if (camada.shape._layers[chave.key]._layers) {
                const subKeysLayer = Object.keys(camada.shape._layers[chave.key]._layers);
                this.atributos.forEach(atributo => {
                  if (atributo !== 'id-sig' && atributo !== 'camada') {
                    const valor = camada.shape._layers[chave.key]._layers[subKeysLayer[0]].feature.properties[`${atributo}`] != null && camada.shape._layers[chave.key]._layers[subKeysLayer[0]].feature.properties[`${atributo}`]  != undefined ? camada.shape._layers[chave.key]._layers[subKeysLayer[0]].feature.properties[`${atributo}`] : '';
                    registro.push(valor);
                  }
                });
              }
            }
            const keysLayers = Object.keys(camada.shape._layers);
            const keyLayer = keysLayers[0];
          }
        }
      }
      this.tabelaAtributos.push(registro);
    }
  }

  configurarKeys() {
    this.keysShapeFiles = [];
    if (this.editableFeatureGroup._layers) {
      const keysEdicao = Object.keys(this.editableFeatureGroup._layers);
      for (const keyLayer of keysEdicao) {
        this.keysShapeFiles.push({ key: keyLayer, tipo: 'edicao', camada: 'Edição', layer: this.editableFeatureGroup._layers[keyLayer] });
      }
    }
    if (this.shapesSelecionados) {
      for (const camada of this.shapesSelecionados) {
        if (camada.shape.selecionado) {
          const keysLayers = Object.keys(camada.shape._layers);
          for (const keyLayer of keysLayers) {
            this.keysShapeFiles.push({ key: keyLayer, tipo: 'selecionado', camada: camada.layerName, layer: camada.shape._layers[keyLayer]  });
          }
        }
      }
    }
  }

  replaceForaAspasDuplas(texto, oldString, newString) {
    const matches = texto.match(`"(.*${oldString}.*)"`);
    const utilizaveis = matches != null ? matches.filter(x => x.indexOf(`\"`) == -1 ) : [];
    for (let i = 0; i < utilizaveis.length; i++) {
      texto = texto.replaceAll(utilizaveis[i], `tIsxtpAsmpoCraIriTo${(i + 1) * 23231}`);
    }
    texto = texto.replaceAll(oldString, newString);
    for (let i = 0; i < utilizaveis.length; i++) {
      texto = texto.replaceAll(`tIsxtpAsmpoCraIriTo${(i + 1) * 23231}`, utilizaveis[i] );
    }
    return texto;

  }


  criarNovoAtributo(novoAtributo) {
    if (!novoAtributo.formula) {
      novoAtributo.formula = '';
    }

    const atributosOrdenados = [];
    this.atributos.forEach(atributo => {
      atributosOrdenados.push(atributo);
    });
    atributosOrdenados.sort((a, b) => -(a.length > b.length ) || +(a.lenght < b.lenght ));
    const formulaAux = Object.assign(novoAtributo.formula);

    const atributosDaFormula = [];
    atributosOrdenados.forEach(atributo => {
      if (novoAtributo.formula.indexOf(`${atributo}`) > -1) {
        atributosDaFormula.push(atributo);
        formulaAux.replaceAll(`${atributo}`, '');
      }
    });


    for (const chave of this.keysShapeFiles) {
      let novaFormula =  novoAtributo.formula;

      if (chave.tipo == 'edicao') {
        for (const atributo of atributosDaFormula) {
          switch (atributo) {
            case 'id-sig':
              novaFormula = this.replaceForaAspasDuplas(novaFormula, atributo , chave.key );
              break;
            case 'camada':
                novaFormula = this.replaceForaAspasDuplas(novaFormula, atributo , `"${chave.camada}"` );
                break;
            default:
              let valor = this.editableFeatureGroup._layers[`${chave.key}`].properties[atributo];
              valor = isNaN(valor) ? `"${valor}"` : valor;
              // if(!isNaN(valor)){
              //   valor = Math.round(valor,2);
              // }

              novaFormula = this.replaceForaAspasDuplas(novaFormula, atributo , valor );
              break;
          }
        }
        const novoValor = this.formulaParser.parse(novaFormula);
        if (novoValor.error == null) {
          if (!this.editableFeatureGroup._layers[chave.key].properties) {
            this.editableFeatureGroup._layers[chave.key].properties = {};
          }
          this.editableFeatureGroup._layers[chave.key].properties[novoAtributo.nome] = novoValor.result;
        } else {
          this.editableFeatureGroup._layers[chave.key].properties[novoAtributo.nome] = '';
        }


      }

      if (chave.tipo == 'selecionado') {
        if (this.shapesSelecionados) {
          for (const camada of this.shapesSelecionados) {
            if (camada.layerName == chave.camada) {
              if (camada.shape._layers[chave.key].properties) {
                for (const atributo of atributosDaFormula) {
                  switch (atributo) {
                    case 'id-sig':
                      novaFormula = this.replaceForaAspasDuplas(novaFormula, atributo , chave.key );
                      break;
                    case 'camada':
                        novaFormula = this.replaceForaAspasDuplas(novaFormula, atributo , `"${chave.camada}"` );
                        break;
                    default:
                      let valor = camada.shape._layers[chave.key].properties[`${atributo}`];
                      valor = isNaN(valor) ? `"${valor}"` : valor;

                      novaFormula = this.replaceForaAspasDuplas(novaFormula, atributo , valor );
                      break;
                  }
                }
                const novoValor = this.formulaParser.parse(novaFormula);
                if (novoValor.error == null) {
                  if (!camada.shape._layers[chave.key].properties) {
                    camada.shape._layers[chave.key].properties = {};
                  }
                  camada.shape._layers[chave.key].properties[novoAtributo.nome] = novoValor.result;
                } else {
                  camada.shape._layers[chave.key].properties[novoAtributo.nome] = '';
                }
                break;
              } else if (camada.shape._layers[chave.key]._layers) {
                const subKeysLayer = Object.keys(camada.shape._layers[chave.key]._layers);
                for (const atributo of atributosDaFormula) {
                  switch (atributo) {
                    case 'id-sig':

                      novaFormula = this.replaceForaAspasDuplas(novaFormula, atributo , chave.key );
                      break;
                    case 'camada':
                        novaFormula = this.replaceForaAspasDuplas(novaFormula, atributo , `"${chave.camada}"` );
                        break;
                    default:
                      let valor = camada.shape._layers[chave.key]._layers[subKeysLayer[0]].feature.properties[`${atributo}`];
                      valor = isNaN(valor) ? `"${valor}"` : valor;

                      novaFormula = this.replaceForaAspasDuplas(novaFormula, atributo , valor );
                      break;
                  }
                }
                const novoValor = this.formulaParser.parse(novaFormula);
                if (novoValor.error == null) {
                  if (!camada.shape._layers[chave.key]._layers[subKeysLayer[0]].feature.properties) {
                    camada.shape._layers[chave.key]._layers[subKeysLayer[0]].feature.properties = {};
                  }
                  camada.shape._layers[chave.key]._layers[subKeysLayer[0]].feature.properties[novoAtributo.nome] = novoValor.result;
                } else {
                  camada.shape._layers[chave.key]._layers[subKeysLayer[0]].feature.properties[novoAtributo.nome] = '';
                }

              }
            }
          }
        }
      }
    }
    this.configurarAtributos();
    this.configurarTabelaAtributos();
  }

  mesclarPlanilha(dados) {
    this.loading = true;
    const indiceReferencia = dados.atributos.indexOf(dados.referencia);
    let referenciaIsNumber: boolean;
    let registroReferencia;
    for (const registro of dados.matriz) {
      //const valorReferencia = registro[indiceReferencia];
      referenciaIsNumber = this.isNumber(registro[indiceReferencia]);
      if (this.editableFeatureGroup._layers) {
        const keysEdicao = Object.keys(this.editableFeatureGroup._layers);
        for (const keyLayer of keysEdicao) {
          const layer = this.editableFeatureGroup._layers[keyLayer];

          if(!referenciaIsNumber) {
            registroReferencia = dados.matriz.find(item => {
              if(item.length > 0) {
                return item[indiceReferencia].toLowerCase() == layer.properties[dados.referencia].toLowerCase()
              }
            }); 
          } else {
            registroReferencia = dados.matriz.find(item => {
              if(item.length > 0) {
                return item[indiceReferencia] == layer.properties[dados.referencia]
              }
            });
          }
          
          const valorReferencia =  registroReferencia ? registroReferencia[indiceReferencia] : null;
                 
          switch (dados.referencia) {
            case 'id-sig':
              if (keyLayer == valorReferencia ) {
                this.configurarLayerParaMerge(layer, dados.atributos, registroReferencia, true);
              }
              break;
            case 'camada':
                if ('Edição' == valorReferencia ) {
                  this.configurarLayerParaMerge(layer, dados.atributos, registroReferencia, true);
                }
                break;
            default:
              if (layer.properties && layer.properties[dados.referencia] && this.verificaIgualdadeDeDadosParaMesclagem(layer.properties[dados.referencia], valorReferencia)) {
                this.configurarLayerParaMerge(layer, dados.atributos, registroReferencia, true);
              }
              break;
          }
        }
      }
      if (this.shapesSelecionados) {
          for (const camada of this.shapesSelecionados) {
            const keysCamada = Object.keys(camada.shape._layers);
            for (const keyCamada of keysCamada) {
              if (camada.shape._layers[keyCamada].properties) {
                const layer = camada.shape._layers[keyCamada];

                if(!referenciaIsNumber) {
                  
                  registroReferencia = dados.matriz.find(item => {
                    if(item.length > 0) {
                      return item[indiceReferencia].toLowerCase() == layer.properties[dados.referencia].toLowerCase()
                    }
                  });
                } else {
                  registroReferencia = dados.matriz.find(item => {
                    if(item.length > 0) {
                      return item[indiceReferencia] == layer.properties[dados.referencia]
                    }
                  });
                }
               

                const valorReferencia =  registroReferencia ? registroReferencia[indiceReferencia] : null;

                switch (dados.referencia) {
                  case 'id-sig':
                    if (keyCamada == valorReferencia ) {
                      this.configurarLayerParaMerge(layer, dados.atributos, registroReferencia, false);
                    }
                    break;
                  case 'camada':
                      if (camada.layerName == valorReferencia ) {
                        this.configurarLayerParaMerge(layer, dados.atributos, registroReferencia, false);
                      }
                      break;
                  default:
                    if (layer.properties && layer.properties[dados.referencia] && this.verificaIgualdadeDeDadosParaMesclagem(layer.properties[dados.referencia], valorReferencia)) {
                      
                      this.configurarLayerParaMerge(layer, dados.atributos, registroReferencia, false);
                    }
                    break;
                }

              } else if (camada.shape._layers[keyCamada]._layers) {
                const subKeysLayer = Object.keys(camada.shape._layers[keyCamada]._layers);
                if (camada.shape._layers[keyCamada]._layers[subKeysLayer[0]].feature.properties) {
                  const layer = camada.shape._layers[keyCamada]._layers[subKeysLayer[0]];

                  if(!referenciaIsNumber) {
                    registroReferencia = dados.matriz.find(item => {
                      if(item.length > 0) {
                        return item[indiceReferencia].toLowerCase() == layer.feature.properties[dados.referencia].toLowerCase()
                      }
                    });
                  } else {
                    registroReferencia = dados.matriz.find(item => {
                      if(item.length > 0) {
                        return item[indiceReferencia] == layer.feature.properties[dados.referencia]
                      }
                    });
                  }
                 
                  const valorReferencia =  registroReferencia ? registroReferencia[indiceReferencia] : null;

                  switch (dados.referencia) {
                    case 'id-sig':
                      if (keyCamada == valorReferencia ) {
                        this.configurarLayerParaMerge(layer, dados.atributos, registroReferencia, false);
                      }
                      break;
                    case 'camada':
                        if (camada.layerName == valorReferencia ) {
                          this.configurarLayerParaMerge(layer, dados.atributos, registroReferencia, false);
                        }
                        break;
                    default:
                      if (layer.feature.properties && layer.feature.properties[dados.referencia] && this.verificaIgualdadeDeDadosParaMesclagem(layer.feature.properties[dados.referencia], valorReferencia)) {
                        this.configurarLayerParaMerge(layer, dados.atributos, registroReferencia, false);
                      }
                      break;
                  }
                }
              }
            }
          }
        }
      }
    this.configurarAtributos();
    this.configurarTabelaAtributos();
    this.loading = false;
    }

    verificaIgualdadeDeDadosParaMesclagem(properties, valorReferencia) {
      let propertiesIsNumber = this.isNumber(properties);
      let valorReferenciaIsNumber = valorReferencia ? this.isNumber(valorReferencia) : null;

      if(valorReferencia) {
        if(propertiesIsNumber && valorReferenciaIsNumber) {
          if(properties == valorReferencia) { return true;} else { return false; }
        } else {
          if(properties.toLowerCase() == valorReferencia.toLowerCase()) {
            return true; 
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
     
    }

    public atualizarTabelaAtributos(){
      if(this.shapesSelecionados.length > 0) {
        this.recarregarShapePosMesclagem(this.shapesSelecionados[0]['id']);
      } else {
        this.gerarMenuShapes();
      }
      
     // this.configurarAtributos();
     //this.configurarTabelaAtributos();
    }

    recarregarShapePosMesclagem(idShape) {
        this.shapesSelecionados[0]['shape'].clearLayers();
       
        this.gerarMenuShapes();
        
        setTimeout(() => {
          const checkboxes: any = document.querySelectorAll('input[type=checkbox]');
          checkboxes.forEach((c) => {
            if(c.checked){
              c.click();
            }
            c.checked = false;
          });
          checkboxes.forEach((c) => {
            const parent = c.parentNode;
            const titleSpan = parent.querySelector('span');
            const titleDiv = titleSpan ? titleSpan.querySelector('span') : undefined;
            if (titleDiv) {
              const shapeId = titleDiv.getAttribute('data-id');
              if (shapeId == idShape) {
                c.click();
                c.checked = true;
              }
            }
          });
        }, 1000);
    }

  configurarLayerParaMerge(layer, atributos, valores, ehEdicao) {
    for (let i = 0; i < atributos.length; i++) {

      const atributo = atributos[i];
      if (atributo != 'id-sig' || atributo != 'camada' ) {
        if (ehEdicao) {
          if (layer.properties) {
            layer.properties[atributo] = valores[i];
          } else {
            layer.properties = {};
            layer.properties[atributo] = valores[i];
          }
        } else {
          if (layer.feature) {
            if (layer.feature.properties) {
              layer.feature.properties[atributo] = valores[i];
            } else {
              layer.feature.properties = {};
              layer.feature.properties[atributo] = valores[i];
            }
          } else {
            if (layer.properties) {
              layer.properties[atributo] = valores[i];
            } else {
              layer.properties = {};
              layer.properties[atributo] = valores[i];
            }
          }
        }
      }
    }
  }

  descelecionarObjetos() {
    let _this = this;
    this.map.eachLayer((layer) => {
      _this.highlightShapeSelecionadoReset(layer);
    });
    this.shapesSelecionadosPorSelecaoArea = [];
    this.objetosSelecionados = [];
    this.objetosSelecionadosMap = new Map();
  }

  descelecionarObjetosSeparados() {
    let _this = this;
    this.map.eachLayer((layer) => {
      _this.highlightShapeSelecionadoSeparadoReset(layer);
    });
    this.shapesSelecionadosPorSelecaoArea = [];
    this.objetosSelecionados = [];
    this.objetosSelecionadosMap = new Map();
  }

  descelecionarObjetosCamada(nomeCamada) {
    const chavesEncontradas = this.keysShapeFiles.filter(chave => chave.camada == nomeCamada);
    if (chavesEncontradas.length > 0) {
      for (const chaveEncontrada of chavesEncontradas) {
        if (this.objetosSelecionados.indexOf(parseInt(chaveEncontrada.key)) > -1) {
          const objeto: any = {};
          objeto.target = chaveEncontrada.layer;
          this.selecionarLayer(objeto);
        }
      }
    }
  }

  selecionarItemDaPlanilha(id) {
    this.selecionarObjetoPorId(id);
  }

  selecionarObjetoPorId(id) {
    const chaveEncontrada = this.keysShapeFiles.filter(chave => chave.key == id);
    if (chaveEncontrada.length > 0) {
      const objeto: any = {};
      objeto.target = chaveEncontrada[0].layer;
      this.selecionarLayer(objeto);
    }
  }

  public validacaoExportacaoShape(){
    if(this.estaLogado) {
     
     this.cadastrarDadosDownload(this.dadosDownload);
     
     this.exportarShapeDaView();
     } else if(localStorage.getItem('dadosDownload')) {
       this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
       
       this.dadosDownload.acao = 'Exportação de Shapefiles';
       this.dadosDownload.pagina = 'Planejamento Integrado';
       this.dadosDownload.arquivo = 'Camadas'
       
       this.cadastrarDadosDownload(this.dadosDownload);
       this.exportarShapeDaView();
     } else {
     const dialogConfig = new MatDialogConfig();
     
     dialogConfig.data = {
       acao: "Exportação de Shapefiles",
       pagina: "Planejamento Integrado",
       arquivo: "Camadas"
     }
     const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);
 
     dialogRef.afterClosed().subscribe(result => {
       if(result != null) {
         this.dadosDownload = result;
                
         this.exportarShapeDaView();
        }
     });
     }
   }

   public validacaoExportacaoAtributos(formatados: any){
    if(this.estaLogado) {
     this.dadosDownload.arquivo = formatados[1][3];
     this.cadastrarDadosDownload(this.dadosDownload);
     this.exportXlsAtributosECentroides(formatados);
     this.configurarTabelaAtributos()
 
     } else if(localStorage.getItem('dadosDownload')) {
       this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
       
       this.dadosDownload.acao = 'Exportação de Atributos e Coordenadas';
       this.dadosDownload.pagina = 'Planejamento Integrado';
       this.dadosDownload.arquivo = formatados[1][3];
       
       this.cadastrarDadosDownload(this.dadosDownload);
       this.exportXlsAtributosECentroides(formatados);
       this.configurarTabelaAtributos()
     } else {
     const dialogConfig = new MatDialogConfig();
     
     dialogConfig.data = {
       acao: "Exportação de Atributos e Coordenadas",
       pagina: "Planejamento Integrado",
       arquivo: formatados[1][3]
     }
     const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);
 
     dialogRef.afterClosed().subscribe(result => {
       if(result != null) {
         this.dadosDownload = result;
                
         this.exportXlsAtributosECentroides(formatados);
         this.configurarTabelaAtributos()
        }
     });
     }
   }
 
   public buscarDadosUsuariosLogadosDownload() {
     this.getUsuarioLogadoDadosExportacaoAtributos();
     this.getUsuarioLogadoDadosExportacaoShape();
   }
 
   public getUsuarioLogadoDadosExportacaoShape(){
     this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
       this.usuario = usuario as Usuario;  
       
     this.dadosDownload.email = usuario.email;
     this.dadosDownload.nome = usuario.nome
     this.dadosDownload.organizacao = usuario.organizacao;
     this.dadosDownload.boletim = usuario.recebeEmail;
     this.dadosDownload.usuario = usuario.id;
     this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
     this.dadosDownload.acao = 'Exportação de Shapefiles';
     this.dadosDownload.pagina = 'Planejamento Integrado';
     this.dadosDownload.arquivo = 'Camadas';    
     });
   }
 
   public getUsuarioLogadoDadosExportacaoAtributos(){
     this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
       this.usuario = usuario as Usuario;  
       
     this.dadosDownload.email = usuario.email;
     this.dadosDownload.nome = usuario.nome
     this.dadosDownload.organizacao = usuario.organizacao;
     this.dadosDownload.boletim = usuario.recebeEmail;
     this.dadosDownload.usuario = usuario.id;
     this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
     this.dadosDownload.acao = 'Exportação de Atributos e Coordenadas';
     this.dadosDownload.pagina = 'Catálogo de Camadas';    
     });
   }
   
 public cadastrarDadosDownload(dados: DadosDownload) {
   this.dadosDownloadService.cadastrarDados(dados).subscribe();
 }


 returnCurrentDate() {
   const currentDate = new Date();
    return currentDate;
 }
}
