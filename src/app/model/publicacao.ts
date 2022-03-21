import { Arquivo } from './arquivo';
import { SafeUrl } from '@angular/platform-browser';
export class Publicacao {
  id: number;
  imagem: string;
  imagemSafeUrl: SafeUrl;
  idImagem: number;
  titulo: string;
  link: string;
  texto: string;
  ordemExibicao: number;
  idTemplate03: number;
  idsArquivos: number[];
  tooltipTexto: string;
  tooltipTitulo: string;
  idMaterialApoio: number;
  idMaterialInstitucional: number;
  materialInstitucional: any;
  materialApoio: any;
  cancelado: boolean;
  editado: boolean;
}
