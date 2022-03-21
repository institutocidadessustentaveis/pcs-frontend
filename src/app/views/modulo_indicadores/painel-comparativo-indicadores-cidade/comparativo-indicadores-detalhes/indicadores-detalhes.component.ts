import { VariavelPreenchida } from './../../preenchimento-indicadores/preenchimento-indicadores-variaveis/preenchimento-indicadores-variaveis.component';
import { VariaveisPreenchidas } from './../../../../model/variaveis-preenchidas';
//import { VariavelPreenchidaService } from './../../../../services/variavelPreenchida.service';
import { cidade } from './../../../../model/PainelIndicadorCidades/cidade';
import { BoaPratica } from 'src/app/model/boaPratica';
import { IndicadorComparativoDeCidadeService } from '../../../../services/indicador-comparativo-de-cidade.service';
import { MatTableDataSource } from '@angular/material';
// import { Indicador } from './../../../model/indicadores';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartType, ChartOptions, ChartPoint } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { InstituicaoFonte } from 'src/app/model/instituicao-fonte';
import { Variavel } from 'src/app/model/variaveis';
import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';
import { color } from 'html2canvas/dist/types/css/types/color';

@Component({
  selector: 'app-indicador-da-cidade',
  templateUrl: './indicadores-detalhes.component.html',
  styleUrls: ['./indicadores-detalhes.component.css']
})
export class IndicadoresDetalhesComponent implements OnInit {
  urlatual: string;
  dataAtual = new Date();

  public selected = new FormControl(0);

  public date: Date = new Date();

  public boasPraticasRelacionadas: BoaPratica[] = [];

  fontes: Array<InstituicaoFonte> = new Array<InstituicaoFonte>();

  variavelSelecionada: any;
  indicadorDaCidade: any;
  listaCidades: any;
  filtroCidades: any;
  nomeCidade = '';
  idIndicador = '';
  loading = true;
  graficos = [];
  anoLabelInterativo = '';
  listaVariaveis: Array<Variavel> = new Array<Variavel>();
  formFiltro: FormGroup;

  variavelPreenchida: VariaveisPreenchidas = new VariaveisPreenchidas();

  aux: Array<ChartPoint> = new Array<ChartPoint>();

  dataSource = new MatTableDataSource();
  displayedColumns = [];

