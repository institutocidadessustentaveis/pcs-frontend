import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportacaoPrefeituraComponent } from './importacao-prefeitura.component';
import { ImportacaoPrefeituraRoutingModule } from './importacao-prefeitura-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule, MatDividerModule,MatFormFieldModule,MatIconModule,MatProgressBarModule,
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
  MatSortModule } from '@angular/material';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';

@NgModule({
  imports: [
    CommonModule,
    ImportacaoPrefeituraRoutingModule,
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
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    BreadcrumbModule
  ],
  declarations: [ImportacaoPrefeituraComponent]
})
export class ImportacaoPrefeituraModule { }
