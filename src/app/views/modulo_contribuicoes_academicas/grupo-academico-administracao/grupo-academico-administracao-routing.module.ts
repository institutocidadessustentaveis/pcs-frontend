import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoAcademicoAdministracaoComponent } from './grupo-academico-administracao.component';
import { GrupoAcademicoDetalhesComponent } from '../grupo-academico-detalhes/grupo-academico-detalhes.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: GrupoAcademicoAdministracaoComponent,
  },
  {path: 'cadastrar',
   loadChildren: 'src/app/views/modulo_contribuicoes_academicas/grupo-academico-form/grupo-academico-form.module#GrupoAcademicoFormModule',
   canActivate: [AuthGuard, RoleGuard],
   data: {role: 'ROLE_CADASTRAR_GRUPO_ACADEMICO', title: 'Cadastrar'}
  },
  {path: 'editar/:id',
  loadChildren: 'src/app/views/modulo_contribuicoes_academicas/grupo-academico-form/grupo-academico-form.module#GrupoAcademicoFormModule',
  canActivate: [AuthGuard, RoleGuard],
  data: {role: 'ROLE_EDITAR_GRUPO_ACADEMICO', title: 'Editar'}
  },
  {path: 'detalhes/:id',
  loadChildren: 'src/app/views/modulo_contribuicoes_academicas/grupo-academico-detalhes/grupo-academico-detalhes.module#GrupoAcademicoDetalhesModule',
  data: {title: 'Detalhes'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoAcademicoAdministracaoRoutingModule { }

