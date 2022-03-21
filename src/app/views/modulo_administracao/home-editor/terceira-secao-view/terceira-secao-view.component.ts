import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';
import { TerceiraSecao } from 'src/app/model/terceira-secao';

@Component({
  selector: 'app-terceira-secao-view',
  templateUrl: './terceira-secao-view.component.html',
  styleUrls: ['./terceira-secao-view.component.css']
})

export class TerceiraSecaoViewComponent implements OnInit {

  paginaChild: TerceiraSecao;

  public corTema: any;

  @Input()
  set terceiraSecao(terceiraSecao: TerceiraSecao ){
      this.paginaChild = terceiraSecao;
      this.carregarSafeUrls(this.paginaChild);
  }
  get terceiraSecao(){
      return this.paginaChild;
  }

  constructor(private domSanitizer: DomSanitizer) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {
    if (this.terceiraSecao && this.terceiraSecao.tituloPrincipalCor) {
      this.corTema = this.addAlpha(this.terceiraSecao.tituloPrincipalCor, 0.1);
    }

  }

  addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

  private carregarSafeUrls(terceiraSecao: TerceiraSecao) {
    if (terceiraSecao && terceiraSecao.primeiraImagem) {
      terceiraSecao.primeiraImagemSafeUrl = this.getSafeUrl(terceiraSecao.primeiraImagem);
    }
    if (terceiraSecao && terceiraSecao.segundaImagem) {
      terceiraSecao.segundaImagemSafeUrl = this.getSafeUrl(terceiraSecao.segundaImagem);
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
