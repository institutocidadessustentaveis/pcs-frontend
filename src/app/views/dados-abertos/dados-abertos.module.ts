import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule,
         MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, 
         MatAutocompleteModule, MatProgressSpinnerModule, MatRadioModule, MatDialogModule, MatTooltipModule } from '@angular/material';

import { DadosAbertosRoutingModule } from './dados-abertos-routing.module';
import { DadosAbertosComponent } from './dados-abertos.component';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';

@NgModule({
  declarations: [DadosAbertosComponent],
  imports: [
    CommonModule,
    FormsModule,
    DadosAbertosRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatListModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltipModule,
    DadosDownloadModule
  ],
 
  
})
export class DadosAbertosModule { }
