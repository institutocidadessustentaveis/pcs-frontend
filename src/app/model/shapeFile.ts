import { AreaInteresse } from './area-interesse';
import { ImagemBoaPratica } from './imagem-boa-pratica';
import { RasterItem } from './rasterItem';

export class ShapeFile {
    id: number;
    ano: number;
    titulo: string;
    areasInteresse: any[] = [];
    temaGeoespacial: number; //id
    instituicao: string;
    fonte: string;
    sistemaDeReferencia: string;
    tipoArquivo: string;
    nivelTerritorial: string;
    regiao: string;
    publicar: boolean;
    shapes: Array<any>;
    raster: RasterItem;
    origemCadastro: string;
    idCidade: number;
    fileName: string;
    eixos: any[] = [];
    ods: any[] = [];
    metas: any[] = [];
    indicador: number[];
    indicadores: number[];
    palavra: string;
    mosaico: string;
    codigoFolha: string;
    integridade: string;
    codigoMapa: string;
    resumoConteudo: string;
    dadosMapeados: string;
    escala: string;
    pais: number;
    cidades: any[] = [];
    estados: any[] = [];
    cartografia: string;
    latitude: number;
    longitude: number;
    atualizacao: string;
    ambiente: string;
    codificacao: string;
    dataHoraAlteracao: Date;
    dataHoraCadastro: Date;
    exibirAuto: boolean;
}
