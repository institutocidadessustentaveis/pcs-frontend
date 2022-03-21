
export class DadosDownloadDTO {
    id: Number;
    cidade: number;
    email: string;
    nome: string;
    organizacao: string;
    boletim: boolean;
    arquivo: string;
    dataDownload: Date;
    usuarioNome: string;
    nomeCidade: string;
    acao: string;
    pagina: string;
    
    //Dados para busca filtrada
    dataInicio: Date;
    dataFim: Date;
}