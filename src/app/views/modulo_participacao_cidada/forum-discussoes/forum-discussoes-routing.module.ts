import { ForumDiscussoesComponent } from './forum-discussoes.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { ForumCadastroDiscussaoComponent } from '../forum-cadastro-discussao/forum-cadastro-discussao.component';

const routes: Routes = [
  {
    path: '',
    component: ForumDiscussoesComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_DISCUSSAO', title: 'Criação de Discussão'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumDiscussoesRoutingModule { }