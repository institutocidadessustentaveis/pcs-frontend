import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { MatCardModule, MatDividerModule, MatIconModule,
         MatProgressBarModule, MatProgressSpinnerModule,
         MatTableModule, MatInputModule, MatPaginatorModule,
         MatButtonModule, MatFormFieldModule, MatSelectModule,
         MatOptionModule, MatChipsModule, MatDatepickerModule, MatNativeDateModule, MatSortModule, MatCheckboxModule, MatTooltipModule, MatDialogModule, MatSlideToggleModule } from '@angular/material';
import { NgModule, LOCALE_ID} from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { NoticiaRoutingModule } from './noticia-routing.module';
import { NoticiaListComponent } from './noticia-list/noticia-list.component';
import { NoticiaFormComponent } from './noticia-form/noticia-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSummernoteModule } from 'ngx-summernote';
import { NgxMaskModule } from 'ngx-mask';
import { PreVisualizacaoNoticiaComponent } from './pre-visualizacao-noticia/pre-visualizacao-noticia.component';
import { TempoPercorridoModule } from 'src/app/components/tempo-percorrido/tempo-percorrido.module';
import { ImageCropperModule } from 'ngx-image-cropper';

registerLocaleData(localePt, 'pt-BR');
@NgModule({
  declarations: [
    NoticiaListComponent,
    NoticiaFormComponent,
    PreVisualizacaoNoticiaComponent
   ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NoticiaRoutingModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatOptionModule,
    MatCheckboxModule,
    NgxSummernoteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskModule.forRoot(),
    MatSortModule,
    BreadcrumbModule,
    TempoPercorridoModule,
    MatTooltipModule,
    ImageCropperModule,
    MatDialogModule,
    MatSlideToggleModule,
    FormsModule
  ],providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]

})
export class NoticiaModule { }
