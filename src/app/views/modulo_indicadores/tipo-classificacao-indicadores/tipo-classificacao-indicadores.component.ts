import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { SeoService } from 'src/app/services/seo-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tipo-classificacao-indicadores',
  templateUrl: './tipo-classificacao-indicadores.component.html',
  styleUrls: ['./tipo-classificacao-indicadores.component.css',"../../../../animate.css"]
})
export class TipoClassificacaoIndicadoresComponent implements OnInit {

  @HostListener('window:scroll', ['$event'])
  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;
  scrollUp: any;

  constructor(private activatedRoute: ActivatedRoute, public domSanitizationService: DomSanitizer,private element: ElementRef
    ,private router: Router, private titleService: Title, private seoService: SeoService) {this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
     }

  ngOnInit() {
    this.titleService.setTitle(`Tipos e Classificações de Indicadores - Cidades Sustentáveis`);
    const config = {
      title: 'Tipos e Classificações de Indicadores - Cidades Sustentáveis',
      description: 'Eles podem ser categorizados em áreas temáticas, descrever um determinado aspecto da realidade de forma rápida e objetiva (número de leitos hospitalares, por exemplo) ou sintetizar diversas dimensões em uma mesma medida ou propriedade, como o IDH. ',
      image:  `${environment.APP_IMAGEM}modulo-indicadores-tipos-e-classificacoes-og.jpg`,
      slug: '',
      site: 'Cidades Sustentáveis' ,
      url: `${environment.APP_URL}tipoclassificacaoindicadores`
    };
    this.seoService.generateTags(config);

    this.myStyle = {
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    };

    this.myParams = {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#ffffff'
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 7,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onhover: {
            enable: false,
            mode: 'grab'
          },
          onclick: {
            enable: false,
            mode: 'push'
          },
          resize: true
        },
      },
      retina_detect: true
    };
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}modulo-indicadores-tipos-e-classificacoes.jpg`
  }
}
