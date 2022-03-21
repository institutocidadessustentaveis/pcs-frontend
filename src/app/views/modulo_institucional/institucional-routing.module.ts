import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstitucionalComponent } from './institucional.component';
import { PaginaInstitucionalDetalheComponent } from './pagina-institucional-detalhe/pagina-institucional-detalhe.component';
import { OdsInstitucionalComponent } from './ods-institucional/ods-institucional.component';

const routes: Routes = [
    {
    path: 'ods',
    component: OdsInstitucionalComponent,
    data: {title: 'ODS'}
  },
  {
    path: 'ods/:id',
    component: OdsInstitucionalComponent,
    data: {title: 'ODS'}
  },
  {
    path: '',
    redirectTo: '/institucional/pagina/pcs'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitucionalRoutingModule { }
