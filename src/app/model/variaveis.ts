import { VariavelResposta } from './variaveis-resposta';
import { VariavelReferencia } from './variaveis-referencia';

export class Variavel {
  id?: number;
  nome: string;
  descricao: string;
  tipo: string;
  unidade: string;
  variavelBasica: boolean;
  permiteImportacao: boolean;
  multiplaSelecao: boolean;
  variavelResposta: VariavelResposta;
  variavelReferencia: Array<VariavelReferencia>;
}
