import { SegundaSecao } from './../../../../model/segunda-secao';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';

@Component({
  selector: 'app-segunda-secao-view',
  templateUrl: './segunda-secao-view.component.html',
  styleUrls: ['./segunda-secao-view.component.css']
})

export class SegundaSecaoViewComponent implements OnInit {

  paginaChild: SegundaSecao;

  public corTema: any;

  @Input()
  set segundaSecao(segundaSecao: SegundaSecao ){
      this.paginaChild = segundaSecao;
      this.carregarSafeUrls(this.paginaChild);
      this.initAlpha(segundaSecao);
  }
  get segundaSecao(){
      return this.paginaChild;
  }

  get corTemaAux() {
    return this.initAlpha(this.paginaChild);
  }

  constructor(private domSanitizer: DomSanitizer) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {

  }

  initAlpha(segundaSecao: SegundaSecao): any {
    if (this.segundaSecao && this.segundaSecao.tituloPrincipalCor) {
      this.corTema = this.addAlpha(this.segundaSecao.tituloPrincipalCor, 0.1);
    }
    return this.corTema;
  }

  addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }

  private carregarSafeUrls(segundaSecao: SegundaSecao) {
    if (segundaSecao && segundaSecao.primeiraImagem) {
      segundaSecao.primeiraImagemSafeUrl = this.getSafeUrl(segundaSecao.primeiraImagem);
    }
    if (segundaSecao && segundaSecao.segundaImagem) {
      segundaSecao.segundaImagemSafeUrl = this.getSafeUrl(segundaSecao.segundaImagem);
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
