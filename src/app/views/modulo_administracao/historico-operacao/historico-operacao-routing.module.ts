import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HistoricoOperacaoComponent } from './historico-operacao.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: HistoricoOperacaoComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_HISTORICO_OPERACAO'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HistoricoOperacaoRoutingModule { }
