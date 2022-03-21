import { environment } from 'src/environments/environment';
import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CidadeService } from 'src/app/services/cidade.service';
import { NoticiaService } from 'src/app/services/noticia.service';
import { PropostaMunicipioService } from 'src/app/services/proposta-municipio.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-proposta-municipio',
  templateUrl: './proposta-municipio.component.html',
  styleUrls: ['./proposta-municipio.component.css']
})
export class PropostaMunicipioComponent implements OnInit {

  carregando = true;
  siglaEstado = '';
  nomeCidade = '';
  cidade = null;
  autenticado = this.authService.isAuthenticated();

  formSolicitacao: FormGroup;
  imagensCorpoNoticia: any[] = [];
  editorConfig = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['fontsize', []],
      ['para', ['style0', 'ul', 'ol']],
      ['insert', this.authService.isAuthenticated() ? ['table', 'picture', 'video', 'link'] : []],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: {
      onPaste(e) {
        let bufferText = (
          (e.originalEvent || e).clipboardData || window['clipboardData']
        ).getData('Text');
        e.preventDefault();
        document.execCommand('insertText', false, bufferText);
      },
      onImageUpload: file => {
        this.noticiaService
          .salvarImagemCorpoNoticia(file[0])
          .subscribe(response => {
            const path = `${environment.API_URL}${response.path}`;
            this.imagensCorpoNoticia.push({
              id: response.id,
              path,
              file: file[0]
            });
            document.execCommand('insertImage', false, path);
          });
      },
      onMediaDelete: e => {
        const imagensEncontradas = this.imagensCorpoNoticia.filter(
          i => i.path === e[0].src
        );

        if (imagensEncontradas.length > 0) {
          const imagem = imagensEncontradas[0];

          this.noticiaService
            .apagarImagemCorpoNoticia(imagem.id)
            .subscribe(response => {});
        }
      }
    }
  };
  scrollUp: any;
  constructor(
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private noticiaService: NoticiaService,
    private propostaService: PropostaMunicipioService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private element: ElementRef,
    private router: Router) {
      this.scrollUp = this.router.events.subscribe(path => {
        element.nativeElement.scrollIntoView();
      });
      this.formSolicitacao = this.formBuilder.group({
        proposta: [null, Validators.required]
      });
    }

  ngOnInit() {
    this.siglaEstado = this.activatedRoute.snapshot.params.sigla;
    this.nomeCidade = this.activatedRoute.snapshot.params.cidade;
    this.carregarDadosMunicipio();
    this.formSolicitacao = this.formBuilder.group({
      proposta: [null, Validators.required]
    });
  }


  carregarDadosMunicipio() {
    this.cidadeService.buscarPorSiglaCidade(this.siglaEstado, this.nomeCidade).subscribe(cidade => {
      this.cidade = cidade;
      this.carregando = false;
    });
  }

  enviarProposta() {
    const textoProposta = this.formSolicitacao.controls.proposta.value;
    if (!textoProposta || textoProposta.trim().length < 20 ) {
      PcsUtil.swal().fire({
        title: 'Não foi possível enviar essa proposta',
        text: `Digite uma proposta com pelo menos 20 caracteres antes de enviar.`,
        type: 'info',
        showCancelButton: false,
        confirmButtonText: 'Ok'});
      return;
    }
    const proposta = {
      cidade : this.cidade.id,
      descricao : textoProposta
    };
    this.propostaService.cadastrar(proposta).subscribe(res => {
      PcsUtil.swal().fire({
        title: 'Proposta enviada!',
        text: `Sua proposta foi enviada para o municipio de ${this.cidade.nome} - ${this.cidade.siglaEstado}.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok'}).then(() => {
          this.router.navigate([`/participacao-cidada/plano-de-metas-cidade/${this.cidade.id}`]);
        });
    },
    error => {
      console.log(error);
      PcsUtil.swal().fire({
        title: 'A proposta não foi enviada!',
        text: error.error ? error.error : error.message,
        type: 'error',
        showCancelButton: false,
        confirmButtonText: 'Ok'});
    });

  }
}
