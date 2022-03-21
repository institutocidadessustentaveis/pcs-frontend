import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { PrefeituraAdminComponent } from './prefeitura-admin.component';
import { PrefeituraAdminFormComponent } from '../prefeitura-admin-form/prefeitura-admin-form.component';

const routes: Routes = [
  {
    path: '',
    component: PrefeituraAdminComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_PREFEITURA'}
  },
  {
    path: 'editar/:id',
    component: PrefeituraAdminFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_PREFEITURA', title: 'Editar'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrefeituraAdminRoutingModule {

}
