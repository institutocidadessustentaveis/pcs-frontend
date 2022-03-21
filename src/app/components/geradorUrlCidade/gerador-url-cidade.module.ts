import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeradorUrlCidadePipe } from './gerador-url-cidade.pipe';

@NgModule({
  declarations: [GeradorUrlCidadePipe],
  imports: [
    CommonModule
  ],
  exports: [GeradorUrlCidadePipe]
})
export class GeradorUrlCidadeModule { }
