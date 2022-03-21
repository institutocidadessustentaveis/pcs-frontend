import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumDiscussaoComponent } from './forum-discussao.component';

const routes: Routes = [
  {
    path: '',
    component: ForumDiscussaoComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumDiscussaoRoutingModule { }
