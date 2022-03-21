import { RasterItem } from "./rasterItem";

export class ShapefileDetalheDTO {
    id: number;
    ano: number;
    titulo: string;
    areasInteresse: string[] = [];
    temaGeoespacial: string; //nome
    instituicao: string;
    shapes: Array<any>;
    raster: RasterItem;
    fonte: string;
    sistemaDeReferencia: string;
    tipoArquivo: string;
    nivelTerritorial: string;
    regiao: string;
    publicar: boolean;
    eixos: string[] = [];
    ods: number[] = [];
    metas: string[] = [];
    indicadores: string[];
    palavra: string;
    integridade: string;
    codigoMapa: string;
    resumoConteudo: string;
    dadosMapeados: string;
    escala: string;
    pais: string;
    cidades: string[] = [];
    estados: string[] = [];
    cartografia: string;
    latitude: number;
    longitude: number;
    atualizacao: string;
    ambiente: string;
    codificacao: string;
    exibirAuto: boolean;
    mosaico: string;
}