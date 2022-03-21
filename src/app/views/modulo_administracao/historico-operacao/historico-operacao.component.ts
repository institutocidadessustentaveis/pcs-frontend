import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer } from "docx";
import { AuthService } from 'src/app/services/auth.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';


var moment = require('moment');

import { HistoricoOperacaoService } from 'src/app/services/historico-operacao.service';
import { MatDatepicker } from '@coachcare/datepicker';
import { Router } from '@angular/router';

@Component({
  selector: "app-historico-operacao",
  templateUrl: "./historico-operacao.component.html",
  styleUrls: ["./historico-operacao.component.css"]
})
export class HistoricoOperacaoComponent implements OnInit {
  resultados: any[] = [];
  listaModulos: any[] = [];
  displayedColumns: string[] = ["Data", "Usuario", "TipoAcao", "Modulo"];
  dataSource = new MatTableDataSource<any>();
  loading: boolean = false;
  exibirMensagemAlerta: boolean = false;
  formFiltro: FormGroup;

  dataInicio: any;
  dataFim: any;

  termoBuscaUsuario: string = "";

  moduloSelecionado: any;

  filtrado = false;

  titulo = "Histórico de Operação";
  nomeArquivo: string ;
  date: Date = new Date();
  resultadosExportacao: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  private orderBy: string = 'data';

  private direction: string = 'DESC';

  scrollUp: any;

  constructor(
    public historicoService: HistoricoOperacaoService,
    public formBuilder: FormBuilder,
    private element: ElementRef,
    private router: Router,
    private service: RelatorioService,
    private authService: AuthService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.formFiltro = this.formBuilder.group({
      termoBuscaUsuario: [
        "",
        [Validators.minLength(3), Validators.maxLength(200)]
      ],
      dataInicio: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      dataFim: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      moduloSelecionado: [
        "",
        [Validators.minLength(3), Validators.maxLength(200)]
      ]
    });
  }

  ngOnInit() {
    this.carregarModulos();
    this.carregarHistorico(0, 10, "data", "DESC");
    this.initExportar(0,10);
    this.nomeArquivo = this.titulo.replace(/\s/g, '');
  }

  public carregarHistorico(page: number, quantity: number, orderBy: string, direction: string) {
    this.loading = true;

    this.historicoService
      .buscarHistoricoOperacao(page, quantity, orderBy, direction)
      .subscribe(res => {
        this.atualizarTabelaHistorico(res);
        this.loading = false;
      });
  }

  public carregarHistoricoFiltro(page: number, quantity: number) {
    this.loading = true;

    let dataInicioString;

    this.dataInicio = this.formFiltro.controls.dataInicio.value;
    this.dataFim = this.formFiltro.controls.dataFim.value;

    if(this.dataInicio != undefined && this.dataInicio != "") {
      dataInicioString = this.dataInicio.format('YYYY-MM-DDTHH:mm:SS.sssZ');
    }

    let dataFimString;

    if(this.dataFim != undefined && this.dataFim != "") {
      dataFimString = this.dataFim.format('YYYY-MM-DDTHH:mm:SS.sssZ');
    }

    this.historicoService
      .filtrar(
        this.termoBuscaUsuario,
        this.moduloSelecionado,
        dataInicioString,
        dataFimString,
        page,
        quantity
      )
      .subscribe(res => {
        this.atualizarTabelaHistorico(res);
        this.loading = false;
      });
  }

  public carregarModulos() {
    this.historicoService.listarModulos().subscribe(resp => {
      this.listaModulos = resp as any[];
    });
  }

  public filtrarRegistros(event: PageEvent) {
    // Zera a paginacao toda vez que o filtro for acionado
    this.paginator.pageIndex = 0;
    this.filtrado = true;
    this.carregarHistoricoFiltro(0, 10);
    this.initExportar(0,10);
  }

  public carregarPaginaHistorico(event: PageEvent): PageEvent {
    if (this.filtrado) {
      this.carregarHistoricoFiltro(event.pageIndex, event.pageSize);
    } else {
      this.carregarHistorico(event.pageIndex, event.pageSize, this.sort.active, this.sort.direction.toUpperCase());
    }
    return event;
  }

  limpar() {
    this.formFiltro.reset();

    this.carregarHistoricoFiltro(0, 10);
  }

  private atualizarTabelaHistorico(res: any[]) {
    this.resultados = res["historico"] as any[];
    this.exibirMensagemAlerta = this.resultados.length === 0;

    this.resultados.forEach(r => {
      r["data"] = moment.utc(r["data"]);
    });

    this.dataSource = new MatTableDataSource<any>(this.resultados);
    this.dataSource.sort = this.sort;
    this.paginator.length = res["total"];
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length == 0 || pageSize == 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
    this.paginator._intl.firstPageLabel = "Primeira página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.nextPageLabel = "Próxima página";
    this.paginator._intl.lastPageLabel = "Última página";
  }


  private initExportar(page: number, quantity: number) {
    this.loading = true;

    let dataInicioString;

    this.dataInicio = this.formFiltro.controls.dataInicio.value;
    this.dataFim = this.formFiltro.controls.dataFim.value;

    if (this.dataInicio != undefined && this.dataInicio != "") {
      dataInicioString = this.dataInicio.format("YYYY-MM-DDTHH:mm:SS.sssZ");
    }

    let dataFimString;

    if (this.dataFim != undefined && this.dataFim != "") {
      dataFimString = this.dataFim.format("YYYY-MM-DDTHH:mm:SS.sssZ");
    }

    this.historicoService
      .filtrarSemPaginacao(
        this.termoBuscaUsuario,
        this.moduloSelecionado,
        dataInicioString,
        dataFimString,
        page,
        quantity
      )
      .subscribe(res => {
        this.resultadosExportacao = res["historico"] as any[];
        this.loading = false;
      });
  }

  private formatarParaExportar(): any[] {
    let formatados: any[] = [];
    this.resultadosExportacao.forEach(registro => {
      let formatado: {} = {};
      formatado['data'] = moment(registro.data).format("DD/MM/YYYY HH:mm:ss");
      formatado['usuario'] = registro['usuario'];
      formatado['tipoacao'] = registro.tipoAcao;
      formatado['modulo'] = registro.modulo ? registro.modulo.descricao : 'N/A';
      formatados.push(formatado);
    });

    return formatados;
  }

  public exportXls() {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(PcsUtil.buildDataToReport(this.titulo, this.formatarParaExportar()));
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
    XLSX.writeFile(workBook, this.nomeArquivo + '_' + this.date.toLocaleDateString() + '.xlsx');
    this.service.gravaLogDownExport(this.authService.credencial.login, this.titulo + "(Xlsx)").subscribe(response => { });
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();
      this.carregarHistorico(this.paginator.pageIndex, this.paginator.pageSize, this.orderBy , this.direction);
    }
  }

}
