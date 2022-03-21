import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { InteracaoComFerramentas } from "src/app/model/Relatorio/InteracaoComFerramentas";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ExportadorRelatoriosComponent } from "../exportador-relatorios/exportador-relatorios.component";
import { RelatorioService } from "src/app/services/relatorio.service";
import { registerLocaleData } from "@angular/common";
import localePtBr from "@angular/common/locales/pt";
import { AuthService } from "src/app/services/auth.service";
import moment from "moment";
import { Router } from "@angular/router";

@Component({
  selector: "app-interacao-com-ferramentas",
  templateUrl: "./interacao-com-ferramentas.component.html",
  styleUrls: ["./interacao-com-ferramentas.component.css"]
})
export class InteracaoComFerramentasComponent implements OnInit {
  loading: boolean = false;
  nenhumRegistroEncontrado: boolean = false;
  displayedColumns: string[] = [
    "Nome do usuário",
    "Data/Hora",
    "Ferramenta",
    "Tipo de interação"
  ];
  dataSource = new MatTableDataSource<InteracaoComFerramentas>();
  filtro: InteracaoComFerramentas = new InteracaoComFerramentas();
  registros: Array<InteracaoComFerramentas> = new Array<
    InteracaoComFerramentas
  >();
  formFiltro: FormGroup;
  titulo: string = "Interação com ferramentas";
  colunas = [
    { title: "Nome do usuário", dataKey: "nomeUsuario" },
    { title: "Data/Hora", dataKey: "dataHora" },
    { title: "Ferramenta", dataKey: "ferramenta" },
    { title: "Tipo de interação", dataKey: "tipoInteracao" }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ExportadorRelatoriosComponent)
  exportador: ExportadorRelatoriosComponent;
  scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(
    private service: RelatorioService,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
    this.formFiltro = this.formBuilder.group({
      dataInicio: [""],
      dataFim: [""],
      nomeUsuario: [""],
      ferramenta: [""],
      tipoInteracao: [""]
    });
  }

  ngOnInit() {
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
    this.formFiltro.controls["dataInicio"].setValue("");
    this.formFiltro.controls["dataFim"].setValue("");
    this.formFiltro.controls["nomeUsuario"].setValue("");
    this.formFiltro.controls["ferramenta"].setValue("");
    this.formFiltro.controls["tipoInteracao"].setValue("");
  }

  gerarRelatorio() {
    this.loading = true;
    this.filtro.dataInicio = this.formFiltro.controls["dataInicio"].value;
    this.filtro.dataFim = this.formFiltro.controls["dataFim"].value;
    this.filtro.nomeUsuario = this.formFiltro.controls["nomeUsuario"].value;
    this.filtro.ferramenta = this.formFiltro.controls["ferramenta"].value;
    this.filtro.tipoInteracao = this.formFiltro.controls["tipoInteracao"].value;
    this.filtro.usuarioLogado = this.authService.credencial.login;

    this.service.searchInteracaoComFerramentas(this.filtro).subscribe(
      response => {
        this.verificaResultadoEncontrado(response);
        this.pesquisou = true;
        this.nenhumRegistroEncontrado = response.length === 0;
        this.registros = response;
        this.dataSource = new MatTableDataSource<InteracaoComFerramentas>(
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
      },
      error => {
        this.loading = false;
      }
    );
  }

  formatarParaExportar(registros: Array<InteracaoComFerramentas>): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado["nomeUsuario"] = registro.nomeUsuario;
      formatado["dataHora"] = moment(registro.dataHora).format(
        "DD/MM/YYYY HH:mm:ss"
      );
      formatado["ferramenta"] = registro.ferramenta;
      formatado["tipoInteracao"] = registro.tipoInteracao;
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
