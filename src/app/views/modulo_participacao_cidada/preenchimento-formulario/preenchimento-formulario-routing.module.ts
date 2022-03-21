import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreenchimentoFormularioComponent } from './preenchimento-formulario.component';

const routes: Routes = [
  {
    path: ':link',
    component: PreenchimentoFormularioComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreenchimentoFormularioRoutingModule { }
