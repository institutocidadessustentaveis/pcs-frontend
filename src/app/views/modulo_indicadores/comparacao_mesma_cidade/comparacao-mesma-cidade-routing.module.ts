import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompararIndicadoresDiferentesMesmaCidadeDetalhesComponent } from '../comparacao_mesma_cidade_detalhes/comparacao-mesma-cidade-detalhes.component';
import { CompararIndicadoresDiferentesMesmaCidadeGraficosComponent } from '../comparacao_mesma_cidade_graficos/comparacao-mesma-cidade-graficos.component';
import { CompararIndicadoresDiferentesMesmaCidadeComponent } from './comparacao-mesma-cidade.component';
const routes: Routes = [
  {
    path: '',
    component: CompararIndicadoresDiferentesMesmaCidadeComponent,
  },
  {
    path: 'detalhes/:id',
    component: CompararIndicadoresDiferentesMesmaCidadeDetalhesComponent,
  },
  {
    path: 'graficos/:id/:cidade/:uf',
    component: CompararIndicadoresDiferentesMesmaCidadeGraficosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompararIndicadoresDiferentesMesmaCidadeRoutingModule { }
