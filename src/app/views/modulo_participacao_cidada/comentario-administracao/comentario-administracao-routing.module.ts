import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComentarioAdministracaoComponent } from './comentario-administracao.component';

const routes: Routes = [
  {
    path: '',
    component: ComentarioAdministracaoComponent
  },
  {
    path: 'cadastro', loadChildren: '../comentario-form/comentario-form.module#ComentarioFormModule', data: {title: 'Cadastro De Comentário'}
  },
  {
    path:'editar/:id', loadChildren: '../comentario-form/comentario-form.module#ComentarioFormModule', data: {title: 'Editar Comentário'}

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComentarioAdministracaoRoutingModule { }
