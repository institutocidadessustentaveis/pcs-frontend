import { Component, OnInit, ViewChild, ElementRef, HostListener, TemplateRef } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Noticia } from 'src/app/model/noticia';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NoticiaService } from 'src/app/services/noticia.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { EixoService } from 'src/app/services/eixo.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { Eixo } from 'src/app/model/eixo';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Arquivo } from 'src/app/model/arquivo';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';
import { PreVisualizacaoNoticiaComponent } from '../pre-visualizacao-noticia/pre-visualizacao-noticia.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';

declare var $;

@Component({
  selector: 'app-noticia-form',
  templateUrl: './noticia-form.component.html',
  styleUrls: ['./noticia-form.component.css']
})
export class NoticiaFormComponent implements OnInit {

  @HostListener("window:scroll", ["$event"])
  @ViewChild('modalLoading') modalLoading: TemplateRef<any>;

  public imageChangedEvent: any = '';

  public exibirPreVisualizacao = false;
  eixos: Array<Eixo>;
  odss: Array<ObjetivoDesenvolvimentoSustentavel>;
  areasInteresse: Array<AreaInteresse>;
  form: FormGroup;
  form2: FormGroup;
  noticia: Noticia = new Noticia();
  linksRelacionados = [];
  tagPalavrasChave: string[] = [];
  arquivo = new Arquivo();
  loading: any;
  displayedColumns: string[] = ['Usuário', 'Data/Hora Alteração'];
  dataSource = new MatTableDataSource();
  desabilitarBotaoSalvar: boolean = false;
  imagemEditada: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('preVisualizacaoNoticia') preVisualizacaoNoticia: PreVisualizacaoNoticiaComponent;

  imagensCorpoNoticia: any[] = [];

  exibirConfigStyleonPaste = false;

  public editorConfig1: any = {
    height: '300px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontname', ['fontname']],
      ['fontsize', ['fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
      ['view', ['fullscreen', 'codeview']],
      ['customButtons', ['Blockquote', 'H1', 'H2', 'H3', 'S']]
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
      'Source Sans Pro',
      'Open Sans',
      'Noto Sans',
      'AT Surt'
    ],
    buttons: {
      'Blockquote': this.insertBlockquoteButton(),
      'H1': this.intertituloH1Button(),
      'H2': this.intertituloH2Button(),
      'H3': this.intertituloH3Button()
    },
    callbacks: {
      onPaste: function (e) { 
        var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text');
         e.preventDefault();
          document.execCommand('insertText', false, bufferText); 
      },
      onImageUpload: file => {
        this.noticiaService
          .salvarImagemCorpoNoticia(file[0])
          .subscribe(response => {
            let path: string = `${environment.API_URL}${response.path}`;
            this.imagensCorpoNoticia.push({
              id: response.id,
              path: path,
              file: file[0]
            });
            document.execCommand('insertImage', false, path);
          });
      },
      onMediaDelete: e => {
        let imagensEncontradas = this.imagensCorpoNoticia.filter(
          i => i.path === e[0].src
        );

        if (imagensEncontradas.length > 0) {
          let imagem = imagensEncontradas[0];

          this.noticiaService
            .apagarImagemCorpoNoticia(imagem.id)
            .subscribe(response => {});
        }
      }
    }
  };

  public editorConfig2: any = {
    height: '300px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontname', ['fontname']],
      ['fontsize', ['fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
      ['view', ['fullscreen', 'codeview']],
      ['customButtons', ['Blockquote', 'H1', 'H2', 'H3', 'S']]
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
      'Source Sans Pro',
      'Open Sans',
      'Noto Sans',
      'AT Surt'
    ],
    buttons: {
      'Blockquote': this.insertBlockquoteButton(),
      'H1': this.intertituloH1Button(),
      'H2': this.intertituloH2Button(),
      'H3': this.intertituloH3Button()
    },
    callbacks: {
      onImageUpload: file => {
        this.noticiaService
          .salvarImagemCorpoNoticia(file[0])
          .subscribe(response => {
            let path: string = `${environment.API_URL}${response.path}`;
            this.imagensCorpoNoticia.push({
              id: response.id,
              path: path,
              file: file[0]
            });
            document.execCommand('insertImage', false, path);
          });
      },
      onMediaDelete: e => {
        let imagensEncontradas = this.imagensCorpoNoticia.filter(
          i => i.path === e[0].src
        );

        if (imagensEncontradas.length > 0) {
          let imagem = imagensEncontradas[0];

          this.noticiaService
            .apagarImagemCorpoNoticia(imagem.id)
            .subscribe(response => {});
        }
      }
    }
  };


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

  scrollUp: any;

  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private noticiaService: NoticiaService,
    private eixoService: EixoService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private areaInteresseService: AreaInteresseService,
    public activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private router: Router,
    private element: ElementRef,
    public dialog: MatDialog
  ) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    this.form = this.formBuilder.group({
      id: [''],
      titulo: ['', Validators.required],
      subtitulo: [''],
      autor: ['', Validators.required],
      usuario: [''],
      corpoTexto: ['', Validators.required],
      imagemPrincipal: ['', Validators.required],
      possuiFiltro: [''],
      palavraChave: [''],
      exibirEventoTelaInicial: [''],
      eixos: [[]],
      areasDeInteresse: [[]],
      odss: [[]],
      linksRelacionados: [[]],
      publicada:[''],
      noticiaEvento: [''],
      habilitaEstilo: [''],
    });
  }
  

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      const index = this.linksRelacionados.indexOf(value);
      if (index < 0) {
        this.linksRelacionados.push(value.toLowerCase().trim());
        this.form.controls.linksRelacionados.setValue(this.linksRelacionados);
      }
    }
    if (input) {
      input.value = '';
    }
  }

  remove(link): void {
    const index = this.linksRelacionados.indexOf(link);

    if (index >= 0) {
      this.linksRelacionados.splice(index, 1);
    }
  }

  ngOnInit() {
    this.carregarEixos();
  }

  buscarNoticia() {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
          this.noticiaService.buscarId(id).subscribe(response => {
          this.noticia = response as Noticia;
          this.form.controls.publicada.setValue(this.noticia.publicada);
          this.form.controls.noticiaEvento.setValue(this.noticia.noticiaEvento);
          this.form.controls.id.setValue(this.noticia.id);
          this.form.controls.titulo.setValue(this.noticia.titulo);
          this.form.controls.subtitulo.setValue(this.noticia.subtitulo);
          this.form.controls.autor.setValue(this.noticia.autor);
          this.form.controls.usuario.setValue(this.noticia.usuario);
          this.form.controls.corpoTexto.setValue(this.noticia.corpoTexto);
          this.form.controls.palavraChave.setValue(this.noticia.palavraChave);
          this.tagPalavrasChave = this.noticia.palavraChave.length > 0 ? this.noticia.palavraChave.split(',') :  Array();
          this.form.controls.exibirEventoTelaInicial.setValue(this.noticia.exibirEventoTelaInicial);
          this.form.controls.imagemPrincipal.setValue(
            this.noticia.imagemPrincipal
          );
          this.form.controls.eixos.setValue(this.buscarEixosSelecionados());
          this.selecionarEixo(this.form.controls.eixos.value);
          this.form.controls.odss.setValue(this.buscarODSSelecionados());
          this.form.controls.areasDeInteresse.setValue(
            this.buscarAreasInteresseSelecionados()
          );
          this.form.controls.linksRelacionados.setValue(
            this.noticia.linksRelacionados
          );
          this.form.controls.habilitaEstilo.setValue(this.noticia.habilitaEstilo);
          this.linksRelacionados = this.noticia.linksRelacionados;
          this.dataSource = new MatTableDataSource(this.noticia.noticiaHistorico);
          this.dataSource.sort = this.sort;
        });
      } else {
        this.form.controls.usuario.setValue(this.authService.credencial.nome);
        this.noticia.usuario = this.authService.credencial.nome;
        this.noticia.dataHoraCriacao = new Date();
      }
    });
  }

  geraImagem(imagem) {
    if (this.noticia.imagemPrincipal) {
      return this.domSanitizer.bypassSecurityTrustUrl(
        'data:image/png;base64, ' + this.noticia.imagemPrincipal
      );
    }
  }
  _handleReaderLoadedIcone(readerEvt) {
    this.noticia.imagemPrincipal = btoa(readerEvt.target.result);
  }

  processFile(eventInput: any, nomeInput: string) {
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
        this.form.controls.imagemPrincipal.setValue(file);
        const reader = new FileReader();
        if (nomeInput === 'icone') {
          reader.onload = this._handleReaderLoadedIcone.bind(this);
        }
        reader.readAsBinaryString(file);
      } else {
        PcsUtil.swal()
          .fire({
            title: 'Cadastro de Notícias',
            text: `Arquivo excede o tamanho limite de 10 MB`,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok'
          })
          .then(result => {}, error => {});
      }
    };
    this.loading = false;
  }

  salvar() {
    this.desabilitarBotaoSalvar = true;

    let dialogRef = this.dialog.open(this.modalLoading, {
      height: '300px',
      width: '300px',
    });

    if (this.form.invalid) {
      this.dialog.closeAll();
      this.desabilitarBotaoSalvar = false;
      return;
    }
    const noticia: Noticia = this.form.value as Noticia;
    noticia.palavraChave = this.tagPalavrasChave.join(',');
    noticia.imagemPrincipal = this.noticia.imagemPrincipal;
    noticia.dataHoraCriacao = this.noticia.dataHoraCriacao;
    noticia.dataHoraPublicacao = this.noticia.dataHoraPublicacao;
    noticia.imagemEditada = this.imagemEditada;

    if(this.form.controls.exibirEventoTelaInicial.value === "" ||
        this.form.controls.exibirEventoTelaInicial.value === false) {
      noticia.exibirEventoTelaInicial = false;
    } else {
      noticia.exibirEventoTelaInicial = true;
    }

    if (this.form.value.id) {
      this.noticiaService.editar(noticia).subscribe(res => {
        this.dialog.closeAll();
        this.desabilitarBotaoSalvar = false;
        this.confirmarCadastro();
      }, erro => {
        this.dialog.closeAll();
        this.desabilitarBotaoSalvar = false;
      });
    } else {
      this.noticiaService.inserir(noticia).subscribe(res => {
        this.dialog.closeAll();
        this.desabilitarBotaoSalvar = false;
        this.confirmarCadastro();
      }, erro => {
        this.dialog.closeAll();
        this.desabilitarBotaoSalvar = false;
      });
    }
  }

  confirmarCadastro() {
    PcsUtil.swal()
      .fire({
        title: 'Notícia Salva',
        text: '',
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok'
      })
      .then(
        result => {
          this.router.navigate(['/cadastro-noticia']);
        },
        error => {}
      );
  }
  carregarAreaInteresse() {
    this.areaInteresseService.buscaAreasInteresses().subscribe(res => {
      this.areasInteresse = res as Array<AreaInteresse>;
      this.buscarNoticia();
    });
  }

  carregarEixos() {
    this.eixoService.buscarEixosParaCombo(false).subscribe(res => {
      this.eixos = res as Array<Eixo>;
      this.carregarAreaInteresse();
    });
  }

  public selecionarEixo(event: any) {
    this.odss = [];
    for (const eixo of event) {
      for (const ods of eixo.listaODS) {
        const existe = this.odss.filter(function(el) {
          return el.id === ods.id;
        });
        if (existe.length === 0) {
          this.odss.push(ods);
        }
      }
    }
  }

  buscarEixosSelecionados() {
    const list = [];
    for (const e1 of this.noticia.eixos) {
      for (const e2 of this.eixos) {
        if (e1.id === e2.id) {
          list.push(e2);
          break;
        }
      }
    }
    return list;
  }

  buscarODSSelecionados() {
    const list = [];
    for (const e1 of this.noticia.odss) {
      for (const e2 of this.odss) {
        if (e1.id === e2.id) {
          list.push(e2);
          break;
        }
      }
    }
    return list;
  }

  buscarAreasInteresseSelecionados() {
    const list = [];
    for (const e1 of this.noticia.areasDeInteresse) {
      for (const e2 of this.areasInteresse) {
        if (e1.id === e2.id) {
          list.push(e2);
          break;
        }
      }
    }
    return list;
  }

  public addTagPalavrasChave(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if (this.tagPalavrasChave.length >= 2000) {
      PcsUtil.swal().fire({
        title: 'Proibido',
        text: 'Limite máximo de 20 palavras-chave',
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
    } else {
      if ((value || '').trim()) {
        const index = this.tagPalavrasChave.indexOf(value);
        if (index < 0) {
          this.tagPalavrasChave.push(value.toLowerCase().trim());
          this.form.controls.palavraChave.setValue(this.tagPalavrasChave);
        }
      }
    }
    if (input) {
      input.value = '';
    }
  }

  public removerTagPalavrasChave(value: string): void {
    const index = this.tagPalavrasChave.indexOf(value);

    if (index >= 0) {
      this.tagPalavrasChave.splice(index, 1);
    }
  }

  public prepararPreVisualizacao() {
    this.preVisualizacaoNoticia.geraImagem();
    const noticia: Noticia = this.form.value as Noticia;
    noticia.palavraChave = this.tagPalavrasChave.join(',');
    noticia.imagemPrincipal = this.noticia.imagemPrincipal;
    noticia.dataHoraCriacao = this.noticia.dataHoraCriacao;
    noticia.dataHoraPublicacao = this.noticia.dataHoraPublicacao;
    this.noticia = noticia;

    this.exibirPreVisualizacao = !this.exibirPreVisualizacao;
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

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.imagemEditada = true;
    this.noticia.imagemPrincipal = event.base64.split('base64,')[1];
    this.form.controls.imagemPrincipal.setValue(this.noticia.imagemPrincipal);
  }

  setStyleOnPasteSummernote(event){
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Ao alterar a opção de estilos no editor de texto, você perderá todo o conteúdo já escrito!`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      this.loading = true;
      if(result.value) {
        this.form.controls.corpoTexto.setValue('');
        if (event) {
          this.exibirConfigStyleonPaste = true;
        } else {
          this.exibirConfigStyleonPaste = false;
        }
      } else {
        this.loading = false;
        event ? this.form.controls.habilitaEstilo.setValue(false) : this.form.controls.habilitaEstilo.setValue(true);
    }
  }, error => { this.loading = false; });
  }

}
