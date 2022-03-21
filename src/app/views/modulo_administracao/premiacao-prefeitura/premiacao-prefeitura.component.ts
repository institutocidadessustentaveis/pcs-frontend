import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Premiacao } from '../../../model/premiacao';
import { PremiacaoService } from 'src/app/services/premiacao.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { StatusPremiacao } from 'src/app/model/enums/premiacao-enum';

@Component({
  selector: 'app-premiacao-prefeitura',
  templateUrl: './premiacao-prefeitura.component.html',
  styleUrls: ['./premiacao-prefeitura.component.css']
})
export class PremiacaoPrefeituraComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<Premiacao>();
  displayedColumns = ["inicio", "fim", "descricao", "status", "acoes"];
  loading = false;
  scrollUp: any;

  constructor(
    public premiacaoService: PremiacaoService,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.carregaLista();
  }

  carregaLista() {
    this.premiacaoService
      .buscarPremiacoesPorPrefeitura()
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

  public cancelarInscricao(premiacao: Premiacao): void {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true
    });

    PcsUtil.swal()
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente cancelar a inscrição`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        reverseButtons: false
      })
      .then(result => {
        if (result.value) {
          this.premiacaoService
            .cancelarInscricao(premiacao.id)
            .subscribe(response => {
              PcsUtil.swal().fire(
                "Cancelada!",
                `Inscrição cancelada`,
                "success"
              );
              this.carregaLista();
            });
        }
      });
  }

  public getKey(value: string): any {
    return StatusPremiacao[value];
  }

  public showCancelarInscricao(premiacao: Premiacao): boolean {
    if (
      StatusPremiacao[premiacao.status] !== StatusPremiacao.INSCRICOES_ABERTAS
    ) {
      return false;
    }
    return true;
  }
}
