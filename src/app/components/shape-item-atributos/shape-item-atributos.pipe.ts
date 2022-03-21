import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shapeItemAtributos'
})
export class ShapeItemAtributosPipe implements PipeTransform {

  transform(objeto: any, atributo?: any): string {
    if (objeto._layers) {
      const keys = Object.keys(objeto._layers);
      return objeto._layers[keys[0]].feature.properties[atributo];
    } else {
      if (objeto.properties){
        return objeto.properties[atributo];
      } else {
        return '';
      }
    }
  }
}
