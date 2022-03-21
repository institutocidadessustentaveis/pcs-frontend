import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatStepperModule, MatNativeDateModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BoasPraticasRoutingModule } from './boas-praticas-routing.module';
import { NgxMaskModule } from 'ngx-mask';
import { BoasPraticasFormComponent } from './boa-pratica-form/boas-praticas-form.component';

import { NgxSummernoteModule } from 'ngx-summernote';

import {MatDatepickerModule} from '@angular/material/datepicker';
import { BoaPraticaListComponent } from './boa-pratica-list/boa-pratica-list.component';

import { ShareModule } from '@ngx-share/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { NgxGalleryModule } from 'ngx-gallery';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BreadcrumbModule2 } from 'src/app/components/breadcrumb2/breadcrumb.module2';
import { PreVisualizacaoComponent } from './boa-pratica-form/pre-visualizacao/pre-visualizacao.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [BoasPraticasFormComponent,  BoaPraticaListComponent, PreVisualizacaoComponent],
  imports: [
    CommonModule,
    BoasPraticasRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatExpansionModule,
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
    ShareModule,
    AngularFontAwesomeModule,
    NgxGalleryModule,
    MatTooltipModule,
    LeafletModule.forRoot(),
    BreadcrumbModule,
    BreadcrumbModule2,
    ImageCropperModule,
    NgSelectModule
  ]
})
export class BoasPraticasModule { }
