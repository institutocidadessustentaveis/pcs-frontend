import { Component, ViewChild, OnInit, ViewChildren, Input, ElementRef, TemplateRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Indicador } from 'src/app/model/indicadores';
import { Variavel } from 'src/app/model/variaveis';
import { Eixo } from 'src/app/model/eixo';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { MetaObjetivoDesenvolvimentoSustentavel } from 'src/app/model/metaObjetivoDesenvolvimentoSustentavel';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { VariavelReferencia } from 'src/app/model/variaveis-referencia';
import { CalculadoraService } from 'src/app/services/calculadora.service';
import { CalculadoraFormulaComponent } from 'src/app/components/calculadora-formula/calculadora-formula.component';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';

export interface DropDownList {
  value: number;
  viewValue: string;
}

@Component({
  selector: "app-indicadores",
  templateUrl: "./indicadores.component.html",
  styleUrls: ["./indicadores.component.css"]
})
export class IndicadoresComponent {
  displayedColumns: string[] = ["Variavel", "Remover"];
  dataSource = new MatTableDataSource<Variavel>();
  loading: any;
  formIndicador: FormGroup;
  formReferencia: FormGroup;
  formularioValido: boolean = false;
  exibirCardFormulaReferencia: boolean = false;
  exibirCardReferencia: boolean = false;
  usuario: Usuario;

  // Variaveis Objeto
  indicadorSelecionado: Indicador = new Indicador();
  variavelSelecionada: Variavel;
  eixoSelecionado: Eixo;
  odsSelecionada: ObjetivoDesenvolvimentoSustentavel;

  //Variaveis lista DropDownList
  listaEixo: Array<Eixo>;
  listaODS: Array<ObjetivoDesenvolvimentoSustentavel>;
  listaMetaODS: Array<MetaObjetivoDesenvolvimentoSustentavel>;
  listaVariaveis: Array<Variavel> = new Array<Variavel>();
  listaOrdemClassificacao: DropDownList[];
  listaTipoResultado: DropDownList[];

  //Variaveis lista Table
  listaTabelaVariaveis: Array<Variavel> = new Array<Variavel>();

  //Variaveis para validação de formulas
  formulaResultadoValida: boolean = undefined;
  formulaReferenciaValida: boolean = undefined;

  ocultarReferencia: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  scrollUp: any;

  @ViewChild('modalLoading') modalLoading: TemplateRef<any>;

