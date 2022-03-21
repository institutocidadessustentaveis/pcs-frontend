import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { NoticiaListComponent } from './noticia-list/noticia-list.component';
import { NoticiaFormComponent } from './noticia-form/noticia-form.component';
import { PreVisualizacaoNoticiaComponent } from './pre-visualizacao-noticia/pre-visualizacao-noticia.component';

const routes: Routes = [
  {
    path: '',
    component: NoticiaListComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_NOTICIA'}
  },
  {
    path: 'cadastrar',
    component: NoticiaFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_NOTICIA', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: NoticiaFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_NOTICIA', title: 'Editar'}
  },
  {
    path: 'pre-visualizacao',
    component: PreVisualizacaoNoticiaComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_NOTICIA', title: 'Pré-visualização'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticiaRoutingModule { }
