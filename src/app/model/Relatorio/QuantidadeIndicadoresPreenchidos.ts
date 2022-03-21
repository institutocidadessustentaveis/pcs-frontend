import { Relatorio } from './Relatorio';

export class QuantidadeIndicadoresPreenchidos extends Relatorio {
  prefeitura: string;
  estado: string;
  estadoSigla: string;
  codigoIBGE: number;
  ano: string;
  quantidade: number;
  populacao: number;
}
