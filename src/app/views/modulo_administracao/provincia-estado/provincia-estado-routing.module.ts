import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProvinciaEstadoComponent } from './provincia-estado.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { ProvinciaEstadoFormComponent } from '../provincia-estado-form/provincia-estado-form.component';

const routes: Routes = [
  {
    path: '',
    component: ProvinciaEstadoComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_ESTADO'}
  },
  {
    path: 'cadastrar',
    component: ProvinciaEstadoFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_PROVINCIA_ESTADO', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: ProvinciaEstadoFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_PROVINCIA_ESTADO', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvinciaEstadoRoutingModule { }
