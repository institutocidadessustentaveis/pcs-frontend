import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioPrefeituraComponent } from './usuario-prefeitura.component';
import { UsuarioPrefeituraFormComponent } from '../usuario-prefeitura-form/usuario-prefeitura-form.component';

const routes: Routes = [
  {path: '', component: UsuarioPrefeituraComponent},
  {path: 'cadastrar', component: UsuarioPrefeituraFormComponent},
  {path: ':id', component: UsuarioPrefeituraFormComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioPrefeituraRoutingModule { }
