import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';
import { UsuarioFormComponent } from './usuario_form.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: UsuariosComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_USUARIO', title: 'Usuário'}
  },
  {
    path: 'cadastrar',
    component: UsuarioFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_USUARIO', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: UsuarioFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_USUARIO', title: 'Editar'}
  },
  {
    path: 'visualizar/:id',
    component: UsuarioFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_USUARIO', title: 'Visualizar'}
  },
  {
    path: 'page/:page',
    component: UsuariosComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_USUARIO'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
