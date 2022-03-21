import { Arquivo } from './arquivo';

export class MaterialApoioDetalhado {
    id: number;
    titulo: string;
    subtitulo: string;
    autor: string;
    instituicao: string;
    dataPublicacao: Date;
    idioma: string;
    continente: string;
    paisNome: string;
    provinciaEstadoNome: string;
    regiao: string;
    cidadeNome: string;
    areasInteresse: number[];
    eixoNome: string[] = [];
    indicadorNome: string[] = [];
    odsNome: string[] = [];
    metaOdsNome: string[] = [];
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
