
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaginaInicialComponent } from './pagina-inicial.component';

const routes: Routes = [
  {
    path: '',
    component: PaginaInicialComponent,
    canActivate: []
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaginaInicialRoutingModule { }
