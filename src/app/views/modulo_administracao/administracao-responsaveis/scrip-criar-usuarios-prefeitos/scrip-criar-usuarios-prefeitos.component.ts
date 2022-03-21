import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-scrip-criar-usuarios-prefeitos',
  templateUrl: './scrip-criar-usuarios-prefeitos.component.html',
  styleUrls: ['./scrip-criar-usuarios-prefeitos.component.css']
})
export class ScripCriarUsuariosPrefeitosComponent implements OnInit {
  public usuarioLogado;

  constructor(private usuarioService: UsuarioService, private authService: AuthService) {  }

  ngOnInit() {
    this.usuarioLogado = this.buscarDadosUsuarioLogado();
  }

  public criarUsuarios() {
    this.usuarioService.criarUsuariosPrefeitos().subscribe(res => {
      console.log(res)
    });
  }

  public buscarDadosUsuarioLogado() {
    const usuario = JSON.parse(this.authService.getUsuarioLogado());
    return usuario;
  }

  public verificarUsuario() : boolean {
    return this.usuarioLogado.login === 'davi.machado@iacit.com.br' || this.usuarioLogado.login === 'admin@iacit.com.br' ? true : false;
  }

}
