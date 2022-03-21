import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'exist-pipe'
})
export class ExistPipePipe implements PipeTransform {

  transform(objeto: any, atributo?: any): any {
    if (isNaN(objeto)) {
      if (atributo.indexOf( parseInt(objeto) ) > -1) {
        return true;
      }
    } else {
      if (atributo.indexOf(objeto) > -1) {
        return true;
      }
    }
    return false;
  }

}
