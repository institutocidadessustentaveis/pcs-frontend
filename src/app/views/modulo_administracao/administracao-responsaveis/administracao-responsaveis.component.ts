import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Numbering } from 'docx';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-administracao-responsaveis',
  templateUrl: './administracao-responsaveis.component.html',
  styleUrls: ['./administracao-responsaveis.component.css']
})
export class AdministracaoResponsaveisComponent implements OnInit {

  usuarioLogado: Usuario = new Usuario();
  listaUsuarios: any[] = [];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any = [];
  displayedColumns = ['nome', 'email', 'perfil', 'telefone', 'acoes'];

  constructor(private usuarioService: UsuarioService,
              private titleService: Title,
              private router: Router,
              private authService: AuthService) {
                this.titleService.setTitle("Usuários Responsáveis - Cidades Sustentáveis");
               }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.buscarUsuariosPrefeitura(this.buscaIdPrefeitura());
    this.usuarioLogado = this.buscarDadosUsuarioLogado();
  }

  public buscaIdPrefeitura() : number {
    const usuario = JSON.parse(this.authService.getUsuarioLogado());
    return usuario.dadosPrefeitura.id;
  }

  public buscarDadosUsuarioLogado() {
    const usuario = JSON.parse(this.authService.getUsuarioLogado());
    return usuario as Usuario;
  }

  public desabilitarBtnDeletar(usuario: Usuario): boolean {
    if(usuario.id === this.usuarioLogado.id) {
      return true;
    } else {
      return false;
    }
  }

  public buscarUsuariosPrefeitura(idPrefeitura: number) {
    this.usuarioService.buscarListaUsuariosPorPrefeitura(idPrefeitura).subscribe(res => {
      this.listaUsuarios = res;
      this.dataSource = new MatTableDataSource<Usuario>(this.listaUsuarios);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
    });
  }

  public deletarUsuario(usuario: Usuario): void {
    PcsUtil.swal()
      .fire({
        title: "Usuários",
        text: `Deseja realmente excluir o usuário ${usuario.nome} - ${usuario.email}?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(
        result => {
          if (result.value) {
            this.usuarioService.deletarResponsavel(usuario.id).subscribe(response => {
              PcsUtil.swal()
                .fire({
                  title: "Usuários",
                  text: `Usuário ${usuario.nome} excluído.`,
                  type: "success",
                  showCancelButton: false,
                  confirmButtonText: "Ok"
                })
                .then(
                  result => {
                    this.buscarUsuariosPrefeitura(this.buscaIdPrefeitura());
                  },
                  error => {}
                );
            });
          }
        },
        error => {}
      );
  }

  editar(id) {
    this.router.navigate(['administracao-responsaveis/editar/' + id])
  }

  cadastrar(){
    this.router.navigate(['administracao-responsaveis/cadastrar'])
  }

}
