import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatCardModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatTooltipModule, MatInputModule, MatDividerModule, MatFormFieldModule, MatProgressBarModule, MatDialogModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatRadioModule, MatListModule, MatAutocompleteModule, MatPaginatorModule, MatSortModule, MatExpansionModule } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { HomeFormComponent } from './home-form.component';
import { SecaoLateral1Component } from './secao-lateral-1/secao-lateral-1.component';
import { SecaoLateral2Component } from './secao-lateral-2/secao-lateral-2.component';
import { SecaoLateral3Component } from './secao-lateral-3/secao-lateral-3.component';
import { SecaoLateral4Component } from './secao-lateral-4/secao-lateral-4.component';
import { PrimeiraSecaoViewComponent } from './primeira-secao-view/primeira-secao-view.component';
import { SegundaSecaoViewComponent } from './segunda-secao-view/segunda-secao-view.component';
import { TerceiraSecaoViewComponent } from './terceira-secao-view/terceira-secao-view.component';
import { QuartaSecaoViewComponent } from './quarta-secao-view/quarta-secao-view.component';
import { QuintaSecaoViewComponent } from './quinta-secao-view/quinta-secao-view.component';
import { HomeFormRoutingModule } from './home-form-routing.module';
import { SecaoLateralViewComponent } from './secao-lateral-view/secao-lateral-view.component';
import { EditarIndiceSecaoComponent } from './editar-indice-secao/editar-indice-secao.component';
import { SextaSecaoViewComponent } from './sexta-secao-view/sexta-secao-view.component';
import { SetimaSecaoViewComponent } from './setima-secao-view/setima-secao-view.component';


@NgModule({
  declarations: [
    PrimeiraSecaoViewComponent,
    SegundaSecaoViewComponent,
    TerceiraSecaoViewComponent,
    QuartaSecaoViewComponent,
    QuintaSecaoViewComponent,
    SextaSecaoViewComponent,
    SetimaSecaoViewComponent,
    HomeFormComponent,
    SecaoLateral1Component,
    SecaoLateral2Component,
    SecaoLateral3Component,
    SecaoLateral4Component,
    SecaoLateralViewComponent,
    EditarIndiceSecaoComponent],
  imports: [
    CommonModule,
    HomeFormRoutingModule,
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
  entryComponents: [EditarIndiceSecaoComponent],
})
export class HomeFormModule { }
