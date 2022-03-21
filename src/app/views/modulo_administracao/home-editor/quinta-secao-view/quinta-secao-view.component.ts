import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';
import { QuintaSecao } from 'src/app/model/quinta-secao';

@Component({
  selector: 'app-quinta-secao-view',
  templateUrl: './quinta-secao-view.component.html',
  styleUrls: ['./quinta-secao-view.component.css']
})

export class QuintaSecaoViewComponent implements OnInit {

  paginaChild: QuintaSecao;

  @Input()
  set quintaSecao(quintaSecao: QuintaSecao ){
      this.paginaChild = quintaSecao;
  }
  get quintaSecao(){
      return this.paginaChild;
  }

  constructor(private domSanitizer: DomSanitizer) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {

  }

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
