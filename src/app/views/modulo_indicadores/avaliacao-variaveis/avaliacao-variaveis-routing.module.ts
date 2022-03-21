import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { AvaliacaoVariaveisComponent } from './avaliacao-variaveis.component';
import { AvaliacaoVariaveisListComponent } from './avaliacao-variaveis-list.component';

const routes: Routes = [
  {
    path: '',
    component: AvaliacaoVariaveisListComponent,
    canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_AVALIACAO_VARIAVEIS'}
  },
  {
    path: 'avaliacao',
    component: AvaliacaoVariaveisComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_AVALIACAO_VARIAVEIS', title: 'Avaliação'}
  },
  {
    path: 'avaliacao/:id',
    component: AvaliacaoVariaveisComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_AVALIACAO_VARIAVEIS', title: 'Avaliação'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvaliacaoVariaveisRoutingModule { }
