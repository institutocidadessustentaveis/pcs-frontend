import { CertificadoListComponent } from './certificado-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { CertificadoFormComponent } from '../certificado-form/certificado-form.component';

const routes: Routes = [
  {
    path: '',
    component: CertificadoListComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_VISUALIZAR_CERTIFICADOS'}
  },
  {
    path: 'cadastrar',
    component: CertificadoFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_CERTIFICADOS', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: CertificadoFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_CERTIFICADOS', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificadoListRoutingModule { }