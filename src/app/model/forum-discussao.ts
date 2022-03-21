import { TemaForum } from 'src/app/model/tema-forum';
import { DiscussaoPerfil } from './discursao-perfil';
import { Usuario } from './usuario';

export class ForumDiscussao {
  id: number;
  titulo: string;
  descricao: string;
  dataHoraCriacao: Date;
  dataAtivacao: Date;
  horaAtivacao: string;
  dataDesativacao: Date;
  horaDesativacao: string;
  publico = false;
  discussaoPerfis: DiscussaoPerfil[] = [];
  usuarioUltimaPostagem: Usuario;
  numeroDeRespostas: number;
  numeroDeVisualizacao: number;
  ativo = false;
  prefeituraId: number;
  temasForum: Array<TemaForum>;
  usuarioCadastro: number;
}
