import { Arquivo } from './arquivo';
import { SafeUrl } from '@angular/platform-browser';
export class InstitucionalDinamicoPublicacao {
  id: number;
  imagem: string;
  imagemSafeUrl: SafeUrl;
  idImagem: number;
  titulo: string;
  link: string;
  texto: string;
  ordemExibicao: number;
  idInstitucionalDinamicoSecao03: number;
  tooltipTexto: string;
  tooltipTitulo: string;
  cancelado: boolean;
  editado: boolean;
}
