import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CidadeService } from 'src/app/services/cidade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { environment } from 'src/environments/environment';
import { BoasPraticasFiltradas } from 'src/app/model/boasPraticasFiltradas';
import { BoaPraticaItem } from 'src/app/model/boaPraticaItem';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';

@Component({
  selector: 'app-boas-praticas-da-cidade',
  templateUrl: './boas-praticas-da-cidade.component.html',
  styleUrls: ['./boas-praticas-da-cidade.component.css']
})
export class BoasPraticasDaCidadeComponent implements OnInit {

  @HostListener('window:scroll', ['$event'])
  private page = 0;
  private countTotalBoasPraticas = 0;

  public loading = true;

  public listBoasPraticas: BoaPraticaItem[] = new Array();

  public length = 10;
  public pageSize = 3;
  public throttle = 100;
  public scrollDistance = 4;
  public scrollUpDistance = 4;

  scrollUp: any;

  public cidade;
  private idCidade;

  public boaPraticaDestaque = null;

  constructor(private cidadesService: CidadeService, private router: Router, private element: ElementRef, public pcsUtil: PcsUtil,
              public activatedRoute: ActivatedRoute, private boaPraticaService: BoaPraticaService) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async params => {
      this.idCidade = params.id;
      if (this.idCidade) {
        this.cidadesService.buscarCidadeComboPorId(this.idCidade).subscribe(response => {
          this.cidade = response;
        });
      }

      this.loading = false;
    }, error => { this.router.navigate(['/boas-praticas']); });
    this.buscarBoasPraticasDaCidade(0, 3);
  }

  private buscarBoasPraticasDaCidade(page: number, linesPerPage: number) {

    this.loading = true;

    this.boaPraticaService.buscarBoasPraticasDaCidade(page, linesPerPage, this.idCidade).subscribe(response => {
      const boasPraticasFiltradas = response as BoasPraticasFiltradas;

      let listBoasPraticasAux: BoaPraticaItem[] = new Array();
      listBoasPraticasAux = boasPraticasFiltradas.listBoasPraticas;

      if (!this.boaPraticaDestaque) {
        this.boaPraticaDestaque = listBoasPraticasAux[0];
        this.boaPraticaDestaque.urlImagem = this.getImageUrl(this.boaPraticaDestaque.idBoaPratica);
      }
      this.listBoasPraticas.push(...listBoasPraticasAux);
      this.listBoasPraticas.forEach(item => {
        item.urlImagem = this.getImageUrl(item.idBoaPratica);
      });

      if (response) {
        this.countTotalBoasPraticas = boasPraticasFiltradas.countTotalBoasPraticas;
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

    if (this.countTotalBoasPraticas - this.page * this.pageSize > 0) {
      this.buscarBoasPraticasDaCidade(this.page, this.pageSize);
    }
  }

  public irDetalheBoaPratica(boaPratica: any) {
    if (boaPratica.url) {
      this.router.navigate(['/boas-praticas/', boaPratica.url]);
    } else {
      this.router.navigate(['/boas-praticas/', boaPratica.idBoaPratica]);
    }
  }

  public gerarLinkBoaPratica(boaPratica: any) {
    if (boaPratica.url) {
      return '/boas-praticas/' + boaPratica.url;
    } else {
      return '/boas-praticas/' + boaPratica.idBoaPratica;
    }
  }

  private getImageUrl(id: number) {
    return new Promise((resolve, reject) => {
      const url = `${environment.API_URL}boapratica/imagem/` + id;
      resolve(url);
    });
  }

}
