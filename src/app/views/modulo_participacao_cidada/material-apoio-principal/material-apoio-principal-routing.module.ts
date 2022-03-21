import { MaterialApoioPrincipalComponent } from './material-apoio-principal.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialApoioDetalheComponent } from '../material-apoio-detalhe/material-apoio-detalhe.component';

const routes: Routes = [
  {
    path: '',
    component: MaterialApoioPrincipalComponent,
  },

  {
    path: 'detalhe/:id',
    component: MaterialApoioDetalheComponent,
    data: {title: 'Detalhe'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialApoioPrincipalRoutingModule { }