import { Perfil } from './perfil';
import { ForumDiscussaoService } from '../services/forum-discussao.service';
import { ForumDiscussao } from './forum-discussao';

export class DiscussaoPerfil {
  id: number;
  perfil: Perfil;
  autorizacao: string = '';
  autorizacaoList: string[] = [];
}
