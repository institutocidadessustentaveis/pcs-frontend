import { ArquivoInstitucional } from './arquivo-institucional';
import { SafeUrl } from '@angular/platform-browser';


export class QuartaSecao {
  id: number;
  indice: number;
  tituloPrincipal: string;
  tituloPrincipalCor: string;
  tituloPrincipalLink: string;

  primeiroTitulo: string;
  primeiroTituloCor: string;
  primeiroTituloLink: string;

  primeiraImagem: string;
  primeiraImagemSafeUrl: SafeUrl;
  primeiraImagemLink: string;
  primeiraImagemTooltip: string;

  primeiroBotaoTexto: string;
  primeiroBotaoTextoCor: string;
  primeiroBotaoLink: string;

  exibir: boolean;
  tipo: string;

}
