import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioListComponent } from './formulario-list.component';
import { FormularioFormComponent } from '../formulario-form/formulario-form.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: FormularioListComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_FORMULARIO', title: 'Administração de Formulários'}
  },
  {
    path: 'cadastrar',
    component: FormularioFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_FORMULARIO', title: 'Cadastro de Formulários'}
  },
  {
    path: 'editar/:id',
    component: FormularioFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_FORMULARIO', title: 'Edição de Formulários'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormularioListRoutingModule { }
