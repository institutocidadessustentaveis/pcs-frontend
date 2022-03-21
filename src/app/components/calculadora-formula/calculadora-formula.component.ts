import { Component, OnInit, ViewChild, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ControlValueAccessor, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Variavel } from 'src/app/model/variaveis';
import { MatSelect } from '@angular/material';
import { CalculadoraService } from 'src/app/services/calculadora.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-calculadora-formula',
  templateUrl: './calculadora-formula.component.html',
  styleUrls: ['./calculadora-formula.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalculadoraFormulaComponent),
      multi: true
    }
  ]
})
export class CalculadoraFormulaComponent implements ControlValueAccessor, OnInit {

  formula: any = '';
  _value;
  @Input() concatenacao: boolean = false;
  @Input() variaveis: Array<Variavel> = new Array<Variavel>();
  @Input() disabled = false;
  @Output() resultado = new EventEmitter();

  pontoHabilitado: boolean = false;
  validado: boolean = false;

  form: FormGroup;
  numAcumulado: any;
  propagateChange = (_: any) => {};

  ultimaVariavelInseridaNaFormula: any;

  @ViewChild(MatSelect) cbVariaveis: MatSelect;

  constructor(public formBuilder: FormBuilder,
              private service: CalculadoraService) {
    this.form = formBuilder.group({
      formula: ['', [Validators.required]]
    });
  }

  ngOnInit() {
  }

  get value() {
    let formula = this.gerarFormula(this._value);
    return formula;
  }

  set value(val) {
    if (val) {
      this._value = this.formatarFormula(val);
      this.setFormula(this._value);
    }
  }

  addEvent($event) {
    this.value = this.gerarFormula(this.formula);
    this.propagateChange(this.value);
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.value = value;
      this.propagateChange(this.value);
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private setFormula(formula: string) {
    this.formula = formula;
    this.form.controls['formula'].setValue(formula);
    this.form.controls['formula'].markAsTouched();
    this.propagateChange(this.gerarFormula(this.formula));
    this.validado = false;
    this.resultado.emit(false);
  }

  validar() {
    if (this.formula == '') {
      this.form.controls['formula'].setErrors({'required': true});
    } else {
      this.service.validarFormula(this.gerarFormula(this.formula)).subscribe(resultado => {
        this.validado = true;
        this.form.controls['formula'].setErrors(Boolean(resultado) ? null : {'incorrect': true});
        this.resultado.emit(Boolean(resultado));
      });
    }
  }

  gerarFormula(entrada: string): string {
    if (entrada !== undefined && entrada !== null && entrada !== '') {
      this.variaveis.forEach(variavel => {
        // let busca = variavel.nome.replace('?', '\\?')
        let busca = ('var' + variavel.id).replace('?','\\?');
        let exp = new RegExp('\"' + busca + '\"', 'g');
        entrada = entrada.replace(exp, '#' + variavel.id + '#');
      });
    }
    return entrada;
  }

  formatarFormula(entrada: string): string {
    this.variaveis.forEach(variavel => {
      let exp = new RegExp('#' + variavel.id + '#', 'g');
      // entrada = entrada.replace(exp, '\"' + variavel.nome + '\"');
      entrada = entrada.replace(exp, '\"' + 'var' + variavel.id + '\"');
    });
    return entrada;
  }

  limpar() {
    this.ultimaVariavelInseridaNaFormula = '';
    this.setFormula('');
  }

  voltar() {
    let formula = this.formula;
    if (formula.endsWith('\"')) {
      formula = formula.slice(0, -1);
      formula = formula.slice(0, formula.lastIndexOf('\"'));
    }
    else if (formula.endsWith('concat(')) {
      formula = formula.slice(0, -7);
    } else {
      formula = formula.slice(0, -1);
    }
    this.setFormula(formula.trim());
  }

  inserirValor(digito: any) {
    if (!digito.includes('var') && this.ultimaVariavelInseridaNaFormula != undefined && this.ultimaVariavelInseridaNaFormula != null
      && this.ultimaVariavelInseridaNaFormula.tipo === 'Texto livre') {
        swal.fire('Fórmula incorreta!',
        `Variável "${this.ultimaVariavelInseridaNaFormula.nome}" é do tipo texto`,
        'warning');
        return;
    }

    let formula = this.formula;
    if (this.isOperacao(digito) && (isNaN(formula.slice(-1)) || formula.endsWith('\"' || formula.endsWith('(')))) {
      if (!formula.endsWith('\"') && !formula.endsWith('(') && !formula.endsWith(')')) {
        formula = formula.slice(0, -1).trim();
      }
    }
    if (digito === ',' && formula.split(' ').slice(-1)[0].includes(',')) {
      return;
    }
    if (digito !== ',' && formula.slice(-1) !== ',') {
      if (isNaN(digito) || isNaN(formula.slice(-1))) {
        formula = formula.concat(" ");
      }
    }

    // if (this.isNumber(digito)) {
    //   let numAcumulado: any;
    //   let numParaFormatar;
    //   let numFormatado;

    //   if ((typeof numFormatado !== "undefined")) {
    //     // Retira o ultimo digito da formula para acrescentar numeroFormatado - numero agrupado
    //     formula = formula.substr(1, (formula.length - 2));
    //     formula = formula.concat(numFormatado);
    //   } else {

    //     let numIni;
    //     let numFim;

    //     numIni = formula.replace(/[.]+/g, '').search(/[\d,][0-9]/i);
    //     numFim = formula.length;

    //     numFormatado = (formula.substring(numIni, numFim));
    //     numFormatado = numFormatado.toString().concat(digito);
    //     numFormatado = numFormatado.replace(/[.]+/g, '');
    //     numFormatado = Number(numFormatado);
    //     numFormatado = numFormatado.toLocaleString('pt-BR');

    //     if( (typeof numFormatado !== "undefined" ) && numFormatado !== null && numFormatado !== '' && numIni !== -1) {
    //       formula = formula.substring(0, numIni);
    //       formula = formula.concat(numFormatado);
    //     } else {
    //       formula = formula.concat(digito);
    //     }
    //   }
    // }else {
      formula = formula.concat(digito);
    // }

    this.setFormula(formula.trim());
  }

  isOperacao(digito: string) {
    let pattern = /^[+-/*]*$/;
    return pattern.test(digito);
  }

  inserirVariavel() {
    const variavelParaInserirNaFormula = this.cbVariaveis.value;
    if (variavelParaInserirNaFormula.tipo === 'Texto livre' && (this.formula.includes('+')
      || this.formula.includes('*') || this.formula.includes('/') || this.formula.includes('-'))) {
      this.cbVariaveis.value = null;
      this.ultimaVariavelInseridaNaFormula = '';
      swal.fire('Fórmula incorreta!',
        `Variável "${variavelParaInserirNaFormula.nome}" é do tipo texto`,
        'warning');
    } else {
      this.ultimaVariavelInseridaNaFormula = this.cbVariaveis.value;
      this.inserirValor('\"' + 'var' + this.cbVariaveis.value.id + '\"');
      this.cbVariaveis.value = '';
    }
  }

  desativarConcat(): boolean {
    return !this.concatenacao;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}
