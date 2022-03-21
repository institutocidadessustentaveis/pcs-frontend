import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatCardModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatTooltipModule, MatInputModule, MatDividerModule, MatFormFieldModule, MatProgressBarModule, MatDialogModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatListModule, MatAutocompleteModule, MatPaginatorModule, MatSortModule, MatExpansionModule } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { InstitucionalDinamicoFormComponent } from './institucional-dinamico-form.component';
import { EditarIndiceSecaoComponent } from './editar-indice-secao/editar-indice-secao.component';
import { InstitucionalDinamicoFormRoutingModule } from './institucional-dinamico-form-routing.module';
import { InstitucionalDinamicoPublicacaoComponent } from './institucional-dinamico-publicacao/institucional-dinamico-publicacao.component';
import { InstitucionalDinamicoPublicacaoVisualizacaoComponent } from './institucional-dinamico-publicacao-visualizacao/institucional-dinamico-publicacao-visualizacao.component';


@NgModule({
  declarations: [
    InstitucionalDinamicoFormComponent,
    EditarIndiceSecaoComponent,InstitucionalDinamicoPublicacaoComponent, InstitucionalDinamicoPublicacaoVisualizacaoComponent],
  imports: [
    CommonModule,
    InstitucionalDinamicoFormRoutingModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    NgxSummernoteModule,
    AngularFontAwesomeModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    CommonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSortModule,
    ImageCropperModule,
    MatExpansionModule,
    ColorPickerModule
  ],
  entryComponents: [EditarIndiceSecaoComponent, InstitucionalDinamicoPublicacaoComponent],
})
export class InstitucionalDinamicoFormModule { }
