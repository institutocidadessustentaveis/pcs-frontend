import { TipoSubdivisao } from './tipoSubdivisao';

export class SubDivisao {
    id: number = null;
    nome = '';
    cidade: number = null;
    subdivisaoPai : SubDivisao;
    tipoSubdivisao  : TipoSubdivisao;
    features: any[];
}