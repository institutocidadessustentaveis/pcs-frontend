import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatCardModule, MatButtonModule, MatDividerModule, MatFormFieldModule, MatProgressBarModule, MatInputModule, MatPaginatorModule, MatOptionModule, MatSelectModule, MatTableModule, MatSortModule, MatListModule, MatDialogModule, MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule, MatStepperModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { MaterialInstitucionalRoutingModule } from './material-institucional-routing.module';
import { MaterialInstitucionalListComponent } from './material-institucional-list/material-institucional-list.component';
import { MaterialInstitucionalFormComponent } from './material-institucional-form/material-institucional-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';
import { NgxSummernoteModule } from 'ngx-summernote';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations: [
    MaterialInstitucionalListComponent,
    MaterialInstitucionalFormComponent],
  imports: [
    CommonModule,
    MaterialInstitucionalRoutingModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    NgxMaskModule.forRoot(),
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    FormsModule,
    NgxSummernoteModule,
    MatStepperModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    BreadcrumbModule
  ]
})
export class MaterialInstitucionalModule { }
