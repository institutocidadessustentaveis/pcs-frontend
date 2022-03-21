import { CardBibliotecaModule } from './../card-biblioteca/card-biblioteca.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BibliotecasComponent } from './bibliotecas.component';
import { BibliotecasRoutingModule } from './bibliotecas-routing.module';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { MatButtonModule, MatInputModule, MatOption, MatSelectModule, MatIcon, MatIconModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [BibliotecasComponent],
  imports: [
    CommonModule,
    BibliotecasRoutingModule,
    BreadcrumbModule,
    CardBibliotecaModule,
    BreadcrumbModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatTooltipModule,
  ]
})
export class BibliotecasModule { }
