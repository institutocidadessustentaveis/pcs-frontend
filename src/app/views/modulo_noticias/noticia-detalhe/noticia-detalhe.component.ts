import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { DomSanitizer, Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Noticia } from 'src/app/model/noticia';
import { NoticiaService } from 'src/app/services/noticia.service';
import { environment } from 'src/environments/environment';
import { TitleTagService } from 'src/app/services/titleTag.service';
import { SeoService } from 'src/app/services/seo-service.service';
import { HistoricoCompartilhamentoService } from 'src/app/services/historico-compartilhamento.service';

let moment = require('moment');

@Component({
  selector: 'app-noticias',
  templateUrl: './noticia-detalhe.component.html',
  styleUrls: ['./noticia-detalhe.component.css', '../../../../animate.css']
})
export class NoticiaDetalheComponent implements OnInit {

  @HostListener('window:scroll', ['$event'])
  public noticia: Noticia = new Noticia();

  public listNoticias: Noticia[];

  loading = true;

  public id: number;

  public qtdNoticias: number;

  public qtdTotalNoticias: number;

  buscarNoticiaPorId = false;

  urlNoticia: string;

  scrollUp: any;

  public urlatual: string;

  constructor(
    private router: Router,
    public pcsUtil: PcsUtil,
    private metaService: Meta,
    private element: ElementRef,
    private titleService: Title,
    private seoService: SeoService,
    private activatedRoute: ActivatedRoute,
    private noticiaService: NoticiaService,
    private titleTagService: TitleTagService,
    public domSanitizationService: DomSanitizer,
    private historicoCompartilhamentoService: HistoricoCompartilhamentoService,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

  }



  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.buscarNoticiaPorId = /^\d+$/.test(params.id);

      if (this.buscarNoticiaPorId) {
        this.id = params.id;
      } else {
        this.urlNoticia = params.id;
      }
    });

    if (this.id || this.urlNoticia) {
      this.loading = true;
      this.carregar();

    }
    this.urlatual = window.location.href;
  }

  public salvarLogCompartilhamento (redeSocial: string) {
    this.historicoCompartilhamentoService.gerarHistoricoCompartilhamento(redeSocial, 'Noticia').subscribe(res => {})
  }

  public carregarMaisNoticias() {
    this.loading = true;
    this.qtdNoticias += 3;
    this.noticiaService
      .buscarUltimasNoticias(this.qtdNoticias)
      .subscribe(response => {
        this.listNoticias = (response as unknown) as Noticia[];
      });
    this.loading = false;
  }

  public getImagePath(id: number): string {
    if (id == null) {
      return '/';
    }

    return `${environment.API_URL}noticia/imagem/` + id;
  }

  private carregar() {
    this.qtdNoticias = 3;

    if (this.buscarNoticiaPorId) {
      this.noticiaService.buscarIdNoticiaPublicada(this.id).subscribe(response => {
        this.noticia = response as Noticia;
        const config = {
          title: this.noticia.titulo,
          description: this.noticia.subtitulo,
          twitterImage: `${environment.APP_URL}noticia/imagem/` + this.noticia.id,
          image:  `${environment.APP_URL}noticia/imagem/` + this.noticia.id,
          slug: '',
          site: 'Cidades Sustentáveis' ,
          url: `${environment.APP_URL}noticia/` + (this.buscarNoticiaPorId ? this.id : this.urlNoticia )
        };
        this.seoService.generateTags(config);
      });

    } else {
      this.noticiaService.buscarPorUrlPublicada(this.urlNoticia).subscribe(response => {
        this.noticia = response as Noticia;
        this.titleService.setTitle(this.noticia.titulo);
        //this.criarMetaNoHead();
        const config = {
          title: this.noticia.titulo,
          description: this.noticia.subtitulo,
          twitterImage: `${environment.APP_URL}noticia/imagem/` + this.noticia.id,
          image:  `${environment.APP_URL}noticia/imagem/` + this.noticia.id,
          slug: '',
          site: 'Cidades Sustentáveis' ,
          url: `${environment.APP_URL}noticia/` + (this.buscarNoticiaPorId ? this.id : this.urlNoticia )
        };
        this.seoService.generateTags(config);
      });
    }

    this.noticiaService.countNoticias().subscribe(response => {
          this.qtdTotalNoticias = response as number;
        });

    this.noticiaService
          .buscarUltimasNoticias(this.qtdNoticias)
          .subscribe(response => {
            this.listNoticias = (response as unknown) as Noticia[];
          });

    this.loading = false;
  }

  public criarMetaNoHead(){
    this.titleTagService.setTitle(this.noticia.titulo);
    this.titleTagService.setSocialMediaTags(
      window.location.href,
      this.noticia.titulo,
      this.noticia.subtitulo,
      `${environment.API_URL}noticia/imagem/` + this.id);
  }

  public gerarLinkNoticia(noticia: any) {
    if (noticia.url) {
      return '/noticia/' + noticia.url;
    } else {
      return '/noticia/' + noticia.id;
    }
  }

  public getDataNoticia() {
    if (this.noticia.dataHoraPublicacao != undefined) {
      return moment(this.noticia.dataHoraPublicacao);
    } else {
      return moment(this.noticia.dataHoraCriacao);
    }
  }

  public gerarDataNoticiaFormatada() {
    return this.getDataNoticia().format('DD/MM/YYYY HH:mm');
  }

  public gerarStringDescricaoDataPublicacao() {
    const data = this.getDataNoticia();

    moment.updateLocale('en', {
      relativeTime : {
          future: 'em %s',
          past: '%s',
          s  : 'há alguns segundos',
          ss : 'há %d segundos',
          m:  'há um minuto',
          mm: 'há %d minutos',
          h:  'há uma hora',
          hh: 'há %d horas',
          d:  'há um dia',
          dd: 'há %d dias',
          M:  'há um mês',
          MM: 'há %d meses',
          y:  'há um ano',
          yy: 'há %d anos'
      }
    });

    return data.local().fromNow();
  }

}




