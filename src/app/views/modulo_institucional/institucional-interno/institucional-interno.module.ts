import { ColorPickerModule } from 'ngx-color-picker';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { BreadcrumbComponent } from '../../../components/breadcrumb/breadcrumb.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatTooltipModule  } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ODSRoutingModule } from './institucional-interno-routing.module';
import { InstitucionalInternoComponent } from './institucional-interno-list.component';
import { InstitucionalInternoFormComponent } from '../institucional-interno-form/institucional-interno-form.component';

import { NgxSummernoteModule } from 'ngx-summernote';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { ImageCropperModule } from 'ngx-image-cropper';
import { InstitucionalPublicacaoComponent } from '../institucional-publicacao/institucional-publicacao.component';
import { InstitucionalPublicacaoVisualizacaoComponent } from '../institucional-publicacao-visualizacao/institucional-publicacao-visualizacao.component';

@NgModule({
  declarations: [InstitucionalInternoComponent, InstitucionalInternoFormComponent, InstitucionalPublicacaoComponent, InstitucionalPublicacaoVisualizacaoComponent ],
  exports: [
    ColorPickerModule
  ],
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
    NgxSummernoteModule,
    BreadcrumbModule,
    AngularFontAwesomeModule,
    MatTooltipModule,
    ImageCropperModule,
    ColorPickerModule,
  ],
  entryComponents: [InstitucionalPublicacaoComponent],

})
export class InstitucionalInternoModule { }
