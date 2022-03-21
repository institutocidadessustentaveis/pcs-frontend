import { AlertaComponent } from './alerta.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule  } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { AlertaRoutingModule } from './alerta-routing.module';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';

import { NgxSummernoteModule } from 'ngx-summernote';
@NgModule({
  declarations: [AlertaComponent],
  imports: [
    CommonModule,
    AlertaRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatChipsModule,
    NgxSummernoteModule

  ]
})
export class AlertaModule { }
