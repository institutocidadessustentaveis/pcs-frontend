import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ProvinciaEstadoShapeService } from 'src/app/services/provincia-estado-shape.service';
import { Router } from '@angular/router';
import { CidadeService } from 'src/app/services/cidade.service';
import { NoticiaService } from 'src/app/services/noticia.service';
import { FiltroNoticiasInicial } from 'src/app/model/filtroNoticiasInicial';
import { NoticiaItem } from 'src/app/model/noticiaItem';
import { environment } from 'src/environments/environment';
import { PaginaInicialBannerItem } from 'src/app/model/paginaInicialBannerItem';
import { PaginaInicialService } from 'src/app/services/pagina-inicial.service';
import { FiltroCidadesComBoasPraticas } from 'src/app/model/filtroCidadesComBoasPraticas';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { BoaPraticaItem } from 'src/app/model/boaPraticaItem';
import { BoasPraticasFiltradas } from 'src/app/model/boasPraticasFiltradas';
import { Noticia } from 'src/app/model/noticia';
import { DownloadslogService } from 'src/app/services/downloadslog.service';

const path = 'assets/pdf/Guia_de_Referencias_para_Indicadores_e_Metas_PCS_CEBRAP_2019.pdf';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: [
    './pagina-inicial.component.css',
    './pagina-inicial.component.scss',
    '../../../animate.css'
  ]
})
export class PaginaInicialComponent implements OnInit {
  public loading = true;

  public ultimaNoticia: NoticiaItem = new NoticiaItem();
  public listaUltimasNoticiasLinks: NoticiaItem[] = new Array();
  public listaUltimasNoticiasAgenda: Noticia[] = new Array();

  public listBannerItensCarousel: PaginaInicialBannerItem[] = new Array();
  public listBoasPraticas: BoaPraticaItem[];

  public filtroNoticiasInicial: FiltroNoticiasInicial = new FiltroNoticiasInicial();

  public imagePath: any;
  scrollUp: any;

  constructor(
    public shapeService: ProvinciaEstadoShapeService,
    public cidadesService: CidadeService,
    private noticiaService: NoticiaService,
    private router: Router,
    private element: ElementRef,
    private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    private paginaInicialService: PaginaInicialService,
    private boaPraticaService: BoaPraticaService,
    private downloadsLogService: DownloadslogService,
    private titleService: Title,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Cidades Sustentáveis');

    this.buscarBannerPrincipal();
    this.buscarUltimasBoasPraticas(0, 4);
    this.buscarUltimasNoticiasAgenda(2);
    this.buscarUltimasNoticiasPaginaInicial();

    this.imagePath = this.domSanitizer.bypassSecurityTrustResourceUrl(
      'data:image/jpg;base64,' +
        'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiP…JjbGUgY2xhc3M9InN0MCIgY3g9IjMiIGN5PSIzIiByPSIxLjMiLz4NCjwvZz4NCjwvc3ZnPg0K'
    );
  }

  private async buscarUltimasBoasPraticas(page: number, linesPerPage: number) {
    const filtroCidadesComBoasPraticas: FiltroCidadesComBoasPraticas = new FiltroCidadesComBoasPraticas();
    filtroCidadesComBoasPraticas.page = page;
    filtroCidadesComBoasPraticas.linesPerPage = linesPerPage;

    this.loading = true;

    await this.boaPraticaService
      .buscarBoasPraticasFiltradasPaginaInicial(filtroCidadesComBoasPraticas)
      .subscribe(
        response => {
          const boasPraticasFiltradas = response as BoasPraticasFiltradas;
          this.listBoasPraticas = boasPraticasFiltradas.listBoasPraticas;

          this.loading = false;

          this.cd.detectChanges();
        },
        error => {
          this.loading = false;
        }
      );
  }

  private async buscarBannerPrincipal() {
    this.loading = true;
    await this.paginaInicialService.buscarBannerPrincipal().subscribe(
      response => {
        this.listBannerItensCarousel = response as PaginaInicialBannerItem[];
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  private buscarUltimasNoticiasAgenda(qtd: number) {
    this.loading = true;
    this.noticiaService.buscarUltimasNoticiasAgenda(qtd).subscribe(
      response => {
        this.listaUltimasNoticiasAgenda = response as Noticia[];
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  public irDetalheNoticia(paginaInicialBannerItem) {
    if (paginaInicialBannerItem.idNoticia) {
      this.router.navigate([
        '/noticia/',
        paginaInicialBannerItem.idNoticia
      ]);
    }
  }

  public irDetalheNoticiaAgenda(agenda: any) {
    if (agenda.id) {
      this.router.navigate(['/noticia/', agenda.id]);
    }
  }

  public irDetalheBoaPratica(paginaInicialBannerItem: PaginaInicialBannerItem) {
    if (paginaInicialBannerItem.idBoaPratica) {
      this.router.navigate([
        '/boaspraticas/detalhes/',
        paginaInicialBannerItem.idBoaPratica
      ]);
    }
  }

  public irDetalheInstitucional(
    paginaInicialBannerItem: PaginaInicialBannerItem
  ) {
    if (paginaInicialBannerItem.idInstitucional) {
      this.router.navigate([
        '/institucional/pagina/',
        paginaInicialBannerItem.linkInstitucional
      ]);
    }
  }

  public gerarLinkNoticia(noticia: any) {
    if (noticia.url != undefined) {
      return '/noticia/' + noticia.url;
    }

    if (noticia.idNoticia) {
      return '/noticia/' + noticia.idNoticia;
    }
  }

  public gerarLinkBoaPratica(boaPratica: any) {
    if (boaPratica.idBoaPratica) {
      return '/boaspraticas/detalhes/' + boaPratica.idBoaPratica;
    }
  }

  public gerarLinkNoticiaAgenda(agenda: any) {
    if (agenda.id) {
      return '/noticia/' + agenda.id;
    }
  }

  public getImagePathNoticia(id: number): string {
    if (id == null) {
      return '/';
    }
    return `${environment.API_URL}noticia/imagem/` + id;
  }

  public getImagePathBoaPratica(id: number): string {
    if (id == null) {
      return '/';
    }
    return `${environment.API_URL}boapratica/imagem/` + id;
  }

  public getImagePathInstitucional(id: number): string {
    if (id == null) {
      return '/';
    }
    return `${environment.API_URL}institucional/imagem/` + id;
  }

  fileDownloadReferencias() {
    this.downloadsLogService
      .registrarLogDownload(
        'Guia_de_Referencias_para_Indicadores_e_Metas_PCS-CEBRAP_2019.pdf'
      )
      .subscribe(() => {});
  }

  private buscarUltimasNoticiasPaginaInicial() {
    this.loading = true;
    this.noticiaService.buscarUltimasNoticiasPaginaInicial().subscribe(response => {
      const noticiasFiltradas = response as Array<NoticiaItem>;
      if (noticiasFiltradas != null && noticiasFiltradas.length > 0) {

        if (this.ultimaNoticia.idNoticia == null) {
          this.ultimaNoticia = noticiasFiltradas[1];
        }

        this.listaUltimasNoticiasLinks = Object.assign([], noticiasFiltradas).slice(2, 5);
      }
      this.loading = false;
    },
      error => {
        this.loading = false;
      }
    );
  }
}
