import { color } from 'html2canvas/dist/types/css/types/color';

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-indice-secao',
  templateUrl: './editar-indice-secao.component.html',
  styleUrls: ['./editar-indice-secao.component.css']
})
export class EditarIndiceSecaoComponent implements OnInit {

  public secao: any;

  constructor(
    public dialogRef: MatDialogRef<EditarIndiceSecaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (this.data.obj) {
      this.secao =  this.data.obj;

    }
  }

  public salvar() {
    this.dialogRef.close(this.secao);
  }

  public cancelar() {
    this.dialogRef.close(null);
  }

}
