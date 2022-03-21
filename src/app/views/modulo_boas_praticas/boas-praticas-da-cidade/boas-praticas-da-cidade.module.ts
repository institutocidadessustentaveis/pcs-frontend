import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoasPraticasDaCidadeComponent } from './boas-praticas-da-cidade.component';
import { BoasPraticasDaCidadeRoutingModule } from './boas-praticas-da-cidade-routing.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  declarations: [BoasPraticasDaCidadeComponent],
  imports: [
    CommonModule,
    BoasPraticasDaCidadeRoutingModule,
    InfiniteScrollModule
  ]
})
export class BoasPraticasDaCidadeModule { }
