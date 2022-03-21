import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from '../../../guards/role.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoasPraticasFormComponent } from './boa-pratica-form/boas-praticas-form.component';
import { BoaPraticaListComponent } from './boa-pratica-list/boa-pratica-list.component';

const routes: Routes = [
  {
    path: '',
    component: BoaPraticaListComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_BOA_PRATICA'}
  },
  {
    path: 'cadastrar',
    component: BoasPraticasFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_BOA_PRATICA', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: BoasPraticasFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_BOA_PRATICA', title: 'Editar'}
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoasPraticasRoutingModule { }
