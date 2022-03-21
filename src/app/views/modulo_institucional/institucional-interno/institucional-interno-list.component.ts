import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { InstitucionalInternoService } from 'src/app/services/institucional-interno.service';
import { InstitucionalInterno } from 'src/app/model/institucional-interno';
import { AuthService } from 'src/app/services/auth.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-institucional-interno-sustentavel",
  templateUrl: "./institucional-interno-list.component.html",
  styleUrls: ["./institucional-interno-list.component.css"]
})
export class InstitucionalInternoComponent implements OnInit {
  //displayedColumns: string[] = ['iconeReduzido', 'numeroCol', 'titulo', 'subtitulo', 'acoes'];
  displayedColumns: string[] = ["titulo", "subtitulo", "acoes"];
  dataSource: MatTableDataSource<InstitucionalInterno>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scrollUp: any;

  constructor(
    private institucionalInternoService: InstitucionalInternoService,
    private authService: AuthService,
    public domSanitizationService: DomSanitizer,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.institucionalInternoService
      .buscarInstitucional()
      .subscribe(response => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
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
      });
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  public deletar(institucionalint: InstitucionalInterno): void {
    PcsUtil.swal()
      .fire({
        title: "Institucional",
        text: `Deseja realmente excluir o Institucional ${institucionalint.titulo}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(
        result => {
          if (result.value) {
            this.institucionalInternoService
              .deletar(institucionalint.id)
              .subscribe(response => {
                PcsUtil.swal()
                  .fire({
                    title: "Institucional",
                    text: `Institucional: ${institucionalint.titulo} excluído`,
                    type: "success",
                    showCancelButton: false,
                    confirmButtonText: "Ok"
                  })
                  .then(
                    result => {
                      this.carregarDados();
                    },
                    error => {}
                  );
              });
          }
        },
        error => {}
      );
  }
}
