import { MaterialInstitucional } from './../../../model/material-institucional';
import { MaterialApoio } from './../../../model/MaterialApoio';
import { environment } from './../../../../environments/environment.homologacao';
import { NgIf } from '@angular/common';
import { MaterialInstitucionalService } from 'src/app/services/material-institucional.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MaterialApoioService } from 'src/app/services/materialApoio.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PublicacaoService } from 'src/app/services/publicacao.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-institucional-publicacao',
  templateUrl: './institucional-publicacao.component.html',
  styleUrls: ['./institucional-publicacao.component.css']
})
export class InstitucionalPublicacaoComponent implements OnInit {
  constructor(
    private dialog: MatDialogRef<InstitucionalPublicacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private materialInstitucionalService: MaterialInstitucionalService,
    private materialApoioService: MaterialApoioService,
    private domSanitizationService: DomSanitizer,
    private publicacaoService: PublicacaoService,
  ) {}

  tipoPublicacao = '0';
  publicacao: any = {};
  materialInstitucionalSelecionado = 0;
  materialApoioSelecionado = 0;
  listaMaterialInstitucional = [];
  listaMaterialApoio = [];
  imagem = '';
  imagemSafeUrl: SafeUrl;
  titulo = '';
  tooltipTitulo = '';
  tooltipTexto = '';
  ordemExibicao = '';
  texto = '';
  link = '';
  id;
  editar = false;
  imageChanged = false;

  eventTeste: ImageCroppedEvent;

  urlbackend = environment.API_URL;


  imageChangedEvent: any = '';

  ngOnInit() {
    if (this.data) {
      this.publicacao = this.data;
      this.publicacao.tipoPublicacao ? this.tipoPublicacao = this.publicacao.tipoPublicacao : this.tipoPublicacao = '0';
      this.publicacao.MaterialInstitucionalSelecionado ? this.materialInstitucionalSelecionado = this.publicacao.MaterialInstitucionalSelecionado : this.materialInstitucionalSelecionado = 0;
      this.publicacao.materialApoioSelecionado ? this.materialApoioSelecionado = this.publicacao.materialApoioSelecionado : this.materialApoioSelecionado = 0;
      this.publicacao.listaMaterialInstitucional ? this.listaMaterialInstitucional = this.publicacao.listaMaterialInstitucional : this.listaMaterialInstitucional = [];
      this.publicacao.imagem ? this.imagem = this.publicacao.imagem : this.imagem = '';
      this.publicacao.imagemSafeUrl ? this.imagemSafeUrl = this.publicacao.imagemSafeUrl : '';
      this.publicacao.titulo ? this.titulo = this.publicacao.titulo : this.titulo = '';
      this.publicacao.tooltipTitulo ? this.tooltipTitulo = this.publicacao.tooltipTitulo : this.tooltipTitulo = '';
      this.publicacao.tooltipTexto ? this.tooltipTexto = this.publicacao.tooltipTexto : this.tooltipTexto = '';
      this.publicacao.ordemExibicao ? this.ordemExibicao = this.publicacao.ordemExibicao : this.ordemExibicao = '';
      this.publicacao.texto ? this.texto = this.publicacao.texto : this.texto = '';
      this.publicacao.link ? this.link = this.publicacao.link : this.link = '';
      this.publicacao.id ? this.id = this.publicacao.id : this.id = null;
      this.publicacao.editado = this.id ? true : false;

      if (this.publicacao.idMaterialInstitucional) {
        this.tipoPublicacao = '1';
      }
      if (this.publicacao.idMaterialApoio) {
        this.tipoPublicacao = '2';
      }
      if (this.publicacao.titulo) {
        this.tipoPublicacao = '3';
      }
    }

    this.materialInstitucionalService.buscarParaCombo().subscribe(res => {
      this.listaMaterialInstitucional = res;
    });
    this.materialApoioService.buscarParaCombo().subscribe(res => {
      this.listaMaterialApoio = res;
    });
  }
  confirmar() {
    const publicacaoNova: any = {};
    publicacaoNova.editado = this.id ? true : false;
    
    if (this.tipoPublicacao == '1') {
        publicacaoNova.idMaterialInstitucional = this.materialInstitucionalSelecionado;
        publicacaoNova.tooltipTitulo = this.tooltipTitulo;
        publicacaoNova.tooltipTexto = this.tooltipTexto;
        this.materialInstitucionalService
          .buscarPorId(publicacaoNova.idMaterialInstitucional)
          .subscribe(matInstitucional => {
            publicacaoNova.materialInstitucional = matInstitucional;
            publicacaoNova.imagem = this.imagem;
            
            
            this.dialog.close(publicacaoNova);
          });
      }
    if (this.tipoPublicacao == '2') {
        publicacaoNova.idMaterialApoio = this.materialApoioSelecionado;
        publicacaoNova.tooltipTitulo = this.tooltipTitulo;
        publicacaoNova.tooltipTexto = this.tooltipTexto;
        this.materialApoioService
          .buscarMaterialDeApoioPorId(publicacaoNova.idMaterialApoio)
          .subscribe(matApoio => {
            publicacaoNova.materialApoio = matApoio;
            this.dialog.close(publicacaoNova);
          });
      }
    if (this.tipoPublicacao == '3') {
        if (
          !this.link.startsWith('http://') &&
          !this.link.startsWith('https://')
        ) {
          publicacaoNova.link = `http://${this.link}`;
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
  }
  public cancelar() {
    const cancelar: any = {cancelado: true };
    this.dialog.close(cancelar);
  }
}
