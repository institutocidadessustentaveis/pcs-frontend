import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BomIndicadorComponent } from './bom-indicador.component';

const routes: Routes = [
  {
    path: '',
    component: BomIndicadorComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BomIndicadorRoutingModule { }
