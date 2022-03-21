
import { environment } from 'src/environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { NoticiaService } from 'src/app/services/noticia.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-card-evento',
  templateUrl: './card-evento.component.html',
  styleUrls: ['./card-evento.component.css']
})
export class CardEventoComponent implements OnInit {

  @Input() idNoticia;
  noticia = null;
  urlbackend = environment.API_URL;
  constructor(
    private noticiaService: NoticiaService,
    public pcsUtil: PcsUtil) { }


  ngOnInit() {
    this.configurarPublicacao(this.idNoticia);
  }

  public gerarLinkNoticia(noticia: any) {
    if (noticia.url != undefined) {
      return '/noticia/' + noticia.url;
    }

    if (noticia.id) {
      return '/noticia/' + noticia.id +'';
    }
  }

  public configurarPublicacao(id) {
    if (id) {
      if ( id ) {
        this.noticiaService.buscarIdNoticia( id ).subscribe(res => {
          this.noticia = res;
        });
      }
    }
  }
}
