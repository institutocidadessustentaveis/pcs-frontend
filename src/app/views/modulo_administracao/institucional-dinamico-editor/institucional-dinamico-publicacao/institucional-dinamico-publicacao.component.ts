import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PublicacaoService } from 'src/app/services/publicacao.service';
import { environment } from './../../../../../environments/environment';
import { Console } from 'console';

@Component({
  selector: 'app-institucional-dinamico-publicacao',
  templateUrl: './institucional-dinamico-publicacao.component.html',
  styleUrls: ['./institucional-dinamico-publicacao.component.css']
})
export class InstitucionalDinamicoPublicacaoComponent implements OnInit {
  constructor(
    private dialog: MatDialogRef<InstitucionalDinamicoPublicacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private domSanitizationService: DomSanitizer,
    public pcsUtil: PcsUtil
  ) {}

  tipoPublicacao = '3';
  publicacao: any = {};
  materialInstitucionalSelecionado = 0;
  materialApoioSelecionado = 0;
  listaMaterialInstitucional = [];
  listaMaterialApoio = [];
  imagem = '';
  imagemSafeUrl: SafeUrl;
  titulo = '';
  tituloSemTags = '';
  tooltipTitulo = '';
  tooltipTexto = '';
  ordemExibicao = '';
  texto = '';
  textoSemTags = '';
  link = '';
  id;
  editar = false;
  imageChanged = false;

  eventTeste: ImageCroppedEvent;

  urlbackend = environment.API_URL;

  imageChangedEvent: any = '';

  public editorConfig: any = {
    height: '100px',
    toolbar: [
      [
        'font',
        [
          'bold'
        ]
      ],
      ['fontname', ['fontname']],
      ['fontsize', ['fontsize', 'color']],
      ['para', ['paragraph']],
    ],
    fontNames: [
      'Helvetica',
      'Helvetica Neue',
      'Arial',
      'Arial Black',
      'Comic Sans MS',
      'Courier New',
      'Roboto',
      'Times',
      'Calibri',
      'Georgia',
      'Tahoma',
      'Verdana',
      'trebuchet ms',
      'Source Sans Pro',
      'Open Sans',
      'Noto Sans',
      'AT Surt Bold',
      'AT Surt Light',
      'AT Surt', 
      'Futura Book', 
      'Futura Light', 
      'Glacial Indiff'
    ],
    callbacks: {
      onPaste(e) {
        const bufferText = (
          (e.originalEvent || e).clipboardData || window['clipboardData']
        ).getData('Text');
        e.preventDefault();
        document.execCommand('insertText', false, bufferText);
      }
    }
  };

  ngOnInit() {
    if (this.data) {
      this.publicacao = this.data;

      this.publicacao.tipoPublicacao ? this.tipoPublicacao = this.publicacao.tipoPublicacao : this.tipoPublicacao = '0';
      this.publicacao.MaterialInstitucionalSelecionado ? this.materialInstitucionalSelecionado = this.publicacao.MaterialInstitucionalSelecionado : this.materialInstitucionalSelecionado = 0;
      this.publicacao.materialApoioSelecionado ? this.materialApoioSelecionado = this.publicacao.materialApoioSelecionado : this.materialApoioSelecionado = 0;
      this.publicacao.listaMaterialInstitucional ? this.listaMaterialInstitucional = this.publicacao.listaMaterialInstitucional : this.listaMaterialInstitucional = [];
      this.publicacao.imagem ? this.imagem = this.publicacao.imagem : this.imagem = null;
      this.publicacao.imagemSafeUrl ? this.imagemSafeUrl = this.publicacao.imagemSafeUrl : '';
      this.publicacao.titulo ? this.titulo = this.publicacao.titulo : this.titulo = '';
      this.publicacao.titulo ? this.tituloSemTags = this.pcsUtil.replaceHtmlTags(this.publicacao.titulo).replace(/\&nbsp;/g, '') : this.tituloSemTags = '';
      this.publicacao.tooltipTitulo ? this.tooltipTitulo = this.publicacao.tooltipTitulo : this.tooltipTitulo = '';
      this.publicacao.tooltipTexto ? this.tooltipTexto = this.publicacao.tooltipTexto : this.tooltipTexto = '';
      this.publicacao.ordemExibicao ? this.ordemExibicao = this.publicacao.ordemExibicao : this.ordemExibicao = '';
      this.publicacao.texto ? this.texto = this.publicacao.texto : this.texto = '';
      this.publicacao.texto ? this.textoSemTags = this.pcsUtil.replaceHtmlTags(this.publicacao.texto).replace(/\&nbsp;/g, '') : this.textoSemTags = '';
      this.publicacao.link ? this.link = this.publicacao.link : this.link = '';
      this.publicacao.id ? this.id = this.publicacao.id : this.id = null;
      this.publicacao.editado = this.id ? true : false;
    }

  }
  confirmar() {
    const publicacaoNova: any = {};
    publicacaoNova.editado = this.id ? true : false;
    
    if (
      !this.link.startsWith('http://') &&
      !this.link.startsWith('https://')
      ) {
          publicacaoNova.link ? publicacaoNova.link = `http://${this.link}` : publicacaoNova.link = '';
      } else {
          publicacaoNova.link = this.link;
      }

        publicacaoNova.titulo = this.titulo;
        publicacaoNova.texto = this.texto;
        publicacaoNova.imagem = this.imagem;
        publicacaoNova.tooltipTitulo = this.tooltipTitulo;
        publicacaoNova.tooltipTexto = this.tooltipTexto;
        publicacaoNova.ordemExibicao = this.ordemExibicao;
        publicacaoNova.id = this.id;
        this.dialog.close(publicacaoNova);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageChanged = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.imagem = event.base64.split('base64,')[1];
    this.imagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
      'data:image/png;base64, ' + this.imagem
    );
  }

  public removerImagemPrincipal() {
    this.imagem = null;
    this.imagemSafeUrl = null;
    this.imageChangedEvent = '';
    this.publicacao.imagem = null;
  }
  public cancelar() {
    const cancelar: any = {cancelado: true };
    this.dialog.close(cancelar);
  }

  onChangeTitulo(event) {
    this.tituloSemTags = this.pcsUtil.replaceHtmlTags(event).replace(/\&nbsp;/g, '');
  }

  onChangeTexto(event) {
    this.textoSemTags = this.pcsUtil.replaceHtmlTags(event).replace(/\&nbsp;/g, '');
  }
}
