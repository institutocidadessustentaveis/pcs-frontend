import { AreaInteresse } from './area-interesse';
import { ImagemBoaPratica } from './imagem-boa-pratica';
import { RasterItem } from './rasterItem';

export class ShapeFileMerged {
    id: number;
    ano: number;
    titulo: string;
    areasInteresse: AreaInteresse[] = [];
    instituicao: string;
    fonte: string;
    sistemaDeReferencia: string;
    tipoArquivo: string;
    nivelTerritorial: string;
    publicar: boolean;
    features: any[];
    origemCadastro: string;
}
