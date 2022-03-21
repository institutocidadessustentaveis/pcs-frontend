import { FaqAdministracaoComponent } from './faq-administracao.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: FaqAdministracaoComponent
  },
  {
    path: 'cadastro', 
    loadChildren: '../faq-form/faq-form.module#FaqFormModule', 
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_CADASTRAR_FAQ', title: 'Cadastro De Pergunta'}
  },
  {
    path:'editar/:id', 
    loadChildren: '../faq-form/faq-form.module#FaqFormModule', 
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_EDITAR_FAQ', title: 'Editar Pergunta'}

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqAministracaoRoutingModule { }

