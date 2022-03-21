import { PlanoLeisRegulamentacaoComponent } from './plano-leis-regulamentacao.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
const routes: Routes = [
    {
        path: '',
        component: PlanoLeisRegulamentacaoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlanoLeisRegulamentacaoRoutingModule { }
