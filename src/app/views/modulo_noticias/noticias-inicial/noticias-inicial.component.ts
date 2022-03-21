import { PcsUtil } from './../../../services/pcs-util.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef, HostListener, ElementRef } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ProvinciaEstadoShapeService } from 'src/app/services/provincia-estado-shape.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CidadeService } from 'src/app/services/cidade.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { NoticiaService } from 'src/app/services/noticia.service';
import { CombosFiltrarNoticias } from 'src/app/model/combosFiltrarNoticias';
import { FiltroNoticiasInicial } from 'src/app/model/filtroNoticiasInicial';
import { NoticiasFiltradas } from 'src/app/model/noticiasFiltradas';
import { NoticiaItem } from 'src/app/model/noticiaItem';
import { environment } from 'src/environments/environment';
import { of, Observable } from 'rxjs';

@Component({
  selector: "app-noticias-inicial",
  templateUrl: "./noticias-inicial.component.html",
  styleUrls: ["./noticias-inicial.component.css", "../../../../animate.css"]
})
export class NoticiasInicialComponent implements OnInit {
  @HostListener("window:scroll", ["$event"])
  private page = 1;
  private countTotalNoticias = 0;
  private combosFiltrarNoticias: CombosFiltrarNoticias;

  public loading = true;

  public listNoticias: NoticiaItem[] = new Array();
  public listNoticiasCarousel: NoticiaItem[];
  public filtroNoticiasInicial: FiltroNoticiasInicial = new FiltroNoticiasInicial();

  public length = 10;
  public pageSize = 3;
  public throttle = 100;
  public scrollDistance = 2;
  public scrollUpDistance = 4;

  public listaEixos: ItemCombo[];
  public listaOds: ItemCombo[];
  public listaAreaInteresses: ItemCombo[];
  scrollUp: any;

  idOdsSelecionado: number = null;

  constructor(
    public shapeService: ProvinciaEstadoShapeService,
    public cidadesService: CidadeService,
    private noticiaService: NoticiaService,
    private router: Router,
    private element: ElementRef,
    private domSanitizer: DomSanitizer,
    private cd: ChangeDetectorRef,
    public pcsUtil: PcsUtil,
    public activatedRoute: ActivatedRoute,
    public titleService: Title
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.carregarCombosFiltrarNoticias();
    this.buscarNoticiasCarousel(0, this.pageSize);
    this.titleService.setTitle('Notícias - Cidades Sustentáveis')
  }

  private async carregarCombosFiltrarNoticias() {
    this.loading = true;
    await this.noticiaService.buscarCombosFiltrarNoticias().subscribe(
      response => {
        this.combosFiltrarNoticias = response as CombosFiltrarNoticias;
        this.listaEixos = this.combosFiltrarNoticias.listaEixos;
        this.listaOds = this.combosFiltrarNoticias.listaOds;
        this.listaAreaInteresses = this.combosFiltrarNoticias.listaAreaInteresses;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  public odsSelecionado(id: number) {
    this.idOdsSelecionado = id;
  }

  private buscarNoticiasCarousel(page: number, linesPerPage: number) {
    this.filtroNoticiasInicial.page = page;
    this.filtroNoticiasInicial.linesPerPage = linesPerPage;

    this.loading = true;

    this.noticiaService
      .buscarNoticiasFiltradas(this.filtroNoticiasInicial)
      .subscribe(
        response => {
          const noticiasFiltradas = response as NoticiasFiltradas;

          let listNoticiasAux: NoticiaItem[] = new Array();
          listNoticiasAux = noticiasFiltradas.listaNoticias;

          if (this.listNoticiasCarousel == null) {
            this.listNoticiasCarousel = Object.assign(
              [],
              listNoticiasAux
            ).slice(0, 3);

            this.listNoticiasCarousel.forEach(item => {
              item.urlImagem = this.getImageUrl(item.idNoticia);
            });
          }
          this.buscarNoticias(1, this.pageSize);
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
  }

  private buscarNoticias(page: number, linesPerPage: number) {
    this.filtroNoticiasInicial.page = page;
    this.filtroNoticiasInicial.linesPerPage = linesPerPage;

    this.loading = true;

    this.noticiaService
      .buscarNoticiasFiltradas(this.filtroNoticiasInicial)
      .subscribe(
        response => {
          const noticiasFiltradas = response as NoticiasFiltradas;

          let listNoticiasAux: NoticiaItem[] = new Array();
          listNoticiasAux = noticiasFiltradas.listaNoticias;

          this.listNoticias.push(...listNoticiasAux);
          this.listNoticias.forEach(item => {
            item.urlImagem = this.getImageUrl(item.idNoticia);
          });

          if (response) {
            this.countTotalNoticias = noticiasFiltradas.countTotalNoticias;
          }
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
  }

  public onScrollDown(event: any) {
    this.page++;

    if (this.countTotalNoticias - this.page * this.pageSize > 0) {
      this.buscarNoticias(this.page, this.pageSize);
    }
  }

  msgAjuda() {
    PcsUtil.swal()
      .fire({
        // tslint:disable-next-line: max-line-length
        html:
          "A busca por notícias pode ser feita usando uma ou mais opções de filtros.<br />Observe que, ao utilizar duas ou mais opções, as notícias resultantes serão apenas aquelas que correspondem a todas elas.<br />Caso use apenas uma opção o resultado estará relacionado apenas a ela.",
        type: "question",
        showCancelButton: false,
        confirmButtonText: "Ok"
      })
      .then(result => {}, error => {});
  }

  public pesquisarNoticias() {
    this.page = 0;
    this.listNoticias = [] as NoticiaItem[];
    this.buscarNoticias(0, this.pageSize);
  }

  public clear() {
    this.filtroNoticiasInicial = new FiltroNoticiasInicial();
    this.page = 0;
    this.listNoticias = [] as NoticiaItem[];
    this.buscarNoticias(0, this.pageSize);
  }

  public irDetalheNoticia(noticia: any) {
    if (noticia.url) {
      this.router.navigate(["/noticia/", noticia.url]);
    } else {
      this.router.navigate(["/noticia/", noticia.idNoticia]);
    }
  }

  public gerarLinkNoticia(noticia: any) {
    if (noticia.url) {
      return "/noticia/" + noticia.url;
    } else {
      return "/noticia/" + noticia.idNoticia;
    }
  }

  private getImagePath(id: number): Observable<string> {
    const url: string = `${environment.API_URL}noticia/imagem/` + id;
    return of(url);
  }

  private getImageUrl(id: number) {
    return new Promise((resolve, reject) => {
      const url = `${environment.API_URL}noticia/imagem/` + id;
      resolve(url);
    });
  }
}
