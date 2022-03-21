import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-modal-erro',
  templateUrl: './modal-erro.component.html',
  styleUrls: ['./modal-erro.component.css']
})
export class ModalErroComponent implements OnInit {

  erros = new Array<string>();
  constructor(
              @Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<ModalErroComponent>) { }

  ngOnInit() {
    let mensagem = this.data.mensagem;
    while(mensagem.includes('\n')){
      let msg = mensagem.substring(0, mensagem.indexOf('\n'));
      mensagem = mensagem.replace(`${msg}\n`, '');
      this.erros.push(msg);
    }
  }

}
