import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BibliotecaFormComponent } from './biblioteca-form.component';


const routes: Routes = [
  {
    path: '',
    component: BibliotecaFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BibliotecaFormRoutingModule { }
