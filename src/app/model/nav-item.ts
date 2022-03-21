
import { Noticia } from './noticia';
import { BuscarItem } from './buscarItem';

export class NavItem {

  id?: number;
  displayName?: string;
  disabled?: boolean;
  restrito?: boolean;
  route?: string;
  iconName?: string;
  children?: NavItem[];
  url_name?: string;
  itemPrincipal?: boolean;

}
