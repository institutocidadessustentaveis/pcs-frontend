import { InstituicaoFonteService } from './../../../services/instituicao-fonte.service';
import { InstituicaoFonte } from './../../../model/instituicao-fonte';
import { Indicador } from 'src/app/model/indicadores';
import { Component, OnInit, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { VariaveisPreenchidas } from 'src/app/model/variaveis-preenchidas';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';
import { IndicadoresPreenchidos } from 'src/app/model/indicadores-preenchidos';
import { VariaveisOpcoes } from 'src/app/model/variaveis-opcoes';
import { Prefeitura } from 'src/app/model/prefeitura';
import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';
import { SubdivisaoService } from 'src/app/services/subdivisao.service';
import { SlugifyPipe } from 'src/app/components/slugify/slugify.pipe';

export class IndicadoresPreenchidosDTO {
  indicador: Indicador;
  preenchidos: Array<IndicadoresPreenchidos>;
  variaveisPreenchidasPorAno: VariaveisPreenchidasPorAnoDTO;
}

export class VariaveisPreenchidasPorAnoDTO {
  variaveisPreenchidas: Map<Number, VariaveisPreenchidas>;
}

export class VariaveisPreenchidasDTO {
  id?: Number;
  idVariavel?: Number;
  ano: Number;
  nome: string;
  nomeVariavel: string;
  descricao: string;
  tipo: string;
  valor: string;
  valorTexto: string;
  respostaSimples?: boolean;
  idOpcao: Number;
  fonte: Number;
  instancia: Number;
  orgao: Number;
  idOpcoes: number;
  observacao: string;
  listaOpcoes: Array<VariaveisOpcoes>;
  dataPreenchimento: Date;
  status: string;
  multiplaSelecao: boolean;
  fonteTexto: string;
}

export class VariaveisPreenchidasSimplesDTO {
  id?: Number;
  idVariavel?: Number;
  ano: Number;
  nomeVariavel: string;
  valor: string;
  status: string;
}

export class AlertaValorDTO {
  idVariavel: Number;
  anoAtual: Number;
  anoAnterior: Number;
  valorReferencia: number;
  valorMenor: number;
  valorMaior: number;
}

@Component({
  selector: 'app-preenchimento-indicadores',
  templateUrl: './preenchimento-indicadores.component.html',
  styleUrls: ['./preenchimento-indicadores.component.css']
})
export class PreenchimentoIndicadoresComponent implements OnInit {
  formPreencherIndicador: FormGroup;
  loading: boolean;
  anoReferenciaSelecionado: string;
  countListaVariavel: number;
  idIndicadorPreenchido: Number;
  idCidade: number;
  anoInicial: number;
  anoFinal: number;
  idIndicador: number;
  idSubdivisao: number;

  // Variável Objeto
  indicador: Indicador;

  // Variável Lista
  listaAnoReferencia = new Array<String>();
  objetoIndicadorDTO: IndicadoresPreenchidosDTO = new IndicadoresPreenchidosDTO();
  listaVariavel: Array<VariaveisPreenchidasDTO> = new Array<
    VariaveisPreenchidasDTO
  >();
  listaAlerta: Array<AlertaValorDTO> = new Array<AlertaValorDTO>();
  variavelPreenchida: VariaveisPreenchidasSimplesDTO[];

  // Variável Checkbox && Slider
  chkDadosIndicador = false;

  // Variável Exibir
  exibirJustificativa = false;
  scrollUp: any;
  subdivisao: any;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    private element: ElementRef,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public indicadorService: IndicadoresService,
    public indicadoresPreenchidosService: IndicadoresPreenchidosService,
    public subdivisaoService: SubdivisaoService,
    private variavelPreenchidaService: VariavelPreenchidaService
    ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.formPreencherIndicador = this.formBuilder.group({
      id: [''],
      idIndicador: [''],
      nome: [''],
      descricao: [''],
      Ods: [''],
      formulaResultado: [''],
      anoReferencia: [''],
      justificativa: ['']
    });
  }

  ngOnInit() {
    this.loading = true;
    this.buscarIndicador();
    localStorage.removeItem('JustificativaRequired');
    localStorage.removeItem('ListaVariavelPreenchida');
    if (localStorage.getItem('JustificativaRequired') === null) {
      localStorage.setItem(
        "JustificativaRequired",
        JSON.stringify(this.exibirJustificativa)
      );
    }
    this.dadosIdCidade();
    this.ListarPorIndicadorAndCidade(this.idIndicador, this.idCidade);
  }

  public buscarIndicador() {
    let variaveisPreenchidasDTO = new VariaveisPreenchidasDTO();
    const anoAtual = new Date().getFullYear() - 1;
    const anoAnterior = new Date().getFullYear() - 2;
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      const subdivisao = params.subdivisao;
      this.idIndicador = id;
      this.idSubdivisao = subdivisao;
      this.carregarListaReferencia();
      if(subdivisao){
        this.carregarSubdivisao();
        this.indicadoresPreenchidosService
        .buscarIndicadorPreenchidoSubdivisao(id,subdivisao)
        .subscribe(response => {
          this.configurarResponse(response, variaveisPreenchidasDTO, anoAtual, anoAnterior)
        });
      } else {
        this.indicadoresPreenchidosService
        .buscarIndicadorPreenchido(id)
        .subscribe(response => {
          this.configurarResponse(response, variaveisPreenchidasDTO, anoAtual, anoAnterior)
        });
      }

    });
  }

  carregarSubdivisao() {
    this.subdivisaoService.buscarPorId(this.idSubdivisao).subscribe(res => {
      this.subdivisao = res;
    });
  }

  configurarResponse(response, variaveisPreenchidasDTO, anoAtual, anoAnterior ){
    this.objetoIndicadorDTO = response as IndicadoresPreenchidosDTO;
    this.formPreencherIndicador.controls['idIndicador'].setValue(
      this.objetoIndicadorDTO.indicador.id
    );
    this.formPreencherIndicador.controls['nome'].setValue(
      this.objetoIndicadorDTO.indicador.nome
    );
    this.formPreencherIndicador.controls['descricao'].setValue(
      this.objetoIndicadorDTO.indicador.descricao
    );
    this.formPreencherIndicador.controls['Ods'].setValue(
      this.objetoIndicadorDTO.indicador.ods ? this.objetoIndicadorDTO.indicador.ods.titulo : ''
    );
    this.formPreencherIndicador.controls['formulaResultado'].setValue(
      this.objetoIndicadorDTO.indicador.formula_resultado
    );
    if (
      response.preenchidos !== null &&
      response.preenchidos !== undefined &&
      response.preenchidos.length !== 0
    ) {
      if (
        this.objetoIndicadorDTO.preenchidos.filter(
          x => x.ano === Number(anoAtual)
        ).length > 0
      ) {
        this.idIndicadorPreenchido = this.objetoIndicadorDTO.preenchidos.find(
          x => x.idIndicador === this.objetoIndicadorDTO.indicador.id
        ).id;
        this.formPreencherIndicador.controls['justificativa'].setValue(
          this.objetoIndicadorDTO.preenchidos.find(
            x => x.idIndicador === this.objetoIndicadorDTO.indicador.id
          ).justificativa
        );
      } else {
        this.idIndicadorPreenchido = null;
        this.formPreencherIndicador.controls['justificativa'].setValue(
          ''
        );
      }
      this.exibirJustificativa =
        this.formPreencherIndicador.controls['justificativa'].value !==
          null &&
        this.formPreencherIndicador.controls['justificativa'].value !==
          undefined &&
        this.formPreencherIndicador.controls['justificativa'].value !== ''
          ? true
          : false;
      this.chkDadosIndicador = this.exibirJustificativa;
    }
    const preenchidasAnoAtual = this.objetoIndicadorDTO
      .variaveisPreenchidasPorAno.variaveisPreenchidas[anoAtual] as Array<
      VariaveisPreenchidas
    >;
    const preenchidasAnoAnterior = this.objetoIndicadorDTO
      .variaveisPreenchidasPorAno.variaveisPreenchidas[
      anoAnterior
    ] as Array<VariaveisPreenchidas>;
    if (
      preenchidasAnoAtual !== null &&
      preenchidasAnoAtual !== undefined
    ) {
      for (const itemVariavel of this.objetoIndicadorDTO.indicador
        .variaveis) {
        if (
          preenchidasAnoAtual.filter(
            x => x.idVariavel === itemVariavel.id
          ).length > 0
        ) {
          variaveisPreenchidasDTO = new VariaveisPreenchidasDTO();
          variaveisPreenchidasDTO.multiplaSelecao =
            itemVariavel.multiplaSelecao;
          variaveisPreenchidasDTO.id = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).id;
          variaveisPreenchidasDTO.idVariavel = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).idVariavel;
          variaveisPreenchidasDTO.nome = itemVariavel.nome;
          variaveisPreenchidasDTO.descricao = itemVariavel.descricao;
          variaveisPreenchidasDTO.tipo = itemVariavel.tipo;
          variaveisPreenchidasDTO.fonte = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).fonte;
          variaveisPreenchidasDTO.observacao = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).observacao;
          variaveisPreenchidasDTO.valor = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).valor;
          variaveisPreenchidasDTO.valorTexto = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).valorTexto;
          variaveisPreenchidasDTO.respostaSimples = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).respostaSimples;
          variaveisPreenchidasDTO.idOpcao = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).idOpcao;
          variaveisPreenchidasDTO.idOpcoes = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).idOpcoes;
          variaveisPreenchidasDTO.listaOpcoes =
            itemVariavel.variavelResposta.listaOpcoes;
          this.listaVariavel.push(variaveisPreenchidasDTO);
          if (
            preenchidasAnoAnterior !== null &&
            preenchidasAnoAnterior !== undefined &&
            itemVariavel.tipo.trim().toUpperCase() !== 'TEXTO LIVRE'
          ) {
            const variavelAlerta = preenchidasAnoAnterior.find(
              x => x.idVariavel === itemVariavel.id
            );
            if (variavelAlerta && variavelAlerta != null ) {
              this.listaAlerta.push(
                this.calculoAlertaValor(
                  itemVariavel.id,
                  anoAtual,
                  anoAnterior,
                  variavelAlerta.valor
                )
              );
            }
          }
        } else {
          variaveisPreenchidasDTO = new VariaveisPreenchidasDTO();
          variaveisPreenchidasDTO.multiplaSelecao =
            itemVariavel.multiplaSelecao;
          variaveisPreenchidasDTO.id = null;
          variaveisPreenchidasDTO.idVariavel = itemVariavel.id;
          variaveisPreenchidasDTO.nome = itemVariavel.nome;
          variaveisPreenchidasDTO.descricao = itemVariavel.descricao;
          variaveisPreenchidasDTO.tipo = itemVariavel.tipo;
          variaveisPreenchidasDTO.fonte = null;
          variaveisPreenchidasDTO.observacao = '';
          variaveisPreenchidasDTO.valor = '';
          variaveisPreenchidasDTO.valorTexto = '';
          variaveisPreenchidasDTO.respostaSimples = false;
          variaveisPreenchidasDTO.idOpcao = 0;
          variaveisPreenchidasDTO.idOpcoes = null;
          variaveisPreenchidasDTO.listaOpcoes =
            itemVariavel.variavelResposta.listaOpcoes;
          this.listaVariavel.push(variaveisPreenchidasDTO);
          if (
            preenchidasAnoAnterior !== null &&
            preenchidasAnoAnterior !== undefined &&
            itemVariavel.tipo.trim().toUpperCase() !== 'TEXTO LIVRE'
          ) {
            const variavelAlerta = preenchidasAnoAnterior.find(
              x => x.idVariavel === itemVariavel.id
            );
            if (variavelAlerta && variavelAlerta != null ) {
              this.listaAlerta.push(
                this.calculoAlertaValor(
                  itemVariavel.id,
                  anoAtual,
                  anoAnterior,
                  variavelAlerta.valor
                )
              );
            }
          }
        }
      }
    } else {
      for (const itemVariavel of this.objetoIndicadorDTO.indicador
        .variaveis) {

        variaveisPreenchidasDTO = new VariaveisPreenchidasDTO();
        variaveisPreenchidasDTO.multiplaSelecao =
          itemVariavel.multiplaSelecao;
        variaveisPreenchidasDTO.id = null;
        variaveisPreenchidasDTO.idVariavel = itemVariavel.id;
        variaveisPreenchidasDTO.nome = itemVariavel.nome;
        variaveisPreenchidasDTO.descricao = itemVariavel.descricao;
        variaveisPreenchidasDTO.tipo = itemVariavel.tipo;
        variaveisPreenchidasDTO.fonte = null;
        variaveisPreenchidasDTO.observacao = '';
        variaveisPreenchidasDTO.valor = '';
        variaveisPreenchidasDTO.valorTexto = '';
        variaveisPreenchidasDTO.respostaSimples = false;
        variaveisPreenchidasDTO.idOpcao = 0;
        variaveisPreenchidasDTO.idOpcoes = null;
        variaveisPreenchidasDTO.listaOpcoes =
          itemVariavel.variavelResposta.listaOpcoes;
        this.listaVariavel.push(variaveisPreenchidasDTO);
        if (
          preenchidasAnoAnterior !== null &&
          preenchidasAnoAnterior !== undefined &&
          itemVariavel.tipo.trim().toUpperCase() !== 'TEXTO LIVRE'
        ) {
          const variavelAlerta = preenchidasAnoAnterior.find(
            x => x.idVariavel === itemVariavel.id
          );
          if (variavelAlerta && variavelAlerta != null ) {
            this.listaAlerta.push(
              this.calculoAlertaValor(
                itemVariavel.id,
                anoAtual,
                anoAnterior,
                variavelAlerta.valor
              )
            );
          }
        }
      }
    }
    this.countListaVariavel = this.listaVariavel.length;
    this.anoReferenciaSelecionado = (
      new Date().getFullYear() - 1
    ).toString();
    this.loading = false;
  }

  adicionaRequired() {
    this.formPreencherIndicador.controls.justificativa.setValidators([
      Validators.minLength(20),
      Validators.maxLength(200),
      Validators.required
    ]);
    this.formPreencherIndicador.controls.justificativa.updateValueAndValidity();
  }

  removeRequired() {
    this.formPreencherIndicador.controls.justificativa.setValidators([]);
    this.formPreencherIndicador.controls.justificativa.updateValueAndValidity();
  }

  checkboxDadosIndicador(value) {
    if (Boolean(value) === false) {
      this.chkDadosIndicador = true;
      this.exibirJustificativa = true;
      this.formPreencherIndicador.controls['justificativa'].reset();
      this.adicionaRequired();
    } else {
      this.chkDadosIndicador = false;
      this.exibirJustificativa = false;
      this.formPreencherIndicador.controls['justificativa'].reset();
      this.removeRequired();
    }
    localStorage.setItem(
      'JustificativaRequired',
      JSON.stringify(this.exibirJustificativa)
    );
  }

  async salvar() {
    const listaVariavelPreenchidaDTO: Array<VariaveisPreenchidasDTO> = new Array<
      VariaveisPreenchidasDTO
    >();
    let parametros:any ={indicador: new SlugifyPipe().transform(this.objetoIndicadorDTO.indicador.nome)};

    this.loading = true;
    if (this.validarListaVariavelPreenchida() === true) {
      const indicadorPreenchido = new IndicadoresPreenchidos();
      indicadorPreenchido.id = this.idIndicadorPreenchido;
      indicadorPreenchido.idIndicador = this.formPreencherIndicador.controls[
        'idIndicador'
      ].value;
      indicadorPreenchido.ano = Number(this.anoReferenciaSelecionado);
      indicadorPreenchido.justificativa = this.formPreencherIndicador.controls[
        'justificativa'
      ].value;
      if (Boolean(this.exibirJustificativa) === false) {
        indicadorPreenchido.variaveisPreenchidas = JSON.parse(
          localStorage.getItem("ListaVariavelPreenchida")
        ) as Array<VariaveisPreenchidas>;
      }
      if(this.idSubdivisao){
        parametros.subdivisao = new SlugifyPipe().transform(this.subdivisao.nome);
        indicadorPreenchido.variaveisPreenchidas = indicadorPreenchido.variaveisPreenchidas != null ? indicadorPreenchido.variaveisPreenchidas : new Array<any>();
        this.indicadoresPreenchidosService
          .inserirSubdivisao(indicadorPreenchido, this.idSubdivisao)
          .subscribe(
            response => {
              const obj: any = response;
              PcsUtil.swal()
                .fire({
                  title: 'Preenchimento de indicadores',
                  text: `Indicador ${this.formPreencherIndicador.controls['nome'].value} cadastrado`,
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Ok'
                })
                .then(
                  result => {
                    this.loading = false;
                    localStorage.removeItem('JustificativaRequired');
                    localStorage.removeItem('ListaVariavelPreenchida');
                    this.router.navigate([`/indicadores-para-preencher`],{queryParams: parametros});
                  },
                  error => {
                    this.loading = false;
                  }
                );
            },
            error => {
              this.loading = false;
            }
          );
      } else if ( this.idIndicadorPreenchido === undefined || this.idIndicadorPreenchido === null ) {
        indicadorPreenchido.variaveisPreenchidas = indicadorPreenchido.variaveisPreenchidas != null ? indicadorPreenchido.variaveisPreenchidas : new Array<any>();
        this.indicadoresPreenchidosService
          .inserir(indicadorPreenchido)
          .subscribe(
            response => {
              const obj: any = response;
              PcsUtil.swal()
                .fire({
                  title: 'Preenchimento de indicadores',
                  text: `Indicador ${this.formPreencherIndicador.controls['nome'].value} cadastrado`,
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Ok'
                })
                .then(
                  result => {
                    this.loading = false;
                    localStorage.removeItem('JustificativaRequired');
                    localStorage.removeItem('ListaVariavelPreenchida');
                    this.router.navigate([`/indicadores-para-preencher`],{queryParams: parametros});
                  },
                  error => {
                    this.loading = false;
                  }
                );
            },
            error => {
              this.loading = false;
            }
          );
      } else {
        indicadorPreenchido.variaveisPreenchidas = indicadorPreenchido.variaveisPreenchidas != null ? indicadorPreenchido.variaveisPreenchidas : new Array<any>();
        await this.indicadoresPreenchidosService
          .editar(indicadorPreenchido)
          .subscribe(
            response => {
              PcsUtil.swal()
                .fire({
                  title: 'Preenchimento de indicadores',
                  text: `Indicador ${this.formPreencherIndicador.controls['nome'].value} atualizado.`,
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'Ok'
                })
                .then(
                  result => {
                    this.loading = false;
                    localStorage.removeItem('JustificativaRequired');
                    localStorage.removeItem('ListaVariavelPreenchida');
                    this.router.navigate([`/indicadores-para-preencher`],{queryParams: parametros});
                  },
                  error => {
                    this.loading = false;
                  }
                );
            },
            error => {
              this.loading = false;
            }
          );
      }
    }
  }

  getJustificativa() {
    return this.formPreencherIndicador.get('justificativa').hasError('required')
      ? 'Campo justificativa é obrigatório'
      : this.formPreencherIndicador.get('justificativa').hasError('minlength')
      ? 'Campo justificativa deve conter ao menos 20 dígitos'
      : this.formPreencherIndicador.get('justificativa').hasError('maxlength')
      ? 'Campo justificativa deve conter no máximo 200 dígitos'
      : '';
  }

  carregarListaReferencia() {
    const sessionPrefeitura = JSON.parse(localStorage.getItem('usuarioLogado'));
    const dadosPrefeitura: Prefeitura = sessionPrefeitura.dadosPrefeitura;
    const inicioMandato = 2005; // new Date(dadosPrefeitura.inicioMandato).getUTCFullYear();
    const fimMandato: number = new Date(
      dadosPrefeitura.fimMandato
    ).getUTCFullYear();
    const countAnosMandato: number = fimMandato - inicioMandato;
    for (let i = 0; i <= countAnosMandato; i++) {
      if (inicioMandato + i < new Date().getFullYear()) {
        this.listaAnoReferencia.push((inicioMandato + i).toString());
      }
    }

    if (this.listaAnoReferencia.length === 0) {
      this.router.navigate(['/indicadores-para-preencher']);
      PcsUtil.swal()
        .fire({
          title: 'Preenchimento de indicadores',
          text: `Não há indicadores de anos anteriores a serem preenchidos`,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok'
        })
        .then(result => {}, error => {});
    }
  }

  validarListaVariavelPreenchida(): Boolean {
    const listaVariavelPreenchida: Array<VariaveisPreenchidasDTO> = JSON.parse(
      localStorage.getItem('ListaVariavelPreenchida')
    );
    let formularioValido = true;
    let mensagemErro = '';

    if (this.exibirJustificativa === false) {
      if (listaVariavelPreenchida !== null) {
        for (const itemVariavelPreenchida of listaVariavelPreenchida) {
          if (
            (itemVariavelPreenchida.valor === null ||
              itemVariavelPreenchida.valor === '' ||
              itemVariavelPreenchida.valor === undefined) &&
            (itemVariavelPreenchida.valorTexto === null ||
              itemVariavelPreenchida.valorTexto === '' ||
              itemVariavelPreenchida.valorTexto === undefined) &&
            (this.listaVariavel.filter(
              x => x.idVariavel === itemVariavelPreenchida.idVariavel
            )[0].tipo !== 'Tipo lista de opções' &&
              this.listaVariavel.filter(
                x => x.idVariavel === itemVariavelPreenchida.idVariavel
              )[0].tipo !== 'Tipo sim/não com lista de opções' &&
              this.listaVariavel.filter(
                x => x.idVariavel === itemVariavelPreenchida.idVariavel
              )[0].tipo !== 'Tipo sim/não')
          ) {
            mensagemErro =
              'Campo valor da ' +
              this.listaVariavel.find(
                x => x.idVariavel === itemVariavelPreenchida.idVariavel
              ).nome +
              ' deve ser preenchido!';
            formularioValido = false;
          } else if (
            (itemVariavelPreenchida.fonte === null ||
              itemVariavelPreenchida.fonte === undefined) &&
            (itemVariavelPreenchida.fonteTexto === null ||
              itemVariavelPreenchida.fonteTexto === undefined)
          ) {
            mensagemErro =
              'Campo fonte da ' +
              this.listaVariavel.find(
                x => x.idVariavel === itemVariavelPreenchida.idVariavel
              ).nome +
              ' deve ser preenchido!';
            formularioValido = false;
          } else if (
            itemVariavelPreenchida.fonteTexto === 'Outra fonte' ||
            itemVariavelPreenchida.fonteTexto === 'outra fonte'
          ) {
            mensagemErro =
              'Campo fonte da ' +
              this.listaVariavel.find(
                x => x.idVariavel === itemVariavelPreenchida.idVariavel
              ).nome +
              ' deve ser diferente!';
            formularioValido = false;
          }
          if (formularioValido === false) {
            PcsUtil.swal()
              .fire({
                title: 'Preenchimento de indicadores',
                text: `${mensagemErro} `,
                type: 'warning',
                showCancelButton: false,
                confirmButtonText: 'Ok'
              })
              .then(
                result => {
                  this.loading = false;
                },
                error => {
                  this.loading = false;
                }
              );
            return formularioValido;
          }
        }
      }
    }
    return formularioValido;
  }

  habilitarBotaoSalvar(): boolean {
    let listaVariavelPreenchida: Array<VariaveisPreenchidasDTO> = new Array<
      VariaveisPreenchidasDTO
    >();
    if (Boolean(this.exibirJustificativa) === false) {
      if (
        localStorage.getItem('ListaVariavelPreenchida') !== null &&
        localStorage.getItem('ListaVariavelPreenchida') !== undefined
      ) {
        listaVariavelPreenchida = JSON.parse(
          localStorage.getItem("ListaVariavelPreenchida")
        );
      }
      if (
        this.formPreencherIndicador.valid === true &&
        this.countListaVariavel === listaVariavelPreenchida.length
      ) {
        return false;
      } else { return true; }
    } else if (
      this.formPreencherIndicador.valid === true &&
      this.exibirJustificativa === true
    ) {
      return false;
           }
    else { return true; }
  }

  tradeAno(anoReferencia: Number) {
    localStorage.removeItem('ListaVariavelPreenchida');
    this.loading = true;
    this.listaVariavel = new Array<VariaveisPreenchidasDTO>();
    this.listaAlerta = new Array<AlertaValorDTO>();
    let variaveisPreenchidasDTO = new VariaveisPreenchidasDTO();
    const anoAtual = parseInt(anoReferencia.toString());
    const anoAnterior = parseInt(anoReferencia.toString()) - 1;
    if (
      this.objetoIndicadorDTO.preenchidos.filter(
        x => x.ano === Number(anoReferencia)
      ).length > 0
    ) {
      this.idIndicadorPreenchido = this.objetoIndicadorDTO.preenchidos.find(
        x => x.idIndicador === this.objetoIndicadorDTO.indicador.id
      ).id;
      this.formPreencherIndicador.controls['justificativa'].setValue(
        this.objetoIndicadorDTO.preenchidos.find(
          x => x.idIndicador === this.objetoIndicadorDTO.indicador.id
        ).justificativa
      );
    } else {
      this.idIndicadorPreenchido = null;
      this.formPreencherIndicador.controls['justificativa'].setValue('');
    }
    this.exibirJustificativa =
      this.formPreencherIndicador.controls['justificativa'].value !== null &&
      this.formPreencherIndicador.controls['justificativa'].value !==
        undefined &&
      this.formPreencherIndicador.controls['justificativa'].value !== ''
        ? true
        : false;
    const preenchidasAnoAtual = this.objetoIndicadorDTO.variaveisPreenchidasPorAno
      .variaveisPreenchidas[anoAtual] as Array<VariaveisPreenchidas>;
    const preenchidasAnoAnterior = this.objetoIndicadorDTO
      .variaveisPreenchidasPorAno.variaveisPreenchidas[anoAnterior] as Array<
      VariaveisPreenchidas
    >;
    if (preenchidasAnoAtual !== null && preenchidasAnoAtual !== undefined) {
      for (const itemVariavel of this.objetoIndicadorDTO.indicador.variaveis) {
        if (
          preenchidasAnoAtual.filter(x => x.idVariavel === itemVariavel.id)
            .length > 0
        ) {
          variaveisPreenchidasDTO = new VariaveisPreenchidasDTO();
          variaveisPreenchidasDTO.id = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).id;
          variaveisPreenchidasDTO.idVariavel = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).idVariavel;
          variaveisPreenchidasDTO.nome = itemVariavel.nome;
          variaveisPreenchidasDTO.descricao = itemVariavel.descricao;
          variaveisPreenchidasDTO.tipo = itemVariavel.tipo;
          variaveisPreenchidasDTO.fonte = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).fonte;
          variaveisPreenchidasDTO.observacao = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).observacao;
          variaveisPreenchidasDTO.valor = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).valor;
          variaveisPreenchidasDTO.valorTexto = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).valorTexto;
          variaveisPreenchidasDTO.respostaSimples = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).respostaSimples;
          variaveisPreenchidasDTO.idOpcao = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).idOpcao;
          variaveisPreenchidasDTO.idOpcoes = preenchidasAnoAtual.find(
            x => x.idVariavel === itemVariavel.id
          ).idOpcoes;
          variaveisPreenchidasDTO.listaOpcoes =
            itemVariavel.variavelResposta.listaOpcoes;
          variaveisPreenchidasDTO.multiplaSelecao =
            itemVariavel.multiplaSelecao;

          this.listaVariavel.push(variaveisPreenchidasDTO);
          if (
            preenchidasAnoAnterior !== null &&
            preenchidasAnoAnterior !== undefined &&
            itemVariavel.tipo.trim().toUpperCase() !== 'TEXTO LIVRE'
          ) {
            const variavelAlerta = preenchidasAnoAnterior.find(
              x => x.idVariavel === itemVariavel.id
            );
            if (variavelAlerta && variavelAlerta != null ) {
              this.listaAlerta.push(
                this.calculoAlertaValor(
                  itemVariavel.id,
                  anoAtual,
                  anoAnterior,
                  variavelAlerta.valor
                )
              );
            }
          }
        } else {
          variaveisPreenchidasDTO = new VariaveisPreenchidasDTO();
          variaveisPreenchidasDTO.id = null;
          variaveisPreenchidasDTO.idVariavel = itemVariavel.id;
          variaveisPreenchidasDTO.nome = itemVariavel.nome;
          variaveisPreenchidasDTO.descricao = itemVariavel.descricao;
          variaveisPreenchidasDTO.tipo = itemVariavel.tipo;
          variaveisPreenchidasDTO.fonte = null;
          variaveisPreenchidasDTO.observacao = '';
          variaveisPreenchidasDTO.valor = '';
          variaveisPreenchidasDTO.valorTexto = '';
          variaveisPreenchidasDTO.respostaSimples = false;
          variaveisPreenchidasDTO.idOpcao = 0;
          variaveisPreenchidasDTO.idOpcoes = null;
          variaveisPreenchidasDTO.listaOpcoes =
            itemVariavel.variavelResposta.listaOpcoes;
          variaveisPreenchidasDTO.multiplaSelecao =
            itemVariavel.multiplaSelecao;
          this.listaVariavel.push(variaveisPreenchidasDTO);
          if (
            preenchidasAnoAnterior !== null &&
            preenchidasAnoAnterior !== undefined &&
            itemVariavel.tipo.trim().toUpperCase() !== 'TEXTO LIVRE'
          ) {
            const variavelAlerta = preenchidasAnoAnterior.find(
              x => x.idVariavel === itemVariavel.id
            );
            if (variavelAlerta && variavelAlerta != null ) {
              this.listaAlerta.push(
                this.calculoAlertaValor(
                  itemVariavel.id,
                  anoAtual,
                  anoAnterior,
                  variavelAlerta.valor
                )
              );
            }
          }
        }
      }
    } else {
      for (const itemVariavel of this.objetoIndicadorDTO.indicador.variaveis) {
        variaveisPreenchidasDTO = new VariaveisPreenchidasDTO();
        variaveisPreenchidasDTO.id = null;
        variaveisPreenchidasDTO.idVariavel = itemVariavel.id;
        variaveisPreenchidasDTO.nome = itemVariavel.nome;
        variaveisPreenchidasDTO.descricao = itemVariavel.descricao;
        variaveisPreenchidasDTO.tipo = itemVariavel.tipo;
        variaveisPreenchidasDTO.fonte = null;
        variaveisPreenchidasDTO.observacao = '';
        variaveisPreenchidasDTO.valor = '';
        variaveisPreenchidasDTO.valorTexto = '';
        variaveisPreenchidasDTO.respostaSimples = false;
        variaveisPreenchidasDTO.idOpcao = 0;
        variaveisPreenchidasDTO.idOpcoes = null;
        variaveisPreenchidasDTO.listaOpcoes =
          itemVariavel.variavelResposta.listaOpcoes;
        variaveisPreenchidasDTO.multiplaSelecao = itemVariavel.multiplaSelecao;
        this.listaVariavel.push(variaveisPreenchidasDTO);
        if (
          preenchidasAnoAnterior !== null &&
          preenchidasAnoAnterior !== undefined &&
          itemVariavel.tipo.trim().toUpperCase() !== 'TEXTO LIVRE'
        ) {
          const variavelAlerta = preenchidasAnoAnterior.find(
            x => x.idVariavel === itemVariavel.id
          );
          if (variavelAlerta && variavelAlerta != null ) {
            this.listaAlerta.push(
              this.calculoAlertaValor(
                itemVariavel.id,
                anoAtual,
                anoAnterior,
                variavelAlerta.valor
              )
            );
          }
        }
      }
    }
    this.countListaVariavel = this.listaVariavel.length;
    this.anoReferenciaSelecionado = anoReferencia.toString();
    this.loading = false;
  }

  calculoAlertaValor(
    idVariavel: Number,
    anoAtual: Number,
    anoAnterior: Number,
    valorVariavelReferencia: any
  ): AlertaValorDTO {
    const alertaValorDTO: AlertaValorDTO = new AlertaValorDTO();
    alertaValorDTO.idVariavel = idVariavel;
    alertaValorDTO.anoAtual = anoAtual;
    alertaValorDTO.anoAnterior = anoAnterior;
    alertaValorDTO.valorReferencia = valorVariavelReferencia;
    alertaValorDTO.valorMenor = valorVariavelReferencia * 0.85;
    alertaValorDTO.valorMaior = valorVariavelReferencia * 1.15;
    return alertaValorDTO;
  }

  dadosIdCidade() {
    const sessionPrefeitura = JSON.parse(localStorage.getItem("usuarioLogado"));
    const dadosPrefeitura: Prefeitura = sessionPrefeitura.dadosPrefeitura;
    if (dadosPrefeitura){
      if (dadosPrefeitura.cidade) {
        this.idCidade = dadosPrefeitura.cidade.id;
      }
      if (dadosPrefeitura.inicioMandato && dadosPrefeitura.fimMandato) {
        this.anoInicial = new Date(dadosPrefeitura.inicioMandato).getUTCFullYear();
        this.anoFinal = new Date(dadosPrefeitura.fimMandato).getUTCFullYear();
      }
    }
  }

  ListarPorIndicadorAndCidade(idIndicador: number, idCidade: number){
    if(this.idSubdivisao){
      this.variavelPreenchidaService.listarPorIndicadorAndCidadeAndSubdivisao(idIndicador, idCidade,this.idSubdivisao).subscribe(res => {
        this.variavelPreenchida = res;
        this.ordenarVariavelPreenchida();
      });
    } else {
      this.variavelPreenchidaService.listarPorIndicadorAndCidade(idIndicador, idCidade).subscribe(res => {
        this.variavelPreenchida = res;
        this.ordenarVariavelPreenchida();
      });
    }
  }

  ordenarVariavelPreenchida() {
    this.variavelPreenchida.sort((a, b) => (a.ano < b.ano) ? -1 : 1);
    this.variavelPreenchida.sort((a, b) => (a.ano !== b.ano) ? 1 : (a.idVariavel < b.idVariavel) ? -1 : 1);
  }

}


