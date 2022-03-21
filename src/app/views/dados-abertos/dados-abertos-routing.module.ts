import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DadosAbertosComponent } from './dados-abertos.component';

const routes: Routes = [
  {
    path: '',
    component: DadosAbertosComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DadosAbertosRoutingModule { }
