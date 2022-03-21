import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { PlanoMetaDetalhes } from 'src/app/model/PlanoMetas/plano-meta-detalhes';
import { PlanoMetaAno } from 'src/app/model/PlanoMetas/plano-meta-ano';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { PlanoMetasService } from 'src/app/services/plano-metas.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import moment from 'moment';
import { DISABLED } from '@angular/forms/src/model';

export interface ListaPlanoMeta {
  objetoPlanoMetaDetalhes: PlanoMetaDetalhes;
  atualizarLista: boolean;
  botaoCriarPressionado: boolean;
}

@Component({
  selector: "app-plano-metas-detalhes",
  templateUrl: "./plano-metas-detalhes.component.html",
  styleUrls: ["./plano-metas-detalhes.component.css"]
})
export class PlanoMetasDetalhesComponent implements OnInit {
  @Input("idPlanoMeta") idPlanoMeta: Number;
  @Input("listaPlanoMetaIndicador") listaPlanoMetaIndicador: PlanoMetaDetalhes;
  @Input("objetoPlanoMetaAno") objetoPlanoMetaAno: PlanoMetaAno;

  formPlanoMeta: FormGroup;
  listaPlanoMeta: ListaPlanoMeta[] = [
    {
      objetoPlanoMetaDetalhes: new PlanoMetaDetalhes(),
      atualizarLista: false,
      botaoCriarPressionado: false
    }
  ];
  scrollUp: any;
  esconderJustificativa: boolean;

  dataAtual: any = moment().year();

  public editorConfig: any = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['fontsize', []],
      ['para', ['style0', 'ul', 'ol']],
      ['insert', ['table', 'link']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  constructor(
    public formBuilder: FormBuilder,
    public planoMetasService: PlanoMetasService,
    public authService: AuthService,
    private element: ElementRef,
    private router: Router
  ) {
    this.esconderJustificativa = true;
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.formPlanoMeta = this.formBuilder.group({
      idPlanoMeta: [""],
      idPlanoMetaIndicador: [""],
      planoParaAlcancarProposta: [null],
      metaPrimeiroAnoMandato: ["", [Validators.required]],
      metaSegundoAnoMandato: ["", [Validators.required]],
      metaTerceiroAnoMandato: ["", [Validators.required]],
      metaQuartoAnoMandato: ["", [Validators.required]],
      orcamentoPrevisto: ["", [Validators.required]],
      orcamentoExecutado: ["", [Validators.required]],
      justificativa: [""],     
    });
  }

  ngOnInit() {
    this.carregaDados();
    this.disabledInputCondicional();
    this.onChanges()
  }

  onChanges(): void {
    this.esconderJustificativa = true;
    this.formPlanoMeta.get('metaPrimeiroAnoMandato').valueChanges.subscribe(val => {
      this.esconderJustificativa = false;
    });
    this.formPlanoMeta.get('metaSegundoAnoMandato').valueChanges.subscribe(val => {
      this.esconderJustificativa = false;
    });
    this.formPlanoMeta.get('metaTerceiroAnoMandato').valueChanges.subscribe(val => {
      this.esconderJustificativa = false;
    });
    this.formPlanoMeta.get('metaQuartoAnoMandato').valueChanges.subscribe(val => {
      this.esconderJustificativa = false;
    });
    this.formPlanoMeta.get('orcamentoPrevisto').valueChanges.subscribe(val => {
      this.esconderJustificativa = false;
    });
    this.formPlanoMeta.get('orcamentoExecutado').valueChanges.subscribe(val => {
      this.esconderJustificativa = false;
    });
    this.formPlanoMeta.get('planoParaAlcancarProposta').valueChanges.subscribe(val => {
      this.esconderJustificativa = false;
    });
  }

  disabledInputCondicional() {
    if (this.objetoPlanoMetaAno.primeiroAnoMandato < this.dataAtual) {
      this.formPlanoMeta.controls['metaPrimeiroAnoMandato'].disable();
    }
    if (this.objetoPlanoMetaAno.segundoAnoMandato < this.dataAtual) {
      this.formPlanoMeta.controls['metaSegundoAnoMandato'].disable();
    }
    if (this.objetoPlanoMetaAno.terceiroAnoMandato < this.dataAtual) {
      this.formPlanoMeta.controls['metaTerceiroAnoMandato'].disable();
    }
    if (this.objetoPlanoMetaAno.quartoAnoMandato < this.dataAtual) {
      this.formPlanoMeta.controls['metaQuartoAnoMandato'].disable();
    }

    //Remove validator de justificativa,caso seja o primeiro save
    if(!this.formPlanoMeta.get('metaPrimeiroAnoMandato').value
    && !this.formPlanoMeta.get('metaSegundoAnoMandato').value
    && !this.formPlanoMeta.get('metaTerceiroAnoMandato').value
    && !this.formPlanoMeta.get('metaQuartoAnoMandato').value
    && !this.formPlanoMeta.get('orcamentoPrevisto').value
    && !this.formPlanoMeta.get('orcamentoExecutado').value
    ){
      this.esconderJustificativa = false;
  } else {               
    this.formPlanoMeta.controls['justificativa'].setValidators([Validators.required, Validators.maxLength(200)]);    
    this.esconderJustificativa = true;          
  }
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  carregaDados() {
    this.formPlanoMeta.controls["idPlanoMeta"].setValue(this.idPlanoMeta);
    this.formPlanoMeta.controls["idPlanoMetaIndicador"].setValue(
      this.listaPlanoMetaIndicador.id
    );
    this.formPlanoMeta.controls["metaPrimeiroAnoMandato"].setValue(
      this.listaPlanoMetaIndicador.metaAnualPrimeiroAno
    );
    this.formPlanoMeta.controls["planoParaAlcancarProposta"].setValue(
      this.listaPlanoMetaIndicador.planoParaAlcancarProposta
    );
    this.formPlanoMeta.controls["metaSegundoAnoMandato"].setValue(
      this.listaPlanoMetaIndicador.metaAnualSegundoAno
    );
    this.formPlanoMeta.controls["metaTerceiroAnoMandato"].setValue(
      this.listaPlanoMetaIndicador.metaAnualTerceiroAno
    );
    this.formPlanoMeta.controls["metaQuartoAnoMandato"].setValue(
      this.listaPlanoMetaIndicador.metaAnualQuartoAno
    );
    this.formPlanoMeta.controls["orcamentoPrevisto"].setValue(
      this.listaPlanoMetaIndicador.orcamentoPrevisto
    );
    this.formPlanoMeta.controls["orcamentoExecutado"].setValue(
      this.listaPlanoMetaIndicador.orcamentoExecutado
    );
  }

  salvar() {
    let planoMetaDetalhes: PlanoMetaDetalhes = new PlanoMetaDetalhes();
    planoMetaDetalhes.id = Number(
      this.formPlanoMeta.controls["idPlanoMetaIndicador"].value
    );
    planoMetaDetalhes.metaAnualPrimeiroAno = this.formPlanoMeta.controls[
      "metaPrimeiroAnoMandato"
    ].value;
    planoMetaDetalhes.planoParaAlcancarProposta = this.formPlanoMeta.controls[
      "planoParaAlcancarProposta"
    ].value;    
    planoMetaDetalhes.metaAnualSegundoAno = this.formPlanoMeta.controls[
      "metaSegundoAnoMandato"
    ].value;
    planoMetaDetalhes.metaAnualTerceiroAno = this.formPlanoMeta.controls[
      "metaTerceiroAnoMandato"
    ].value;
    planoMetaDetalhes.metaAnualQuartoAno = this.formPlanoMeta.controls[
      "metaQuartoAnoMandato"
    ].value;
    planoMetaDetalhes.orcamentoPrevisto = this.formPlanoMeta.controls[
      "orcamentoPrevisto"
    ].value;
    planoMetaDetalhes.orcamentoExecutado = this.formPlanoMeta.controls[
      "orcamentoExecutado"
    ].value;
    planoMetaDetalhes.justificativa = this.formPlanoMeta.controls[
      "justificativa"
    ].value;
    this.planoMetasService
      .editarPlanoDeMetasDetalhado(planoMetaDetalhes, planoMetaDetalhes.id)
      .subscribe(
        response => {
          PcsUtil.swal()
            .fire({
              title: "Plano de Metas",
              text: `Indicador atualizado ao Plano de Metas`,
              type: "success",
              showCancelButton: false,
              confirmButtonText: "Ok"
            })
            .then(
              result => {
                if (
                  localStorage.getItem("NovoIndicadorPlanoMeta") !== null &&
                  localStorage.getItem("NovoIndicadorPlanoMeta") !== undefined
                ) {
                  this.listaPlanoMeta = JSON.parse(
                    localStorage.getItem("NovoIndicadorPlanoMeta")
                  );
                  this.listaPlanoMeta[0].atualizarLista = true;
                  this.listaPlanoMeta[0].botaoCriarPressionado = false;
                  localStorage.setItem(
                    "NovoIndicadorPlanoMeta",
                    JSON.stringify(this.listaPlanoMeta)
                  );
                } else {
                  this.listaPlanoMeta[0].atualizarLista = true;
                  this.listaPlanoMeta[0].botaoCriarPressionado = false;
                  localStorage.setItem(
                    "NovoIndicadorPlanoMeta",
                    JSON.stringify(this.listaPlanoMeta)
                  );
                }
              },
              error => {}
            );
        },
        error => {}
      );
  }

  getMetaPrimeiroAnoMandato() {
    return this.formPlanoMeta.get("metaPrimeiroAnoMandato").hasError("required")
      ? "Campo meta anual para " +
          this.objetoPlanoMetaAno.primeiroAnoMandato +
          " é obrigátorio"
      : "";
  }

  getMetaSegundoAnoMandato() {
    return this.formPlanoMeta.get("metaSegundoAnoMandato").hasError("required")
      ? "Campo meta anual para " +
          this.objetoPlanoMetaAno.segundoAnoMandato +
          " é obrigátorio"
      : "";
  }

  getMetaTerceiroAnoMandato() {
    return this.formPlanoMeta.get("metaTerceiroAnoMandato").hasError("required")
      ? "Campo meta anual para " +
          this.objetoPlanoMetaAno.terceiroAnoMandato +
          " é obrigátorio"
      : "";
  }

  getMetaQuartoAnoMandato() {
    return this.formPlanoMeta.get("metaQuartoAnoMandato").hasError("required")
      ? "Campo meta anual para " +
          this.objetoPlanoMetaAno.quartoAnoMandato +
          " é obrigátorio"
      : "";
  }

  getOrcamentoPrevisto() {
    return this.formPlanoMeta.get("orcamentoPrevisto").hasError("required")
      ? "Campo orçamento previsto é obrigátorio"
      : "";
  }

  getOrcamentoExecutado() {
    return this.formPlanoMeta.get("orcamentoExecutado").hasError("required")
      ? "Campo orçamento executado é obrigátorio"
      : "";
  }

  getJustificativa() {
    return this.formPlanoMeta.get("justificativa").hasError("required")
      ? "Campo justificativa de alteração é obrigátorio"
      : "";
  }
}
