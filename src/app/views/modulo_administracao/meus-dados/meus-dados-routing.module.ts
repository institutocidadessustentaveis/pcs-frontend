import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeusDadosComponent } from './meus-dados.component';

const routes: Routes = [
  {
    path: '',
    component: MeusDadosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeusDadosRoutingModule { }
