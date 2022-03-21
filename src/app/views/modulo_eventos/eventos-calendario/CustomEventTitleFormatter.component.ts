import { Injectable } from '@angular/core';
import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
import { DatePipe } from '@angular/common';

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {

    publicadoTemplate: string;


   month(event: any): string {
    const date = new Date(event.start);
    const dateTimeFormat = new Intl.DateTimeFormat('pt', { year: 'numeric', month: 'short', day: '2-digit' })
    const [{ value: month }, , { value: day }, , { value: year }] = dateTimeFormat .formatToParts(date )
    if (event.publicado) {
        this.publicadoTemplate = 'Sim';
    } else {
        this.publicadoTemplate = 'Não';
    }
    const strs = event.horario.split(':');

    date.setHours(strs[0]);
    date.setMinutes(strs[1]);
    date.setSeconds(strs[2]);
    return `
     <b>Nome</b>: ${event.title} |<b> Data:</b> ${month} ${day} ${year} às ${new DatePipe('pt-br').transform(date, 'HH')}h${new DatePipe('pt-br').transform(date, 'mm')} |<b> Organizador:</b> ${event.organizador ? event.organizador : 'Não possui'}</p>
     `;
  }
}
