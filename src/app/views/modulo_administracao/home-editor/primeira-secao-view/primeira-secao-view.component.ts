import { PrimeiraSecao } from './../../../../model/primeira-secao';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-primeira-secao-view',
  templateUrl: './primeira-secao-view.component.html',
  styleUrls: ['./primeira-secao-view.component.css']
})

export class PrimeiraSecaoViewComponent implements OnInit {

  paginaChild: PrimeiraSecao;

  @Input()
  set primeiraSecao(primeiraSecao: PrimeiraSecao ){
      this.paginaChild = primeiraSecao;
      this.carregarSafeUrls(this.paginaChild);
  }
  get primeiraSecao(){
      return this.paginaChild;
  }

  constructor(private domSanitizer: DomSanitizer) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {
  }


  private carregarSafeUrls(pagina: PrimeiraSecao) {
    if (pagina && pagina.primeiraImagem) {
      pagina.primeiraImagemSafeUrl = this.getSafeUrl(pagina.primeiraImagem);
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
