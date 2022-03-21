import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CardContribuicoesAcademicasComponent } from './card-contribuicoes-academicas.component';


const routes: Routes = [
  {
    path: '',
    component: CardContribuicoesAcademicasComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CardContribuicoesAcademicasRoutingModule { }
