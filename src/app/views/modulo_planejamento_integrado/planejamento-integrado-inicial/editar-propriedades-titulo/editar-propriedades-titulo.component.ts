import { color } from 'html2canvas/dist/types/css/types/color';

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LeafletUtilService } from 'src/app/services/leaflet-util.service';
import { Titulo } from 'src/app/model/titulo';

@Component({
  selector: 'app-editar-propriedades-titulo',
  templateUrl: './editar-propriedades-titulo.component.html',
  styleUrls: ['./editar-propriedades-titulo.component.css']
})
export class EditarPropriedadesTituloComponent implements OnInit {

  public titulo = new Titulo();

  constructor(
    public dialogRef: MatDialogRef<EditarPropriedadesTituloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    if (this.data.obj) {
      this.titulo.color =  this.data.obj.color;
      this.titulo.backgroundColor = this.data.obj.backgroundColor;
      this.titulo.fontSize = this.data.obj.fontSize;
      this.titulo.texto = this.data.obj.texto;
    }
  }

  public adicionarAtributo() {
    this.data.propriedades.push('');
  }

  public removerAtributo(index: number) {
    this.data.propriedades.splice(index, 1);
  }

  public salvar() {

    this.dialogRef.close(this.titulo);
  }

  public cancelar() {
    this.dialogRef.close(null);
  }

}
