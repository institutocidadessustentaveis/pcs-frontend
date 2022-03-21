import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BibliotecasDetalheComponent } from './bibliotecas-detalhe.component';


const routes: Routes = [
  {
    path: ':idBiblioteca',
    component: BibliotecasDetalheComponent,
    data: {title: 'Detalhe'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BibliotecasDetalheRoutingModule { }
