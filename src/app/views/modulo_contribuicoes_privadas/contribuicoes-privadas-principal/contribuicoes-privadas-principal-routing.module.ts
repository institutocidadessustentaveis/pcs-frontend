import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContribuicoesPrivadasPrincipalComponent } from './contribuicoes-privadas-principal.component';

const routes: Routes = [
  {
    path: '',
    component: ContribuicoesPrivadasPrincipalComponent,
  },

  {
    path: 'empresas-e-fundacoes',
    loadChildren: 'src/app/views/modulo_contribuicoes_privadas/empresas/empresas.module#EmpresasModule',
    data: {title: 'Empresas'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContribuicoesPrivadasPrincipalRoutingModule { }
