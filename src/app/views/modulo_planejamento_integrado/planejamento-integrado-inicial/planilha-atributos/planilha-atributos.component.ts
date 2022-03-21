import { Component, OnInit, Input, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as formula from 'hot-formula-parser';
import * as XLSX from 'xlsx';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Arquivo } from 'src/app/model/arquivo';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { Console } from 'console';
type AOA = any[][];
@Component({
  selector: 'app-planilha-atributos',
  templateUrl: './planilha-atributos.component.html',
  styleUrls: ['./planilha-atributos.component.css']
})
export class PlanilhaAtributosComponent implements OnInit, OnChanges {

  esconderPlanilha = true;

  @Input() atributos: any;
  @Input() planilha: any;
  @Input() idsSelecionados: any;
  @Output() calcular: any = new EventEmitter();
  @Output() mesclar: any = new EventEmitter();
  @Output() selecionar: any = new EventEmitter();
  @Input() modoImpressao: any;
  mostrarCamadaDeEdicao = false;
  habilitarFormularioNovoAtributo = false;
  habilitarFormularioMesclagem = false;
  formulaValida = false;
  erroNaFormula = '';

  formulaParser = new formula.Parser();
  public formAtributo: FormGroup;
  public formMesclagem: FormGroup;
  nomeArquivoMesclagem = '';
  colunasMesclagem = [];
  planilhaImportada = [];

  filtros = new Map();
  planilhaFiltrada = [];
  estaFiltrado = false;

