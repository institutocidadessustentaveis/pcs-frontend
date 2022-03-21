import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanosLeisComponent } from './planos-leis.component';
import { PlanosLeisRoutingModule } from './planos-leis-routing.module';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { PlanoLeisRegulamentacaoComponent } from '../plano-leis-regulamentacao/plano-leis-regulamentacao.component';
import { PlanoLeisRegulamentacaoModule } from '../plano-leis-regulamentacao/plano-leis-regulamentacao.module';

@NgModule({
  declarations: [PlanosLeisComponent],
  imports: [
    CommonModule,
    PlanosLeisRoutingModule,
    BreadcrumbModule
  ],
  exports: [
    PlanosLeisComponent
  ]
})
export class PlanosLeisModule { }
