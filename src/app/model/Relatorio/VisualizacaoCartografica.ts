import { Relatorio } from './Relatorio';

export class VisualizacaoCartografica extends Relatorio {
  indicador: string;
  cidade: string;
  estado: string;
  data: Date;
  usuario: string;
  qtdeVisualizacao: Number;
  qtdeIndicadorExportacao:  Number;
  acao: String;
}