  @ViewChild(CdkDrag) cdkDrag: CdkDrag;



  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    ) {
      this.formAtributo = this.formBuilder.group({
        nome: ['', Validators.required],
        formula: ['']
      });
      this.formMesclagem = this.formBuilder.group({
        arquivo: ['', Validators.required],
        atributoReferencia: ['', Validators.required],
      });
     }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
  }

  abrirPlanilha() {
    this.esconderPlanilha = false;
    this.changeDetectorRefs.detectChanges();
  }
  fecharPlanilha() {
    this.esconderPlanilha = true;
  }

  getKeys(objeto) {
    return Object.keys(objeto);
  }

  inverterHabilitarNovoAtributo() {
    this.habilitarFormularioNovoAtributo = !this.habilitarFormularioNovoAtributo;
    this.habilitarFormularioMesclagem = false;
    this.formAtributo.reset();
    this.formMesclagem.reset();
  }

  validarFormula() {
    const formula = this.formAtributo.controls.formula.value;
    const atributosOrdenados = [];
    this.atributos.forEach(atributo => {
      atributosOrdenados.push(atributo);
    });
    atributosOrdenados.sort((a, b) => -(a.length > b.length ) || +(a.lenght < b.lenght ));

    let formulaTeste = formula ?  formula : '';
    let i = 10;
    atributosOrdenados.forEach(atributo => {
      formulaTeste = formulaTeste.replaceAll(`${atributo}`, `${i++}`);
    });
    const resultado = this.formulaParser.parse(formulaTeste);

    if (resultado.error == null) {
      this.formulaValida = true;
      this.erroNaFormula = '';
    } else {
      this.formulaValida = false;
      switch (resultado.error) {
        case '#ERROR!':
          this.erroNaFormula = 'Não foi possível interpretar a fórmula';
          break;
        case '#DIV/0!':
          this.erroNaFormula = 'Possível divisão por 0';
          break;
        case '"#NAME?"':
          this.erroNaFormula = 'Não foi possível interpretar a fórmula';
          break;
        default:
          this.erroNaFormula = 'Não foi possível interpretar a fórmula';
          break;
      }
    }
  }

  criarAtributo() {
    this.formulaValida ? this.validarComFormula() : this.validarSemFormula();
  }

  validarComFormula() {
    if (this.formAtributo.valid && this.formulaValida) {
      const atributo = {
        nome : this.formAtributo.controls.nome.value,
        formula : this.formAtributo.controls.formula.value
      };
      this.calcular.emit(atributo);
      this.inverterHabilitarNovoAtributo();
    } else {
      if (!this.formAtributo.valid) {
        PcsUtil.swal().fire('', `O campo nome precisa estar preenchido e ter entre 3 e 10 caracteres.`, 'error');
      } else if (!this.formulaValida) {
        PcsUtil.swal().fire('', `${this.erroNaFormula}`, 'error');
      }

    }
  }

  validarSemFormula() {
    if (this.formAtributo.valid) {
      const atributo = {
        nome : this.formAtributo.controls.nome.value,
        formula : this.formAtributo.controls.formula.value
      };
      this.calcular.emit(atributo);
      this.inverterHabilitarNovoAtributo();
    } else {
      if (!this.formAtributo.valid) {
        PcsUtil.swal().fire('', `O campo nome precisa estar preenchido e ter entre 3 e 10 caracteres.`, 'error');
      } else if (!this.formulaValida) {
        PcsUtil.swal().fire('', `${this.erroNaFormula}`, 'error');
      }

    }
  }


  inverterHabilitarMesclagem() {
    this.habilitarFormularioMesclagem = !this.habilitarFormularioMesclagem;
    this.habilitarFormularioNovoAtributo = false;
    this.nomeArquivoMesclagem = null;
    this.formMesclagem.reset();
    this.formAtributo.reset();
  }

  public async processFileMesclagem(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      const arquivo = new Arquivo();
      arquivo.nomeArquivo = event.target.files[0].name;
      this.nomeArquivoMesclagem = event.target.files[0].name;
      arquivo.extensao = reader.result.toString().split(',')[0];
      arquivo.conteudo = reader.result.toString().split(',')[1];

      this.formMesclagem.controls.arquivo.setValue(arquivo);
      this.lerArquivo(event.target.files[0]);
    };
  }

  lerArquivo(file) {
    /* wire up file reader */
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.planilhaImportada = XLSX.utils.sheet_to_json(ws, { header: 1 }) as AOA;
      const colunas = this.planilhaImportada.slice(0, 1)[0];
      this.planilhaImportada.shift();
      this.colunasMesclagem = colunas;
    };
    reader.readAsBinaryString(file);
  }

  realizarMesclagem() {
    this.mesclar.emit(
      {
        referencia : this.formMesclagem.controls.atributoReferencia.value,
        matriz : this.planilhaImportada,
        atributos: this.colunasMesclagem
      }
    );
    this.inverterHabilitarMesclagem();
  }

  downloadAtributos() {
    const planilhaExport = [];
    this.planilha.forEach(item => {
      planilhaExport.push(this.formatarRegistrosNumericosParaExportar(item));
    });
    planilhaExport.unshift(Array.from(this.atributos));
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.aoa_to_sheet(planilhaExport);
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
    XLSX.writeFile(workBook, 'planilha-atributos-pcs.xlsx');
  }

  limparFiltroAtributos(filtro) {
    this.filtrarAtributos(filtro);
  }

  filtrarAtributos(filtro: any) {
    this.filtros.set(filtro.atributo, filtro);
    this.existeFiltroAtivo();
    if (this.estaFiltrado) {
      this.planilhaFiltrada = [];
      const mapAtributos = new Map();
      const tabelaAtributos = Array.from(this.atributos);
      for (let i = 0; i < this.atributos.size; i++) {
        mapAtributos.set(tabelaAtributos[i], i);
      }

      this.planilha.forEach(registro => {
      let adicionarRegistro = true;
      this.filtros.forEach(filtro => {
        if (filtro.operacao != null && !filtro.valor != null ) {
          switch (filtro.operacao) {
            case '=':
              const valor1 = registro[mapAtributos.get(filtro.atributo)];
              const resultado1 = ((valor1 + '').toLowerCase() == (filtro.valor + '').toLowerCase());
              if (!resultado1) {
                adicionarRegistro = false;
              }
              break;
            case '!=':
              const valor2 = registro[mapAtributos.get(filtro.atributo)];
              const resultado2 = ((valor2 + '').toLowerCase() != (filtro.valor + '').toLowerCase());
              if (!resultado2) {
                adicionarRegistro = false;
              }
              break;
            case '<':
              const valor3 = registro[mapAtributos.get(filtro.atributo)];
              const resultado3 = this.formulaParser.parse(`${(valor3 + '').toLowerCase()} < ${(filtro.valor + '').toLowerCase()}`);
              if (!resultado3.result) {
                adicionarRegistro = false;
              }
              break;
            case '<=':
              const valor4 = registro[mapAtributos.get(filtro.atributo)];
              const resultado4 = this.formulaParser.parse(`${(valor4 + '').toLowerCase()} <= ${(filtro.valor + '').toLowerCase()}`);
              if (!resultado4.result) {
                adicionarRegistro = false;
              }
              break;
            case '>':
              const valor5 = registro[mapAtributos.get(filtro.atributo)];
              const resultado5 = this.formulaParser.parse(`${(valor5 + '').toLowerCase()} > ${(filtro.valor + '').toLowerCase()}`);
              if (!resultado5.result) {
                adicionarRegistro = false;
              }
              break;
            case '>=':
              const valor6 = registro[mapAtributos.get(filtro.atributo)];
              const resultado6 = this.formulaParser.parse(`${(valor6 + '').toLowerCase()} >= ${(filtro.valor + '').toLowerCase()}`);
              if (!resultado6.result) {
                adicionarRegistro = false;
              }
              break;

            default:
              break;
          }
          // let resultado = this.formulaParser.parse(formulaTeste);
        }
      });
      if ( adicionarRegistro) {
        this.planilhaFiltrada.push(registro);
      }
    });
    }

  }

  existeFiltroAtivo() {
    let existe = false;
    this.filtros.forEach(filtro => {
      if (filtro.operacao != null && filtro.valor != null) {
        existe = true;
      }
    });
    this.estaFiltrado = existe;
  }

  adicionarNaFormula( valor ) {
    if (!this.formAtributo.controls.formula.value) {
      this.formAtributo.controls.formula.setValue('');
    }
    this.formAtributo.controls.formula
      .setValue(`${this.formAtributo.controls.formula.value}${valor}` );
  }

  resetDrag() {
    this.cdkDrag._dragRef['_previewRect'] = undefined;
    this.cdkDrag._dragRef['_boundaryRect'] = undefined;
  }

  verificarSeEstaSelecionado(id) {
    if (!isNaN(id)) {
      if (this.idsSelecionados.indexOf( parseInt(id) ) > -1) {
        return true;
      }
    } else {
      if (this.idsSelecionados.indexOf(id) > -1) {
        return true;
      }
    }
    return false;
  }

  selecionarLinha(id) {
    this.selecionar.emit(id);
  }

  selecionarTudo() {
    if (this.estaFiltrado) {
      for (const item of this.planilhaFiltrada) {
        if (!this.verificarSeEstaSelecionado(item[0]) ) {
          this.selecionar.emit(item[0]);
        }
      }
    } else {
      for (const item of this.planilha) {
        if (!this.verificarSeEstaSelecionado(item[0]) ) {
          this.selecionar.emit(item[0]);
        }
      }
    }
  }

  descelecionarTudo() {
    for (const item of this.planilha) {
      if (this.verificarSeEstaSelecionado(item[0]) ) {
        this.selecionar.emit(item[0]);
      }
    }
  }


  formatarRegistrosNumericos(registro: any) {
    if(registro && this.isNumber(registro)) {
      const registroFormatado = registro.toLocaleString('pt-BR');

      //const registroNumberFormatado = parseFloat(registroFormatado);

      return registroFormatado;
    } else {
      return registro;
    }
  }

  formatarRegistrosNumericosParaExportar(item) {
    let itemParaFormatar = [];
    item.forEach(element => {
      if(element && this.isNumber(element)) {
        itemParaFormatar.push(element.toLocaleString('pt-BR'));
      } else {
        itemParaFormatar.push(element)
      }
    });
    
    return itemParaFormatar;
  }

  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}
