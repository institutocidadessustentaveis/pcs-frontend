import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  transform(objeto: any, atributo?: any): any {
    return Object.keys(objeto);
  }
}
