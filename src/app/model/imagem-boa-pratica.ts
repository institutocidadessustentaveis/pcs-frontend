import { SafeUrl } from '@angular/platform-browser';
export class ImagemBoaPratica {
    id: number;
    tipo: string;
    extensao: string;
    conteudo: string;
    safeUrl: SafeUrl;
    nomeAutor: string = '';
}