  // Line CHARTS
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left'
        }
      ]
    },
    annotation: {
      annotations: []
    }
  };


  public lineChartColors: Color[] = [
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
      pointHoverBorderColor: 'rgba(148,159,177,0.0)' ,
      pointRadius: 5
    },
  ];


  public lineChartLegend: [
    {
      display: false,
      color: '#43459d',

    }
  ]


  // Bar CHARTS
  public barChartData: ChartDataSets[] = [];
  public barChartLabels: Label[] = [];
  public barChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    tooltips: {
      callbacks: {
        title:() => {return ''},
        label: (tooltipItem, data) => {
          return `${(data.datasets[tooltipItem.datasetIndex].label)} - ${tooltipItem.yLabel} `;
        }
      }
    },
    scales: {
      xAxes: [{}],
      yAxes: [{}]
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


  // Booble CHARTS
  public bubbleChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          }
        }
      ]
    }
  };
  public bubbleChartType: ChartType = 'bubble';
  public bubbleChartLegend = true;

  public bubbleChartData: ChartDataSets[] = [

  ];

  public bubbleChartColors: Color[] = [
    {
      backgroundColor: [
        'red',
        'green',
        'blue',
        'purple',
        'yellow',
        'brown',
        'magenta',
        'cyan',
        'orange',
        'pink'
      ]
    }
  ];



  public treeMapData: any[] = [];

  verIndicadorDescricaoForm: FormGroup;
  scrollUp: any;

  constructor(
    private indicadoresService: IndicadoresService,
    private indicadorComparativoDeCidadeService: IndicadorComparativoDeCidadeService,
    private route: ActivatedRoute,
    private boaPraticaService: BoaPraticaService,
    private service: RelatorioService,
    private VariavelPreenchidaService: VariavelPreenchidaService,
    private authService: AuthService,
    private formBuilder: FormBuilder,private element: ElementRef
    ,private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.verIndicadorDescricaoForm = this.formBuilder.group({
      descricaoIndicador: ['']
    });
    this.formFiltro = this.formBuilder.group({
      variavel: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.urlatual = window.location.href;
    this.nomeCidade = '';
    this.idIndicador = this.route.snapshot.paramMap.get('id');

    this.route.queryParams.subscribe(params => {
      this.filtroCidades = params['filtroCidades'];
    });

    this.indicadorComparativoDeCidadeService.buscarIndicadorComparativoDeCidades(this.idIndicador, this.filtroCidades)
      .subscribe(res => {
        this.indicadorDaCidade = res;
        if (this.indicadorDaCidade.numerico) {
          this.dataSource = new MatTableDataSource(
            this.indicadorDaCidade.valores
          );
          this.displayedColumns = this.indicadorDaCidade.cabecalho;

          for (let i = 0; i < this.indicadorDaCidade.graficos.length; i++) {
            const valores = this.indicadorDaCidade.graficos[i].valores;
            this.indicadorDaCidade.graficos[i].dataset = this.getDataSet(
              valores
            );
          }
          this.graficos = this.indicadorDaCidade.graficos;
        }
        this.loading = false;

        this.indicadoresService.carregaVariaveis().subscribe(response => {
          this.listaVariaveis = response;

          //this.listaVariaveis = this.listaVariaveis.filter(variavelPreenchida => { if (variavelPreenchida.tipo === 'Numérico inteiro' || 'Numérico decimal'  )  return  variavelPreenchida }

          let listafiltrada: Variavel[] = [] ;

          for (let Variavel of this.listaVariaveis) {
            if(Variavel.tipo === 'Numérico inteiro' || Variavel.tipo === 'Numérico decimal') {
              listafiltrada.push(Variavel);
            }
          }
          this.listaVariaveis = listafiltrada;

        });

      });

    this.buscarBoasPraticasRelacionadas();
  }

  gerarDataSourceTabela(serieHistorica) {
    return new MatTableDataSource(serieHistorica.valores);
  }

  private buscarBoasPraticasRelacionadas() {
    this.boaPraticaService
      .buscarBoasPraticasRelacionadasAoIndicador(this.idIndicador)
      .subscribe(response => {
        this.boasPraticasRelacionadas = response as Array<BoaPratica>;
      });
  }

  public exportPdf = (imgData: string) => {
    const documento = new jsPDF('p', 'pt', 'a4', true);

    let img = new Image();
    img.src = '/assets/pcs.png';

    documento.addImage(
      img,
      'PNG',
      documento.internal.pageSize.width / 2 - 50,
      0,
      100,
      100
    );

    const xOffset =
      documento.internal.pageSize.width / 2 -
      (documento.getStringUnitWidth(
        `${this.nomeCidade} - ${this.indicadorDaCidade.indicador} (${
          this.indicadorDaCidade.serieHistorica[this.selected.value].mandato
        })`
      ) *
        documento.internal.getFontSize()) /
        2;
    documento.setFontStyle('bold');
    documento.text(
      documento.splitTextToSize(
        `${this.nomeCidade} - ${this.indicadorDaCidade.indicador} (${
          this.indicadorDaCidade.serieHistorica[this.selected.value].mandato
        })`,
        xOffset + 200
      ),
      xOffset,
      100
    );

    documento.setFontSize(12);
    documento.text('Descrição:', 12, 185);
    documento.text('Fórmula:', 12, 215);
    documento.text('Fonte:', 12, 245);
    documento.text('ODS:', 12, 275);
    documento.text('Meta ODS:', 12, 305);
    documento.setFontStyle('normal');
    documento.text(
      documento.splitTextToSize(
        this.indicadorDaCidade.descricao,
        documento.internal.pageSize.width - 100
      ),
      80,
      185
    );
    documento.text(this.indicadorDaCidade.formula, 80, 215);
    documento.text(this.indicadorDaCidade.fonte, 80, 245);
    documento.text(this.indicadorDaCidade.ods, 80, 275);
    documento.text(
      documento.splitTextToSize(
        this.indicadorDaCidade.meta,
        documento.internal.pageSize.width - 100
      ),
      80,
      305
    );

    documento.setFontSize(12);
    documento.setFontStyle('bold');
    documento.text('Série histórica:', 12, 420);
    const headers: string[] = this.indicadorDaCidade.serieHistorica[
      this.selected.value
    ].cabecalho;
    const rows: Array<string[]> = [];
    for (const valor of this.indicadorDaCidade.serieHistorica[
      this.selected.value
    ].valores) {
      rows.push(valor);
    }
    documento.autoTable({
      startY: 430,
      satartX: 0,
      head: [headers],
      body: [rows[0], rows[1], rows[2], rows[3]]
    });

    documento.setFontSize(12);
    documento.setFontStyle('bold');
    if (imgData != null) {
      documento.text('Gráfico:', 12, 600);
      documento.addImage(
        imgData,
        'PNG',
        12,
        610,
        documento.internal.pageSize.width - 24,
        200
      );
    }

    const date: Date = new Date();
    documento.setFontStyle('normal');
    documento.setFontSize(9);
    documento.text(
      window.location.href,
      12,
      documento.internal.pageSize.height - 5
    );
    documento.text(
      moment(date).format('DD/MM/YYYY'),
      documento.internal.pageSize.width - 60,
      documento.internal.pageSize.height - 5
    );

    documento.save(
      `${this.nomeCidade}_${this.indicadorDaCidade.indicador} _${
        this.indicadorDaCidade.serieHistorica[this.selected.value].mandato
      }.pdf`
    );
    this.service
      .gravaLogDownExport(
        this.authService.credencial.login,
        `${this.nomeCidade}_${this.indicadorDaCidade.indicador} _${
          this.indicadorDaCidade.serieHistorica[this.selected.value].mandato
        }.pdf`
      )
      .subscribe(response => {});
  }

  public imprimir() {
    if (
      this.indicadorDaCidade.chartData &&
      !(this.indicadorDaCidade.chartData.valor.length === 0)
    ) {
      this.exportPdf(document.getElementsByTagName('canvas')[0].toDataURL());
    } else {
      this.exportPdf(null);
    }
  }

  getDataSet(valores) {
    const chartData: ChartDataSets[] = [];
    for (let i = 0; i < valores.length; i++) {
      chartData.push({
        data: valores[i] ? valores[i].valor : null,
        label: valores[i] ? valores[i].label : null,
        fill: false
      });
    }
    return chartData;
  }

  async executarDispersaoAnimadaBubble() {
    this.variavelSelecionada = this.formFiltro.controls['variavel'].value;

    this.bubbleChartData = [];
    for (const nomeCidade of this.indicadorDaCidade.cidadesDispersaoAnimada) {
      this.bubbleChartData.push({
        data: [],
        label: nomeCidade,
        fill: false
      });
    }

    for (const ano of this.indicadorDaCidade.labelsDispersaoAnimada) {
      let anoEncontrado = false;
      this.anoLabelInterativo = ano;
      for(const registro of this.indicadorDaCidade.dispersao){

        // Consulto na tabela variavelPreenchida valor da variavel considerando cidade e o ano
        this.buscaValorIndicador(registro.ano, registro.idCidade, this.variavelSelecionada.id);
        let raio = null;
        raio = this.calculaRaioProporcional(registro.populacaocidade);

        if(ano == registro.ano){
          let aux=1;
          for(let chartData of this.bubbleChartData){
            if(registro.cidade == chartData.label){
              const valor  = registro.valor;
              const valorNumerico =   Number(valor);
              let c = [{x: valorNumerico , y: this.variavelPreenchida.valor , r: raio}];
              chartData.data = c;

              if(aux === 1) {
                chartData.backgroundColor = 'green';
              } else if(aux === 2) {
                chartData.backgroundColor = 'blue';
              } else {
                chartData.backgroundColor = 'red';
              }
              anoEncontrado = true;
            }
          aux++;
          }
        }
      }
      if(anoEncontrado){
        await this.delay(3000);
      }

    }
  }

  async executarDispersaoAnimadaLinha() {
    this.barChartData = [];
    for (const nomeCidade of this.indicadorDaCidade.cidadesDispersaoAnimada) {
      this.barChartData.push({
        data: [] ,
        label: nomeCidade,
        fill: false
      });
    }

    for (const ano of this.indicadorDaCidade.labelsDispersaoAnimada) {
      let anoEncontrado = false;
      this.anoLabelInterativo = ano;
      for(const registro of this.indicadorDaCidade.dispersao){
        if(ano == registro.ano){
          for(let chartData of this.barChartData){
            if(registro.cidade == chartData.label){
              chartData.data = [registro.valor];
              anoEncontrado = true;
            }
          }
        }
      }
      if(anoEncontrado){
        await this.delay(3000);
      }

    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async buscaValorIndicador(ano, idCidade, idVariavel) {
    await this.VariavelPreenchidaService.buscarVariavelPreenchidalId(ano, idCidade, idVariavel).subscribe(async res => {
      this.variavelPreenchida = res;
    }, error => {this.loading = false });
  }

  calculaRaioProporcional(popCidade) {
    let vMin: number;
    let vMax: number;
    let vMin2: number;
    let vMax2: number;
    vMin = 0;
    vMax = 1000000;
    vMin2 = 10;
    vMax2 = 80;
    let raioCalculado: number;

    // Usar a propria populacao da cidade como valorMaximo para cidades com acima de 1 milhão de habitantes
    if(popCidade > vMax) {
      vMax = popCidade;
    }

    raioCalculado = (((popCidade - vMin) / (vMax - vMin)) * (vMax2 - vMin2) + vMin2 );

    return raioCalculado;

  }

}
