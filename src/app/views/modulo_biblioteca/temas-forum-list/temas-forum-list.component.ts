import { PcsUtil } from 'src/app/services/pcs-util.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { TemaForumService } from './../../../services/tema-forum.service';
import { Usuario } from 'src/app/model/usuario';
import { TemaForum } from './../../../model/tema-forum';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-temas-forum-list',
  templateUrl: './temas-forum-list.component.html',
  styleUrls: ['./temas-forum-list.component.css']
})
export class TemasForumListComponent implements OnInit {

  displayedColumns: string[] = ["nome", "acoes"];
  dataSource: MatTableDataSource<TemaForum>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scrollUp: any;

  public usuarioLogado: Usuario = new Usuario();
  public nomePerfil: string[] = [];

  constructor(
    private temaForumService: TemaForumService,
    private authService: AuthService,
    public domSanitizationService: DomSanitizer,
    private element: ElementRef,
    private router: Router,
    private titleService: Title,
    private usuarioService: UsuarioService
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
    this.titleService.setTitle(`Temas de fórum - Cidades Sustentáveis`);
    this.buscarUsuarioLogado();
    this.carregarDados();
  }

  carregarDados() {
    this.temaForumService.buscarListaTemaForum()
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

  buscarUsuarioLogado() {
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuarioLogado = usuario as Usuario;
      this.nomePerfil = this.usuarioLogado.nomePerfil.split(' | ');
    });

  }

  public deletar(temaForum: TemaForum): void {
    PcsUtil.swal()
      .fire({
        title: 'Tema de fórum',
        text: `Deseja realmente excluir o tema de fórum ${temaForum.nome}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      })
      .then(
        result => {
          if (result.value) {
            this.temaForumService
              .deletar(temaForum.id)
              .subscribe(response => {
                PcsUtil.swal()
                  .fire({
                    title: 'Tema de fórum',
                    text: `Tema de fórum: ${temaForum.nome} excluído`,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'Ok'
                  })
                  .then(
                    result => {
                      this.carregarDados();
                    },
                    error => { }
                  );
              });
          }
        },
        error => { }
      );
  }

  podeEditar() {

    if (this.nomePerfil.includes('Administrador')) {
      return true;
    }
    return false;
  }

  podeExcluir() {

    if (this.nomePerfil.includes('Administrador')) {
      return true;
    }
    return false;
  }

}
