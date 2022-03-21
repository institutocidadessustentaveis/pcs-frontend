import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { PremiacaoPrefeituraComponent } from './premiacao-prefeitura.component';

const routes: Routes = [
  {
    path: '',
    component: PremiacaoPrefeituraComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_PREMIACOES'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PremiacaoPrefeituraRoutingModule { }
