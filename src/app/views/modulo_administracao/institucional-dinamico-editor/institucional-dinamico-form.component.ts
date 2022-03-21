import { ResponsavelPapeis } from './../add-responsavel/add-responsavel.component';
import { InstitucionalDinamicoSecao1 } from '../../../model/institucional-dinamico-secao1';
import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Arquivo } from 'src/app/model/arquivo';
import { EditarIndiceSecaoComponent } from './editar-indice-secao/editar-indice-secao.component';
import { InstitucionalDinamico } from 'src/app/model/institucional-dinamico';
import { InstitucionalDinamicoService } from 'src/app/services/institucional-dinamico.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { environment } from 'src/environments/environment';
import { InstitucionalInternoService } from 'src/app/services/institucional-interno.service';
import { InstitucionalDinamicoSecao2 } from 'src/app/model/institucional-dinamico-secao2';
import { InstitucionalDinamicoSecao4 } from 'src/app/model/institucional-dinamico-secao4';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { InstitucionalDinamicoSecao3 } from 'src/app/model/institucional-dinamico-secao3';
import { InstitucionalDinamicoPublicacao } from 'src/app/model/institucional-dinamico-publicacao';
import { InstitucionalDinamicoImagem } from 'src/app/model/institucional-dinamico-imagem';
declare var $;

@Component({
  selector: 'app-institucional-dinamico-form',
  templateUrl: './institucional-dinamico-form.component.html',
  styleUrls: ['./institucional-dinamico-form.component.css', './institucional-dinamico-form.component.scss']
})
export class InstitucionalDinamicoFormComponent implements OnInit {

  public editorCaminhoMigalhasConfig: any = {
    height: '100px',
    placeholder: '',
    tabsize: 2,
    toolbar: [
      
      ['misc', ['codeview', 'undo', 'redo']],
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['fontsize'],
      ['insert', ['link']],
      ['fontname', ['fontname']],
      ['fontsize', ['fontsize', 'color']],
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

  public editorTituloConfig: any = {
    height: '120px',
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
      ['fontsize', ['fontsize', 'color']],
      ['para', ['paragraph']],
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

  public editorCleanConfig: any = {
    height: '100px',
    toolbar: [
      [, []],
      [, []],
      [, []],
      [, []],
      [, []],
      [, []]
    ],
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  public editorConfigRecursoExterno: any = {
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

  public imagemGaleriaChangedEvent: any = '';

  public institucionalDinamico: InstitucionalDinamico = new InstitucionalDinamico();
  private linkAnterior: string;

  arquivo = new Arquivo();
  loading: any;

  public urlBase;
  scrollUp: any;



  public step;

  public isShowPreview = false;

  public primeiraSecaoSelecionada: InstitucionalDinamicoSecao1 = null;
  public segundaSecaoSelecionada: InstitucionalDinamicoSecao2 = null;
  public terceiraSecaoSelecionada: InstitucionalDinamicoSecao3 = null;
  public quartaSecaoSelecionada: InstitucionalDinamicoSecao4 = null;
  public institucionalDinamicoImagemRef: InstitucionalDinamicoImagem = new InstitucionalDinamicoImagem();
  public imageSelected = false;
  public imagemCropGaleriaAux: InstitucionalDinamicoImagem = null;

  public todasSecoes: any[] = [];
  public shapeFiles: any[];
  public todasSecoesResumidas: any[] = [];
  public dataSourceSecao: any;
  public displayedColumnsSecao: string[] = ['indiceSecao', 'tipoSecao', 'tituloSecao', 'exibirSecao', 'acoesSecao'];

  public publicacao: InstitucionalDinamicoPublicacao = null;

  public imageChangedEvent: any = '';
  private urlbackend = environment.API_URL;

  imagensCorpoPaginaInstitucional: any[] = [];

  public setStep(index: number) {
    this.step = index;
  }

  public nextStep() {
    this.step++;
  }

  public prevStep() {
    this.step--;
  }

  public exibirConfigRecursosExternosSecao01 = false;
  public exibirConfigRecursosExternosSecao02PrimeiraCol = false;
  public exibirConfigRecursosExternosSecao02SegundaCol = false;
  public exibirConfigRecursosExternosSecao04 = false;


  constructor(public institucionalDinamicoService: InstitucionalDinamicoService,
              public institucionalInternoService: InstitucionalInternoService,
              public shapeFileService: ShapeFileService,
              public dialog: MatDialog,
              public authService: AuthService,
              private router: Router,
              private element: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private activatedRoute: ActivatedRoute, 
              public domSanitizationService: DomSanitizer,
              public pcsUtil: PcsUtil) {
                this.scrollUp = this.router.events.subscribe((path) => {
                  element.nativeElement.scrollIntoView();
                });
              }

  ngOnInit() {
    this.urlBase = window.location.origin;
    this.buscarInstitucionalDinamico();
    this.prepararListaShapeFiles();
  }

  //SUMMERNOTE BOTÕES
  public insertBlockquoteButton() {
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

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  //INSTITUCIONAL DINÂMICO
  private buscarInstitucionalDinamico(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.institucionalDinamicoService.buscarIdsInstitucionalDinamicoPorId(id).subscribe((response) => {
          this.institucionalDinamico = response;
          this.linkAnterior = this.institucionalDinamico.link_pagina;


          if ( this.institucionalDinamico && this.institucionalDinamico.imagens) {
            for (let item of this.institucionalDinamico.imagens) {
              item.safeUrl = this.domSanitizationService.bypassSecurityTrustUrl('data:image/png;base64, ' + item.conteudo);
            }
          }
          if (!this.institucionalDinamico.imagens) {
            this.institucionalDinamico.imagens = [];
          }




          this.buscarListaSecoesResumida();

        });
      }
    });
  }

  public salvar(){

    if (this.linkAnterior !== this.institucionalDinamico.link_pagina) {
      this.institucionalDinamicoService
        .existeInstitucionalDinamicoComLink(this.institucionalDinamico.link_pagina)
        .subscribe(response => {
          if (response.id !== null) {
            this.institucionalDinamico.link_pagina = "";
            PcsUtil.swal().fire({
                title: "Inválido!",
                text: `Link já está sendo utilizado.`,
                type: "warning",
                showCancelButton: false,
                confirmButtonText: "Ok"
              })
              .then(result => {});
          }else{
            if (this.institucionalDinamico.id) {
              this.editar();
            } else {
              this.cadastrar();
            }
          }
        });
    } else if (this.institucionalDinamico.id) {
        this.editar();
    }
  }

  public cadastrar(): void {
    this.loading = true;
    this.institucionalDinamicoService.inserir(this.institucionalDinamico).subscribe(response => {
      PcsUtil.swal().fire({
        title: 'Página',
        text: `Página ${this.institucionalDinamico.titulo} cadastrada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
        this.router.navigate(['/paginas-editor/lista']);
      }, error => {this.loading = false;});
    });
  }

  public editar(): void {
    this.loading = true;
    this.institucionalDinamicoService.editar(this.institucionalDinamico).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Página',
        text: `${this.institucionalDinamico.titulo} atualizada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
        this.router.navigate(['/paginas-editor/editar/' + this.institucionalDinamico.id]);
      }, error => {this.loading = false;});
    });
  }

  public voltarListaPaginas() {
    this.router.navigate([`/paginas-editor/lista`]);
  }

  //INDICE
  private ordernarPorIndiceTodasSecoesResumidas() {
    this.todasSecoesResumidas.sort((n1, n2) => {
      if (n1.indice > n2.indice) {
          return 1;
      }
      if (n1.indice < n2.indice) {
          return -1;
      }
      return 0;
    });
  }

  public alteraIndiceSecao(secaoSelecionado: any) {

    const secao = secaoSelecionado;
    const dialogRef = this.dialog.open(EditarIndiceSecaoComponent, {
      width: '25%',
      data: {
        obj : secao
      }
    });

    dialogRef.afterClosed().subscribe( response => {
      if (response) {
        const secaoSel = response as any;
        this.editarIndiceSecao(secaoSel);
      }
    });
  }

  private editarIndiceSecao(secao: any): void {
    this.loading = true;
    this.institucionalDinamicoService.editarIndiceSecao(secao.tipo, secao.id, secao.indice).subscribe(response => {
      const id = response as any;
      if (id) {
        PcsUtil.swal().fire({
          title: 'Indíce',
          text: `Salvo.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.loading = false;
        }, error => {this.loading = false;});
      }
      this.loading = false;
      this.todasSecoesResumidas = [...this.todasSecoesResumidas];
      this.dataSourceSecao = this.todasSecoesResumidas;
      this.ordernarPorIndiceTodasSecoesResumidas();
    });
  }

  //IMAGEM
  public removerImagemPrincipal() {
    this.institucionalDinamico.imagemPrincipal = null;
    this.institucionalDinamico.imagemPrincipalSafeUrl = null;
    this.institucionalDinamico.idImagemPrincipal = null;
  }

  public onEnterPrincipal(value: string) {
    this.institucionalDinamico.nomeAutor = value;
  }


  public removerImagemSegundaSecao() {
    this.segundaSecaoSelecionada.imagem = null;
    this.segundaSecaoSelecionada.imagemSafeUrl = null;
    this.segundaSecaoSelecionada.idImagem = null;
  }

  public onEnterSegundaSecao(value: string) {
    this.segundaSecaoSelecionada.autorImagem = value;
  }



  public editarGaleria(): void {
    this.loading = true;
    this.institucionalDinamicoService.editarGaleria(this.institucionalDinamico.id, this.institucionalDinamicoImagemRef).subscribe(response => {
      const foundIndex = this.institucionalDinamico.imagens.findIndex(x => x == this.institucionalDinamicoImagemRef);
      this.institucionalDinamico.imagens[foundIndex].id = response.id;
      PcsUtil.swal().fire({
        title: 'Galeria',
        text: `Atualizada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
        this.router.navigate(['/paginas-editor/editar/' + this.institucionalDinamico.id]);
      }, error => {this.loading = false;});
    });
  }

  public ordernarGaleriaDeImagens(newValue) {
    if (this.institucionalDinamico && this.institucionalDinamico.imagens) {
      this.institucionalDinamico.imagens.sort(function(a, b) {
        return a.indice - b.indice;
      });
    }
  }


  public cortarImagem() {
    this.imagemGaleriaChangedEvent = '';
    this.imagemCropGaleriaAux = null;
  }


  _handleReaderLoadedGaleria(readerEvt) {
    if (this.institucionalDinamico.imagens.length < 20) {
      const imagem: InstitucionalDinamicoImagem = new InstitucionalDinamicoImagem();
      imagem.conteudo = btoa(readerEvt.target.result);
      imagem.safeUrl = this.domSanitizationService.bypassSecurityTrustUrl('data:image/png;base64, ' + imagem.conteudo);
      this.imagemCropGaleriaAux = imagem;
      this.institucionalDinamico.imagens.push(imagem);
    } else {
      PcsUtil.swal().fire({
        title: 'Limite de arquivos atingido',
        text: `Máximo de vinte arquivos`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.imagemGaleriaChangedEvent = '';
        this.imagemCropGaleriaAux = null;
      }, error => { });
    }
  }

  geraImagemInstitucional(imagem) {
    if (!imagem.id) {
      return this.domSanitizationService.bypassSecurityTrustUrl(
        'data:image/png;base64, ' + imagem
      );
    } else {
      return this.urlbackend + 'institucionalDinamico/imagem/' + imagem.id;
    }
  }


  public carregaImagem(imagem: InstitucionalDinamicoImagem) {
    this.institucionalDinamicoImagemRef = imagem;
    this.imageSelected = true;
    this.imagemGaleriaChangedEvent = '';
  }

  public deletarImagemDaGaleria(imagem: InstitucionalDinamicoImagem) {
    const swalWithBootstrapButtons =  PcsUtil.swal().mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    });

    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a imagem?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.institucionalDinamico.imagens.splice(this.institucionalDinamico.imagens.indexOf(imagem), 1);
        if (imagem.id != null) {
          this.institucionalDinamicoService.excluirImagem(imagem.id).subscribe();
        }
        this.imagemCropGaleriaAux = null;
        this.institucionalDinamicoImagemRef = new InstitucionalDinamicoImagem();
        this.imageSelected = false;
        this.imagemGaleriaChangedEvent = '';
      }
    });
  }

  geraImagem(imagem) {
    if (imagem) {
      return this.domSanitizationService.bypassSecurityTrustUrl(
        'data:image/png;base64, ' + imagem
      );
    }
  }

  geraImagemPorId(idImagem) {
    if (idImagem) {
      return this.urlbackend + 'institucionalDinamico/imagem/' + idImagem;
    }
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.institucionalDinamico.imagemPrincipal = event.base64.split('base64,')[1];
    this.institucionalDinamico.imagemPrincipalSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
      'data:image/png;base64, ' + this.institucionalDinamico.imagemPrincipal
    );
  }

  processImage(eventInput: any, nomeInput: string, secao: any) {
    this.loading = true;
    const reader = new FileReader();
    reader.readAsDataURL(eventInput.target.files[0]);
    reader.onload = () => {

      this.arquivo.nomeArquivo = eventInput.target.files[0].name;
      this.arquivo.extensao = reader.result.toString().split(',')[0];
      this.arquivo.conteudo = reader.result.toString().split(',')[1];

      if (PcsUtil.tamanhoArquivoEstaDentroDoLimite(reader.result.toString().split(',')[1])) {
        const file: File = eventInput.target.files[0];
        const reader = new FileReader();
        if (nomeInput === 'segundaSecaoImagem') {
          reader.onload = function(readerEvt: any) {
            secao.imagem = btoa(readerEvt.target.result);
            secao.imagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.imagem);
          }.bind(this);
        } else if (nomeInput === 'galeria') {
          reader.onload = this._handleReaderLoadedGaleria.bind(this);
          this.imagemGaleriaChangedEvent = eventInput;
        }
        reader.readAsBinaryString(file);
      } else {
        PcsUtil.swal().fire({
          title: 'Cadastro de Imagem',
          text: `Arquivo excede o tamanho limite de 10 MB`,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {

        }, error => { });
      }

    };
    this.loading = false;
  }

  //SEÇÕES
  private buscarListaSecoesResumida() {

    this.todasSecoesResumidas = [];

    this.buscarListaInstitucionalDinamicoSecao01ResumidaPorId(this.institucionalDinamico.id);

    this.buscarListaInstitucionalDinamicoSecao02ResumidaPorId(this.institucionalDinamico.id);

    this.buscarListaInstitucionalDinamicoSecao03ResumidaPorId(this.institucionalDinamico.id);

    this.buscarListaInstitucionalDinamicoSecao04ResumidaPorId(this.institucionalDinamico.id);
  }

  //SEÇÃO 01
  private async buscarListaInstitucionalDinamicoSecao01ResumidaPorId(id: number) {
    await this.institucionalDinamicoService.buscarListaInstitucionalDinamicoSecao01ResumidaPorId(id).subscribe(response => {

      if(response){
        this.institucionalDinamico.listaSecao1 = response as Array<any>;
        this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.institucionalDinamico.listaSecao1];
        this.dataSourceSecao = this.todasSecoesResumidas;
        this.ordernarPorIndiceTodasSecoesResumidas();
      }

    });
  }

  public buscarPrimeiraSecaoDetalhe(id: number){
    this.loading = true;
    this.institucionalDinamicoService.buscarInstitucionalDinamicoSecao01Detalhe(id).subscribe(primeiraSecao => {
      this.primeiraSecaoSelecionada = primeiraSecao;
      this.loading = false;
      this.segundaSecaoSelecionada = null;
      this.terceiraSecaoSelecionada = null;
      this.quartaSecaoSelecionada = null;
    });
  }

  public excluirPrimeiraSecao(id: number) {
    this.primeiraSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.institucionalDinamicoService.excluirInstitucionalDinamicoSecao01(id).subscribe(primeiraSecao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');

          this.todasSecoesResumidas =  this.todasSecoesResumidas.filter(item => item.id !== id && item.tipo !== "primeiraSecao");
          this.dataSourceSecao = this.todasSecoesResumidas;

        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarPrimeiraSecao(): void {
    this.loading = true;
    this.institucionalDinamicoService.editarInstitucionalDinamicoSecao01(this.institucionalDinamico.id , this.primeiraSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção A',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.primeiraSecaoSelecionada = null;
    });
  }

  public cadastrarNovaPrimeiraSecao() {
    this.primeiraSecaoSelecionada = new InstitucionalDinamicoSecao1();
    this.segundaSecaoSelecionada = null;
    this.terceiraSecaoSelecionada = null;
    this.quartaSecaoSelecionada = null;
  }

  public fecharPrimeiraSecao() {
    this.primeiraSecaoSelecionada = null;
  }



  //SEÇÃO 02
  private async buscarListaInstitucionalDinamicoSecao02ResumidaPorId(id: number) {
    await this.institucionalDinamicoService.buscarListaInstitucionalDinamicoSecao02ResumidaPorId(id).subscribe(response => {

      if(response){
        this.institucionalDinamico.listaSecao2 = response as Array<any>;
        this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.institucionalDinamico.listaSecao2];
        this.dataSourceSecao = this.todasSecoesResumidas;
        this.ordernarPorIndiceTodasSecoesResumidas();
      }

    });
  }

  public buscarSegundaSecaoDetalhe(id: number){
    this.loading = true;
    this.institucionalDinamicoService.buscarInstitucionalDinamicoSecao02Detalhe(id).subscribe(segundaSecao => {
      this.segundaSecaoSelecionada = segundaSecao;
      this.loading = false;
      this.primeiraSecaoSelecionada = null;
      this.terceiraSecaoSelecionada = null;
      this.quartaSecaoSelecionada = null;
    });
  }

  public excluirSegundaSecao(id: number) {
    this.segundaSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.institucionalDinamicoService.excluirInstitucionalDinamicoSecao02(id).subscribe(secao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');

          this.todasSecoesResumidas =  this.todasSecoesResumidas.filter(item => item.id !== id && item.tipo !== "segundaSecao");
          this.dataSourceSecao = this.todasSecoesResumidas;

        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarSegundaSecao(): void {
    this.loading = true;
    this.institucionalDinamicoService.editarInstitucionalDinamicoSecao02(this.institucionalDinamico.id , this.segundaSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção B',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.segundaSecaoSelecionada = null;
    });
  }

  public cadastrarNovaSegundaSecao() {
    this.segundaSecaoSelecionada = new InstitucionalDinamicoSecao2();
    this.primeiraSecaoSelecionada = null;
    this.terceiraSecaoSelecionada = null;
    this.quartaSecaoSelecionada = null;
  }

  public fecharSegundaSecao() {
    this.segundaSecaoSelecionada = null;
  }


  //SEÇÃO 03
  private async buscarListaInstitucionalDinamicoSecao03ResumidaPorId(id: number) {
    await this.institucionalDinamicoService.buscarListaInstitucionalDinamicoSecao03ResumidaPorId(id).subscribe(response => {

      if(response){
        this.institucionalDinamico.listaSecao3 = response as Array<any>;
        this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.institucionalDinamico.listaSecao3];
        this.dataSourceSecao = this.todasSecoesResumidas;
        this.ordernarPorIndiceTodasSecoesResumidas();
      }

    });
  }

  public buscarTerceiraSecaoDetalhe(id: number){
    this.loading = true;
    this.institucionalDinamicoService.buscarInstitucionalDinamicoSecao03Detalhe(id).subscribe(terceiraSecao => {
      this.terceiraSecaoSelecionada = terceiraSecao;
      this.loading = false;
      this.primeiraSecaoSelecionada = null;
      this.segundaSecaoSelecionada = null;
      this.quartaSecaoSelecionada = null;
    });
  }

  public excluirTerceiraSecao(id: number) {
    this.terceiraSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.institucionalDinamicoService.excluirInstitucionalDinamicoSecao03(id).subscribe(secao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');

          this.todasSecoesResumidas =  this.todasSecoesResumidas.filter(item => item.id !== id && item.tipo !== "terceiraSecao");
          this.dataSourceSecao = this.todasSecoesResumidas;

        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarTerceiraSecao(): void {
    this.loading = true;
    this.institucionalDinamicoService.editarInstitucionalDinamicoSecao03(this.institucionalDinamico.id , this.terceiraSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção C',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.terceiraSecaoSelecionada = null;
    });
  }

  public cadastrarNovaTerceiraSecao() {
    this.terceiraSecaoSelecionada = new InstitucionalDinamicoSecao3();
    this.primeiraSecaoSelecionada = null;
    this.segundaSecaoSelecionada = null;
    this.quartaSecaoSelecionada = null;
  }

  public fecharTerceiraSecao() {
    this.terceiraSecaoSelecionada = null;
  }




  //SEÇÃO 03 PUBLICAÇÃO
  public inserirPublicacao(publicacao: any): void {
    this.loading = true;
    this.institucionalDinamicoService.inserirPublicacaoDinamica(publicacao).subscribe(response => {
      PcsUtil.swal().fire({
        title: 'Publicação',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
    });
  }


  public alterarPublicacao(publicacao: any): void {
    this.loading = true;
    this.institucionalDinamicoService.alterarPublicacaoDinamica(publicacao).subscribe(response => {
      PcsUtil.swal().fire({
        title: 'Publicação',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
    });
  }


  onAtualizar(publicacao, numeroPublicacao, numeroSecao) {
    if (publicacao) {
      if (!publicacao.ordemExibicao) {
        this.terceiraSecaoSelecionada.publicacoes.forEach(pub => {
          if (pub.ordemExibicao != undefined) {
            pub.ordemExibicao = pub.ordemExibicao + 1;
          }
        })
         publicacao.ordemExibicao = 0;
      }
    }

    if (numeroSecao === 1) {
      if (this.terceiraSecaoSelecionada.publicacoes[numeroPublicacao] == undefined) {
        this.terceiraSecaoSelecionada.publicacoes.unshift(publicacao)
      }
      else {
        this.terceiraSecaoSelecionada.publicacoes[numeroPublicacao] = publicacao;
      }
      if (publicacao == null) {
        this.terceiraSecaoSelecionada.publicacoes.splice(numeroPublicacao, 1);
      }
    }

    if(publicacao) {
      if(!publicacao.id && !publicacao.editado &&this.terceiraSecaoSelecionada.id){
        publicacao.idInstitucionalDinamicoSecao03 = this.terceiraSecaoSelecionada.id
        this.inserirPublicacao(publicacao);
      } else if(publicacao.id && publicacao.editado && this.terceiraSecaoSelecionada.id){
        this.alterarPublicacao(publicacao);
      }
    }
    
  }

  onMoverDireita(publicacao) {
    publicacao.ordemExibicao = publicacao.ordemExibicao + 1;

    if(publicacao.ordemExibicao >= 0){
      if(publicacao.id){
        this.loading = true;
        this.institucionalDinamicoService.alterarOrdemExibicao(publicacao.id, publicacao.ordemExibicao).subscribe(response => {
          this.loading = false;
        });
      }
    } else {
      publicacao.ordemExibicao = 0;
    }

    this.terceiraSecaoSelecionada.publicacoes.sort((a, b) => a.ordemExibicao - b.ordemExibicao);
  }

  onMoverEsquerda(publicacao) {
    publicacao.ordemExibicao = publicacao.ordemExibicao - 1 ;

    if(publicacao.ordemExibicao >= 0){
      if(publicacao.id){
        this.loading = true;
        this.institucionalDinamicoService.alterarOrdemExibicao(publicacao.id, publicacao.ordemExibicao).subscribe(response => {
          this.loading = false;
        });
      }
    } else {
      publicacao.ordemExibicao = 0;
    }
  
    this.terceiraSecaoSelecionada.publicacoes.sort((a, b) => a.ordemExibicao - b.ordemExibicao);
  }


  //SEÇÃO 04
  private prepararListaShapeFiles() {
    this.shapeFileService.buscarShapesListagemMapa().subscribe((shapes) => {
      this.shapeFiles = shapes;
    });
  }

  private async buscarListaInstitucionalDinamicoSecao04ResumidaPorId(id: number) {
    await this.institucionalDinamicoService.buscarListaInstitucionalDinamicoSecao04ResumidaPorId(id).subscribe(response => {

      if(response){
        this.institucionalDinamico.listaSecao4 = response as Array<any>;
        this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.institucionalDinamico.listaSecao4];
        this.dataSourceSecao = this.todasSecoesResumidas;
        this.ordernarPorIndiceTodasSecoesResumidas();
      }

    });
  }

  public buscarQuartaSecaoDetalhe(id: number){
    this.loading = true;
    this.institucionalDinamicoService.buscarInstitucionalDinamicoSecao04Detalhe(id).subscribe(quartaSecao => {
      this.loading = false;
      this.quartaSecaoSelecionada = quartaSecao;
      this.primeiraSecaoSelecionada = null;
      this.segundaSecaoSelecionada = null;
      this.terceiraSecaoSelecionada = null;
    });
  }

  public excluirQuartaSecao(id: number) {
    this.quartaSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.institucionalDinamicoService.excluirInstitucionalDinamicoSecao04(id).subscribe(secao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');

          this.todasSecoesResumidas =  this.todasSecoesResumidas.filter(item => item.id !== id && item.tipo !== "quartaSecao");
          this.dataSourceSecao = this.todasSecoesResumidas;
        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarQuartaSecao(): void {
    this.loading = true;
    this.institucionalDinamicoService.editarInstitucionalDinamicoSecao04(this.institucionalDinamico.id , this.quartaSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção D',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.quartaSecaoSelecionada = null;
    });
  }

  public cadastrarNovaQuartaSecao() {
    this.quartaSecaoSelecionada = new InstitucionalDinamicoSecao4();
    this.primeiraSecaoSelecionada = null;
    this.segundaSecaoSelecionada = null;
    this.terceiraSecaoSelecionada = null;
  }

  public fecharQuartaSecao() {
    this.quartaSecaoSelecionada = null;
  }

  habilitarConfigSummernoteRecursosExternos(event, secao: number, col1, col2){
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Ao alterar a opção de recursos externos no editor de texto, você perderá todo o conteúdo já escrito!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if(result.value) {
        this.configurarExibicaoEditor(event, secao, col1, col2);
      } else {
        this.desablitarExibicaoEditor(event, secao, col1, col2);
      }
  }, error => { this.loading = false; });
  }

  public configurarExibicaoEditor(event: any, secao: number, col1: any, col2: any) {
    switch(secao) {
      case 1:
        if(event) {
          this.primeiraSecaoSelecionada.texto = '';
          this.exibirConfigRecursosExternosSecao01 = true;
        } else {
          this.exibirConfigRecursosExternosSecao01 = false;
        }
        break;
      case 2:
        if(event) {
          if(col1) {
            this.segundaSecaoSelecionada.textoPrimeiraColuna = '';
            this.exibirConfigRecursosExternosSecao02PrimeiraCol = true;
          }
          if(col2){
            this.segundaSecaoSelecionada.textoSegundaColuna = '';
            this.exibirConfigRecursosExternosSecao02SegundaCol = true;
          }
        } else {
          if(col1) {
            this.exibirConfigRecursosExternosSecao02PrimeiraCol = false;
          }
          if(col2){
            this.exibirConfigRecursosExternosSecao02SegundaCol = false;
          }
        }
        break;
      case 4:
        if(event) {
          this.quartaSecaoSelecionada.texto = '';
          this.exibirConfigRecursosExternosSecao04 = true;
        } else {
          this.exibirConfigRecursosExternosSecao04 = false;
        }
        
        break;
    }
  }

  public desablitarExibicaoEditor(event: any, secao: number, col1: any, col2: any) {
    switch(secao) {
      case 1:
          event ? 
          this.primeiraSecaoSelecionada.habilitaRecursoExterno = false : 
          this.primeiraSecaoSelecionada.habilitaRecursoExterno = true;
        break;
      case 2:
        if(col1) {
          event ? 
          this.segundaSecaoSelecionada.habilitaRecursoExternoCol01 = false : 
          this.segundaSecaoSelecionada.habilitaRecursoExternoCol01 = true;
        }
        if(col2){
          event ? 
          this.segundaSecaoSelecionada.habilitaRecursoExternoCol02 = false : 
          this.segundaSecaoSelecionada.habilitaRecursoExternoCol02 = true;
        }
        break;
      case 4:
        event ? 
          this.quartaSecaoSelecionada.habilitaRecursoExterno = false : 
          this.quartaSecaoSelecionada.habilitaRecursoExterno = true;
        break;
    }
  }
}


