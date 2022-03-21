import { environment } from '../../../../environments/environment';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { Publicacao } from '../../../model/publicacao';
import { Component, OnInit, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Router, ActivatedRoute } from '@angular/router';

import { InstitucionalInternoService } from 'src/app/services/institucional-interno.service';
import { InstitucionalInterno } from 'src/app/model/institucional-interno';

import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { TemplateInstitucional01 } from 'src/app/model/template-institucional-01';
import { TemplateInstitucional02 } from 'src/app/model/template-institucional-02';
import { Arquivo } from 'src/app/model/arquivo';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MaterialInstitucionalService } from 'src/app/services/material-institucional.service';
import { MaterialApoioService } from 'src/app/services/materialApoio.service';
import { TemplateInstitucional03 } from 'src/app/model/template-institucional-03';
import { PublicacaoService } from 'src/app/services/publicacao.service';
import { InstitucionalPublicacaoComponent } from '../institucional-publicacao/institucional-publicacao.component';
import { TemplateInstitucional04 } from 'src/app/model/template-institucional-04';
import { ShapeFileService } from 'src/app/services/shapefile.service';
declare var $;
@Component({
  selector: 'app-objetivo-desenvolvimento-sustentavel-form',
  templateUrl: './institucional-interno-form.component.html',
  styleUrls: ['./institucional-interno-form.component.css']
})
export class InstitucionalInternoFormComponent implements OnInit {
  @ViewChild('modalLoading') modalLoading: TemplateRef<any>;
  
  public imageChangedEvent: any = '';

  public imagemPublicacaoChangedEvent: any = '';
  public imagemPrimeiraSecaoChangedEvent: any = '';

  public shapeFiles: any[];

  imagensCorpoPaginaInstitucional: any[] = [];

  public editorCaminhoMigalhasConfig: any = {
    height: '100px',
    placeholder: '',
    tabsize: 2,
    toolbar: [
      
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['fontsize'],
      ['color', ['color']],
      ['insert', ['link']]
    ],
    buttons: {
      'Blockquote': this.insertBlockquoteButton(),
      'H1': this.intertituloH1Button(),
      'H2': this.intertituloH2Button(),
      'H3': this.intertituloH3Button(),
    },
    callbacks: {
      onPaste: function(e) {
        var bufferText = (
          (e.originalEvent || e).clipboardData || window['clipboardData']
        ).getData('Text');
        e.preventDefault();
        document.execCommand('insertText', false, bufferText);
      },
      onImageUpload: file => {
        this.institucionalInternoService
          .salvarImagemCorpoPaginaInstitucional(file[0])
          .subscribe(response => {
            let path: string = `${environment.API_URL}${response.path}`;
            this.imagensCorpoPaginaInstitucional.push({
              id: response.id,
              path: path,
              file: file[0]
            });
            document.execCommand('insertImage', false, path);
          });
      },
      onMediaDelete: e => {
        let imagensEncontradas = this.imagensCorpoPaginaInstitucional.filter(
          i => i.path === e[0].src
        );

        if (imagensEncontradas.length > 0) {
          let imagem = imagensEncontradas[0];

          this.institucionalInternoService
            .apagarImagemCorpoPaginaInstitucional(imagem.id)
            .subscribe(response => {});
        }
      },
    }
  };

  public editorConfig: any = {
    height: '300px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontname', ['fontname']],
      ['fontsize', ['fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
      ['view', ['fullscreen', 'codeview']],
      ['customButtons', ['Blockquote', 'H1', 'H2', 'H3']]
    ],
    fontNames: [
      'Arial',
      'Arial Black',
      'AT Surt',
      'AT Surt Bold',
      'AT Surt Light',
      'Calibri',
      'Comic Sans MS',
      'Courier New',
      'Futura Book', 
      'Futura Light', 
      'Georgia',
      'Glacial Indiff',
      'Helvetica',
      'Helvetica Neue',
      'Noto Sans',
      'Open Sans',
      'Roboto',
      'Source Sans Pro',
      'Tahoma',
      'Times',
      'trebuchet ms',
      'Verdana'
    ],
    buttons: {
      'Blockquote': this.insertBlockquoteButton(),
      'H1': this.intertituloH1Button(),
      'H2': this.intertituloH2Button(),
      'H3': this.intertituloH3Button(),
    },
    callbacks: {
      onPaste: function(e) {
        var bufferText = (
          (e.originalEvent || e).clipboardData || window['clipboardData']
        ).getData('Text');
        e.preventDefault();
        document.execCommand('insertText', false, bufferText);
      },
      onImageUpload: file => {
        this.institucionalInternoService
          .salvarImagemCorpoPaginaInstitucional(file[0])
          .subscribe(response => {
            let path: string = `${environment.API_URL}${response.path}`;
            this.imagensCorpoPaginaInstitucional.push({
              id: response.id,
              path: path,
              file: file[0]
            });
            document.execCommand('insertImage', false, path);
          });
      },
      onMediaDelete: e => {
        let imagensEncontradas = this.imagensCorpoPaginaInstitucional.filter(
          i => i.path === e[0].src
        );

        if (imagensEncontradas.length > 0) {
          let imagem = imagensEncontradas[0];

          this.institucionalInternoService
            .apagarImagemCorpoPaginaInstitucional(imagem.id)
            .subscribe(response => {});
        }
      }
    }
  };

  public editorSubtituloConfig: any = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      [
        'font',
        [
          'bold',
          'italic',
          'underline',
          'strikethrough',
          'superscript',
          'subscript',
          'clear'
        ]
      ],
      ['fontsize', []],
      ['para', ['height']],
      ['insert', ['table', 'link', 'hr', 'picture', 'video',]],
      ['view', ['fullscreen', 'codeview']],
      ['color', ['color']],
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

  public institucional: InstitucionalInterno = new InstitucionalInterno();
  private linkAnterior: string;
  public tipoTemplate = 'template01';

  arquivo = new Arquivo();
  loading: any;

  public urlBase;
  scrollUp: any;

  public nomeAutor: string;

  public publicacao: Publicacao = null;

  public itensCombosDestaque: Array<ItemCombo>;

  public novaPublicacao = true;
  public urlbackend = environment.API_URL;
  public estaPersistindo = false;


  constructor(
    public institucionalInternoService: InstitucionalInternoService,
    public dialog: MatDialog,
    public authService: AuthService,
    private router: Router,
    private element: ElementRef,
    private activatedRoute: ActivatedRoute,
    public domSanitizationService: DomSanitizer,
    private materialInstitucionalService: MaterialInstitucionalService,
    private materialApoioService: MaterialApoioService,
    private publicacaoService: PublicacaoService,
    private shapeFileService: ShapeFileService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.institucional.template02.corFundoSegundaSecao = '#554f20'

  }

  ngOnInit() {
    this.urlBase = window.location.origin;
    this.institucional.tipoTemplate = this.tipoTemplate;
    this.institucional.template02.corFundoSegundaSecao = '#554f20'

    this.buscarInstitucional();
    this.prepararListaShapeFiles();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  public verificaLink() {
    if (this.linkAnterior !== this.institucional.link_pagina) {
      this.institucionalInternoService
        .existePaginaInstitucionalComLink(this.institucional.link_pagina)
        .subscribe(response => {
          if (
            response.id !== null ||
            this.institucional.link_pagina === 'cidades-signatarias'
          ) {
            this.institucional.link_pagina = '';
            PcsUtil.swal()
              .fire({
                title: 'Inválido!',
                text: `Link já está sendo utilizado.`,
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok'
              })
              .then(result => {});
            return false;
          } else {
            return true;
          }
        });
    }
  }

  insertBlockquoteButton() {
    return (context) => {
      const ui = $.summernote.ui;
      const button = ui.button({
        contents: 'Blockquote',
        tooltip: 'Blockquote',
        click: function () {
          document.execCommand('insertHtml', null, '<blockquote>BLOCKQUOTE</blockquote>');
        }
      });
      return button.render();
    }
  }

  public intertituloH1Button() {
    return (context) => {
      const ui = $.summernote.ui;
      const button = ui.button({
        contents: 'H1',
        tooltip: 'H1',
        click: function () {
          document.execCommand('insertHtml', null, '<h1>Intertítulo H1</h1>');
        }
      });
      return button.render();
    }
  }

  public intertituloH2Button() {
    return (context) => {
      const ui = $.summernote.ui;
      const button = ui.button({
        contents: 'H2',
        tooltip: 'H2',
        click: function () {
          document.execCommand('insertHtml', null, '<h2>Intertítulo H2</h2>');
        }
      });
      return button.render();
    }
  }

  public intertituloH3Button() {
    return (context) => {
      const ui = $.summernote.ui;
      const button = ui.button({
        contents: 'H3',
        tooltip: 'H3',
        click: function () {
          document.execCommand('insertHtml', null, '<h3>Intertítulo H3</h3>');
        }
      });
      return button.render();
    }
  }

  private buscarInstitucional(): void {    
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.institucionalInternoService
          .buscarInstitucionalParaEdicao(id)
          .subscribe(institucional => {            
            this.institucional = institucional;
            this.linkAnterior = institucional.link_pagina;
            this.tipoTemplate = this.institucional.tipoTemplate;

            if (!this.institucional.template01) {
              this.institucional.template01 = new TemplateInstitucional01();
            }

            if (!this.institucional.template02) {
              this.institucional.template02 = new TemplateInstitucional02();
            }

            if (!this.institucional.template03) {
              this.institucional.template03 = new TemplateInstitucional03();
            }

            if (!this.institucional.template04) {
              this.institucional.template04 = new TemplateInstitucional04();
            }

            if (this.institucional.imagemPrincipal) {
              this.institucional.imagemPrincipalSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
                'data:image/png;base64, ' + this.institucional.imagemPrincipal
              );
            }

            if (this.institucional.template02.imagemPrimeiraSecao) {
              this.institucional.template02.imagemPrimeiraSecaoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
                'data:image/png;base64, ' +
                  this.institucional.template02.imagemPrimeiraSecao
              );
            }

            if (this.institucional.template02.imagemTerceiraSecao) {
              this.institucional.template02.imagemTerceiraSecaoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
                'data:image/png;base64, ' +
                  this.institucional.template02.imagemTerceiraSecao
              );
            }

            if (this.institucional.template03.imagemPrimeiraSecao) {
              this.institucional.template03.imagemPrimeiraSecaoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
                'data:image/png;base64, ' +
                  this.institucional.template03.imagemPrimeiraSecao
              );
            }
            if (this.institucional.template03 && this.institucional.template03.publicacoes) {
              let i = 1;
              for (let _p of  this.institucional.template03.publicacoes ) {
                this.configurarPublicacao(_p);
              }
              i = 1;
              for (let _p of  this.institucional.template03.publicacoes2 ) {
                this.configurarPublicacao(_p);
                if (!_p.ordemExibicao) {
                  _p.ordemExibicao = i++;
                }
              }
            }
          });
      }
    });
  }
  public configurarPublicacao(publicacao) {
    if (publicacao) {
      if ( publicacao.idMaterialApoio ) {
        this.materialApoioService.buscarMaterialDeApoioPorId(publicacao.idMaterialApoio ).subscribe(materialApoio => {
          publicacao.materialApoio = materialApoio;
        });
      }
      if ( publicacao.idMaterialInstitucional ) {
        this.materialInstitucionalService.buscarPorId(publicacao.idMaterialInstitucional ).subscribe(materialInstitucional => {
          publicacao.materialInstitucional = materialInstitucional;
        });
      }
    }
  }
  public salvar(): void {
    this.estaPersistindo = true;
    if (this.verificaLink) {
      if (this.institucional.id) {
        this.editar();
      } else {
        this.cadastrar();
      }
    }
  }

  public cadastrar(): void {
    let dialogRef = this.dialog.open(this.modalLoading, {
      height: '300px',
      width: '300px',
    });
    this.preparaTemplates();
    this.institucionalInternoService
      .inserir(this.institucional)
      .subscribe(response => {
        this.dialog.closeAll();
        this.estaPersistindo = false;
        PcsUtil.swal()
          .fire({
            title: 'Institucional',
            text: `Institucional ${this.institucional.titulo} cadastrado.`,
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok'
          })
          .then(
            result => {
              this.router.navigate(['/institucional-interno']);
            },
            error => {}
          );
      },
      error => {
        this.dialog.closeAll();
        this.estaPersistindo = false;
      });
  }

  public editar(): void {
    let dialogRef = this.dialog.open(this.modalLoading, {
      height: '300px',
      width: '300px',
    });
    this.preparaTemplates();   
    this.institucionalInternoService
      .editar(this.institucional)
      .subscribe(institucional => {
        this.dialog.closeAll();
        this.estaPersistindo = false;
        PcsUtil.swal()
          .fire({
            title: 'Institucional',
            text: `Institucional ${this.institucional.titulo} atualizado.`,
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok'
          })
          .then(
            result => {
              this.router.navigate(['/institucional-interno']);
            },
            error => {}
          );
      },
      error => {
        this.estaPersistindo = false;
        this.dialog.closeAll();
      });
  }

  private preparaTemplates() {
    if (this.institucional.tipoTemplate === 'template01') {
      this.institucional.template02 = null;
      this.institucional.template03 = null;
      this.institucional.template04 = null;
    } else if (this.institucional.tipoTemplate === 'template02') {
      if (this.institucional.template02.corFundoSegundaSecao == null || this.institucional.template02.corFundoSegundaSecao == undefined) {
        this.institucional.template02.corFundoSegundaSecao = '#554f20'
      }
      this.institucional.template01 = null;
      this.institucional.template03 = null;
      this.institucional.template04 = null;
    } else if (this.institucional.tipoTemplate === 'template03') {
      this.institucional.template01 = null;
      this.institucional.template02 = null;
      this.institucional.template04 = null;
    } else if (this.institucional.tipoTemplate === 'template04') {
      this.institucional.template01 = null;
      this.institucional.template02 = null;
      this.institucional.template03 = null;
    }
  }

  public processImage(eventInput: any, nomeInput: string) {
    /*const file: File = eventInput.target.files[0];
    const reader = new FileReader();
    if (nomeInput === 'principal') {
      reader.onload = this._handleReaderLoadedPrincipal.bind(this);
    } else if (nomeInput === 'primeiraSecao') {
      reader.onload = this._handleReaderLoadedPrimeiraSecao.bind(this);
    } else if (nomeInput === 'terceiraSecao') {
      reader.onload = this._handleReaderLoadedTerceiraSecao.bind(this);
    }
    reader.readAsBinaryString(file);
    */

    this.loading = true;
    const reader = new FileReader();
    reader.readAsDataURL(eventInput.target.files[0]);
    reader.onload = () => {
      this.arquivo.nomeArquivo = eventInput.target.files[0].name;
      this.arquivo.extensao = reader.result.toString().split(',')[0];
      this.arquivo.conteudo = reader.result.toString().split(',')[1];

      if (
        PcsUtil.tamanhoArquivoEstaDentroDoLimite(
          reader.result.toString().split(',')[1]
        )
      ) {
        const file: File = eventInput.target.files[0];
        const reader = new FileReader();
        if (nomeInput === 'principal') {
          reader.onload = this._handleReaderLoadedPrincipal.bind(this);
        } else if (nomeInput === 'primeiraSecao') {
          reader.onload = this._handleReaderLoadedPrimeiraSecao.bind(this);
        } else if (nomeInput === 'terceiraSecao') {
          reader.onload = this._handleReaderLoadedTerceiraSecao.bind(this);
        }
        reader.readAsBinaryString(file);
      } else {
        PcsUtil.swal()
          .fire({
            title: 'Cadastro de Página Institucional',
            text: `Arquivo excede o tamanho limite de 10 MB`,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok'
          })
          .then(
            result => {},
            error => {}
          );
      }
    };
    this.loading = false;
  }

  _handleReaderLoadedPrincipal(readerEvt) {
    this.institucional.imagemPrincipal = btoa(readerEvt.target.result);
    this.institucional.imagemPrincipalSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
      'data:image/png;base64, ' + this.institucional.imagemPrincipal
    );
  }

  _handleReaderLoadedPrimeiraSecao(readerEvt) {
    if (this.institucional.template02) {
      this.institucional.template02.imagemPrimeiraSecao = btoa(
        readerEvt.target.result
      );
      this.institucional.template02.imagemPrimeiraSecaoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
        'data:image/png;base64, ' +
          this.institucional.template02.imagemPrimeiraSecao
      );
    } else {
      this.institucional.template03.imagemPrimeiraSecao = btoa(
        readerEvt.target.result
      );
      this.institucional.template03.imagemPrimeiraSecaoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
        'data:image/png;base64, ' +
          this.institucional.template03.imagemPrimeiraSecao
      );
    }
  }

  _handleReaderLoadedTerceiraSecao(readerEvt) {
    this.institucional.template02.imagemTerceiraSecao = btoa(
      readerEvt.target.result
    );
    this.institucional.template02.imagemTerceiraSecaoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
      'data:image/png;base64, ' +
        this.institucional.template02.imagemTerceiraSecao
    );
  }

  public tipoTemplateChange(event: any) {
    this.institucional.tipoTemplate = event.value;

    if (event.value === 'template01') {
      this.institucional.template01 = new TemplateInstitucional01();
      this.institucional.template02 = null;
      this.institucional.template03 = null;
      this.institucional.template04 = null;
    } else if (event.value === 'template02') {
      this.institucional.template02 = new TemplateInstitucional02();
      this.institucional.template01 = null;
      this.institucional.template03 = null;
      this.institucional.template04 = null;
    } else if (event.value === 'template03') {
      this.institucional.template03 = new TemplateInstitucional03();
      this.institucional.template01 = null;
      this.institucional.template02 = null;
      this.institucional.template04 = null;
    } else if (event.value === 'template04') {
      this.institucional.template04 = new TemplateInstitucional04();
      this.institucional.template01 = null;
      this.institucional.template02 = null;
      this.institucional.template03 = null;
    }
  }

  public removerImagemPrincipal() {
    this.institucional.imagemPrincipal = null;
    this.institucional.imagemPrincipalSafeUrl = null;
  }

  public removerImagemPrimeiraSecao() {
    if (this.institucional.template02) {
      this.institucional.template02.imagemPrimeiraSecao = null;
      this.institucional.template02.imagemPrimeiraSecaoSafeUrl = null;
    } else {
      this.institucional.template03.imagemPrimeiraSecao = null;
      this.institucional.template03.imagemPrimeiraSecaoSafeUrl = null;
    }
  }

  public removerImagemTerceiraSecao() {
    this.institucional.template02.imagemTerceiraSecao = null;
    this.institucional.template02.imagemTerceiraSecaoSafeUrl = null;
  }

  public verTemplate() {
    alert('template 01');
  }

  public onEnterPrincipal(value: string) {
    this.institucional.nomeAutor = value;
  }

  public onEnterPrimeiraSecao(value: string) {
    this.institucional.template02.nomeAutorImagemPrimeiraSecao = value;
  }

  public onEnterTerceiraSecao(value: string) {
    this.institucional.template02.nomeAutorImagemTerceiraSecao = value;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.institucional.imagemPrincipal = event.base64.split('base64,')[1];
    this.institucional.imagemPrincipalSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
      'data:image/png;base64, ' + this.institucional.imagemPrincipal
    );
  }

  public adicionarPublicacao() {
    if (this.institucional.template03.id) {
      if (!this.publicacao.id) {
        if (!this.institucional.template03.publicacoes) {
          this.institucional.template03.publicacoes = new Array<Publicacao>();
        }
        this.institucional.template03.publicacoes.push(this.publicacao);
        this.publicacao.idTemplate03 = this.institucional.template03.id;
        this.publicacaoService.inserir(this.publicacao).subscribe(res => {});
      } else {
        this.publicacaoService.editar(this.publicacao).subscribe(res => {});
      }
    } else {
      if (!this.institucional.template03.publicacoes) {
        this.institucional.template03.publicacoes = new Array<Publicacao>();
      }
      this.institucional.template03.publicacoes.push(this.publicacao);
    }

    this.limparPublicacao();
    this.imagemPublicacaoChangedEvent = null;
  }

  public limparPublicacao() {
    this.novaPublicacao = true;
    this.publicacao = null;
  }

  public selecionarPublicacao(item: Publicacao) {
    this.novaPublicacao = false;
    this.publicacao = item;
    if (this.publicacao.imagem) {
      this.publicacao.imagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
        'data:image/png;base64, ' + this.publicacao.imagem
      );
    }
  }

  public removerPublicacao() {
    if (this.publicacao.id) {
      this.publicacaoService.excluir(this.publicacao.id).subscribe(res => {});
    }
    const index = this.institucional.template03.publicacoes.indexOf(
      this.publicacao
    );
    this.institucional.template03.publicacoes.splice(index, 1);
    this.publicacao = null;
  }

  public getPublicacoes() {
    if (!this.institucional.template03.publicacoes) {
      this.institucional.template03.publicacoes = new Array();
    }
    return this.institucional.template03.publicacoes.sort((n1, n2) => {
      if (n1.ordemExibicao > n2.ordemExibicao) {
        return 1;
      }
      if (n1.ordemExibicao < n2.ordemExibicao) {
        return -1;
      }
      return 0;
    });
  }

  public imagemPublicacaoChangeEvent(event: any): void {
    this.imagemPublicacaoChangedEvent = event;
  }

  public imagemPublicacaoCropped(event: ImageCroppedEvent) {
    this.publicacao.imagem = event.base64.split('base64,')[1];
    this.publicacao.imagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
      'data:image/png;base64, ' + this.publicacao.imagem
    );
  }


  public imagemPrimeiraSecaoChangeEvent(event: any): void {
    this.imagemPublicacaoChangedEvent = event;
  }

  public imagemPrimeiraSecaoCropped(event: ImageCroppedEvent) {
    this.institucional.template03.imagemPrimeiraSecao = event.base64.split(
      'base64,'
    )[1];
    this.institucional.template03.imagemPrimeiraSecaoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
      'data:image/png;base64, ' +
        this.institucional.template03.imagemPrimeiraSecao
    );
  }

  escolherPublicacao(numeroPublicacao) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '600px';
    dialogConfig.maxWidth = '600px';
    dialogConfig.data = {};
    const dialog = this.dialog.open(
      InstitucionalPublicacaoComponent,
      dialogConfig
    );
    dialog.afterClosed().subscribe(res => {

    });
  }

  onAtualizar(publicacao, numeroPublicacao, numeroSecao) {
    if (publicacao) {
      if (!publicacao.ordemExibicao) {
        this.institucional.template03.publicacoes.forEach(pub => {
          if (pub.ordemExibicao != undefined) {    
            pub.ordemExibicao = pub.ordemExibicao + 1;
          }
        })        
         publicacao.ordemExibicao = 0;
      }
    }
      
    if (numeroSecao === 1) {
      if (this.institucional.template03.publicacoes[numeroPublicacao] == undefined) {
        this.institucional.template03.publicacoes.unshift(publicacao)
      }
      else {
        this.institucional.template03.publicacoes[numeroPublicacao] = publicacao;
      }
      if (publicacao == null) {
        this.institucional.template03.publicacoes.splice(numeroPublicacao, 1);
      }
    } else if (numeroSecao == 2) {
      if (this.institucional.template03.publicacoes2[numeroPublicacao] == undefined) {
        this.institucional.template03.publicacoes2.unshift(publicacao)
      }
      else {
        this.institucional.template03.publicacoes2[numeroPublicacao] = publicacao;
      }
      if (publicacao == null) {
        this.institucional.template03.publicacoes2.splice(numeroPublicacao, 1);
      }
    }
    
  }

  onMoverDireita(evento, indice, secao) {
    if (secao == 1) {
      if ( (indice + 1) >= this.institucional.template03.publicacoes.length ) {
        return;
      }
      const publicacao = this.institucional.template03.publicacoes[indice];
      const publicacaoAnterior = this.institucional.template03.publicacoes[indice + 1];

      publicacao.ordemExibicao = publicacao.ordemExibicao + 1;
      publicacaoAnterior.ordemExibicao = publicacao.ordemExibicao - 1;

      this.institucional.template03.publicacoes[indice + 1] = publicacao;
      this.institucional.template03.publicacoes[indice] = publicacaoAnterior;

    } else {
      if ((indice + 1) >= this.institucional.template03.publicacoes2.length ) {
        return;
      }

      const publicacao = this.institucional.template03.publicacoes2[indice];
      const publicacaoAnterior = this.institucional.template03.publicacoes2[ indice + 1];

      publicacao.ordemExibicao = publicacao.ordemExibicao + 1;
      publicacaoAnterior.ordemExibicao = publicacao.ordemExibicao - 1;

      this.institucional.template03.publicacoes2[indice + 1] = publicacao;
      this.institucional.template03.publicacoes2[indice] = publicacaoAnterior;
    }
  }
  onMoverEsquerda(evento, indice, secao) {

    if (indice == 0) {
      return;
    }
    if (secao == 1) {
      const publicacao = this.institucional.template03.publicacoes[indice];
      const publicacaoAnterior = this.institucional.template03.publicacoes[indice - 1];
      publicacao.ordemExibicao = publicacao.ordemExibicao - 1;
      publicacaoAnterior.ordemExibicao = publicacao.ordemExibicao + 1;
      this.institucional.template03.publicacoes[indice - 1] = publicacao;
      this.institucional.template03.publicacoes[indice] = publicacaoAnterior;

    } else {
      const publicacao = this.institucional.template03.publicacoes2[indice];
      const publicacaoAnterior = this.institucional.template03.publicacoes2[indice - 1];
      publicacao.ordemExibicao = publicacao.ordemExibicao - 1;
      publicacaoAnterior.ordemExibicao = publicacao.ordemExibicao + 1;
      this.institucional.template03.publicacoes2[indice - 1] = publicacao;
      this.institucional.template03.publicacoes2[indice] = publicacaoAnterior;

    }
  }

  private prepararListaShapeFiles() {
    this.shapeFileService.buscarShapesListagemMapa().subscribe((shapes) => {
      this.shapeFiles = shapes;
    });
  }

  public alterarFiltro($event) {
    this.institucional.possuiFiltro = $event.checked;
  }

}
