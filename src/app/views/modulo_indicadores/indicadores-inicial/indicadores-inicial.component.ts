import { Title } from '@angular/platform-browser';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as L from 'leaflet';
import { latLng, tileLayer, geoJSON, circleMarker } from 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PainelIndicadorCidadeService } from 'src/app/services/painel-indicador-cidade.service';
import { ProvinciaEstadoShapeService } from 'src/app/services/provincia-estado-shape.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';
import { EixoService } from 'src/app/services/eixo.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { Label, Color } from 'ng2-charts';
import { Router, ActivatedRoute } from '@angular/router';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { DownloadslogService } from 'src/app/services/downloadslog.service';
import { Indicador } from 'src/app/model/indicadores';
import { Variavel } from 'src/app/model/variaveis';
import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';
import { VariavelService } from 'src/app/services/variavel.service';

import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';
import { DecimalPipe } from '@angular/common';

import * as chroma from 'chroma-js';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/services/seo-service.service';
import { Observable } from 'rxjs';
import { Estado } from 'src/app/model/PainelIndicadorCidades/estado';
import { map, startWith } from 'rxjs/operators';
import { Console } from 'console';
import { Cidade } from 'src/app/model/cidade';
import { HomeService } from 'src/app/services/home.service';
import { BibliotecaService } from 'src/app/services/bibliotecaService';
import { Home } from 'src/app/model/home';
import { PrimeiraSecao } from 'src/app/model/primeira-secao';
import { SegundaSecao } from 'src/app/model/segunda-secao';
import { TerceiraSecao } from 'src/app/model/terceira-secao';
import { QuartaSecao } from 'src/app/model/quarta-secao';
import { QuintaSecao } from 'src/app/model/quinta-secao';
import { SextaSecao } from 'src/app/model/sexta-secao';
import { SetimaSecao } from 'src/app/model/setima-secao';
import { SecaoLateral } from 'src/app/model/secao-lateral';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { text } from '@angular/core/src/render3';
import { _MatChipListMixinBase } from '@angular/material';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownload } from 'src/app/model/dados-download';

const path =
  'assets/pdf/Referencias-para-indicadores-e-metas_PCS-CEBRAP_2019.pdf';

@Component({
  selector: 'app-indicadores-inicial',
  templateUrl: './indicadores-inicial.component.html',
  styleUrls: ['./indicadores-inicial.component.css']
})
export class IndicadoresInicialComponent implements OnInit {
  public exibirTabela = true;
  public exibirTabelaCidades = false;
  public exibirTabelaIndicadores = false;
  public exibirTabelaCidadesIndicadores = false;
  public exibirTabelaIndicadoresSemMandatos = false;
  public exibirMapa = false;
  public exibirGraficos = false;
  public exibirMetaODS = false;
  public exibirBotaoMapa = false;

  public idEstadoSelecionado;

  public exibirGraficoLinha = true;
  public exibirGraficoBarra = false;
  public exibirGraficoTreemap = false;
  public exibirGraficoDispersao = false;
  public mandatoSelecionadoGrafico: any;
  public dadosGraficos: any;
  public graficoNumerico = false;
  public nomeIndicadorSelecionado;
  public formulaIndicadorSelecionado;
  public formulaIndicadorSelecionadoTreeMap;
  public descricaoIndicadorSelecionado;
  public indicadorSelecionado: Indicador;
  public mostrarBotaoGrafico;
  public mostrarBotaoTreemap = false;

  public resultadoEncontrado = false;
  public filtrado = false;
  public listaCidadesParaMapa = [];

  public resultadoCidades: any[] = [];
  public resultadoIndicadores: any[] = [];

  // Gráfico Interativo
  public anoLabelInterativo = '';
  public listaVariaveis: Array<Variavel> = new Array<Variavel>();
  public listaVariavelPreenchida = [];
  public itensLegendaDispersao =  [];
  public tipoDispersao = false;
  public indicadorDispersao: any = [];

  legendaMapa1: String;
  legendaMapa2: String;
  legendaMapa3: String;
  legendaMapa4: String;
  legendaMapa5: String;

  public listaSigTotal: Array<any>;

  form: FormGroup;
  public formDispersao: FormGroup;
  formFormula: FormGroup;

  map: any;

  mapResultado: any;

  legendaMapResultado: any;

  teste = [];

  markerClusters: any;
  estadosFeatureGroup: any;

  filteredOptionsCidade: Observable<Array<Cidade>>;

  filteredOptions: Observable<Array<Estado>>;

  filteredOptionsIndicador: Observable<Array<{id: string, nome: string, numerico: boolean}>>;
  

  loading = false;

  private baseLayers = {'Mapa': tileLayer(environment.MAP_TILE_SERVER, {
      detectRetina: true,
      attribution: environment.MAP_ATTRIBUTION,
      noWrap: true,
      minZoom: 2
    }),
  };

  private overlays = {
  };

