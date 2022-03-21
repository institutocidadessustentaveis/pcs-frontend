import { Perfil } from './perfil';

export class Credencial {
  id: number;
  login: string;
  senha: string;
  roles: string[] = [];
  expiracao: number;
  listaPerfil: Perfil[] = [];
  nome: string;
}
