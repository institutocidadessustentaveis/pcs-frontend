import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoAcademicoDetalhesComponent } from './grupo-academico-detalhes.component';

const routes: Routes = [
  {
   path: '',
   component: GrupoAcademicoDetalhesComponent,
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoAcademicoDetalhesRoutingModule { }
