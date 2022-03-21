import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormularioAtendimentoComponent } from './formulario-atendimento.component';

const routes: Routes = [
  {
    path: '',
    component: FormularioAtendimentoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormularioAtendimentoRoutingModule { }
