import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatStepperModule, MatNativeDateModule, MatTooltipModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgxSummernoteModule } from 'ngx-summernote';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ShareModule } from '@ngx-share/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxGalleryModule, NgxGalleryPreviewComponent } from 'ngx-gallery';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { BreadcrumbModule2 } from 'src/app/components/breadcrumb2/breadcrumb.module2';
import { ShapeCadastroListComponent } from './shape-cadastro-list/shape-cadastro-list.component';
import { ShapeCadastroFormComponent } from './shape-cadastro-form/shape-cadastro-form.component';
import { ShapeCadastroRoutingModule } from './shape-cadastro-routing.module';
import { ShapeFilesDetalheVisualizarModule } from './shape-detalhe/shapefiles-detalhe-visualizar.module';

@NgModule({
  declarations: [ShapeCadastroListComponent, ShapeCadastroFormComponent],
  imports: [
    CommonModule,
    ShapeCadastroRoutingModule,
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
    ShapeFilesDetalheVisualizarModule
  ]
})
export class ShapeCadastroModule { }
