import { EixoListagem } from './../../../model/EixoListagem';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { Eixo } from 'src/app/model/eixo';
import { EixoService } from 'src/app/services/eixo.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-eixo",
  templateUrl: "./eixo-list.component.html",
  styleUrls: ["./eixo-list.component.css"]
})
export class EixoListComponent {
  displayedColumns: string[] = ["Icone", "Nome", "#Acoes"];
  dataSource = new MatTableDataSource<EixoListagem>();
  loading: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  scrollUp: any;

  constructor(
    public eixoService: EixoService,
    public authService: AuthService,
    public _DomSanitizationService: DomSanitizer,
    public activatedRoute: ActivatedRoute,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.loading = true;
    this.carregarDados();
  }

  carregarDados() {
    // this.activatedRoute.paramMap.subscribe(params => {
    this.eixoService.buscarEixosList().subscribe(
      response => {
        this.dataSource = new MatTableDataSource<EixoListagem>(response);
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
    // });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  excluir(eixo: Eixo) {
    PcsUtil.swal()
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente excluir o eixo ${eixo.nome}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(
        result => {
          if (result.value) {
            this.eixoService.deletar(eixo.id).subscribe(response => {
              this.carregarDados();
              PcsUtil.swal().fire(
                "Excluído!",
                `Eixo ${eixo.nome} excluído.`,
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

  public getImagePath(id: number, possuiImagem: boolean): string {
    if (id == null) {
      return '/';
    }
    return `${environment.API_URL}eixo/imagem/` + id;
  }
}
