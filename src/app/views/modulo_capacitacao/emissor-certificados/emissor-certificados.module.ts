import { ImageCropperModule } from 'ngx-image-cropper';
import { StripTagsModule } from 'src/app/components/strip-tags/strip-tags.module';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { HistoricoCertificadoComponent } from './../historico-certificado/historico-certificado.component';
import { DatepickerPCSModule } from './../../../components/datepicker/datepickerpcs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { EmissorCertificadosRoutingModule } from './emissor-certificados-routing.module';
import { EmissorCertificadosComponent } from './emissor-certificados.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatTooltipModule, MatRadioButton, MatSnackBarModule  } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';

@NgModule({
  declarations: [
    EmissorCertificadosComponent,
    HistoricoCertificadoComponent
  ],
  imports: [
    CommonModule,
    EmissorCertificadosRoutingModule,
    BreadcrumbModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatButtonModule,
    NgxSummernoteModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatProgressBarModule,
    DatepickerPCSModule,
    MatDividerModule,
    MatDialogModule,
    MatOptionModule,
    MatTableModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
    AngularFontAwesomeModule,
    ImageCropperModule,
    StripTagsModule,
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSnackBarModule,
    DadosDownloadModule
  ]
 
})
export class EmissorCertificadosModule { }
