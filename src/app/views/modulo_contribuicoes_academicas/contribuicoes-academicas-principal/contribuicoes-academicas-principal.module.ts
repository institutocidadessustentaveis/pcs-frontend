import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContribuicoesAcademicasPrincipalComponent } from './contribuicoes-academicas-principal.component';
import { ContribuicoesAcademicasPrincipalRoutingModule } from './contribuicoes-academicas-principal-routing.module';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { CardContribuicoesAcademicasModule } from './../card-contribuicoes-academicas/card-contribuicoes-academicas.module';
import { MatButtonModule, MatInputModule, MatSelectModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ ContribuicoesAcademicasPrincipalComponent],
  imports: [
    CommonModule,
    ContribuicoesAcademicasPrincipalRoutingModule,
    BreadcrumbModule,
    CardContribuicoesAcademicasModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
  ]
})
export class ContribuicoesAcademicasPrincipalModule { }
