import { SafeUrl } from '@angular/platform-browser';
import { Publicacao } from './publicacao';


export class TemplateInstitucional03 {
  id: number;
  tituloPrimeiraSecao: string;
  textoPrimeiraSecao: string;
  imagemPrimeiraSecao: string;
  imagemPrimeiraSecaoSafeUrl: SafeUrl;
  tituloSegundaSecao: string;
  tipoPublicacao: string;
  publicacoes: any[] = [];
  publicacoes2: any[] = [];
  idPrimeiroDestaque: number;
  idSegundoDestaque: number;
  idTerceiroDestaque: number;
  idQuartoDestaque: number;
  tituloCatalogo1: string;
  tituloCatalogo2: string;
  verMaisPCS: boolean;
  verMaisInstituicao: boolean;
  tituloSecaoTexto: string;
  secaoTexto: string;
}
