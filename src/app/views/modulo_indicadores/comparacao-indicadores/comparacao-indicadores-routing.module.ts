import { ComparacaoIndicadoresComponent } from './comparacao-indicadores.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ComparacaoIndicadoresComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComparacaoIndicadoresRoutingModule { }
