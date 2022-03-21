
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PropostaMunicipioComponent } from './proposta-municipio.component';

const routes: Routes = [
  {
    path: ':sigla/:cidade',
    component: PropostaMunicipioComponent,
    data: {title: 'Participação Cidadã » Proposta para o Município'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropostaMunicipioRoutingModule { }
