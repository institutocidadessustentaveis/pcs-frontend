import { CapacitacaoComponent } from './capacitacao.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
const routes: Routes = [
    {
        path: '',
        component: CapacitacaoComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CapacitacaoRoutingModule { }
