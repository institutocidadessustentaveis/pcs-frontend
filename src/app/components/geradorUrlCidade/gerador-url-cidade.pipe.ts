import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'geradorUrlCidade'
})
export class GeradorUrlCidadePipe implements PipeTransform {
  constructor(private _sanitizer: DomSanitizer) { }

  transform(value: any, args?: any): any {
    const url = `/painel-cidade/detalhes/${value}`;
    return url;
  }
}
