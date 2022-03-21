import { BreadcrumbModule } from 'src/app/components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule, MatDialogModule,
  MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
  MatCheckboxModule, MatRadioModule, MatAutocompleteModule, MatProgressSpinnerModule,
  MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule, MatDatepicker, MatNativeDateModule, MatDatepickerModule, MatTooltipModule  } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

import { IndicadoresRoutingModule } from './indicadores-routing.module';
import { IndicadoresComponent } from './indicadores.component';
import { IndicadoresListComponent } from './indicadores-list.component';
import { NgxMaskModule } from 'ngx-mask';
import { CalculadoraFormulaComponent } from 'src/app/components/calculadora-formula/calculadora-formula.component';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';

@NgModule({
  declarations: [IndicadoresComponent, IndicadoresListComponent, CalculadoraFormulaComponent],
  imports: [
    CommonModule,
    IndicadoresRoutingModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressBarModule,
    MatInputModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatExpansionModule,
    MatChipsModule,
    MatOptionModule,
    MatSelectModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    DatepickerPCSModule,
    MatCheckboxModule,
    NgxMaskModule.forRoot(),
    BreadcrumbModule
  ]
})
export class IndicadoresModule { }
