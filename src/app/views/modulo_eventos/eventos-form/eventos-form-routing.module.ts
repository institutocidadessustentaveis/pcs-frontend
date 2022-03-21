import { EventosComponent } from './../../relatorio/relatorios/eventos/eventos.component';
import { EventosFormComponent } from './eventos-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: EventosFormComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosFormRoutingModule { }
