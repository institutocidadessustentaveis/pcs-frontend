import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeradorUrlIndicadorPipe } from './gerador-url-indicador.pipe';

@NgModule({
  declarations: [GeradorUrlIndicadorPipe],
  imports: [
    CommonModule
  ],
  exports: [GeradorUrlIndicadorPipe]
})
export class GeradorUrlIndicadorModule { }
