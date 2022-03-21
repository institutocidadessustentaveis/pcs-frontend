import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpresasComponent } from './empresas.component';

const routes: Routes = [
  {
    path: '',
    component: EmpresasComponent,
  },
  {
    path: 'detalhes/:id',
    loadChildren: 'src/app/views/modulo_contribuicoes_academicas/grupo-academico-detalhes/grupo-academico-detalhes.module#GrupoAcademicoDetalhesModule',
    data: {title: 'Detalhes'}
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresasRoutingModule { }
