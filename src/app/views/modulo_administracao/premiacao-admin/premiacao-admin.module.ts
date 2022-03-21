import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatTooltipModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';
import { PremiacaoAdminComponent } from './premiacao-admin.component';
import { PremiacaoAdminRoutingModule } from './premiacao-admin-routing.module';
import { PremiacaoAdminFormComponent } from '../premiacao-admin-form/premiacao-admin-form.component';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';

@NgModule({
  declarations: [PremiacaoAdminComponent, PremiacaoAdminFormComponent],
  imports: [
    CommonModule,
    PremiacaoAdminRoutingModule,
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
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatepickerPCSModule,
    MatTooltipModule,
    BreadcrumbModule
  ]
})
export class PremiacaoAdminModule { }


