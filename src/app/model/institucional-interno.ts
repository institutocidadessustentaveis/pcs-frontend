import { TemplateInstitucional01 } from './template-institucional-01';
import { ArquivoInstitucional } from './arquivo-institucional';
import { TemplateInstitucional02 } from './template-institucional-02';
import { SafeUrl } from '@angular/platform-browser';
import { TemplateInstitucional03 } from './template-institucional-03';
import { TemplateInstitucional04 } from './template-institucional-04';


export class InstitucionalInterno {

  id: number;
  link_pagina: string;
  caminhoMigalhas: string;
  titulo: string;
  subtitulo: string;
  txtBotaoSubtitulo: string;
  linkBotaoSubtitulo: string;
  tipoTemplate: string;
  imagemPrincipal: string;
  imagemPrincipalSafeUrl: SafeUrl;
  nomeAutor: string;

  template01: TemplateInstitucional01 = new TemplateInstitucional01();
  template02: TemplateInstitucional02 = new TemplateInstitucional02();
  template03: TemplateInstitucional03 = new TemplateInstitucional03();
  template04: TemplateInstitucional04 = new TemplateInstitucional04();

  possuiFiltro: boolean;
}
