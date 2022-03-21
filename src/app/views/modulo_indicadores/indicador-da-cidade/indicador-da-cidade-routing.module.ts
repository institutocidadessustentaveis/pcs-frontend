import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvaliacaoVariaveisListComponent } from '../avaliacao-variaveis/avaliacao-variaveis-list.component';
import { IndicadorDaCidadeComponent } from './indicador-da-cidade.component';

const routes: Routes = [
  {
    path: ':indicador/:siglaestado/:cidade',
    component: IndicadorDaCidadeComponent,
    data: {title: 'Detalhes Indicador da Cidades'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicadorDaCidadeRoutingModule { }
