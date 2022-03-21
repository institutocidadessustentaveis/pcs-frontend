import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { AdministracaoAtendimentoComponent } from './administracao-atendimento.component';

const routes: Routes = [
  {
    path: '',
    component: AdministracaoAtendimentoComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_GERENCIAR_ATENDIMENTO'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministracaoAtendimentoRoutingModule { }
