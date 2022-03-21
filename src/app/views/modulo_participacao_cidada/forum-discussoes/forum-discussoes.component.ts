import { ForumDiscussao } from 'src/app/model/forum-discussao';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ForumDiscussaoService } from 'src/app/services/forum-discussao.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forum-discussoes',
  templateUrl: './forum-discussoes.component.html',
  styleUrls: ['./forum-discussoes.component.css']
})
export class ForumDiscussoesComponent implements OnInit {
  displayedColumns: string[] = ["titulo", "descricao", "dataHoraCriacao", "acoes"];
  dataSource: MatTableDataSource<ForumDiscussao>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scrollUp: any;

  public usuarioPrefeituraId: number = null;
  public isAdmin = false;

  constructor(
    private forumDiscussaoService: ForumDiscussaoService,
    private authService: AuthService,
    public domSanitizationService: DomSanitizer,
    private element: ElementRef,
    private router: Router,
    private titleService: Title,
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
    this.titleService.setTitle(`Discussões - Cidades Sustentáveis`);
    let usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

    if (usuarioLogado.dadosPrefeitura !== undefined) {
      this.usuarioPrefeituraId = usuarioLogado.dadosPrefeitura.id;
    }

    for (let perfil of usuarioLogado.listaPerfil) {
      if ('Administrador' === perfil.nome) {
        this.isAdmin = true;
        break;
      }
    }
    if (this.isAdmin) {
      this.carregarDados();
    } else {
      this.carregarDadosPrefeitura();
    }
  }

  carregarDados() {
    this.forumDiscussaoService.buscarListaDiscussoes()
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

  public deletar(discussao: ForumDiscussao): void {
    PcsUtil.swal()
      .fire({
        title: 'Discussão',
        text: `Deseja realmente excluir a discussão ${discussao.titulo}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      })
      .then(
        result => {
          if (result.value) {
            this.forumDiscussaoService
              .deletar(discussao.id)
              .subscribe(response => {
                PcsUtil.swal()
                  .fire({
                    title: 'Discussão',
                    text: `Discussão: ${discussao.titulo} excluída`,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok'
                  })
                  .then(
                    result => {
                      if (this.isAdmin) {
                        this.carregarDados();
                      } else {
                        this.carregarDadosPrefeitura();
                      }
                    },
                    error => { }
                  );
              });
          }
        },
        error => { }
      );
  }

  podeEditar(discussao: ForumDiscussao) {

    if (this.isAdmin) {
      if (discussao.prefeituraId == null) {
        return true;
      }
    }

    if (this.usuarioPrefeituraId !== undefined && this.usuarioPrefeituraId != null  && this.usuarioPrefeituraId === discussao.prefeituraId) {
      return true;
    }

    return false;
  }

  podeExcluir(discussao: ForumDiscussao) {

    if (this.isAdmin) {
      return true;
    }
    if (this.usuarioPrefeituraId !== undefined && this.usuarioPrefeituraId != null  && this.usuarioPrefeituraId === discussao.prefeituraId) {
      return true;
    }
    return false;
  }

  carregarDadosPrefeitura() {
    this.forumDiscussaoService.buscarListaDiscussoesPorIdPrefeitura(this.usuarioPrefeituraId)
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
}
