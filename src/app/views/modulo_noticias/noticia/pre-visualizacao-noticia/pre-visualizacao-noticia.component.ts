import { Noticia } from './../../../../model/noticia';
import { Component, OnInit, HostListener, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { PcsUtil } from 'src/app/services/pcs-util.service';

var moment = require('moment');

@Component({
  selector: 'app-pre-visualizacao-noticia',
  templateUrl: './pre-visualizacao-noticia.component.html',
  styleUrls: ['./pre-visualizacao-noticia.component.css']
})
export class PreVisualizacaoNoticiaComponent implements OnInit {

  @Input() noticia: Noticia;

  @HostListener("window:scroll", ["$event"])
  public safeUrlBanner;
  public listNoticias: Noticia[];
  loading = true;
  public id: number;
  public qtdNoticias: number;
  public qtdTotalNoticias: number;
  buscarNoticiaPorId = false;
  urlNoticia: string;
  scrollUp: any;

  constructor(
    public domSanitizationService: DomSanitizer,
    public pcsUtil: PcsUtil,
    private element: ElementRef,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      this.element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
  }

  public getDataNoticia() {
    if(this.noticia.dataHoraPublicacao != undefined) {
      return moment(this.noticia.dataHoraPublicacao);
    } else {
      return moment(this.noticia.dataHoraCriacao);
    }
  }

  public gerarDataNoticiaFormatada() {
    return this.getDataNoticia().format("DD/MM/YYYY HH:mm");
  }

  public gerarStringDescricaoDataPublicacao() {
    let data = this.getDataNoticia();

    moment.updateLocale('en', {
      relativeTime : {
          future: "em %s",
          past: "%s",
          s  : 'há alguns segundos',
          ss : 'há %d segundos',
          m:  "há um minuto",
          mm: "há %d minutos",
          h:  "há uma hora",
          hh: "há %d horas",
          d:  "há um dia",
          dd: "há %d dias",
          M:  "há um mês",
          MM: "há %d meses",
          y:  "há um ano",
          yy: "há %d anos"
      }
    });

    return data.local().fromNow();
  }

  geraImagem() {
    if (this.noticia.imagemPrincipal != null && this.noticia.imagemPrincipal !== undefined) {
      this.safeUrlBanner = this.domSanitizer.bypassSecurityTrustUrl(
        'data:image/png;base64, ' + this.noticia.imagemPrincipal
      );
    }
  }

}
