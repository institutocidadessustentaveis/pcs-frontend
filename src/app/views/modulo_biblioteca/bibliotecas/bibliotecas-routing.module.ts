import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BibliotecasComponent } from './bibliotecas.component';


const routes: Routes = [
  {
    path: '',
    component: BibliotecasComponent,
  },
  {path: 'administracao',
   loadChildren: '../biblioteca-administracao/biblioteca-administracao.module#BibliotecaAdministracaoModule', data: {title: 'Administração '}
  },
  {path: 'detalhe',
   loadChildren: '../bibliotecas-detalhe/bibliotecas-detalhe.module#BibliotecasDetalheModule', data: {title: 'Detalhe'}
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BibliotecasRoutingModule { }
