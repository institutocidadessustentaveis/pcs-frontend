import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ODSRoutingModule } from './objetivo-desenvolvimento-sustentavel-routing.module';
import { ObjetivoDesenvolvimentoSustentavelComponent } from './objetivo-desenvolvimento-sustentavel-list.component';
import { ObjetivoDesenvolvimentoSustentavelFormComponent, DialogCadastroMetas } from '../objetivo-desenvolvimento-sustentavel-form/objetivo-desenvolvimento-sustentavel-form.component';

@NgModule({
  declarations: [ObjetivoDesenvolvimentoSustentavelComponent, ObjetivoDesenvolvimentoSustentavelFormComponent, DialogCadastroMetas],
  imports: [
    CommonModule,
    ODSRoutingModule,
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
    BreadcrumbModule
  ],
  entryComponents: [DialogCadastroMetas],
})
export class ODSModule { }
