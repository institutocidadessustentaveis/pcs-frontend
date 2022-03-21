import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicadoresVisualizarComponent } from './indicadores-visualizar.component';

const routes: Routes = [
  {
    path: ':idIndicador',
    component: IndicadoresVisualizarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicadoresVisualizarRoutingModule { }
