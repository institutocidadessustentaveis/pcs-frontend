
import  localePt  from '@angular/common/locales/pt';
import { MatCardModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatSelectModule, MatPaginatorModule, MatDatepickerModule, MatTableModule, MatSortModule, MatIconModule, MatProgressBarModule, MatToolbarModule, MatAutocompleteModule, MatButtonModule, MatRadioModule } from '@angular/material';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';


import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

import { registerLocaleData } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DadosDownloadComponent } from './dados-download.component';
registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    DadosDownloadComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatPaginatorModule,
    NgxMaskModule.forRoot(),
    MatSortModule,
    MatRadioModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  entryComponents: [
    DadosDownloadComponent
  ],
  exports: [DadosDownloadComponent]
})
export class DadosDownloadModule { }
