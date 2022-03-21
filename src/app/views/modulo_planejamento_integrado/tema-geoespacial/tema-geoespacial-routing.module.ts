import { TemaGeoespacialFormComponent } from './tema-geoespacial-form/tema-geoespacial-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemaGeoespacialListComponent } from './tema-geoespacial-list/tema-geoespacial-list.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {path: '', component: TemaGeoespacialListComponent},
  {
    path: 'cadastro', 
    component: TemaGeoespacialFormComponent ,
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_CADASTRAR_TEMA_GEOESPACIAL', title: 'Cadastro'} 
  },
  {
    path: 'cadastro/:id', 
    component: TemaGeoespacialFormComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_EDITAR_TEMA_GEOESPACIAL', title: 'Edição'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemaGeoespacialRoutingModule { }
