import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicadoresParaPreencherComponent } from './indicadores-para-preencher.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: IndicadoresParaPreencherComponent,
    canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_PREENCHER_INDICADOR'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicadoresParaPreencherRoutingModule { }
