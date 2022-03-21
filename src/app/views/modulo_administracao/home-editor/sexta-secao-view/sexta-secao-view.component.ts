import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';
import { SextaSecao } from 'src/app/model/sexta-secao';

@Component({
  selector: 'app-sexta-secao-view',
  templateUrl: './sexta-secao-view.component.html',
  styleUrls: ['./sexta-secao-view.component.css']
})

export class SextaSecaoViewComponent implements OnInit {

  paginaChild: SextaSecao;

  public corTema: any;

  @Input()
  set sextaSecao(sextaSecao: SextaSecao ){
      this.paginaChild = sextaSecao;
      this.carregarSafeUrls(this.paginaChild);
  }
  get sextaSecao() {
      return this.paginaChild;
  }

  constructor(private domSanitizer: DomSanitizer) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {
    if (this.sextaSecao && this.sextaSecao.tituloPrincipalCor) {
      this.corTema = this.addAlpha(this.sextaSecao.tituloPrincipalCor, 0.1);
    }

  }

  addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

  private carregarSafeUrls(sextaSecao: SextaSecao) {
    if (sextaSecao && sextaSecao.primeiraImagem) {
      sextaSecao.primeiraImagemSafeUrl = this.getSafeUrl(sextaSecao.primeiraImagem);
    }
    if (sextaSecao && sextaSecao.segundaImagem) {
      sextaSecao.segundaImagemSafeUrl = this.getSafeUrl(sextaSecao.segundaImagem);
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
