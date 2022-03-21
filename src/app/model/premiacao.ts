import { StatusPremiacao } from './enums/premiacao-enum';
import { Arquivo } from './arquivo';
import { SafeResourceUrl } from '@angular/platform-browser';


export class Premiacao {
  id: number;
  inicio: Date;
  fim: Date;
  descricao: StatusPremiacao;
  status: string;
  bannerPremiacao: Arquivo;
  bannerPremiacaoConv: SafeResourceUrl;
  }
