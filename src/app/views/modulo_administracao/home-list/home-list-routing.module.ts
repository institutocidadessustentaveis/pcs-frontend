import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { HomeListComponent } from './home-list.component';


const routes: Routes = [
  {
    path: '',
    component: HomeListComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_HOME', title: 'Páginas'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeListRoutingModule { }
