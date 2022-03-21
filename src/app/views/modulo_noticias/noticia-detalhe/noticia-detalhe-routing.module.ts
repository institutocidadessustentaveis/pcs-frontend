import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoticiaDetalheComponent } from './noticia-detalhe.component';

const routes: Routes = [
  {
    path: ':id',
    component: NoticiaDetalheComponent,
    data: {title: 'Detalhes da Notícia'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticiaDetalheRoutingModule { }
