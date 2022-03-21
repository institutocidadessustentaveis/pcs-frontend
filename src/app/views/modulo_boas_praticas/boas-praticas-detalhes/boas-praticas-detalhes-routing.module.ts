import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoaPraticaDetalheComponent } from './boa-pratica-detalhe.component';

const routes: Routes = [
  {
    path: '',
    component: BoaPraticaDetalheComponent,
    data: {title: 'Detalhes'}
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoasPraticasDetalhesRoutingModule { }
