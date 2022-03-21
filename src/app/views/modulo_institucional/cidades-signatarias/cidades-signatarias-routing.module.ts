import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoasPraticasCidadesSignatariasComponent } from '../boas-praticas-cidades-signatarias/boas-praticas-cidades-signatarias.component';
import { HistoricoCidadesSignatariasComponent } from '../historico-cidades-signatarias/historico-cidades-signatarias.component';
import { CidadesSignatariasComponent } from './cidades-signatarias.component'

const routes: Routes = [
  {
    path: '',
    component: CidadesSignatariasComponent
  },
  {
    path: 'historico',
    component: HistoricoCidadesSignatariasComponent
  },
  {
    path: 'boas-praticas-cidades-signatarias',
    component: BoasPraticasCidadesSignatariasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CidadesSignatariasRoutingModule { }
