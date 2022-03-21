import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShapeFilesDetalheVisualizarComponent } from '././shapefiles-detalhe-visualizar.component';

const routes: Routes = [
  {
    path: 'detalhes/:id',
    component: ShapeFilesDetalheVisualizarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShapeFilesDetalheVisualizarRoutingModule { }
