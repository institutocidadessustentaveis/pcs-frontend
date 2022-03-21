import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShapeItemAtributosPipe } from './shape-item-atributos.pipe';

@NgModule({
  declarations: [ShapeItemAtributosPipe],
  imports: [
    CommonModule
  ],
  exports: [
    ShapeItemAtributosPipe
  ]
})
export class ShapeItemAtributosModule { }
