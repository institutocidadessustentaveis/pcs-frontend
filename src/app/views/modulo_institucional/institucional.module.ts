import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstitucionalRoutingModule } from './institucional-routing.module';
import { InstitucionalComponent } from './institucional.component';
import { MatIconModule, MatCardModule, MatButtonModule, MatTableModule, MatProgressSpinnerModule, MatTooltipModule, MatInputModule, MatDialogModule, MatAutocompleteModule, MatFormFieldModule, MatRadioModule, MatDialog } from '@angular/material';
import { NgxSummernoteModule } from 'ngx-summernote';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { OdsInstitucionalComponent } from './ods-institucional/ods-institucional.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HistoricoCidadesSignatariasComponent } from './historico-cidades-signatarias/historico-cidades-signatarias.component';
import { DadosDownloadModule } from 'src/app/components/dados-download/dados-download.module';


@NgModule({
  declarations: [
    InstitucionalComponent,
    OdsInstitucionalComponent],
  imports: [
    CommonModule,
    InstitucionalRoutingModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    NgxSummernoteModule,
    AngularFontAwesomeModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    DadosDownloadModule
  ],
  entryComponents: []
})
export class InstitucionalModule { }
