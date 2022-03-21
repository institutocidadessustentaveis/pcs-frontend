import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuscarComponent } from './buscar.component';

const routes: Routes = [
  {
    path: '',
    component: BuscarComponent,
    data: {title: 'Buscar » Buscar'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuscarRoutingModule { }
