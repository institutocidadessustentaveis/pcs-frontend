import { HomeBarra } from './home-barra';
import { PrimeiraSecao } from './primeira-secao';
import { HomeImagem } from './home-imagem';
import { SegundaSecao } from './segunda-secao';
import { TerceiraSecao } from './terceira-secao';
import { QuartaSecao } from './quarta-secao';
import { QuintaSecao } from './quinta-secao';
import { SecaoLateral } from './secao-lateral';
import { SextaSecao } from './sexta-secao';
import { SetimaSecao } from './setima-secao';


export class Home {

  id: number;
  link_pagina: string;
  titulo: string;
  galeriaDeImagens: HomeImagem[] = [];
  homeBarra =  new HomeBarra();
  listaPrimeiraSecao: PrimeiraSecao[] = [];
  listaSegundaSecao: SegundaSecao[] = [];
  listaTerceiraSecao: TerceiraSecao[] = [];
  listaQuartaSecao: QuartaSecao[] = [];
  listaQuintaSecao: QuintaSecao[] = [];
  listaSecaoLateral: SecaoLateral[] = [];
  listaSextaSecao: SextaSecao[] = [];
  listaSetimaSecao: SetimaSecao[] = [];
  exibir: boolean;
}
