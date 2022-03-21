import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filtro-planilha',
  templateUrl: './filtro-planilha.component.html',
  styleUrls: ['./filtro-planilha.component.css']
})
export class FiltroPlanilhaComponent implements OnInit {
  @Input() atributo;
  @Output() limparAtributos: any = new EventEmitter();
  @Output() filtrarAtributos: any = new EventEmitter();
  mostrarCampos = false;
  filtro: any = {};
  filtrado = false;

  public formBusca: FormGroup;
  constructor(
    private formBuilder: FormBuilder) {
      this.formBusca = this.formBuilder.group({
        operacao: ['', Validators.required],
        valor: ['', Validators.required],
        atributo: [this.atributo, Validators.required]
      });
    }

  ngOnInit() {
  }

  cliqueBusca() {
    this.mostrarCampos = !this.mostrarCampos;
  }

  limpar() {
    this.formBusca.reset();
    this.formBusca.controls.atributo.setValue(this.atributo);
    this.filtro =  {
      atributo: this.atributo,
      operacao: this.formBusca.controls.operacao.value,
      valor: this.formBusca.controls.valor.value
    };
    this.limparAtributos.emit(this.filtro);
    this.filtrado = false;
    this.mostrarCampos = false;
  }

  filtrar() {
    this.filtro =  {
                      atributo: this.atributo,
                      operacao: this.formBusca.controls.operacao.value,
                      valor: this.formBusca.controls.valor.value
                    };
    this.filtrarAtributos.emit(this.filtro);
    this.filtrado = true;
    this.mostrarCampos = false;
  }
}
