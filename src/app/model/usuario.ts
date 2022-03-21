import { Prefeitura } from 'src/app/model/prefeitura';
import { Credencial } from './credencial';
import { AreaInteresse } from './area-interesse';
import { AreaAtuacao } from './area-atuacao';

export class Usuario {

  //Dados gerais de usuário para os formulários
  id: number;
  nome: string;
  email: string;
  telefone: string;
  telefone_fixo: string;
  credencial: Credencial = new Credencial();
  cargo: string;
  recebeEmail: boolean;
  nomePerfil: string;

  //Dados para cadastro de cidadão
  areasInteresse: AreaInteresse[] = [];
  cidadeInteresse: string;
  organizacao: string;
  tipoInstituicao: string;
  areasAtuacoes: AreaAtuacao[] = [];

  //Dados para Cadastro de Gestao Publica
  prefeitura: Prefeitura;

  online: boolean;

  bloqueadoForum: boolean;

  //Dados referentes a paginação
  totalElements: number;
}
