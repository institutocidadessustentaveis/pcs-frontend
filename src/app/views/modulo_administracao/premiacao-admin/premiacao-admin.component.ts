import { cidade } from './../../../model/PainelIndicadorCidades/cidade';
import { PremiacaoPrefeitura } from './../../../model/premiacao-prefeitura';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent, Sort } from '@angular/material';
import { Premiacao } from '../../../model/premiacao';
import { PremiacaoService } from 'src/app/services/premiacao.service';
import { AuthService } from 'src/app/services/auth.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { StatusPremiacao } from 'src/app/model/enums/premiacao-enum';
import * as XLSX from 'xlsx';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-premiacao-admin",
  templateUrl: "./premiacao-admin.component.html",
  styleUrls: ["./premiacao-admin.component.css"]
})
export class PremiacaoAdminComponent implements OnInit {
  dataSource = new MatTableDataSource<Premiacao>();
  displayedColumns = ["inicio", "fim", "descricao", "status", "acoes"];

  titulo: string = "Cidades Inscritas Premiação";
  nomeArquivo: string = "CidadesInscritas";
  registros: PremiacaoPrefeitura[] = [];
  loading = false;
  scrollUp: any;

  private orderBy: string = 'inicio';

  private direction: string = 'DESC';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public premiacaoService: PremiacaoService,
              public activatedRoute: ActivatedRoute,
              public authService: AuthService,
              private service: RelatorioService,
              private element: ElementRef,
              private router: Router,) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();

    if (filterValue === undefined || filterValue === "" || filterValue.length < 3) {
      this.carregaLista(0, 10, 'inicio', 'DESC');
    } else {
      this.buscarPorDescricao(filterValue);
    }
  }

  ngOnInit() {
    this.carregaLista(0, 10, 'inicio', 'DESC');
  }

  carregaLista(page: number, itemsPerPage: number, orderBy: string, direction: string) {
    this.premiacaoService.buscarTodos(page, itemsPerPage, orderBy, direction).subscribe(response => {
      this.dataSource = new MatTableDataSource(response.premiacoes);
      this.dataSource.sort = this.sort;
      this.paginator.length = response["total"];
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
    });
  }

  buscarPorDescricao(descricao: string) {
    this.premiacaoService.buscarPorDescricao(descricao).subscribe(response => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
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
    });
  }

  public deletarPremiacao(premiacao: Premiacao): void {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true
    });

    PcsUtil.swal()
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente excluir a premiação ${premiacao.descricao}`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        reverseButtons: false
      })
      .then(result => {
        if (result.value) {
          this.premiacaoService
            .deletarPremiacao(premiacao.id)
            .subscribe(response => {
              PcsUtil.swal().fire(
                "Excluído!",
                `Premiação ${premiacao.descricao} excluída.`,
                "success"
              );
              this.carregaLista(0, 10, 'inicio', 'DESC');
            });
        }
      });
  }

  public getKey(value: string): any {
    return StatusPremiacao[value];
  }

  async exportXls(premiacao: Premiacao) {
    await this.activatedRoute.params.subscribe(
      async params => {
        if (premiacao) {
          await this.premiacaoService
            .buscarCidadesInscritas(premiacao.id)
            .subscribe(
              async response => {
                this.registros = response;

                const workBook = XLSX.utils.book_new();

                const workSheet = XLSX.utils.json_to_sheet(
                  PcsUtil.buildDataToReport(this.titulo, this.registros)
                );
                XLSX.utils.book_append_sheet(workBook, workSheet, "Registros");
                XLSX.writeFile(workBook, this.nomeArquivo + ".xlsx");
                this.service
                  .gravaLogDownExport(
                    this.authService.credencial.login,
                    this.titulo + "(Xlsx)"
                  )
                  .subscribe(response => {});
              },
              error => {

              }
            );
        } else {

        }
      },
      error => {

      }
    );
  }

  formatarParaExportar(registros: PremiacaoPrefeitura[]): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado["prefeitura"] = registro.prefeitura;
      formatados.push(formatado);
    });
    return formatados;
  }

  public carregarPaginaPremiacoes(event: PageEvent): PageEvent {
    let sortColumn: string = "inicio";

    if(this.sort.active != undefined) {
      sortColumn = this.sort.active;
    }

    this.carregaLista(event.pageIndex, event.pageSize, sortColumn, this.sort.direction.toUpperCase());
    return event;
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();
      this.carregaLista(this.paginator.pageIndex, this.paginator.pageSize, this.orderBy , this.direction);
    }
  }
}
