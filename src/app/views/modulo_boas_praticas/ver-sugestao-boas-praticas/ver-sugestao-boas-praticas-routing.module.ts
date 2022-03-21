import { RoleGuard } from 'src/app/guards/role.guard';
import { AuthGuard } from './../../../guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerSugestaoBoasPraticasComponent } from './ver-sugestao-boas-praticas.component';
import { VerSugestaoBoasPraticasDetalhadoComponent } from '../ver-sugestao-boas-praticas-detalhado/ver-sugestao-boas-praticas-detalhado.component';

const routes: Routes = [
  {
    path: '',
    component: VerSugestaoBoasPraticasComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_SUGESTAO_BOA_PRATICA'}},
  {
    path: ':id',
    component: VerSugestaoBoasPraticasDetalhadoComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_SUGESTAO_BOA_PRATICA'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerSugestaoBoasPraticasRoutingModule { }
