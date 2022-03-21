import { GrupoAcademicoBibliotecaPainel } from './grupoAcademicoBibliotecaPainel';
export class GrupoAcademicoPainel {
    id: number;
    nomeCidade: string;
    nomeEstado: string;
    nomePais: string;
    tipo: string;
    paginaOnline: string;
    nomeContato: string;
    emailContato: string;
    telefoneContato: string;
    emailInstitucional: string;
    telefoneInstitucional: string;
    linkBaseDados: string;
    observacoes: string;
    descricaoInstituicao: string;
    experienciasDesenvolvidas: string;
    logradouro: string;
    numero: string;
    complemento: string;
    quantidadeAlunos: number;
    nomeAcademia: string;
    nomeApl: string;
    descricaoApl: string;
    areasInteresse: string;
    eixos: string;
    ods: string;
    bibliotecas: GrupoAcademicoBibliotecaPainel[];
}