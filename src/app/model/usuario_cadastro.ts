import { Prefeitura } from 'src/app/model/prefeitura';
import { Credencial } from './credencial';
import { AreaInteresse } from './area-interesse';
import { AreaAtuacao } from './area-atuacao';

export class UsuarioCadastro {

  //Dados gerais de usuário para os formulários
  id: number;
  nome: string;
  email: string;
  telefone: string;
  telefone_fixo: string;
  credencial: Credencial = new Credencial();
  cargo: string;


  //Dados para cadastro de cidadão
  areasInteresse: AreaInteresse[] = [];
  cidadeInteresse: string;
  organizacao: string;
  tipoInstituicao: string;
  areasAtuacoes: AreaAtuacao[] = [];
  recebeEmail: boolean;

  //Dados para Cadastro de Gestao Publica
  prefeitura: Prefeitura;

  tokenRecaptcha: string;
}
