import { SafeUrl } from '@angular/platform-browser';
import { MetaObjetivoDesenvolvimentoSustentavel } from "./metaObjetivoDesenvolvimentoSustentavel";

export class ObjetivoDesenvolvimentoSustentavel {
  id: number = null;
  numero: number;
  titulo: string;
  subtitulo: string;
  descricao: string;
  icone: string;
  iconeReduzido: string;
  metas: MetaObjetivoDesenvolvimentoSustentavel[] = [];
  iconeSafeUrl: SafeUrl;
  iconeReduzidoSafeUrl: SafeUrl;
}
