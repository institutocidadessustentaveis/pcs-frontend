import { StripTagsModule } from 'src/app/components/strip-tags/strip-tags.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { CertificadoListRoutingModule } from './certificado-list-routing.module';
import { CertificadoListComponent } from './certificado-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificadoFormComponent } from '../certificado-form/certificado-form.component';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatTooltipModule  } from '@angular/material';

@NgModule({
  declarations: [
    CertificadoListComponent,
    CertificadoFormComponent
  ],
  imports: [
    CommonModule,
    CertificadoListRoutingModule,
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
    BreadcrumbModule,
    AngularFontAwesomeModule,
    MatTooltipModule,
    ImageCropperModule,
    MatSelectModule,
    NgxSummernoteModule,
    FormsModule,
    StripTagsModule
  ]
})
export class CertificadoListModule { }
