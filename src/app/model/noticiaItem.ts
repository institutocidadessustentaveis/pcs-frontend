import { SafeUrl } from '@angular/platform-browser';


export class NoticiaItem {
    idNoticia: number;
    titulo: string;
    subtitulo: string;
    autor: string;
    usuario: string;
    dataHoraCriacao: Date;
    dataHoraPublicacao: Date;
    imagemPrincipal: string;
    corpoTexto: string;
    palavraChave: string;
    imagemPrincipalSafe: SafeUrl;
    urlImagem: any;
}
