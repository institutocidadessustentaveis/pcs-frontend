import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardBibliotecaComponent } from './card-biblioteca.component';
import { CardBibliotecaRoutingModule } from './card-biblitoeca-routing.module';

import {  MatIconModule } from '@angular/material';

@NgModule({
  declarations: [CardBibliotecaComponent],
  imports: [
    CommonModule,
    CardBibliotecaRoutingModule,
    MatIconModule
  ],
  exports: [
      CardBibliotecaComponent,
  ]
})
export class CardBibliotecaModule { }