  public disabledBtnSalvar = false;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    private element: ElementRef,
    public activatedRoute: ActivatedRoute,
    public indicadoresService: IndicadoresService,
    public indicadorPreenchidoService: IndicadoresPreenchidosService,
    public calculadoraService: CalculadoraService,
    public usuarioService: UsuarioService,
    public dialog: MatDialog,
  ) {
    this.formIndicador = this.formBuilder.group({
      nome: [
        "",
        [
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.required
        ]
      ],
      descricao: [
        "",
        [
          Validators.minLength(5),
          Validators.maxLength(1000),
          Validators.required
        ]
      ],
      eixo: [
        "",
        [
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.required
        ]
      ],
      Ods: [
        "",
        [
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.required
        ]
      ],
      MetaOds: [
        "",
        [
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.required
        ]
      ],
      tipoResultado: [
        "",
        [
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.required
        ]
      ],
      ordemClassificacao: [
        "",
        [
          Validators.minLength(5),
          Validators.maxLength(100),
          Validators.required
        ]
      ],
      formulaResultado: ["", [Validators.required]],
      formulaReferencia: ["", [Validators.required]],
      complementar: [false]
    });
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.formReferencia = this.formBuilder.group({
      deGreen: ["", [Validators.maxLength(20)]],
      ateGreen: ["", [Validators.maxLength(20)]],
      deYellow: ["", [Validators.maxLength(20)]],
      ateYellow: ["", [Validators.maxLength(20)]],
      deOrange: ["", [Validators.maxLength(20)]],
      ateOrange: ["", [Validators.maxLength(20)]],
      deRed: ["", [Validators.maxLength(20)]],
      ateRed: ["", [Validators.maxLength(20)]]
    });
  }

  ngOnInit() {
    this.loading = true;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length == 0 || pageSize == 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = "Primeira página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.nextPageLabel = "Próxima página";
    this.paginator._intl.lastPageLabel = "Última página";
    this.carregarUsuario();
    this.loading = false;
  }

  carregarUsuario() {
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario;
      this.carregaDados();
    })
  }

  carregaDados() {
    if (this.usuario.nomePerfil === "Administrador") {    
      this.indicadoresService.carregaVariaveisAdmin().subscribe(response => {
        this.listaVariaveis = response;
        this.organizaResultadosVariaveis();
      })
    }
    else if (this.usuario.nomePerfil.includes("Responsável pelos Indicadores")) {
      this.indicadoresService.carregaVariaveisResponsavelIndicador(this.usuario.prefeitura.id).subscribe(response => {
        this.listaVariaveis = response;
        this.organizaResultadosVariaveis();
      });
    }
  }

  organizaResultadosVariaveis() {
    this.listaOrdemClassificacao = this.indicadoresService.carregaOrdemClassificacao();
    this.listaTipoResultado = this.indicadoresService.carregaTipoResultado();
    this.indicadoresService.carregaEixo().subscribe(variaveis => {
      this.listaEixo = variaveis;
      this.buscarIndicador();
    });
  }

  isGestor() {
    let usuarioLogadoCredencial = JSON.parse(
      localStorage.getItem("usuarioLogado")
    );
    return usuarioLogadoCredencial.usuarioPrefeitura;
  }

  DisableOpcaoReferencia() {
    let usuarioLogadoCredencial = JSON.parse(
      localStorage.getItem("usuarioLogado")
    );
    this.exibirCardReferencia =
      usuarioLogadoCredencial.usuarioPrefeitura === true ? false : true;
  }

  async buscarIndicador() {
    await this.activatedRoute.params.subscribe(
      async params => {
        let id = params.id;
        this.indicadorSelecionado = new Indicador();
        this.indicadorSelecionado.referencia = new Array<VariavelReferencia>();
        this.DisableOpcaoReferencia();

        if (id) {
          await this.indicadoresService.buscarIndicadorId(id).subscribe(
            async response => {
              this.formIndicador.controls["nome"].setValue(response.nome);
              this.formIndicador.controls["descricao"].setValue(
                response.descricao
              );
              this.formIndicador.controls["eixo"].setValue(
                this.listaEixo.filter(x => x.id === response.eixo.id)[0]
              );
              this.tradeEixo(this.formIndicador.controls["eixo"].value);
              if (response.ods) {
                this.formIndicador.controls["Ods"].setValue(
                  this.listaODS.filter(x => x.id === response.ods.id)[0]
                );
                this.tradeOds(this.formIndicador.controls["Ods"].value);
              }
              if (response.metaOds) {
                this.formIndicador.controls["MetaOds"].setValue(
                  this.listaMetaODS.filter(x => x.id === response.metaOds.id)[0]
                  );
              }
              if (
                response.formula_referencia === null ||
                response.formula_referencia === undefined ||
                response.formula_referencia === ""
              ) {
                if(response.formula_resultado.includes('concat')) {
                  this.formIndicador.controls["tipoResultado"].setValue(
                    this.listaTipoResultado.filter(x => x.value === 2)[0].value
                  );
                } else {
                  this.formIndicador.controls["tipoResultado"].setValue(
                    this.listaTipoResultado.filter(x => x.value === 1)[0].value
                  );
                }
                
                this.formIndicador.controls["formulaReferencia"].disable();
              } else {

                if(response.formula_resultado.includes('concat')) {
                  this.formIndicador.controls["tipoResultado"].setValue(
                    this.listaTipoResultado.filter(x => x.value === 2)[0].value
                  );
                } else {
                  this.formIndicador.controls["tipoResultado"].setValue(
                    this.listaTipoResultado.filter(x => x.value === 1)[0].value
                  );
                }
                

                this.exibirCardFormulaReferencia =
                  true && this.exibirCardReferencia;
                this.formIndicador.controls["formulaReferencia"].enable();
              }
              this.formIndicador.controls["ordemClassificacao"].setValue(
                this.listaOrdemClassificacao.filter(
                  x => x.value === Number(response.ordem_classificacao)
                )[0].value
              );
              this.formIndicador.controls["complementar"].setValue(response.complementar);

              for (const variavel of response.variaveis) {
                let tmpListaVariaveis: Array<Variavel> = new Array<Variavel>();
                if (
                  this.listaVariaveis.filter(x => x.id === variavel.id).length >
                  0
                ) {
                  this.listaTabelaVariaveis.push(variavel);
                  this.listaVariaveis = this.listaVariaveis.filter(
                    x => x.id !== variavel.id
                  );
                  this.dataSource = new MatTableDataSource(
                    this.listaTabelaVariaveis
                  );
                  this.dataSource.paginator = this.paginator;
                  this.dataSource.sort = this.sort;
                }
              }

              this.formIndicador.controls["formulaResultado"].setValue(
                response.formula_resultado
              );
              this.formIndicador.controls["formulaReferencia"].setValue(
                response.formula_referencia
              );
              for (const itemVariavelReferencia of response.referencia) {
                if (itemVariavelReferencia.cor === "#39FF33") {
                  this.formReferencia.controls["deGreen"].setValue(
                    itemVariavelReferencia.valorde
                  );
                  this.formReferencia.controls["ateGreen"].setValue(
                    itemVariavelReferencia.valorate
                  );
                } else if (itemVariavelReferencia.cor === "#FFFF00") {
                  this.formReferencia.controls["deYellow"].setValue(
                    itemVariavelReferencia.valorde
                  );
                  this.formReferencia.controls["ateYellow"].setValue(
                    itemVariavelReferencia.valorate
                  );
                } else if (itemVariavelReferencia.cor === "#FFA500") {
                  this.formReferencia.controls["deOrange"].setValue(
                    itemVariavelReferencia.valorde
                  );
                  this.formReferencia.controls["ateOrange"].setValue(
                    itemVariavelReferencia.valorate
                  );
                } else if (itemVariavelReferencia.cor === "#FF0000") {
                  this.formReferencia.controls["deRed"].setValue(
                    itemVariavelReferencia.valorde
                  );
                  this.formReferencia.controls["ateRed"].setValue(
                    itemVariavelReferencia.valorate
                  );
                }
              }

              if (response.referencia == null || response.referencia.length === 0) {
                this.ocultarReferencia = true;
              }

              this.listaTabelaVariaveis = response.variaveis;
              this.indicadorSelecionado = response;
            },
            error => {
              this.loading = false;
            }
          );
        } else {
          this.formulaResultadoValida = false;
          this.formulaReferenciaValida = false;
          await this.setCampos();
          this.loading = false;
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  setCampos() {
    this.indicadorSelecionado.id = null;
  }

  removeTableItem(rowTable: Variavel) {
    const rowIndex: number = this.listaTabelaVariaveis.indexOf(rowTable);
    if (rowIndex !== -1) {
      this.listaTabelaVariaveis.splice(rowIndex, 1);
      this.listaVariaveis.push(rowTable);
      this.dataSource = new MatTableDataSource(this.listaTabelaVariaveis);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = "Primeira página";
      this.paginator._intl.previousPageLabel = "Página anterior";
      this.paginator._intl.nextPageLabel = "Próxima página";
      this.paginator._intl.lastPageLabel = "Última página";
      this.variavelSelecionada = rowTable;
    }
  }

  addTableItem() {
    const rowIndex: number = this.listaVariaveis.indexOf(
      this.variavelSelecionada
    );
    if (this.variavelSelecionada != null) {
      this.listaTabelaVariaveis.push(this.variavelSelecionada);
      this.listaVariaveis.splice(rowIndex, 1);
      this.dataSource = new MatTableDataSource(this.listaTabelaVariaveis);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = "Primeira página";
      this.paginator._intl.previousPageLabel = "Página anterior";
      this.paginator._intl.nextPageLabel = "Próxima página";
      this.paginator._intl.lastPageLabel = "Última página";
      this.variavelSelecionada = null;
    }
  }

  tradeVariavel(variavelSelecionada) {
    this.variavelSelecionada = variavelSelecionada;
  }

  tradeEixo(eixoSelecionado: Eixo) {
    this.listaEixo
      .filter(x => x.id === eixoSelecionado.id)
      .forEach(x => {
        this.listaODS = x.listaODS;
      });
  }

  tradeResultado(resultadoSelecionado) {
    this.exibirCardFormulaReferencia =
      resultadoSelecionado === 2 ? true : false;
    if (!this.exibirCardFormulaReferencia || this.isGestor()) {
      this.formIndicador.controls["formulaReferencia"].disable();
    } else {
      this.formIndicador.controls["formulaReferencia"].enable();
    }
  }

  tradeOds(odsSelecionada: ObjetivoDesenvolvimentoSustentavel) {
    this.listaODS
      .filter(x => x.id === odsSelecionada.id)
      .forEach(x => {
        this.listaMetaODS = x.metas;
      });
  }

  validarBotaoSalvarReferencia(): boolean {
    if (this.formReferencia.valid && this.formIndicador.valid && !this.disabledBtnSalvar) return false;
    else return true;
  }

  async salvar() {
    this.disabledBtnSalvar = true;

    let indicador: Indicador;
    let indicadorReferencia: VariavelReferencia;
    let listaReferencia: Array<VariavelReferencia>;
    let countCor: number = 1;
    this.loading = true;
    const dialogRef = this.dialog.open(this.modalLoading, {
      height: '300px',
      width: '300px',
    });
    this.validarFormulario();
    if (this.formularioValido === true) {
      if (
        this.indicadorSelecionado.referencia === null ||
        this.indicadorSelecionado.referencia === undefined ||
        this.indicadorSelecionado.referencia.length === 0
      ) {
        listaReferencia = new Array<VariavelReferencia>();
        for (countCor; countCor <= 4; countCor++) {
          indicadorReferencia = new VariavelReferencia();
          if (countCor === 1) {
            indicadorReferencia.id = null;
            indicadorReferencia.valorde = this.formReferencia.controls[
              "deGreen"
            ].value;
            indicadorReferencia.valorate = this.formReferencia.controls[
              "ateGreen"
            ].value;
            indicadorReferencia.label = "Alto";
            indicadorReferencia.cor = "#39FF33";
            indicadorReferencia.fonteReferencia = "";
            listaReferencia.push(indicadorReferencia);
          } else if (countCor === 2) {
            indicadorReferencia.id = null;
            indicadorReferencia.valorde = this.formReferencia.controls[
              "deYellow"
            ].value;
            indicadorReferencia.valorate = this.formReferencia.controls[
              "ateYellow"
            ].value;
            indicadorReferencia.label = "Médio Alto";
            indicadorReferencia.cor = "#FFFF00";
            indicadorReferencia.fonteReferencia = "";
            listaReferencia.push(indicadorReferencia);
          } else if (countCor === 3) {
            indicadorReferencia.id = null;
            indicadorReferencia.valorde = this.formReferencia.controls[
              "deOrange"
            ].value;
            indicadorReferencia.valorate = this.formReferencia.controls[
              "ateOrange"
            ].value;
            indicadorReferencia.label = "Médio Baixo";
            indicadorReferencia.cor = "#FFA500";
            indicadorReferencia.fonteReferencia = "";
            listaReferencia.push(indicadorReferencia);
          } else if (countCor === 4) {
            indicadorReferencia.id = null;
            indicadorReferencia.valorde = this.formReferencia.controls[
              "deRed"
            ].value;
            indicadorReferencia.valorate = this.formReferencia.controls[
              "ateRed"
            ].value;
            indicadorReferencia.label = "Baixo";
            indicadorReferencia.cor = "#FF0000";
            indicadorReferencia.fonteReferencia = "";
            listaReferencia.push(indicadorReferencia);
          }
        }
        this.indicadorSelecionado.referencia = listaReferencia;
      } else {
        for (const itemVariavelReferencia of this.indicadorSelecionado
          .referencia) {
          if (itemVariavelReferencia.cor === "#39FF33") {
            itemVariavelReferencia.valorde = this.formReferencia.controls[
              "deGreen"
            ].value;
            itemVariavelReferencia.valorate = this.formReferencia.controls[
              "ateGreen"
            ].value;
            itemVariavelReferencia.label = "Alto";
            itemVariavelReferencia.cor = "#39FF33";
            itemVariavelReferencia.fonteReferencia = "";
          } else if (itemVariavelReferencia.cor === "#FFFF00") {
            itemVariavelReferencia.valorde = this.formReferencia.controls[
              "deYellow"
            ].value;
            itemVariavelReferencia.valorate = this.formReferencia.controls[
              "ateYellow"
            ].value;
            itemVariavelReferencia.label = "Médio Alto";
            itemVariavelReferencia.cor = "#FFFF00";
            itemVariavelReferencia.fonteReferencia = "";
          } else if (itemVariavelReferencia.cor === "#FFA500") {
            itemVariavelReferencia.valorde = this.formReferencia.controls[
              "deOrange"
            ].value;
            itemVariavelReferencia.valorate = this.formReferencia.controls[
              "ateOrange"
            ].value;
            itemVariavelReferencia.label = "Médio Baixo";
            itemVariavelReferencia.cor = "#FFA500";
            itemVariavelReferencia.fonteReferencia = "";
          } else if (itemVariavelReferencia.cor === "#FF0000") {
            itemVariavelReferencia.valorde = this.formReferencia.controls[
              "deRed"
            ].value;
            itemVariavelReferencia.valorate = this.formReferencia.controls[
              "ateRed"
            ].value;
            itemVariavelReferencia.label = "Baixo";
            itemVariavelReferencia.cor = "#FF0000";
            itemVariavelReferencia.fonteReferencia = "";
          }
        }

       
      }

      if (this.ocultarReferencia){
        this.indicadorSelecionado.referencia = null;
      }
      this.indicadorSelecionado.id =
        this.indicadorSelecionado.id > 0 &&
        this.indicadorSelecionado.id !== null
          ? this.indicadorSelecionado.id
          : null;
      this.indicadorSelecionado.nome = this.formIndicador.controls[
        "nome"
      ].value;
      this.indicadorSelecionado.descricao = this.formIndicador.controls[
        "descricao"
      ].value;
      this.indicadorSelecionado.eixo = this.formIndicador.controls[
        "eixo"
      ].value;
      this.indicadorSelecionado.tipo_resultado = this.formIndicador.controls[
        "tipoResultado"
      ].value;
      this.indicadorSelecionado.ods = this.formIndicador.controls["Ods"].value;
      this.indicadorSelecionado.metaOds = this.formIndicador.controls[
        "MetaOds"
      ].value;
      this.indicadorSelecionado.ordem_classificacao = this.formIndicador.controls[
        "ordemClassificacao"
      ].value;
      this.indicadorSelecionado.formula_referencia = this.formIndicador.controls[
        "formulaReferencia"
      ].value;
      this.indicadorSelecionado.formula_resultado = this.formIndicador.controls[
        "formulaResultado"
      ].value;
      this.indicadorSelecionado.variaveis = this.listaTabelaVariaveis;
      this.indicadorSelecionado.complementar = this.formIndicador.controls[
        "complementar"
      ].value;
      if (
        this.indicadorSelecionado.id === 0 ||
        this.indicadorSelecionado.id === null
      ) {
        await this.indicadoresService
          .inserir(this.indicadorSelecionado)
          .subscribe(
            async response => {
              const obj: any = response;
              const id = obj.id;
              this.indicadorPreenchidoService.recalcularIndicador(id).subscribe(r => {});

              await PcsUtil.swal()
                .fire({
                  title: "Cadastro de indicador",
                  text: `Indicador ${this.indicadorSelecionado.nome} cadastrado.`,
                  type: "success",
                  showCancelButton: false,
                  confirmButtonText: "Ok"
                })
                .then(
                  result => {
                    this.loading = false;
                    this.router.navigate(["/cadastroindicadores"]);
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
        await this.indicadoresService
          .editar(this.indicadorSelecionado)
          .subscribe(
            async response => {
              const obj: any = response;
              const id = obj.id;
              this.indicadorPreenchidoService.recalcularIndicador(id).subscribe(r => {});
              await PcsUtil.swal()
                .fire({
                  title: "Alteração de indicador",
                  text: `Indicador ${this.indicadorSelecionado.nome} atualizado.`,
                  type: "success",
                  showCancelButton: false,
                  confirmButtonText: "Ok"
                })
                .then(
                  result => {
                    this.loading = false;
                    this.router.navigate(["/cadastroindicadores"]);
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
    this.dialog.closeAll();
  }

  async validarFormulario() {
    let formularioInvalido: boolean = false;
    let quadradoInvalido: boolean = false;
    let formularioNome: string;
    let quadradoCor: string;

    if (this.listaTabelaVariaveis.length <= 0) {
      formularioNome = "tabela lista de variáveis";
      formularioInvalido = true;
    } else if (this.formReferencia.valid && this.exibirCardReferencia) {
      if (
        this.formReferencia.controls["deGreen"].value >
        this.formReferencia.controls["ateGreen"].value
      ) {
        quadradoCor =
          "Valor do campo DE do quadrado verde não pode ser maior que o valor do campo ATÉ, favor verificar";
        quadradoInvalido = true;
      } else if (
        this.formReferencia.controls["deYellow"].value >
        this.formReferencia.controls["ateYellow"].value
      ) {
        quadradoCor =
          "Valor do campo DE do quadrado amarelo não pode ser maior que o valor do campo ATÉ, favor verificar";
        quadradoInvalido = true;
      } else if (
        this.formReferencia.controls["deOrange"].value >
        this.formReferencia.controls["ateOrange"].value
      ) {
        quadradoCor =
          "Valor do campo DE do quadrado laranja não pode ser maior que o valor do campo ATÉ, favor verificar";
        quadradoInvalido = true;
      } else if (
        this.formReferencia.controls["deRed"].value >
        this.formReferencia.controls["ateRed"].value
      ) {
        quadradoCor =
          "Valor do campo DE do quadrado vermelho não pode ser maior que o valor do campo ATÉ, favor verificar";
        quadradoInvalido = true;
      } else if (!this.ocultarReferencia && !this.validarValoresReferencia()) {
        quadradoCor = "Valores de referência inválidos, favor verificar";
        quadradoInvalido = true;
      }
    }

    let titulo = "";
    let texto = "";
    let hasErro =
      !this.formulaResultadoValida ||
      (!this.isGestor() &&
        this.exibirCardFormulaReferencia &&
        !this.formulaReferenciaValida) ||
      formularioInvalido ||
      quadradoInvalido;
    if (formularioInvalido) {
      titulo = "Validação de formulário";
      texto = `A ${formularioNome.toUpperCase()} deve possuir ao menos um item. favor verificar!`;
    } else if (!this.formulaResultadoValida) {
      titulo = "Validação de Fórmula do Resultado";
      texto = `A Fórmula deve ser válida. Favor verificar!`;
    } else if (
      this.exibirCardFormulaReferencia &&
      !this.formulaReferenciaValida
    ) {
      (titulo = "Validação de Fórmula de Referência"),
        (texto = `A Fórmula deve ser válida. Favor verificar!`);
    } else if (quadradoInvalido) {
      titulo = "Validação de formulário";
      texto = `${quadradoCor}`;
    }
    if (hasErro) {
      await PcsUtil.swal()
        .fire({
          title: titulo,
          text: texto,
          type: "warning",
          showCancelButton: false,
          confirmButtonText: "Ok"
        })
        .then(
          result => {
            this.loading = false;
          },
          error => {
            this.loading = false;
          }
        );
    }

    this.formularioValido = !hasErro;
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  validarValoresReferencia(): boolean {
    const deGreen: number = this.formReferencia.controls.deGreen.value;
    const ateGreen: number = this.formReferencia.controls.ateGreen.value;
    const deYellow: number = this.formReferencia.controls.deYellow.value;
    const ateYellow: number = this.formReferencia.controls.ateYellow.value;
    const deOrange: number = this.formReferencia.controls.deOrange.value;
    const ateOrange: number = this.formReferencia.controls.ateOrange.value;
    const deRed: number = this.formReferencia.controls.deRed.value;
    const ateRed: number = this.formReferencia.controls.ateRed.value;

    /* Green */
    if (
      (deGreen >= deYellow && deGreen <= ateYellow) ||
      (ateGreen >= deYellow && ateGreen <= ateYellow)
    ) {
      return false;
    }

    if (
      (deGreen >= deOrange && deGreen <= ateOrange) ||
      (ateGreen >= deOrange && ateGreen <= ateOrange)
    ) {
      return false;
    }

    if (
      (deGreen >= deRed && deGreen <= ateRed) ||
      (ateGreen >= deRed && ateGreen <= ateRed)
    ) {
      return false;
    }

    /* Yellow */
    if (
      (deYellow >= deGreen && deYellow <= ateGreen) ||
      (ateYellow >= deGreen && ateYellow <= ateGreen)
    ) {
      return false;
    }

    if (
      (deYellow >= deOrange && deYellow <= ateOrange) ||
      (ateYellow >= deOrange && ateYellow <= ateOrange)
    ) {
      return false;
    }

    if (
      (deYellow >= deRed && deYellow <= ateRed) ||
      (ateYellow >= deRed && ateYellow <= ateRed)
    ) {
      return false;
    }

    /* Orange */
    if (
      (deOrange >= deYellow && deOrange <= ateYellow) ||
      (ateOrange >= deYellow && ateOrange <= ateYellow)
    ) {
      return false;
    }

    if (
      (deOrange >= deGreen && deOrange <= ateGreen) ||
      (ateOrange >= deGreen && ateOrange <= ateGreen)
    ) {
      return false;
    }

    if (
      (deOrange >= deRed && deOrange <= ateRed) ||
      (ateOrange >= deRed && ateOrange <= ateRed)
    ) {
      return false;
    }

    /* Red */
    if (
      (deRed >= deYellow && deRed <= ateYellow) ||
      (ateRed >= deYellow && ateRed <= ateYellow)
    ) {
      return false;
    }

    if (
      (deRed >= deOrange && deRed <= ateOrange) ||
      (ateRed >= deOrange && ateRed <= ateOrange)
    ) {
      return false;
    }

    if (
      (deRed >= deGreen && deRed <= ateGreen) ||
      (ateRed >= deGreen && ateRed <= ateGreen)
    ) {
      return false;
    }

    return true;
  }

  getNome() {
    return this.formIndicador.get("nome").hasError("required")
      ? "Campo nome é obrigatório"
      : this.formIndicador.get("nome").hasError("minlength")
      ? "Campo nome deve conter ao menos 5 dígitos"
      : this.formIndicador.get("nome").hasError("maxlength")
      ? "Campo nome deve conter no máximo 100 dígitos"
      : "";
  }

  getDescricao() {
    return this.formIndicador.get("descricao").hasError("required")
      ? "Campo descrição é obrigatório"
      : this.formIndicador.get("descricao").hasError("minlength")
      ? "Campo descrição deve conter ao menos 5 dígitos"
      : this.formIndicador.get("descricao").hasError("maxlength")
      ? "Campo descrição deve conter no máximo 1000 dígitos"
      : "";
  }

  getEixo() {
    return this.formIndicador.get("eixo").hasError("required")
      ? "Campo eixo é obrigatório"
      : "";
  }

  getTipoResultado() {
    return this.formIndicador.get("eixo").hasError("required")
      ? "Campo tipo resultado é obrigatório"
      : "";
  }

  getOds() {
    return this.formIndicador.get("Ods").hasError("required")
      ? "Campo ODS é obrigatório"
      : "";
  }

  getOrdemClassificacao() {
    return this.formIndicador.get("ordemClassificacao").hasError("required")
      ? "Campo ordem de classificação é obrigatório"
      : "";
  }

  getMetaOds() {
    return this.formIndicador.get("MetaOds").hasError("required")
      ? "Campo meta Ods é obrigatório"
      : "";
  }

  getDeGreen() {
    return this.formReferencia.get("deGreen").hasError("required")
      ? "Campo De (quadrado verde) é obrigatório"
      : this.formReferencia.get("deGreen").hasError("minlength")
      ? "Campo De (quadrado verde) deve conter ao menos 1 dígitos"
      : this.formReferencia.get("deGreen").hasError("maxlength")
      ? "Campo De (quadrado verde) deve conter no máximo 20 dígitos"
      : "";
  }

  getAteGreen() {
    return this.formReferencia.get("ateGreen").hasError("required")
      ? "Campo Até (quadrado verde) é obrigatório"
      : this.formReferencia.get("ateGreen").hasError("minlength")
      ? "Campo Até (quadrado verde) deve conter ao menos 1 dígitos"
      : this.formReferencia.get("ateGreen").hasError("maxlength")
      ? "Campo Até (quadrado verde) deve conter no máximo 20 dígitos"
      : "";
  }

  getDeYellow() {
    return this.formReferencia.get("deYellow").hasError("required")
      ? "Campo De (quadrado amarelo) é obrigatório"
      : this.formReferencia.get("deYellow").hasError("minlength")
      ? "Campo De (quadrado amarelo) deve conter ao menos 1 dígitos"
      : this.formReferencia.get("deYellow").hasError("maxlength")
      ? "Campo De (quadrado amarelo) deve conter no máximo 20 dígitos"
      : "";
  }

  getAteYellow() {
    return this.formReferencia.get("ateYellow").hasError("required")
      ? "Campo Até (quadrado amarelo) é obrigatório"
      : this.formReferencia.get("ateYellow").hasError("minlength")
      ? "Campo Até (quadrado amarelo) deve conter ao menos 1 dígitos"
      : this.formReferencia.get("ateYellow").hasError("maxlength")
      ? "Campo Até (quadrado amarelo) deve conter no máximo 20 dígitos"
      : "";
  }

  getDeOrange() {
    return this.formReferencia.get("deOrange").hasError("required")
      ? "Campo De (quadrado laranja) é obrigatório"
      : this.formReferencia.get("deOrange").hasError("minlength")
      ? "Campo De (quadrado laranja) deve conter ao menos 1 dígitos"
      : this.formReferencia.get("deOrange").hasError("maxlength")
      ? "Campo De (quadrado laranja) deve conter no máximo 20 dígitos"
      : "";
  }

  getAteOrange() {
    return this.formReferencia.get("ateOrange").hasError("required")
      ? "Campo Até (quadrado laranja) é obrigatório"
      : this.formReferencia.get("ateOrange").hasError("minlength")
      ? "Campo Até (quadrado laranja) deve conter ao menos 1 dígitos"
      : this.formReferencia.get("ateOrange").hasError("maxlength")
      ? "Campo Até (quadrado laranja) deve conter no máximo 20 dígitos"
      : "";
  }
  getDeRed() {
    return this.formReferencia.get("deRed").hasError("required")
      ? "Campo De (quadrado vermelho) é obrigatório"
      : this.formReferencia.get("deRed").hasError("minlength")
      ? "Campo De (quadrado vermelho) deve conter ao menos 1 dígitos"
      : this.formReferencia.get("deRed").hasError("maxlength")
      ? "Campo De (quadrado vermelho) deve conter no máximo 20 dígitos"
      : "";
  }

  getAteRed() {
    return this.formReferencia.get("ateRed").hasError("required")
      ? "Campo Até (quadrado vermelho) é obrigatório"
      : this.formReferencia.get("ateRed").hasError("minlength")
      ? "Campo Até (quadrado vermelho) deve conter ao menos 1 dígitos"
      : this.formReferencia.get("ateRed").hasError("maxlength")
      ? "Campo Até (quadrado vermelho) deve conter no máximo 20 dígitos"
      : "";
  }

  validarFormulaResultado(resultado) {
    if (this.formulaResultadoValida === undefined) {
      this.formulaResultadoValida = true;
    } else {
      this.formulaResultadoValida = resultado;
    }
  }

  validarFormulaReferencia(resultado) {
    if (this.formulaReferenciaValida === undefined) {
      this.formulaReferenciaValida = true;
    } else {
      this.formulaReferenciaValida = resultado;
    }
  }

  chechboxReferencia(value) {
    if (Boolean(value) === false) {
      this.ocultarReferencia = true;
    }
    else {
      this.ocultarReferencia = false;
    }
  }
}
