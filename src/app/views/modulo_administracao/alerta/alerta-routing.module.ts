import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertaComponent } from './alerta.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: AlertaComponent,
    canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_VISUALIZAR_ALERTA'},
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertaRoutingModule { }
