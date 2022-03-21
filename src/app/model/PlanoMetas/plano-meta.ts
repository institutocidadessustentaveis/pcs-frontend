import { PlanoMetaDetalhes } from './plano-meta-detalhes';
import { Arquivo } from '../arquivo';
import { PlanoDeMetasDetalhadoHistorico } from '../plano-metas-detalhado-historico';

export class PlanoMeta {
    id?: number;
    statusPlanoDeMetas: string;
    nomeCidade: string;
    populacao: string;
    idPrefeitura?: number;
    nomePrefeito: string;
    inicioMandato: Date;
    fimMandato: Date;
    primeiroAnoMandato: number;
    segundoAnoMandato: number;
    terceiroAnoMandato: number;
    quartoAnoMandato: number;
    historicoMetas: PlanoDeMetasDetalhadoHistorico;
    planosDeMetasDetalhados: Array<PlanoMetaDetalhes>;
    apresentacao: string;
    descricao: string;
    arquivo: Arquivo;
    siglaEstado: string;
}
