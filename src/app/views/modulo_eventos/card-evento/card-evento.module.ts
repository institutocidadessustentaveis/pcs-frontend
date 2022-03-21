import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardEventoComponent } from './card-evento.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [CardEventoComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [CardEventoComponent]
})
export class CardEventoModule { }
