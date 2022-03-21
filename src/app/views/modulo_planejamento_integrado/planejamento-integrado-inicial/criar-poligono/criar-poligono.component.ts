import { PoligonoDados } from '../../../../model/poligono-dados';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShapeAtributo } from 'src/app/model/shape-atributo';
import { ShapeItemService } from 'src/app/services/shape-item.service';

@Component({
  selector: 'app-criar-poligono',
  templateUrl: './criar-poligono.component.html',
  styleUrls: ['./criar-poligono.component.css']
})
export class CriarPoligonoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CriarPoligonoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit() {
  }

  public adicionarAtributo() {
    this.data.lista.push(new PoligonoDados());
  }

  public removerAtributo(index: number) {
    this.data.lista.splice(index, 1);
  }

  public salvarAtributosDoShape() {
      this.dialogRef.close(this.data);
  }

  public cancelar() {
    this.dialogRef.close(null);
  }

  public selectPoint(item: any) {
    this.data.capturar = true;
    this.data.itemSelecionado = item;
    this.dialogRef.close(this.data);
  }

  public selecionarGrauDistancia(item: any) {
    item.selGrauDistancia = true;
    item.selLatLong = false;
    item.hideBtnsSel = true;
  }

  public selecionarLatLong(item: any) {
    item.selGrauDistancia = false;
    item.selLatLong = true;
    item.hideBtnsSel = true;
  }

}
