import { SafeUrl } from "@angular/platform-browser";

export class InstitucionalDinamicoImagem {
    id: number;
    conteudo: string;
    safeUrl: SafeUrl;
    nomeAutor: string = '';
    indice: number;
    subtitulo: string;
    titulo: string = '';
    link: string = '';
}
