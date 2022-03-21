
import { SugestaoBoasPraticas } from 'src/app/model/sugestaoBoasPraticas';
import { Router, ActivatedRoute } from '@angular/router';
import { SugestaoBoasPraticasService } from './../../../services/sugestaoBoasPraticas.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { ReCaptcha2Component } from 'ngx-captcha';
import { CidadeService } from 'src/app/services/cidade.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { PaisService } from 'src/app/services/pais.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sugestao-boas-praticas',
  templateUrl: './sugestao-boas-praticas.component.html',
  styleUrls: ['./sugestao-boas-praticas.component.css']
})
export class SugestaoBoasPraticasComponent implements OnInit {
  scrollUp: any;
  loading = false;
  usuario: Usuario;
  formulario: FormGroup;
  public cidadesComboFiltrada: Array<ItemCombo> = [];
  filteredOptions: Observable<ItemCombo[]>;
  options: ItemCombo[] = [];
  idCidadeSelecionado = null;
  nomeCidadeSelecionada = null;
  imagensCorpoSugestaoBoaPratica: any[] = [];
  public paisesCombo: ItemCombo[];
  public provinciaEstadosCombo: ItemCombo[];
  public cidadesCombo: ItemCombo[];
  
  siteKey = '6LdtHrIUAAAAAHbWoQPwJCusVNVAer7Vo22rYT-u';
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  sugestaoBoasPraticas: SugestaoBoasPraticas = new SugestaoBoasPraticas();

  public editorConfig: any = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['', []],
      ['', ['', '', '']],
      ['insert', ['table', 'picture', 'link']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { 
      onPaste: function (e) {
         var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); 
        },
        onImageUpload: file => {
          this.sugestaoBoasPraticasService
            .salvarImagemCorpoSugestaoBoaPratica(file[0])
            .subscribe(response => {
              let path: string = `${environment.API_URL}${response.path}`;
              this.imagensCorpoSugestaoBoaPratica.push({
                id: response.id,
                path: path,
                file: file[0]
              });
              document.execCommand('insertImage', false, path);
            });
        }, 
        onMediaDelete: e => {
          let imagensEncontradas = this.imagensCorpoSugestaoBoaPratica.filter(
            i => i.path === e[0].src
          );
  
          if (imagensEncontradas.length > 0) {
            let imagem = imagensEncontradas[0];
  
            this.sugestaoBoasPraticasService
              .apagarImagemCorpoSugestaoBoaPratica(imagem.id)
              .subscribe(response => {});
          }
        }
      }
  };

  constructor(
    private router: Router,
    private element: ElementRef,
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private usuarioService: UsuarioService,
    private activatedRoute: ActivatedRoute,
    private prefeituraService: PrefeituraService,
    private sugestaoBoasPraticasService: SugestaoBoasPraticasService,
    private paisService: PaisService,
    private provinciaEstadoService: ProvinciaEstadoService,
    private location: Location
              ) {
    this.scrollUp = this.router.events.subscribe((path) => {
    element.nativeElement.scrollIntoView();
    });
    this.formulario = this.formBuilder.group({
      solicitacao: ['', Validators.required],
      idPais: ['', Validators.required],
      idProvinciaEstado: ['', Validators.required],
      idCidade: ['', Validators.required],
      recaptcha: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.buscarUsuarioLogado();
    this.buscarPaises();
   }

  buscarUsuarioLogado() {
    this.usuarioService.buscarUsuarioLogado()
    .subscribe(res => {
      this.usuario = res;
    })
  }

  salvar() {
    if(this.formulario.valid) {
      this.loading = true;
      this.sugestaoBoasPraticas.nomeUsuario = this.usuario.nome;
      this.sugestaoBoasPraticas.idCidade = this.formulario.controls.idCidade.value;
      this.sugestaoBoasPraticas.solicitacao = this.formulario.controls.solicitacao.value;
      this.sugestaoBoasPraticas.tokenRecaptcha = this.formulario.controls.recaptcha.value;

      this.sugestaoBoasPraticasService.inserirSugestaoBoasPraticas(this.sugestaoBoasPraticas).subscribe(response => {
          PcsUtil.swal().fire({
            title: 'Solicitação de Boa Práticas',
            text: `Dados enviados`,
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
            this.loading = false;
            this.router.navigate(['/']);
          }, error => { });
        });
    }
  }

  handleSuccess(evento) {
    this.formulario.controls.recaptcha.setValue(evento);
  };

public buscarPaises(){
  this.paisService.buscarPaisesCombo().subscribe(res => {
    this.paisesCombo = res;
  })
}

public onPaisChange(event: any){    
  if(event.value){
  this.provinciaEstadoService.buscarProvinciaEstadoComboPorPais(event.value).subscribe(res => {
    this.provinciaEstadosCombo = res as ItemCombo[];
  })
}
  this.cidadesCombo = [];        
}

public onEstadoChange(event: any){
  if (event.value) {
    this.cidadeService.buscarCidadeParaComboPorIdEstado(event.value).subscribe(res => {
      this.cidadesCombo = res as ItemCombo[];
    })
  }
}

returnBack() {
  this.location.back();
}

}
