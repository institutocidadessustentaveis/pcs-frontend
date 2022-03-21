import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoricoCidadesSignatariasComponent } from './historico-cidades-signatarias.component';

const routes: Routes = [
  {
    path: '',
    component: HistoricoCidadesSignatariasComponent,
    data: {title: 'Histórico Cidades Signatárias'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricoCidadesSignatariasRoutingModule { }
