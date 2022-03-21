import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { AdministracaoResponsaveisFormComponent } from './administracao-responsaveis-form/administracao-responsaveis-form.component';
import { AdministracaoResponsaveisComponent } from './administracao-responsaveis.component';
import { ScripCriarUsuariosPrefeitosComponent } from './scrip-criar-usuarios-prefeitos/scrip-criar-usuarios-prefeitos.component';

const routes: Routes = [
  {
    path: '',
    component: AdministracaoResponsaveisComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_USUARIO_RESPONSAVEL', title: 'Cadastrar'}
  },
  {
    path: 'cadastrar',
    component: AdministracaoResponsaveisFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_USUARIO_RESPONSAVEL', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: AdministracaoResponsaveisFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_USUARIO_RESPONSAVEL', title: 'Cadastrar'}
  },
  {
    path: 'script-usuarios-prefeitos',
    component: ScripCriarUsuariosPrefeitosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoResponsaveisRoutingModule { }
