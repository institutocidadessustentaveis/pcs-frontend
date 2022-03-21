import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EixosPcsComponent } from './eixos-pcs.component';

const routes: Routes = [
  {
    path: '',
    component: EixosPcsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EixosPcsRoutingModule { }
