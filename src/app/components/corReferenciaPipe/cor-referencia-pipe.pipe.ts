import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'corReferenciaPipe'
})
export class CorReferenciaPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: any, args?: any): any {
    let valor = 'grey';
    switch(value){

      case 'Alto': {
        valor = '#39FF33';
        break;
      } case 'Médio Alto': {
        valor = '#FFFF00';
        break;
      } case 'Médio Baixo': {
        valor = '#FFA500';
        break;
      } case 'Baixo': {
        valor = '#FF0000';
        break;
      }
      case 'Aguardando Avaliação' : {
        valor = 'blue';
        break;
      }
      default : {
        valor = 'lightgrey';
        break;
      }


    }

    return valor;
  }
}
