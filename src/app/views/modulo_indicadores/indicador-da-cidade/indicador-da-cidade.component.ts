import { Title } from '@angular/platform-browser';
import { ObservacaoVariavel } from './../../../model/PainelIndicadorCidades/observacaoVariavel';
import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';
import { BoaPratica } from 'src/app/model/boaPratica';
import { IndicadorDaCidadeService } from './../../../services/indicador-da-cidade.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Indicador } from './../../../model/indicadores';
import { CidadeService } from 'src/app/services/cidade.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Cidade } from 'src/app/model/cidade';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
import html2canvas from 'html2canvas';
import { InstituicaoFonte } from 'src/app/model/instituicao-fonte';
import { PainelIndicadorCidadeService } from 'src/app/services/painel-indicador-cidade.service';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { environment } from 'src/environments/environment';
import { HistoricoCompartilhamentoService } from 'src/app/services/historico-compartilhamento.service';

@Component({
  selector: 'app-indicador-da-cidade',
  templateUrl: './indicador-da-cidade.component.html',
  styleUrls: ['./indicador-da-cidade.component.css']
})

export class IndicadorDaCidadeComponent implements OnInit {

  public formFormula: FormGroup;
  public formulasIndicador;

  mandatos = [];
  ultimoMandato = [];
  graficos;

  public tabIndexSelecionadaGrafico = null;

  urlatual: string;

  public selected = new FormControl(0);

  public date: Date = new Date();

  fontes: Array<InstituicaoFonte> = new Array<InstituicaoFonte>();

  indicadorDaCidade: any = [];
  sigla = '';
  nomeCidade = '';
  idIndicador = '';
  loading = true;
  obsevacaoVariavel: ObservacaoVariavel[] = [];

  desabilitarImpressao = false;


  dataSource = new MatTableDataSource();
  displayedColumns = [];

  public paginationLimit = 3;

  //Line CHARTS
  public lineChartData: ChartDataSets[] = [
    { data: [], label: this.nomeCidade },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
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
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{
        ticks: {
          callback: (dataLabel, index) => {
            const decimalPipe = new DecimalPipe('pt-BR');
            return decimalPipe.transform(dataLabel);
          }
        }
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe('pt-BR');
              return decimalPipe.transform(dataLabel);
            }
          }
        }
      ]
    },
    annotation: {
      annotations: [],
    },
  };
  public lineChartColors: Color[] = [
    { // red
      borderColor: '#3e7152',
      pointBackgroundColor: '#50926a',
      pointBorderColor: '#356146',
      pointHoverBackgroundColor: '#356146',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;

  //Bar CHARTS
  public barChartData: ChartDataSets[] = [
    { data: [], label: this.nomeCidade },
  ];
  public barChartLabels: Label[] = [];
  public barChartOptions: (ChartOptions & { annotation: any }) = {
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
          beginAtZero: true,
          callback: (dataLabel, index) => {
            const decimalPipe = new DecimalPipe('pt-BR');
            return decimalPipe.transform(dataLabel);
          }
        }
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, index) => {
              const decimalPipe = new DecimalPipe('pt-BR');
              return decimalPipe.transform(dataLabel);
            }
          }
        }
      ]
    },
    annotation: {
      annotations: [],
    },
  };
  public barChartColors: Color[] = [
    { // red
      backgroundColor: '#3e7152',
      borderColor: '#3e7152',
      pointBackgroundColor: '#50926a',
      pointBorderColor: '#356146',
      pointHoverBackgroundColor: '#356146',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public barChartLegend = true;

  public treeMapData: any[] = [];
  scrollUp: any;

  constructor(
              private router: Router,
              private titleService: Title,
              private element: ElementRef,
              private route: ActivatedRoute,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private service: RelatorioService,
              private indicadoresService: IndicadoresService,
              private indicadorDaCidadeService: IndicadorDaCidadeService,
              private variavelPreenchidaService: VariavelPreenchidaService,
              private indicadorPreenchidoService: IndicadoresPreenchidosService,
              private painelIndicadorCidadeService: PainelIndicadorCidadeService,
              private historicoCompartilhamentoService: HistoricoCompartilhamentoService,
            ) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });

      this.formFormula = this.formBuilder.group({
        formula: [null]
      });
  }

  ngOnInit() {
    this.urlatual = window.location.href;
    this.nomeCidade = this.route.snapshot.paramMap.get('cidade');
    this.nomeCidade = PcsUtil.toSlug(this.nomeCidade);
    this.sigla = this.route.snapshot.paramMap.get('siglaestado');
    this.idIndicador = this.route.snapshot.paramMap.get('indicador');
    this.indicadorDaCidadeService.buscarIndicadorDaCidade(this.idIndicador, this.sigla, this.nomeCidade)
      .subscribe(
        res => {
          this.indicadorDaCidade = res;
          this.nomeCidade =  this.indicadorDaCidade.nomeCidade;
          this.titleService.setTitle(`${this.indicadorDaCidade.indicador} - ${this.nomeCidade} - Cidades Sustentáveis`);
          this.formulasIndicador = this.indicadorDaCidade['formula'].split('<br>');
          this.formFormula.controls.formula.setValue(0);
          this.dataSource = new MatTableDataSource(this.indicadorDaCidade.valores);
          this.displayedColumns = this.indicadorDaCidade.cabecalho;
          this.lineChartLabels = this.indicadorDaCidade.labels;
          this.lineChartData = [{data: (this.indicadorDaCidade.chartData ? this.indicadorDaCidade.chartData.valor : null),
            label: (this.indicadorDaCidade.chartData ? this.indicadorDaCidade.chartData.label : null ) }];
          this.barChartLabels = this.indicadorDaCidade.labels;
          this.barChartData = [{data: (this.indicadorDaCidade.chartData ? this.indicadorDaCidade.chartData.valor : null),
            label: (this.indicadorDaCidade.chartData ? this.indicadorDaCidade.chartData.label : null ) }];
          // this.treeMapData = this.indicadorDaCidade.treeMap;
          this.loading = false;

          this.carregarDadosGraficosResultado(0);
          this.buscarObservacaoVariavel(this.indicadorDaCidade.idIndicador, this.indicadorDaCidade.idCidade);
        } );
    this.buscarMandatos();
  }

  public salvarLogCompartilhamento (redeSocial: string) {
    this.historicoCompartilhamentoService.gerarHistoricoCompartilhamento(redeSocial, 'Indicador de Cidade').subscribe(res => {})
  }

  gerarDataSourceTabela(serieHistorica) {
    return new MatTableDataSource(serieHistorica.valores);
  }

  private buscarObservacaoVariavel(idIndicador: number, idCidade: number) {
    this.variavelPreenchidaService.buscarObservacaoVariavel(idIndicador, idCidade).subscribe(res => {
      this.obsevacaoVariavel =  res as ObservacaoVariavel[];
    });
  }

  public exportPdf = (imgData?: string) => {
    var quebraLinha = 0
    for(let fonte of this.indicadorDaCidade.fontes) {
      quebraLinha = quebraLinha + 10;
    }
      let mandatoAtual = this.indicadorDaCidade.serieHistorica[this.indicadorDaCidade.serieHistorica.length - 1]
    const documento = new jsPDF('p', 'pt', 'a4', true);

    const img = new Image();
    img.src = '/assets/pcs.png';

    documento.addImage(img, 'PNG', (documento.internal.pageSize.width / 2) - 50, 0, 100, 100 );

    let xOffset = (documento.internal.pageSize.width / 2) - (documento.getStringUnitWidth(`${this.indicadorDaCidade.nomeCidade} - ${this.indicadorDaCidade.indicador} (${mandatoAtual[0]} - ${mandatoAtual[1]})`) * documento.internal.getFontSize() / 2);
    documento.setFontStyle("bold");
    documento.text(documento.splitTextToSize(`${this.indicadorDaCidade.nomeCidade} - ${this.indicadorDaCidade.indicador} (2017-2021)`, xOffset + 200), xOffset, 100);

    documento.setFontSize(12);
    documento.text("Descrição:", 12, 185);
    documento.text("Fórmula:", 12, 215);
    documento.text("Fonte:", 12, 245);
    documento.text("ODS:", 12, 275 + quebraLinha);
    documento.text("Meta ODS:", 12, 305 + quebraLinha);
    documento.setFontStyle("normal");
    documento.text(documento.splitTextToSize(this.indicadorDaCidade.descricao, documento.internal.pageSize.width - 100), 80, 185);
    documento.text(documento.splitTextToSize(this.indicadorDaCidade.formula, documento.internal.pageSize.width - 100), 80, 215);
    documento.text(this.indicadorDaCidade.fontes, 80, 245);
    documento.text(this.indicadorDaCidade.ods, 80, 275 + quebraLinha);
    documento.text(documento.splitTextToSize(this.indicadorDaCidade.meta, documento.internal.pageSize.width - 100), 80, 305 + quebraLinha);

    documento.setFontSize(12);
    documento.setFontStyle("bold");
    documento.text("Série histórica:", 12, 420 );
    const headers: string[] = this.indicadorDaCidade.serieHistorica[0];
    const rows: Array<string[]> = [];
    for (const valor of this.indicadorDaCidade.serieHistorica) {
      rows.push(valor);
    }
    documento.autoTable({
      tableWidth: 'auto',
      tableHeight: 'auto',
      startY: 430,
      satartX: 0,
      head: [headers],
      body: [rows[1], rows[2], rows[3], rows[4]]
    });

    documento.setFontSize(12);
    documento.setFontStyle("bold");
    if (imgData != null) {
      documento.text("Gráfico:", 12, 600 );
      documento.addImage(imgData, 'PNG', 12, 610, documento.internal.pageSize.width - 24, 200 );
    }

    const date: Date = new Date();
    documento.setFontStyle("normal");
       const margins = {
      top: 40,
      bottom: 60,
      left: 40,
      width: 522
    };
    documento.setFontSize(9);
    documento.text(window.location.href, 12, documento.internal.pageSize.height - 5);
    documento.text(moment(date).format('DD/MM/YYYY'), documento.internal.pageSize.width - 60, documento.internal.pageSize.height - 5);

    documento.save(`${this.indicadorDaCidade.nomeCidade}_${this.indicadorDaCidade.indicador}_${mandatoAtual[0]}${mandatoAtual[1] ? '_' + mandatoAtual[1] : ''}.pdf`);
    this.service.gravaLogDownExport(this.authService.credencial.login, `${this.indicadorDaCidade.nomeCidade}_${this.indicadorDaCidade.indicador} _${this.indicadorDaCidade.serieHistorica[this.selected.value].mandato}.pdf`).subscribe(response => { this.desabilitarImpressao = false; });
  }

  public imprimir() {
    this.desabilitarImpressao = true;
    
    if (document.getElementsByTagName('canvas')[0]) {
      this.exportPdf(document.getElementsByTagName('canvas')[0].toDataURL());
    }
    else {
      this.exportPdf();
    }
  }

  public async imprimirTreeMap() {
    let pngImg;
    await html2canvas(document.getElementById('divTreeMap')).then(function (canvas) {
      pngImg = canvas.toDataURL();
    });
    this.exportPdf(pngImg);
  }

  public tipoDeGraficoSelecionado(event: any) {
    this.tabIndexSelecionadaGrafico = event.index;
  }

  buscarMandatos() {
    this.painelIndicadorCidadeService.buscarMandatos().subscribe(res => {
      let mandatos = res;
      for (let mandato of mandatos) {
        mandato[0] = Number(mandato[0]);
        mandato[1] = Number(mandato[1]);
      }
      this.mandatos = mandatos;
      for (let mandato of mandatos){
        this.ultimoMandato = mandato[2];
      }
    });
  }

  public carregarDadosGraficosResultado(indexFormula) {
    this.desabilitarImpressao = true;
    this.indicadorPreenchidoService
      .buscarPreenchidosGrafico(this.idIndicador, this.indicadorDaCidade.idCidade, indexFormula)
      .subscribe(res => {
        let dados: any = res;
        for (let i = 0; i < dados.graficos.length; i++) {
          const valores = dados.graficos[i].valores;
          dados.graficos[i].dataset = this.getDataSet(
            valores
          );
        }
        this.graficos = dados;
        this.desabilitarImpressao = false;
      });
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

  public filtrarPorFormula(posicaoFormula: any) {
    this.carregarDadosGraficosResultado(posicaoFormula);
  }

  carregarMaisNoticias() {
    this.paginationLimit += 3;
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}foto-de-todos-os-indicadores.jpg`
  }
}
