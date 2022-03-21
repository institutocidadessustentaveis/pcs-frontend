import { Relatorio } from './Relatorio';

export class RelatorioPlanoDeMetas extends Relatorio {
  cidade: string;
  estado: string;
  estadoSigla: string;
  codigoIBGE: number;
  arquivo: string;
  inicioMandato: Date;
  fimMandato: Date;
}
