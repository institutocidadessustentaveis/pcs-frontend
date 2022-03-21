import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatCardModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatTooltipModule, MatInputModule, MatFormFieldModule, MatDialogModule, MatRadioModule, MatAutocompleteModule } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PaginaInstitucionalDetalheRoutingModule } from './pagina-institucional-detalhe-routing.module';
import { PaginaInstitucionalDetalheComponent } from './pagina-institucional-detalhe.component';
import { Template01Component } from './template01/template01.component';
import { Template02Component } from './template02/template02.component';
import { Template03Component } from './template03/template03.component';
import { ItemPublicacaoComponent } from './item-publicacao/item-publicacao.component';
import { StripTagsPipe } from 'src/app/components/strip-tags/strip-tags.pipe';
import { StripTagsModule } from 'src/app/components/strip-tags/strip-tags.module';
import { Template04Component } from './template04/template04.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';
@NgModule({
  declarations: [PaginaInstitucionalDetalheComponent,
    Template01Component, Template02Component, Template03Component, Template04Component, ItemPublicacaoComponent],
  imports: [
    CommonModule,
    PaginaInstitucionalDetalheRoutingModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    NgxSummernoteModule,
    AngularFontAwesomeModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatRadioModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    LeafletModule.forRoot(),
    StripTagsModule,
    DadosDownloadModule
  ],
  
})
export class PaginaInstitucionalDetalheModule { }
