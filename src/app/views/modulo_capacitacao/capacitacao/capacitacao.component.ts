import { PcsUtil } from 'src/app/services/pcs-util.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { EventoService } from 'src/app/services/evento.service';
import { Component, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-capacitacao',
  templateUrl: './capacitacao.component.html',
  styleUrls: ['./capacitacao.component.css']
})
export class CapacitacaoComponent implements OnInit {

  eventos: any = [];
  form: FormGroup;
  palavraChave: string;
  dataInicial: string;
  dataFinal: string;

  constructor(
    private eventoService: EventoService,
    private titleService: Title,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group(({
      palavraChave: [''],
      dataInicial: [null],
      dataFinal: [null],
    }));
  }

  ngOnInit() {
    this.titleService.setTitle(`Capacitação - Cidades Sustentáveis`);
    this.buscarEventosCapacitacao();
  }

  public buscarEventosCapacitacao() {
    this.eventoService.buscarEventosCapacitacao().subscribe(res => {
      this.eventos = res;
    });
  }

  public buscarEventosCapacitacaoFiltrado(){
    this.palavraChave = this.form.controls['palavraChave'].value;
    this.dataInicial = this.form.controls['dataInicial'].value != null ? moment(this.form.controls['dataInicial'].value).format('YYYY-MM-DD') : '';
    this.dataFinal = this.form.controls['dataFinal'].value != null ? moment(this.form.controls['dataFinal'].value).format('YYYY-MM-DD') : '';

    this.eventoService.buscarEventosCapacitacaoFiltrados(this.palavraChave, this.dataInicial, this.dataFinal).subscribe(res => {
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
    this.form.controls['palavraChave'].setValue('');
    this.form.controls['dataInicial'].setValue(null);
    this.form.controls['dataFinal'].setValue(null);
  }

}
