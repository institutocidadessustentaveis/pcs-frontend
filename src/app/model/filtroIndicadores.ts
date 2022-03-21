import { Eixo } from './eixo';
import { ObjetivoDesenvolvimentoSustentavel } from './objetivoDesenvolvimentoSustentavel';
import { MetaObjetivoDesenvolvimentoSustentavel } from './metaObjetivoDesenvolvimentoSustentavel';
import { VariavelReferencia } from './variaveis-referencia';
import { Variavel } from './variaveis';
import { Cidade } from './cidade';

export class FiltroIndicadores {
  id?: number;
  nome: string;
  descricao: string;
  cidade: Cidade;
  valor: string;
  popDe: number;
  popAte: number;
  dataPreenchimento: Date;
  
  eixo: Eixo;
  ods: ObjetivoDesenvolvimentoSustentavel;
  variavel: Variavel;

}
