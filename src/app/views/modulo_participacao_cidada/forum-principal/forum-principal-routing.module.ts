import { ForumPrincipalComponent } from './forum-principal.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { ForumCadastroDiscussaoComponent } from '../forum-cadastro-discussao/forum-cadastro-discussao.component';

const routes: Routes = [
  {
    path: '',
    component: ForumPrincipalComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_DISCUSSAO'}
  },

  //Perfil Usuário
  {path: 'perfil-usuario', loadChildren: 'src/app/views/modulo_participacao_cidada/forum-principal/perfil-usuario-forum/perfil-usuario-forum.module#PerfilUsuarioForumModule'},
  {path: 'perfil-usuario/editar/:id', loadChildren: 'src/app/views/modulo_participacao_cidada/forum-principal/perfil-usuario-forum/perfil-usuario-forum.module#PerfilUsuarioForumModule'},
  
  //Discussão
  {path: 'discussao/:id', loadChildren: 'src/app/views/modulo_participacao_cidada/forum-principal/forum-discussao/forum-discussao.module#ForumDiscussaoModule',
   data: {title: 'Discussão'}},
  {
    path: 'cadastro-discussao',
    component: ForumCadastroDiscussaoComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_DISCUSSAO', title: 'Criação de Discussão'}
  },
  {
    path: 'editar/:id',
    component: ForumCadastroDiscussaoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumPrincipalRoutingModule { }
