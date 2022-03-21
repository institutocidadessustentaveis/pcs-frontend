import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from '../../../guards/role.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditarDadosCidadeComponent } from './editar-dados-cidade.component';

const routes: Routes = [
  {
    path: '',
    component: EditarDadosCidadeComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_EDITAR_DADOS_CIDADE'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditarDadosCidadeRoutingModule { }
