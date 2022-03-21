import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddResponsavelComponent } from './add-responsavel.component';

const routes: Routes = [
  {
    path: '',
    component: AddResponsavelComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddResponsavelRoutingModule { }
