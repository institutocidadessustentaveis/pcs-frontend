import { SafeUrl } from '@angular/platform-browser';
import { BoaPratica } from './boaPratica';
import { ProvinciaEstadoSemCidade } from './provincia-estado-sem-cidade';
import { ProvinciaEstado } from './provincia-estado';
import { SubDivisao } from './SubDivisao';

export class BoaPraticaItem {
    idBoaPratica: number;
    titulo: string;
    subtitulo: string;
    objetivoGeral: string;
    imagemPrincipal: string;
    nomeCidade: string;
    nomeProvinciaEstado: string;
    nomePais: string;
    imagemPrincipalSafe; SafeUrl;
    urlImagem: any;
    autorImagemPrincipal: string;
}
