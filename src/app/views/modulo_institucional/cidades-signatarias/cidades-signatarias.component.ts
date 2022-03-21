import { Title } from '@angular/platform-browser';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ElementRef
} from "@angular/core";

import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";

import { ProvinciaEstadoShapeService } from "src/app/services/provincia-estado-shape.service";
import { CidadeService } from "src/app/services/cidade.service";
import { PrefeituraService } from "src/app/services/prefeitura-service";
import { PartidoPoliticoService } from "src/app/services/partido-politico.service";
import { PainelIndicadorCidadeService } from "src/app/services/painel-indicador-cidade.service";

import * as L from "leaflet";
import "leaflet.markercluster";
import { GestureHandling } from "leaflet-gesture-handling";
import { latLng, tileLayer, geoJSON, circleMarker } from "leaflet";
import { Estado } from "src/app/model/PainelIndicadorCidades/estado";
import { PartidoPolitico } from "src/app/model/partido-politico";
import { Router } from "@angular/router";

import { environment } from "src/environments/environment";

import {
  ScrollToService,
  ScrollToConfigOptions
} from "@nicky-lenaers/ngx-scroll-to";
import { ItemCombo } from "src/app/model/ItemCombo ";
import { FormBuilder, FormGroup } from '@angular/forms';
import { SeoService } from 'src/app/services/seo-service.service';
import { HttpClient } from '@angular/common/http';
import { InstitucionalInternoService } from 'src/app/services/institucional-interno.service';
import { CidadesSignatariasService } from 'src/app/services/cidades-signatarias.service';

@Component({
  selector: "app-cidades-signatarias",
  templateUrl: "./cidades-signatarias.component.html",
  styleUrls: ["./cidades-signatarias.component.css", "../../../../animate.css"]
})
export class CidadesSignatariasComponent implements OnInit {

  public formFiltro: FormGroup;

  public contentUrlFtp: string;

  displayedColumns: string[] = ["cidade", "estado", "populacao", "prefeito", "partido"];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  map: L.Map;

  estadosFeatureGroup: any;
  markerClusters: any;

