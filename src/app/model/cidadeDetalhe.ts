import { ProvinciaEstadoSemCidade } from './provincia-estado-sem-cidade';
import { ProvinciaEstado } from './provincia-estado';
import { SubDivisao } from './SubDivisao';

export class CidadeDetalhe {
    id: number;
    nome: string;
    populacao?: number;
    anoDaPopulacao?: number;
    idEstado: number;
    nomeEstado: string;
    siglaEstado: string;
    nomePais: string;
    nomeContinente: string;
    latitude: number;
    longitude: number;
}
