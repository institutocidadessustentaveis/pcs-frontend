import { Evento } from 'src/app/model/Evento';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
} from "@angular/core";
import * as L from "leaflet";
import "leaflet.markercluster";
import { GestureHandling } from "leaflet-gesture-handling";
import { environment } from "src/environments/environment";
import { EventoService } from "src/app/services/evento.service";

@Component({
  selector: "app-mapa-eventos",
  templateUrl: "./mapa-eventos.component.html",
  styleUrls: ["./mapa-eventos.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapaEventosComponent implements OnInit, OnChanges {
  private baseLayers = {
    Mapa: L.tileLayer(environment.MAP_TILE_SERVER, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 2,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    }),
    Satélite: L.tileLayer(environment.MAP_TILE_SERVER_SAT, {
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    }),
  };

  markerClusters: any;

  mapOptions = {
    zoom: 4,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000,
    },
    center: L.latLng([-15.03144, -53.09227]),
    layers: [this.baseLayers.Mapa],
  };

  eventosDetalhes: string = '';

  private map: L.Map;
  private overlays = {};
  public layersControl: any;
  public vermaisvar = false;
  layers = [];
  @Input() eventos: any;
  @Input() mapaCapacitacao: any = false;
  constructor(private eventoService: EventoService) {
  }

  ngOnInit() { }
  ngOnChanges() {
    this.configurarMarcadores();
  }

  onMapReady(mapa) {
    this.map = mapa;
    this.initLayerControl();
    if (!this.mapaCapacitacao) {
      this.gerarLegenda();
    }
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
  }
  private initLayerControl() {
    this.layersControl = L.control
      .layers(this.baseLayers, this.overlays, { collapsed: false })
      .addTo(this.map);
  }

  private configurarMarcadores() {

    this.markerClusters = L.markerClusterGroup({
      maxClusterRadius: 20,
      iconCreateFunction: function(cluster) {
        var childCount = cluster.getChildCount();

        var c = " marker-cluster-";

        if (childCount > 0) {
          c += "large";
        }
        return new L.DivIcon({
          html: '<div><span>' + childCount + '</span></div>',
          className: 'marker-cluster' + c,
          iconSize: new L.Point(40, 40)
        });
      },
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
    });

    this.layers = [];
    this.eventos.forEach((evento) => {
      let clicouNoEvento = false;    

      if (evento.latitude && evento.longitude) {
        let marker: L.circleMarker = L.circleMarker(
          [evento.latitude, evento.longitude],
          {
            radius: 10,
            color: this.getCor(evento),
            fillOpacity: 1,
            weight: 0.3,
            tipo: evento.tipo,
          }
        );

        marker.bindPopup(
          this.definirPopup(evento)
        );

        marker.on("mouseover", (e) => {
          e.target.openPopup();
        });

        
        marker.on("mouseout", (e) => {
          if(!clicouNoEvento){
            e.target.closePopup();
          }
        });
      

        marker.on("click", (e) => {
          clicouNoEvento = !clicouNoEvento;
        });
        
        this.markerClusters.addLayer(marker);
      }
    });

    // this.overlays["cidades"] = this.markerClusters;

      this.layers.push(this.markerClusters);
  }

  getCor(eventoToColor) {
      switch (eventoToColor.tipo) {
        case "PCS":
          return "#00e676"; //verde
        case "Prefeitura":
          return "#B0C4DE"; //cinza
        case "Terceiros":
          return "#ffea00"; // amarelo
        case "Rede Nossa São Paulo":
          return "#ff1744"; //rosa ou vermelho ??
        case "Capacitação para Prefeituras Signatárias":
          return "#ff9100"; // laranja
        case "Academia":
          return "#d500f9"; // Roxo
        case "ICS":
          return "#00b0ff"; // azul
        default:
          return "#fc50a0";
      }
  }

  gerarLegenda() {
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function (map) {
      var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      div.innerHTML += `<i style="background: #00e676; border-radius:50%"></i>  PCS<br>`;
      div.innerHTML += `<i style="background: #ffea00; border-radius:50%"></i>  Parceiros<br>`;
      div.innerHTML += `<i style="background: #ff1744; border-radius:50%"></i>  Rede nossa São Paulo<br>`;
      div.innerHTML += `<i style="background: #ff9100; border-radius:50%"></i>  Capacitação para prefeituras signatárias<br>`;
      div.innerHTML += `<i style="background: #d500f9; border-radius:50%"></i>  Academia<br>`;
      div.innerHTML += `<i style="background: #00b0ff; border-radius:50%"></i>  ICS<br>`;
      div.innerHTML += `<div class="div-cluster-legenda"></div> Indica o número de eventos nesta região<br>`;

      return div;
    };

    legend.addTo(this.map);
  }

  // definirPopup(eventos: Evento[], eventoAtual: Evento) {
  //   let textoPopup = '';
  //   textoPopup = `<a href='eventos/detalhe/${eventoAtual.id}' target="_blank" style="color: black" title="${eventoAtual.nome}"><strong>${this.truncate(eventoAtual.nome, 3, '...')}</strong></a><p>`;
  //   eventos.forEach(evento => {
  //     if (evento.latitude === eventoAtual.latitude && evento.longitude === eventoAtual.longitude) {
  //       textoPopup += `<a href='eventos/detalhe/${evento.id}' target="_blank" style="color: black" title="${evento.nome}"><strong>${this.truncate(evento.nome, 3, '...')}</strong></a><p>`;
  //     }
  //   });
  //   return textoPopup;
  // }

  definirPopup(eventoAtual: Evento) {
    let textoPopup = '';
    textoPopup = `<a href='eventos/detalhe/${eventoAtual.id}' target="_blank" style="color: black" title="${eventoAtual.nome}"><strong>${this.truncate(eventoAtual.nome, 3, '...')} </strong></a><a href='eventos/detalhe/${eventoAtual.id}' target="_blank">Ver mais</a><p>`;

    return textoPopup;
  }

  public truncate(value: string, limit: number, trail: String = '…'): string {
    let result = value || '';
    if (value) {
      const words = value.split(/\s+/);
      if (words.length > Math.abs(limit)) {
        if (limit < 0) {
          limit *= -1;
          result = trail + words.slice(words.length - limit, words.length).join(' ');
        } else {
          result = words.slice(0, limit).join(' ') + trail;
        }
      }
    }
    return result;
  }
}