  public options = {
    zoom: 4,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227]),
    layers: [this.baseLayers['Mapa']]
  };

  public optionsResultado = {
    layers: [
      tileLayer(environment.MAP_TILE_SERVER, {
        detectRetina: true,
        attribution: environment.MAP_ATTRIBUTION,
        noWrap: true,
        minZoom: 2
      })
    ],
    zoom: 4,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227])
  };
  layersControlResultado = [];
  listaEstado = [];
  listaCidades = [];
  listaEixos = [];
  listaODS = [];
  listaIndicadores = [];
  listaIndicadoresDispersao = [];
  cidades;
  public listaCompletaCidades = [];

  listaMandatosPreenchidos: any[];
  mandatoSelecionado: any = [];
  indicadorSelecionadoObj: any;
  listaCidadesPreencheramIndicador = [];

  // Configuração Gráficos
  public barChartData: ChartDataSets[] = [];
  public barChartLabels: Label[] = [];
  public barChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
   tooltips: {
      callbacks: {
        title: () => {
          return '';
        },
        label: (tooltipItem, data) => {
          const decimalPipe = new DecimalPipe('pt-BR');
          const valor = decimalPipe.transform(tooltipItem.yLabel);
          return `${data.datasets[tooltipItem.datasetIndex].label} - ${valor} `;
        }
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          callback: (dataLabel, index)=> {
            const decimalPipe = new DecimalPipe('pt-BR');
            //return decimalPipe.transform(dataLabel);
            return dataLabel;
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          callback: (dataLabel, index)=> {
            const decimalPipe = new DecimalPipe('pt-BR');
            return decimalPipe.transform(dataLabel);
          }
        }
      }]
    },
    annotation: {
      annotations: []
    }
  };
  public barChartColors: Color[] = [
    {
      // red
      backgroundColor: '#3e7152',
      borderColor: '#3e7152',
      pointBackgroundColor: '#50926a',
      pointBorderColor: '#356146',
      pointHoverBackgroundColor: '#356146',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public barChartLegend = true;

  odsAux: any;
  metaOdsAux: any;

  lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    tooltips: {
      callbacks: {
        title: () => {
          return '';
        },
        label: (tooltipItem, data) => {
          const decimalPipe = new DecimalPipe('pt-BR');
          const valor = decimalPipe.transform(tooltipItem.yLabel);
          return `${data.datasets[tooltipItem.datasetIndex].label} - ${valor} `;
        }
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          callback: (dataLabel, index)=> {
            const decimalPipe = new DecimalPipe('pt-BR');
            //return decimalPipe.transform(dataLabel);
            return dataLabel
          }
        }
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index)=> {
              const decimalPipe = new DecimalPipe('pt-BR');
              return decimalPipe.transform(dataLabel);
            }
          }
        }
      ]
    },
    annotation: {
      annotations: []
    }
  };
  lineChartColors: Color[] = [
    {
      // red
      borderColor: '#e2431e',
      pointBackgroundColor: '#e2431e',
      pointBorderColor: '#e2431e',
      pointHoverBackgroundColor: '#e2431e',
      pointHoverBorderColor: 'rgba(148,159,177,0.0)',
      pointRadius: 5
    },
    {
      // red
      borderColor: '#6f9654',
      pointBackgroundColor: '#6f9654',
      pointBorderColor: '#6f9654',
      pointHoverBackgroundColor: '#6f9654',
      pointHoverBorderColor: 'rgba(148,159,177,0.0)',
      pointRadius: 5
    },
    {
      // red
      borderColor: '#43459d',
      pointBackgroundColor: '#43459d',
      pointBorderColor: '#43459d',
      pointHoverBackgroundColor: '#43459d',
      pointHoverBorderColor: 'rgba(148,159,177,0.0)',
      pointRadius: 5
    }
  ];

  public lineChartLegend: [
    {
      display: false;
      color: '#43459d';
    }
  ];
  // Bubble CHARTS
  public bubbleChartOptions: ChartOptions = {
    legend: { position: 'top',
              fullWidth: false},
    responsive: true,
    tooltips: {
      callbacks: {
        title: () => {
          return '';
        },
        label: (tooltipItem, data) => {
          const decimalPipe = new DecimalPipe('pt-BR');
          const resultadoIndicador = decimalPipe.transform(tooltipItem.xLabel);
          const resultadoVariavel = decimalPipe.transform(tooltipItem.yLabel);
          if(this.formDispersao.controls.compararComIndicador.value){
            const indicadorDispersao =  this.formDispersao.controls.indicador.value;
            return `${data.datasets[tooltipItem.datasetIndex].label}: ${this.indicadorSelecionado.nome} = ${resultadoIndicador}. ${this.indicadorDispersao.nome} = ${resultadoVariavel}`;
          }
          else{
            return `${data.datasets[tooltipItem.datasetIndex].label}: ${this.indicadorSelecionado.nome} = ${resultadoIndicador}. ${this.variavelSelecionada.nome} = ${resultadoVariavel}`;
          }
        }
      }
    },
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index)=> {
              const decimalPipe = new DecimalPipe('pt-BR');
              //return decimalPipe.transform(dataLabel);
              return dataLabel;
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Resultado do Indicador'
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index)=> {
              const decimalPipe = new DecimalPipe('pt-BR');
              return decimalPipe.transform(dataLabel);
            }
          },
          scaleLabel: {
            display: true,
            labelString: 'Resultado da Variável'
          }
        }

      ]
    }
  };
  public bubbleChartType: ChartType = 'bubble';
  public bubbleChartData: ChartDataSets[] = [];
  public variavelSelecionada: any;

  formAnoMandato: FormGroup;

  scrollUp: any;


  // HOME
  public home: Home = new Home();
  public  paginaBreadCrumb: any;
  public isStatic: boolean = false;

  public todasSecoes: any[] = [];

  public secoes: any[] = [];

  public dadosDownload = new DadosDownload;
  public usuario = new Usuario;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private router: Router,
    private element: ElementRef,
    private painelIndicadorCidadeService: PainelIndicadorCidadeService,
    private indicadoresPreenchidosService: IndicadoresPreenchidosService,
    private shapeService: ProvinciaEstadoShapeService,
    private cidadesService: CidadeService,
    private eixoService: EixoService,
    private indicadoresService: IndicadoresService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private changeDetectorRefs: ChangeDetectorRef,
    private downloadsLogService: DownloadslogService,
    private indicadorService: IndicadoresService,
    private variavelPreenchidaService: VariavelPreenchidaService,
    private variavelService: VariavelService,
    private pcsUtil: PcsUtil,
    private _scrollToService: ScrollToService,
    private titleService: Title,
    private seoService: SeoService,
    private homeService: HomeService,
    private bibliotecaService: BibliotecaService,
    private prefeituraService: PrefeituraService,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);

    this.form = this.formBuilder.group({
      estado: [null],
      cidade: [null],
      populacaoMin: [null],
      populacaoMax: [null],
      indicador: [null],
      eixo: [null],
      ods: [null]
    });

    this.formDispersao = this.formBuilder.group({
      compararComIndicador: true ,
      variavel: [null],
      indicador: [null]
    });

    this.formFormula = this.formBuilder.group({
      formula: [null]
    });

    this.formAnoMandato = this.formBuilder.group({
      anoMandato: [null]
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`Indicadores - Cidades Sustentáveis`);
    const config = {
      title: 'Indicadores - Cidades Sustentáveis',
      description: 'Na gestão pública, os indicadores cumprem um papel fundamental em diversas etapas. Eles ajudam os tomadores de decisão a avaliar adequadamente a realidade, a interpretar os desejos e necessidades da população e a implementar ações que atendam às prioridades estabelecidas',
      image:  `${environment.APP_IMAGEM}indicadores-principal-og.jpg`,
      slug: '',
      site: 'Cidades Sustentáveis' ,
      url: `${environment.APP_URL}indicadores`
    };
    this.seoService.generateTags(config);
    this.populaComboCidades();
    this.populaComboEstados();
    this.carregarDadosMapa();
    this.populaComboEixos();
    //this.populaComboCidades();
    this.populaComboODS();
    this.populaComboIndicador();
    this.carregarVariaveis();

 	this.buscarPaginaHome();
    this.buscarNumeroTotalSignatarias();
  }

  onMapReady(map: L.Map) {
   this.map = map;

  }

  public carregarVariaveis() {
    this.variavelService.carregaVariaveisPCSSimples().subscribe(res => {
      this.listaVariaveis = res;
    });
  }

  public carregarDadosMapa() {
      this.estadosFeatureGroup = L.featureGroup();
      this.cidadesService.calcularNumeroCidadesSignatariasPorEstado().subscribe(numeroSignatariasPorEstado => {
        if (numeroSignatariasPorEstado.length > 0) {
          this.shapeService.buscarPorEstados(numeroSignatariasPorEstado.map(r => r['idEstado'])).subscribe(shapes => {
            shapes.forEach(shape => {
              const quantidadeSignatarias = numeroSignatariasPorEstado.filter( p => p['idEstado'] === shape.estado.idProvinciaEstado)[0]['cidadesParticipantes'];

              const opacity = this.calcularOpacidadeShape(quantidadeSignatarias);
              const color = this.getShapeColor(quantidadeSignatarias);

              const options = {
                color: color,
                weight: 1,
                opacity,
                fillOpacity: opacity
              };

              const geoJson = geoJSON([shape.geometria], options);

              geoJson.on('click', () => {
                this.changeDetectorRefs.detectChanges();
              });

              this.estadosFeatureGroup.addLayer(geoJson);
            });

            this.buscarIndicadoresPreenchidosCidade();

            this.overlays["Estados"]  = this.estadosFeatureGroup;

            this.estadosFeatureGroup.addTo(this.map);

            this.initLayerControl();
          });
        }
      });
  }

  private calcularOpacidadeShape(quantidade: number) {
    const opacidade: number = 0.0;

    if(quantidade == 0) {
      return 0.3;
    }

    if(quantidade > 0 && quantidade < 10) {
      return 0.25;
    }

    if(quantidade >= 10 && quantidade <= 25) {
      return 0.45;
    }

    if(quantidade > 25 && quantidade <= 35) {
      return 0.60;
    }

    if(quantidade > 35 && quantidade <= 45) {
      return 0.80;
    }

    if(quantidade > 45) {
      return 1;
    }

    return opacidade;
  }

  private getShapeColor(quantidade: number) {
    if(quantidade > 0) {
      return "#037000";
    }

    return "#888f88";
  }

  public buscarIndicadoresPreenchidosCidade() {
    this.indicadoresPreenchidosService
      .buscarQtIndicadorPreenchidoPorCidade()
      .subscribe(res => {
        this.cidades = res as any[];

        this.markerClusters = L.markerClusterGroup({
          maxClusterRadius: 40,
          iconCreateFunction: function(cluster) {
            var childCount = cluster.getChildCount();

            var c = " marker-cluster-";

            if (childCount > 0) {
              c += "large";
            }
            return new L.DivIcon({
              html: "<div><span>" + childCount + "</span></div>",
              className: "marker-cluster" + c,
              iconSize: new L.Point(40, 40)
            });
          },
          spiderfyOnMaxZoom: true,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: true
        });


        for (let i = 0; i < this.cidades.length; i++) {
          const cidade = this.cidades[i];
          if (cidade.latitude !== null && cidade.longitude !== null) {
            const marker: circleMarker = circleMarker([cidade.latitude, cidade.longitude], {
              radius: 10,
              fillColor: "red",
              color: "red",
              fillOpacity: 0.7,
              weight: 1
            })

            marker.bindPopup(`<strong>${cidade.cidade}</strong>`);

            marker.on('mouseover', (e) => {
              e.target.openPopup();
            })

            marker.on('mouseout', (e) => {
              e.target.closePopup();
            })

            marker.on('click', () => { this.router.navigate(['/painel-cidade/detalhes/' + cidade.idCidade]); })

            this.markerClusters.addLayer(marker);
          }
        }

        this.overlays["Indicadores"]  = this.markerClusters;

        this.markerClusters.addTo(this.map);

        this.initLayerControl();
      });
  }

  selecionarMandato(nome) {
    for (const mandato of this.listaMandatosPreenchidos) {
      if (mandato.mandato == nome) {
        this.mandatoSelecionado = mandato;
        this.carregarResultadoNoMapa();
        this.mostrarBotaoTreemap =  this.validaTreemap();
      }
    }

    if (
      this.exibirGraficos &&
      this.form.controls.indicador.value &&
      this.graficoNumerico
    ) {
      this.selecionarGrafico(nome);
    }
  }

  selecionarGrafico(nome) {
    for (const grafico of this.dadosGraficos.graficos) {
      if (grafico.mandato == nome) {
        this.mandatoSelecionadoGrafico = grafico;
      }
    }
    this.mostrarBotaoTreemap =  this.validaTreemap();
  }

  public visualizarTabela() {
    this.exibirTabela = true;
    this.exibirMapa = false;
    this.exibirGraficos = false;
    this.triggerScrollTo();
  }

  public visualizarMapa() {
    this.exibirTabela = false;
    this.exibirMapa = true;
    this.exibirGraficos = false;
  }

  public visualizarGrafico() {
    this.exibirTabela = false;
    this.exibirMapa = false;
    if (this.form.controls.indicador.value && this.graficoNumerico) {
      this.exibirGraficos = true;
      this.mostrarBotaoTreemap =  this.validaTreemap();
    }
  }

  /*public populaComboEstadosaa() {
    this.painelIndicadorCidadeService
      .buscarEstadosSignatarios()
      .subscribe(response => {
        this.listaEstado = response;
      });
  }*/

  private _filter(value: string): Array<Estado> {
    if (value && typeof value == "string") {
      const filterValue = value;
      return this.listaEstado.filter(option => option.nome.toLowerCase().includes(filterValue.toLowerCase()));
    } else {
      if(this.listaEstado.length < 50){
        return this.listaEstado.slice(0, this.listaEstado.length)
      } else {
        return this.listaEstado.slice(0, 50);
      }
    }
  }
  

  private _filterCidade(value: string): Array<Cidade> {
    if (value && typeof value == "string" && value != undefined) {
      const filterValue = value;
      return this.listaCidades.filter(option => option.label.toLowerCase().includes(filterValue.toLowerCase()));
    } else {
      if(this.listaCidades.length < 50){
        return this.listaCidades.slice(0, this.listaCidades.length)
      } else {
        return this.listaCidades.slice(0, 50);
      }
    }
  }

  private _filterIndicador(value: string): Array<{id: string, nome: string, numerico: boolean}> {
    if (value && typeof value == "string" && value != undefined) {
      const filterValue = value;
      return this.listaIndicadores.filter(option => option.nome.toLowerCase().includes(filterValue.toLowerCase()));
    } else {
        return this.listaIndicadores.slice(0, this.listaIndicadores.length)
     
    }
  }


  populaComboEstados() {
    this.painelIndicadorCidadeService
    .buscarEstadosSignatarios().subscribe((dados) => {
      this.listaEstado = dados;
      this.filteredOptions = this.form.controls.estado.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
    });
  }

  getLabel(estadoId: {cidades: Array<string>, id: string, nome: string, pais: string, populacao: string, sigla: string}){
    if(this.listaEstado.find(x => x.id == estadoId.id) !=null && this.listaEstado.find(x => x.id == estadoId.id) != undefined){
      return this.listaEstado.find(x => x.id == estadoId.id).nome;
    }else{
      return "";
    }
  }

  getLabelCidade(cidadeId: {id:string, label:string}){
    if(this.listaCidades.find(x => x.id == cidadeId.id) !=null && this.listaCidades.find(x => x.id == cidadeId.id) != undefined){
      return this.listaCidades.find(x => x.id == cidadeId.id).label;
    }else{
      return "";
    }
  }

  getLabelIndicador(indicadorId: string){
    if(this.listaIndicadores.find(x => x.id == indicadorId) !=null && this.listaIndicadores.find(x => x.id == indicadorId) != undefined){
      return this.listaIndicadores.find(x => x.id == indicadorId).nome;
    }else{
      return "";
    }
  }

  public populaComboCidades() {
    this.cidadeService
      .buscarCidadesSignatariasParaCombo()
      .subscribe(response => {
        this.listaCompletaCidades = response;
        this.listaCidades = response;
        this.filteredOptionsCidade = this.form.controls.cidade.valueChanges.pipe(startWith(''), map(value => this._filterCidade(value)));
      });
  }

  public populaComboEixos() {
    this.eixoService.buscarEixosParaCombo(true).subscribe(response => {
      this.listaEixos = response;
    });
  }

  public populaComboODS() {
    this.odsService.buscarOdsParaCombo().subscribe(response => {
      this.listaODS = response;
    });
  }

  public populaComboIndicador() {
    this.indicadorService
      .buscarIndicadoresPcsParaCombo()
      .subscribe(response => {
        this.listaIndicadores = response;
        this.filteredOptionsIndicador = this.form.controls.indicador.valueChanges.pipe(startWith(''), map(value => this._filterIndicador(value)));
        this.listaIndicadoresDispersao = response;
      });
  }

  limparTudo(){
    this.resultadoCidades = [];
    this.indicadorSelecionadoObj = null;
    this.odsAux = '';
    this.metaOdsAux = '';
    this.listaMandatosPreenchidos = [];
    this.mandatoSelecionado = [];
    this.bubbleChartData = [];
    this.barChartData = [];
    this.dadosGraficos = null;
  }

  filtrar() {
    this.limparTudo();
    this.filtrado = true;
    this.visualizarTabela();
    const idIndicador = this.form.controls.indicador.value;

    this.exibirBotaoMapa = this.form.controls.indicador.value ? true : false;
    if (!this.form.controls.indicador.value && !this.form.controls.cidade.value
      && !this.form.controls.estado.value && (this.form.controls.eixo.value || this.form.controls.ods.value)) {
      this.loading = true;
      this.indicadorService.filtrarIndicadoresInicial(this.form.controls.eixo.value, this.form.controls.ods.value).subscribe(res => {
          this.verificaResultadoEncontrado(res);
          this.resultadoIndicadores = res;
          this.listaMandatosPreenchidos = null;
          this.verificarExibicaoDeTabelas();
          this.carregarResultadoNoMapa();
          this.mostrarBotaoGrafico = false;
          this.exibirMetaODS = false;
          this.loading = false;
        });

    } else if (!this.form.controls.indicador.value && !this.form.controls.cidade.value) {
      this.loading = true;
      this.indicadoresPreenchidosService
        .filtrarCidadesPaginaInicialIndicadores(
          this.idEstadoSelecionado,
          this.form.controls.populacaoMin.value,
          this.form.controls.populacaoMax.value,
          this.form.controls.eixo.value,
          this.form.controls.ods.value
        )
        .subscribe(res => {
          this.verificaResultadoEncontrado(res);
          this.resultadoCidades = res;
          this.listaMandatosPreenchidos = null;
          this.verificarExibicaoDeTabelas();
          this.carregarResultadoNoMapa();
          this.mostrarBotaoGrafico = false;
          this.exibirMetaODS = false;
          this.loading = false;
        });

      if (idIndicador) {
        this.indicadoresService.buscarIndicadorSimplesId(idIndicador).subscribe(res => {
          this.indicadorSelecionadoObj = res;
          this.odsAux = `${this.indicadorSelecionadoObj.numeroODS} - ${this.indicadorSelecionadoObj.nomeODS}`;
          this.metaOdsAux = `${this.indicadorSelecionadoObj.numeroMeta} - ${this.indicadorSelecionadoObj.descricaoMeta}`;

          this.triggerScrollTo();
        });
      }

    } else {
      const idCidade = this.form.controls.cidade.value != null && this.form.controls.cidade.value !== undefined ? this.form.controls.cidade.value.id : null;
      this.loading = true;
      this.indicadoresPreenchidosService
        .filtrarIndicadoresPaginaInicialIndicadores(
          this.idEstadoSelecionado,
          idCidade,
          this.form.controls.populacaoMin.value,
          this.form.controls.populacaoMax.value,
          this.form.controls.eixo.value,
          this.form.controls.ods.value,
          this.form.controls.indicador.value
        )
        .subscribe(res => {
          this.verificaResultadoEncontrado(res);
          this.listaMandatosPreenchidos = res;
          for (const mandato of this.listaMandatosPreenchidos) {
            this.mandatoSelecionado = mandato;
           
          }
          this.verificarExibicaoDeTabelas();
          this.carregarResultadoNoMapa();
          this.carregarResultadoGraficos(0);
          this.loading = false;
        });

      if (this.form.controls.indicador.value) {
        this.loading = true;
        this.indicadorService
          .buscarIndicadorPorIdJoinMetaOds(this.form.controls.indicador.value)
          .subscribe(res => {
            this.indicadorSelecionado = res;

            this.triggerScrollTo();
            this.loading = false;
          });
      }

      if (idIndicador) {
        this.loading = true;
        this.indicadoresService.buscarIndicadorSimplesId(idIndicador)
          .subscribe(res => {
            this.indicadorSelecionadoObj = res;
            this.graficoNumerico = res.numerico;
            this.nomeIndicadorSelecionado = this.indicadorSelecionadoObj.nome;
            this.formulaIndicadorSelecionado = this.indicadorSelecionadoObj.formula;
            this.formulaIndicadorSelecionadoTreeMap = this.indicadorSelecionadoObj.formula.split('<br>');
            this.formFormula.controls.formula.setValue(0);
            this.descricaoIndicadorSelecionado = this.indicadorSelecionadoObj.descricaoIndicador;

            if (this.indicadorSelecionadoObj.numeroODS != null && this.indicadorSelecionadoObj.nomeODS != null) {
              this.odsAux = `${this.indicadorSelecionadoObj.numeroODS} - ${this.indicadorSelecionadoObj.nomeODS}`;
            } else {
              this.odsAux = '';
            }

            if (this.indicadorSelecionadoObj.numeroMeta != null && this.indicadorSelecionadoObj.descricaoMeta != null) {
              this.metaOdsAux = `${this.indicadorSelecionadoObj.numeroMeta} - ${this.indicadorSelecionadoObj.descricaoMeta}`;
            } else {
              this.metaOdsAux = '';
            }
            this.triggerScrollTo();
            this.loading = false;
          });
      }

      this.exibirMetaODS = true;
    }
  }

  public remover_acentos_espaco(str: string) {
    const normalized = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const normalizeSpaces = normalized.replace(/\s/g, '-')
    return normalizeSpaces.toLowerCase();
}

  gerarURLDetalheIndicador(idIndicador, siglaEstado, nomeCidade) {

    let nomeCidadeTratato = this.remover_acentos_espaco(nomeCidade)

    const url = `/indicador/${idIndicador}/${siglaEstado}/${nomeCidadeTratato}`.toLowerCase();

    return url;
  }

  public onMapResultadoReady(map: L.Map) {
    this.mapResultado = map;
  }

  public carregarResultadoNoMapa() {
    this.layersControlResultado = [];
    const idCidade = this.form.controls.cidade.value != null && this.form.controls.cidade.value !== undefined ? this.form.controls.cidade.value.id : null;
    this.indicadoresPreenchidosService
      .filtrarMapaResultadoPaginaInicialIndicadores(
        this.idEstadoSelecionado,
        idCidade,
        this.form.controls.populacaoMin.value,
        this.form.controls.populacaoMax.value,
        this.form.controls.eixo.value,
        this.form.controls.ods.value,
        this.form.controls.indicador.value,
        this.mandatoSelecionado.anoInicial
      )
      .subscribe(res => {
        res = res.filter((i) => isFinite(i.resultado));
        let values = res.map((i) => i.resultado);

        if(values.length > 0) {
          let classes = this.pcsUtil.gerarClassesSerieNumerica(values);

          let classesTemp = classes.slice()

          /*
            ORDEM DE CLASSIFICAÇÃO:
              MAIOR VALOR, MELHOR = 1
              MENOR VALOR, MELHOR = 2
          */
          let item = values[0];

          let colorRange = ['#ffde5c', '#c90300']

          if(item.ordemClassificacao === 1) {
            colorRange.reverse();
          }

          let generateColor = chroma.scale(colorRange).domain(classesTemp, classesTemp.length, 'quantiles');

          this.gerarLegendaMapaResultado(classesTemp, generateColor);

          for (const item of res) {
            let resultado: any = 0;

            if(Number(item.resultado)) {
              resultado = Number(item.resultado).toFixed(2);
            } else {
              resultado = item.resultado;
            }

            this.layersControlResultado.push(
              circleMarker([item.latitude, item.longitude], {
                radius: 10,
                fillColor: generateColor(item.resultado),
                color: '#ffffff',
                fillOpacity: 1,
                weight: 0.3
              }).bindPopup(`<strong>${item.nomeCidade}</strong>
                            </br>
                            <p><strong>Valor:</strong> ${resultado}</p>`)
            );
            this.triggerScrollTo();
          }
        } else {
          this.removerLegendaMapaResultado();
        }
      });
  }

  public carregarResultadoNoMapaPorAno(ano: number) {
    this.layersControlResultado = [];
    const idCidade = this.form.controls.cidade.value != null && this.form.controls.cidade.value !== undefined ? this.form.controls.cidade.value.id : null;
    this.indicadoresPreenchidosService.filtrarMapaResultadoPaginaInicialIndicadores(
        this.idEstadoSelecionado,
        idCidade,
        this.form.controls.populacaoMin.value,
        this.form.controls.populacaoMax.value,
        this.form.controls.eixo.value,
        this.form.controls.ods.value,
        this.form.controls.indicador.value,
        ano
      ).subscribe(res => {
        res = res.filter((i) => isFinite(i.resultado));
        let values = res.map((i) => i.resultado);

        if (values.length > 0) {
          let classes = this.pcsUtil.gerarClassesSerieNumerica(values);

          let classesTemp = classes.slice()

          let item = values[0];

          let colorRange = ['#ffde5c', '#c90300']

          /*
            ORDEM DE CLASSIFICAÇÃO:
              MAIOR VALOR, MELHOR = 1
              MENOR VALOR, MELHOR = 2
          */
          if (item.ordemClassificacao === 1) {
            colorRange.reverse();
          }

          let generateColor = chroma.scale(colorRange).domain(classesTemp, classesTemp.length, 'quantiles');

          this.gerarLegendaMapaResultado(classesTemp, generateColor);

          for (const item of res) {
            let resultado: any = 0;

            if (Number(item.resultado)) {
              resultado = Number(item.resultado).toFixed(2);
            } else {
              resultado = item.resultado;
            }

            this.layersControlResultado.push(
              circleMarker([item.latitude, item.longitude], {
                radius: 10,
                fillColor: generateColor(item.resultado),
                color: '#ffffff',
                fillOpacity: 1,
                weight: 0.3
              }).bindPopup(`<strong>${item.nomeCidade}</strong>
                          </br>
                          <p><strong>Valor:</strong> ${resultado}</p>`)
            );
          }
        } else {
          this.removerLegendaMapaResultado();
        }
      });
  }

  public gerarLegendaMapaResultado(classes: any[], generateColor) {
    if (window.innerWidth > 1399) {
      this.removerLegendaMapaResultado();

      this.legendaMapResultado = new (L.Control.extend({
        options: { position: "bottomleft" }
      }))();

      this.legendaMapResultado.onAdd = (map) => {
        const div = L.DomUtil.create("div", "info legend");
        let labels = [];

        for(let clazz of classes) {
          let color = generateColor(clazz);
          clazz = Number(clazz).toFixed(2);

          labels.push(
            `<div style='width:240px;'><i style='width:18px;height:18px; background:${color}; opacity:1'></i> ${clazz}</div>`
          );
        }

        div.innerHTML = labels.join("<br>");

        return div;
      };

      this.mapResultado.addControl(this.legendaMapResultado);
    }
  }

  public removerLegendaMapaResultado() {
    if(this.legendaMapResultado) {
      this.mapResultado.removeControl(this.legendaMapResultado);
    }
  }

  public carregarResultadoGraficos(formulaSelecionadaIndex) {
    this.mostrarBotaoGrafico = false;
    const idIndicador = this.form.controls.indicador.value;

    if (this.form.controls.indicador.value && this.graficoNumerico) {
      this.layersControlResultado = [];
      const idCidadeSelecionada = this.form.controls.cidade.value != null && this.form.controls.cidade.value !== undefined ? this.form.controls.cidade.value.id : null;
      this.indicadoresPreenchidosService
        .buscarPreenchidosGrafico(idIndicador, idCidadeSelecionada, formulaSelecionadaIndex)
        .subscribe(
          res => {
            const dados: any = res;
            for (let i = 0; i < dados.graficos.length; i++) {
              const valores = dados.graficos[i].valores;
              dados.graficos[i].dataset = this.getDataSet(valores);
            }
            this.dadosGraficos = dados;
            for (const grafico of this.dadosGraficos.graficos) {
              if (!this.mandatoSelecionadoGrafico) {
                this.mandatoSelecionadoGrafico = this.dadosGraficos.graficos[this.dadosGraficos.graficos.length - 1];
              }
              if (grafico.mandato === this.mandatoSelecionadoGrafico.mandato) {
                this.mandatoSelecionadoGrafico = grafico;
              }
            }

            this.mostrarBotaoGrafico =
              this.graficoNumerico && this.mandatoSelecionadoGrafico;

            this.mostrarBotaoTreemap =  this.validaTreemap();

            this.triggerScrollTo();
          },
          error => {
            this.mostrarBotaoGrafico = false;
          }
        );
    }
  }

  getDataSet(valores) {
    const chartData: ChartDataSets[] = [];
    for (let i = 0; i < valores.length; i++) {
      const cor = this.geraCor();
      chartData.push({
        data: valores[i] ? valores[i].valor : null,
        label: valores[i] ? valores[i].label : null,
        fill: false,
        backgroundColor: cor,
        borderColor: cor,
        pointBackgroundColor: cor,
        pointHoverBackgroundColor: cor,
        pointHoverBorderColor: cor,
        pointBorderColor: cor,
        hoverBackgroundColor: cor,
        hoverBorderColor: cor,
      });
    }
    return chartData;
  }

  public selecionarIndicador(id) {
    this.graficoNumerico = false;
    for (const i of this.listaIndicadores) {
      if (i.id == id) {
        this.nomeIndicadorSelecionado = i.nome;
      }
    }
  }

  public selecionarGraficoLinha() {
    this.exibirGraficoLinha = true;
    this.exibirGraficoBarra = false;
    this.exibirGraficoTreemap = false;
    this.exibirGraficoDispersao = false;
  }

  public selecionarGraficoBarra() {
    this.exibirGraficoLinha = false;
    this.exibirGraficoBarra = true;
    this.exibirGraficoTreemap = false;
    this.exibirGraficoDispersao = false;
  }

  public selecionarGraficoTreemap() {
    this.exibirGraficoLinha = false;
    this.exibirGraficoBarra = false;
    this.exibirGraficoTreemap = true;
    this.exibirGraficoDispersao = false;
  }
  public selecionarDispersaoAnimada() {
    this.exibirGraficoLinha = false;
    this.exibirGraficoBarra = false;
    this.exibirGraficoTreemap = false;
    this.exibirGraficoDispersao = true;
  }

  private verificarExibicaoDeTabelas() {
    if (
      !this.form.controls.indicador.value &&
      !this.form.controls.cidade.value &&
      this.resultadoCidades.length > 0
    ) {
      this.exibirTabelaCidades = true;
      this.exibirTabelaIndicadores = false;
      this.exibirTabelaCidadesIndicadores = false;
      this.exibirTabelaIndicadoresSemMandatos = false;
    } else if (
      this.form.controls.indicador.value &&
      !this.form.controls.cidade.value &&
      this.listaMandatosPreenchidos != null &&
      this.listaMandatosPreenchidos.length > 0
    ) {
      this.exibirTabelaCidades = false;
      this.exibirTabelaIndicadores = false;
      this.exibirTabelaCidadesIndicadores = true;
      this.exibirTabelaIndicadoresSemMandatos = false;
    } else if (
      this.form.controls.cidade.value &&
      this.listaMandatosPreenchidos != null &&
      this.listaMandatosPreenchidos.length > 0
    ) {
      this.exibirTabelaCidades = false;
      this.exibirTabelaIndicadores = true;
      this.exibirTabelaCidadesIndicadores = false;
      this.exibirTabelaIndicadoresSemMandatos = false;
    } else {
      this.exibirTabelaCidades = false;
      this.exibirTabelaIndicadores = false;
      this.exibirTabelaCidadesIndicadores = false;
      this.exibirTabelaIndicadoresSemMandatos = true;
    }
  }

  private verificaResultadoEncontrado(res: any) {
    if (res != null && res !== undefined && res.length > 0) {
      this.resultadoEncontrado = true;
    } else {
      this.resultadoEncontrado = false;
    }
  }

  fileDownloadReferencias() {
    window.open(path);
    this.downloadsLogService
      .registrarLogDownload(
        'Referencias-para-indicadores-e-metas_PCS-CEBRAP_2019.pdf'
      )
      .subscribe(() => {});
  }

  inputEstadoVazio(){
    if(!this.form.controls.estado.value){
      this.listaCidades = this.listaCompletaCidades;
      this.filteredOptionsCidade = this.form.controls.cidade.valueChanges.pipe(startWith(''), map(value => this._filterCidade(value)));
    }
  }

  filtrarCidadesPorEstado(estadoSelecionado: any) {
    if (estadoSelecionado == '') {
      this.listaCidades = this.listaCompletaCidades;
    } else {
      this.idEstadoSelecionado = estadoSelecionado.id;
      this.form.controls.cidade.setValue('');
      const listaFiltrada = [];
      this.listaCompletaCidades.forEach(cidade => {
        if (cidade.label.includes('- ' + estadoSelecionado.sigla)) {
          listaFiltrada.push(cidade);
        }
      });
      this.listaCidades = listaFiltrada;
      this.filteredOptionsCidade = this.form.controls.cidade.valueChanges.pipe(startWith(''), map(value => this._filterCidade(value)));
    }

  }

  public limparFiltro() {
    this.form.controls.estado.setValue('');
    this.form.controls.cidade.setValue('');
    this.form.controls.populacaoMin.setValue('');
    this.form.controls.populacaoMax.setValue('');
    this.form.controls.indicador.setValue('');
    this.form.controls.eixo.setValue('');
    this.form.controls.ods.setValue('');
    this.idEstadoSelecionado = null;
    this.listaCidades = this.listaCompletaCidades;
  }

  async executarDispersaoAnimadaBubble() {
    this.variavelSelecionada = this.formDispersao.controls.variavel.value;
    this.indicadorDispersao = this.formDispersao.controls.indicador.value;
    this.bubbleChartData = [];
    if(this.formDispersao.controls.compararComIndicador.value){
      this.bubbleChartOptions.scales.yAxes[0].scaleLabel.labelString = this.indicadorDispersao.nome;
    } else {
      this.bubbleChartOptions.scales.yAxes[0].scaleLabel.labelString = this.variavelSelecionada.nome;
    }
    this.bubbleChartOptions.scales.xAxes[0].scaleLabel.labelString =
     `${this.indicadorSelecionado.nome} - ${this.indicadorSelecionado.descricao}`;

    const cidadeEscolhida = this.form.controls.cidade.value != null && this.form.controls.cidade.value !== undefined ? this.form.controls.cidade.value.id : null;
    if( this.formDispersao.controls.compararComIndicador.value ) {
      this.indicadoresPreenchidosService
      .buscarIndicadoresPreenchidosSimples(this.indicadorDispersao.id, cidadeEscolhida)
      .subscribe(async res => {
        const listaIndicadorPreenchido = res;

        this.bubbleChartData = [];
        for (const nomeCidade of this.dadosGraficos.cidadesDispersaoAnimada) {
          const cor = this.geraCor();
          this.bubbleChartData.push({
              data: [{}],
              label: nomeCidade,
              backgroundColor: cor,
              borderColor: cor,
            });
        }

        for (const ano of this.dadosGraficos.labelsDispersaoAnimada) {
          this.itensLegendaDispersao = [];
          let anoEncontrado = false;
          this.anoLabelInterativo = ano;
          for (const registro of this.dadosGraficos.dispersao) {
            if (ano == registro.ano) {
              let indicadorPreenchido = null;
              for (let i = 0 ; i < listaIndicadorPreenchido.length; i++) {
                const ip = listaIndicadorPreenchido[i];
                if (ano == ip.ano && ip.idCidade == registro.idCidade) {
                  indicadorPreenchido = ip;
                  listaIndicadorPreenchido.splice(i, 1);
                  break;
                }
              }
              if ( indicadorPreenchido ) {
                let raio = null;
                raio = this.calculaRaioProporcional(registro.populacaocidade);
                for (const chartData of this.bubbleChartData) {
                  if (registro.cidade == chartData.label) {
                    const valor = registro.valor;
                    const valorNumerico = Number(valor);
                    const c = [
                      {
                        x: valorNumerico,
                        y: indicadorPreenchido.resultado,
                        r: raio
                      }
                    ];
                    chartData.data = c;
                    anoEncontrado = true;
                  }
                }
              } else {
                for (const chartData of this.bubbleChartData) {
                  if (registro.cidade == chartData.label) {
                    const c = [{}];
                    chartData.data = c;
                    break;
                  }
                }
              }
            }
          }
          const data : any = this.bubbleChartData;
          data.sort((a,b) => a.data[0].r - b.data[0].r);
          this.bubbleChartData = data;

          for (const item of this.bubbleChartData) {
            const it: any = item.data[0];
            if (it.x) {
              this.itensLegendaDispersao.push(item);
            }
          }

          if (anoEncontrado) {
            await this.delay(3000);
          }

        }
      });
    } else {
      this.variavelPreenchidaService
        .buscarVariaveisPreenchidas(this.variavelSelecionada.id, cidadeEscolhida)
        .subscribe(async res => {
          this.listaVariavelPreenchida = res;

          this.bubbleChartData = [];
          for (const nomeCidade of this.dadosGraficos.cidadesDispersaoAnimada) {
            const cor = this.geraCor();
            this.bubbleChartData.push({
                data: [{}],
                label: nomeCidade,
                backgroundColor: cor,
                borderColor: cor,
              });
          }

          for (const ano of this.dadosGraficos.labelsDispersaoAnimada) {
            this.itensLegendaDispersao = [];
            let anoEncontrado = false;
            this.anoLabelInterativo = ano;
            for (const registro of this.dadosGraficos.dispersao) {
              if (ano == registro.ano) {
                let variavelPreenchida = null;
                for (let i = 0 ; i < this.listaVariavelPreenchida.length; i++) {
                  const vp = this.listaVariavelPreenchida[i];
                  if (ano == vp.ano && vp.idCidade == registro.idCidade) {
                    variavelPreenchida = vp;
                    this.listaVariavelPreenchida.splice(i, 1);
                    break;
                  }
                }
                if ( variavelPreenchida ) {
                  let raio = null;
                  raio = this.calculaRaioProporcional(registro.populacaocidade);
                  for (const chartData of this.bubbleChartData) {
                    if (registro.cidade == chartData.label) {
                      const valor = registro.valor;
                      const valorNumerico = Number(valor);
                      const c = [
                        {
                          x: valorNumerico,
                          y: variavelPreenchida.valor,
                          r: raio
                        }
                      ];
                      chartData.data = c;
                      anoEncontrado = true;
                    }
                  }
                } else {
                  for (const chartData of this.bubbleChartData) {
                    if (registro.cidade == chartData.label) {
                      const c = [{}];
                      chartData.data = c;
                      break;
                    }
                  }
                }
              }
            }
            const data : any = this.bubbleChartData;
            data.sort((a,b) => a.data[0].r - b.data[0].r);
            this.bubbleChartData = data;

            for (const item of this.bubbleChartData) {
              const it: any = item.data[0];
              if (it.x) {
                this.itensLegendaDispersao.push(item);
              }
            }

            if (anoEncontrado) {
              await this.delay(3000);
            }

          }
        });

    }

  }

  calculaRaioProporcional(popCidade) {
    let raioCalculado = 0;
    if ( popCidade < 20000 ) {
      raioCalculado = 5;
    }
    if ( popCidade >= 20000 && popCidade < 50000  ) {
      raioCalculado = 10;
    }
    if ( popCidade >= 50000 && popCidade < 100000  ) {
      raioCalculado = 10;
    }
    if ( popCidade >= 100000 && popCidade < 250000  ) {
      raioCalculado = 15;
    }
    if ( popCidade >= 250000 && popCidade < 500000  ) {
      raioCalculado = 20;
    }
    if ( popCidade >= 500000 && popCidade < 1000000) {
      raioCalculado = 25;
    }
    if ( popCidade >= 1000000 && popCidade < 1000000) {
      raioCalculado = 30;
    }
    if ( popCidade >= 1000000  && popCidade < 3500000) {
      raioCalculado = 35;
    }
    if ( popCidade >= 3500000  ) {
      raioCalculado = 40;
    }
    return raioCalculado;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private geraCor() {
    const hexadecimais = '0123456789ABCDEF';
    let cor = '#';

    // Pega um número aleatório no array acima
    for (let i = 0; i < 6; i++ ) {
    // E concatena à variável cor
        cor += hexadecimais[Math.floor(Math.random() * 16)];
    }
    return cor;
  }

  public triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      target: 'destination'
    };
    this._scrollToService.scrollTo(config);
  }

  public validaTreemap(): boolean {
    if (this.mandatoSelecionadoGrafico && this.mandatoSelecionadoGrafico.treeMap != null && this.mandatoSelecionadoGrafico.treeMap.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  public filtrarPorFormula(posicaoFormula: any) {
    this.carregarResultadoGraficos(posicaoFormula);
  }

  escolherAnoMandato() {
    this.carregarResultadoNoMapaPorAno(this.formAnoMandato.controls.anoMandato.value);
  }


  private initLayerControl() {

    if (this.overlays['Estados'] && this.overlays['Indicadores']) {
      this.overlays['Indicadores'].bringToFront();

      this.map.on('overlayadd', function (eventLayer) {
        if (eventLayer.name === 'Estados') {
          eventLayer.layer.bringToBack();
        }
      });
    }
  }

  private async buscarPaginaHome() {
    await this.route.params.subscribe(
      async params => {
        const link = 'indicadores';
        this.paginaBreadCrumb = link;
        if (this.paginaBreadCrumb != null && this.paginaBreadCrumb != '') {
          this.isStatic = true;
        } else {
          this.isStatic = false;
        }
        if (link) {
          this.loading = true;
          await this.homeService
            .buscarIdsPaginaHomePorLink(link)
            .subscribe(
              async response => {
                this.home = response as Home;

                if (this.home && this.home.id) {
                  this.buscarListaImagensGaleriaPorId(this.home.id);
                }

                if (this.home.homeBarra && this.home.homeBarra.id) {
                  this.buscarHomeBarraPorId(this.home.homeBarra.id);
                }

                this.todasSecoes = [];

                this.buscarPrimeiraSecaoPorId(this.home.id);

                this.buscarSegundaSecaoPorId(this.home.id);

                this.buscarTerceiraSecaoPorId(this.home.id);

                this.buscarQuartaSecaoPorId(this.home.id);

                this.buscarQuintaSecaoPorId(this.home.id);

                this.buscarSextaSecaoPorId(this.home.id);

                this.buscarSetimaSecaoPorId(this.home.id);

                this.buscarSecaoLateralPorId(this.home.id);

                this.getUsuarioLogadoDadosDownload();

                this.loading = false;
              },
              error => {
                this.router.navigate(["/"]);
              }
            );
        }
        this.loading = false;
      },
      error => {
        this.router.navigate(["/"]);
      }
    );
  }
  private async buscarListaImagensGaleriaPorId(id: number) {
    await this.homeService.buscarTodasSemConteudoPorIdHome(id).subscribe(response => {
      this.home.galeriaDeImagens = response;
      const config = {
        title: this.home.titulo,
        description: `${this.home.galeriaDeImagens[0].titulo} - ${this.home.galeriaDeImagens[0].subtitulo}`,
        twitterImage: `${environment.APP_URL}home/imagem/` + this.home.galeriaDeImagens[0].id,
        image:  `${environment.APP_URL}home/imagem/` + this.home.galeriaDeImagens[0].id,
        slug: '',
        site: 'Cidades Sustentáveis' ,
        url: `${environment.APP_URL}inicial/${this.home.link_pagina}`,
      };
      this.seoService.generateTags(config);
      this.home.galeriaDeImagens.forEach(homeImagem => {
        if (homeImagem.exibirBusca) {
          // this.carregarCombos();
        }
      });
    });
  }

  private async buscarHomeBarraPorId(id: number) {
      await this.homeService.buscarHomeBarraPorId(id).subscribe(response => {
        this.home.homeBarra = response;
      });
  }

  private async buscarPrimeiraSecaoPorId(id: number) {
      await this.homeService.buscarPrimeiraSecaoPorId(id).subscribe(response => {
        this.home.listaPrimeiraSecao = response as PrimeiraSecao[];
        if (this.home.listaPrimeiraSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.home.listaPrimeiraSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
      });
  }

  private async buscarSegundaSecaoPorId(id: number) {
      await this.homeService.buscarSegundaSecaoPorId(id).subscribe(response => {
        this.home.listaSegundaSecao = response as SegundaSecao[];
        if (this.home.listaSegundaSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.home.listaSegundaSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
      });
  }

  private async buscarTerceiraSecaoPorId(id: number) {
      await this.homeService.buscarTerceiraSecaoPorId(id).subscribe(response => {
        this.home.listaTerceiraSecao = response as TerceiraSecao[];
        if (this.home.listaTerceiraSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.home.listaTerceiraSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
      });
  }

  private async buscarQuartaSecaoPorId(id: number) {
      await this.homeService.buscarQuartaSecaoPorId(id).subscribe(response => {
        this.home.listaQuartaSecao = response as QuartaSecao[];
        if (this.home.listaQuartaSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.home.listaQuartaSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
      });
  }

  private async buscarQuintaSecaoPorId(id: number) {
      await this.homeService.buscarQuintaSecaoPorId(id).subscribe(response => {
        this.home.listaQuintaSecao = response as QuintaSecao[];
        if (this.home.listaQuintaSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.home.listaQuintaSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
      });
  }

  private async buscarSextaSecaoPorId(id: number) {
    await this.homeService.buscarSextaSecaoPorId(id).subscribe(response => {
      this.home.listaSextaSecao = response as SextaSecao[];
      if (this.home.listaSextaSecao) {
        this.todasSecoes = [...this.todasSecoes, ...this.home.listaSextaSecao];
        this.ordernarPorIndiceTodasSecoes();
      }
    });
}

private async buscarSetimaSecaoPorId(id: number) {
  await this.homeService.buscarSetimaSecaoPorId(id).subscribe(response => {
    this.home.listaSetimaSecao = response as SetimaSecao[];
    if (this.home.listaSetimaSecao) {
      this.todasSecoes = [...this.todasSecoes, ...this.home.listaSetimaSecao];
      this.ordernarPorIndiceTodasSecoes();
    }
  });
}

  private async buscarSecaoLateralPorId(id: number) {
      await this.homeService.buscarSecaoLateralPorId(id).subscribe(response => {
        this.home.listaSecaoLateral = response as SecaoLateral[];
      });
  }


  public verificaLinkAtivo(itemLink: string): string {
    let cor: string = "";
    this.route.params.subscribe(
      async params => {
        if (itemLink === params.pagina) {
          cor = "bold";
        }
      },
      error => {}
    );
    return cor;
  }



  public getImagePath(id: number): string {
    if (id == null) {
      return "/";
    }

    return `${environment.API_URL}home/imagem/` + id;
  }

  private ordernarPorIndiceTodasSecoes() {
    this.todasSecoes.sort((n1, n2) => {
      if (n1.indice > n2.indice) {
          return 1;
      }
      if (n1.indice < n2.indice) {
          return -1;
      }
      return 0;
    });
  }


  public buscarNumeroTotalSignatarias(){
    this.prefeituraService.buscarPrefeiturasSignatarias().subscribe(res => {
      this.listaSigTotal = res as any[];
      this.geraValoresLegenda(this.listaSigTotal);
    });
  }

  public geraValoresLegenda(totalSig: Array<any>){
    
    if (totalSig.length > 0){

    let numLegenda = totalSig.length / 5;

    let legenda1Aux, legenda2Aux, legenda3Aux, legenda4Aux;

    legenda1Aux = numLegenda;
    legenda2Aux = (legenda1Aux + numLegenda) + 1;
    legenda3Aux = (legenda2Aux + numLegenda) + 1;
    legenda4Aux = (legenda3Aux + numLegenda) + 1;
    
    Math.round(legenda1Aux);
    Math.round(legenda2Aux);
    Math.round(legenda3Aux);
    Math.round(legenda4Aux);
 
     this.legendaMapa1 = `de 1 até ${legenda1Aux.toFixed()}`;
     this.legendaMapa2 = `de ${Math.round(legenda1Aux) + 1} até ${legenda2Aux.toFixed()}`;
     this.legendaMapa3 = `de ${Math.round(legenda2Aux) + 1} até ${legenda3Aux.toFixed()}`;
     this.legendaMapa4 = `de ${Math.round(legenda3Aux) + 1} até ${legenda4Aux.toFixed()}`;
     this.legendaMapa5 = `acima de ${Math.round(legenda4Aux)}`;

     this.carregarLegendas();
    } else {
      this.carregarLegendasVazia();
    }
   }
   
  public carregarLegendas(){

    const legenda = new (L.Control.extend({
      options: { position: "bottomright" }
    }))();

    let _this = this;
    legenda.onAdd = function () {
    
      const div = L.DomUtil.create("div", "info legend"),
        labels = [];

      labels.push(
        '<div><b>Cidades signatárias</b></div>'
      );
      labels.push(
        '<div><i style="width: 18px; height: 18px; background: #888f88; opacity: 0.3"></i>nenhuma cidade signatária</div>'
        );
      labels.push(
        `<div><i style="width: 18px; height: 18px; background: #037000; opacity: 0.25"></i> ${_this.legendaMapa1} </div>`
        );
      labels.push(
        `<div><i style="width: 18px; height: 18px; background: #037000; opacity: 0.45"></i> ${_this.legendaMapa2}</div>`
        );
      labels.push(
        `<div><i style="width: 18px; height: 18px; background: #037000; opacity: 0.60"></i> ${_this.legendaMapa3} </div>`
        );
      labels.push(
        `<div><i style="width: 18px; height: 18px; background: #037000; opacity: 0.80"></i> ${_this.legendaMapa4} </div>`
        );
      labels.push(
        `<div><i style="width: 18px; height: 18px; background: #037000; opacity: 1"></i> ${_this.legendaMapa5} </div>`
        );

      div.innerHTML = labels.join(' ');
     
      return div;
    };
    legenda.addTo(this.map);
   }

   public carregarLegendasVazia(){

    const legenda = new (L.Control.extend({
      options: { position: "bottomright" }
    }))();

    let _this = this;
    legenda.onAdd = function () {
    
      const div = L.DomUtil.create("div", "info legend"),
        labels = [];

      labels.push(
        '<div><b>Cidades signatárias</b></div>'
      );
      labels.push(
        '<div><i style="width: 18px; height: 18px; background: #888f88; opacity: 0.3"></i>nenhuma</div>'
        );

      div.innerHTML = labels.join(' ');
     
      return div;
    };
    legenda.addTo(this.map);
   }

   async getUsuarioLogadoDadosDownload(){
    if (await this.authService.isAuthenticated()) {
        this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
        this.usuario = usuario as Usuario;

        this.dadosDownload.email = usuario.email;
        this.dadosDownload.nome = usuario.nome
        this.dadosDownload.organizacao = usuario.organizacao;
        this.dadosDownload.boletim = usuario.recebeEmail;
        this.dadosDownload.usuario = usuario.id;
        this.dadosDownload.nomeCidade = usuario.cidadeInteresse;
        this.dadosDownload.acao = `Download de Arquivo da Home de Indicadores`;
        this.dadosDownload.pagina = 'Indicadores Inicial';

      });
    } else {
      this.dadosDownload = null;
    }
  }
   
 }


