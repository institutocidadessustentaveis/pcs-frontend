import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'corReferencia'
})
export class CorReferenciaPipe implements PipeTransform {

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
        valor = '#FFFF00';
        break;
      } case 'Baixo': {
        valor = '#FFFF00';
        break;
      }
      case 'Aguardando Avaliação' : {
        valor = 'blue';
        break;
      }
      default : {
        valor = 'grey';
        break;
      }


    }

    return valor;
  }

}