  private baseLayers = {
    MAPA: L.tileLayer(environment.MAP_TILE_SERVER, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 2,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    })
  };

  private overlays = {};

  options = {
    zoom: 4,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227]),
    layers: [this.baseLayers["MAPA"]]
  };

  private initLayerControl() {
    if (this.overlays["estados"]) {
      this.overlays["estados"].bringToBack();

      if (this.overlays["cidades"]) {
        this.overlays["cidades"].bringToFront();
      }
    }
  }

  listaPrefeituras: Array<any>;

  listaEstado: Array<Estado>;

  listaPartidos: Array<PartidoPolitico>;

  listaPartidosItemCombo: ItemCombo[] = [];

  exibirMensagemAlerta: boolean = false;

  scrollUp: any;

  legenda1: String;
  legenda2: String;
  legenda3: String;
  legenda4: String;
  legenda5: String;

  numTotalCidadesSig: number;

  constructor(
    private shapeService: ProvinciaEstadoShapeService,
    private cidadesService: CidadeService,
    private prefeituraService: PrefeituraService,
    private partidoService: PartidoPoliticoService,
    private painelIndicadorCidadeService: PainelIndicadorCidadeService,
    private changeDetectorRefs: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private element: ElementRef,
    private router: Router,
    private _scrollToService: ScrollToService,
    private titleService: Title,
    private seoService: SeoService,
    private http: HttpClient,
    private institucionalService: InstitucionalInternoService,
    private cidadesSignatariasService: CidadesSignatariasService
  ) {
    this.titleService.setTitle("Cidades Signatárias - Cidades Sustentáveis");
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.formFiltro = this.formBuilder.group({
      estadoSelecionado: [-1],
      termoBuscaCidade: [''] ,
      termoBuscaPrefeito: [''],
      partidoSelecionado: [-1],
      populacaoMin: [''],
      populacaoMax: [''],
    });

    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
  }

  ngOnInit() {
    const config = {
      title: 'Cidades Signatárias - Cidades Sustentáveis',
      description: 'Mais de 200 municípios são signatários do Programa Cidades Sustentáveis, de pequenos povoados com pouco mais de 2 mil habitantes a metrópoles onde vivem milhões de pessoas. Localize as cidades no mapa abaixo ou faça uma busca pelos filtros.',
      image:  `${environment.APP_IMAGEM}cidades-signatarias-og.jpg`,
      slug: '',
      site: 'Cidades Sustentáveis' ,
      url: `${environment.APP_URL}cidades_signatarias`
    };
    this.seoService.generateTags(config);
    this.carregarDadosCidades();
    this.buscarItemComboPartidoPolitico();
    this.buscarEstadosSignatarios();
    
    
    this.urlText();
  }

  onMapReady(map: L.Map) {
    this.map = map;

    let _this = this;

    const legend = new (L.Control.extend({
      options: { position: "bottomright" }
    }))();
    legend.onAdd = function(map) {
      const div = L.DomUtil.create("div", "info legend");

      div.innerHTML +=
        '<span class="iconLegendcluster" style="margin-bottom: 5px;">' +
        '</span> &nbsp;<span class="legendcluster">O número no círculo indica o número de cidades nesta região</span><br/>';
      div.innerHTML +=
        '<span class="iconLegendcidade"></span> &nbsp;<span class="legendcluster">Cidade signatária</span><br/>';
      return div;
    };
    legend.addTo(map);

    
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  focarCidade(cidade) {
    this.map.panTo(new L.LatLng(cidade.latitude, cidade.longitude));

    setTimeout(() => {
      this.map.setZoomAround(
        new L.LatLng(cidade.latitude, cidade.longitude),
        10
      );
    }, 300);
  }

  redirecionarPaginaCidade(idCidade: any) {
    this.router.navigate([`/painel-cidade/detalhes/${idCidade}`]);
  }

  public carregarDadosEstados() {
    this.estadosFeatureGroup = L.featureGroup();
    this.cidadesService
      .calcularNumeroCidadesSignatariasPorEstado()
      .subscribe(numeroSignatariasPorEstado => {
        if (numeroSignatariasPorEstado.length > 0) {
          this.shapeService
            .buscarPorEstados(
              numeroSignatariasPorEstado.map(r => r["idEstado"])
            )
            .subscribe(shapes => {
              shapes.forEach(shape => {
                let quantidadeSignatarias: number = numeroSignatariasPorEstado.filter(
                  p => p["idEstado"] === shape["estado"]["idProvinciaEstado"]
                )[0]["cidadesParticipantes"];

                let opacity = this.calcularOpacidadeShape(
                  quantidadeSignatarias
                );
                let color: string = this.getShapeColor(quantidadeSignatarias);

                let options = {
                  color: color,
                  weight: 1,
                  opacity: opacity,
                  fillOpacity: opacity
                };

                let geoJson = geoJSON([shape["geometria"]], options);

                geoJson.on("click", () => {
                  let idEstado = shape["estado"]["idProvinciaEstado"];
                  this.formFiltro.controls.estadoSelecionado.setValue(idEstado);
                  this.tradeEstado(idEstado);
                  this.changeDetectorRefs.detectChanges();
                });

                this.estadosFeatureGroup.addLayer(geoJson);
              });

              this.overlays["estados"] = this.estadosFeatureGroup;

              this.estadosFeatureGroup.addTo(this.map);

              this.initLayerControl();
            });
        }
      });
  }

  private carregarDadosCidades() {
    this.prefeituraService.buscarPrefeiturasSignatarias().subscribe(res => {
      this.listaPrefeituras = res as any[];
      this.gerarValoresLegenda(this.listaPrefeituras);
      this.dataSource = new MatTableDataSource<any>(this.listaPrefeituras);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
     

      let prefeituras: any[] = res as any[];

      this.carregarDadosEstados();

      this.markerClusters = L.markerClusterGroup({
        maxClusterRadius: 30,
        iconCreateFunction: function(cluster) {
          var childCount = cluster.getChildCount();

          var c = " marker-cluster-";

          if (childCount > 0) {
            c += "large";
          }
          return new L.DivIcon({
            html: "<div><span>" + childCount + "</span></div>",
            className: "marker-cluster" + c,
            iconSize: new L.Point(40, 40)
          });
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });

      prefeituras.forEach(cidade => {
        if (cidade.latitude !== null && cidade.longitude !== null) {
          let options = {
            radius: 10,
            fillColor: "#E02020",
            color: "#C04040",
            fillOpacity: 0.75,
            weight: 1
          };
          let marker: circleMarker = circleMarker(
            [cidade.latitude, cidade.longitude],
            options
          );

          marker.bindPopup(`<strong>${cidade.cidade} - ${cidade.siglaEstado}</strong>
                            <p>Prefeito: ${cidade.candidato}</p>
                            <p>Partido: ${cidade.partido}</p>
                            &nbsp;<a href="/painel-cidade/detalhes/${cidade.idCidade}">Ir para página da Cidade</a>`);

          this.markerClusters.addLayer(marker);
        }
      });

      this.overlays["cidades"] = this.markerClusters;

      this.markerClusters.addTo(this.map);

      this.initLayerControl();
    });
  }

  public carregarPartidos() {
    this.partidoService.buscar().subscribe(resp => {
      this.listaPartidos = resp as Array<PartidoPolitico>;
    });
  }

  buscarEstadosSignatarios() {
    this.painelIndicadorCidadeService
          .buscarEstadosSignatarios()
          .subscribe(response => {
            this.listaEstado = response;
          });
  }

  buscarCidades() {
    this.prefeituraService
          .buscarPrefeiturasSignatariasVigentesPorEstadoCidadePartidoPopulacao(
            this.formFiltro.controls.estadoSelecionado.value,
            this.formFiltro.controls.termoBuscaCidade.value,
            this.formFiltro.controls.termoBuscaPrefeito.value,
            this.formFiltro.controls.partidoSelecionado.value,
            this.formFiltro.controls.populacaoMin.value,
            this.formFiltro.controls.populacaoMax.value
          )
          .subscribe(response => {
            let cidades = response as PartidoPolitico[]; 
            this.dataSource = new MatTableDataSource<PartidoPolitico>(cidades);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.exibirMensagemAlerta = cidades.length == 0;
            this.changeDetectorRefs.detectChanges();
          });
  }

  tradeEstado(idEstado: number) {
    this.prefeituraService
      .buscarCidadesSignatariasPorEstado(idEstado)
      .subscribe(response => {
        let cidades = response as any[];
        this.dataSource = new MatTableDataSource<any>(cidades);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.exibirMensagemAlerta = cidades.length == 0;
        this.changeDetectorRefs.detectChanges();
        this.triggerScrollTo();
      });
  }

  public gerarLinkDownloadListaCidades() {
    return `${environment.API_URL}dados-abertos/cidades.xlsx`;
  }

  private calcularOpacidadeShape(quantidade: number) {
    let opacidade: number = 0.0;

    let intervalo = this.numTotalCidadesSig;

    let value1: number, value2: number, value3: number, value4: number;
    
    value1 = Math.ceil(intervalo);
    value2 = Math.ceil(value1 + intervalo) + 1;
    value3 = Math.ceil(value2 + intervalo) + 1;
    value4 = Math.ceil(value3 + intervalo) + 1;
     
    /*
    Estados sem cidades signatárias tem essa opacidade fixa pois são identificados com uma
    cor diferente (cinza), e não pela opacidade.
    */
    if (quantidade == 0) {
      return 0.3;
    }

    if (quantidade >= (value1 + 1) && quantidade < value2) {
      return 0.30;
    }

    if (quantidade >= (value2 + 1) && quantidade < value3) {
      return 0.40;
    }

    if (quantidade >= (value3 + 1) && quantidade <= value4) {
      return 0.60;
    }

    if (quantidade > value4) {
      return 0.70;
    }

    return opacidade;
  }

  private getShapeColor(quantidade: number) {
    if (quantidade > 0) {
      return "#037000";
    }

    return "#888f88";
  }

  public triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      target: "destination"
    };
    this._scrollToService.scrollTo(config);
  }

  public buscarItemComboPartidoPolitico() {
    this.partidoService.buscarItemCombo().subscribe(resp => {
      this.listaPartidosItemCombo = resp as ItemCombo[];
    });
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}cidades-signatarias.jpg`
  }

  public gerarValoresLegenda(prefeiturasSig: Array<any>){
    if (prefeiturasSig.length > 0) {
      this.numTotalCidadesSig = prefeiturasSig.length / 5;
      let numLegenda = prefeiturasSig.length / 5;
    
      let legenda1Aux, legenda2Aux, legenda3Aux, legenda4Aux;
    
      legenda1Aux = Math.ceil(numLegenda);
      legenda2Aux = Math.ceil(legenda1Aux + numLegenda) + 1;
      legenda3Aux = Math.ceil(legenda2Aux + numLegenda) + 1;
      legenda4Aux = Math.ceil(legenda3Aux + numLegenda) + 1;
     
      this.legenda1 = `de 1 até ${legenda1Aux} cidades signatárias`;
      this.legenda2 = `de ${legenda1Aux + 1} até ${legenda2Aux.toFixed()} cidades signatárias`;
      this.legenda3 = `de ${legenda2Aux + 1} até ${legenda3Aux.toFixed()} cidades signatárias`;
      this.legenda4 = `de ${legenda3Aux + 1} até ${legenda4Aux.toFixed()} cidades signatárias`;
      this.legenda5 = `acima de ${legenda4Aux} cidades signatárias`;

      this.gerarLegendaNoMapa(true);
   } else {
      this.legenda1 = null;
      this.legenda2 = null;
      this.legenda3 = null;
      this.legenda4 = null;
      this.legenda5 = null;

      this.gerarLegendaNoMapa(false);
   }
 }


 urlText(){
    this.cidadesSignatariasService.buscarTxt().subscribe(res => {
      if(res != null) {
        this.contentUrlFtp = res;
      }
    });
  }

  gerarLegendaNoMapa(gerarLegenda: boolean){

    let _this = this;

    if (gerarLegenda && window.innerWidth > 1399) {
      const legenda = new (L.Control.extend({
        options: { position: "bottomleft" }
      }))();
      legenda.onAdd = function(map) {
        const div = L.DomUtil.create("div", "info legend"),
          labels = [];
        labels.push(
          "<div style='width:240px;'><i style='width:18px;height:18px; background:#888f88; opacity:0.3'></i> nenhuma cidade signatária</div>"
        );
        labels.push(
          `<div style='width:240px;'><i style='width:18px;height:18px; background:#037000; opacity:0.15'></i>${_this.legenda1}</div>`
        );
        labels.push(
          `<div style='width:240px;'><i style='width:18px;height:18px; background:#037000; opacity:0.3'></i>${_this.legenda2}</div>`
        );
        labels.push(
          `<div style='width:240px;'><i style='width:18px;height:18px; background:#037000; opacity:0.45'></i>${_this.legenda3}</div>`
        );
        labels.push(
          `<div style='width:240px;'><i style='width:18px;height:18px; background:#037000; opacity:0.6'></i>${_this.legenda4}</div>`
        );
        labels.push(
          `<div style='width:240px;'><i style='width:18px;height:18px; background:#037000; opacity:0.7'></i>${_this.legenda5}</div>`
        );
        div.innerHTML = labels.join("<br>");
        return div;
      };
      legenda.addTo(this.map);
    }

    if (!gerarLegenda && window.innerWidth > 1399) {
      const legenda = new (L.Control.extend({
        options: { position: "bottomleft" }
      }))();
      legenda.onAdd = function(map) {
        const div = L.DomUtil.create("div", "info legend"),
          labels = [];
        labels.push(
          "<div style='width:240px;'><i style='width:18px;height:18px; background:#888f88; opacity:0.3'></i> nenhuma cidade signatária</div>"
        );
        div.innerHTML = labels.join("<br>");
        return div;
      };
      legenda.addTo(this.map);
    }
  }

}
