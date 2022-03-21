import { Eixo } from './eixo';
import { ObjetivoDesenvolvimentoSustentavel } from './objetivoDesenvolvimentoSustentavel';
import { MetaObjetivoDesenvolvimentoSustentavel } from './metaObjetivoDesenvolvimentoSustentavel';
import { VariavelReferencia } from './variaveis-referencia';
import { Variavel } from './variaveis';

export class Indicador {
  id?: number;
  nome: string;
  descricao: string;
  eixo: Eixo;
  ods: ObjetivoDesenvolvimentoSustentavel;
  metaOds: MetaObjetivoDesenvolvimentoSustentavel;
  metaODS: MetaObjetivoDesenvolvimentoSustentavel;
  tipo_resultado: string;
  ordem_classificacao: string;
  formula_resultado: string;
  formula_referencia: string;
  variaveis: Array<Variavel>;
  referencia: Array<VariavelReferencia>;
  numerico: boolean;
  complementar: Boolean;
}
