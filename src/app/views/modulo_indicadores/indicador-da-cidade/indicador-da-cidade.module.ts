import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndicadorDaCidadeRoutingModule } from './indicador-da-cidade-routing.module';
import { IndicadorDaCidadeComponent } from './indicador-da-cidade.component';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatTabsModule  } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/';
import { ShareModule } from '@ngx-share/core';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SerieHistoricaVariavelComponent } from '../serie-historica-variavel/serie-historica-variavel.component';

@NgModule({
  declarations: [IndicadorDaCidadeComponent, SerieHistoricaVariavelComponent],
  imports: [
    CommonModule,
    IndicadorDaCidadeRoutingModule,
    ReactiveFormsModule,
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
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    ChartsModule,
    ShareModule,
    AngularFontAwesomeModule,
    NgxChartsModule,
    BreadcrumbModule
  ], exports:[SerieHistoricaVariavelComponent]
})
export class IndicadorDaCidadeModule { }
