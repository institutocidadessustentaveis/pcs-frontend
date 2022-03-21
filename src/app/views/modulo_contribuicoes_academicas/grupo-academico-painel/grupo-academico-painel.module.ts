import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatProgressBarModule } from '@angular/material';
import { GrupoAcademicoPainelComponent } from './grupo-academico-painel.component';
import { GrupoAcademicoPainelRoutingModule } from './grupo-academico-painel-routing.module';

@NgModule({
  declarations: [GrupoAcademicoPainelComponent],
  imports: [
    CommonModule,
    MatIconModule,
    GrupoAcademicoPainelRoutingModule,
  ],
  exports: [
    GrupoAcademicoPainelComponent
  ]
})
export class GrupoAcademicoPainelModule { }
