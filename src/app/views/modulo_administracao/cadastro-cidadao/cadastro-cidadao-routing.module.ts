import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CadastroCidadaoComponent } from './cadastro-cidadao.component';

const routes: Routes = [
  {
    path: '',
    component: CadastroCidadaoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadastroCidadaoRoutingModule { }
