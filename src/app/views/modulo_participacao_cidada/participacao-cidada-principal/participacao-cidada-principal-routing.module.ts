import { ParticipacaoCidadaPrincipalComponent } from './participacao-cidada-principal.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ParticipacaoCidadaPrincipalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipacaoCidadaPrincipalRoutingModule { }
