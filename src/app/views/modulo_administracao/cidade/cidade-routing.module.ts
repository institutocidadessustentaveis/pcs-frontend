import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CidadeComponent } from './cidade.component';
import { RoleGuard } from 'src/app/guards/role.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CidadeFormComponent } from '../cidade-form/cidade-form.component';

const routes: Routes = [
  {
    path: '',
    component: CidadeComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_CIDADE'}
  },
  {
    path: 'cadastrar',
    component: CidadeFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_CIDADE', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: CidadeFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_CIDADE', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CidadeRoutingModule { }
