import { Cidade } from './cidade';
import { Pais } from './pais';

export class ProvinciaEstado {
  id: number;
  idProvinciaEstado: number;
  sigla: string;
  nome: string;
  pais: Pais;
  populacao: string;
  cidades: Array<Cidade> = [];
  nomePais: string;
}
