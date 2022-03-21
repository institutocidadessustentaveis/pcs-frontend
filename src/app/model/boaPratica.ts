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

export class BoaPratica {
    id: string;
    nomeInstituicao: string;
    idPais: number;
    idEstado: number;
    idMunicipio: number;
    endereco: string;
    site: string;
    nomeResponsavel: string;
    contato: string;
    email: string;
    telefone: string;
    celular: string;
    dtInicio: Date;
    dataPublicacao: Date;
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
    // fontesReferencia: Arquivo[];
    fontesReferencia: string;
    idEixo: number;
    idsOds: number[] = [];
    idsMetasOds: number[] = [];
    idsIndicadores: number[] = [];
    informacoesComplementares: string;

    solucoes = [];

    idPrefeituraCadastro: number;
    tipo: string;

    possuiFiltro: boolean;
    autorImagemPrincipal: string;
}
