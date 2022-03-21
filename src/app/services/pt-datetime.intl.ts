import { Injectable } from '@angular/core';
import { MatDatepickerIntlCatalog } from '@coachcare/datepicker';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PtDatetimeIntl implements MatDatepickerIntlCatalog {
    readonly changes = new Subject<void>();
    calendarLabel = 'Calendário';
    openCalendarLabel = 'Abrir';
    prevMonthLabel = 'Mês Anterior';
    nextMonthLabel = 'Mês Seguinte';
    prevYearLabel = 'Ano Anterior';
    nextYearLabel = 'Ano Seguinte';
    setToAMLabel = 'Manhã';
    setToPMLabel = 'Tarde';
    switchToMinuteViewLabel = 'Minutos';
    switchToHourViewLabel = 'Horas';
    switchToMonthViewLabel = 'Mês';
    switchToYearViewLabel = 'Ano';
    switchToYearsViewLabel = 'Anos';
    buttonSubmitText = 'Ok';
    buttonSubmitLabel = 'Selecionar';
    buttonCancelText = 'Cancelar';
    buttonCancelLabel = 'Cancelar data';
}
