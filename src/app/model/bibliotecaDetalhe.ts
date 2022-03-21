import { AreaInteresse } from './area-interesse';
import { Eixo } from './eixo';
import { Indicador } from './indicadores';
import { MetaObjetivoDesenvolvimentoSustentavel } from './metaObjetivoDesenvolvimentoSustentavel';
import { ObjetivoDesenvolvimentoSustentavel } from './objetivoDesenvolvimentoSustentavel';
import { Arquivo } from './arquivo';

export class BibliotecaDetalhe {
    id: number;
    areasInteresse: Array<AreaInteresse>;
    autor: string;
    tipoAutor: string;
    cidadeNome: string;
    dataPublicacao: any;
    eixos: Array<Eixo>;
    idioma: string;
    imagemCapa: Arquivo;
    indicadores: Array<Indicador>;
    instituicao: string;
    meta: Array<MetaObjetivoDesenvolvimentoSustentavel>;
    ods: Array<ObjetivoDesenvolvimentoSustentavel>;
    paisNome: string;
    palavraChave: string;
    publicoAlvo: string;
    descricao: string;
    subtitulo: string;
    tipoMaterial: string;
    tituloPublicacao: string;
    usuarioNome: string;
    localExibicao: string;
    modulo: string;
    estadoNome: string;
    galeriaDeVideos: string[];
    galeriaDeAudios: Arquivo[];
    possuiArquivos: boolean;
    grupoAcademico: string;
    shapeFiles: number[];
}
