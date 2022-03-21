import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NoticiaService } from 'src/app/services/noticia.service';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BoletimInformativo } from 'src/app/model/boletimInformativo';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material';
import { Arquivo } from 'src/app/model/arquivo';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { NewsletterService } from 'src/app/services/newsletter.service';
import { BoletimTemplate01 } from 'src/app/model/BoletimTemplate01';

@Component({
  selector: 'app-envio-boletim',
  templateUrl: './envio-boletim.component.html',
  styleUrls: ['./envio-boletim.component.css']
})
export class EnvioBoletimComponent implements OnInit {

  formNoticia: FormGroup;
  formInformacao: FormGroup;
  formTemplate01: FormGroup;
  
  arquivo: Arquivo = new Arquivo();
  boletimInformativo: BoletimInformativo = new BoletimInformativo();


  noticias: ItemCombo[] = [];
  desabilitarBotaoSalvar = false;

  protected _onDestroy = new Subject<void>();
  public noticiaFilterCtrl: FormControl = new FormControl();
  @ViewChild('singleSelect', { read: false }) singleSelect: MatSelect;
  public filteredNoticias: ReplaySubject<ItemCombo[]> = new ReplaySubject<ItemCombo[]>(1);
  public imagemPrincipalChangedEvent: any = '';
  public imagemSegundoBannerChangedEvent: any = '';
  public imagemPrimeiroBannerChangedEvent: any = '';

  public mostrarEnviarTeste: boolean = false;
  public mostrarCheckBoxEnviarTeste: boolean = false;

  scrollUp: any;
  titulo: string;
  loading = false;
  exibirMensagemAlerta = false;

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

