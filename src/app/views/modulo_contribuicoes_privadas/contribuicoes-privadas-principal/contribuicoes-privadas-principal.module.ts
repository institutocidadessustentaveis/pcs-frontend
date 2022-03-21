import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { MatButtonModule, MatInputModule, MatSelectModule, MatIconModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { ContribuicoesPrivadasPrincipalComponent } from './contribuicoes-privadas-principal.component';
import { ContribuicoesPrivadasPrincipalRoutingModule } from './contribuicoes-privadas-principal-routing.module';
import { CardContribuicoesAcademicasModule } from '../../modulo_contribuicoes_academicas/card-contribuicoes-academicas/card-contribuicoes-academicas.module';

@NgModule({
  declarations: [ContribuicoesPrivadasPrincipalComponent],
  imports: [
    CommonModule,
    ContribuicoesPrivadasPrincipalRoutingModule,
    BreadcrumbModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatCheckboxModule,
    CardContribuicoesAcademicasModule,
    MatTooltipModule
  ]
})
export class ContribuicoesPrivadasPrincipalModule { }
