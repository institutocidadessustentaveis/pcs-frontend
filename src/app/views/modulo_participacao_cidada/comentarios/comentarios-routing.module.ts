import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComentariosComponent } from './comentarios.component';


const routes: Routes = [
  {
    path: '',
    component: ComentariosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComentariosRoutingModule { }
