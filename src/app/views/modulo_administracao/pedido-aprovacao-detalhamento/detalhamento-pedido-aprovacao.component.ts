
import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material';
import { PedidoAprovacaoPrefeitura } from 'src/app/model/pedido-aprovacao-prefeitura';
import { AprovacaoPrefeituraService } from 'src/app/services/aprovacao-prefeitura.service';
import swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PedidoAprovacaoPrefeituraSimples } from 'src/app/model/pedido-aprovacao-prefeitura-simples';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: "app-detalhamento-pedido-aprovacao",
  templateUrl: "./detalhamento-pedido-aprovacao.component.html",
  styleUrls: ["./detalhamento-pedido-aprovacao.component.css"]
})
export class DetalhamentoPedidoAprovacaoComponent implements OnInit {
  mostrarApenasPdf: String = "Apenas PDF";
  imagens: string[] = [];
  pedidoAprovacao: PedidoAprovacaoPrefeitura;
  form: FormGroup;
  scrollUp: any;
  alerta(titulo: any, tipo: any) {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: titulo,
      type: tipo,
      reverseButtons: true
    });
  }

  constructor(
    private dialog: MatDialogRef<DetalhamentoPedidoAprovacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PedidoAprovacaoPrefeitura,
    private justificativaDialog: MatDialog,
    private service: AprovacaoPrefeituraService,
    private formBuilder: FormBuilder,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.pedidoAprovacao = data;
    this.form = this.formBuilder.group({
      inicioMandato: ["", Validators.required],
      fimMandato: ["", Validators.required],
      nomePrefeito: ["", Validators.required],
      email: ["", Validators.required],
      telefone: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.pedidoAprovacao.prefeitura.cartaCompromisso.forEach(carta => {
      this.imagens.push(carta.arquivo);
    });
    this.form.controls.nomePrefeito.setValue(this.pedidoAprovacao.prefeitura.nome)
    this.form.controls.email.setValue(this.pedidoAprovacao.prefeitura.email)
    this.form.controls.telefone.setValue(this.pedidoAprovacao.prefeitura.telefone)
  }

  mostrarAprovar(): boolean {
    return this.pedidoAprovacao.status === "Pendente";
  }

  mostrarReprovar(): boolean {
    return this.pedidoAprovacao.status === "Pendente";
  }

  aprovar(pedido: PedidoAprovacaoPrefeitura) {
    this.pedidoAprovacao.inicioMandato = this.form.controls.inicioMandato.value;
    this.pedidoAprovacao.fimMandato = this.form.controls.fimMandato.value;
    this.pedidoAprovacao.prefeitura.nome = this.form.controls.nomePrefeito.value;
    this.pedidoAprovacao.prefeitura.email = this.form.controls.email.value;
    this.pedidoAprovacao.prefeitura.telefone = this.form.controls.telefone.value;
    this.pedidoAprovacao.id = pedido.id;

    if (this.pedidoAprovacao.inicioMandato && this.pedidoAprovacao.fimMandato) {
      this.service.aprovar(this.pedidoAprovacao).subscribe(response => {
        PcsUtil.swal()
          .fire({
            title: "Detalhamento de Pedido de Aprovação de Prefeitura",
            text: `Pedido de prefeitura aprovado.`,
            type: "success",
            showCancelButton: false,
            confirmButtonText: "Ok"
          })
          .then(
            result => {
              this.dialog.close();
            },
            error => {}
          );
      });
    }
  }

  reprovar(pedido: PedidoAprovacaoPrefeitura) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "40%";

    let dialog = this.justificativaDialog.open(
      JustificativaReprovacaoDialog,
      dialogConfig
    );

    dialog.afterClosed().subscribe(justificativa => {
      if (justificativa != null && justificativa !== "") {
        this.pedidoAprovacao.justificativa = justificativa;
        this.service
          .reprovar(pedido.id, this.pedidoAprovacao.justificativa)
          .subscribe(response => {
            PcsUtil.swal()
              .fire({
                title: "Detalhamento de Pedido de Aprovação de Prefeitura",
                text: `Pedido de prefeitura reprovado`,
                type: "success",
                showCancelButton: false,
                confirmButtonText: "Ok"
              })
              .then(
                result => {
                  this.dialog.close();
                },
                error => {}
              );
          });
      }
    });
  }

  validarPeriodoMandato(): boolean {
    return (
      this.form.controls.inicioMandato.value >
      this.form.controls.fimMandato.value
    );
  }

  voltar() {
    this.dialog.close();
  }
}

@Component({
  selector: 'justificativa-reprovacao',
  templateUrl: 'justificativa-reprovacao.html',
  styleUrls: ['./detalhamento-pedido-aprovacao.component.css']
})
export class JustificativaReprovacaoDialog {

  constructor(
    public dialogRef: MatDialogRef<JustificativaReprovacaoDialog>,
    @Inject(MAT_DIALOG_DATA) public justificativa: string,
    private service: AprovacaoPrefeituraService) { }

  voltarJustificativaDialog(): void {
    this.justificativa = null;
    this.dialogRef.close();
  }

}
