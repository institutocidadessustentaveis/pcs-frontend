import { NgxMaskModule } from 'ngx-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule,
  MatInputModule, MatButtonModule,  MatSelectModule, MatListModule,
  MatAutocompleteModule,
  MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { MeusDadosRoutingModule } from './meus-dados-routing.module';
import { MeusDadosComponent } from './meus-dados.component';

@NgModule({
  declarations: [MeusDadosComponent],
  imports: [
    CommonModule,
    MeusDadosRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSelectModule,
    MatListModule,
    MatAutocompleteModule,
    NgxMaskModule.forRoot(),
  ]
})
export class MeusDadosModule { }
