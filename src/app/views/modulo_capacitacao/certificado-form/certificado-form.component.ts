import { PcsUtil } from 'src/app/services/pcs-util.service';
import { CertificadoService } from './../../../services/certificado.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';
import { Certificado } from './../../../model/certificado';
import { Title, DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Arquivo } from 'src/app/model/arquivo';
import { ImageCroppedEvent } from 'ngx-image-cropper';  

@Component({
  selector: 'app-certificado-form',
  templateUrl: './certificado-form.component.html',
  styleUrls: ['./certificado-form.component.css']
})
export class CertificadoFormComponent implements OnInit {

  public certificado: Certificado = new Certificado();
  public certificadoParaEditar: Certificado = new Certificado();
  public eventos: any = [];
  public editorConfig: any;
  public safeUrl: any;
  public safeUrlBackground: any;
  public loading = false;
  public modoEdicao = false;
  public imageChangedEvent: any = '';

  scrollUp: any;

  constructor(
    public titleService: Title,
    public eventoService: EventoService,
    public domSanitizer: DomSanitizer,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public certificadoService: CertificadoService,
    private element: ElementRef
  ) {
    this.editorConfig = {
      height: '200px',
      toolbar: [
        ['misc', ['undo', 'redo']],
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['style0', 'ul', 'ol', 'paragraph']],
        ['insert', ['table']],
        ['view', ['fullscreen', 'codeview']]
      ],
      fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
      callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
    };

    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Formulário de Certificados - Cidades Sustentáveis');
    this.buscarEventosCapacitacao();
    this.buscarCertificado();
  }

  public buscarEventosCapacitacao() {
    this.eventoService.buscarTodosEventosCapacitacao().subscribe(res => {
      this.eventos = res;
    });
  }

  buscarCertificado() {
    this.activatedRoute.params.subscribe(
      async params => {
        let id = params.id;
        if (id) {
          this.certificado.id = id;
          this.loading = true;
          this.certificadoService.buscarCertificadoPorId(id).subscribe(
            async response => {
              this.certificadoParaEditar = response as Certificado;
              this.modoEdicao = true;
              this.carregarAtributosCertificado();
              this.loading = false;
            },
            error => {
              this.router.navigate(['/capacitacao/certificados']);
            }
          );
        } else {
          this.certificado.orientacaoPaisagem = false;
        }
        this.loading = false;
      },
      error => {
        this.router.navigate(['/capacitacao/certificados']);
      }
    );
  }

  carregarAtributosCertificado() {
    this.certificado = this.certificadoParaEditar;
  }

  salvar() {
    this.loading = true;
    if (this.modoEdicao) {
      this.editarTemplateCertificado();
    } else {
      this.cadastrarTemplateCertificado();
    }
    this.loading = false;
  }

  cadastrarTemplateCertificado() {
    this.certificadoService.cadastrarCertificado(this.certificado).subscribe(res => {
      PcsUtil.swal().fire('Novo layout de certificado cadastrado', '', 'success').then(ok => {
        this.router.navigate(['/capacitacao/certificados']);
      });

    }, error => {
      PcsUtil.swal().fire('Não foi possível cadastrar o layout de certificado', error.error.message, 'error');
    });
  }

  editarTemplateCertificado() {
    this.certificadoService.editarCertificado(this.certificado).subscribe(res => {
      PcsUtil.swal().fire('Layout de certificado editado', '', 'success').then(ok => {
        this.router.navigate(['/capacitacao/certificados']);
      });

    }, error => {
      PcsUtil.swal().fire('Não foi possível editar o layout de certificado', error.error.message, 'error');
    });
  }

  public async processImage(event: any) {
    this.imageChangedEvent = event;
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      const arquivo = new Arquivo();
      arquivo.nomeArquivo = event.target.files[0].name;
      arquivo.extensao = reader.result.toString().split(',')[0];
      arquivo.conteudo = reader.result.toString().split(',')[1];

      this.certificado.imagem = arquivo;
    };
  }

  public excluirImagemCapa() {
    this.certificado.imagem = null;
  }

  mostrarImagem() {
    if (this.certificado.imagem) {
      this.safeUrlBackground = this.domSanitizer.bypassSecurityTrustStyle(
        `url(${'data:image/png;base64,' + this.certificado.imagem.conteudo})`
      );
      this.safeUrl = this.domSanitizer.bypassSecurityTrustUrl(
        'data:image/png;base64, ' + this.certificado.imagem.conteudo
      );
      return this.safeUrl;
    }
  }

  public imageCropped(event: ImageCroppedEvent) {
    this.certificado.imagem.conteudo =  event.base64.split('base64,')[1];
}

}
