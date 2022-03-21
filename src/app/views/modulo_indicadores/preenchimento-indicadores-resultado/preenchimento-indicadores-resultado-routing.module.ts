import { PreenchimentoIndicadoresResultadoComponent } from './preenchimento-indicadores-resultado.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PreenchimentoIndicadoresResultadoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreenchimentoIndicadoresResultadoRoutingModule { }
