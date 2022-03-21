import { Component, OnInit, HostListener, Inject, ElementRef } from '@angular/core';
import { PlanoMeta } from 'src/app/model/PlanoMetas/plano-meta';
import { PlanoMetasService } from 'src/app/services/plano-metas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Indicador } from 'src/app/model/indicadores';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { PlanoMetaDetalhes } from 'src/app/model/PlanoMetas/plano-meta-detalhes';
import { PlanoMetaAno } from 'src/app/model/PlanoMetas/plano-meta-ano';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { CidadeService } from 'src/app/services/cidade.service';
import { Arquivo } from 'src/app/model/arquivo';

export interface DropDownList {
  value: number;
  viewValue: string;
}

export interface ListaPlanoMeta {
  objetoPlanoMetaDetalhes: PlanoMetaDetalhes;
  atualizarLista: boolean;
  botaoCriarPressionado: boolean;
}

@Component({
  selector: 'app-plano-metas',
  templateUrl: './plano-metas.component.html',
  styleUrls: ['./plano-metas.component.css']
})

export class PlanoMetasComponent implements OnInit {

  public nomeArquivoMaterialPublicacao;
  statusSelecionado: number;
  innerWidth: any;
  sub: any;
  //Variaveis Lista
  listaPlanoMetaIndicador: Array<PlanoMetaDetalhes> = new Array<PlanoMetaDetalhes>();
  listaStatus: DropDownList[] = [
    { value: 0, viewValue: 'Não iniciado' },
    { value: 1, viewValue: 'Planejado' },
    { value: 2, viewValue: 'Em andamento' },
    { value: 3, viewValue: 'Concluído' },
  ];
  listaPlanoMeta: ListaPlanoMeta[] = [{ objetoPlanoMetaDetalhes: new PlanoMetaDetalhes(), atualizarLista: false, botaoCriarPressionado: false }];

  //Variaveis Objeto
  objetoPlanoMeta: PlanoMeta = new PlanoMeta();
  objetoPlanoMetaAno: PlanoMetaAno = new PlanoMetaAno();
  form: FormGroup;
  populacaoPreenchida: boolean = true;
  totalPopulacao: string;

  public editorConfig: any = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['fontsize', []],
      ['para', ['style0', 'ul', 'ol']],
      ['insert', ['table', 'picture', 'link']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  constructor(public formBuilder: FormBuilder, public dialog: MatDialog, public planoMetaService: PlanoMetasService, public activatedRoute: ActivatedRoute, public authService: AuthService, public cidadeService: CidadeService, private router: Router) {
    registerLocaleData(localePtBr);
    this.form = this.formBuilder.group({
      apresentacao: [""],
      descricao: [""],
      arquivo: [""],
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    if (localStorage.getItem("NovoIndicadorPlanoMeta") !== null && localStorage.getItem("NovoIndicadorPlanoMeta") !== undefined)
      localStorage.removeItem("NovoIndicadorPlanoMeta");
    this.checkPopulacao();
    this.buscarPlanoMeta();
    this.checkUpdate();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  checkPopulacao() {
    if (localStorage.getItem("usuarioLogado") !== null && localStorage.getItem("NovoIndicadorPlanoMeta") !== undefined) {
      let objUsuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));
      if (objUsuarioLogado !== null) {
        if (objUsuarioLogado.dadosPrefeitura.cidade !== null && objUsuarioLogado.dadosPrefeitura.cidade != undefined) {
          this.cidadeService.buscarCidade(parseInt(objUsuarioLogado.dadosPrefeitura.cidade.id)).subscribe(response => {
            if(response.populacao){
              this.populacaoPreenchida = response.populacao === null || response.populacao === undefined || response.populacao.toString() === '' ? false : true;
              this.totalPopulacao = parseFloat(response.populacao.toString()) <= parseFloat('100000') ? '50' :
              parseFloat(response.populacao.toString()) >= parseFloat('500000') && parseFloat(response.populacao.toString()) <= parseFloat('500000') ? '75' :
              parseFloat(response.populacao.toString()) > parseFloat('500000') ? '100' : '0';
            } else {
              this.totalPopulacao = '0';
            }
          });
        }
      }
    }
  }

  checkUpdate() {
    setInterval(() => {
      //Verificar se a session existe, se existir pegar o campo que precisa, atualiza-lo e chamar o metodo para recarregar a lista
      if (localStorage.getItem("NovoIndicadorPlanoMeta") !== null && localStorage.getItem("NovoIndicadorPlanoMeta") !== undefined) {
        this.listaPlanoMeta = JSON.parse(localStorage.getItem("NovoIndicadorPlanoMeta"));
        if (this.listaPlanoMeta.length > 0) {
          if (this.listaPlanoMeta.filter(x => x.atualizarLista === true).length > 0) {
            this.listaPlanoMeta.forEach(x => x.atualizarLista = false);
            this.atualizarPlanoMeta(this.objetoPlanoMeta.idPrefeitura);
          }
        }
      }
    }, 5000);
  }

  atualizarPlanoMeta(idPlanoMeta: Number) {
    this.planoMetaService.buscarPlanoDeMetasPorId(idPlanoMeta).subscribe(response => {
      this.objetoPlanoMeta = response as PlanoMeta;
      this.statusSelecionado = this.listaStatus.find(x => x.viewValue === response.statusPlanoDeMetas).value;
      this.objetoPlanoMetaAno.primeiroAnoMandato = this.objetoPlanoMeta.primeiroAnoMandato;
      this.objetoPlanoMetaAno.segundoAnoMandato = this.objetoPlanoMeta.segundoAnoMandato;
      this.objetoPlanoMetaAno.terceiroAnoMandato = this.objetoPlanoMeta.terceiroAnoMandato;
      this.objetoPlanoMetaAno.quartoAnoMandato = this.objetoPlanoMeta.quartoAnoMandato;
      if (this.objetoPlanoMeta.planosDeMetasDetalhados !== null && this.objetoPlanoMeta.planosDeMetasDetalhados !== undefined) {
        this.listaPlanoMetaIndicador = this.objetoPlanoMeta.planosDeMetasDetalhados;
      }
      localStorage.removeItem("NovoIndicadorPlanoMeta");
    });
  }

  buscarPlanoMeta() {
    this.activatedRoute.params.subscribe(async params => {
      let id = params.id;
      if (id) {
        this.planoMetaService.buscarPlanoDeMetasPorId(id).subscribe(response => {
          if (response !== null && response !== undefined) {
            this.objetoPlanoMeta = response as PlanoMeta;
            this.statusSelecionado = this.listaStatus.find(x => x.viewValue === response.statusPlanoDeMetas).value;
            this.objetoPlanoMetaAno.primeiroAnoMandato = this.objetoPlanoMeta.primeiroAnoMandato;
            this.objetoPlanoMetaAno.segundoAnoMandato = this.objetoPlanoMeta.segundoAnoMandato;
            this.objetoPlanoMetaAno.terceiroAnoMandato = this.objetoPlanoMeta.terceiroAnoMandato;
            this.objetoPlanoMetaAno.quartoAnoMandato = this.objetoPlanoMeta.quartoAnoMandato;
            if (this.objetoPlanoMeta.planosDeMetasDetalhados !== null && this.objetoPlanoMeta.planosDeMetasDetalhados !== undefined) {
              this.listaPlanoMetaIndicador = this.formatarStringDeValoresPlanoDeMetasDetalhes(this.objetoPlanoMeta.planosDeMetasDetalhados);
            }
            this.nomeArquivoMaterialPublicacao = this.objetoPlanoMeta.arquivo != null ? this.objetoPlanoMeta.arquivo.nomeArquivo : null;
            this.form.controls.apresentacao.setValue(this.objetoPlanoMeta.apresentacao);
            this.form.controls.descricao.setValue(this.objetoPlanoMeta.descricao);
          }
        });
      }
    });
  }

  formatarStringDeValoresPlanoDeMetasDetalhes(planoDeMetasDetalhes: PlanoMetaDetalhes[]){
    planoDeMetasDetalhes.forEach(x => {
      if (x.ultimoValorIndicador) {
        x.ultimoValorIndicador = parseFloat(x.ultimoValorIndicador).toFixed(2);
      }

      if(x.valorPreenchidoPrimeiroAno){
        x.valorPreenchidoPrimeiroAno = parseFloat(x.valorPreenchidoPrimeiroAno).toFixed(2);
      }

      if(x.valorPreenchidoSegundoAno){
        x.valorPreenchidoSegundoAno = parseFloat(x.valorPreenchidoSegundoAno).toFixed(2);
      }

      if(x.valorPreenchidoTerceiroAno){
        x.valorPreenchidoTerceiroAno = parseFloat(x.valorPreenchidoTerceiroAno).toFixed(2);
      }

      if(x.valorPreenchidoQuartoAno){
        x.valorPreenchidoQuartoAno = parseFloat(x.valorPreenchidoQuartoAno).toFixed(2);
      }
    })

    return planoDeMetasDetalhes;
  }

  tradeStatus(statusSelecionado: number) {

  }

  openDialogModalPlanoMeta(innerWidth): void {
    if (innerWidth <= 500) {
      const dialogModalPlanoMeta = this.dialog.open(DialogModalPlanoMeta, {
        data: {
          datakey: this.listaPlanoMetaIndicador,
          idPlanoMeta: this.objetoPlanoMeta.id
        }
      });
      dialogModalPlanoMeta.afterClosed().subscribe(result => {
        if (localStorage.getItem("NovoIndicadorPlanoMeta") !== null && localStorage.getItem("NovoIndicadorPlanoMeta") !== undefined) {
          this.listaPlanoMeta = JSON.parse(localStorage.getItem("NovoIndicadorPlanoMeta"));
          if (this.listaPlanoMeta.filter(x => x.botaoCriarPressionado === true).length > 0) {
            this.listaPlanoMetaIndicador.push(this.listaPlanoMeta[0].objetoPlanoMetaDetalhes);
            this.listaPlanoMeta = [{ objetoPlanoMetaDetalhes: new PlanoMetaDetalhes(), atualizarLista: false, botaoCriarPressionado: false }];
            localStorage.setItem("NovoIndicadorPlanoMeta", JSON.stringify(this.listaPlanoMeta));
          }
        }
      });
    }
    else {
      const dialogModalPlanoMeta = this.dialog.open(DialogModalPlanoMeta, {
        height: 'auto',
        width: '50%',
        data: {
          datakey: this.listaPlanoMetaIndicador,
          idPlanoMeta: this.objetoPlanoMeta.id
        }
      });
      dialogModalPlanoMeta.afterClosed().subscribe(result => {
        if (localStorage.getItem("NovoIndicadorPlanoMeta") !== null && localStorage.getItem("NovoIndicadorPlanoMeta") !== undefined) {
          this.listaPlanoMeta = JSON.parse(localStorage.getItem("NovoIndicadorPlanoMeta"));
          if (this.listaPlanoMeta.filter(x => x.botaoCriarPressionado === true).length > 0) {
            console.log(this.listaPlanoMeta[0])
            this.listaPlanoMetaIndicador.push(this.listaPlanoMeta[0].objetoPlanoMetaDetalhes);
            this.listaPlanoMeta = [{ objetoPlanoMetaDetalhes: new PlanoMetaDetalhes(), atualizarLista: false, botaoCriarPressionado: false }];
            localStorage.setItem("NovoIndicadorPlanoMeta", JSON.stringify(this.listaPlanoMeta));
          }
        }
      });
    }
  }

  excluir(planoMetaDetalhes: PlanoMetaDetalhes) {
    PcsUtil.swal().fire({
      title: 'Plano de Metas',
      text: `Deseja realmente excluir o indicador ${planoMetaDetalhes.nomeIndicador}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      if (result.value) {
        this.planoMetaService.deletarPlanoDeMetasDetalhado(planoMetaDetalhes.id).subscribe(response => {
          this.listaPlanoMetaIndicador = this.listaPlanoMetaIndicador.filter(x => x.id !== planoMetaDetalhes.id);
          PcsUtil.swal().fire({
            title: 'Plano de Metas',
            text: `Indicador ${planoMetaDetalhes.nomeIndicador} excluído do plano de metas.`,
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
          }, error => { });
        }, error => { });
      }
    }, error => { });
  }

  public async processFile(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      const arquivo = new Arquivo();
      arquivo.nomeArquivo = event.target.files[0].name;
      this.nomeArquivoMaterialPublicacao = event.target.files[0].name;
      arquivo.extensao = reader.result.toString().split(',')[0];
      arquivo.conteudo = reader.result.toString().split(',')[1];

      this.form.controls.arquivo.setValue(arquivo);
    };
  }

  salvar() {
    let planoMeta: PlanoMeta = new PlanoMeta();
    planoMeta.id = this.objetoPlanoMeta.id;
    planoMeta.idPrefeitura = this.objetoPlanoMeta.idPrefeitura;
    planoMeta.apresentacao = this.form.controls.apresentacao.value;
    planoMeta.descricao = this.form.controls.descricao.value;
    planoMeta.arquivo = this.form.controls.arquivo.value == '' ? null : this.form.controls.arquivo.value ;
    planoMeta.statusPlanoDeMetas = this.listaStatus.find(x => x.value === this.statusSelecionado).viewValue;
    this.planoMetaService.editar(planoMeta).subscribe(response => {
      PcsUtil.swal().fire({
        title: 'Plano de Metas',
        text: `Plano de Metas da cidade ${this.objetoPlanoMeta.nomeCidade} atualizado.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        localStorage.removeItem("NovoIndicadorPlanoMeta");
        this.router.navigate(['/plano-de-metas/administracao'])
      }, error => { });
    });
  }
}

//MODAL

export interface ListaPlanoMeta {
  objetoPlanoMetaDetalhes: PlanoMetaDetalhes;
  atualizarLista: boolean;
  botaoCriarPressionado: boolean;
}

@Component({
  selector: "novoIndicadorPlanoMeta",
  templateUrl: "./novoIndicadorPlanoMeta.html",
  styleUrls: ["./plano-metas.component.css"]
})
export class DialogModalPlanoMeta implements OnInit {
  listaIndicadores: DropDownList[] = [];
  indicadorSelecionado: number;
  nomeIndicador: string = "";
  formCriarPlanoMetaIndicador: FormGroup;
  listaPlanoMeta: ListaPlanoMeta[] = [
    {
      objetoPlanoMetaDetalhes: new PlanoMetaDetalhes(),
      atualizarLista: false,
      botaoCriarPressionado: false
    }
  ];
  scrollUp: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public indicadoresService: IndicadoresService,
    public planoMetaService: PlanoMetasService,
    private element: ElementRef,
    public router: Router,
    public dialogRef: MatDialogRef<DialogModalPlanoMeta>,
    public formBuilder: FormBuilder
  ) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.formCriarPlanoMetaIndicador = this.formBuilder.group({
      indicador: ["", [Validators.required]]
    });
  }

  ngOnInit() {
    this.carregarListaIndicadores();
  }

  carregarListaIndicadores() {
    this.indicadoresService.buscarIndicadoresPcs().subscribe(response => {
      let listaIndicadores: Array<Indicador> = response as Array<Indicador>;
      let listaIndicadoresExistentes: Array<PlanoMetaDetalhes> = this.data
        .datakey;

      for (const item of listaIndicadores) {
        if (
          listaIndicadoresExistentes.filter(x => x.idIndicador === item.id)
            .length === 0
        ) {
          this.listaIndicadores.push({ value: item.id, viewValue: item.nome });
          this.nomeIndicador =
            this.nomeIndicador !== null &&
            this.nomeIndicador !== "" &&
            this.nomeIndicador !== undefined
              ? this.nomeIndicador
              : item.nome;
          this.indicadorSelecionado =
            this.indicadorSelecionado === undefined ||
            this.indicadorSelecionado === null
              ? item.id
              : this.indicadorSelecionado;
        }
      }
      this.formCriarPlanoMetaIndicador.controls["indicador"].setValue(
        this.indicadorSelecionado
      );
    });
  }

  criarIndicador() {
    //Passar o id da meta para a modal(Ver como faz)
    this.planoMetaService
      .criarPlanoDeMetasDetalhadoParaIndicador(
        this.data.idPlanoMeta,
        this.indicadorSelecionado
      )
      .subscribe(
        response => {
          PcsUtil.swal()
            .fire({
              title: "Plano de Metas",
              text: `Indicador ${this.nomeIndicador} adicionado ao plano de metas.`,
              type: "success",
              showCancelButton: false,
              confirmButtonText: "Ok"
            })
            .then(
              result => {
                this.listaPlanoMeta[0].objetoPlanoMetaDetalhes = response as PlanoMetaDetalhes;
                this.listaPlanoMeta[0].atualizarLista = false;
                this.listaPlanoMeta[0].botaoCriarPressionado = true;
                localStorage.setItem(
                  "NovoIndicadorPlanoMeta",
                  JSON.stringify(this.listaPlanoMeta)
                );
                this.dialogRef.close();
              },
              error => {}
            );
        },
        error => {}
      );
  }

  tradeIndicador(indicadorSelecionado: number) {
    this.nomeIndicador = this.listaIndicadores.find(
      x => x.value === indicadorSelecionado
    ).viewValue;
    this.indicadorSelecionado = indicadorSelecionado;
    this.formCriarPlanoMetaIndicador.controls["indicador"].setValue(
      this.indicadorSelecionado
    );
  }

  fechar() {
    this.dialogRef.close();
  }

  getIndicador() {
    return this.formCriarPlanoMetaIndicador
      .get("indicador")
      .hasError("required")
      ? "Campo indicador é obrigatório"
      : "";
  }
}
