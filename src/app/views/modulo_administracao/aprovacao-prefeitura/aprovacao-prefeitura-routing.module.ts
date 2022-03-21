import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AprovacaoPrefeituraComponent } from './aprovacao-prefeitura.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: AprovacaoPrefeituraComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_AP'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AprovacaoPrefeituraRoutingModule { }
