import { ArquivoInstitucional } from './arquivo-institucional';
import { SafeUrl } from '@angular/platform-browser';


export class SextaSecao {
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

  segundoTitulo: string;
  segundoTituloCor: string;
  segundoTituloLink: string;
  segundoTexto = '';
  segundoTextoCor: string;
  segundoTextoLink: string;
  segundaImagem: string;
  segundaImagemSafeUrl: SafeUrl;
  segundaImagemLink: string;
  segundaImagemTooltip: string;

  exibir: boolean;
  tipo: string;
}
