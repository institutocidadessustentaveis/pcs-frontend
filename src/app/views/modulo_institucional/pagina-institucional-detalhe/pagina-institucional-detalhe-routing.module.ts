import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaginaInstitucionalDetalheComponent } from './pagina-institucional-detalhe.component';


const routes: Routes = [
  {
    path: '',
    component: PaginaInstitucionalDetalheComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaginaInstitucionalDetalheRoutingModule { }
