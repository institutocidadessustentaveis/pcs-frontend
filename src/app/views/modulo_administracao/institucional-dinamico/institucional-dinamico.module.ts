import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatCardModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatTooltipModule, MatInputModule, MatDividerModule, MatFormFieldModule, MatProgressBarModule, MatDialogModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatListModule, MatAutocompleteModule, MatPaginatorModule, MatSortModule, MatExpansionModule } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PrimeiraSecaoComponent } from './primeira-secao/primeira-secao.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { InstitucionalDinamicoComponent } from './institucional-dinamico.component';
import { InstitucionalDinamicoRoutingModule } from './institucional-dinamico-routing.module';
import { SegundaSecaoComponent } from './segunda-secao/segunda-secao.component';
import { QuartaSecaoComponent } from './quarta-secao/quarta-secao.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { TerceiraSecaoComponent } from './terceira-secao/terceira-secao.component';
import { ItemPublicacaoDinamicaComponent } from './terceira-secao/item-publicacao-dinamica/item-publicacao-dinamica.component';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';


@NgModule({
  declarations: [InstitucionalDinamicoComponent,
    PrimeiraSecaoComponent, SegundaSecaoComponent, TerceiraSecaoComponent, QuartaSecaoComponent, ItemPublicacaoDinamicaComponent],
  imports: [
    CommonModule,
    InstitucionalDinamicoRoutingModule,
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
    ColorPickerModule,
    LeafletModule.forRoot(),
    DadosDownloadModule
  ]
})
export class InstitucionalDinamicoModule { }
