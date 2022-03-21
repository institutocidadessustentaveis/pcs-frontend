import { VariaveisOpcoes } from './variaveis-opcoes';

export class VariavelResposta {
  id?: number;
  respostaSim: number;
  respostaNao: number; 
  exibirOpcaoSim: boolean;
  exibirOpcaoNao: boolean;
  exibirOpcao: boolean;
  listaOpcoes: Array<VariaveisOpcoes>;
}
