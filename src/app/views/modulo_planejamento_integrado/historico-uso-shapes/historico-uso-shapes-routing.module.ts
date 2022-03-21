import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoricoUsoShapesComponent } from './historico-uso-shapes.component';

const routes: Routes = [
  {path: '', component: HistoricoUsoShapesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricoUsoShapesRoutingModule { }
