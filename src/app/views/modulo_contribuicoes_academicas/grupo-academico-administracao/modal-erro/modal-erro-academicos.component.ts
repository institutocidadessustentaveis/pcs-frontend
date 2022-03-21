import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-modal-erro-academicos',
  templateUrl: './modal-erro-academicos.component.html',
  styleUrls: ['./modal-erro-academicos.component.css']
})
export class ModalErroAcademicosComponent implements OnInit {

  erros = new Array<string>();
  constructor(
              @Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<ModalErroAcademicosComponent>) { }

  ngOnInit() {
    let mensagem = this.data.mensagem;
    while(mensagem.includes('\n')){
      let msg = mensagem.substring(0, mensagem.indexOf('\n'));
      mensagem = mensagem.replace(`${msg}\n`, '');
      this.erros.push(msg);
    }
  }

}
