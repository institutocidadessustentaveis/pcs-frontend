
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticiasInicialComponent } from './noticias-inicial.component';

const routes: Routes = [
  {
    path: '',
    component: NoticiasInicialComponent,
    canActivate: []
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticiasInicialRoutingModule { }
