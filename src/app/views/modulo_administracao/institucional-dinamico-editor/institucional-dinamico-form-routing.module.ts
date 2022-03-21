import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { InstitucionalDinamicoFormComponent } from './institucional-dinamico-form.component';


const routes: Routes = [
  {
    path: 'cadastrar',
    component: InstitucionalDinamicoFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_PAGINA_INSTITUCIONAL', title: 'Cadastrar'}
  },
  {
    path: 'editar/:id',
    component: InstitucionalDinamicoFormComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_PAGINA_INSTITUCIONAL', title: 'Editar'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstitucionalDinamicoFormRoutingModule { }
