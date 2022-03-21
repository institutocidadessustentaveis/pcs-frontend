import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-modal-erro',
  templateUrl: './modal-info-variaveis.component.html',
  styleUrls: ['./modal-info-variaveis.component.css']
})
export class ModalInfoVariaveisComponent implements OnInit {

  qtdTotalErros;
  varPreenchidas;
  varPreenchidasSub;
  erros = new Array<string>();
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<ModalInfoVariaveisComponent>) { }

  ngOnInit() {
    this.varPreenchidas = this.data.qtdVariaveisPreenchidas;
    this.varPreenchidasSub = this.data.qtdVariaveisPreenchidasSub;
    let mensagem = this.data.erros;

    while(mensagem.includes('\n')){
      let msg = mensagem.substring(0, mensagem.indexOf('\n'));
      mensagem = mensagem.replace(`${msg}\n`, '');
      this.erros.push(msg);
    }
    this.qtdTotalErros = this.erros.length;
  }

  close(){
    this.dialogRef.close();
  }
}
