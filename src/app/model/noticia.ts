import { Credencial } from './credencial';
import { NoticiaHistorico } from './noticiaHistorico';
import { Eixo } from './eixo';
import { AreaInteresse } from './area-interesse';
import { ObjetivoDesenvolvimentoSustentavel } from './objetivoDesenvolvimentoSustentavel';

export class Noticia {
  id: number = null;
  publicada: boolean;
  titulo: string;
  subtitulo: string;
  autor: string;
  usuario: String;
  dataHoraCriacao: Date;
  dataHoraPublicacao: Date;
  corpoTexto: string;
  imagemPrincipal: string;
  palavraChave: string;
  exibirEventoTelaInicial: boolean;
  eixos: Array<Eixo>;
  odss: Array<ObjetivoDesenvolvimentoSustentavel>;
  noticiaHistorico: Array<NoticiaHistorico>;
  areasDeInteresse: Array<AreaInteresse>;
  linksRelacionados: Array<string>;
  noticiaEvento: boolean;
  imagemEditada: boolean;
  possuiFiltro: boolean;
  habilitaEstilo: boolean;
}
