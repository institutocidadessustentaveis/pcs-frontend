import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { PaisComponent } from './pais.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule  } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { PaisRoutingModule } from './pais-routing.module';
import { PaisFormComponent } from '../pais-form/pais-form.component';

@NgModule({
  declarations: [PaisComponent, PaisFormComponent],
  imports: [
    CommonModule,
    PaisRoutingModule,
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
  ]
})
export class PaisModule { }
