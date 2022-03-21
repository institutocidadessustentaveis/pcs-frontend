import { InstanciaOrgaoService } from './../../../../services/instancia_orgao.service';
import { InstituicaoFonte } from './../../../../model/instituicao-fonte';
import { Indicador } from 'src/app/model/indicadores';
import { Component, OnInit, Input, Output, forwardRef, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Variavel } from 'src/app/model/variaveis';
import { VariaveisOpcoes } from 'src/app/model/variaveis-opcoes';
import { VariaveisPreenchidasDTO, AlertaValorDTO } from '../preenchimento-indicadores.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { InstituicaoFonteService } from 'src/app/services/instituicao-fonte.service';
import { OrgaoService } from 'src/app/services/orgao.service';
import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';

export class VariavelPreenchida {
  id: Number;
  nomeVariavel: string;
}

@Component({
  selector: 'app-preenchimento-indicadores-variaveis',
  templateUrl: './preenchimento-indicadores-variaveis.component.html',
  styleUrls: ['./preenchimento-indicadores-variaveis.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreenchimentoIndicadoresVariaveisComponent),
      multi: true
    }
  ]
})
export class PreenchimentoIndicadoresVariaveisComponent implements OnInit {
  formVariavel: FormGroup;

  // Variável Lista
  listaAnoReferencia = new Array<String>();
  listaVariavel = new Array<Variavel>();
  listaTabelaOpcoes = new Array<VariaveisOpcoes>();
  listaTabelaSimNao = new Array<VariaveisOpcoes>();
  listaInstituicaoFonte = [];
  listaInstancia = [];
  listaOrgao = [];

  // Variável Slider
  labelSlider = 'Não'; // Colocar cor verde pra sim, e para nao amarelo

  // Variável Booleana dos botões
  permiteConfirmar = false;
  habilitarBotaoCancelar = true;
  blockFields = false;
  exibirCampoNomeInstituicaoFonte = true;
  exibirListaNomeDoOrgao = true;

  idHtml: number;

  @Input('objetoVariavel') variavel: VariaveisPreenchidasDTO;
  @Input('objetoAlerta') alerta: Array<AlertaValorDTO>;
  @Input('desabilitarBtnConfirmar') desabilitarBtnConfirmar: boolean;
  scrollUp: any;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    private element: ElementRef,
    public activatedRoute: ActivatedRoute,
    private indicadorService: IndicadoresService,
    private variavelPreenchidaService: VariavelPreenchidaService,
    private instituicaoFonteService: InstituicaoFonteService,
    private instanciaOrgaoService: InstanciaOrgaoService,
    private orgaoService: OrgaoService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.formVariavel = this.formBuilder.group({
      id: [''],
      tipo: [''],
      nome: [''],
      valor: [''],
      respostaSimples: [''],
      opcao: [''],
      opcoes: [null],
      fonte: [''],
      observacao: [''],
      instancia: [''],
      orgao: [''],
      fonteTexto: ['']
    });
  }

  ngOnInit() {
    this.preencherFormulario();
    this.instituicaoFonteService
      .buscarComboBoxInstituicaoFonte()
      .subscribe(response => {
        this.listaInstituicaoFonte = response as ItemCombo[];
      });
  }

  changeSlide() {
    this.labelSlider = this.labelSlider === 'Não' ? 'Sim' : 'Não';
    if (this.variavel.tipo === 'Tipo sim/não com lista de opções') {
      this.listaTabelaOpcoes =
        this.labelSlider === "Sim"
          ? this.listaTabelaSimNao.filter(x => x.tipo === "Sim")
          : this.listaTabelaSimNao.filter(x => x.tipo === "Nao");
    }
  }

  async preencherFormulario() {
    const CamposObrigatorios: boolean = Boolean(
      JSON.parse(localStorage.getItem('JustificativaRequired'))
    );

    if (
      this.variavel.tipo.toString() === 'Texto Livre' ||
      this.variavel.tipo.toString() === 'Numérico inteiro' ||
      this.variavel.tipo.toString() === 'Numérico decimal'
    ) {
      if (CamposObrigatorios === false) {
        this.formVariavel.controls.valor.setValidators([
          Validators.minLength(5),
          Validators.maxLength(20),
          Validators.required
        ]);
        this.formVariavel.controls.valor.updateValueAndValidity();
        this.formVariavel.controls.fonte.setValidators([
          Validators.minLength(20),
          Validators.maxLength(100),
          Validators.required
        ]);
        this.formVariavel.controls.fonte.updateValueAndValidity();
      }
    } else if (this.variavel.tipo.toString() === 'Tipo lista de opções') {
      if (CamposObrigatorios === false) {
        this.formVariavel.controls.fonte.setValidators([
          Validators.minLength(20),
          Validators.maxLength(100),
          Validators.required
        ]);
        this.formVariavel.controls.fonte.updateValueAndValidity();
        if (this.variavel.multiplaSelecao) {
          this.formVariavel.controls.opcoes.setValidators([
            Validators.required
          ]);
          this.formVariavel.controls.opcoes.updateValueAndValidity();
        } else {
          this.formVariavel.controls.opcao.setValidators([Validators.required]);
          this.formVariavel.controls.opcao.updateValueAndValidity();
        }
        this.listaTabelaOpcoes = this.variavel.listaOpcoes.filter(
          x => x.tipo === 'Opcao'
        );
      }
    } else if (
      this.variavel.tipo.toString() === 'Tipo sim/não com lista de opções'
    ) {
      if (CamposObrigatorios === false) {
        this.formVariavel.controls.respostaSimples.setValidators([
          Validators.required
        ]);
        this.formVariavel.controls.respostaSimples.updateValueAndValidity();
        this.formVariavel.controls.fonte.setValidators([
          Validators.minLength(20),
          Validators.maxLength(100),
          Validators.required
        ]);
        this.formVariavel.controls.fonte.updateValueAndValidity();
        if (this.variavel.multiplaSelecao) {
          this.formVariavel.controls.opcoes.setValidators([
            Validators.required
          ]);
          this.formVariavel.controls.opcoes.updateValueAndValidity();
        } else {
          this.formVariavel.controls.opcao.setValidators([Validators.required]);
          this.formVariavel.controls.opcao.updateValueAndValidity();
        }
      }
      this.listaTabelaSimNao = this.variavel.listaOpcoes.filter(
        x => x.tipo !== 'Opcao'
      );
      this.listaTabelaOpcoes = this.variavel.listaOpcoes.filter(
        x => x.tipo === 'Nao'
      );
    } else if (this.variavel.tipo.toString() === 'Tipo sim/não') {
      if (CamposObrigatorios === false) {
        this.formVariavel.controls.respostaSimples.setValidators([
          Validators.required
        ]);
        this.formVariavel.controls.respostaSimples.updateValueAndValidity();
        this.formVariavel.controls.fonte.setValidators([
          Validators.minLength(20),
          Validators.maxLength(100),
          Validators.required
        ]);
        this.formVariavel.controls.fonte.updateValueAndValidity();
      }
    }

    if (localStorage.getItem('ListaVariavelPreenchida') !== null) {
      localStorage.removeItem("ListaVariavelPreenchida");
    }
    this.formVariavel.controls['id'].setValue(this.variavel.idVariavel);
    this.formVariavel.controls['tipo'].setValue(this.variavel.tipo);
    this.formVariavel.controls['nome'].setValue(this.variavel.nome);
    if (this.variavel.fonte === 23) {
      this.formVariavel.controls['fonte'].setValue(null);
      this.formVariavel.controls['fonteTexto'].setValue(
        this.variavel.fonteTexto
      );
    } else {
      this.formVariavel.controls['fonte'].setValue(this.variavel.fonte);
    }

    this.formVariavel.controls['instancia'].setValue(this.variavel.instancia);
    if (this.variavel.instancia === 1) {
      this.formVariavel.controls['orgao'].setValue(68);
    } else if (this.variavel.instancia === 2) {
      this.formVariavel.controls['orgao'].setValue(69);
    } else if (this.variavel.instancia === 3) {
      this.formVariavel.controls['orgao'].setValue(70);
    } else {
      this.formVariavel.controls['orgao'].setValue(this.variavel.orgao);
    }
    this.formVariavel.controls['respostaSimples'].setValue(
      this.variavel.respostaSimples
    );
    this.formVariavel.controls['observacao'].setValue(this.variavel.observacao);
    this.formVariavel.controls['valor'].setValue(
      this.variavel.tipo.trim().toUpperCase() === 'TEXTO LIVRE'
        ? this.variavel.valorTexto
        : this.variavel.valor
    );
    this.formVariavel.controls['opcao'].setValue(this.variavel.idOpcao);
    if (this.variavel.multiplaSelecao) {
      this.formVariavel.controls['opcoes'].setValue(this.variavel.idOpcoes);
    }

    this.labelSlider =
      Boolean(this.variavel.respostaSimples) === true ? 'Sim' : 'Não';
    if (this.variavel.tipo === 'Tipo sim/não com lista de opções') {
      this.listaTabelaOpcoes =
        this.labelSlider === "Sim"
          ? this.listaTabelaSimNao.filter(x => x.tipo === "Sim")
          : this.listaTabelaSimNao.filter(x => x.tipo === "Nao");
    }
    this.idHtml = Number(this.variavel.id);
  }

  async confirmar() {
    const CamposObrigatorios: boolean = Boolean(
      JSON.parse(localStorage.getItem('JustificativaRequired'))
    );
    if (CamposObrigatorios === false) {
      if (
        this.formVariavel.controls['tipo'].value.toString() === 'Texto Livre'
      ) {
        this.formVariavel.controls.valor.setValidators([
          Validators.minLength(5),
          Validators.maxLength(20),
          Validators.required
        ]);
        this.formVariavel.controls.valor.updateValueAndValidity();
      } else if (
        this.formVariavel.controls['tipo'].value.toString() ===
          'Numérico inteiro' ||
        this.formVariavel.controls['tipo'].value.toString() ===
          'Numérico decimal'
      ) {
        this.formVariavel.controls.valor.setValidators([Validators.required]);
        this.formVariavel.controls.valor.updateValueAndValidity();
      } else if (
        this.formVariavel.controls['tipo'].value.toString() ===
          'Tipo lista de opções' ||
        this.formVariavel.controls['tipo'].value.toString() ===
          'Tipo sim/não com lista de opções'
      ) {
        if (this.variavel.multiplaSelecao) {
          this.formVariavel.controls.opcoes.setValidators([
            Validators.required
          ]);
          this.formVariavel.controls.opcoes.updateValueAndValidity();
        } else {
          this.formVariavel.controls.opcao.setValidators([Validators.required]);
          this.formVariavel.controls.opcao.updateValueAndValidity();
        }
      }
      this.formVariavel.controls.fonte.setValidators([
        Validators.minLength(20),
        Validators.maxLength(100),
        Validators.required
      ]);
      this.formVariavel.controls.fonte.updateValueAndValidity();

      if (!this.exibirCampoNomeInstituicaoFonte) {
        this.formVariavel.controls.instancia.setValidators([Validators.required]);
        this.formVariavel.controls.instancia.updateValueAndValidity();
      }
      if (!this.exibirListaNomeDoOrgao) {
        this.formVariavel.controls.orgao.setValidators([Validators.required]);
        this.formVariavel.controls.orgao.updateValueAndValidity();
      }

    } else {
      this.formVariavel.controls.valor.setValidators([]);
      this.formVariavel.controls.valor.updateValueAndValidity();
      if (this.variavel.multiplaSelecao) {
        this.formVariavel.controls.opcoes.setValidators([Validators.required]);
        this.formVariavel.controls.opcoes.updateValueAndValidity();
      } else {
        this.formVariavel.controls.opcao.setValidators([Validators.required]);
        this.formVariavel.controls.opcao.updateValueAndValidity();
      }
      this.formVariavel.controls.fonte.setValidators([]);
      this.formVariavel.controls.fonte.updateValueAndValidity();

      if (this.exibirCampoNomeInstituicaoFonte) {
        this.formVariavel.controls.instancia.setValidators([Validators.required]);
        this.formVariavel.controls.instancia.updateValueAndValidity();
      }
      if (this.exibirListaNomeDoOrgao) {
        this.formVariavel.controls.orgao.setValidators([Validators.required]);
        this.formVariavel.controls.orgao.updateValueAndValidity();
      }
    }
    if (this.formVariavel.valid === true) {
      const variavelPreenchida = new VariaveisPreenchidasDTO();
      let listaVariavelPreenchida = new Array<VariaveisPreenchidasDTO>();
      variavelPreenchida.id = null;
      variavelPreenchida.idVariavel = this.formVariavel.controls['id'].value;
      variavelPreenchida.nome = this.formVariavel.controls['nome'].value;
      variavelPreenchida.descricao = '';
      variavelPreenchida.tipo = this.formVariavel.controls['tipo'].value;
      variavelPreenchida.valor =
        variavelPreenchida.tipo.trim().toUpperCase() !== 'TEXTO LIVRE'
          ? this.formVariavel.controls['valor'].value
          : null;
      variavelPreenchida.valorTexto =
        variavelPreenchida.tipo.trim().toUpperCase() === 'TEXTO LIVRE'
          ? this.formVariavel.controls['valor'].value
          : '';
      variavelPreenchida.respostaSimples = this.formVariavel.controls[
        'respostaSimples'
      ].value;
      variavelPreenchida.idOpcao = Number(
        this.formVariavel.controls['opcao'].value
      );
      variavelPreenchida.idOpcoes = this.formVariavel.controls['opcoes'].value;
      variavelPreenchida.fonte = this.formVariavel.controls['fonte'].value;
      let instituicaoRepetida = false;
      if (this.formVariavel.controls['fonte'].value === 23) {
        let fonteComparativa = this.formVariavel.controls['fonteTexto'].value;
        this.listaInstituicaoFonte.forEach(function (value) {
          if(value.label === fonteComparativa){
            instituicaoRepetida = true;
          }
        });
        if(instituicaoRepetida === false){
          variavelPreenchida.fonte = null;
          variavelPreenchida.fonteTexto = this.formVariavel.controls[
            'fonteTexto'
          ].value;
        }
      } else {
        variavelPreenchida.fonte = this.formVariavel.controls['fonte'].value;
      }

      variavelPreenchida.instancia = this.formVariavel.controls[
        'instancia'
      ].value;

      if (this.formVariavel.controls['instancia'].value === 1) {
        variavelPreenchida.orgao = 68;
      } else if (this.formVariavel.controls['instancia'].value === 2) {
        variavelPreenchida.orgao = 69;
      } else if (this.formVariavel.controls['instancia'].value === 3) {
        variavelPreenchida.orgao = 70;
      } else {
        variavelPreenchida.orgao = this.formVariavel.controls['orgao'].value;
      }
      variavelPreenchida.observacao = this.formVariavel.controls[
        'observacao'
      ].value;
      variavelPreenchida.dataPreenchimento = new Date();

      variavelPreenchida.status =
        variavelPreenchida.tipo.trim().toUpperCase() === 'TEXTO LIVRE'
          ? 'Aguardando Avaliação'
          : null;

      if (localStorage.getItem('ListaVariavelPreenchida') === null) {
        listaVariavelPreenchida.push(variavelPreenchida);
        localStorage.setItem(
          'ListaVariavelPreenchida',
          JSON.stringify(listaVariavelPreenchida)
        );
      } else {
        listaVariavelPreenchida = JSON.parse(
          localStorage.getItem('ListaVariavelPreenchida')
        );
        listaVariavelPreenchida.push(variavelPreenchida);
        localStorage.setItem(
          'ListaVariavelPreenchida',
          JSON.stringify(listaVariavelPreenchida)
        );
      }
      this.permiteConfirmar = true;
      this.habilitarBotaoCancelar = false;
      this.blockFields = true;
    } else {
      PcsUtil.swal()
        .fire({
          title: "Preenchimento de indicadores",
          text: `Para confirmar o preenchimento da ${this.formVariavel.controls["nome"].value}, todos os campos devem ser preenchidos corretamente.`,
          type: "warning",
          showCancelButton: false,
          confirmButtonText: "Ok"
        })
        .then(result => {}, error => {});
    }
  }

  async cancelar() {
    let listaVariavelPreenchida = new Array<VariaveisPreenchidasDTO>();
    let novaListaVariavelPreenchida = new Array<VariaveisPreenchidasDTO>();
    if (localStorage.getItem('ListaVariavelPreenchida') !== null) {
      listaVariavelPreenchida = JSON.parse(
        localStorage.getItem('ListaVariavelPreenchida')
      );
      novaListaVariavelPreenchida = listaVariavelPreenchida.filter(
        x => x.idVariavel !== this.formVariavel.controls['id'].value
      );
      if (novaListaVariavelPreenchida !== null) {
        localStorage.setItem(
          "ListaVariavelPreenchida",
          JSON.stringify(novaListaVariavelPreenchida)
        );
      }
      else { localStorage.removeItem("ListaVariavelPreenchida"); }
      this.permiteConfirmar = false;
      this.habilitarBotaoCancelar = true;
      this.blockFields = false;
    }
  }

  validarValorAlerta() {
    if (
      this.alerta !== null &&
      this.alerta !== undefined &&
      this.alerta.length !== 0 &&
      this.formVariavel.controls['valor'].valid === true
    ) {
      let alertaDTO: AlertaValorDTO = new AlertaValorDTO();
      alertaDTO = this.alerta.filter(
        x => x.idVariavel === this.formVariavel.controls['id'].value
      )[0];
      if ( alertaDTO && alertaDTO.valorMenor && alertaDTO.valorMaior &&
        (this.formVariavel.controls['valor'].value < alertaDTO.valorMenor ||
          this.formVariavel.controls['valor'].value > alertaDTO.valorMaior) &&
        alertaDTO.anoAtual !== alertaDTO.anoAnterior
      ) {
        PcsUtil.swal()
          .fire({
            title: 'Preenchimento de indicadores',
            text: `O valor informado possui uma diferença maior que 15% de seu último valor: ${alertaDTO.valorReferencia}`,
            type: 'info',
            showCancelButton: false,
            confirmButtonText: 'Ok'
          })
          .then(result => {}, error => {});
      }
    }
  }
  getNomeVariavel() {
    return this.formVariavel.get('nome').hasError('required')
      ? 'Campo justificativa é obrigatório'
      : this.formVariavel.get('nome').hasError('minlength')
      ? 'Campo justificativa deve conter ao menos 20 dígitos'
      : this.formVariavel.get('nome').hasError('maxlength')
      ? 'Campo justificativa deve conter no máximo 200 dígitos'
      : '';
  }

  getValor() {
    return this.formVariavel.get('valor').hasError('required')
      ? 'Campo valor é obrigatório'
      : this.formVariavel.get('valor').hasError('minlength')
      ? (parseInt(this.formVariavel.controls.valor.value) == 0 ? '' : 'Campo valor deve conter ao menos 1 dígito')
      : this.formVariavel.get('valor').hasError('maxlength')
      ? 'Campo valor deve conter no máximo 10 dígitos'
      : '';
  }

  getFonte() {
    return this.formVariavel.get('fonte').hasError('required')
      ? 'Campo fonte é obrigatório'
      : this.formVariavel.get('fonte').hasError('minlength')
      ? 'Campo fonte deve conter ao menos 20 dígitos'
      : this.formVariavel.get('fonte').hasError('maxlength')
      ? 'Campo fonte deve conter no máximo 100 dígitos'
      : '';
  }

  getOpcao() {
    return this.formVariavel.get('fonte').hasError('required')
      ? 'Campo lista de opção é obrigatório'
      : '';
  }

  public async instituicaoFonteSelecionado(event: any) {
    if (event === 23) {
      this.exibirCampoNomeInstituicaoFonte = false;
      this.instanciaOrgaoService
        .buscarComboBoxInstanciaOrgao()
        .subscribe(response => {
          this.listaInstancia = response as ItemCombo[];
        });
    } else {
      this.exibirCampoNomeInstituicaoFonte = true;
    }
  }

  public async instanciaSelecionado(event: any) {
    if (event === 4 || event === 5 || event === 6) {
      this.exibirListaNomeDoOrgao = false;
      this.orgaoService.buscarComboBoxOrgao(event).subscribe(response => {
        this.listaOrgao = response as ItemCombo[];
      });
    } else {
      this.exibirListaNomeDoOrgao = true;
    }
  }

  excluirVariavelPreenchida() {
    PcsUtil.swal().fire({
      title: 'Atenção!',
      text: 'Você realmente deseja excluir essa variável? Ao fazer isso todo Indicador que a usar terá o valor excluído.',
      type: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonText: 'Sim, tenho certeza',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.variavelPreenchidaService.deletar(this.variavel.id).subscribe(res =>{
          this.variavel.id = null;
          this.formVariavel.controls.valor.setValue('');
          this.formVariavel.controls.respostaSimples.setValue('');
          this.formVariavel.controls.opcao.setValue('');
          this.formVariavel.controls.opcoes.setValue(null);
          this.formVariavel.controls.fonte.setValue('');
          this.formVariavel.controls.observacao.setValue('');
          this.formVariavel.controls.instancia.setValue('');
          this.formVariavel.controls.orgao.setValue('');
          this.formVariavel.controls.fonteTexto.setValue('');
          PcsUtil.swal().fire(
            'Deletado!',
            'O registro foi excluído. Para salvar o indicador sem uma variável, por favor informe a justificativa, ou clique no botão Voltar.',
            'success'
          );
        });
      }
    });
  }
}
