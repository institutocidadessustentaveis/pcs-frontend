import { Permissao } from './permissao';

export class Perfil {
  id: number;
  nome: string;
  padrao: boolean;
  gestaoPublica: boolean;
  permissoes: Permissao[] = [];
}
