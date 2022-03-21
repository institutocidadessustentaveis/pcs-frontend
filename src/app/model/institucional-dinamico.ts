import { InstitucionalDinamicoSecao1 } from './institucional-dinamico-secao1';
import { SafeUrl } from '@angular/platform-browser';
import { InstitucionalDinamicoSecao2 } from './institucional-dinamico-secao2';
import { InstitucionalDinamicoSecao4 } from './institucional-dinamico-secao4';
import { InstitucionalDinamicoSecao3 } from './institucional-dinamico-secao3';
import { InstitucionalDinamicoImagem } from './institucional-dinamico-imagem';


export class InstitucionalDinamico {

  id: number;
  link_pagina: string;
  caminhoMigalhas: string;
  titulo: string;
  txtTitulo: string;
  txtSubtitulo: string;
  txtBotaoSubtitulo: string;
  linkBotaoSubtitulo: string;
  nomeAutor: string;
  imagemPrincipal;
  imagemPrincipalSafeUrl: SafeUrl;
  idImagemPrincipal;
  listaSecao1: InstitucionalDinamicoSecao1[] = [];
  listaSecao2: InstitucionalDinamicoSecao2[] = [];
  listaSecao3: InstitucionalDinamicoSecao3[] = [];
  listaSecao4: InstitucionalDinamicoSecao4[] = [];
  imagens: InstitucionalDinamicoImagem[] = [];
  exibir: boolean;
  corFundoSubtitulo: string;
  
}
