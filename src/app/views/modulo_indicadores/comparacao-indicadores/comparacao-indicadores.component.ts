import { Title } from '@angular/platform-browser';
import { Cidade } from "./../../../model/cidade";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { IndicadoresService } from "src/app/services/indicadores.service";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { CidadeService } from "src/app/services/cidade.service";
import { IndicadoresPreenchidosService } from "src/app/services/indicadores-preenchidos.service";
import { EixoService } from "src/app/services/eixo.service";
import { ObjetivoDesenvolvimentoSustentavelService } from "src/app/services/objetivo-desenvolvimento-sustentavel.service";
import { Label, Color } from "ng2-charts";
import { startWith, map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ItemCombo } from "src/app/model/ItemCombo ";
import { VariavelService } from "src/app/services/variavel.service";
import { Variavel } from "src/app/model/variaveis";
import { VariavelPreenchidaService } from "src/app/services/variavelPreenchida.service";

import * as L from "leaflet";
import { latLng, tileLayer, circleMarker } from "leaflet";
import { GestureHandling } from "leaflet-gesture-handling";

import {
  ScrollToService,
  ScrollToConfigOptions,
} from "@nicky-lenaers/ngx-scroll-to";
import { DecimalPipe } from "@angular/common";
import { PcsUtil } from "src/app/services/pcs-util.service";

import * as chroma from "chroma-js";
import { environment } from "src/environments/environment";
import { SeoService } from 'src/app/services/seo-service.service';

@Component({
  selector: "app-comparacao-indicadores",
  templateUrl: "./comparacao-indicadores.component.html",
  styleUrls: [
    "./comparacao-indicadores.component.css",
    "../../../../animate.css",
  ],
})
export class ComparacaoIndicadoresComponent implements OnInit {
  public formulaIndicadorSelecionado;

  form: FormGroup;
  formDispersao: FormGroup;
  formAnoMandato: FormGroup;
  public formFormula: FormGroup;

  teste = [];
  loading = false;
  options: Cidade[] = [];
  checkCidadeAutoComplete = false;

  filteredOptions: Observable<Cidade[]>;

  mostraListaCidades = false;

  @ViewChild("btnfiltrar") btnfiltrar: ElementRef;

