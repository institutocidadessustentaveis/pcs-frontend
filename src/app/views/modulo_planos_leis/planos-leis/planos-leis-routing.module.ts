import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanosLeisComponent } from './planos-leis.component';


const routes: Routes = [
  {
    path: '',
    component: PlanosLeisComponent,
    redirectTo: "/planos-leis-regulamentacoes/mapa-macrozoneamento",
    pathMatch: 'full'
  },
  {
    path: 'mapa-macrozoneamento', loadChildren: '../plano-leis-regulamentacao/plano-leis-regulamentacao.module#PlanoLeisRegulamentacaoModule', data: {title: 'Mapa de Macrozoneamento'},
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanosLeisRoutingModule { }
