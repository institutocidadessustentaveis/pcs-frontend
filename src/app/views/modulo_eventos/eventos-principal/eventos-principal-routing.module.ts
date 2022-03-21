import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventosPrincipalComponent } from './eventos-principal.component';

const routes: Routes = [
  {
    path: '',
    component: EventosPrincipalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosPrincipalRoutingModule { }
