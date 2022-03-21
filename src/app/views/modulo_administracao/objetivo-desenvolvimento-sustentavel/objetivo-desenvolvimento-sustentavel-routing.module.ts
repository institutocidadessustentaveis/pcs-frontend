import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ObjetivoDesenvolvimentoSustentavelComponent } from './objetivo-desenvolvimento-sustentavel-list.component';
import { ObjetivoDesenvolvimentoSustentavelFormComponent } from '../objetivo-desenvolvimento-sustentavel-form/objetivo-desenvolvimento-sustentavel-form.component';

const routes: Routes = [
  {
    path: '',
    component: ObjetivoDesenvolvimentoSustentavelComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_ODS'}
  },
  {
    path: 'cadastrar',
    component: ObjetivoDesenvolvimentoSustentavelFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_ODS', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: ObjetivoDesenvolvimentoSustentavelFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_ODS', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ODSRoutingModule { }
