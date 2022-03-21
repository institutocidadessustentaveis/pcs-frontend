import { Indicador } from './indicadores';

export class MetaObjetivoDesenvolvimentoSustentavel {
    id: number = null;
    numero: string;
    descricao: string;
    indicadores: Array<Indicador> = [];
}
