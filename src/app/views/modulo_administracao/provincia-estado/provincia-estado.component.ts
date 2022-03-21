
import { Component, OnInit, ContentChild, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import swal from 'sweetalert2';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { PaisService } from 'src/app/services/pais.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';


@Component({
  selector: "app-provincia-estado",
  templateUrl: "./provincia-estado.component.html",
  styleUrls: ["./provincia-estado.component.css"]
})
export class ProvinciaEstadoComponent implements OnInit {
  provinciaEstado: ProvinciaEstado[] = [];
  displayedColumns = ["ProvinciaEstado", "Pais", "Ações"];
  dataSource = new MatTableDataSource<ProvinciaEstado>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listaPais: any[] = [];
  loading = true;
  length = 100;
  pageSize = 10;
  scrollUp: any;

  constructor(
    public provinciaEstadoService: ProvinciaEstadoService,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public paisService: PaisService,
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
      filterValue.length < 2
    ) {
      this.buscarEstados(0, 10);
    } else {
      this.buscarEstadoPorNome(filterValue, 0, 10);
    }
  }

  ngOnInit() {
    this.buscarEstados(0, 10);
  }

  // async carregaLista() {
  //   this.activatedRoute.paramMap.subscribe(params => {
  //     this.provinciaEstadoService.buscarTodos().subscribe(async response => {
  //       await this.paisService.buscarTodos().subscribe((dados) => {
  //         this.listaPais = dados;
  //       });
  //       localStorage.setItem('dadosCadastrados', JSON.stringify(response));
  //       this.dataSource = new MatTableDataSource(response);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       this.paginator._intl.itemsPerPageLabel = 'Itens por página';
  //       this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
  //       this.paginator._intl.firstPageLabel = 'Primeira página';
  //       this.paginator._intl.previousPageLabel = 'Página anterior';
  //       this.paginator._intl.nextPageLabel = 'Próxima página';
  //       this.paginator._intl.lastPageLabel = 'Última página';
  //       this.loading = false;
  //       this.buscarEstados(0, 10);
  //     });
  //   });
  // }

  public buscarEstados(page: number, linesPerPage: number) {
    this.provinciaEstadoService
      .buscarProvinciasEstados(page, linesPerPage)
      .subscribe(async response => {
        await this.paisService.buscarTodos().subscribe(dados => {
          this.listaPais = dados;
        });

        this.dataSource = new MatTableDataSource(response.estados);
        this.paginator.length = response.quantidadeTotal;
        // this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._intl.itemsPerPageLabel = "Itens por página";
        this.paginator._intl.firstPageLabel = "Primeira página";
        this.paginator._intl.previousPageLabel = "Página anterior";
        this.paginator._intl.nextPageLabel = "Próxima página";
        this.paginator._intl.lastPageLabel = "Última página";
        /*this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 de ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };*/
        this.loading = false;
      });
  }

  public buscarEstadoPorNome(nome: string, page: number, itemsPerPage: number) {
    this.provinciaEstadoService
      .buscarPorNome(nome, page, itemsPerPage)
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response.estados);
        this.dataSource.sort = this.sort;
        this.paginator.length = response.quantidadeTotal;
        this.paginator._intl.firstPageLabel = "Primeira página";
        this.paginator._intl.previousPageLabel = "Página anterior";
        this.paginator._intl.nextPageLabel = "Próxima página";
        this.paginator._intl.lastPageLabel = "Última página";
        this.loading = false;
      });
  }

  retornaNomePais(id) {
    if (this.listaPais.length > 0) {
      const consulta = this.listaPais.filter(x => x.id === id);
      return consulta[0].nome;
    }
  }

  editar(provinciaEstado: ProvinciaEstado) {
    localStorage.setItem("editar-obj", JSON.stringify(provinciaEstado));
    localStorage.setItem(
      "editar-obj-nomePais",
      this.retornaNomePais(provinciaEstado.pais.id)
    );
  }

  public deletarProvinciaEstado(provinciaEstado: ProvinciaEstado): void {
    PcsUtil.swal()
      .fire({
        title: "Estado/Província",
        text: `Deseja realmente excluir o Estado/Província ${provinciaEstado.nome}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(
        result => {
          if (result.value) {
            this.provinciaEstadoService
              .deletarProvinciaEstado(provinciaEstado.id)
              .subscribe(response => {
                this.provinciaEstado = this.provinciaEstado.filter(
                  provinciasEstados => {
                    return provinciasEstados !== provinciaEstado;
                  }
                );
                PcsUtil.swal()
                  .fire({
                    title: "Objetivo de Desenvolvimento Sustentavel",
                    text: `Estado/Província ${provinciaEstado.nome} excluído.`,
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok"
                  })
                  .then(
                    result => {
                      //
                      this.buscarEstados(0, 10);
                    },
                    error => {}
                  );
              });
          }
        },
        error => {}
      );
  }

  public carregarPaginaEstado(event: PageEvent): PageEvent {
    this.buscarEstados(event.pageIndex, event.pageSize);
    return event;
  }
}
