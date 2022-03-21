import { EixoService } from './../../../services/eixo.service';
import {Component, OnInit, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/services/seo-service.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-eixos-pcs',
  templateUrl: './eixos-pcs.component.html',
  styleUrls: ['./eixos-pcs.component.css', '../../../../animate.css']
})
export class EixosPcsComponent implements OnInit {

  public listaEixos = [];

  private scrollUp: any;

  constructor(private router: Router, private eixoService: EixoService, private element: ElementRef,
              private seoService: SeoService,
              private titleService: Title
    ) {
    this.scrollUp = this.router.events.subscribe(() => {
      element.nativeElement.scrollIntoView();
     });
  }

  ngOnInit() {
    this.buscarEixosPcs();
    this.titleService.setTitle(`Eixos do Programa Cidades Sustentáveis - Cidades Sustentáveis`);
    const config = {
      title: 'Eixos do Programa Cidades Sustentáveis',
      description: 'Os 12 eixos temáticos do Programa Cidades Sustentáveis foram inspirados nos Compromissos de Aalborg, um pacto político assinado em 2004 por autoridades de mais de 700 cidades para fortalecer as agendas de desenvolvimento sustentável em nível local. ',
      image:  `${environment.APP_IMAGEM}eixos-pcs-og.png`,
      slug: '',
      site: 'Cidades Sustentáveis' ,
      url: `${environment.APP_URL}institucional/pagina/eixos-do-pcs`
    };
    this.seoService.generateTags(config);
  }

  private buscarEixosPcs() {
    this.eixoService.buscarEixosDto().subscribe(response => {
      this.listaEixos = response;
    });
  }

  public irDetalheEixo(noticia: any) {
    if (noticia.url) {
      this.router.navigate(['/noticia/', noticia.url]);
    } else {
      this.router.navigate(['/noticia/', noticia.idNoticia]);
    }
  }

  public getImagePath(id: number): string {
    if (id == null) {
      return '/';
    }

    return `${environment.API_URL}eixo/imagem/` + id;
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}eixos-pcs.png`
  }

}
