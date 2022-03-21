import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PontoFocalDetalhesComponent } from './ponto-focal-detalhes.component';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [PontoFocalDetalhesComponent],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  entryComponents: [
    PontoFocalDetalhesComponent
  ],
  exports: [PontoFocalDetalhesComponent]
})
export class PontoFocalDetalhesModule { }
