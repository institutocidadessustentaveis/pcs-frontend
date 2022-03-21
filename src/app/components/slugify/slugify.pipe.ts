import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slugify'
})
export class SlugifyPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value) {
      const normalized = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizeSpaces = normalized.replace(/\s/g, '-');
      return normalizeSpaces.toLowerCase();
    } else {
      return '';
    }
  }

}
