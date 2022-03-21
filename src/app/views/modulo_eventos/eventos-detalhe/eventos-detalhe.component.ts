
import {
  Component,
  OnInit,
  ElementRef
} from "@angular/core";

import { ActivatedRoute, Router } from "@angular/router";

import * as L from "leaflet";
import { Evento } from 'src/app/model/Evento';
import { Title } from '@angular/platform-browser';
import { latLng, tileLayer,marker, icon } from "leaflet";
import { environment } from 'src/environments/environment';
import { GestureHandling } from "leaflet-gesture-handling";
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { EventoService } from 'src/app/services/evento.service';
import { VisualizarIndicadorService } from "src/app/services/visualizar-indicador.service";
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { NoticiaService } from 'src/app/services/noticia.service';
import { HistoricoCompartilhamentoService } from "src/app/services/historico-compartilhamento.service";
import { EventoDetalhe } from "src/app/model/EventoDetalhe";

@Component({
  selector: "app-eventos-detalhe",
  templateUrl: "./eventos-detalhe.component.html",
  styleUrls: [
    "./eventos-detalhe.component.css",
    "../../../../animate.css"
  ]
})
export class EventosDetalheComponent implements OnInit {

  idEvento: number = null;

  layersControl = [];

  private map: L.Map;

  options = {
    layers: [
      tileLayer(environment.MAP_TILE_SERVER, {
        detectRetina: true,
        attribution: environment.MAP_ATTRIBUTION,
        noWrap: true,
        minZoom: 2,
        crossOrigin: true
      })
    ],
    zoom: 5,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227])
  };

  evento: EventoDetalhe;

  scrollUp: any;

  noticias: any;

  horarioFormatado: any;

  public throttle = 100;
  public scrollDistance = 2;
  public scrollUpDistance = 4;
  public urlatual = window.location.href;
  public url = environment.API_URL;

  constructor(
    private router: Router,
    public pcsUtil: PcsUtil,
    private element: ElementRef,
    private titleService: Title,
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private noticiaService: NoticiaService,
    private historicoCompartilhamentoService: HistoricoCompartilhamentoService,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

   L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
  }

  ngOnInit() {
    this.route.params.subscribe(
      async params => {
        this.idEvento = params.idEvento;
      },
      error => {}
    );
    this.buscarEvento(this.idEvento);  
    
   
  }

  public onMapReady(map) {
    this.map = map;
    this.map.setZoom(1);

    setTimeout(() => {
      this.map.setView([this.evento.latitude, this.evento.longitude]);
    }, 500)

  }

  public salvarLogCompartilhamento (redeSocial: string) {
    this.historicoCompartilhamentoService.gerarHistoricoCompartilhamento(redeSocial, 'Evento').subscribe(res => {})
  }

  private buscarEvento(idEvento: number){
    this.eventoService.buscarEventoDetalhePorId(idEvento)
    .subscribe(res => {
      this.evento = res as EventoDetalhe;
      this.titleService.setTitle(`${this.evento.nome} - Cidades Sustentáveis`);
      this.formatandoHorario();
      this.layersControl.push(
        marker([ this.evento.latitude, this.evento.longitude ],
          { icon : icon({
              iconSize: [ 50, 50],
              iconAnchor: [ 25, 60 ],
              iconUrl: 'assets/mapmarker.png'
          })}
          )
        .bindPopup(`<strong>${this.evento.enderecoExibicao}</strong></br>`)
      );

      if(this.evento.noticiasRelacionadas.length > 0) {
        this.buscarNoticias(this.evento.noticiasRelacionadas);
      }
    });
  }

  public formatarData(): any {
   
    if (this.evento && this.evento.data) {
      
      const date = new Date(this.evento.data);

     
      let month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      let week  = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

      let semana = week[date.getDay()];
      let mes = month[date.getMonth()];
     
      return semana + ', ' + (date.getDate() + 1 ) + ' de ' + mes + ' de ' + date.getFullYear();
    }
    return '';
  }

  public gerarLinkImagem(ods: ObjetivoDesenvolvimentoSustentavel) {
    return `${environment.API_URL}ods/imagem/${ods}`;
  }

  public gerarLinkNoticia(noticia: any) {
    if (noticia.url) {
      return "/noticia/" + noticia.url;
    } else {
      return "/noticia/" + noticia.idNoticia;
    }
  }

  private getImageUrl(id: number) {
    return new Promise((resolve, reject) => {
      const url = `${environment.API_URL}noticia/imagem/` + id;
      resolve(url);
    });
  }

  private buscarNoticias(idsNoticias) {
    this.noticiaService
      .buscarNoticiasDeEventoFiltradas(idsNoticias)
      .subscribe(
        response => {
          this.noticias = response;
        },
        error => {
        }
      );
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}ilustra-modulo-de-eventos.png`
  }

  public formatandoHorario(){
    if(!(this.evento.horario === null || this.evento.horario === '')){
    let horario = this.evento.horario;
    this.horarioFormatado =  horario.substr(0, 5)
    } else {
     this.horarioFormatado = '';
    }
  }
}
