import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PainelIndicadoresCidadeComponent } from './painel-indicadores-cidade.component';
import { PainelIndicadoresCidadeDetalhesComponent } from './painel-indicadores-cidade-detalhes/painel-indicadores-cidade-detalhes.component';

const routes: Routes = [
  {
    path: '/old',
    component: PainelIndicadoresCidadeComponent,
  },
  {
    path: 'detalhes/:id',
    component: PainelIndicadoresCidadeDetalhesComponent,
  },
  {
    path: ':id',
    component: PainelIndicadoresCidadeDetalhesComponent,
  },
  {
    path: 'detalhes/:id/:siglaestado/:nomecidade',
    component: PainelIndicadoresCidadeDetalhesComponent,
  },
  {
    path: ':id/:siglaestado/:nomecidade',
    component: PainelIndicadoresCidadeDetalhesComponent,
  },
  {
    path: ':siglaestado/:nomecidade',
    component: PainelIndicadoresCidadeDetalhesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PainelIndicadoresCidadeRoutingModule { }
