import { ProvinciaEstadoSemCidade } from './provincia-estado-sem-cidade';
import { ProvinciaEstado } from './provincia-estado';
import { SubDivisao } from './SubDivisao';
import { Cidade } from './cidade';
import { Pais } from './pais';
import { Arquivo } from './arquivo';
import { Eixo } from './eixo';
import { ObjetivoDesenvolvimentoSustentavel } from './objetivoDesenvolvimentoSustentavel';
import { Indicador } from './indicadores';
import { MetaObjetivoDesenvolvimentoSustentavel } from './metaObjetivoDesenvolvimentoSustentavel';
import { ImagemBoaPratica } from './imagem-boa-pratica';

export class MaterialInstitucional {
    id: string;
    titulo: string;
    subtitulo: string;
    autor: string;
    linksRelacionados: string[];
    tagPalavrasChave: string[];
    corpoTexto: string;
    dtPublicacao: Date;
    arquivos: Arquivo[];
}
