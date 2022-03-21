import { forEach } from '@angular/router/src/utils/collection';
import { throwError } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { BibliotecaService } from 'src/app/services/bibliotecaService';
import { Biblioteca } from 'src/app/model/biblioteca';
import { environment } from 'src/environments/environment';
import { $ } from 'protractor';

@Component({
  selector: 'app-card-biblioteca',
  templateUrl: './card-biblioteca.component.html',
  styleUrls: ['./card-biblioteca.component.css']
})
export class CardBibliotecaComponent implements OnInit {
  @Input() idBiblioteca;
  public biblioteca: Biblioteca;
  public urlbackend;
  public linkImagem;
  public icone;
  public mostrarLinkLerMais: boolean = false;
  constructor(
    private bibliotecaService: BibliotecaService,
  ) {
    this.biblioteca = null;
    this.urlbackend = environment.API_URL;
   }

  ngOnInit() {
    this.buscarBiblioteca();
  }

  public truncateHTML(text: string): string {
    let textoModificado = this.limitarTamanhoPalavra(text, 70)
    let charlimit = 1195;
    if(!textoModificado || textoModificado.length <= charlimit )
    {
        return textoModificado;
    }
    this.ativarLinkLerMais()
  let without_html = textoModificado.replace(/<(?:.|\n)*?>/gm, '');
  let shortened = without_html.substring(0, charlimit) + '...';
  return shortened;
}

public limitarTamanhoPalavra(value: any, limit: number, trail: String = '…'): string {
  let result = value || '';
  if (value) {
    const words = value.split(/\s+/);
    words.forEach(palavra => {

      if (palavra.length > Math.abs(limit)) {
          let palavraSemHtml = palavra.replace(/<(?:.|\n)*?>/gm, '');
          result = result.replaceAll(palavraSemHtml, palavraSemHtml.slice(0, limit) + trail);
      }
    })

  }
  return result;
}

public ativarLinkLerMais() {
  this.mostrarLinkLerMais = true
}

  public buscarBiblioteca() {
    this.bibliotecaService.buscarBibliotecaSimples(this.idBiblioteca)
    .subscribe(res => {
      this.biblioteca = res;

      this.gerarLinkImagem();


      switch (this.biblioteca.tipoMaterial) {
        case 'PDF':
        case 'DOCX':
        case 'ODT':
        case 'TXT':
        case 'PPT':
        case 'CSV':
        case 'XLSX':
        case 'SHP':
        case 'TIFF':
        case 'JPG':
        case 'GIF':
          this.icone = 'text_snippet';
          break;
        case 'MP3':
          this.icone = 'headset';
          break;
        case 'MP4':
        case 'MKV':
        case 'AVCHD':
        case 'MOV/QT':
        case 'FLV/SWF':
        case 'AVI/WMV':
          this.icone = 'videocam';
          break;
        default:
          this.icone = 'text_snippet';
          break;
     }


    });
  }

  public gerarLinkImagem() {
    if (this.biblioteca.possuiImagem) {
      this.linkImagem = +this.urlbackend + 'biblioteca/imagem/' + this.biblioteca.imagemCapa.id + '';
    } else {
      this.linkImagem = `src/assets/pcs.png`;
    }
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}img-deafult-publicacao.png`
  }
}
