import { RoleGuard } from './../../../guards/role.guard';
import { AuthGuard } from './../../../guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SugestaoBoasPraticasComponent } from './sugestao-boas-praticas.component';

const routes: Routes = [
  {
    path: '',
    component: SugestaoBoasPraticasComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_SUGESTAO_BOA_PRATICA'}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SugestaoBoasPraticasRoutingModule { }
