import { SegundaSecao } from '../../../../model/segunda-secao';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';
import { SetimaSecao } from 'src/app/model/setima-secao';

@Component({
  selector: 'app-setima-secao-view',
  templateUrl: './setima-secao-view.component.html',
  styleUrls: ['./setima-secao-view.component.css']
})

export class SetimaSecaoViewComponent implements OnInit {

  paginaChild: SetimaSecao;

  public corTema: any;

  @Input()
  set setimaSecao(setimaSecao: SetimaSecao ){
      this.paginaChild = setimaSecao;
      this.carregarSafeUrls(this.paginaChild);
      this.initAlpha(setimaSecao);
  }
  get setimaSecao() {
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

  initAlpha(setimaSecao: SetimaSecao): any {
    if (setimaSecao && setimaSecao.tituloPrincipalCor) {
      this.corTema = this.addAlpha(setimaSecao.tituloPrincipalCor, 0.1);
    }
    return this.corTema;
  }

  addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }

  private carregarSafeUrls(setimaSecao: SetimaSecao) {
    if (setimaSecao && setimaSecao.primeiraImagem) {
      setimaSecao.primeiraImagemSafeUrl = this.getSafeUrl(setimaSecao.primeiraImagem);
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
