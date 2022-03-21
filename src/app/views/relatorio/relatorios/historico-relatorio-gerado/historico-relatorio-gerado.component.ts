import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { RelatorioService } from "src/app/services/relatorio.service";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import localePtBr from "@angular/common/locales/pt";
import { registerLocaleData } from "@angular/common";
// Exportação de arquivos
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import { Document, Paragraph, Packer } from "docx";
// Model
import { HistoricoRelatorioGerado } from "../../../../model/Relatorio/HistoricoRelatorioGerado";
import { PcsUtil } from "src/app/services/pcs-util.service";
import moment from "moment";
import { UsuarioService } from "src/app/services/usuario.service";
import { ItemCombo } from "src/app/model/ItemCombo ";

@Component({
  selector: "app-historico-relatorio-gerado",
  templateUrl: "./historico-relatorio-gerado.component.html",
  styleUrls: ["./historico-relatorio-gerado.component.css"]
})
export class HistoricoRelatorioGeradoComponent implements OnInit {
  date = new Date();
  displayedColumns: string[] = ["nomeUsuario", "data", "hora", "nomeRelatorio"];
  dataSource = new MatTableDataSource<HistoricoRelatorioGerado>();
  historicoRelatorioGerado: HistoricoRelatorioGerado = new HistoricoRelatorioGerado();
  tabela: Array<HistoricoRelatorioGerado> = new Array<
    HistoricoRelatorioGerado
  >();
  loading: any;
  formRelatorio: FormGroup;
  titulo: string = "Relatórios Gerados";
  listaUsuario = [];
  colunas: any[] = [
    { title: "Data", dataKey: "data" },
    { title: "Hora", dataKey: "hora" },
    { title: "Usuário", dataKey: "nomeUsuario" },
    { title: "Arquivo", dataKey: "nomeRelatorio" }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() idRelatorio: number;
  scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(
    public relatorioService: RelatorioService,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    private element: ElementRef,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
    this.formRelatorio = this.formBuilder.group({
      dataInicio: [""],
      dataFim: [""],
      dataHora: [""],
      usuario: [""],
      nomeRelatorio: [""]
    });
  }

  ngOnInit() {
    this.tabela = [];
    this.historicoRelatorioGerado.id = 0;
    this.historicoRelatorioGerado.nomeUsuario = "";
    this.historicoRelatorioGerado.nomeRelatorio = "";
    this.historicoRelatorioGerado.usuarioLogado = this.authService.credencial.login;
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = "Primeira página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.nextPageLabel = "Próxima página";
    this.paginator._intl.lastPageLabel = "Última página";
    this.loading = false;

    this.usuarioService.buscarComboBoxUsuario().subscribe(response => {
      this.listaUsuario = response as ItemCombo[];
    });
  }

  searchReport() {
    this.loading = true;

    //Build Object to send
    this.historicoRelatorioGerado.dataInicio = this.formRelatorio.controls[
      "dataInicio"
    ].value;
    this.historicoRelatorioGerado.dataFim = this.formRelatorio.controls[
      "dataFim"
    ].value;
    this.historicoRelatorioGerado.nomeUsuario = this.formRelatorio.controls[
      "usuario"
    ].value.label;
    this.historicoRelatorioGerado.nomeRelatorio = this.formRelatorio.controls[
      "nomeRelatorio"
    ].value;

    this.relatorioService
      .searchHistoricoRelatorio(this.historicoRelatorioGerado)
      .subscribe(
        response => {
          this.verificaResultadoEncontrado(response);
          this.pesquisou = true;
          this.dataSource = new MatTableDataSource<HistoricoRelatorioGerado>(
            response
          );
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
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.paginator._intl.firstPageLabel = "Primeira página";
          this.paginator._intl.previousPageLabel = "Página anterior";
          this.paginator._intl.nextPageLabel = "Próxima página";
          this.paginator._intl.lastPageLabel = "Última página";
          this.tabela = response;
        },
        error => {
          this.loading = false;
        }
      );
  }

  formatarParaExportar(registros: HistoricoRelatorioGerado[]): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado["data"] = moment(registro.dataHora).format("DD/MM/YYYY");
      formatado["hora"] = moment(registro.dataHora).format("HH:MM:SS");
      formatado["nomeUsuario"] = registro.nomeUsuario;
      formatado["nomeRelatorio"] = registro.nomeRelatorio;

      formatados.push(formatado);
    });
    return formatados;
  }

  verificaResultadoEncontrado(res: any) {
    if (res != null && res !== undefined && res.length > 0) {
      this.resultadoEncontrado = true;
      this.loading = false;
    } else {
      this.resultadoEncontrado = false;
      this.loading = false;
    }
  }
}
