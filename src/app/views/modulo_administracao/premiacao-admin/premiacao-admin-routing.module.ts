import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PremiacaoAdminComponent } from './premiacao-admin.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { PremiacaoAdminFormComponent } from '../premiacao-admin-form/premiacao-admin-form.component';

const routes: Routes = [
  {
    path: '',
    component: PremiacaoAdminComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMINISTRAR_PREMIACOES'}
  },
  {
    path: 'cadastrar',
    component: PremiacaoAdminFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMINISTRAR_PREMIACOES', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: PremiacaoAdminFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMINISTRAR_PREMIACOES', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PremiacaoAdminRoutingModule { }
