import { EventosComponent } from './eventos.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';


const routes: Routes = [
  {
    path: '',
    component: EventosComponent ,
  },
  {
    path: 'editar/:id', 
    loadChildren: '../eventos-form/eventos-form.module#EventosFormModule', 
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_EDITAR_EVENTO', title: 'Editar Evento'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
