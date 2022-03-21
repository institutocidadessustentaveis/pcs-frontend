import { Indicador } from '../../../model/indicadores';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { IndicadoresCidade } from 'src/app/model/PainelIndicadorCidades/indicadoresCidade';
import { CidadeService } from 'src/app/services/cidade.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Cidade } from 'src/app/model/cidade';
import { Router, ActivatedRoute } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { IndicadorComparativoDeCidadeService } from 'src/app/services/indicador-comparativo-de-cidade.service';

@Component({
  selector: "app-indicador-da-cidade",
  templateUrl: "./comparacao-mesma-cidade-graficos.component.html",
  styleUrls: ["./comparacao-mesma-cidade-graficos.component.css"]
})
export class CompararIndicadoresDiferentesMesmaCidadeGraficosComponent
  implements OnInit {
  urlatual: string;

  nomecidade: string;
  uf: string;

  public selected = new FormControl(0);

  public date: Date = new Date();

  indicadorDaCidade: any;
  listaCidades: any;
  filtroIndicadores: any;
  sigla = "";
  nomeCidade = "";
  idCidade = "";
  loading = true;

  dataSource = new MatTableDataSource();
  displayedColumns = [];

  //Bar CHARTS

  public listaGraficos: any[] = [];

  public barChartLabels: Label[] = [];
  public barChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    scales: {
      xAxes: [{}],
      yAxes: [
        {
          id: "y-axis-0",
          position: "left"
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

  public treeMapData: any[] = [];

  verIndicadorDescricaoForm: FormGroup;
  scrollUp: any;

  constructor(
    private indicadoresService: IndicadoresService,
    private indicadorComparativoDeCidadeService: IndicadorComparativoDeCidadeService,
    private route: ActivatedRoute,
    private service: RelatorioService,
    private authService: AuthService,
    private formBuilder: FormBuilder,private element: ElementRef
    ,private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.verIndicadorDescricaoForm = this.formBuilder.group({
      descricaoIndicador: [""]
    });
  }

  ngOnInit() {
    this.urlatual = window.location.href;
    this.idCidade = this.route.snapshot.paramMap.get("id");
    this.nomeCidade = this.route.snapshot.paramMap.get("cidade");
    this.uf = this.route.snapshot.paramMap.get("uf");

    this.route.queryParams.subscribe(params => {
      this.filtroIndicadores = params["filtroIndicadores"];
    });

    this.indicadorComparativoDeCidadeService
      .buscarComparativoDeIndicadoresMesmaCidade(
        this.idCidade,
        this.sigla,
        this.filtroIndicadores
      )
      .subscribe(res => {
        this.indicadorDaCidade = res;
        this.dataSource = new MatTableDataSource(
          this.indicadorDaCidade.valores
        );
        this.displayedColumns = this.indicadorDaCidade.cabecalho;
        //this.lineChartLabels = this.indicadorDaCidade.labels;
        this.barChartLabels = this.indicadorDaCidade.labels;
        this.barChartLabels = this.indicadorDaCidade.labels;

        let barChartData: ChartDataSets[] = [{ data: [], label: "" }];

        //this.barChartData = null;
        for (
          let i = 0;
          i < this.indicadorDaCidade.chartData[0].valores.length;
          i++
        ) {
          barChartData = [];
          for (
            let x = 0;
            x < this.indicadorDaCidade.chartData[0].valores[i].valor.length;
            x++
          ) {
            barChartData.push({
              data: this.indicadorDaCidade.chartData
                ? this.indicadorDaCidade.chartData[0].valores[i].valor[x]
                : null,
              label: this.indicadorDaCidade.chartData[0].valores[i].label
              //fill: false
            });
          }

          this.listaGraficos.push(barChartData);
        }

        this.loading = false;
      });
  }

  gerarDataSourceTabela(serieHistorica) {
    return new MatTableDataSource(serieHistorica.valores);
  }

  public exportPdf = (imgData: string) => {
    const documento = new jsPDF("p", "pt", "a4", true);

    var img = new Image();
    img.src = "/assets/pcs.png";

    documento.addImage(
      img,
      "PNG",
      documento.internal.pageSize.width / 2 - 50,
      0,
      100,
      100
    );

    let xOffset =
      documento.internal.pageSize.width / 2 -
      (documento.getStringUnitWidth(
        `${this.nomeCidade} - ${this.indicadorDaCidade.indicador} (${this.indicadorDaCidade.serieHistorica[this.selected.value].mandato})`
      ) *
        documento.internal.getFontSize()) /
        2;
    documento.setFontStyle("bold");
    documento.text(
      documento.splitTextToSize(
        `${this.nomeCidade} - ${this.indicadorDaCidade.indicador} (${this.indicadorDaCidade.serieHistorica[this.selected.value].mandato})`,
        xOffset + 200
      ),
      xOffset,
      100
    );

    documento.setFontSize(12);
    documento.text("Descrição:", 12, 185);
    documento.text("Fórmula:", 12, 215);
    documento.text("Fonte:", 12, 245);
    documento.text("ODS:", 12, 275);
    documento.text("Meta ODS:", 12, 305);
    documento.setFontStyle("normal");
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
    documento.setFontStyle("bold");
    documento.text("Série histórica:", 12, 420);
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
    documento.setFontStyle("bold");
    if (imgData != null) {
      documento.text("Gráfico:", 12, 600);
      documento.addImage(
        imgData,
        "PNG",
        12,
        610,
        documento.internal.pageSize.width - 24,
        200
      );
    }

    const date: Date = new Date();
    documento.setFontStyle("normal");
    documento.setFontSize(9);
    documento.text(
      window.location.href,
      12,
      documento.internal.pageSize.height - 5
    );
    documento.text(
      moment(date).format("DD/MM/YYYY"),
      documento.internal.pageSize.width - 60,
      documento.internal.pageSize.height - 5
    );

    documento.save(
      `${this.nomeCidade}_${this.indicadorDaCidade.indicador} _${this.indicadorDaCidade.serieHistorica[this.selected.value].mandato}.pdf`
    );
    this.service
      .gravaLogDownExport(
        this.authService.credencial.login,
        `${this.nomeCidade}_${this.indicadorDaCidade.indicador} _${this.indicadorDaCidade.serieHistorica[this.selected.value].mandato}.pdf`
      )
      .subscribe(response => {});
  };

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

  public imprimir() {
    if (
      this.indicadorDaCidade.chartData &&
      !(this.indicadorDaCidade.chartData.valor.length === 0)
    ) {
      this.exportPdf(document.getElementsByTagName("canvas")[0].toDataURL());
    } else {
      this.exportPdf(null);
    }
  }
}
