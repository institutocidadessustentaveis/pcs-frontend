import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PerfisService } from 'src/app/services/perfis.service';
import { Perfil } from 'src/app/model/perfil';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-perfis",
  templateUrl: "./perfis.component.html",
  styleUrls: ["./perfis.component.css"]
})
export class PerfisComponent implements OnInit {
  perfis: Perfil[] = [];
  paginador: any;
  dataSource = new MatTableDataSource<Perfil>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ["Nome", "Ações"];
  scrollUp: any;

  constructor(
    private perfisService: PerfisService,
    private authService: AuthService,
    private element: ElementRef,
    private router: Router,
    private titleService: Title,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });[
    this.titleService.setTitle("Administrar Perfis")
    ]
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.buscarPerfis();
  }

  public deletarPerfil(perfil: Perfil): void {
    PcsUtil.swal()
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente excluir o perfil ${perfil.nome}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(result => {
        if (result.value) {
          this.perfisService.deletar(perfil.id).subscribe(response => {
            this.buscarPerfis();
            PcsUtil.swal().fire(
              "Excluído!",
              `Usuário ${perfil.nome} excluído.`,
              "success"
            );
          });
        }
      });
  }

  public buscarPerfis() {
    this.perfisService.buscarPerfis().subscribe(response => {
      this.perfis = response as Perfil[];
      this.dataSource = new MatTableDataSource(response);
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
      this.paginador = response;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = "Primeira página";
      this.paginator._intl.previousPageLabel = "Página anterior";
      this.paginator._intl.nextPageLabel = "Próxima página";
      this.paginator._intl.lastPageLabel = "Última página";
    });
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
}
