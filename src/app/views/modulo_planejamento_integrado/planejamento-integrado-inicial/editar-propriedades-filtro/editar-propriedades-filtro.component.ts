
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-propriedades-filtro',
  templateUrl: './editar-propriedades-filtro.component.html',
  styleUrls: ['./editar-propriedades-filtro.component.css']
})
export class EditarPropriedadesFiltroComponent implements OnInit {
  public style = {
    color: '#3388ff',
    fillColor: null,
    fillOpacity: 0.2,
    weight: 4
  };

  constructor(
    public dialogRef: MatDialogRef<EditarPropriedadesFiltroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
    this.style.color =  this.data.obj.color;
    this.style.fillColor = this.data.obj.fillColor;
    this.style.fillOpacity = this.data.obj.fillOpacity;
    this.style.weight = this.data.obj.weight;
  }


  public salvar() {
    this.dialogRef.close(this.style);
  }

  public cancelar() {
    this.dialogRef.close(null);
  }

}
