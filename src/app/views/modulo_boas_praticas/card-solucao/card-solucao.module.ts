import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CardSolucaoComponent } from './card-solucao.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [CardSolucaoComponent],
    declarations: [CardSolucaoComponent],
    providers: [],
})
export class CardSolucaoModule { }
