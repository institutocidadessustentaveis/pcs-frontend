import { Prefeitura } from './prefeitura';

export class PedidoAprovacaoPrefeitura {
    id: number;
    prefeitura: Prefeitura;
    nome:string;
    data:Date;
    dataAprovacao:Date;
    status:string;
    justificativa:string;
    inicioMandato:Date;
    fimMandato:Date;
}