  constructor(
    private router: Router, 
    private element: ElementRef,
    private formBuilder: FormBuilder,
    private noticiaService: NoticiaService, 
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    public domSanitizationService: DomSanitizer,
    private newsLetterService: NewsletterService,
    ) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });  

    this.formTemplate01 = this.formBuilder.group({
    id: [''],  
    titulo: [" ", Validators.required],

    textoIntroducao: [" ", Validators.required],
    tituloPrimeiroBanner: [" ", Validators.required],
    textoPrimeiroBanner: [" ", Validators.required],
    textoBotao01: [" ", Validators.required],
    imagemPrimeiroBanner: [" ", Validators.required],
    
    tituloChamada01: [" ", Validators.required],
    subtituloChamada01: [" ", Validators.required],
    textoChamada01: [" ", Validators.required],
    tituloChamada02: [" ", Validators.required],
    subtituloChamada02: [" ", Validators.required],
    textoChamada02: [" ", Validators.required],
    
    imagemPrincipal: [" ", Validators.required],
    tituloImagemPrincipal: [" ", Validators.required],
    legendaImagemPrincipal: [" ", Validators.required],
    
    tituloChamada03: [" ", Validators.required],
    subtituloChamada03: [" ", Validators.required],
    textoChamada03: [" ", Validators.required],
    tituloChamada04: [" ", Validators.required],
    subtituloChamada04: [" ", Validators.required],
    textoChamada04: [" ", Validators.required],
    
    imagemSegundoBanner: [" ", Validators.required],
    tituloSegundoBanner: [" ", Validators.required],
    textoSegundoBanner: [" ", Validators.required],
    textoBotao02: [" ", Validators.required],
    
    textoFinal: ['', Validators.required],

    emailTeste:['']
    })
  }

  ngOnInit() {
    this.buscarBoletimTempate01PorId()
  }  

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

  public EmailTesteIsValido() {
    if (this.validateEmail(this.formTemplate01.controls.emailTeste.value)) return true
    return false
  }

  public enviarEmailTeste() {
    if (this.formTemplate01.valid) {
      this.preencherTemplate01()
      this.noticiaService.enviarTesteBoletimTemplate01(this.boletimInformativo.boletimTemplate01, this.formTemplate01.controls.emailTeste.value).subscribe(res => {
        swal.fire('Teste enviado', '', 'success')
      })
    }
    else {
      swal.fire('Preencha os campos obrigatórios', '', 'error')
    }
  }

  buscarBoletimTempate01PorId() {
    this.activatedRoute.params.subscribe( params => {
      let id = params.idBoletim;
      if (id) {
        this.mostrarCheckBoxEnviarTeste = true
        this.newsLetterService.buscarBoletimTempate01PorId(id).subscribe( boletim => {                   
         this.boletimInformativo.boletimTemplate01 = boletim as BoletimTemplate01
          this.carregarAtributos();
          this.loading = false;
          this.titleService.setTitle(`Boletim Informativo - ${this.boletimInformativo.boletimTemplate01.titulo} - Cidades Sustentáveis`)
        }, error => { this.router.navigate(['/boletim']); });
      }
    }, error => {
      this.router.navigate(['/boletim']);
    });
  }

  carregarAtributos() {    
    this.formTemplate01.controls.id.setValue(this.boletimInformativo.boletimTemplate01.id)
    this.formTemplate01.controls.titulo.setValue(this.boletimInformativo.boletimTemplate01.titulo)
    this.formTemplate01.controls.textoIntroducao.setValue(this.boletimInformativo.boletimTemplate01.textoIntroducao)
    this.formTemplate01.controls.tituloPrimeiroBanner.setValue(this.boletimInformativo.boletimTemplate01.tituloPrimeiroBanner)
    this.formTemplate01.controls.textoPrimeiroBanner.setValue(this.boletimInformativo.boletimTemplate01.textoPrimeiroBanner)
    this.formTemplate01.controls.textoBotao01.setValue(this.boletimInformativo.boletimTemplate01.textoBotao01)
    this.formTemplate01.controls.imagemPrimeiroBanner.setValue(this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner)
    this.formTemplate01.controls.tituloChamada01.setValue(this.boletimInformativo.boletimTemplate01.tituloChamada01)
    this.formTemplate01.controls.subtituloChamada01.setValue(this.boletimInformativo.boletimTemplate01.subtituloChamada01)
    this.formTemplate01.controls.textoChamada01.setValue(this.boletimInformativo.boletimTemplate01.textoChamada01)
    this.formTemplate01.controls.tituloChamada02.setValue(this.boletimInformativo.boletimTemplate01.tituloChamada02)
    this.formTemplate01.controls.subtituloChamada02.setValue(this.boletimInformativo.boletimTemplate01.subtituloChamada02)
    this.formTemplate01.controls.textoChamada02.setValue(this.boletimInformativo.boletimTemplate01.textoChamada02)
    this.formTemplate01.controls.imagemPrincipal.setValue(this.boletimInformativo.boletimTemplate01.imagemPrincipal)
    this.formTemplate01.controls.tituloImagemPrincipal.setValue(this.boletimInformativo.boletimTemplate01.tituloImagemPrincipal)
    this.formTemplate01.controls.legendaImagemPrincipal.setValue(this.boletimInformativo.boletimTemplate01.legendaImagemPrincipal)
    this.formTemplate01.controls.tituloChamada03.setValue(this.boletimInformativo.boletimTemplate01.tituloChamada03)
    this.formTemplate01.controls.subtituloChamada03.setValue(this.boletimInformativo.boletimTemplate01.subtituloChamada03)
    this.formTemplate01.controls.textoChamada03.setValue(this.boletimInformativo.boletimTemplate01.textoChamada03)
    this.formTemplate01.controls.tituloChamada04.setValue(this.boletimInformativo.boletimTemplate01.tituloChamada04)
    this.formTemplate01.controls.subtituloChamada04.setValue(this.boletimInformativo.boletimTemplate01.subtituloChamada04)
    this.formTemplate01.controls.textoChamada04.setValue(this.boletimInformativo.boletimTemplate01.textoChamada04)
    this.formTemplate01.controls.imagemSegundoBanner.setValue(this.boletimInformativo.boletimTemplate01.imagemSegundoBanner)
    this.formTemplate01.controls.tituloSegundoBanner.setValue(this.boletimInformativo.boletimTemplate01.tituloSegundoBanner)
    this.formTemplate01.controls.textoSegundoBanner.setValue(this.boletimInformativo.boletimTemplate01.textoSegundoBanner)
    this.formTemplate01.controls.textoBotao02.setValue(this.boletimInformativo.boletimTemplate01.textoBotao02)
    this.formTemplate01.controls.textoFinal.setValue(this.boletimInformativo.boletimTemplate01.textoFinal)
  }


  public processImage(eventInput: any, banner) {
    this.mostrarCheckBoxEnviarTeste = false;
    //this.loading = true;
    const reader = new FileReader();
    reader.readAsDataURL(eventInput.target.files[0]);
    reader.onload = () => {

      this.arquivo.nomeArquivo = eventInput.target.files[0].name;
      this.arquivo.extensao = reader.result.toString().split(',')[0];
      this.arquivo.conteudo = reader.result.toString().split(',')[1];
      
      if (PcsUtil.tamanhoArquivoEstaDentroDoLimite(reader.result.toString().split(',')[1])) {
        let arquivo = this.arquivo;
        switch (banner) {
          case 'imagemPrimeiroBanner':
            this.imagemPrimeiroBannerChangedEvent = eventInput;
            this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner = new Arquivo()
            this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner.conteudo = arquivo.conteudo
            this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner.extensao = arquivo.extensao
            this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner.nomeArquivo = arquivo.nomeArquivo
            this.formTemplate01.controls.imagemPrimeiroBanner.setValue(this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner);            
            break;
          case 'imagemPrincipal' :
            this.imagemPrincipalChangedEvent = eventInput;
            this.boletimInformativo.boletimTemplate01.imagemPrincipal = new Arquivo()
            this.boletimInformativo.boletimTemplate01.imagemPrincipal.conteudo = arquivo.conteudo
            this.boletimInformativo.boletimTemplate01.imagemPrincipal.extensao = arquivo.extensao
            this.boletimInformativo.boletimTemplate01.imagemPrincipal.nomeArquivo = arquivo.nomeArquivo
            this.formTemplate01.controls.imagemPrincipal.setValue(this.boletimInformativo.boletimTemplate01.imagemPrincipal);
            break;
          case 'imagemSegundoBanner':
            this.imagemSegundoBannerChangedEvent = eventInput;
            this.boletimInformativo.boletimTemplate01.imagemSegundoBanner = new Arquivo()
            this.boletimInformativo.boletimTemplate01.imagemSegundoBanner.conteudo = arquivo.conteudo
            this.boletimInformativo.boletimTemplate01.imagemSegundoBanner.extensao = arquivo.extensao
            this.boletimInformativo.boletimTemplate01.imagemSegundoBanner.nomeArquivo = arquivo.nomeArquivo
            this.formTemplate01.controls.imagemSegundoBanner.setValue(this.boletimInformativo.boletimTemplate01.imagemSegundoBanner);
            break;
            default:
              break;
        }
      }
         else {
        PcsUtil.swal().fire({
          title: 'Cadastro de Boletim',
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

  geraImagem(imagem) {
    if (imagem) {
      return this.domSanitizationService.bypassSecurityTrustUrl(
        'data:image/png;base64, ' + imagem
      );
    }
  }

  imageCropped(event: ImageCroppedEvent, banner) {
    let conteudo = event.base64.split('base64,')[1];    
    switch (banner) {
      case 'imagemPrimeiroBanner':
        this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner.conteudo = conteudo;        
        this.formTemplate01.controls.imagemPrimeiroBanner.setValue(this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner); 
        break;
      case 'imagemPrincipal':
        this.boletimInformativo.boletimTemplate01.imagemPrincipal.conteudo = conteudo;        
        this.formTemplate01.controls.imagemPrincipal.setValue(this.boletimInformativo.boletimTemplate01.imagemPrincipal);
        break; 
        case 'imagemSegundoBanner':
          this.boletimInformativo.boletimTemplate01.imagemSegundoBanner.conteudo = conteudo;        
          this.formTemplate01.controls.imagemSegundoBanner.setValue(this.boletimInformativo.boletimTemplate01.imagemSegundoBanner); 
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }


  public validarBoletim(){       
    if( this.formTemplate01.controls.textoIntroducao.value != null && this.formTemplate01.controls.titulo.value && this.formTemplate01.valid){
      return false;
    }
    else {
      return true;
    }
  }

  preencherTemplate01() {
    this.formTemplate01.controls.id.value !=  " " ? this.boletimInformativo.boletimTemplate01.id = this.formTemplate01.controls.id.value : '';
    this.boletimInformativo.boletimTemplate01.titulo = this.formTemplate01.controls.titulo.value;

    //Parte 1
    this.formTemplate01.controls.textoIntroducao.value != " " ? this.boletimInformativo.boletimTemplate01.textoIntroducao = this.formTemplate01.controls.textoIntroducao.value : '';
    this.formTemplate01.controls.tituloPrimeiroBanner.value != " " ? this.boletimInformativo.boletimTemplate01.tituloPrimeiroBanner = this.formTemplate01.controls.tituloPrimeiroBanner.value : '';
    this.formTemplate01.controls.textoPrimeiroBanner.value != " " ? this.boletimInformativo.boletimTemplate01.textoPrimeiroBanner = this.formTemplate01.controls.textoPrimeiroBanner.value : '';
    this.formTemplate01.controls.textoBotao01.value != " " ? this.boletimInformativo.boletimTemplate01.textoBotao01 = this.formTemplate01.controls.textoBotao01.value : '';
    this.formTemplate01.controls.imagemPrimeiroBanner.value != " " ? this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner = this.formTemplate01.controls.imagemPrimeiroBanner.value : '';
    
    //Parte 2
    this.formTemplate01.controls.tituloChamada01.value != " " ? this.boletimInformativo.boletimTemplate01.tituloChamada01 = this.formTemplate01.controls.tituloChamada01.value : '';
    this.formTemplate01.controls.subtituloChamada01.value != " " ? this.boletimInformativo.boletimTemplate01.subtituloChamada01 = this.formTemplate01.controls.subtituloChamada01.value : '';
    this.formTemplate01.controls.textoChamada01.value != " " ? this.boletimInformativo.boletimTemplate01.textoChamada01 = this.formTemplate01.controls.textoChamada01.value : '';
    this.formTemplate01.controls.tituloChamada02.value != " " ? this.boletimInformativo.boletimTemplate01.tituloChamada02 = this.formTemplate01.controls.tituloChamada02.value : '';
    this.formTemplate01.controls.subtituloChamada02.value != " " ? this.boletimInformativo.boletimTemplate01.subtituloChamada02 = this.formTemplate01.controls.subtituloChamada02.value : '';
    this.formTemplate01.controls.textoChamada02.value !=" "  ? this.boletimInformativo.boletimTemplate01.textoChamada02 = this.formTemplate01.controls.textoChamada02.value : '';
    
    //Parte 3
    this.formTemplate01.controls.imagemPrincipal.value !=" "  ? this.boletimInformativo.boletimTemplate01.imagemPrincipal = this.formTemplate01.controls.imagemPrincipal.value : '';
    this.formTemplate01.controls.tituloImagemPrincipal.value !=" "  ? this.boletimInformativo.boletimTemplate01.tituloImagemPrincipal = this.formTemplate01.controls.tituloImagemPrincipal.value : '';
    this.formTemplate01.controls.legendaImagemPrincipal.value != " " ? this.boletimInformativo.boletimTemplate01.legendaImagemPrincipal = this.formTemplate01.controls.legendaImagemPrincipal.value : '';
   
    //Parte 4
    this.formTemplate01.controls.tituloChamada03.value != " " ? this.boletimInformativo.boletimTemplate01.tituloChamada03 = this.formTemplate01.controls.tituloChamada03.value : '';
    this.formTemplate01.controls.subtituloChamada03.value != " " ? this.boletimInformativo.boletimTemplate01.subtituloChamada03 = this.formTemplate01.controls.subtituloChamada03.value : '';
    this.formTemplate01.controls.textoChamada03.value != " " ? this.boletimInformativo.boletimTemplate01.textoChamada03 = this.formTemplate01.controls.textoChamada03.value : '';
    this.formTemplate01.controls.tituloChamada04.value != " " ? this.boletimInformativo.boletimTemplate01.tituloChamada04 = this.formTemplate01.controls.tituloChamada04.value : '';
    this.formTemplate01.controls.subtituloChamada04.value != " " ? this.boletimInformativo.boletimTemplate01.subtituloChamada04 = this.formTemplate01.controls.subtituloChamada04.value : '';
    this.formTemplate01.controls.textoChamada04.value != " " ? this.boletimInformativo.boletimTemplate01.textoChamada04 = this.formTemplate01.controls.textoChamada04.value : '';
   
    //Parte 5
    this.formTemplate01.controls.imagemSegundoBanner.value != " " ? this.boletimInformativo.boletimTemplate01.imagemSegundoBanner = this.formTemplate01.controls.imagemSegundoBanner.value : '';
    this.formTemplate01.controls.tituloSegundoBanner.value != " " ? this.boletimInformativo.boletimTemplate01.tituloSegundoBanner = this.formTemplate01.controls.tituloSegundoBanner.value : '';
    this.formTemplate01.controls.textoSegundoBanner.value != " " ? this.boletimInformativo.boletimTemplate01.textoSegundoBanner = this.formTemplate01.controls.textoSegundoBanner.value : '';
    this.formTemplate01.controls.textoBotao02.value != " " ? this.boletimInformativo.boletimTemplate01.textoBotao02 = this.formTemplate01.controls.textoBotao02.value : '';
    
    this.formTemplate01.controls.textoFinal.value != " " ? this.boletimInformativo.boletimTemplate01.textoFinal = this.formTemplate01.controls.textoFinal.value : '';
  }

  async editar() {
    this.noticiaService.editarBoletimTemplate01(this.boletimInformativo.boletimTemplate01).subscribe(res => {
      this.buscarBoletimTempate01PorId()
      this.desabilitarBotaoSalvar = false;
      swal.fire('Boletim editado.', '', 'success');
    },error => {
      this.desabilitarBotaoSalvar = false;
      swal.fire('Erro ao enviar boletim.', '', 'error');
    }
    )
  }

  editarEnviar() {
    this.desabilitarBotaoSalvar = false;
    this.editar().then(r => {
      this.enviarBoletimTemplate01().then(r => {
              this.router.navigate(['/boletim'])
      });
    })
  }

  public salvarBoletimTemplate01() {
    this.mostrarCheckBoxEnviarTeste = true;
    this.preencherTemplate01();
    this.desabilitarBotaoSalvar = true;
    if (this.boletimInformativo.boletimTemplate01.id) return this.editar()

    this.noticiaService.salvarBoletimTemplate01(this.boletimInformativo.boletimTemplate01).subscribe(res => {
      this.desabilitarBotaoSalvar = false;
      swal.fire('Boletim salvo.', '', 'success');
      this.boletimInformativo.boletimTemplate01.id = res;
    }, error => {
      this.desabilitarBotaoSalvar = false;
      swal.fire('Erro ao salvar boletim.', '', 'error');
    });
  }

  public salvarEnviarBoletimTemplate01() {
    this.preencherTemplate01(); 
    this.desabilitarBotaoSalvar = true;
    if (this.formTemplate01.controls.id.value) return this.editarEnviar()
    this.noticiaService.salvarEnviarBoletimTemplate01(this.boletimInformativo.boletimTemplate01).subscribe(() => {
      this.desabilitarBotaoSalvar = false;
      swal.fire('Boletim enviado e salvo.', '', 'success');
      this.router.navigate(['/boletim'])
      this.boletimInformativo = new BoletimInformativo();
    }, error => {
      this.desabilitarBotaoSalvar = false;
      swal.fire('Erro ao enviar e salvar boletim.', '', 'error');
    });
  }

  async enviarBoletimTemplate01() {
    this.noticiaService.enviarBoletimTemplate01(this.boletimInformativo.boletimTemplate01).subscribe( r => {
      swal.fire(`Boletim enviado`, '', 'success')
    }, error => {
      swal.fire(`Erro ao enviar Boletim`, '', 'error')
    })
  }

  public truncate(value: string, limit: number, trail: String = '…'): string {
    let result = value || '';
    if (value) {
      const words = value.split(/\s+/);
      if (words.length > Math.abs(limit)) {
        if (limit < 0) {
          limit *= -1;
          result = trail + words.slice(words.length - limit, words.length).join(' ');
        } else {
          result = words.slice(0, limit).join(' ') + trail;
        }
      }
    }
    return result;
  }

  public resetarFormTemplate01() {
    this.formTemplate01.setValue({
      titulo: null,
      textoIntroducao: null,
      tituloPrimeiroBanner: null,
      textoPrimeiroBanner: null,
      textoBotao01: null,
      imagemPrimeiroBanner: null,
      
      tituloChamada01: null,
      subtituloChamada01: null,
      textoChamada01: null,
      tituloChamada02: null,
      subtituloChamada02: null,
      textoChamada02: null,
      
      imagemPrincipal: null,
      tituloImagemPrincipal: null,
      legendaImagemPrincipal: null,
      
      tituloChamada03: null,
      subtituloChamada03: null,
      textoChamada03: null,
      tituloChamada04: null,
      subtituloChamada04: null,
      textoChamada04: null,
      
      imagemSegundoBanner: null,
      tituloSegundoBanner: null,
      textoSegundoBanner: null,
      textoBotao02: null,
      
      textoFinal: null,
   });

    if (this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner != null) {
      this.imagemPrimeiroBannerChangedEvent = null;
      this.boletimInformativo.boletimTemplate01.imagemPrimeiroBanner = undefined
      }
    if (this.boletimInformativo.boletimTemplate01.imagemPrincipal != null) {
      this.imagemPrincipalChangedEvent = null;
      this.boletimInformativo.boletimTemplate01.imagemPrincipal = undefined
    }
    if (this.boletimInformativo.boletimTemplate01.imagemSegundoBanner != null) {
      this.imagemSegundoBannerChangedEvent = null;
      this.boletimInformativo.boletimTemplate01.imagemSegundoBanner = undefined
    }

  }

  trocarValorCheckBox() {
    this.mostrarEnviarTeste = !this.mostrarEnviarTeste;
  }

}
