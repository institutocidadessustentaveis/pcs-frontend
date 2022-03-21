import { InstitucionalDinamicoSecao3 } from './../../../../model/institucional-dinamico-secao3';
import { HttpHeaders } from '@angular/common/http';
import { MaterialInstitucionalService } from 'src/app/services/material-institucional.service';
import { Component, OnInit, Input, SimpleChanges, AfterViewInit, OnChanges } from '@angular/core';
import { InstitucionalInterno } from 'src/app/model/institucional-interno';
import { ActivatedRoute, Router } from '@angular/router';
import { InstitucionalInternoService } from 'src/app/services/institucional-interno.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Publicacao } from 'src/app/model/publicacao';
import { InstitucionalDinamicoPublicacao } from 'src/app/model/institucional-dinamico-publicacao';

@Component({
  selector: 'app-terceira-secao',
  templateUrl: './terceira-secao.component.html',
  styleUrls: ['./terceira-secao.component.css']
})

export class TerceiraSecaoComponent implements OnInit, OnChanges {

  paginaChild: InstitucionalDinamicoSecao3;
  public destaques: Array<Publicacao>;
  public todasPublicacoes: any = [];
  public qtdPublicacoes1;
  public qtdPublicacoes2;
  public mostrarVerMais1 = true;
  public mostrarVerMais2 = true;

  @Input() dadosDownloadUser;
  @Input() tituloPagina;
  @Input()
  set terceiraSecao(pagina: InstitucionalDinamicoSecao3 ) {
      this.paginaChild = pagina;
      this.configurarTodasPublicacoes();
  }

  get terceiraSecao() {
      return this.paginaChild;
  }

  constructor(
    private domSanitizer: DomSanitizer,
    private materialInstitucionalService: MaterialInstitucionalService) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.paginaChild.id) {
      if ((!this.paginaChild.publicacoes || this.paginaChild.publicacoes.length == 0)){
        this.qtdPublicacoes2 = 99999;
      }
    }
  }


  public getImagePath(publicacao: InstitucionalDinamicoPublicacao): any {
    if (publicacao.idImagem == null && publicacao.imagem == null) {
      return `http://${environment.APP_IMAGEM}/img-deafult-publicacao.jpg`;
    } else if (publicacao.imagem) {
      return this.getSafeUrl(publicacao.imagem);
    } else {
      return `${environment.API_URL}imagens/` + publicacao.idImagem;
    }
  }

  public irParaLink(nomeArquivo: string, link: string, arquivos: number[]) {

    return window.open('https://' + link, '__blank');
  }

  configurarTodasPublicacoes() {
    if (this.paginaChild) {
      if (this.paginaChild.publicacoes) {
        this.paginaChild.publicacoes.forEach(p => {
          this.todasPublicacoes.push(p);
        });
      }
    }
  }

}
