import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormularioAtendimento } from 'src/app/model/formulario-atendimento';
import { RespostaAtendimento } from 'src/app/model/resposta-atendimento';
import { Usuario } from 'src/app/model/usuario';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { RespostaAtendimentoService } from 'src/app/services/resposta-atendimento.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-modal-solicitacao',
  templateUrl: './modal-solicitacao.component.html',
  styleUrls: ['./modal-solicitacao.component.css']
})
export class ModalSolicitacaoComponent implements OnInit {

  public solicitacao: FormularioAtendimento;
  public resposta: string;
  public respostaRef: RespostaAtendimento;
  public usuarioLogado: Usuario;

  constructor(public dialogRef: MatDialogRef<ModalSolicitacaoComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: any,
    private respostaAtendimentoService: RespostaAtendimentoService,
    private usuarioService: UsuarioService) { }

  ngOnInit() {
    this.solicitacao = this.data.solicitacao;
    this.verificaResposta();
    this.buscarDadosUsuarioLogado();
  }

  public verificaResposta() {
    if(this.solicitacao.respondido) {
      const idFormulario = this.solicitacao.id;
      this.respostaAtendimentoService.buscarRespostaAtendimentoPorIdFormulario(idFormulario).subscribe(res => {
        console.log(res)
        this.respostaRef = res;
        this.resposta = this.respostaRef.resposta;
      });
    }
  }

  public salvarResposta() {
    const respostaAtendimento = new RespostaAtendimento();

    respostaAtendimento.idFormularioAtendimento = this.solicitacao.id;
    respostaAtendimento.resposta = this.resposta;
    respostaAtendimento.idUsuario = this.usuarioLogado.id;

    this.respostaAtendimentoService.salvarResposta(respostaAtendimento).subscribe(res => {
        PcsUtil.swal().fire({
          title: 'Sucesso',
          text: `Sua resposta foi enviada com sucesso`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        });
        this.dialogRef.close();
    });
  }

  public closeModal() {
    this.dialogRef.close();
  }

  buscarDadosUsuarioLogado() {
    this.usuarioService.buscarUsuarioLogado().subscribe(res => {
      this.usuarioLogado = res;
    });
  }

}
