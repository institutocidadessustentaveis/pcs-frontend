import { ObjetivoDesenvolvimentoSustentavel } from './objetivoDesenvolvimentoSustentavel';

export class Eixo {
  id: number;
  icone: string;
  nome: string;
  link: string;
  listaODS: Array<ObjetivoDesenvolvimentoSustentavel>;

  equals(other) {
    return typeof this === typeof other && this.id === other.id ;
  }
  hashcode() {
    return this.id * 87848;
  }
}
