import { EventoService } from 'src/app/services/evento.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment';
import { isValid } from 'date-fns';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { environment } from 'src/environments/environment';
import { AlertaService } from 'src/app/services/alerta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-participacao-cidada-principal',
  templateUrl: './participacao-cidada-principal.component.html',
  styleUrls: ['./participacao-cidada-principal.component.css']
})
export class ParticipacaoCidadaPrincipalComponent implements OnInit {

  eventos: any = [];

  form: FormGroup;
  formSolicitacao: FormGroup;
  dataInicial:string;
  dataFinal: string;
  isValid;

  public editorConfig: any = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline']],
      ['', []],
      ['', ['', '', '']],
      ['', ['', '', '']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  constructor(
    private eventoService: EventoService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
  ) {
    this.form = this.formBuilder.group(({
      dataInicial: [''],
      dataFinal: [''],
    }));
     this.formSolicitacao = this.formBuilder.group({
      temas: [null, Validators.required]
    })
   }

  ngOnInit() {
    this.buscarEventosParticipacaoCidadaFiltradoSemToast();
  }

  public buscarEventosParticipacaoCidadaFiltrado(){
    this.dataInicial = this.form.controls['dataInicial'].value != null ? moment(this.form.controls['dataInicial'].value).format('YYYY-MM-DD') : '';
    this.dataFinal = this.form.controls['dataFinal'].value != null ? moment(this.form.controls['dataFinal'].value).format('YYYY-MM-DD') : '';

    this.eventoService.buscarEventosParticipacaoCidadaFiltrados(this.dataInicial, this.dataFinal).subscribe(res => {
      this.eventos = res;

      const toast = PcsUtil.swal().mixin({
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 3000,
      });

      if (this.eventos.length > 0) {
        let el = document.getElementById('calendario');
        el.scrollIntoView();
        toast.fire({
          type: 'success',
          title: 'Agenda e mapa atualizados.'
        });
      }
      else {
        toast.fire({
          type: 'error',
          title: 'Não foram encontrados eventos com os filtros utilizados.'
        });
      }
    });
  }

  public limparFiltro() {
    this.form.controls['dataInicial'].setValue(null);
    this.form.controls['dataFinal'].setValue(null);
  }

  public buscarEventosParticipacaoCidadaFiltradoSemToast(){
    this.dataInicial = this.form.controls['dataInicial'].value != null ? moment(this.form.controls['dataInicial'].value).format('YYYY-MM-DD') : '';
    this.dataFinal = this.form.controls['dataFinal'].value != null ? moment(this.form.controls['dataFinal'].value).format('YYYY-MM-DD') : '';

    this.eventoService.buscarEventosParticipacaoCidadaFiltrados(this.dataInicial, this.dataFinal).subscribe(res => {
      this.eventos = res;
    });
  }

  onSolicitar() {
    if (!this.formSolicitacao.invalid ) {

      this.isValid = true;
      this.alertaService.inserir(
        {link: this.formSolicitacao.controls.temas.value}
        ).subscribe(res => {
        Swal.fire('', 'Proposta enviada', 'success')
      })
    }
    else {
      this.isValid = false;
    }
  }
  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle.markAsTouched();
      if (controle instanceof FormGroup){
        this.verificaValidacoesForm(controle);
      }
    });
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}evento-de-participacao-cidada.png`
  }
}
