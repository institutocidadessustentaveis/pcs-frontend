import localePtBr from "@angular/common/locales/pt";
import { ItemCombo } from "./../../../../model/ItemCombo ";
import { registerLocaleData } from "@angular/common";
import { Router } from "@angular/router";
import { CidadeService } from "./../../../../services/cidade.service";
import { UsuarioService } from "./../../../../services/usuario.service";
import { RelatorioService } from "./../../../../services/relatorio.service";
import { ExportadorRelatoriosComponent } from "./../exportador-relatorios/exportador-relatorios.component";
import { FormGroup, FormBuilder } from "@angular/forms";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { RelatorioShapesCadastrados } from "./../../../../model/Relatorio/RelatorioShapesCadastrados";
import { saveAs } from "file-saver";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import moment from "moment";

@Component({
  selector: "app-shapes-cadastrados-prefeitura",
  templateUrl: "./shapes-cadastrados-prefeitura.component.html",
  styleUrls: ["./shapes-cadastrados-prefeitura.component.css"]
})
export class ShapesCadastradosPrefeituraComponent implements OnInit {
  public idShape: number;
  public usuario: number;
  public cidade: number;
  public tituloShape: string;
  public dataCriacao: string;
  public dataEdicao: string;

  public loading: boolean = false;
  public nenhumRegistroEncontrado: boolean = false;
  public displayedColumns: string[] = [
    "usuario",
    "cidade",
    "tituloShape",
    "dataCriacao",
    "dataEdicao"
  ];

  public dataSource = new MatTableDataSource<RelatorioShapesCadastrados>();
  public filtro: RelatorioShapesCadastrados = new RelatorioShapesCadastrados();
  public registros: Array<RelatorioShapesCadastrados> = new Array<RelatorioShapesCadastrados>();
  public formFiltro: FormGroup;
  public titulo = 'Relatório de Shapes Cadastrados pela Prefeitura';
  public listaUsuario: ItemCombo[] = [];
  public listaCidades = [];
  public colunas = [
    { title: "Nome do usuário", dataKey: "usuario" },
    { title: "Título do shape", dataKey: "tituloShape" },
    { title: "Data Cadastro", dataKey: "dataCriacao" },
    { title: "Data Edição", dataKey: "dataEdicao" },
    { title: "Cidade", dataKey: "cidade" }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ExportadorRelatoriosComponent)
  public exportador: ExportadorRelatoriosComponent;
  public scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(
    private service: RelatorioService,
    public formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private cidadeService: CidadeService,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
    this.formFiltro = this.formBuilder.group({
      dataCriacao: [null],
      dataEdicao: [null],
      usuario: [null],
      cidade: [null],
      tituloShape: [null]
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

    this.usuarioService
      .buscarComboBoxUsuarioDePrefeitura()
      .subscribe(response => {
        this.listaUsuario = response as ItemCombo[];
      });

    this.populaComboCidades();
  }

  gerarRelatorio() {
    this.loading = true;

    this.usuario = this.formFiltro.controls["usuario"].value;
    this.cidade = this.formFiltro.controls["cidade"].value;
    this.tituloShape = this.formFiltro.controls["tituloShape"].value;
    this.dataEdicao =
      this.formFiltro.controls["dataEdicao"].value != null
        ? moment(this.formFiltro.controls["dataEdicao"].value).format(
            "YYYY-MM-DD"
          )
        : "";
    this.dataCriacao =
      this.formFiltro.controls["dataCriacao"].value != null
        ? moment(this.formFiltro.controls["dataCriacao"].value).format(
            "YYYY-MM-DD"
          )
        : "";

    this.service
      .searchShapesCadastradosPrefeitura(
        this.usuario,
        this.cidade,
        this.dataCriacao,
        this.dataEdicao,
        this.tituloShape
      )
      .subscribe(
        response => {
          this.verificaResultadoEncontrado(response);
          this.pesquisou = true;
          this.nenhumRegistroEncontrado = response.length === 0;
          this.registros = response;
          this.dataSource = new MatTableDataSource<RelatorioShapesCadastrados>(
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

  formatarParaExportar(registros: Array<RelatorioShapesCadastrados>): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado["usuario"] = registro.usuario;
      formatado["tituloShape"] = registro.tituloShape;
      formatado["dataCriacao"] = moment(registro.dataCriacao).format(
        "DD/MM/YYYY HH:mm:ss"
      );
      formatado["dataEdicao"] = registro.dataEdicao ?  moment(registro.dataEdicao).format(
          "DD/MM/YYYY HH:mm:ss"
        ) : 'Não alterado';
     
      formatado["cidade"] = registro.cidade;
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

  private populaComboCidades() {
    this.cidadeService.buscarCidadesSignatariasParaCombo().subscribe(res => {
      this.listaCidades = res;
    });
  }
}