  options_resultado = {
    layers: [
      tileLayer(environment.MAP_TILE_SERVER, {
        detectRetina: true,
        attribution: environment.MAP_ATTRIBUTION,
        noWrap: true,
        minZoom: 2,
      }),
    ],
    zoom: 4,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000,
    },
    center: latLng([-15.03144, -53.09227]),
  };

  layersControl_resultado = [];

  mapResultado: any;

  legendaMapResultado: any;

  listaEixos = [];
  listaODS: ItemCombo[];
  listaIndicadores = [];
  cidadesSelecionadas = [];
  idsSelecionados = [];
  odsSelecionado: string;
  cidades;
  listaCidadesPreencheram = [];
  listaIndicadoresDispersao = [];

  mostrarTabela = true;
  mostrarMapa = false;
  mostrarGrafico = false;

  mostrarGraficoLinha = true;
  mostrarGraficoBarra = false;
  mostrarGraficoTreemap = false;
  mostrarGraficoDispersao = false;

  mostrarBotaoTreemap = false;

  public anoLabelInterativo = "";
  public listaVariaveis: Array<Variavel> = new Array<Variavel>();
  public listaVariavelPreenchida = [];
  public itensLegendaDispersao = [];
  public tipoDispersao = false;
  public indicadorDispersao: any = [];

  listaMandatosPreenchidos: any;
  mandatoSelecionado: any;
  listaCidadesPreencheramIndicador = [];
  dadosGraficos: any;
  mandatoSelecionadoGrafico: any;

  mostrarBotaoGrafico = false;
  graficoNumerico = false;

  idEixoAux: any;
  idOdsAux: any;
  idIndicadorAux: any;
  cidadesAux: string[] = [];

  nomeIndicador: any;
  descricaoIndicador: any;
  odsDescricao: any;
  nomeIndicadorAux: any;
  metaOdsNumero: any;
  metaOdsDescricao: any;
  formulaIndicador: any;
  ordemClassificacao: any;

  idIndicadorSelecionado: number;
  idCidadeSelecionado: number;

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
        },
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
              return decimalPipe.transform(dataLabel);
            },
          },
        },
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
            },
          },
        },
      ],
    },
    annotation: {
      annotations: [],
    },
  };
  lineChartColors: Color[] = [
    {
      // red
      borderColor: "#e2431e",
      pointBackgroundColor: "#e2431e",
      pointBorderColor: "#e2431e",
      pointHoverBackgroundColor: "#e2431e",
      pointHoverBorderColor: "rgba(148,159,177,0.0)",
      pointRadius: 5,
    },
    {
      // red
      borderColor: "#6f9654",
      pointBackgroundColor: "#6f9654",
      pointBorderColor: "#6f9654",
      pointHoverBackgroundColor: "#6f9654",
      pointHoverBorderColor: "rgba(148,159,177,0.0)",
      pointRadius: 5,
    },
    {
      // red
      borderColor: "#43459d",
      pointBackgroundColor: "#43459d",
      pointBorderColor: "#43459d",
      pointHoverBackgroundColor: "#43459d",
      pointHoverBorderColor: "rgba(148,159,177,0.0)",
      pointRadius: 5,
    },
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
        title: () => "",
        label: (tooltipItem, data) => {
          const decimalPipe = new DecimalPipe("pt-BR");
          const valor = decimalPipe.transform(tooltipItem.yLabel);
          return `${data.datasets[tooltipItem.datasetIndex].label} - ${valor} `;
        },
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
              return decimalPipe.transform(dataLabel);
            },
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
              return decimalPipe.transform(dataLabel);
            },
          },
        },
      ],
    },
    annotation: {
      annotations: [],
    },
  };
  public barChartColors: Color[] = [
    {
      // red
      backgroundColor: "#3e7152",
      borderColor: "#3e7152",
      pointBackgroundColor: "#50926a",
      pointBorderColor: "#356146",
      pointHoverBackgroundColor: "#356146",
      pointHoverBorderColor: "rgba(148,159,177,0.8)",
    },
  ];
  public barChartLegend = true;

  public bubbleChartOptions: ChartOptions = {
    legend: { position: "top", fullWidth: false },
    responsive: true,
    tooltips: {
      callbacks: {
        title: () => {
          return "";
        },
        label: (tooltipItem, data) => {
          const decimalPipe = new DecimalPipe("pt-BR");
          const resultadoIndicador = decimalPipe.transform(tooltipItem.xLabel);
          const resultadoVariavel = decimalPipe.transform(tooltipItem.yLabel);
          if (this.formDispersao.controls.compararComIndicador.value) {
            const indicadorDispersao = this.formDispersao.controls.indicador
              .value;
            return `${data.datasets[tooltipItem.datasetIndex].label}: ${
              this.nomeIndicadorAux
            } = ${resultadoIndicador}. ${
              this.indicadorDispersao.nome
            } = ${resultadoVariavel}`;
          } else {
            return `${data.datasets[tooltipItem.datasetIndex].label}: ${
              this.nomeIndicadorAux
            } = ${resultadoIndicador}. ${
              this.variavelSelecionada.nome
            } = ${resultadoVariavel}`;
          }
        },
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
              return decimalPipe.transform(dataLabel);
            },
          },
          scaleLabel: {
            display: true,
            labelString: "Resultado do Indicador",
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe("pt-BR");
              return decimalPipe.transform(dataLabel);
            },
          },
          scaleLabel: {
            display: true,
            labelString: "Resultado da Variável",
          },
        },
      ],
    },
  };
  public bubbleChartType: ChartType = "bubble";
  public bubbleChartData: ChartDataSets[] = [];
  public variavelSelecionada: any;

  scrollUp: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private element: ElementRef,
    private indicadoresPreenchidosService: IndicadoresPreenchidosService,
    private eixoService: EixoService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private serviceCidade: CidadeService,
    private indicadoresService: IndicadoresService,
    private variavelService: VariavelService,
    private variavelPreenchidaService: VariavelPreenchidaService,
    private pcsUtil: PcsUtil,
    private _scrollToService: ScrollToService,
    private changeDetectorRefs: ChangeDetectorRef,
    private seoService: SeoService,
    private titleService: Title
  ) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    this.form = this.formBuilder.group({
      cidadeInteresse: [null],
      indicador: [null],
      eixo: [null],
      ods: [null],
    });

    this.formDispersao = this.formBuilder.group({
      compararComIndicador: true,
      variavel: [null],
      indicador: [null],
    });

    this.formAnoMandato = this.formBuilder.group({
      anoMandato: [null],
    });

    this.formFormula = this.formBuilder.group({
      formula: [null],
    });

    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
  }

  public triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      target: "destination",
    };
    this._scrollToService.scrollTo(config);
  }

  setCidadeSelecionada(cidade: Cidade) {
    if (this.idsSelecionados.indexOf(cidade.id) > -1) {
      swal.fire("Cidade já selecionada", "", "warning");
    } else {
      this.idsSelecionados.push(cidade.id);
      this.cidadesSelecionadas.push(cidade.nome + " - " + cidade.siglaEstado);
    }
    this.filteredOptions = this.form.get("cidadeInteresse")!.valueChanges.pipe(
      startWith(""),
      map((value) => (typeof value === "string" ? value : value.nome)),
      map((name) => (name ? this._filter(name) : this.options.slice()))
    );
    this.btnfiltrar.nativeElement.focus();
  }

  ngOnInit() {
    this.titleService.setTitle(`Comparativo de Cidades - Cidades Sustentáveis`);
    const config = {
      title: 'Comparativo de Cidades - Cidades Sustentáveis',
      description: 'Faça a comparação de indicadores entre diferentes cidades',
      image:  `${environment.APP_IMAGEM}indicadores-comparativo-de-cidades.jpg`,
      slug: '',
      site: 'Cidades Sustentáveis' ,
      url: `${environment.APP_URL}comparacaoIndicadores`
    };
    this.seoService.generateTags(config);
    this.buscarEixos();
    this.buscarODS();
    this.buscarIndicadores();
    this.buscarCidades();
    this.carregarVariaveis();
  }

  public carregarVariaveis() {
    this.variavelService.carregaVariaveisPCSSimples().subscribe((res) => {
      this.listaVariaveis = res;
    });
  }

  public limparFiltro() {
    this.form.reset();
    this.idIndicadorAux = null;
    this.listaMandatosPreenchidos = null;
    this.cidadesSelecionadas = [];
    this.idsSelecionados = [];
  }

  private _filter(name: string): Cidade[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(
      (option) => option.nome.toLowerCase().indexOf(filterValue) === 0
    );
  }

  public buscarEixos() {
    this.eixoService.buscarEixosParaCombo(true).subscribe((a) => {
      this.listaEixos = a;
    });
  }

  public buscarODS() {
    this.odsService.buscarOdsCombo().subscribe((a) => {
      this.listaODS = a as ItemCombo[];
    });
  }

  public buscarIndicadores() {
    this.indicadoresService.buscarIndicadoresPcs().subscribe((a) => {
      this.listaIndicadores = a;
      this.listaIndicadoresDispersao = a;
      for (let i = 0; i < this.listaIndicadores.length; i++) {
        const item = this.listaIndicadores[i];
        if (!item.numerico) {
          this.listaIndicadores.splice(i, 1);
        }
      }
      for (let i = 0; i < this.listaIndicadoresDispersao.length; i++) {
        const item = this.listaIndicadoresDispersao[i];
        if (!item.numerico) {
          this.listaIndicadoresDispersao.splice(i, 1);
        }
      }
    });
  }

  buscarCidades() {
    this.serviceCidade.buscarSignatarias().subscribe((res) => {
      this.options = res;
      this.options = res as Array<Cidade>;
      this.filteredOptions = this.form
        .get("cidadeInteresse")!
        .valueChanges.pipe(
          startWith(""),
          map((value) => (typeof value === "string" ? value : value.nome)),
          map((name) => (name ? this._filter(name) : this.options.slice()))
        );
    });
  }

  public getTextoExibicaoCidade(cidade?: Cidade): string | undefined {
    return "";
  }

  public deletarCidade(event: any): void {
    const index = this.cidadesSelecionadas.indexOf(event);
    this.idsSelecionados.splice(index, 1);
    this.cidadesSelecionadas.splice(index, 1);
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
  }

  botaoGrafico() {
    this.mostrarTabela = false;
    this.mostrarMapa = false;
    this.mostrarGrafico = true;
    this.mostrarBotaoTreemap = this.validaTreemap();
  }

  botaoGraficoLinha() {
    this.mostrarGraficoLinha = true;
    this.mostrarGraficoBarra = false;
    this.mostrarGraficoTreemap = false;
    this.mostrarGraficoDispersao = false;
  }
  botaoGraficoBarra() {
    this.mostrarGraficoLinha = false;
    this.mostrarGraficoBarra = true;
    this.mostrarGraficoTreemap = false;
    this.mostrarGraficoDispersao = false;
  }
  botaoGraficoTreemap() {
    this.mostrarGraficoLinha = false;
    this.mostrarGraficoBarra = false;
    this.mostrarGraficoTreemap = true;
    this.mostrarGraficoDispersao = false;
  }

  botaoFiltrar() {
    this.limparTudo();
    this.idIndicadorAux = this.form.controls.indicador.value;
    for (const i of this.listaIndicadores) {
      if (i.id === this.idIndicadorAux) {
        this.graficoNumerico = i.numerico;
        this.nomeIndicador = i.nome;
        this.descricaoIndicador = i.descricao;
        if(i.ods){
          this.odsSelecionado = `${i.ods.numero} - ${i.ods.titulo}`;
          this.odsDescricao = i.ods.descricao;
        }
        if(i.metaOds){
          this.metaOdsNumero = i.metaOds.numero;
          this.metaOdsDescricao = i.metaOds.descricao;
        }
        this.formulaIndicador = i.formula_resultado;
        this.ordemClassificacao = i.ordem_classificacao;
        this.formulaIndicadorSelecionado = this.formulaIndicador.split("<br>");
        this.formFormula.controls.formula.setValue(0);
      }
    }

    this.nomeIndicadorAux = this.nomeIndicador;
    if (this.idIndicadorAux != null && this.idIndicadorAux !== "0") {
      this.indicadoresPreenchidosService
        .buscarPreenchidosTabelaComparativoCidades(
          this.idIndicadorAux,
          this.idsSelecionados
        )
        .subscribe((res) => {
          this.listaMandatosPreenchidos = res;
          if (this.listaMandatosPreenchidos != null) {

            this.mandatoSelecionado = this.listaMandatosPreenchidos.listaMandatos[3];

            this.changeDetectorRefs.detectChanges();
            this.formAnoMandato.controls.anoMandato.setValue(this.mandatoSelecionado.anoInicioMandato);
            this.carregarDadosMapaResultadoComparativoCidades();
            this.triggerScrollTo();
          }

        });

      this.carregarDadosGraficosResultadoComparativoCidades(0);

    } else {
      swal.fire("Selecione um indicador", "", "warning");
    }
  }

  selecionarMandato(nome) {
    for (const mandato of this.listaMandatosPreenchidos.listaMandatos) {
      if (mandato.periodo == nome) {
        this.mandatoSelecionado = mandato;

        this.changeDetectorRefs.detectChanges();
        this.formAnoMandato.controls.anoMandato.setValue(this.mandatoSelecionado.anoInicioMandato);
        this.carregarDadosMapaResultadoComparativoCidades();

        this.mostrarBotaoTreemap = this.validaTreemap();
      }
    }
  }

  selecionarGrafico(nome) {
    for (const grafico of this.dadosGraficos.graficos) {
      if (grafico.mandato == nome) {
        this.mandatoSelecionadoGrafico = grafico;
        this.mostrarBotaoTreemap = this.validaTreemap();
      }
    }
  }

  private exibirValoresIndicadoreIdCidade(idCidade: string): string {
    let aux: string = null;
    if (
      this.mandatoSelecionado != null &&
      this.mandatoSelecionado.listaValoresPorCidade != null
    ) {
      for (const mandato of this.mandatoSelecionado.listaValoresPorCidade) {
        if (mandato.idCidade == idCidade) {
          const anoSelecionado = this.formAnoMandato.controls.anoMandato.value;
          if (
            anoSelecionado &&
            anoSelecionado == this.mandatoSelecionado.anoInicioMandato
          ) {
            if (mandato.resultadoAno1 != null) {
              aux = "Valor: " + mandato.resultadoAno1 + "</br>";
            }
          } else if (
            anoSelecionado &&
            anoSelecionado == this.mandatoSelecionado.anoInicioMandato + 1
          ) {
            if (mandato.resultadoAno2 != null) {
              aux = "Valor: " + mandato.resultadoAno2 + "</br>";
            }
          } else if (
            anoSelecionado &&
            anoSelecionado == this.mandatoSelecionado.anoInicioMandato + 2
          ) {
            if (mandato.resultadoAno3 != null) {
              aux = "Valor: " + mandato.resultadoAno3 + "</br>";
            }
          } else if (
            anoSelecionado &&
            anoSelecionado == this.mandatoSelecionado.anoInicioMandato + 3
          ) {
            if (mandato.resultadoAno4 != null) {
              aux = "Valor: " + mandato.resultadoAno4 + "</br>";
            }
          }
          break;
        }
      }
      return aux;
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

  selecionarIndicador(id) {
    this.idIndicadorSelecionado = id;
    this.graficoNumerico = false;
    this.indicadoresPreenchidosService
      .buscarCidadesPreencheram(id)
      .subscribe((res) => {
        this.listaCidadesPreencheram = res;
      });
  }

  private obterValoresIndicadoreIdCidade(idCidade: string): number {
    let aux: number = null;
    if (
      this.mandatoSelecionado != null &&
      this.mandatoSelecionado.listaValoresPorCidade != null
    ) {
      for (const mandato of this.mandatoSelecionado.listaValoresPorCidade) {
        if (mandato.idCidade == idCidade) {
          const anoSelecionado = this.formAnoMandato.controls.anoMandato.value;
          if (
            anoSelecionado &&
            anoSelecionado == this.mandatoSelecionado.anoInicioMandato
          ) {
            aux = mandato.resultadoAno1
              ? parseFloat(mandato.resultadoAno1.replace(",", "."))
              : null;
          } else if (
            anoSelecionado &&
            anoSelecionado == this.mandatoSelecionado.anoInicioMandato + 1
          ) {
            aux = mandato.resultadoAno2
              ? parseFloat(mandato.resultadoAno2.replace(",", "."))
              : null;
          } else if (
            anoSelecionado &&
            anoSelecionado == this.mandatoSelecionado.anoInicioMandato + 2
          ) {
            aux = mandato.resultadoAno3
              ? parseFloat(mandato.resultadoAno3.replace(",", "."))
              : null;
          } else if (
            anoSelecionado &&
            anoSelecionado == this.mandatoSelecionado.anoInicioMandato + 3
          ) {
            aux = mandato.resultadoAno4
              ? parseFloat(mandato.resultadoAno4.replace(",", "."))
              : null;
          }
          break;
        }
      }

      return aux;
    }
  }

  public carregarDadosMapaResultadoComparativoCidades() {
    this.layersControl_resultado = [];
    if (this.mandatoSelecionado.listaValoresPorCidade != null) {
      let valores = [];
      if (this.mandatoSelecionado.listaValoresPorCidade.length > 0) {
        for (let cidade of this.mandatoSelecionado.listaValoresPorCidade) {
          let valor = this.obterValoresIndicadoreIdCidade(cidade.idCidade);
          if (valor) {
            valores.push(valor);
          }
        }
        let classes = this.pcsUtil.gerarClassesSerieNumerica(valores);
        let classesTemp = classes.slice();
        let generateColor = chroma
          .scale(["#ffde5c", "#c90300"])
          .domain(classesTemp, classesTemp.length, "quantiles");
        this.gerarLegendaMapaResultado(classesTemp, generateColor);
        for (let item of this.mandatoSelecionado.listaValoresPorCidade) {
          const htmlExibir = this.exibirValoresIndicadoreIdCidade(
            item.idCidade
          );
          if (htmlExibir != null && !htmlExibir.includes("@")) {
            this.layersControl_resultado.push(
              circleMarker([item.latitude, item.longitude], {
                radius: 10,
                fillColor: generateColor(
                  this.obterValoresIndicadoreIdCidade(item.idCidade)
                ),
                color: generateColor(
                  this.obterValoresIndicadoreIdCidade(item.idCidade)
                ),
                fillOpacity: 1,
                weight: 1,
              }).bindPopup(`<strong>${item.cidade}</strong></br>` + htmlExibir)
            );
          }
        }
      } else {
        this.mostrarMapa = false;
      }
    }
    this.changeDetectorRefs.detectChanges();
  }

  public gerarLegendaMapaResultado(classes: any[], generateColor) {
    if (window.innerWidth > 1399) {
      this.removerLegendaMapaResultado();

      this.legendaMapResultado = new (L.Control.extend({
        options: { position: "bottomleft" },
      }))();

      this.legendaMapResultado.onAdd = (map) => {
        const div = L.DomUtil.create("div", "info legend");
        let labels = [];

        for (let clazz of classes) {
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
    if (this.legendaMapResultado) {
      this.mapResultado.removeControl(this.legendaMapResultado);
    }
  }

  public onMapResultadoReady(map: L.Map) {
    this.mapResultado = map;
  }

  public carregarDadosGraficosResultadoComparativoCidades(
    formulaSelecionadaIndex
  ) {
    this.idEixoAux = this.form.controls.eixo.value;
    this.idOdsAux = this.form.controls.ods.value;
    this.idIndicadorAux = this.form.controls.indicador.value;
    this.layersControl_resultado = [];
    this.indicadoresPreenchidosService
      .buscarPreenchidosGrafico(
        this.idIndicadorAux,
        this.idsSelecionados,
        formulaSelecionadaIndex
      )
      .subscribe(
        (res) => {
          const dados: any = res;
          for (let i = 0; i < dados.graficos.length; i++) {
            const valores = dados.graficos[i].valores;
            dados.graficos[i].dataset = this.getDataSet(valores);
          }
          this.dadosGraficos = dados;
          for (const grafico of this.dadosGraficos.graficos) {
            if (!this.mandatoSelecionadoGrafico) {
              this.mandatoSelecionadoGrafico = this.dadosGraficos.graficos[
                this.dadosGraficos.graficos.length - 1
              ];
            }
            if (grafico.mandato === this.mandatoSelecionadoGrafico.mandato) {
              this.mandatoSelecionadoGrafico = grafico;
            }
          }
          this.mostrarBotaoGrafico =
            this.graficoNumerico && this.mandatoSelecionadoGrafico;
        },
        (error) => {
          this.mostrarBotaoGrafico = false;
        }
      );
    this.changeDetectorRefs.detectChanges();
  }

  public escolherEixo(id) {
    if (id === "0") {
      this.buscarODS();
    } else {
      this.odsService.buscarPorEixo(id).subscribe((a) => {
        this.listaODS = a as ItemCombo[];
      });
    }
  }

  public escolherODS(id) {
    if (id === "0") {
      this.buscarIndicadores();
    } else {
      this.indicadoresService.buscarIndicadorPorIdOds(id).subscribe((a) => {
        this.listaIndicadores = a as ItemCombo[];
        
        for (let i = 0; i < this.listaIndicadores.length; i++) {
          const item = this.listaIndicadores[i];
          if (!item.numerico) {
            this.listaIndicadores.splice(i, 1);
          }
        }
      });
    }
  }

  public limparCampos() {
    this.form.controls.eixo.setValue("");
    this.form.controls.ods.setValue("");
    this.form.controls.indicador.setValue("0");
    this.form.controls.cidadeInteresse.setValue("");
    this.cidadesSelecionadas = [];
    this.idsSelecionados = [];
    this.buscarEixos();
    this.buscarODS();
    this.buscarIndicadores();
  }
  public selecionarDispersaoAnimada() {
    this.mostrarGraficoLinha = false;
    this.mostrarGraficoBarra = false;
    this.mostrarGraficoTreemap = false;
    this.mostrarGraficoDispersao = true;
  }

  async executarDispersaoAnimadaBubble() {
    this.variavelSelecionada = this.formDispersao.controls.variavel.value;
    this.indicadorDispersao = this.formDispersao.controls.indicador.value;
    this.bubbleChartData = [];
    if (this.formDispersao.controls.compararComIndicador.value) {
      this.bubbleChartOptions.scales.yAxes[0].scaleLabel.labelString = this.indicadorDispersao.nome;
    } else {
      this.bubbleChartOptions.scales.yAxes[0].scaleLabel.labelString = this.variavelSelecionada.nome;
    }
    this.bubbleChartOptions.scales.xAxes[0].scaleLabel.labelString = `${this.nomeIndicadorAux} - ${this.descricaoIndicador}`;
    const cidadeEscolhida = this.idsSelecionados;
    if (this.formDispersao.controls.compararComIndicador.value) {
      this.indicadoresPreenchidosService
        .buscarIndicadoresPreenchidosSimples(
          this.indicadorDispersao.id,
          cidadeEscolhida
        )
        .subscribe(async (res) => {
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
                for (let i = 0; i < listaIndicadorPreenchido.length; i++) {
                  const ip = listaIndicadorPreenchido[i];
                  if (ano == ip.ano && ip.idCidade == registro.idCidade) {
                    indicadorPreenchido = ip;
                    listaIndicadorPreenchido.splice(i, 1);
                    break;
                  }
                }
                if (indicadorPreenchido) {
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
                          r: raio,
                        },
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
            const data: any = this.bubbleChartData;
            data.sort((a, b) => a.data[0].r - b.data[0].r);
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
        .buscarVariaveisPreenchidas(
          this.variavelSelecionada.id,
          cidadeEscolhida
        )
        .subscribe(async (res) => {
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
                for (let i = 0; i < this.listaVariavelPreenchida.length; i++) {
                  const vp = this.listaVariavelPreenchida[i];
                  if (ano == vp.ano && vp.idCidade == registro.idCidade) {
                    variavelPreenchida = vp;
                    this.listaVariavelPreenchida.splice(i, 1);
                    break;
                  }
                }
                if (variavelPreenchida) {
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
                          r: raio,
                        },
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
            const data: any = this.bubbleChartData;
            data.sort((a, b) => a.data[0].r - b.data[0].r);
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
    if (popCidade < 20000) {
      raioCalculado = 5;
    }
    if (popCidade >= 20000 && popCidade < 50000) {
      raioCalculado = 10;
    }
    if (popCidade >= 50000 && popCidade < 100000) {
      raioCalculado = 10;
    }
    if (popCidade >= 100000 && popCidade < 250000) {
      raioCalculado = 15;
    }
    if (popCidade >= 250000 && popCidade < 500000) {
      raioCalculado = 20;
    }
    if (popCidade >= 500000 && popCidade < 1000000) {
      raioCalculado = 25;
    }
    if (popCidade >= 1000000 && popCidade < 1000000) {
      raioCalculado = 30;
    }
    if (popCidade >= 1000000 && popCidade < 3500000) {
      raioCalculado = 35;
    }
    if (popCidade >= 3500000) {
      raioCalculado = 40;
    }
    return raioCalculado;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private geraCor() {
    const hexadecimais = "0123456789ABCDEF";
    let cor = "#";

    // Pega um número aleatório no array acima
    for (let i = 0; i < 6; i++) {
      // E concatena à variável cor
      cor += hexadecimais[Math.floor(Math.random() * 16)];
    }
    return cor;
  }

  limparTudo() {
    this.listaMandatosPreenchidos = [];
    this.mandatoSelecionado = [];
    this.bubbleChartData = [];
    this.barChartData = [];
    this.dadosGraficos = null;
    this.mostrarGrafico = false;
    this.mostrarMapa = false;
    this.mostrarTabela = true;
  }

  public gerarURLPaginaDaCidade(idCidade) {
    const url = encodeURI(`/painel-cidade/detalhes/${idCidade}`);
    return url;
  }

  public validaTreemap(): boolean {
    if (
      this.mandatoSelecionadoGrafico &&
      this.mandatoSelecionadoGrafico.treeMap != null &&
      this.mandatoSelecionadoGrafico.treeMap.length > 0
    ) {
      return true;
    } else {
      return false;
    }
  }

  escolherAnoMandato() {
    this.carregarDadosMapaResultadoComparativoCidades();
  }

  public filtrarPorFormula(posicaoFormula: any) {
    this.carregarDadosGraficosResultadoComparativoCidades(posicaoFormula);
  }

  public exibeTreemap(): boolean {
    if (
      this.mandatoSelecionado != null &&
      this.mandatoSelecionado.listaValoresPorCidade != null &&
      this.mandatoSelecionado.listaValoresPorCidade.length > 0 &&
      this.mandatoSelecionado.listaValoresPorCidade[0].indicadorMultiplo !=
        "S" &&
      this.cidadesSelecionadas.length > 1
    ) {
      return true;
    } else if (
      this.mandatoSelecionado != null &&
      this.mandatoSelecionado.listaValoresPorCidade != null &&
      this.mandatoSelecionado.listaValoresPorCidade.length > 0 &&
      this.mandatoSelecionado.listaValoresPorCidade[0].indicadorMultiplo == "S"
    ) {
      return true;
    } else {
      return false;
    }
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}indicadores-comparativo-de-cidades.jpg`
  }
}
