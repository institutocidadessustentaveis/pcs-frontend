import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { InstitucionalDinamicoListComponent } from './institucional-dinamico-list.component';


const routes: Routes = [
  {
    path: '',
    component: InstitucionalDinamicoListComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_PAGINA_INSTITUCIONAL', title: 'Páginas'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitucionalDinamicoListRoutingModule { }
