import { TipoClassificacaoIndicadoresComponent } from './tipo-classificacao-indicadores.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: TipoClassificacaoIndicadoresComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoClassificacaoIndicadoresRoutingModule { }
