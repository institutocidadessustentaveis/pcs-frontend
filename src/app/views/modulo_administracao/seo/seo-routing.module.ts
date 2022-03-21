import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeoComponent } from './seo.component';

const routes: Routes = [{
  path: ':width/:height/:id',
  component: SeoComponent,
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeoRoutingModule { }
