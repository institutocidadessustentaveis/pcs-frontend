import { SugestaoBoasPraticasComponent } from './sugestao-boas-praticas.component';
import { NgxMaskModule } from 'ngx-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SugestaoBoasPraticasRoutingModule } from './sugestao-boas-praticas-routing.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations: [SugestaoBoasPraticasComponent],
  imports: [
    CommonModule,
    SugestaoBoasPraticasRoutingModule,
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
    MatCheckboxModule,
    MatSelectModule,
    MatTableModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    NgxCaptchaModule,
    NgxSummernoteModule,
  ]
})
export class SugestaoBoasPraticasModule { }
