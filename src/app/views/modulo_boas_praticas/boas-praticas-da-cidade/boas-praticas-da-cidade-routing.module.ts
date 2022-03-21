import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoasPraticasDaCidadeComponent } from './boas-praticas-da-cidade.component';

const routes: Routes = [
  {
    path: '',
    component: BoasPraticasDaCidadeComponent
  },
  {
    path: ':id',
    component: BoasPraticasDaCidadeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoasPraticasDaCidadeRoutingModule { }
