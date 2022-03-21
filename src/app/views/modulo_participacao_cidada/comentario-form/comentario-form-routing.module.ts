import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComentarioFormComponent } from './comentario-form.component';

const routes: Routes = [
  {
    path: '',
    component: ComentarioFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComentarioFormRoutingModule { }
