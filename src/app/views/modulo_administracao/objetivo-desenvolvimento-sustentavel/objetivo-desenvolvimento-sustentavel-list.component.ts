import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { ObjetivoDesenvolvimentoSustentavelService } from "src/app/services/objetivo-desenvolvimento-sustentavel.service";
import { ObjetivoDesenvolvimentoSustentavel } from "src/app/model/objetivoDesenvolvimentoSustentavel";
import { AuthService } from "src/app/services/auth.service";
import { PcsUtil } from "src/app/services/pcs-util.service";

import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: "app-objetivo-desenvolvimento-sustentavel",
  templateUrl: "./objetivo-desenvolvimento-sustentavel-list.component.html",
  styleUrls: ["./objetivo-desenvolvimento-sustentavel-list.component.css"]
})
export class ObjetivoDesenvolvimentoSustentavelComponent implements OnInit {
  displayedColumns: string[] = [
    "iconeReduzido",
    "numeroCol",
    "titulo",
    "subtitulo",
    "acoes"
  ];
  dataSource: MatTableDataSource<ObjetivoDesenvolvimentoSustentavel>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loading: boolean;
  scrollUp: any;

  constructor(
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
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
    this.loading = true;
    this.odsService.buscar().subscribe(
      response => {
        let listOds: ObjetivoDesenvolvimentoSustentavel[];
        listOds = response;
        listOds.forEach(item => {
          item.iconeSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            "data:image/png;base64, " + item.icone
          );
          item.iconeReduzidoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            "data:image/png;base64, " + item.iconeReduzido
          );
        });
        this.dataSource = new MatTableDataSource(listOds);
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
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  public deletar(ods: ObjetivoDesenvolvimentoSustentavel): void {
    PcsUtil.swal()
      .fire({
        title: "Objetivo de Desenvolvimento Sustentável",
        text: `Deseja realmente excluir o ODS ${ods.titulo}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(
        result => {
          if (result.value) {
            this.odsService.deletar(ods.id).subscribe(
              response => {
                PcsUtil.swal()
                  .fire({
                    title: "Objetivo de Desenvolvimento Sustentável",
                    text: `Objetivo de Desenvolvimento Sustentável: ${ods.titulo} excluído.`,
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
              },
              error => {
                if (
                  error.error &&
                  error.error.message.includes("ConstraintViolationException")
                ) {
                  PcsUtil.swal()
                    .fire({
                      title: "Erro ao excluir objetivo",
                      text: "O registro está sendo usado no sistema",
                      type: "error",
                      showCancelButton: false,
                      confirmButtonText: "Ok"
                    })
                    .then(
                      result => {
                        this.carregarDados();
                      },
                      error => {}
                    );
                }
              }
            );
          }
        },
        error => {}
      );
  }

  public getImagePath(id: number): string {
    if (id == null) {
      return "/";
    }

    return `${environment.API_URL}ods/imagem/` + id;
  }
}
