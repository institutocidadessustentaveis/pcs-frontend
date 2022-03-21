import { PainelIndicadoresSubdivisaoComponent } from './painel-indicadores-subdivisao.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaginaSubdivisaoComponent } from './pagina-subdivisao/pagina-subdivisao.component';

const routes: Routes = [
  {
    path: ':siglaestado/:nomecidade',
    component: PainelIndicadoresSubdivisaoComponent,
  },
  {
    path: ':siglaestado/:nomecidade/:subdivisao',
    component: PaginaSubdivisaoComponent,
  },
  {
    path: ':siglaestado/:nomecidade/:subdivisao/:indicador',
    component: PaginaSubdivisaoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PainelIndicadoresSubdivisaoRoutingModule { }
