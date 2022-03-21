import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanoDeMetasInicialComponent } from './plano-de-metas-inicial/plano-de-metas-inicial.component';
import { PlanoDeMetasCidadeComponent } from './plano-de-metas-cidade/plano-de-metas-cidade.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';
import { PlanoMetasListComponent } from './administracao/plano-metas-list/plano-metas-list.component';
import { PlanoMetasComponent } from './administracao/plano-metas/plano-metas.component';

const routes: Routes = [
  {
    path: '',
    component: PlanoDeMetasInicialComponent
  },

  {
    path: 'cidade/:id',
    component: PlanoDeMetasCidadeComponent
  },

  {
    path: 'administracao',
    component: PlanoMetasListComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_PLANO_METAS'}
  },

  {
    path: 'administracao/:id',
    component: PlanoMetasComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_PLANO_METAS'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanoDeMetasRoutingModule { }
