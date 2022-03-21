import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeFormComponent } from '../home-editor/home-form.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';


const routes: Routes = [
  {
    path: 'cadastrar',
    component: HomeFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_HOME', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: HomeFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_HOME', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeFormRoutingModule { }
