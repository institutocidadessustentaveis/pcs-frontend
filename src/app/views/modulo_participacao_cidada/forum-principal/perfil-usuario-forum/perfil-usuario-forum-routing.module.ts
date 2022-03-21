import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilUsuarioForumComponent } from './perfil-usuario-forum.component';

const routes: Routes = [
  {
    path: '',
    component: PerfilUsuarioForumComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PerfilUsuarioForumRoutingModule { }
