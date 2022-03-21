import { Component, OnInit, ViewChild, ElementRef, HostListener, Output } from '@angular/core';
import { Cidade } from 'src/app/model/cidade';
import { MatDialog, MatDialogConfig, MatDialogRef, MatPaginator, MatSort, MatTableDataSource, Sort } from '@angular/material';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CidadeService } from 'src/app/services/cidade.service';
import { PageEvent } from '@angular/material/paginator';
import { PaginatorComponent } from 'src/app/components/paginator/paginator.component';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { EventEmitter } from 'events';
import { PontoFocalDetalhesComponent } from './ponto-focal-detalhes/ponto-focal-detalhes.component';

@Component({
  selector: "app-cidade",
  templateUrl: "./cidade.component.html",
  styleUrls: ["./cidade.component.css"]
})
export class CidadeComponent implements OnInit {
  private orderBy = 'nome';
  private direction = 'ASC';

  resultados = [];
  loading = true;
  length = 100;
  pageSize = 10;

  displayedColumns = ["pais", "estado", "cidade", "continente", "acoes"];
  dataSource = new MatTableDataSource<Cidade>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scrollUp: any;

  constructor(
    public cidadesService: CidadeService,
    public activatedRoute: ActivatedRoute,
    private element: ElementRef,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.buscarCidades(0, this.pageSize, this.orderBy , this.direction);
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();
      this.buscarCidades(0, this.pageSize, this.orderBy , this.direction);
      this.paginator.pageIndex = 0;
    }
  }

  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim();

    if (
      filterValue === undefined ||
      filterValue === "" ||
      filterValue.length < 3
    ) {
      this.buscarCidades(0, this.pageSize, this.orderBy , this.direction);
    } else {
      this.buscarCidadePorNome(filterValue, 0, 10);
    }
  }

  public buscarCidades(page: number, linesPerPage: number, orderBy: string, direction: string) {
    this.loading = true;
    this.pageSize = linesPerPage;
    this.cidadesService
      .buscarComPaginacao(page, linesPerPage, orderBy, direction)
      .subscribe(response => {
        this.resultados = response;
        this.dataSource = new MatTableDataSource(response.listaCidades);
        this.dataSource.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) return property.split('.').reduce((o, i) => o[i], item)
          return item[property];
        };
        this.dataSource.sort = this.sort;
        this.paginator.length = response.quantidadeTotal;
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
      });
  }

  public buscarCidadePorNome(nome: string, page: number, itemsPerPage: number) {
    this.cidadesService
      .buscarPorNome(nome, page, itemsPerPage)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response.listaCidades);
        this.dataSource.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) return property.split('.').reduce((o,i)=>o[i], item)
          return item[property];
       };
        this.dataSource.sort = this.sort;
        this.paginator.length = response.quantidadeTotal;
        this.loading = false;
      });
  }

  public carregarDadosIBGE() {
    this.loading = true;
    this.cidadesService.carregarDadosIBGE().subscribe(response => {
      this.cidadesService
        .enviarDadosAtualizadosDoIBGE(response)
        .subscribe(response => {
          PcsUtil.swal()
            .fire({
              title: "Cidade",
              text: `Dados atualizados`,
              type: "success",
              showCancelButton: false,
              confirmButtonText: "Ok"
            })
            .then(
              result => {
                this.loading = false;
                this.buscarCidades(0, this.pageSize, this.orderBy , this.direction);
              },
              error => {}
            );
        });
    });
  }

  public deletarCidade(cidade: Cidade): void {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: false
    });

    swal
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente excluir a cidade ${cidade.nome}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        reverseButtons: false
      })
      .then(result => {
        if (result.value) {
          this.cidadesService.deletar(cidade.id).subscribe(response => {
            this.buscarCidades(0, 10, this.orderBy , this.direction);
            swal.fire(
              "Excluído!",
              `Cidade ${cidade.nome} excluída.`,
              "success"
            );
          });
        }
      });

    PcsUtil.swal()
      .fire({
        title: "Cidade",
        text: `Deseja realmente excluir a cidade ${cidade.nome}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(
        result => {
          if (result.value) {
            this.cidadesService.deletar(cidade.id).subscribe(response => {
              PcsUtil.swal()
                .fire({
                  title: "Cidade",
                  text: `Cidade ${cidade.nome} excluída.`,
                  type: "success",
                  showCancelButton: false,
                  confirmButtonText: "Ok"
                })
                .then(
                  result => {
                    this.buscarCidades(0, 10, this.orderBy , this.direction);
                  },
                  error => {}
                );
            });
          }
        },
        error => {}
      );
  }

  public carregarPaginaCidades(event: PageEvent): PageEvent {
    this.buscarCidades(event.pageIndex, event.pageSize, this.orderBy , this.direction);
    return event;
  }

  openPontoFocalDetalhe(cidade: Cidade) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      cidadeRef: cidade
    }

    const dialogRef = this.dialog.open(PontoFocalDetalhesComponent, dialogConfig);
  }
}
