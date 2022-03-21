import { Component, HostListener, OnInit, ElementRef } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from 'src/app/services/seo-service.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: "app-bom-indicador",
  templateUrl: "./bom-indicador.component.html",
  styleUrls: ["./bom-indicador.component.css", "../../../../animate.css"]
})
export class BomIndicadorComponent implements OnInit {
  @HostListener("window:scroll", ["$event"])
  myStyle: object = {};
  myParams: object = {};
  width: number = 100;
  height: number = 100;
  scrollUp: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public domSanitizationService: DomSanitizer,
    private element: ElementRef,
    private router: Router,
    private titleService: Title,
    private seoService: SeoService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.titleService.setTitle(`Bom Indicador - Cidades Sustentáveis`);
    const config = {
            title: 'O que é um Bom Indicador',
      description: 'Precisos, confiáveis, acessíveis, comparáveis, verificáveis e fáceis de interpretar. Existem diversas características que devem ser observadas para se obter e selecionar um indicador de qualidade. Algumas delas são imprescindíveis na gestão pública. Veja o porquê',
      image:  `${environment.APP_IMAGEM}indicadores-um-bom-indicador-og.jpg`,
      slug: '',
      site: 'Cidades Sustentáveis' ,
      url: `${environment.APP_URL}bomIndicador`
    };
    this.seoService.generateTags(config);

    this.myStyle = {
      width: "100%",
      height: "100%",
      "z-index": -1,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
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
          value: "#ffffff"
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
          color: "#ffffff",
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 7,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "window",
        events: {
          onhover: {
            enable: false,
            mode: "grab"
          },
          onclick: {
            enable: false,
            mode: "push"
          },
          resize: true
        }
      },
      retina_detect: true
    };
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}indicadores-um-bom-indicador.jpg`
  }
}




