import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule, MatAutocompleteModule, MatRadioModule, MatProgressBarModule } from '@angular/material';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { BoasPraticasInicialHeaderComponent } from './boas-praticas-inicial-header.component';
import { BreadcrumbModule2 } from 'src/app/components/breadcrumb2/breadcrumb.module2';
import { HomeModule } from 'src/app/views/modulo_administracao/home/home.module';

@NgModule({
  declarations: [
    BoasPraticasInicialHeaderComponent,
    ],
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    BreadcrumbModule2,
    ScrollToModule.forRoot(),
    MatProgressBarModule,
    HomeModule,
  ],
  exports: [
    BoasPraticasInicialHeaderComponent
  ]
})
export class BoasPraticasInicialHeaderModule { }
