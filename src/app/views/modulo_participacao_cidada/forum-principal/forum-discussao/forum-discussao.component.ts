import { UsuarioPerfisCidade } from './../../../../model/usuarioPerfisCidade';
import { MatDialog } from '@angular/material';
import { Usuario } from 'src/app/model/usuario';
import { Component, EventEmitter, OnInit, Output, ViewChild, TemplateRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { ForumDiscussao } from 'src/app/model/forum-discussao';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { comentarioDiscussao } from 'src/app/model/comentario-discussao';
import { ForumDiscussaoService } from 'src/app/services/forum-discussao.service';
import { ComentariosDiscussaoService } from 'src/app/services/comentario-discussao.service';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forum-discussao',
  templateUrl: './forum-discussao.component.html',
  styleUrls: ['./forum-discussao.component.css']
})
export class ForumDiscussaoComponent implements OnInit {

  idDiscussao: number;
  formComentario: FormGroup;
  formComentarioEditar: FormGroup;
  formComentarioFilho: FormGroup;
  loadingDiscussao: boolean = true;
  loadingComentarios: boolean = true;
  public nomePerfil: string[] = [];
  usuarioEstaLogado: boolean = false;
  public mostrarEdicao: number[] = [];
  usuarioLogado: Usuario = new Usuario();
  loadingEnviarComentario: boolean = false;
  comentariosDiscussao: comentarioDiscussao[];
  discussao: ForumDiscussao = new ForumDiscussao();
  novoComentario: comentarioDiscussao = new comentarioDiscussao();
  public responderComentario: boolean = false;
  usuarioComentario: UsuarioPerfisCidade = new UsuarioPerfisCidade();

  public listaComentariosPai: number[] = [];

  public imagensCorpoComentario: any[] = [];

  @ViewChild('modalInfoUser') modalInfoUser: TemplateRef<any>;

  public editorConfig: any = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['', []],
      ['', ['', '', '']],
      ['insert', ['table', 'picture', 'link']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { 
      onPaste: function (e) { 
        var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); 
        e.preventDefault(); 
        document.execCommand('insertText', false, bufferText); 
      },
      onImageUpload: file => {
        this.forumDiscussaoService
          .salvarImagemCorpoComentario(file[0])
          .subscribe(response => {
            let path: string = `${environment.API_URL}${response.path}`;
            this.imagensCorpoComentario.push({
              id: response.id,
              path: path,
              file: file[0]
            });
            document.execCommand('insertImage', false, path);
          });
      },
      onMediaDelete: e => {
        let imagensEncontradas = this.imagensCorpoComentario.filter(
          i => i.path === e[0].src
        );

        if (imagensEncontradas.length > 0) {
          let imagem = imagensEncontradas[0];

          this.forumDiscussaoService
            .apagarImagemCorpoComentario(imagem.id)
            .subscribe(response => {});
        }
      }
    }
  };

  

  constructor(
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private _scrollToService: ScrollToService,
    private forumDiscussaoService: ForumDiscussaoService,
    private comentariosDiscussaoService: ComentariosDiscussaoService,
    public dialog: MatDialog
    ) {
    this.formComentario = this.formBuilder.group({
      comentario: [null, Validators.required]
    });
    this.formComentarioEditar = this.formBuilder.group({
      comentario: [null, Validators.required]
    });

    this.titleService.setTitle(`Discussão do Fórum - Cidades Sustentáveis`);
  }

  ngOnInit() {
    this.triggerScrollTo();
    this.getIdDiscussao().then(r => {
      this.buscarDiscussao();
    })
    this.buscarUsuarioLogado();
  }

  
  public triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      target: 'top'
    };
    this._scrollToService.scrollTo(config);
  }

  async getIdDiscussao() {
    return this.activatedRoute.params.subscribe(params => {
      this.idDiscussao = params.id;
    }, error => {
      this.router.navigate(['/participacao-cidada/forum']);
    });
  }

  buscarComentariosDiscussao() {
    this.loadingComentarios = true;
      if (this.idDiscussao) {
        this.comentariosDiscussaoService.buscarComentariosDiscussaoPorIdDiscussao(this.idDiscussao).subscribe(comentarios => {
          this.loadingComentarios = false;
          this.comentariosDiscussao = comentarios as comentarioDiscussao[];
        })
      }
  }

  buscarDiscussao() {
    this.loadingDiscussao = true;
    if (this.idDiscussao) {
      this.forumDiscussaoService.buscarPorId(this.idDiscussao).subscribe(discussao => {
          this.buscarComentariosDiscussao();
          this.loadingDiscussao = false;
          this.discussao = discussao as ForumDiscussao;
          this.contarVisualizacao();
      })
    }
  }

  buscarUsuarioLogado() {
    this.usuarioEstaLogado = this.authService.isAuthenticated();
    if (this.usuarioEstaLogado) {
      this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
        this.usuarioLogado = usuario as Usuario;
        this.nomePerfil = this.usuarioLogado.nomePerfil.split(' | ');
      });
    }
  }

  onEnviar() {
      if (this.formComentario.valid && this.usuarioEstaLogado) {
        this.novoComentario.discussao = this.idDiscussao;
        this.novoComentario.usuario = this.usuarioLogado.id;
        this.novoComentario.comentario = this.formComentario.controls.comentario.value;
        this.cadastrar();
      }
    else {
      PcsUtil.swal().fire({
        title: 'Erro ao enviar Comentário',
        text: `É necessário fazer login.`,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {} )
    }
  }

  // atualiza o numero de comentários
  async atualizarDiscussao() {     
    this.discussao.usuarioUltimaPostagem = this.usuarioLogado;
    this.forumDiscussaoService.buscarPorId(this.idDiscussao).subscribe(discussao => {
      this.discussao = discussao as ForumDiscussao;
      this.forumDiscussaoService.atualizarDiscussao(this.discussao).subscribe(res => {
        this.buscarDiscussao();
      })
    })
  }

  public cadastrar() {
    this.loadingEnviarComentario = true;
    this.comentariosDiscussaoService.inserir(this.novoComentario).subscribe(response => {
      this.loadingEnviarComentario = false;
     PcsUtil.swal().fire({
        title: 'Comentário',
        text: `Comentário Enviado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.formComentario.controls.comentario.setValue(null);
        this.buscarComentariosDiscussao();
        this.atualizarDiscussao();
      }, error => { });
    });
    this.alterarUsuarioUltimaPostagem();
  }

  contarVisualizacao() {

    let hoje = new Date();
    let dataHojeFiltrada = hoje.getMonth() + "/" + hoje.getMonth() + "/" + hoje.getFullYear();

    let pagina = JSON.stringify(this.idDiscussao);
    if (localStorage.getItem(pagina) != null) {
      let partesUltimaVisualizacao = localStorage.getItem(pagina).split("/");
      let partesDataHoje = dataHojeFiltrada.split("/");

      if (partesUltimaVisualizacao[0] < partesDataHoje[0] && partesUltimaVisualizacao[1] < partesDataHoje[1] && partesUltimaVisualizacao[2] < partesDataHoje[2]) {
        this.visualizar()
      }
    }
    else {
      localStorage.setItem(pagina, JSON.stringify(dataHojeFiltrada));
      this.visualizar();
    }
  }

  visualizar() {
    this.forumDiscussaoService.atualizarVisualizacao(this.discussao)
      .subscribe(res => { });
  }

  podeEditar(comentario: comentarioDiscussao) {
    if (this.usuarioLogado.id === comentario.usuario) {
      return true;
    }
    return false;
  }

  onClickEditar(id) {
    this.formComentarioEditar.controls.comentario.setValue(null);
    if (this.mostrarEdicao.includes(id)) {
      this.mostrarEdicao.splice(this.mostrarEdicao.indexOf(id), 1);
    } else {
      this.mostrarEdicao.push(id);
    }
    return true;
  }

  onModoEditar(id) {
    return this.mostrarEdicao.includes(id);
  }

  podeExcluir(comentario: comentarioDiscussao) {
    if (this.nomePerfil.includes('Administrador')) {
      return true;
    }
    if (this.usuarioLogado.id === comentario.usuario) {
      return true;
    }
    return false;
  }

  deletar(comentario) {
    this.loadingEnviarComentario = true;
    this.comentariosDiscussaoService.excluirComentarioDiscussao(comentario.id).subscribe(async response => {
      this.loadingEnviarComentario = false;
      await PcsUtil.swal().fire({
        title: 'Comentário',
        text: `Comentário Excluído`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.buscarComentariosDiscussao();
        this.atualizarDiscussao();
      }, error => { });
    });
  }

  onEditar(id) {
    if (this.formComentarioEditar.valid) {
      this.novoComentario.comentario = this.formComentarioEditar.controls.comentario.value;
      this.novoComentario.discussao = Number(this.idDiscussao);
      this.novoComentario.usuario = this.usuarioLogado.id;
      this.novoComentario.id = id;
      this.editar();
      this.formComentarioEditar.reset();
    }
  }

  editar() {
    this.loadingEnviarComentario = true;
    this.comentariosDiscussaoService.editar(this.novoComentario).subscribe(async response => {
      this.loadingEnviarComentario = false;
      await PcsUtil.swal().fire({
        title: 'Comentário',
        text: `Comentário Editado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.onClickEditar(this.novoComentario.id);
        this.buscarComentariosDiscussao();
      }, error => { });
    });
  }

  alterarUsuarioUltimaPostagem() {
    this.discussao.usuarioUltimaPostagem = this.usuarioLogado;
    this.forumDiscussaoService.atualizarUsuarioUltimaPostagem(this.discussao).subscribe(response => {});
  }

  ativarCampoRespostaComentarioFilho(comentarioPai: number) {
    if(!this.listaComentariosPai.includes(comentarioPai)) {
      this.listaComentariosPai.push(comentarioPai);
    }
    
  }

  mostrarComentariosFilhos(comentarioPai): boolean {
    if(this.listaComentariosPai.includes(comentarioPai)) {
      return true;
    } else {
      return false;
    }
  }

  openModalInfoUser(comentario) {
    this.usuarioService.buscarPerfisCidade(comentario.usuario).subscribe(usuario => {
      this.usuarioComentario = usuario as UsuarioPerfisCidade;
    });
    const dialogRef = this.dialog.open(this.modalInfoUser, {
      height: '400px',
      width: '500px',
    });
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
