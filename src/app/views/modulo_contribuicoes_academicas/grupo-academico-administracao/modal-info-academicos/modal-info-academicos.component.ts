import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-modal-info-academicos',
  templateUrl: './modal-info-academicos.component.html',
  styleUrls: ['./modal-info-academicos.component.css']
})
export class ModalInfoAcademicosComponent implements OnInit {

  qtdTotalErros;
  varPreenchidas;
  erros = new Array<string>();
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private dialogRef: MatDialogRef<ModalInfoAcademicosComponent>) { }

  ngOnInit() {
    this.varPreenchidas = this.data.qtdVariaveisPreenchidas;
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
