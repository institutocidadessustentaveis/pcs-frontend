import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContribuicoesAcademicasPrincipalComponent } from './contribuicoes-academicas-principal.component';

const routes: Routes = [
  {
    path: '',
  },
  {
    path: 'grupos-academicos/administracao',
    loadChildren: 'src/app/views/modulo_contribuicoes_academicas/grupo-academico-administracao/grupo-academico-administracao.module#GrupoAcademicoAdministracaoModule',
    data: {title: 'Administração'}
  },

  {
    path: 'grupos-academicos',
    loadChildren: 'src/app/views/modulo_contribuicoes_academicas/grupos-academicos/grupos-academicos.module#GruposAcademicosModule',
    data: {title: 'Grupos Acadêmicos'}
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContribuicoesAcademicasPrincipalRoutingModule { }
