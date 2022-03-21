import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DadosDownload } from 'src/app/model/dados-download';
import { Home } from 'src/app/model/home';
import { PrimeiraSecao } from 'src/app/model/primeira-secao';
import { QuartaSecao } from 'src/app/model/quarta-secao';
import { QuintaSecao } from 'src/app/model/quinta-secao';
import { SecaoLateral } from 'src/app/model/secao-lateral';
import { SegundaSecao } from 'src/app/model/segunda-secao';
import { SetimaSecao } from 'src/app/model/setima-secao';
import { SextaSecao } from 'src/app/model/sexta-secao';
import { TerceiraSecao } from 'src/app/model/terceira-secao';
import { HomeService } from 'src/app/services/home.service';
import { SeoService } from 'src/app/services/seo-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-indicadores-inicial-secoes',
  templateUrl: './indicadores-inicial-secoes.component.html',
  styleUrls: ['./indicadores-inicial-secoes.component.css', './home.component.scss']
})
export class IndicadoresInicialSecoesComponent implements OnInit {
 

  // HOME
  public home: Home = new Home();
  public  paginaBreadCrumb: any;
  public isStatic: boolean = false;
  public loading: boolean;

  public todasSecoes: any[] = [];

  public secoes: any[] = [];

  dadosDownload = new DadosDownload;

  @Input() dadosDownloadUser: DadosDownload;

  constructor(
    private homeService: HomeService,
    private route: ActivatedRoute,
    private router: Router,
    private seoService: SeoService,
  ) {

  }

  ngOnInit() {
    this.buscarPaginaHome();
  }
  private async buscarPaginaHome() {
    await this.route.params.subscribe(
      async params => {
        const link = 'indicadores';
        this.paginaBreadCrumb = link;
        if (this.paginaBreadCrumb != null && this.paginaBreadCrumb != '') {
          this.isStatic = true;
        } else {
          this.isStatic = false;
        }
        if (link) {
          this.loading = true;
          await this.homeService
            .buscarIdsPaginaHomePorLink(link)
            .subscribe(
              async response => {
                this.home = response as Home;

                this.todasSecoes = [];

                this.buscarPrimeiraSecaoPorId(this.home.id);

                this.buscarSegundaSecaoPorId(this.home.id);

                this.buscarTerceiraSecaoPorId(this.home.id);

                this.buscarQuartaSecaoPorId(this.home.id);

                this.buscarQuintaSecaoPorId(this.home.id);

                this.buscarSextaSecaoPorId(this.home.id);

                this.buscarSetimaSecaoPorId(this.home.id);

                this.buscarSecaoLateralPorId(this.home.id);

                this.loading = false;
              },
              error => {
                this.router.navigate(["/"]);
              }
            );
        }
        this.loading = false;
      },
      error => {
        this.router.navigate(["/"]);
      }
    );
  }

  private async buscarPrimeiraSecaoPorId(id: number) {
    await this.homeService.buscarPrimeiraSecaoPorId(id).subscribe(response => {
      this.home.listaPrimeiraSecao = response as PrimeiraSecao[];
      if (this.home.listaPrimeiraSecao) {
        this.todasSecoes = [...this.todasSecoes, ...this.home.listaPrimeiraSecao];
        this.ordernarPorIndiceTodasSecoes();
      }
    });
}

private async buscarSegundaSecaoPorId(id: number) {
    await this.homeService.buscarSegundaSecaoPorId(id).subscribe(response => {
      this.home.listaSegundaSecao = response as SegundaSecao[];
      if (this.home.listaSegundaSecao) {
        this.todasSecoes = [...this.todasSecoes, ...this.home.listaSegundaSecao];
        this.ordernarPorIndiceTodasSecoes();
      }
    });
}

private async buscarTerceiraSecaoPorId(id: number) {
    await this.homeService.buscarTerceiraSecaoPorId(id).subscribe(response => {
      this.home.listaTerceiraSecao = response as TerceiraSecao[];
      if (this.home.listaTerceiraSecao) {
        this.todasSecoes = [...this.todasSecoes, ...this.home.listaTerceiraSecao];
        this.ordernarPorIndiceTodasSecoes();
      }
    });
}

private async buscarQuartaSecaoPorId(id: number) {
    await this.homeService.buscarQuartaSecaoPorId(id).subscribe(response => {
      this.home.listaQuartaSecao = response as QuartaSecao[];
      if (this.home.listaQuartaSecao) {
        this.todasSecoes = [...this.todasSecoes, ...this.home.listaQuartaSecao];
        this.ordernarPorIndiceTodasSecoes();
      }
    });
}

private async buscarQuintaSecaoPorId(id: number) {
    await this.homeService.buscarQuintaSecaoPorId(id).subscribe(response => {
      this.home.listaQuintaSecao = response as QuintaSecao[];
      if (this.home.listaQuintaSecao) {
        this.todasSecoes = [...this.todasSecoes, ...this.home.listaQuintaSecao];
        this.ordernarPorIndiceTodasSecoes();
      }
    });
}

private async buscarSextaSecaoPorId(id: number) {
  await this.homeService.buscarSextaSecaoPorId(id).subscribe(response => {
    this.home.listaSextaSecao = response as SextaSecao[];
    if (this.home.listaSextaSecao) {
      this.todasSecoes = [...this.todasSecoes, ...this.home.listaSextaSecao];
      this.ordernarPorIndiceTodasSecoes();
    }
  });
}

private async buscarSetimaSecaoPorId(id: number) {
await this.homeService.buscarSetimaSecaoPorId(id).subscribe(response => {
  this.home.listaSetimaSecao = response as SetimaSecao[];
  if (this.home.listaSetimaSecao) {
    this.todasSecoes = [...this.todasSecoes, ...this.home.listaSetimaSecao];
    this.ordernarPorIndiceTodasSecoes();
  }
});
}

private async buscarSecaoLateralPorId(id: number) {
    await this.homeService.buscarSecaoLateralPorId(id).subscribe(response => {
      this.home.listaSecaoLateral = response as SecaoLateral[];
    });
}


public verificaLinkAtivo(itemLink: string): string {
  let cor: string = "";
  this.route.params.subscribe(
    async params => {
      if (itemLink === params.pagina) {
        cor = "bold";
      }
    },
    error => {}
  );
  return cor;
}



public getImagePath(id: number): string {
  if (id == null) {
    return "/";
  }

  return `${environment.API_URL}home/imagem/` + id;
}

private ordernarPorIndiceTodasSecoes() {
  this.todasSecoes.sort((n1, n2) => {
    if (n1.indice > n2.indice) {
        return 1;
    }
    if (n1.indice < n2.indice) {
        return -1;
    }
    return 0;
  });
}

}