import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShapeAtributo } from 'src/app/model/shape-atributo';
import { ShapeItemService } from 'src/app/services/shape-item.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-editar-atributos',
  templateUrl: './editar-atributos.component.html',
  styleUrls: ['./editar-atributos.component.css']
})
export class EditarAtributosComponent implements OnInit {

  public inicialStateListAttribute = [];

  constructor(
    public dialogRef: MatDialogRef<EditarAtributosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public shapeItemService: ShapeItemService) {}

  ngOnInit() {
    this.inicialStateListAttribute = this.data.atributosParaEditar;
  }

  public adicionarAtributo() {
    this.data.atributosParaEditar.push(new ShapeAtributo());
  }

  public removerAtributo(index: number) {
    this.data.atributosParaEditar.splice(index, 1);
  }

  public salvarAtributosDoShape() {
    /*if(this.data.atributosParaEditar){
      for(let atributo of this.data.atributosParaEditar) {
        if(!isNaN(atributo.valor)){
          atributo.valor = +atributo.valor;
        }
      }
    }*/
    this.dialogRef.close(this.data.atributosParaEditar);

  }

  public cancelar() {
    this.dialogRef.close(this.data.atributosParaEditar);
  }

  setTypeInputPerAttributeType(attribute: string){
    if(this.verifyAttributeOnInicialStateList(attribute)){
      let itemAux = this.data.listaTipoAtributos.find(attr => attr.nome === attribute );
      if(itemAux) {
        if(itemAux.tipo === 'string' || itemAux.tipo === null) {
          return "text";
        } else {
          return "number";
        }
      } else { return "text"; }
    } else { return }
  }

  verifyAttributeOnInicialStateList(attribute){
    let attrExists = this.inicialStateListAttribute.find(attr => attr.atributo === attribute);

    if(attrExists){
      return true;
    } else {
      return false;
    }
  }

  isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
  }

}
