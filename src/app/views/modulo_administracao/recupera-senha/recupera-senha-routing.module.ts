import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecuperaSenhaComponent } from './recupera-senha.component';

const routes: Routes = [
  {
    path: '',
    component: RecuperaSenhaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecuperaSenhaRoutingModule { }
