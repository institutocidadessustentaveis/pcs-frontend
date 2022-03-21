import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import {  MatNativeDateModule, MatFormFieldModule, MatInputModule, MatIconModule } from '@angular/material';

import { MatDatepickerModule, MatMomentDateModule, MatDatepickerIntl } from '@coachcare/datepicker';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MomentDateAdapter, MatDateFormats} from '@coachcare/datepicker';
import { PtDatetimeIntl } from 'src/app/services/pt-datetime.intl';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
		timeLabel: 'HH:mm',
	},
};

@NgModule({
  declarations: [DatepickerComponent],
  exports:[DatepickerComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule, MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'pt'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    { provide: MatDatepickerIntl, useClass: PtDatetimeIntl },
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DatepickerPCSModule { }
