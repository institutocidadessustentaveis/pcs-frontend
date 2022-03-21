

import { NavItemPagina } from './nav-itemPagina';

export class NavItemDetalhe {

  id?: number;
  displayName?: string;
  restrito?: boolean;
  posicao?: number;
  pagina?: NavItemPagina = new NavItemPagina();
  idsPerfil?: number[];
  idNavItemPai?: number;
  naoLogado?: boolean;
  url_name?: string;
  tipoItem?: string;
}
