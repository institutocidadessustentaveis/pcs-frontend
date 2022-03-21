import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

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
         MatTooltipModule} from '@angular/material';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxSummernoteModule } from 'ngx-summernote';
import { BoletimAdministracaoComponent } from './boletim-administracao.component';
import { BoletimAdministracaoRoutingModule } from './boletim-administracao-routing.module';

@NgModule({
  declarations: [BoletimAdministracaoComponent],
  imports: [
    CommonModule,
    BoletimAdministracaoRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatButtonModule,
    MatOptionModule,
    MatListModule,
    BreadcrumbModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
})
export class BoletimAdministracaoModule { }
