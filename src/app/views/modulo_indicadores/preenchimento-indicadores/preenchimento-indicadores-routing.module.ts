import { PreenchimentoIndicadoresComponent } from './preenchimento-indicadores.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PreenchimentoIndicadoresComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreenchimentoIndicadoresRoutingModule { }
