import { Arquivo } from './arquivo';

export class MaterialApoio {
    id: number;
    titulo: string;
    subtitulo: string;
    autor: string;
    instituicao: string;
    dataPublicacao: Date;
    idioma: string;
    continente: string;
    pais: number;
    regiao: string;
    provinciaEstado: number;
    cidade: number;
    areasInteresse: number[];
    eixo: number[];
    indicador: number[];
    ods: number[];
    metaOds: number[];
    palavraChave: string;
    tag: string;
    publicoAlvo: string;
    tipoArquivo: string;
    tipoDocumento: string;
    tipoMaterial: string;
    tipologiaCgee: number;
    localExibicao: string;
    resumo: string;
    imagemCapa: Arquivo;
    arquivoPublicacao: Arquivo;
}
