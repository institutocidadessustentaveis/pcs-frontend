import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqFormComponent } from './faq-form.component';

const routes: Routes = [
  {
    path: '',
    component: FaqFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqFormRoutingModule { }
