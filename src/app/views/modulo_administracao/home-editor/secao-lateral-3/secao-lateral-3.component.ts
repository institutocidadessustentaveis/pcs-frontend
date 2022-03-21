import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';
import { SecaoLateral } from 'src/app/model/secao-lateral';

@Component({
  selector: 'app-secao-lateral-3',
  templateUrl: './secao-lateral-3.component.html',
  styleUrls: ['./secao-lateral-3.component.css',
  './secao-lateral-3-home.component.css',
  './secao-lateral-3.component.scss']
})

export class SecaoLateral3Component implements OnInit {


  paginaChild: SecaoLateral;

  public segundoTituloPrincipalCorTema: any;


  @Input()
  set secaoLateral(secaoLateral: SecaoLateral ){
      this.paginaChild = secaoLateral;
      this.carregarSafeUrls(this.paginaChild);
      this.initAlpha(secaoLateral);
  }
  get secaoLateral(){
      return this.paginaChild;
  }

  get segundoTituloPrincipalCorTemaAux() {
    return this.initAlpha(this.paginaChild);
  }

  constructor(private domSanitizer: DomSanitizer) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {
  }

  initAlpha(secaoLateral: SecaoLateral): any {
    if (secaoLateral && secaoLateral.segundoTituloPrincipalCor) {
      this.segundoTituloPrincipalCorTema = this.addAlpha(secaoLateral.segundoTituloPrincipalCor, 0.1);
    }
    return this.segundoTituloPrincipalCorTema;
  }

  addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }

  private carregarSafeUrls(secaoLateral: SecaoLateral) {
    if (secaoLateral && secaoLateral.primeiraImagem) {
      secaoLateral.primeiraImagemSafeUrl = this.getSafeUrl(secaoLateral.primeiraImagem);
    }
    if (secaoLateral && secaoLateral.segundaImagem) {
      secaoLateral.segundaImagemSafeUrl = this.getSafeUrl(secaoLateral.segundaImagem);
    }

    if (secaoLateral && secaoLateral.terceiraImagem) {
      secaoLateral.terceiraImagemSafeUrl = this.getSafeUrl(secaoLateral.terceiraImagem);
    }
  }

  // public botaoSecao4IrPara() {
  //   window.open(this.paginaChild.primeiraSecao.linkBotao01, "_blank");
  // }

  public getImagePath(id: number): string {
    if(id == null) {
      return '/';
    }

    return `${environment.API_URL}home/imagem/` + id;
  }

}
