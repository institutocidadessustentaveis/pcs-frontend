import { UsuarioPerfisCidade } from './../../../../../model/usuarioPerfisCidade';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { comentarioDiscussao } from 'src/app/model/comentario-discussao';
import { ForumDiscussao } from 'src/app/model/forum-discussao';
import { Usuario } from 'src/app/model/usuario';
import { ComentarioDiscussaoFilhoService } from 'src/app/services/comentario-discussao-filho.service';
import { ForumDiscussaoService } from 'src/app/services/forum-discussao.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-comentarios-filhos',
  templateUrl: './comentarios-filhos.component.html',
  styleUrls: ['./comentarios-filhos.component.css']
})
export class ComentariosFilhosComponent implements OnInit {

  @Input() public idComentarioPai: number;
  @Input() public idDiscussao: number;
  @Input() public usuarioLogado: Usuario
  @Input() public discussao: ForumDiscussao

  public usuarioEstaLogado: boolean = false;

  novoComentario: comentarioDiscussao = new comentarioDiscussao();
  public responderComentario: boolean = false;
  public comentarios = new Array<comentarioDiscussao>();
  formComentarioFilho: FormGroup;
  formComentarioFilhoEditar: FormGroup;
  public nomePerfil: string[] = [];
  public mostrarEdicao: number[] = [];

  public loadingEnviarComentario: boolean = false;
  public isModoEdicao: boolean = false;

  @Output() public atualizarDiscussaoEvent = new EventEmitter();

  @ViewChild('modalInfo') modalInfo: TemplateRef<any>;
  @ViewChild('modalInfoUser') modalInfoUser: TemplateRef<any>;
  public imagensCorpoComentario: any[] = [];
  usuarioComentario: UsuarioPerfisCidade = new UsuarioPerfisCidade();

  public editorConfig: any = {
    height: '100px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['', []],
      ['', ['', '', '']],
      ['insert', ['table', 'link', 'picture']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { 
      onPaste: function (e) { 
        var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); 
        e.preventDefault(); 
        document.execCommand('insertText', false, bufferText); 
      } ,
      onImageUpload: file => {
        this.comentarioDiscussaoFilhoService
          .salvarImagemCorpoComentarioFilho(file[0])
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

          this.comentarioDiscussaoFilhoService
            .apagarImagemCorpoComentarioFilho(imagem.id)
            .subscribe(response => {});
        }
      }
    }
  };

  constructor(private comentarioDiscussaoFilhoService: ComentarioDiscussaoFilhoService,
              private formBuilder: FormBuilder, public dialog: MatDialog, private forumDiscussaoService: ForumDiscussaoService,
              private usuarioService: UsuarioService) { 
    this.formComentarioFilho = this.formBuilder.group({
      comentarioFilho: [null, Validators.required]
    });
    this.formComentarioFilhoEditar = this.formBuilder.group({
      comentario: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.buscarComentariosFilhos(this.idComentarioPai);
  }

  buscarComentariosFilhos(idComentarioPai: number) {
    this.comentarioDiscussaoFilhoService.buscarComentariosFilhosPorIdComentarioPai(idComentarioPai).subscribe(res => {
      this.comentarios = res;
    });
  }

  salvarComentarioFilho() {
    this.responderComentario = false;

    this.novoComentario.discussao = this.idDiscussao;
    this.novoComentario.usuario = this.usuarioLogado.id;
    this.novoComentario.comentario = this.formComentarioFilho.controls.comentarioFilho.value;
    this.novoComentario.comentarioPai = this.idComentarioPai;

    this.comentarioDiscussaoFilhoService.inserir(this.novoComentario).subscribe(res => {
      PcsUtil.swal().fire({
        title: 'Comentário',
        text: `Comentário Enviado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.formComentarioFilho.reset();
        this.atualizarDiscussaoEvent.emit(true);
        this.buscarComentariosFilhos(this.idComentarioPai);
      });
      
    })
  }


  podeExcluir(comentario: comentarioDiscussao) {
    this.nomePerfil = this.usuarioLogado.nomePerfil.split(' | ');
    if (this.nomePerfil.includes('Administrador')) {
      return true;
    }
    if (this.usuarioLogado.id === comentario.usuario) {
      return true;
    }
    return false;
  }

  podeEditar(comentario: comentarioDiscussao) {
    if (this.usuarioLogado.id === comentario.usuario) {
      return true;
    }
    return false;
  }

  deletar(comentario) {
    this.loadingEnviarComentario = true;
    this.comentarioDiscussaoFilhoService.excluir(comentario.id).subscribe(async response => {
      this.loadingEnviarComentario = false;
      await PcsUtil.swal().fire({
        title: 'Comentário',
        text: `Comentário Excluído`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.atualizarDiscussaoEvent.emit(false);
        this.buscarComentariosFilhos(this.idComentarioPai);
      }, error => { });
    });
  }


  editar() {
    this.loadingEnviarComentario = true;
    this.comentarioDiscussaoFilhoService.editar(this.novoComentario).subscribe(async response => {
      this.loadingEnviarComentario = false;
      await PcsUtil.swal().fire({
        title: 'Comentário',
        text: `Comentário Editado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.onClickEditar(this.novoComentario.id);
        this.buscarComentariosFilhos(this.idComentarioPai);
        this.isModoEdicao = false;
      }, error => { });
    });
  }

  onModoEditar(id) {
    this.isModoEdicao = true;
    return this.mostrarEdicao.includes(id);
  }

  onEditar(id) {
    if (this.formComentarioFilhoEditar.valid) {
      this.novoComentario.comentario = this.formComentarioFilhoEditar.controls.comentario.value;
      this.novoComentario.discussao = Number(this.idDiscussao);
      this.novoComentario.usuario = this.usuarioLogado.id;
      this.novoComentario.id = id;
      this.editar();
      this.formComentarioFilhoEditar.reset();
    }
  }

  onClickEditar(id) {
    this.formComentarioFilhoEditar.controls.comentario.setValue(null);
    if (this.mostrarEdicao.includes(id)) {
      this.mostrarEdicao.splice(this.mostrarEdicao.indexOf(id), 1);
    } else {
      this.mostrarEdicao.push(id);
    }
    return true;
  }

  openModalInfo() {
    const dialogRef = this.dialog.open(this.modalInfo, {
      height: '200px',
      width: '300px',
    });
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
