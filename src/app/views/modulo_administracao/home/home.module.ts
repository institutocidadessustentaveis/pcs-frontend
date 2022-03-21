import { SecaoLateralComponent } from './secao-lateral/secao-lateral.component';
import { QuintaSecaoComponent } from './quinta-secao/quinta-secao.component';
import { TerceiraSecaoComponent } from './terceira-secao/terceira-secao.component';
import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatCardModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatTooltipModule, MatInputModule, MatDividerModule, MatFormFieldModule, MatProgressBarModule, MatDialogModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatListModule, MatAutocompleteModule, MatPaginatorModule, MatSortModule, MatExpansionModule } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { PrimeiraSecaoComponent } from './primeira-secao/primeira-secao.component';
import { SegundaSecaoComponent } from './segunda-secao/segunda-secao.component';
import { QuartaSecaoComponent } from './quarta-secao/quarta-secao.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { SextaSecaoComponent } from './sexta-secao/sexta-secao.component';
import { SetimaSecaoComponent } from './setima-secao/setima-secao.component';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';


@NgModule({
  declarations: [HomeComponent,
    PrimeiraSecaoComponent,
    SegundaSecaoComponent,
    TerceiraSecaoComponent,
    QuartaSecaoComponent,
    QuintaSecaoComponent,
    SextaSecaoComponent,
    SetimaSecaoComponent,
    SecaoLateralComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
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
    DadosDownloadModule
  ],
  exports: [HomeComponent,
    PrimeiraSecaoComponent,
    SegundaSecaoComponent,
    TerceiraSecaoComponent,
    QuartaSecaoComponent,
    QuintaSecaoComponent,
    SextaSecaoComponent,
    SetimaSecaoComponent,
    SecaoLateralComponent

  ]
})
export class HomeModule { }
