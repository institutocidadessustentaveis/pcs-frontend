import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'geradorUrlIndicador'
})
export class GeradorUrlIndicadorPipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: any, args?: any): any {
    const url = `/visualizarindicador/${value}`;
    return url;
  }

}
