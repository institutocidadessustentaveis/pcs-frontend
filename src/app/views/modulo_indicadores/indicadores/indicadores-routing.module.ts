import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from './../../../guards/role.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndicadoresListComponent } from './indicadores-list.component';
import { IndicadoresComponent } from './indicadores.component';

const routes: Routes = [
  {
    path: '',
    component: IndicadoresListComponent,
    canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_VISUALIZAR_INDICADOR'}
  },
  {
    path: 'cadastrar',
    component: IndicadoresComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_INDICADOR', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: IndicadoresComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_INDICADOR', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndicadoresRoutingModule { }
