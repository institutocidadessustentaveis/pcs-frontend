import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfisComponent } from '../perfis/perfis.component';
import { CadSenhaPrefeituraComponent } from './cad-senha-prefeitura.component';

const routes: Routes = [
  {
    path: '',
    component: CadSenhaPrefeituraComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CadSenhaPrefeituraRoutingModule { }
