import { QuartaSecao } from 'src/app/model/quarta-secao';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';

@Component({
  selector: 'app-quarta-secao-view',
  templateUrl: './quarta-secao-view.component.html',
  styleUrls: ['./quarta-secao-view.component.css']
})

export class QuartaSecaoViewComponent implements OnInit {

  paginaChild: QuartaSecao;

  public corTema: any;

  @Input()
  set quartaSecao(quartaSecao: QuartaSecao ){
      this.paginaChild = quartaSecao;
      this.carregarSafeUrls(this.paginaChild);
  }
  get quartaSecao(){
      return this.paginaChild;
  }

  constructor(private domSanitizer: DomSanitizer) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {
    if (this.quartaSecao && this.quartaSecao.tituloPrincipalCor) {
      this.corTema = this.addAlpha(this.quartaSecao.tituloPrincipalCor, 0.1);
    }

  }

  addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

  private carregarSafeUrls(quartaSecao: QuartaSecao) {
    if (quartaSecao && quartaSecao.primeiraImagem) {
      quartaSecao.primeiraImagemSafeUrl = this.getSafeUrl(quartaSecao.primeiraImagem);
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

  public btnIrPara(url: string){
    window.open(url, "_blank");
  }

}
