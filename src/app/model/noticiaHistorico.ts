import { Usuario } from './usuario';
import { Noticia } from './noticia';

export class NoticiaHistorico {
  id: number;
  usuario: Usuario;
  noticia: Noticia;
  dataHora: Date;

}
