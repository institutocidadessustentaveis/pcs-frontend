import { PreencherVariaveisRoutingModule } from './preencher-variaveis-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreencherVariaveisComponent } from './preencher-variaveis.component';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatPaginatorModule, MatButtonToggleModule, MatTooltipModule, MatSlideToggleModule  } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { PreenchimentoVariavelComponent } from './preenchimento-variavel/preenchimento-variavel.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PreencherVariaveisRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatSlideToggleModule,
  ],
  declarations: [PreencherVariaveisComponent,PreenchimentoVariavelComponent]
})
export class PreencherVariaveisModule { }
