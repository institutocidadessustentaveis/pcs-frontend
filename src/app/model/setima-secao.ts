import { ArquivoInstitucional } from './arquivo-institucional';
import { SafeUrl } from '@angular/platform-browser';


export class SetimaSecao {
  id: number;
  indice: number;
  tituloPrincipal: string;
  tituloPrincipalCor: string;
  tituloPrincipalLink: string;

  primeiroTitulo: string;
  primeiroTituloCor: string;
  primeiroTituloLink: string;
  primeiroTexto = '';
  primeiroTextoCor: string;
  primeiroTextoLink: string;
  primeiraImagem: string;
  primeiraImagemSafeUrl: SafeUrl;
  primeiraImagemLink: string;
  primeiraImagemTooltip: string;

  exibir: boolean;
  tipo: string;
}
