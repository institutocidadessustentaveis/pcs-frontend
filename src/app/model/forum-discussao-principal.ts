import { Usuario } from './usuario';

export class ForumDiscussaoPrincipal {
  id: number;
  titulo: string;
  dataHoraCriacao: Date;
  usuarioUltimaPostagem: Usuario;
  numeroDeRespostas: number;
  numeroDeVisualizacao: number;
  ativo: boolean;
  publico: boolean;
}
