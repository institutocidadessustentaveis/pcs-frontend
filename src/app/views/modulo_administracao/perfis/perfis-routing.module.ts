import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfisComponent } from './perfis.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { PerfilFormComponent } from './perfilForm.component';

const routes: Routes = [
  {
    path: '',
    component: PerfisComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_PERFIL'}
  },
  {
    path: 'cadastrar',
    component: PerfilFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_PERFIL', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: PerfilFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_PERFIL', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfisRoutingModule { }
