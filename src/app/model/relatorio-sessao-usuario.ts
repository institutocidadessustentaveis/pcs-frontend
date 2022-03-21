import { Duration } from 'moment';
import { Relatorio } from './Relatorio/Relatorio';

export class RelatorioSessaoUsuario extends Relatorio {
    duracao: string;
    inicioSessao: Date;
    fimSessao: Date;
    cidadePrefeitura: string;
}
