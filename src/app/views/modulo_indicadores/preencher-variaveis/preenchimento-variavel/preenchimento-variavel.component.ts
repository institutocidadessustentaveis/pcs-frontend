import { VariaveisPreenchidas } from 'src/app/model/variaveis-preenchidas';
import { PreencherVariaveisComponent } from './../preencher-variaveis.component';
import { Component, forwardRef, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';
import { FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { InstituicaoFonteService } from 'src/app/services/instituicao-fonte.service';
import { InstanciaOrgaoService } from 'src/app/services/instancia_orgao.service';
import { OrgaoService } from 'src/app/services/orgao.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { VariavelService } from 'src/app/services/variavel.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-preenchimento-variavel',
  templateUrl: './preenchimento-variavel.component.html',
  styleUrls: ['./preenchimento-variavel.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PreencherVariaveisComponent),
      multi: true
    }
  ]
})
export class PreenchimentoVariavelComponent implements OnInit {

  @Input() variavel: any;
  @Input() idSubdivisao: any;
  @Output() foiPreenchido = new EventEmitter();

  variavelCompleta: any = {};
  serieHistorica: any = [];
  public labelSlider = 'Não';
  listaTabelaOpcoes = new Array<any>();
  listaTabelaSimNao = new Array<any>();
  listaInstituicaoFonte = [];
  listaInstancia = [];
  listaOrgao = [];
  exibirCampoNomeInstituicaoFonte = true;
  exibirListaNomeDoOrgao = true;
  anos = [];

  formVariavel: FormGroup;
  constructor(
    public formBuilder: FormBuilder,
    private variavelService: VariavelService,
    private variavelPreenchidaService: VariavelPreenchidaService,
    private instituicaoFonteService: InstituicaoFonteService,
    private instanciaOrgaoService: InstanciaOrgaoService,
    private orgaoService: OrgaoService ) {
      this.formVariavel = this.formBuilder.group({
        id: [null],
        tipo: [null],
        nome: [null],
        valor: [null],
        respostaSimples: [null],
        opcao: [null],
        opcoes: [null],
        fonte: [null, Validators.required],
        observacao: [null],
        instancia: [null],
        orgao: [null],
        fonteTexto: [null],
        ano: [new Date().getFullYear()-1]
      });
    }

  ngOnInit() {
    this.carregarAnos();
    this.carregarVariavel();
    this.carregarVariavelPreenchida();
    this.instituicaoFonteService
      .buscarComboBoxInstituicaoFonte()
      .subscribe(response => {
        this.listaInstituicaoFonte = response as ItemCombo[];
      });
  }

  carregarVariavel(){
    if(!this.variavelCompleta.id){
      this.variavelService.buscarVariavelCompletaId(this.variavel.id).subscribe(res => {
        this.variavelCompleta = res;
        this.configurarFormularioNaoPreenchido();
        if(this.variavelCompleta.tipo === 'Tipo sim/não' ||
            this.variavelCompleta.tipo === 'Tipo sim/não com lista de opções' ){             
              this.formVariavel.controls.respostaSimples.setValue(false);
            } 
      });
      if(this.idSubdivisao){
        this.variavelPreenchidaService.seriePreenchidaSubdivisao(this.variavel.id, this.idSubdivisao).subscribe(res => {
          this.serieHistorica = res;
        });
      } else {
        this.variavelPreenchidaService.seriePreenchida(this.variavel.id).subscribe(res => {
          this.serieHistorica = res;
        });
      }

    }
  }

  configurarFormularioNaoPreenchido() {
    if (this.variavelCompleta.instancia != null && this.variavelCompleta.instancia != undefined) {
      this.formVariavel.controls["instancia"].setValidators([Validators.required])
    }
    if (this.variavelCompleta.orgao != null && this.variavelCompleta.orgao != undefined) {
      this.formVariavel.controls["orgao"].setValidators([Validators.required])
    }

    if(this.variavelCompleta.tipo === 'Tipo sim/não') {             
      this.formVariavel.controls.respostaSimples.setValue(false);
      this.formVariavel.controls["opcao"].setValidators([Validators.required])
      this.formVariavel.controls["valor"].setValidators([])
    } 
    else if (this.variavelCompleta.tipo === 'Tipo sim/não com lista de opções') {
      this.formVariavel.controls["opcoes"].setValidators([Validators.required])
      this.formVariavel.controls["opcao"].setValidators([Validators.required])
      this.formVariavel.controls["valor"].setValidators([])
    }
    else if (this.variavelCompleta.tipo === 'Tipo lista de opções') {
      this.formVariavel.controls["opcoes"].setValidators([Validators.required])
      this.formVariavel.controls["valor"].setValidators([])
    }
    else {
      this.formVariavel.controls["valor"].setValidators([Validators.required])
    }

  }

  changeSlide() {
    this.labelSlider = this.labelSlider === 'Não' ? 'Sim' : 'Não';
    if (this.variavelCompleta.tipo === 'Tipo sim/não com lista de opções') {
    }
  }
  public instituicaoFonteSelecionado(event: any) {
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



  public instanciaSelecionado(event: any) {
    if (event === 4 || event === 5 || event === 6) {
      this.exibirListaNomeDoOrgao = false;
      this.orgaoService.buscarComboBoxOrgao(event).subscribe(response => {
        this.listaOrgao = response as ItemCombo[];
      });
    } else {
      this.exibirListaNomeDoOrgao = true;
    }
  }

  carregarAnos(){
    let hoje = new Date();
    let anoAtual = hoje.getFullYear()-1;
    let i = 0;
    while ( anoAtual - i > 1990 ) {
      let ano = anoAtual - (i++);
      this.anos.push(ano);
    }
  }

  carregarVariavelPreenchida(){
    let ano = this.formVariavel.controls.ano.value;
    if(this.idSubdivisao){
      this.variavelPreenchidaService.buscarVariavelPreenchidalAnoSubdivisao(ano, this.variavel.id, this.idSubdivisao).subscribe(res => {
        this.configurarFormulario(res);
      });
    } else {
      this.variavelPreenchidaService.buscarVariavelPreenchidalAno(ano, this.variavel.id).subscribe(res => {
        this.configurarFormulario(res);
      });
    }
  }

  configurarFormulario(response){
    let vp: any = response;
    this.formVariavel.controls.ano.setValue(vp.ano);
    this.formVariavel.controls.fonte.setValue(vp.fonte);
    this.formVariavel.controls.observacao.setValue(vp.observacao);

    if (this.variavelCompleta.instancia != null && this.variavelCompleta.instancia != undefined) {
      this.formVariavel.controls["instancia"].setValidators([Validators.required])
    }
    if (this.variavelCompleta.orgao != null && this.variavelCompleta.orgao != undefined) {
      this.formVariavel.controls["orgao"].setValidators([Validators.required])
    }
    switch (this.variavelCompleta.tipo) {
      case 'Numérico inteiro':
        this.formVariavel.controls.valor.setValue((vp.valor));
        this.formVariavel.controls["valor"].setValidators([Validators.required])
        this.formVariavel.controls.valor.updateValueAndValidity();
        break;
      case 'Numérico decimal':
        this.formVariavel.controls.valor.setValue((vp.valor.toLocaleString('pt-BR').replace('.','')));
        this.formVariavel.controls["valor"].setValidators([Validators.required])
        this.formVariavel.controls.valor.updateValueAndValidity();
        break;
      case 'Texto livre':
        this.formVariavel.controls.valor.setValue(vp.valorTexto);
        this.formVariavel.controls["valor"].setValidators([Validators.required])
        this.formVariavel.controls.valor.updateValueAndValidity();
        break;
      case 'Tipo sim/não':
        this.formVariavel.controls.respostaSimples.setValue(vp.respostaSimples);
        this.labelSlider = Boolean(vp.respostaSimples) === true ? 'Sim' : 'Não';
        this.formVariavel.controls["opcao"].setValidators([Validators.required])
        this.formVariavel.controls["valor"].setValidators([])
        break;

      case 'Tipo sim/não com lista de opções':
        this.formVariavel.controls.respostaSimples.setValue(vp.respostaSimples);
        this.labelSlider = Boolean(vp.respostaSimples) === true ? 'Sim' : 'Não';
        if(this.variavelCompleta.multiplaSelecao){
          this.formVariavel.controls.opcoes.setValue(vp.idOpcoes);
          this.formVariavel.controls["opcao"].setValidators([Validators.required])
          this.formVariavel.controls["opcoes"].setValidators([Validators.required])
          this.formVariavel.controls["valor"].setValidators([])
          this.formVariavel.controls.opcoes.updateValueAndValidity();
        } else {
          this.formVariavel.controls.opcao.setValue(vp.idOpcao);
          this.formVariavel.controls.opcao.updateValueAndValidity();
        }
        break;

      case 'Tipo lista de opções':
        if(this.variavelCompleta.multiplaSelecao){
          this.formVariavel.controls.opcoes.setValue(vp.idOpcoes);
          this.formVariavel.controls["opcoes"].setValidators([Validators.required])
          this.formVariavel.controls["valor"].setValidators([])
          this.formVariavel.controls.opcoes.updateValueAndValidity();
        } else {
          this.formVariavel.controls.opcao.setValue(vp.idOpcao);
          this.formVariavel.controls.opcao.updateValueAndValidity();
        }
        break;

      default:
        break;
    }
  }

  salvarPreenchimento(){
    if(this.formVariavel.valid) {
      let dto: VariaveisPreenchidas = new VariaveisPreenchidas();
      let form: any = this.formVariavel.value;
      dto.idVariavel = this.variavelCompleta.id;
      dto.ano = form.ano;
      dto.fonte = form.fonte;
      dto.fonteTexto = form.fonteTexto;
      dto.idOpcao = form.opcao;
      dto.idOpcoes = form.opcoes;
      dto.instancia = form.instancia;
      dto.observacao = form.observacao;
      dto.orgao = form.orgao;
      dto.respostaSimples = form.respostaSimples;
      dto.subdivisao = this.idSubdivisao;
      if(this.variavelCompleta.tipo === 'Numérico inteiro' || this.variavelCompleta.tipo === 'Numérico decimal'){
        dto.valor = form.valor;
      }
      if(this.variavelCompleta.tipo === 'Texto livre'){
          dto.valorTexto = form.valor;
      }
  
      this.variavelPreenchidaService.preencher(dto).subscribe(res => {
        PcsUtil.swal()
          .fire({
            title: "Sucesso!",
            text: `A variável ${this.variavelCompleta.nome} foi preenchida.`,
            type: "success",
            showCancelButton: false,
            confirmButtonText: "Ok"
          })
          .then(result => {
            this.carregarAnos();
            this.carregarVariavel();
            this.carregarVariavelPreenchida();
            this.instituicaoFonteService
              .buscarComboBoxInstituicaoFonte()
              .subscribe(response => {
                this.listaInstituicaoFonte = response as ItemCombo[];
              });
  
              if(this.idSubdivisao){
                this.variavelPreenchidaService.seriePreenchidaSubdivisao(this.variavel.id, this.idSubdivisao).subscribe(res => {
                  this.serieHistorica = res;
                });
              } else {
                this.variavelPreenchidaService.seriePreenchida(this.variavel.id).subscribe(res => {
                  this.serieHistorica = res;
                });
              }
  
            this.foiPreenchido.emit({variavel : this.variavelCompleta.id,
                                      ano : this.formVariavel.controls.ano.value});
          }, error => {});
      });
    } else {
      this.verificaValidacoesForm(this.formVariavel);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);

      controle.markAsDirty();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  verificaValidTouched(campo): boolean{
    return !this.formVariavel.get(campo).valid && (this.formVariavel.get(campo).touched || this.formVariavel.get(campo).dirty);
  }
}
