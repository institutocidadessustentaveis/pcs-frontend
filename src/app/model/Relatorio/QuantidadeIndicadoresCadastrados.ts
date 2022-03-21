import { Relatorio } from './Relatorio';

export class QuantidadeIndicadoresCadastrados extends Relatorio {
  ano: number;
  prefeitura: string;
  estado: string;
  estadoSigla: string;
  codigoIBGE: number;
  quantidade: number;
}
