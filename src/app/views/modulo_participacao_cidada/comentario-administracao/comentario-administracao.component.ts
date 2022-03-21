import { UsuarioService } from './../../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { MatTableDataSource } from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Comentario } from 'src/app/model/comentario';
import { ComentarioService } from 'src/app/services/comentario.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-comentario-administracao',
  templateUrl: './comentario-administracao.component.html',
  styleUrls: ['./comentario-administracao.component.css']
})
export class ComentarioAdministracaoComponent implements OnInit {

  usuario: Usuario;

  public dataSource: MatTableDataSource<Comentario>;
  
  public displayedColumns: string[] = ['nomeUsuario', 'titulo', 'cidade', 'dataPublicacao', 'horarioPublicacao', 'acoes'];

  constructor(
    private usuarioService :UsuarioService,
    private comentarioService: ComentarioService,
    private titleService: Title,
  ) {
    this.titleService.setTitle("Administrar Testemunhos - Cidades Sustentáveis")
   }

  ngOnInit() {
    this.buscarUsuarioLogado();
  }

  buscarUsuarioLogado() {
    this.usuarioService.buscarUsuarioLogado()
    .subscribe(res => {
      this.usuario = res
      this.buscarComentarios();
    })
  }

  buscarComentarios() {
    let id = this.usuario.id;
    this.comentarioService.buscarComentariosToList(id)
    .subscribe(res => {
      this.dataSource = new MatTableDataSource<Comentario>(res);
    });
  }

  
  public excluirComentario(idComentario: number): void {
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir o item selecionado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.comentarioService.excluirComentario(idComentario).subscribe(response => {
          PcsUtil.swal().fire('Comentário!', `Excluído com sucesso.`, 'success');
          this.buscarComentarios();
        });
      }
    });
  }

}