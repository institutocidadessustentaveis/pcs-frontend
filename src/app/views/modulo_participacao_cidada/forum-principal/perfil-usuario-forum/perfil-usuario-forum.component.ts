import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PerfilUsuarioForum } from 'src/app/model/perfil-usuario-forum';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { PerfilUsuarioForumService } from 'src/app/services/perfil-usuario-forum';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { Usuario } from 'src/app/model/usuario';
import { Title } from '@angular/platform-browser';
import { InstitucionalInterno } from 'src/app/model/institucional-interno';

@Component({
  selector: 'app-perfil-usuario-forum',
  templateUrl: './perfil-usuario-forum.component.html',
  styleUrls: ['./perfil-usuario-forum.component.css']
})
export class PerfilUsuarioForumComponent implements OnInit {

  public formPerfilUsuarioForum: FormGroup;
  public perfilUsuario = new PerfilUsuarioForum();
  public usuarioLogado: Usuario;
  public id;
  public modoEditar: boolean;
  public pagina: InstitucionalInterno = new InstitucionalInterno();

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private usuarioPerfilForumService: PerfilUsuarioForumService,
    private usuarioService: UsuarioService,
    private titleService: Title,
  ) {
    this.modoEditar = true;
    this.formPerfilUsuarioForum = this.formBuilder.group({
      nomeContato: [null, Validators.required],
      emailContato: [null, [Validators.required, Validators.maxLength(320)]],
    });
    this.titleService.setTitle(`Perfil Contato do Usuário no Fórum  - Cidades Sustentáveis`);
  }

  ngOnInit() {
    this.carregarUsuarioLogado();
  }

  public carregarUsuarioLogado() {
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuarioLogado = usuario;
      this.carregarPerfil();
    })
  }

  public carregarPerfil() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
      if (this.id) {
        this.usuarioPerfilForumService.buscarPorId(this.id).subscribe(response => {
          this.perfilUsuario = response as PerfilUsuarioForum;
          this.carregarAtributos();
        });
      } else {
        this.modoEditar = false;
      }
    }, error => {
      this.router.navigate(['/forum']);
    });
  }

  public carregarAtributos() {
    if (this.usuarioLogado.id == this.perfilUsuario.idUsuario) {
      this.formPerfilUsuarioForum.controls.nomeContato.setValue(this.perfilUsuario.nome);
      this.formPerfilUsuarioForum.controls.emailContato.setValue(this.perfilUsuario.email);
      this.modoEditar = false;
    }
  }
  cadastrar() {
    this.usuarioPerfilForumService.cadastrar(this.perfilUsuario).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Perfil',
        text: `Perfil Cadastrado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/participacao-cidada/forum']);
      }, error => { });
    });
  }

  editar() {
    this.usuarioPerfilForumService.editar(this.perfilUsuario).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Perfil',
        text: `Perfil Editado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/participacao-cidada/forum']);
      }, error => { });
    });
  }

  salvar() {
    if (this.formPerfilUsuarioForum.valid) {
       this.perfilUsuario.nome = this.formPerfilUsuarioForum.controls.nomeContato.value;
       this. perfilUsuario.email = this.formPerfilUsuarioForum.controls.emailContato.value;
       this.usuarioLogado.prefeitura.id != null ?  this.perfilUsuario.idCidade = this.usuarioLogado.prefeitura.cidade.id : this.perfilUsuario.idCidade = null;

       this.perfilUsuario.idUsuario = this.usuarioLogado.id;

       if (this.perfilUsuario.id != null || this.perfilUsuario.id != undefined) {
         this.editar();
       }
       else {
         this.cadastrar();
       }
    }

   }

}
