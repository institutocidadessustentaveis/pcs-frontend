import { Pais } from '../../../model/pais';
import { Component, OnInit, ContentChild, ViewChild, ElementRef } from '@angular/core';
import { PaisService } from 'src/app/services/pais.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, Sort } from '@angular/material';
import swal from 'sweetalert2';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: "app-pais",
  templateUrl: "./pais.component.html",
  styleUrls: ["./pais.component.scss"]
})
export class PaisComponent implements OnInit {
  pais: Pais[] = [];
  displayedColumns = ["Continente", "Pais", "Populacao", "Ações"];
  dataSource = new MatTableDataSource<Pais>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loading = true;
  page = 0;
  length = 100;
  pageSize = 10;
  scrollUp: any;
  private orderBy = 'nome';
  private direction = 'ASC';

  constructor(
    public paisService: PaisService,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();

    if (
      filterValue === undefined ||
      filterValue === "" ||
      filterValue.length < 3
    ) {
      this.buscarPaises(0, 10, this.orderBy , this.direction);
    } else {
      this.buscarPaisesPorNome(filterValue, 0, 10);
    }
  }

  ngOnInit() {
    this.carregaLista();
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();
      this.buscarPaises(this.page, this.pageSize, this.orderBy , this.direction);
      this.paginator.pageIndex = 0;
    }
  }

  carregaLista() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.paisService.buscarTodos().subscribe(response => {
        localStorage.setItem("dadosCadastrados", JSON.stringify(response));
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
        this.paginator._intl.firstPageLabel = "Primeira página";
        this.paginator._intl.previousPageLabel = "Página anterior";
        this.paginator._intl.nextPageLabel = "Próxima página";
        this.paginator._intl.lastPageLabel = "Última página";
        this.loading = false;
        this.buscarPaises(0, 10, this.orderBy , this.direction);
      });
    });
  }

  editar(entrada) {
    localStorage.setItem("editar-obj", JSON.stringify(entrada));
  }

  public buscarPaises(page: number, linesPerPage: number, orderBy: string, direction: string) {
    this.paisService.buscarPaises(page, linesPerPage, orderBy, direction).subscribe(response => {
      localStorage.setItem("dadosCadastrados", JSON.stringify(response.paises));
      this.dataSource = new MatTableDataSource(response.paises);
      this.paginator.length = response.quantidadeTotal;
      this.paginator._intl.itemsPerPageLabel = "Itens por página";
      this.paginator._intl.firstPageLabel = "Primeira página";
      this.paginator._intl.previousPageLabel = "Página anterior";
      this.paginator._intl.nextPageLabel = "Próxima página";
      this.paginator._intl.lastPageLabel = "Última página";
      this.loading = false;
    });
  }

  public buscarPaisesPorNome(nome: string, page: number, linesPerPage: number) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.paisService
        .buscarPorNome(nome, page, linesPerPage)
        .subscribe(response => {
          this.dataSource = new MatTableDataSource(response.paises);
          this.paginator.length = response.quantidadeTotal;
          this.paginator._intl.firstPageLabel = "Primeira página";
          this.paginator._intl.previousPageLabel = "Página anterior";
          this.paginator._intl.nextPageLabel = "Próxima página";
          this.paginator._intl.lastPageLabel = "Última página";
          this.loading = false;
        });
    });
  }

  public deletarPais(pais: Pais): void {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true
    });

    PcsUtil.swal()
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente excluir o país ${pais.nome}`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        reverseButtons: false
      })
      .then(result => {
        if (result.value) {
          this.paisService.deletarPais(pais.id).subscribe(response => {
            this.pais = this.pais.filter(paises => paises !== pais);
            PcsUtil.swal().fire(
              "Excluído!",
              `Pais ${pais.nome} excluído.`,
              "success"
            );
            this.carregaLista();
          });
        }
      });
  }

  public carregarPaginaPais(event: PageEvent): PageEvent {
    this.buscarPaises(event.pageIndex, event.pageSize, this.orderBy , this.direction);
    this.pageSize = event.pageSize;
    return event;
  }
}





