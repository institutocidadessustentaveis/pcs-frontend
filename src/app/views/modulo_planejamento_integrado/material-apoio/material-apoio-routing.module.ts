import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialApoioListComponent } from './material-apoio-list/material-apoio-list.component';
import { MaterialApoioFormComponent } from './material-apoio-form/material-apoio-form.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: '', 
    component: MaterialApoioListComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_MATERIAL_APOIO'}
  },
  {
    path: 'cadastrar',
    component: MaterialApoioFormComponent ,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_MATERIAL_APOIO', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: MaterialApoioFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_MATERIAL_APOIO', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialApoioRoutingModule { }
