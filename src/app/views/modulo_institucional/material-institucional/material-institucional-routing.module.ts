import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialInstitucionalListComponent } from './material-institucional-list/material-institucional-list.component';
import { MaterialInstitucionalFormComponent } from './material-institucional-form/material-institucional-form.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: MaterialInstitucionalListComponent
  },
  {
    path: 'cadastrar',
    component: MaterialInstitucionalFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_MATERIAL_INSTITUCIONAL', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: MaterialInstitucionalFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_MATERIAL_INSTITUCIONAL', title: 'Editar'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialInstitucionalRoutingModule { }
