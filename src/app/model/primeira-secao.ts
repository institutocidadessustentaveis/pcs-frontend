import { ArquivoInstitucional } from './arquivo-institucional';
import { SafeUrl } from '@angular/platform-browser';


export class PrimeiraSecao {
  id: number;
  indice: number;
  primeiroTitulo = '';
  primeiroTexto: string;
  primeiraImagem: string;
  primeiraImagemSafeUrl: SafeUrl;
  nomeAutorPrimeiraImagem: string;
  primeiroTituloCor: string;
  primeiroTituloLink: string;
  primeiroTextoCor: string;
  primeiroTextoLink: string;
  linhasCor: string;
  exibir: boolean;
  tipo: string;
}
