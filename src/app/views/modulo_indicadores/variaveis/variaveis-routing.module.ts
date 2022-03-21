import { VariavelComponent } from './variaveis.component';
import { RoleGuard } from './../../../guards/role.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VariavelListComponent } from './variaveis-list.component';

const routes: Routes = [
  {
    path: '',
    component: VariavelListComponent,
    canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_VISUALIZAR_VARIAVEL'}
  },
  {
    path: 'cadastrar',
    component: VariavelComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_VARIAVEL', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: VariavelComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_VARIAVEL', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariaveisRoutingModule { }
