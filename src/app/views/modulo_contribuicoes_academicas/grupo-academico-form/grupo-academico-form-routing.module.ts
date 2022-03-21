import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoAcademicoFormComponent } from './grupo-academico-form.component';

const routes: Routes = [
  {
    path: '',
    component: GrupoAcademicoFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoAcademicoFormRoutingModule { }
