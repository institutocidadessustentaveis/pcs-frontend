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

export class BoaPraticaDetalhe {
    id: string;
    endereco: string;
    site: string;
    dtInicio: Date;
    paginaInicial: boolean;
    imagemPrincipal: ImagemBoaPratica;
    galeriaDeImagens: ImagemBoaPratica[];
    galeriaDeVideos: string[];
    titulo: string;
    subtitulo: string;
    objetivoGeral: string;
    objetivoEspecifico: string;
    principaisResultados: string;
    aprendizadoFundamental: string;
    parceirosEnvolvidos: string;
    resultadosQuantitativos: string;
    resultadosQualitativos: string;
    parametrosContemplados: string;
    publicoAtingido: string;
    solucoes: [];
    // fontesReferencia: Arquivo[];
    fontesReferencia: string;
    informacoesComplementares: string;
    tipo: string;
    nomeCidade: string;
    nomeEstado: string;
    nomePais: string;
    nomeEixo: string;
    idCidade: number;
    possuiFiltro: boolean;
    dataPublicacao: Date;

    idEixo: number;
    linkEixo: string;
}
