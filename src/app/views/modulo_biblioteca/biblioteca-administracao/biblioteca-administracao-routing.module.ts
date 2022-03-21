import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BibliotecaAdministracaoComponent } from './biblioteca-administracao.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';


const routes: Routes = [
  {
    path: '',
    component: BibliotecaAdministracaoComponent,
  },
  {
    path:'editar/:id', 
    loadChildren: '../biblioteca-form/biblioteca-form.module#BibliotecaFormModule', 
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_EDITAR_BIBLIOTECA', title: 'Editar Biblioteca'}
  },
  {
    path:'cadastrar', 
    loadChildren: '../biblioteca-form/biblioteca-form.module#BibliotecaFormModule', 
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_CADASTRAR_BIBLIOTECA', title: 'Cadastrar Biblioteca'}
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BibliotecaAdministracaoRoutingModule { }
