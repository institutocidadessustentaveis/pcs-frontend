import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoricoShapesComponent } from './historico-shapes.component';

const routes: Routes = [
  {path: '', component: HistoricoShapesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricoShapesRoutingModule { }
