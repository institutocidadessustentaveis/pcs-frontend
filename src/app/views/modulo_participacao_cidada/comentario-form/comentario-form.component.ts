import { Usuario } from 'src/app/model/usuario';
import { Title } from '@angular/platform-browser';
import { Comentario } from 'src/app/model/comentario';
import { ActivatedRoute, Router } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Component, OnInit, OnChanges } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ComentarioService } from 'src/app/services/comentario.service';
import { RouterConfigLoader } from '@angular/router/src/router_config_loader';
import { StripTagsPipe } from 'src/app/components/strip-tags/strip-tags.pipe';
import { ConfiguracaoComentario } from './../../../model/configuracaoComentario';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ConfiguracaoComentarioService } from './../../../services/configuracao-comentario.service';

const pipeRemoveTagsHtml = new StripTagsPipe();
@Component({
  selector: 'app-comentario-form',
  templateUrl: './comentario-form.component.html',
  styleUrls: ['./comentario-form.component.css']
})
export class ComentarioFormComponent implements OnInit {

  public id;
  public usuarioLogado: Usuario;
  public formComentario: FormGroup;
  public tamanhoMaxComentario: number;
  public comentario = new Comentario();
  public autorizaContato :boolean;
  public configuracaoComentario: ConfiguracaoComentario = new ConfiguracaoComentario();
  

  public editorConfig: any = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['', []],
      ['', ['', '', '']],
      ['insert', ['table', 'link']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  constructor(
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private comentarioService: ComentarioService,
    private configuracaoComentarioService: ConfiguracaoComentarioService,
  ) {
    this.formComentario = this.formBuilder.group({
      titulo: [null, Validators.required],
      comentario: [null, [Validators.required, Validators.maxLength(150)]],
      email: [null, Validators.email],
      telefone: [null],
    });
    this.titleService.setTitle("Formulário do Testemunho - Cidades Sustentáveis")
    this.autorizaContato = false;
  }

  ngOnInit() {
    this.definirTamanhoMaximoComentario();
    this.buscarUsuario();
    this.buscarComentario();
  }

  public autorizarContato() {
    if(this.autorizaContato) {
      this.autorizaContato = false;
    }
    else {
      this.autorizaContato = true;
    }
  }

  public buscarComentario() {
    this.activatedRoute.params.subscribe(params => {
      this.id = params.id;
      if (this.id) {
        this.comentarioService.buscarComentarioPorId(this.id).subscribe(response => {
          this.comentario = response as Comentario;
          this.carregarAtributos();
        });
      }
    }, error => {
      this.router.navigate(['/participacao-cidada']);
    });
  }

  public carregarAtributos() {
    this.formComentario.controls.email.setValue(this.comentario.email);
    this.formComentario.controls.titulo.setValue(this.comentario.titulo);
    this.formComentario.controls.telefone.setValue(this.comentario.telefone);
    this.formComentario.controls.comentario.setValue(this.comentario.comentario);
  }

  public buscarUsuario() {
    this.usuarioService.buscarUsuarioLogado()
      .subscribe(res => {
        this.usuarioLogado = res;
      })
  }

  public cadastrar(comentario: Comentario) {
    this.comentarioService.cadastrarComentario(comentario).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Comentário',
        text: `Comentário Cadastrado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/participacao-cidada/comentario-administracao']);
      }, error => { });
    });
  }

  public editar(comentario: Comentario) {
    this.comentarioService.editarComentario(comentario).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Comentário',
        text: `Comentário Editado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/participacao-cidada/comentario-administracao']);
      }, error => { });
    });
  }

  public salvar() {
    if (this.formComentario.valid) {
      this.comentario.usuario = this.usuarioLogado.id;
      this.comentario.nomeUsuario = this.usuarioLogado.nome;
      this.comentario.email = this.formComentario.controls.email.value;
      this.comentario.titulo = this.formComentario.controls.titulo.value;
      this.comentario.telefone = this.formComentario.controls.telefone.value;
      this.comentario.comentario = this.formComentario.controls.comentario.value;

      if (this.usuarioLogado.nomePerfil.includes("Administrador")) {
        this.comentario.idCidade = null;
      }
      else {
        this.comentario.idPrefeitura = this.usuarioLogado.prefeitura.id;
        this.comentario.idCidade = this.usuarioLogado.prefeitura.cidade.id;
        this.comentario.nomeCidade = null;
      }

      if (this.comentario.id) {
        this.editar(this.comentario);
      }
      else {
        this.cadastrar(this.comentario);
      }
    }
  }

  public definirTamanhoMaximoComentario() {
    this.configuracaoComentarioService.buscar()
    .subscribe(res => {
      this.configuracaoComentario = res as ConfiguracaoComentario;
      this.tamanhoMaxComentario = this.configuracaoComentario.tamanhoComentario;
      this.formComentario.controls.comentario.setValidators([Validators.required, Validators.maxLength(this.tamanhoMaxComentario)]);
    });
  }


}