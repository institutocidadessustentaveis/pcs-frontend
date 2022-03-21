import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstitucionalInternoComponent } from './institucional-interno-list.component';
import { InstitucionalInternoFormComponent } from '../institucional-interno-form/institucional-interno-form.component';

const routes: Routes = [
  {
    path: '',
    component: InstitucionalInternoComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_PAGINA_INSTITUCIONAL'}
  },
  {
    path: 'cadastrar',
    component: InstitucionalInternoFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_PAGINA_INSTITUCIONAL', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: InstitucionalInternoFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_PAGINA_INSTITUCIONAL', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ODSRoutingModule { }
