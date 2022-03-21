import { Relatorio } from './Relatorio/Relatorio';

export class RelatorioIndicadoresPreenchidos extends Relatorio {
    prefeitura: string;
    estado: string;
    estadoNomecompleto: string;
    indicador: string;
    ods: string;
    eixo: string;
    dataPreenchimento: Date;
    codigoIBGE: number;
    anoIndicador: number;
    page: number;
    linesPerPage: number;
    count: number;
    orderBy = 'dataPreenchimento';
    direction = 'ASC';
    
}
