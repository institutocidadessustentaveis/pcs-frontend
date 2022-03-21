import { FormGroup } from '@angular/forms';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { Variavel } from 'src/app/model/variaveis';
import { VariavelService } from 'src/app/services/variavel.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router } from '@angular/router';

export interface DropDownList {
  value: number;
  viewValue: string;
}

@Component({
  selector: "app-variaveis-list",
  templateUrl: "./variaveis-list.component.html",
  styleUrls: ["./variaveis-list.component.css"]
})
export class VariavelListComponent {
  displayedColumns = [];
  dataSource = new MatTableDataSource<Variavel>();
  loading: any;
  isUsuarioPrefeitura = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  scrollUp: any;

  constructor(
    public variavelService: VariavelService,
    public authService: AuthService,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  carregaColunasDinamicas() {
    this.isUsuarioPrefeitura = this.authService.isUsuarioPrefeitura();
    if (this.isUsuarioPrefeitura) {
      this.displayedColumns = [
        "Nome",
        "Descricao",
        "Tipo",
        "Unidade",
        "#Acoes"
      ];
    } else {
      this.displayedColumns = [
        "Nome",
        "Descricao",
        "Tipo",
        "Unidade",
        "Origem",
        "#Acoes"
      ];
    }
  }

  async ngOnInit() {
    this.carregaColunasDinamicas();
    this.loading = true;
    await this.carregarDados();
  }

  async carregarDados() {
    await this.variavelService.buscarVariavel().subscribe(
      async response => {
        this.dataSource = new MatTableDataSource<Variavel>(response);
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
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  excluir(variavel: Variavel) {
    this.loading = true;
    PcsUtil.swal()
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente excluir a variável ${variavel.nome}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(
        result => {
          if (result.value) {
            this.variavelService.deletar(variavel.id).subscribe(response => {
              this.carregarDados();
              PcsUtil.swal().fire(
                "Excluída!",
                `Variável ${variavel.nome} excluída!`,
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
}


