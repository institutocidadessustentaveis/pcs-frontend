import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GrupoAcademicoPainelComponent } from './grupo-academico-painel.component';


const routes: Routes = [
  {
    path: '',
    component: GrupoAcademicoPainelComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoAcademicoPainelRoutingModule { }
