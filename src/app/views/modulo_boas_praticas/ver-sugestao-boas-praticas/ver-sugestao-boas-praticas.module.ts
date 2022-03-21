import { VerSugestaoBoasPraticasComponent } from './ver-sugestao-boas-praticas.component';
import { NgxMaskModule } from 'ngx-mask';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatPaginatorModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VerSugestaoBoasPraticasRoutingModule } from './ver-sugestao-boas-praticas-routing.module';
import { VerSugestaoBoasPraticasDetalhadoComponent } from '../ver-sugestao-boas-praticas-detalhado/ver-sugestao-boas-praticas-detalhado.component';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
  declarations: [VerSugestaoBoasPraticasComponent, VerSugestaoBoasPraticasDetalhadoComponent],
  imports: [
    CommonModule,
    VerSugestaoBoasPraticasRoutingModule,
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
    MatPaginatorModule,
    NgxSummernoteModule
  ]
})
export class VerSugestaoBoasPraticasModule { }
