import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrefeituraComponent } from './prefeitura.component';
import { PrefeituraFormComponent } from '../prefeitura-form/prefeitura-form.component';

const routes: Routes = [
  {
    path: '',
    component: PrefeituraComponent
  },
  {
    path: 'cadastrar',
    component: PrefeituraFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrefeituraRoutingModule { }
