import { faq } from 'src/app/model/faq';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FaqService } from 'src/app/services/faq.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-faq-form',
  templateUrl: './faq-form.component.html',
  styleUrls: ['./faq-form.component.css']
})
export class FaqFormComponent implements OnInit {

  public formFaq: FormGroup;
  public faq = new faq();
  public id;

  public imagensCorpoFaq: any[] = [];

  public editorConfig: any = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['', []],
      ['', ['', '', '']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { 
      onPaste: function (e) { 
        var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); 
        e.preventDefault(); document.execCommand('insertText', false, bufferText); 
      },
      onImageUpload: file => {
        this.faqService
          .salvarImagemCorpoFaq(file[0])
          .subscribe(response => {
            let path: string = `${environment.API_URL}${response.path}`;
            this.imagensCorpoFaq.push({
              id: response.id,
              path: path,
              file: file[0]
            });
            document.execCommand('insertImage', false, path);
          });
      },
      onMediaDelete: e => {
        let imagensEncontradas = this.imagensCorpoFaq.filter(
          i => i.path === e[0].src
        );

        if (imagensEncontradas.length > 0) {
          let imagem = imagensEncontradas[0];

          this.faqService
            .apagarImagemCorpoFaq(imagem.id)
            .subscribe(response => {});
        }
      }
    
    }
  };

  constructor(
    private router: Router,
    private titleService: Title,
    private faqService: FaqService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
      this.formFaq =  this.formBuilder.group({
        pergunta: [null, Validators.required],
        resposta: [null, Validators.required]
      })
      this.titleService.setTitle("Formulário do FAQ - Cidades Sustentáveis")
   }

  ngOnInit() {
    this.buscarPergunta();
  }

  public buscarPergunta() {
    this.activatedRoute.params.subscribe(async params => {
       this.id = params.id;
      if (this.id) {
        await this.faqService.buscarFaqPorId(this.id).subscribe(async response => {
          this.faq = response as faq;
          this.carregarAtributos();
        }, error => { this.router.navigate(['/participacao-cidada']); });
      }
    }, error => {
      this.router.navigate(['/participacao-cidada']);
    });
  }

  public carregarAtributos() {
    this.formFaq.controls.pergunta.setValue(this.faq.pergunta);
    this.formFaq.controls.resposta.setValue(this.faq.resposta);
  }

  public salvar() {
    this.faq.pergunta = this.formFaq.controls.pergunta.value;
    this.faq.resposta = this.formFaq.controls.resposta.value;
    if(this.faq.id != null && this.faq.id != undefined) {
      this.editar()
    }
    else{
      this.cadastrar();
    }
  }

  public editar() {
    this.faqService.editarFaq(this.faq).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'FAQ',
        text: `Pergunta editada`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/participacao-cidada/faq-administracao']);
      }, error => { });
    });
  }

  public cadastrar() {
    this.faqService.cadastrarFaq(this.faq).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Faq',
        text: `Faq Cadastrado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/participacao-cidada/faq-administracao']);
      }, error => { });
    });
  }
}
