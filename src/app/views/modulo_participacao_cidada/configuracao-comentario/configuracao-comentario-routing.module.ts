import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfiguracaoComentarioComponent } from './configuracao-comentario.component';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracaoComentarioComponent,
    data: {title: 'Configuração comentário'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracaoComentarioRoutingModule { }
