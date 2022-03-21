import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardFaqComponent } from './card-faq.component';


const routes: Routes = [
  {
    path: '',
    component: CardFaqComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardFaqRoutingModule { }
