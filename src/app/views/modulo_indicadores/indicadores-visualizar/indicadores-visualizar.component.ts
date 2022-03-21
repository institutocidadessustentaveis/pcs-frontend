import { Title } from '@angular/platform-browser';
import { VisualizarIndicador } from "./../../../model/visualizarIndicador";
import swal from "sweetalert2";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { PainelIndicadorCidadeService } from "src/app/services/painel-indicador-cidade.service";
import { ProvinciaEstadoShapeService } from "src/app/services/provincia-estado-shape.service";
import { CidadeService } from "src/app/services/cidade.service";
import { IndicadoresPreenchidosService } from "src/app/services/indicadores-preenchidos.service";
import { EixoService } from "src/app/services/eixo.service";
import { ObjetivoDesenvolvimentoSustentavelService } from "src/app/services/objetivo-desenvolvimento-sustentavel.service";
import { Label, Color } from "ng2-charts";
import { VisualizarIndicadorService } from "src/app/services/visualizar-indicador.service";
import { ActivatedRoute, Router } from "@angular/router";

import * as L from "leaflet";
import { GestureHandling } from "leaflet-gesture-handling";
import { latLng, tileLayer, geoJSON, circleMarker } from "leaflet";
import { DecimalPipe } from "@angular/common";
import { PcsUtil } from 'src/app/services/pcs-util.service';

import * as chroma from 'chroma-js';
import { environment } from 'src/environments/environment';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { BoaPratica } from 'src/app/model/boaPratica';

@Component({
  selector: "app-indicadores-visualizar",
  templateUrl: "./indicadores-visualizar.component.html",
  styleUrls: [
    "./indicadores-visualizar.component.css",
    "../../../../animate.css"
  ]
})
export class IndicadoresVisualizarComponent implements OnInit {

  public formulaIndicadorSelecionado;
  public formFormula: FormGroup;
  idIndicador: number = null;

  form: FormGroup;
  formAnoMandato: FormGroup;
  options = {
    layers: [
      tileLayer(environment.MAP_TILE_SERVER, {
        detectRetina: true,
        attribution: environment.MAP_ATTRIBUTION,
        noWrap: true,
        minZoom: 2
      })
    ],
    zoom: 3.5,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227])
  };

  layersControl = [];

  options_resultado = {
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

  layersControl_resultado = [];

  mapResultado: any;

  legendaMapResultado: any;

  cidades;
  listaODS = [];
  listaEixos = [];
  listaEstado = [];
  listaCidades = [];
  listaIndicadores = [];
  estadoSelecionado: number;
  cidadeSelecionada: number;
  populacaoSelecionada: number;
  visualizarIndicador: VisualizarIndicador;
  boasPraticasRelacionadas: Array<BoaPratica> = [];
  

  mostrarMapa = false;
  mostrarTabela = true;
  mostrarGrafico = false;

  mostrarGraficoLinha = true;
  mostrarGraficoBarra = false;
  mostrarGraficoTreemap = false;

  dadosGraficos: any;
  mandatoSelecionado: any = [];
  listaMandatosPreenchidos: any[];
  mandatoSelecionadoGrafico: any;
  listaCidadesPreencheramIndicador = [];
  
  graficoNumerico = false;
  mostrarBotaoGrafico = false;

  lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    tooltips: {
      callbacks: {
        title: () => {
          return "";
        },
        label: (tooltipItem, data) => {
          const decimalPipe = new DecimalPipe("pt-BR");
          const valor = decimalPipe.transform(tooltipItem.yLabel);
          return `${data.datasets[tooltipItem.datasetIndex].label} - ${valor} `;
        }
      }
    },
    scales: {
      xAxes: [
        {
          ticks: {
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
              return decimalPipe.transform(dataLabel);
            }
          }
        }
      ],
      yAxes: [
        {
          id: "y-axis-0",
          position: "left",
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
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
      borderColor: "#e2431e",
      pointBackgroundColor: "#e2431e",
      pointBorderColor: "#e2431e",
      pointHoverBackgroundColor: "#e2431e",
      pointHoverBorderColor: "rgba(148,159,177,0.0)",
      pointRadius: 5
    },
    {
      // red
      borderColor: "#6f9654",
      pointBackgroundColor: "#6f9654",
      pointBorderColor: "#6f9654",
      pointHoverBackgroundColor: "#6f9654",
      pointHoverBorderColor: "rgba(148,159,177,0.0)",
      pointRadius: 5
    },
    {
      // red
      borderColor: "#43459d",
      pointBackgroundColor: "#43459d",
      pointBorderColor: "#43459d",
      pointHoverBackgroundColor: "#43459d",
      pointHoverBorderColor: "rgba(148,159,177,0.0)",
      pointRadius: 5
    }
  ];

  public lineChartLegend: [
    {
      display: false;
      color: "#43459d";
    }
  ];

  // Bar CHARTS
  public barChartData: ChartDataSets[] = [];
  public barChartLabels: Label[] = [];
  public barChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    tooltips: {
      callbacks: {
        title: () => {
          return "";
        },
        label: (tooltipItem, data) => {
          const decimalPipe = new DecimalPipe("pt-BR");
          const valor = decimalPipe.transform(tooltipItem.yLabel);
          return `${data.datasets[tooltipItem.datasetIndex].label} - ${valor} `;
        }
      }
    },
    scales: {
      xAxes: [
        {
          ticks: {
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
              return decimalPipe.transform(dataLabel);
            }
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
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
  public barChartColors: Color[] = [
    {
      // red
      backgroundColor: "#3e7152",
      borderColor: "#3e7152",
      pointBackgroundColor: "#50926a",
      pointBorderColor: "#356146",
      pointHoverBackgroundColor: "#356146",
      pointHoverBorderColor: "rgba(148,159,177,0.8)"
    }
  ];
  public barChartLegend = true;

  public bubbleChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
              return decimalPipe.transform(dataLabel);
            }
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
              return decimalPipe.transform(dataLabel);
            }
          }
        }
      ]
    }
  };
  public bubbleChartType: ChartType = "bubble";
  public bubbleChartLegend = true;

  public bubbleChartData: ChartDataSets[] = [];

  public bubbleChartColors: Color[] = [
    {
      backgroundColor: [
        "red",
        "green",
        "blue",
        "purple",
        "yellow",
        "brown",
        "magenta",
        "cyan",
        "orange",
        "pink"
      ]
    }
  ];
  scrollUp: any;

  constructor(
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private painelIndicadorCidadeService: PainelIndicadorCidadeService,
    private indicadoresPreenchidosService: IndicadoresPreenchidosService,
    private shapeService: ProvinciaEstadoShapeService,
    private cidadesService: CidadeService,
    private eixoService: EixoService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private changeDetectorRefs: ChangeDetectorRef,
    private visualizarIndicadorService: VisualizarIndicadorService,
    private pcsUtil: PcsUtil,
    private route: ActivatedRoute,
    private element: ElementRef,
    private router: Router,
    private titleService: Title,
    private boaPraticaService: BoaPraticaService,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.form = this.formBuilder.group({
      estado: [null],
      cidade: [null],
      populacao: [null],
      indicador: [null],
      eixo: [null],
      ods: [null]
    });

    this.formAnoMandato = this.formBuilder.group({
      anoMandato: [null]
    });

    this.formFormula = this.formBuilder.group({
      formula: [null]
    });

    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
  }

  ngOnInit() {
    this.route.params.subscribe(
      async params => {
        this.idIndicador = params.idIndicador;
      },
      error => {}
    );
    this.buscarIndicadores(this.idIndicador);
    this.buscarEstadosSignatarios();
    this.visualizaIndicador();
    this.buscarBoasPraticasRelacionadas();
  }

  private buscarBoasPraticasRelacionadas() {
    this.boaPraticaService.buscarBoasPraticasRelacionadasAoIndicadorCidade(this.idIndicador).subscribe(response => {
      this.boasPraticasRelacionadas = response as Array<BoaPratica>;
    });
  }

  public getImagePath(id: number): string {
    if (id == null) {
      return '/';
    }
    return `${environment.API_URL}boapratica/imagem/` + id;
  }

  public buscarEstadosSignatarios() {
    this.painelIndicadorCidadeService
      .buscarEstadosSignatarios()
      .subscribe(response => {
        this.listaEstado = response;
      });
  }

  public escolherEstado() {
    const idEstado: number = this.form.controls.estado.value;
    this.form.controls.cidade.setValue(null);
    this.cidadeService.buscarPorEstadoPCS(idEstado).subscribe(a => {
      this.listaCidades = a;
    });
  }

  public escolherCidade() {
    const idCidade: number = this.form.controls.cidade.value;
  }
  public escolherPopulacao() {
    const populacao: number = this.form.controls.populacao.value;
  }

  public buscarIndicadores(idIndicador: number) {
    this.visualizarIndicadorService
      .buscarIndicadorPorId(idIndicador)
      .subscribe(a => {
        this.formulaIndicadorSelecionado = a.formula.split('<br>');
        this.formFormula.controls.formula.setValue(0);
        this.visualizarIndicador = a;
        this.titleService.setTitle(`${this.visualizarIndicador.nome} - Cidades Sustentáveis`);
        if (this.listaIndicadores.length === 0) {
          this.listaIndicadores.push({
            id: null,
            nome: "Nenhum Indicador Encontrado"
          });
        }
      });
  }

  botaoTabela() {
    this.mostrarTabela = true;
    this.mostrarMapa = false;
    this.mostrarGrafico = false;
  }

  botaoMapa() {
    this.mostrarTabela = false;
    this.mostrarMapa = true;
    this.mostrarGrafico = false;
    this.carregarDadosMapaResultado(this.idIndicador);
  }

  botaoGrafico() {
    this.mostrarTabela = false;
    this.mostrarMapa = false;
    this.mostrarGrafico = true;
    this.carregarDadosGraficosResultado(this.idIndicador, 0);
  }

  botaoGraficoLinha() {
    this.mostrarGraficoLinha = true;
    this.mostrarGraficoBarra = false;
    this.mostrarGraficoTreemap = false;
  }
  botaoGraficoBarra() {
    this.mostrarGraficoLinha = false;
    this.mostrarGraficoBarra = true;
    this.mostrarGraficoTreemap = false;
  }
  botaoGraficoTreemap() {
    this.mostrarGraficoLinha = false;
    this.mostrarGraficoBarra = false;
    this.mostrarGraficoTreemap = true;
  }



  botaoFiltrar() {
    this.listaMandatosPreenchidos = [];
    this.estadoSelecionado = this.form.controls.estado.value;
    this.populacaoSelecionada = this.form.controls.populacao.value;
    this.cidadeSelecionada = this.form.controls.cidade.value;
    this.visualizaIndicador();
    // this.carregarDadosMapaResultado(this.idIndicador);
    // this.carregarDadosGraficosResultado(this.idIndicador, 0);
  }

  visualizaIndicador() {
    if (this.idIndicador != null && this.idIndicador !== 0) {
      this.indicadoresPreenchidosService
        .buscarPreenchidosTabelaVisualizaIndicador(
          this.idIndicador,
          this.estadoSelecionado,
          this.cidadeSelecionada,
          this.populacaoSelecionada
        )
        .subscribe(res => {
          this.listaMandatosPreenchidos = res;
          if (
            this.listaMandatosPreenchidos != null &&
            this.listaMandatosPreenchidos.length > 0
          ) {
            for (const mandato of this.listaMandatosPreenchidos) {
              this.mandatoSelecionado = mandato;

              this.changeDetectorRefs.detectChanges();
              this.formAnoMandato.controls.anoMandato.setValue(this.mandatoSelecionado.anoInicial);
            }
          }
        });
    }
  }

  selecionarMandato(nome) {
    for (let mandato of this.listaMandatosPreenchidos) {
      if (mandato.mandato == nome) {
        this.mandatoSelecionado = mandato;

        this.formAnoMandato.reset();
        this.changeDetectorRefs.detectChanges();
        this.formAnoMandato.controls.anoMandato.setValue(this.mandatoSelecionado.anoInicial);
      }
    }
  }

  escolherAnoMandato() {
    this.carregarDadosMapaResultado(this.idIndicador);
  }

  selecionarGrafico(nome) {
    for (let grafico of this.dadosGraficos.graficos) {
      if (grafico.mandato == nome) {
        this.mandatoSelecionadoGrafico = grafico;
      }
    }
  }

  public carregarDadosMapaResultado(idIndicador: number) {
    this.layersControl_resultado = [];
    this.indicadoresPreenchidosService
      .buscarPreenchidosMapaVisualizaIndicador(
        idIndicador,
        this.estadoSelecionado,
        this.cidadeSelecionada,
        this.populacaoSelecionada
      )
      .subscribe(res => {
        this.listaCidadesPreencheramIndicador = res;
        if (this.listaCidadesPreencheramIndicador != null) {
          let valores = [];
          if (this.listaCidadesPreencheramIndicador.length > 0) {
            for (let cidade of this.listaCidadesPreencheramIndicador) {
              let valor = this.obterValoresIndicadoreIdCidade(cidade.id);
              if (valor) {
                valores.push(valor);
              }
            }
            let classes = this.pcsUtil.gerarClassesSerieNumerica(valores);
            let classesTemp = classes.slice();

            let generateColor = chroma.scale(['#ffde5c', '#c90300']).domain(classesTemp, classesTemp.length, 'quantiles');

            this.gerarLegendaMapaResultado(classesTemp, generateColor);

            for (let item of this.listaCidadesPreencheramIndicador) {
              const htmlExibir = this.exibirValoresIndicadoreIdCidade(item.id);

              if (htmlExibir != null && !htmlExibir.includes('-')) {
                this.layersControl_resultado.push(
                  circleMarker([item.latitude, item.longitude], {
                    radius: 10,
                    fillColor: generateColor(this.obterValoresIndicadoreIdCidade(item.id)),
                    color: generateColor(this.obterValoresIndicadoreIdCidade(item.id)),
                    fillOpacity: 1,
                    weight: 1
                  }).bindPopup(`<strong>${item.nomeCidade}</strong></br>` + htmlExibir)
                );
              }
            }
          } else {
              this.mostrarMapa = false;
          }
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

  public onMapResultadoReady(map: L.Map) {
    this.mapResultado = map;
  }

  public carregarDadosGraficosResultado(idIndicador: number, indexFormula: number) {
    this.layersControl_resultado = [];
    this.indicadoresPreenchidosService
      .buscarPreenchidosGraficoVisualizaIndicador(
        idIndicador,
        this.estadoSelecionado,
        this.cidadeSelecionada,
        this.populacaoSelecionada,
        indexFormula
      )
      .subscribe(
        res => {
          if (res != null) {
            let dados: any = res;
            if (dados.graficos != null) {
              for (let i = 0 ; i < dados.graficos.length ; i++) {
                const valores = dados.graficos[i].valores;
                dados.graficos[i].dataset = this.getDataSet(valores);
              }
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
            this.mostrarBotaoGrafico = this.mandatoSelecionadoGrafico;
          }
        },
        error => {
          this.mostrarBotaoGrafico = false;
        }
      );
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

  carregaIndicadorById(idIndicador: number) {
    this.visualizarIndicadorService
      .buscarIndicadorPorId(idIndicador)
      .subscribe(res => {
        this.visualizarIndicador = res;
      });
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

  private exibirValoresIndicadoreIdCidade(idCidade: string): string {
    let aux: string = null;
    if (this.mandatoSelecionado != null && this.mandatoSelecionado.valores != null) {
      for (const mandato of this.mandatoSelecionado.valores) {
          if (mandato[5] == idCidade) {
            const anoSelecionado = this.formAnoMandato.controls.anoMandato.value;
            if (anoSelecionado && anoSelecionado == this.mandatoSelecionado.anoInicial) {
              aux = 'Valor' + ' : ' + (mandato[1] ?  mandato[1] : '-') + '</br>';
            } else if (anoSelecionado && anoSelecionado == this.mandatoSelecionado.anoInicial + 1){
              aux = 'Valor' + ' : ' + (mandato[2] ?  mandato[2] : '-') + '</br>';
            } else if (anoSelecionado && anoSelecionado == this.mandatoSelecionado.anoInicial + 2){
              aux = 'Valor' + ' : ' + (mandato[3] ?  mandato[3] : '-') + '</br>';
            } else if (anoSelecionado && anoSelecionado == this.mandatoSelecionado.anoInicial + 3){
              aux = 'Valor' + ' : ' + (mandato[4] ?  mandato[4] : '-') + '</br>';
            }
            break;
          }
      }
      return aux;
    }
  }

  private obterValoresIndicadoreIdCidade(idCidade: string): number {
    let aux: number = null;
    if (this.mandatoSelecionado != null && this.mandatoSelecionado.valores != null) {
      for (const mandato of this.mandatoSelecionado.valores) {
          if (mandato[5] == idCidade) {
            const anoSelecionado = this.formAnoMandato.controls.anoMandato.value;
            if (anoSelecionado && anoSelecionado == this.mandatoSelecionado.anoInicial) {
              aux = mandato[1] ? parseFloat(mandato[1].replace(',', '.')) : null;
            } else if (anoSelecionado && anoSelecionado == this.mandatoSelecionado.anoInicial + 1){
              aux = mandato[2] ? parseFloat(mandato[2].replace(',', '.')) : null;
            } else if (anoSelecionado && anoSelecionado == this.mandatoSelecionado.anoInicial + 2){
              aux = mandato[3] ? parseFloat(mandato[3].replace(',', '.')) : null;
            } else if (anoSelecionado && anoSelecionado == this.mandatoSelecionado.anoInicial + 3){
              aux = mandato[5] ? parseFloat(mandato[5].replace(',', '.')) : null;
            }
            break;
          }
      }

      return aux;
    }
  }

  public filtrarPorFormula(posicaoFormula: any) {
    this.carregarDadosGraficosResultado(this.idIndicador, posicaoFormula);
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}foto-de-todos-os-indicadores.jpg`
  }

}
