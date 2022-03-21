import { BreadcrumbModule } from './../../../components/breadcrumb/breadcrumb.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';

import { MatCardModule, MatDividerModule, MatFormFieldModule, MatIconModule, MatProgressBarModule,
          MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatListModule, MatTableModule,
          MatCheckboxModule, MatPaginatorModule, MatSortModule, MatExpansionModule, MatChipsModule,
          MatSlideToggleModule, MatTooltipModule, MatTabsModule } from '@angular/material';

import { HistoricoOperacaoRoutingModule } from './historico-operacao-routing.module';
import { HistoricoOperacaoComponent } from './historico-operacao.component';

import { MatDatepickerModule, MatMomentDateModule } from '@coachcare/datepicker';
import { DatepickerPCSModule } from 'src/app/components/datepicker/datepickerpcs.module';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MomentDateAdapter, MatDateFormats} from '@coachcare/datepicker';

export const MY_FORMATS: MatDateFormats = {
  parse: {
		datetime: 'DD-MM-YYYY HH:mm',
		date: 'DD-MM-YYYY',
		time: 'HH:mm'
	},
	display: {
		datetime: 'DD/MM/YYYY HH:mm',
		date: 'DD/MM/YYYY',
		time: 'HH:mm',
		monthDayLabel: 'DD/MM',
		monthDayA11yLabel: 'DD/MM/YYYY',
		monthYearLabel: 'MMMM',
		monthYearA11yLabel: 'DD/MM/YYYY',
		dateA11yLabel: 'DD/MM/YYYY',
		timeLabel: 'HH:mm'
	},
};

@NgModule({
  declarations: [HistoricoOperacaoComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HistoricoOperacaoRoutingModule,
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
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatTabsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    DatepickerPCSModule,
    BreadcrumbModule
  ], providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
],
})
export class HistoricoOperacaoModule { }
