import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardContribuicoesAcademicasRoutingModule } from './card-contribuicoes-academica-routing.module';
import { CardContribuicoesAcademicasComponent } from './card-contribuicoes-academicas.component';

@NgModule({
  declarations: [CardContribuicoesAcademicasComponent],
  imports: [
    CommonModule,
    CardContribuicoesAcademicasRoutingModule
  ],
  exports: [
    CardContribuicoesAcademicasComponent
  ]
})
export class CardContribuicoesAcademicasModule { }
