import { CommonModule } from '@angular/common';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';

import { EnvioBoletimComponent } from './envio-boletim.component';
import { EnvioBoletimRoutingModule } from './envio-boletim-routing.module';

import { MatCardModule, MatDividerModule, MatIconModule,
         MatProgressBarModule, MatProgressSpinnerModule,
         MatInputModule, MatPaginatorModule, MatButtonModule,
         MatFormFieldModule, MatOptionModule, MatChipsModule,
         MatListModule,
         MatGridListModule,
         MatDatepickerModule,
         MatRadioModule,
         MatSelectModule,
         MatStepperModule,
         MatTableModule,
         MatCheckboxModule} from '@angular/material';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxSummernoteModule } from 'ngx-summernote';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';

@NgModule({
  declarations: [EnvioBoletimComponent],
  imports: [
    CommonModule,
    EnvioBoletimRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatChipsModule,
    MatOptionModule,
    MatListModule,
    MatGridListModule,
    DatepickerPCSModule,
    MatDatepickerModule,
    BreadcrumbModule,
    MatRadioModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    DragDropModule,
    ImageCropperModule,
    MatIconModule,
    MatStepperModule,
    NgxSummernoteModule,
    MatTableModule,
    MatCheckboxModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
})
export class EnvioBoletimModule { }
