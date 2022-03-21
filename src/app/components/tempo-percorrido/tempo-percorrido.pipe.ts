import { Pipe, PipeTransform } from '@angular/core';
var moment = require('moment');

@Pipe({
  name: 'tempoPercorrido'
})
export class TempoPercorridoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    let data = moment(value);
    moment.updateLocale('en', {
      relativeTime : {
          future: "%s",
          past: "%s",
          s  : 'há alguns segundos',
          ss : 'há %d segundos',
          m:  "há um minuto",
          mm: "há %d minutos",
          h:  "há uma hora",
          hh: "há %d horas",
          d:  "há um dia",
          dd: "há %d dias",
          M:  "há um mês",
          MM: "há %d meses",
          y:  "há um ano",
          yy: "há %d anos"
      }
    });
    return `(${data.local().fromNow()})`;
  }
}
