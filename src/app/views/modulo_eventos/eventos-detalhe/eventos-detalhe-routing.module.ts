import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventosDetalheComponent } from './eventos-detalhe.component';


const routes: Routes = [
  {
    path: ':idEvento',
    component: EventosDetalheComponent,
    data: {title: 'Detalhe'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosDetalheRoutingModule { }
