import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripTags'
})
export class StripTagsPipe implements PipeTransform {

  // CASO O PIPE APRESENTE PROBLEMAS EXCLUIR A FORMATAÇÃO QUE ESTÁ EM USO ATUALMENTE E VOLTAR ESSA
  // FOI FEITO ISSO POIS ESSE PIPE COMENTADO ESTÁ EXLUINDO ALGUNS CARACTERES ESPECIAIS - 14/08/2020
  
  // Att1: Agora o metodo transform ja formata unicode tambem.

  // transform(text: string, ...usefulTags: any[]): string {
  //   return text.replace(/<[^>]*(>|$)|&nbsp;|&zwnj;|&raquo;|&laquo;|&gt;/g, ' ');
  // }

  transform(text: string, ...usefulTags: any[]): string {
    var stringSemTags = usefulTags.length > 0
      ? text.replace(new RegExp(`<(?!\/?(${usefulTags.join('|')})\s*\/?)[^>]+>`, 'g'), '')
      : text.replace(/<(?:.|\s)*?>/g, '');

      return this.decodeHTMLEntities(stringSemTags);
  }

  decodeHTMLEntities(text) {
    var entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i) 
        text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);

    return text;
}

}
