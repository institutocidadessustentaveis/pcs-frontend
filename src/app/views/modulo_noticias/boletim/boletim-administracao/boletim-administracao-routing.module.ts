import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoletimAdministracaoComponent } from './boletim-administracao.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: BoletimAdministracaoComponent,
    data: {title: 'Notícias » Administração de Boletim Informativo'}
  },
  {
    path: 'cadastrar',
    loadChildren: '../envio-boletim/envio-boletim.module#EnvioBoletimModule', 
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_CADASTRAR_BOLETIM', title: 'Notícias » Cadastro de Boletim Informativo'}
  },
  {
    path: 'editar/:idBoletim',
    loadChildren: '../envio-boletim/envio-boletim.module#EnvioBoletimModule', 
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_EDITAR_BOLETIM', title: 'Notícias » Editar Boletim Informativo'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoletimAdministracaoRoutingModule { }

