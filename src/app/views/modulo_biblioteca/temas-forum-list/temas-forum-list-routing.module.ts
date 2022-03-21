import { TemasForumFormComponent } from './../temas-forum-form/temas-forum-form.component';
import { TemasForumListComponent } from './temas-forum-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: TemasForumListComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_TEMA_FORUM'}
  },
  {
    path: 'cadastrar',
    component: TemasForumFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_TEMA_FORUM', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: TemasForumFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_TEMA_FORUM', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemasForumListRoutingModule { }