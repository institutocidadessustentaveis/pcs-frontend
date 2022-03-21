import { CidadeService } from './../../../services/cidade.service';
import { Component, ViewChild, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatTable, PageEvent, Sort } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Indicador } from 'src/app/model/indicadores';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Eixo } from 'src/app/model/eixo';
import { Cidade } from 'src/app/model/cidade';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { Variavel } from 'src/app/model/variaveis';
import { FiltroIndicadores } from 'src/app/model/filtroIndicadores';
import { LiteralMapEntry } from '@angular/compiler/src/output/output_ast';
import { NgIf } from '@angular/common';

export interface DropDownList {
  value: number;
  viewValue: string;
}


@Component({
  selector: "app-indicadores-list",
  templateUrl: "./indicadores-list.component.html",
  styleUrls: ["./indicadores-list.component.css"]
})
export class IndicadoresListComponent implements OnInit {
  displayedColumns = [];
  dataSource = new MatTableDataSource<Indicador>();
  loading: any;
  isUsuarioPrefeitura = false;
  mostraBotaoAlterarExcluir = false;

  private urlEndPointEixo: string = `${environment.API_URL}eixo`;

  filtro: FiltroIndicadores = new FiltroIndicadores();
  formFiltro: FormGroup;

  //Variaveis lista DropDownList
  listaEixo: Array<Eixo>;
  listaVariaveis: Array<Variavel> = new Array<Variavel>();
  listaODS: Array<ObjetivoDesenvolvimentoSustentavel>;
  listaCidade: Array<any>;

  private orderBy = 'nome';
  private direction = 'ASC';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    
  scrollUp: any;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    private element: ElementRef,
    public activatedRoute: ActivatedRoute,
    public indicadoresService: IndicadoresService,
    public cidadeService: CidadeService,
    private http: HttpClient
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.formFiltro = this.formBuilder.group({
      eixo: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      variavel: ["", [Validators.minLength(4), Validators.maxLength(4)]],
      ods: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      nomeIndicador: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      cidade: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      valorIndicador: [
        "",
        [Validators.minLength(3), Validators.maxLength(200)]
      ],
      popDe: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      popAte: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      dataPreenchimento: [
        "",
        [Validators.minLength(3), Validators.maxLength(200)]
      ],
      nomePrefeitura: [""],
      tipologias: [""],
      modoentrada: [""]
    });
  }

  carregaColunasDinamicas() {
    this.isUsuarioPrefeitura = this.authService.isUsuarioPrefeitura();
    if (this.isUsuarioPrefeitura) {
      this.displayedColumns = ["Indicador", "Descricao", "Acoes"];
    } else {
      this.displayedColumns = ["Indicador", "Descricao", "Origem", "Acoes"];
    }
  }

  async ngOnInit() {
    this.carregaColunasDinamicas();
    this.loading = true;
    await this.carregarDados(0, 10, "nome", "ASC");
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  async carregarDados(page: number, itemsPerPage: number, orderBy: string, direction: string) {
    await this.indicadoresService.buscarIndicador(page, itemsPerPage, orderBy, direction).subscribe(
      async response => {
        this.dataSource = new MatTableDataSource<Indicador>(response.indicadores);
        this.dataSource.sort = this.sort;
        this.paginator.length = response.total;
        this.paginator._intl.itemsPerPageLabel = "Itens por página";
        this.paginator._intl.firstPageLabel = "Primeira página";
        this.paginator._intl.previousPageLabel = "Página anterior";
        this.paginator._intl.nextPageLabel = "Próxima página";
        this.paginator._intl.lastPageLabel = "Última página";
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

        this.loading = false;
        this.indicadoresService.carregaEixo().subscribe(response => {
          this.listaEixo = response;
        });

        this.indicadoresService.carregaVariaveis().subscribe(response => {
          this.listaVariaveis = response;
        });

        this.indicadoresService.carregaOds().subscribe(response => {
          this.listaODS = response;
        });
        
        this.cidadeService.buscarCidadesSignatariasParaCombo().subscribe(response => {
       	 	this.listaCidade = response as Cidade[];
      	});
      },
      error => {
        this.loading = false;
      }
    );
    this.loading = false;
  }

  public carregaEixo(): Observable<Array<Eixo>> {
    return this.http.get<Array<Eixo>>(`${this.urlEndPointEixo}`).pipe(
      catchError(e => {
        swal.fire("Erro ao carregar lista de eixo", "", "error");
        return throwError(e);
      })
    );
  }

  filtrar() {
    this.loading = true;
    this.filtro.eixo = this.formFiltro.controls["eixo"].value;

    this.filtro.variavel = this.formFiltro.controls["variavel"].value;
    this.filtro.ods = this.formFiltro.controls["ods"].value;
    this.filtro.nome = this.formFiltro.controls["nomeIndicador"].value;
    this.filtro.cidade = this.formFiltro.controls["cidade"].value;
    // De , ate
    this.filtro.popDe = this.formFiltro.controls["popDe"].value;
    this.filtro.popAte = this.formFiltro.controls["popAte"].value;

    this.filtro.valor = this.formFiltro.controls["valorIndicador"].value;
    this.filtro.dataPreenchimento = this.formFiltro.controls[
      "dataPreenchimento"
    ].value;
    if (!this.filtro.eixo) {
      this.filtro.eixo = null;
    }
    if (!this.filtro.variavel) {
      this.filtro.variavel = null;
    }
    if (!this.filtro.ods) {
      this.filtro.ods = null;
    }
    if (!this.filtro.cidade) {
      this.filtro.cidade = null;
    }

    this.indicadoresService.buscarIndicadorFiltrado(this.filtro).subscribe(
      response => {
        this.dataSource = new MatTableDataSource<Indicador>(response);
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
      },
      error => {
        this.loading = false;
      }
    );
  }

  limpar() {
    this.formFiltro.reset();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  excluir(indicador: Indicador) {
    this.loading = true;
    PcsUtil.swal()
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente excluir o indicador ${indicador.nome}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(
        result => {
          if (result.value) {
            this.indicadoresService
              .deletar(indicador.id)
              .subscribe(response => {
                this.carregarDados(0, 10, "nome", "ASC");
                PcsUtil.swal().fire(
                  "Excluído!",
                  `Indicador ${indicador.nome} excluído.`,
                  "success"
                );
              });
          } else {
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
        }
      );
  }

  public carregarPaginaIndicadores(event: PageEvent): PageEvent {
    this.carregarDados(event.pageIndex, event.pageSize, this.orderBy , this.direction);
    return event;
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();
      this.carregarDados(this.paginator.pageIndex, this.paginator.pageSize, this.orderBy , this.direction);
      this.paginator.pageIndex = 0;
    }
  }

}







