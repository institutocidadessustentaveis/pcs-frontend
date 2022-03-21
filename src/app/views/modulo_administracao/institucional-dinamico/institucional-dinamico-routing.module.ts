import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstitucionalDinamicoComponent } from './institucional-dinamico.component';


const routes: Routes = [
  {
    path: '',
    component: InstitucionalDinamicoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitucionalDinamicoRoutingModule { }
