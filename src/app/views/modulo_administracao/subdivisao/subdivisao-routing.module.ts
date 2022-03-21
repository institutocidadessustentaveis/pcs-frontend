import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaSubdivisaoComponent } from './lista-subdivisao/lista-subdivisao.component';
import { TipoSubdivisaoComponent } from './tipo-subdivisao/tipo-subdivisao.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { RoleGuard } from 'src/app/guards/role.guard';

const routes: Routes = [
  {
    path: 'tipo-subdivisao', 
    component: TipoSubdivisaoComponent, 
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_CADASTRAR_TIPO_SUBDIVISAO', title: 'Tipos de Subdivisões'} 
    },
  {
    path: 'administracao-subdivisao', 
    component: ListaSubdivisaoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {role: 'ROLE_CADASTRAR_SUBDIVISAO', title: 'Administração de Subdivisões'}
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubdivisaoRoutingModule { }
