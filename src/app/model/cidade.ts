import { Arquivo } from './arquivo';
import { ProvinciaEstadoSemCidade } from './provincia-estado-sem-cidade';
import { ProvinciaEstado } from './provincia-estado';
import { SubDivisao } from './SubDivisao';

export class Cidade {
    id: number;
    nome: string;
    codigoIbge: number;
    populacao?: number;
    anoDaPopulacao?: number;
    enderecoDaPrefeitura?: string;
    isSignataria?: boolean;
    provinciaEstado?: ProvinciaEstado;
    subdivisoes?: SubDivisao[] = [];
    eixoX: string;
    eixoY: string;
    habilitada: boolean;
    latitude: number;
    longitude: number;
    siglaEstado: string;

    site: string;
    area: string;
    densidadeDemografica: string;
    salarioMedioMensal: string;
    populacaoOcupada: string;
    pibPerCapita: string;
    idhM: string;
    textoCidade: string;
    fotoCidade: string;

    idPrefeitura?: number;

    arquivoPlanoMetas?: Arquivo;
    arquivoRelatorioContas?: Arquivo;
    urlFotoCidade?: string;

    shapeZoneamento: Array<any>;

    //Ponto Focal
    nomeContato?: string;
    telFixoContato?: string;
    telMovelContato?: string;
    emailContato?: string;
    campoObservacao?: string;
}
