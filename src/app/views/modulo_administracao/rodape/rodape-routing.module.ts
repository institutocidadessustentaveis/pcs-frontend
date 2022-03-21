import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RodapeComponent } from './rodape.component';
import { RoleGuard } from 'src/app/guards/role.guard';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: RodapeComponent,
    canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_CADASTRAR_LINK_RODAPE', title: 'Rodapé do sistema'}
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RodapeRoutingModule { }
