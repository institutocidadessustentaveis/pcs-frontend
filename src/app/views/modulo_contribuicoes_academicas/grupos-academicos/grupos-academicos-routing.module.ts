import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GruposAcademicosComponent } from './grupos-academicos.component';

const routes: Routes = [
  {
    path: '',
    component: GruposAcademicosComponent,
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
export class GruposAcademicosRoutingModule { }
