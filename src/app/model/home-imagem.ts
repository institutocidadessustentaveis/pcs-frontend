import { SafeUrl } from '@angular/platform-browser';
export class HomeImagem {
    id: number;
    tipo: string;
    extensao: string;
    conteudo: string;
    safeUrl: SafeUrl;
    titulo: string = '';
    subtitulo: string = '';
    nomeAutor: string = '';
    link: string = '';
    indice: number;
    exibirBusca: boolean;
}
