import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';
import { PremiacaoPrefeituraComponent } from './premiacao-prefeitura.component';
import { PremiacaoPrefeituraRoutingModule } from './premiacao-prefeitura-routing.module';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';

@NgModule({
  declarations: [PremiacaoPrefeituraComponent],
  imports: [
    CommonModule,
    PremiacaoPrefeituraRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    NgxMaskModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class PremiacaoPrefeituraModule { }


