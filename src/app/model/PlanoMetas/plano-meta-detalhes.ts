import { PlanoDeMetasDetalhadoHistorico } from '../plano-metas-detalhado-historico';

export class PlanoMetaDetalhes{
id?:Number;
idIndicador?:Number;
nomeIndicador:string;
descricaoIndicador:string;
ultimoValorIndicador:string;
ultimoValorIndicadorApresentacao:string;
statusUltimoValor:string;
corUltimoValor:string;
ods:string;
idOds:string;
metaOds:string;
metaOdsNumero:string;
metaFinal:string;
valorPreenchidoPrimeiroAno:string;
valorPreenchidoSegundoAno:string;
valorPreenchidoTerceiroAno:string;
valorPreenchidoQuartoAno:string;
valorPreenchidoPrimeiroAnoApresentacao:string;
valorPreenchidoSegundoAnoApresentacao:string;
valorPreenchidoTerceiroAnoApresentacao:string;
valorPreenchidoQuartoAnoApresentacao:string;
metaAnualPrimeiroAno:string;
metaAnualSegundoAno:string;
metaAnualTerceiroAno:string;
metaAnualQuartoAno:string;

metaAnualPrimeiroAnoApresentacao:string;
metaAnualSegundoAnoApresentacao:string;
metaAnualTerceiroAnoApresentacao:string;
metaAnualQuartoAnoApresentacao:string;
variacaoPrimeiroAno:number;
variacaoSegundoAno:number;
variacaoTerceiroAno:number;
variacaoQuartoAno:number;
orcamentoPrevisto:number;
orcamentoExecutado:number;
exibirItemTabela:boolean;
justificativa:string;
chartData: any;
anos: any;
planoParaAlcancarProposta: string;
historicoMetas: PlanoDeMetasDetalhadoHistorico;
}
