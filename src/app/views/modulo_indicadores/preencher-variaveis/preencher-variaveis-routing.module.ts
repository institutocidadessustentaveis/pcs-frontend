import { NgModule } from '@angular/core';
import { PreencherVariaveisComponent } from './preencher-variaveis.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PreencherVariaveisComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreencherVariaveisRoutingModule { }
