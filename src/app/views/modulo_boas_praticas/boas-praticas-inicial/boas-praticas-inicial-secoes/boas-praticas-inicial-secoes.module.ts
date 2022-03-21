import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule, MatAutocompleteModule, MatRadioModule, MatProgressBarModule, MatTooltipModule } from '@angular/material';

import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { BreadcrumbModule2 } from 'src/app/components/breadcrumb2/breadcrumb.module2';
import { HomeModule } from 'src/app/views/modulo_administracao/home/home.module';
import { BoasPraticasInicialSecoesComponent } from './boas-praticas-inicial-secoes.component';

@NgModule({
  declarations: [
    BoasPraticasInicialSecoesComponent,
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
    MatTooltipModule,
    HomeModule,
  ],
  exports: [
    BoasPraticasInicialSecoesComponent
  ]
})
export class BoasPraticasInicialSecoesModule { }
