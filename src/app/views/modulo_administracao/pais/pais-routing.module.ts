import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaisComponent } from './pais.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { PaisFormComponent } from '../pais-form/pais-form.component';

const routes: Routes = [
  {
    path: '',
    component: PaisComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_PAIS'}
  },
  {
    path: 'cadastrar',
    component: PaisFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_PAIS', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: PaisFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_USUARIO', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaisRoutingModule { }
