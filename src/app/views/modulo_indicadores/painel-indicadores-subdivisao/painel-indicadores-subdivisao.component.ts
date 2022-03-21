import { environment } from 'src/environments/environment';
import { latLng, tileLayer, geoJSON } from 'leaflet';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CidadeService } from 'src/app/services/cidade.service';
import { SubdivisaoService } from 'src/app/services/subdivisao.service';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeNestedDataSource } from '@angular/material';
import { TipoSubdivisaoService } from 'src/app/services/tipoSubdivisao.service';
import * as L from 'leaflet';
import * as chroma from 'chroma-js';
import { LeafletUtilService } from 'src/app/services/leaflet-util.service';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-painel-indicadores-subdivisao',
  templateUrl: './painel-indicadores-subdivisao.component.html',
  styleUrls: ['./painel-indicadores-subdivisao.component.css']
})
export class PainelIndicadoresSubdivisaoComponent implements OnInit {

  cidade:any  = {};
  arvoreSubdivisao:any =[];
  tiposSubdivisao:any = [];
  treeControl = new NestedTreeControl<any>(node => node.filhos);
  dataSource = new MatTreeNestedDataSource<any>();
  features: any;
  mediana = null;


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
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    })
  };

  public optionsLeaflet = {
    layers:  [this.baseLayers.Mapa],
    zoom: 4,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227]),
  };

  map: any;
  mapCenter = latLng([-15.03144, -53.09227]);
  mapZoom = 4;
  layersControl:any ={baseLayers: this.baseLayers,overlays:{}};
  leafletLayers:any =[];
  allLayers:any = [];

  scrollUp:any;

  constructor(private activatedRoute: ActivatedRoute,
    private cidadeService: CidadeService,
    private subdivisaoService: SubdivisaoService,
    private tipoSubdivisaoService: TipoSubdivisaoService,
    private leafletUtilService: LeafletUtilService,
    private router: Router,
    private element: ElementRef,
    private _scrollToService: ScrollToService) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
    }

  ngOnInit() {
    this.buscarDadosDaCidade();

  }

  buscarDadosDaCidade(){
    this.activatedRoute.params.subscribe(async params => {
      let sigla = params.siglaestado;
      let nomeCidade = params.nomecidade;
      this.cidadeService.buscarPorSiglaCidade(sigla,nomeCidade).subscribe(res =>{
        this.cidade = res;
        this.buscarArvoreSubdivisoes(this.cidade.id);
        this.buscarTiposSubdivisao(this.cidade.id);
        this.optionsLeaflet.center = latLng(this.cidade.latitude,this.cidade.longitude);
        this.mapCenter = latLng(this.cidade.latitude,this.cidade.longitude);
        this.mapZoom = 12;
      });
    });
  }

  buscarArvoreSubdivisoes(idCidade){
    this.subdivisaoService.buscarArvoreSubdivisoes(idCidade).subscribe(res => {
      this.arvoreSubdivisao = res;
      this.dataSource.data = this.arvoreSubdivisao;
    });
  }

  buscarTiposSubdivisao(idCidade){
    this.tipoSubdivisaoService.buscarTodosPorCidadeId(idCidade).subscribe(res => {
      this.tiposSubdivisao = res;
      let qtd = this.tiposSubdivisao.length;
      let nome = '';
      if(qtd >0){
        let tipo = this.tiposSubdivisao[qtd-1];
        nome = this.tiposSubdivisao[qtd-1].nome;
      }

      for(let tipo of this.tiposSubdivisao){
        let layerGroup = L.featureGroup();

        this.layersControl.overlays[tipo.nome] = layerGroup;
        this.buscarFeatureTipoSubdivisao(idCidade, tipo.nivel, layerGroup);
      }
      this.leafletLayers[0] = this.layersControl.overlays[nome];
    });
  }

  buscarFeatureTipoSubdivisao(idCidade,idTipo, featureGroup){
    this.subdivisaoService.buscarTodosPorCidadeIdNivel(idCidade ,idTipo).subscribe(res => {
      let retorno = res;
      for(let subdivisao of retorno){
        if(subdivisao.features){
          for(let feature of subdivisao.features){
            let propriedades ={
              cidade: this.cidade.nome,
              estado: this.cidade.siglaEstado,
              subdivisao: subdivisao.nome,
              tipo:  subdivisao.tipoSubdivisao.nome,
              pai: subdivisao.subdivisaoPai ? subdivisao.subdivisaoPai.nome : '',
              tipoPai: subdivisao.subdivisaoPai ? subdivisao.subdivisaoPai.tipoSubdivisao.nome : '',
            }

            let geojson = L.geoJSON(feature,{});
            geojson.properties = propriedades;
            const texto = propriedades.pai ?
              `<div><b>Cidade:</b> ${propriedades.cidade} - ${propriedades.estado} <br>
              <b>${propriedades.tipo}</b> ${propriedades.subdivisao}<br>
              <b>${propriedades.tipoPai}:</b> ${propriedades.pai}</div>` :
              `<div><b>Cidade:</b> ${propriedades.cidade} - ${propriedades.estado} <br>
              <b>${propriedades.tipo}</b> ${propriedades.subdivisao}</div>`;
            geojson.bindPopup(texto)
            geojson.on('mouseover', function (e) {
              this.openPopup();
            });
            geojson.on('mouseout', function (e) {
                this.closePopup();
            });

            featureGroup.addLayer(geojson);
            this.allLayers.push(geojson);
          }
        }
      }
      let bounds = featureGroup.getBounds();
      this.map.fitBounds(bounds);
      this.colorirMapa();
    });
  }


  public onMapReady(map) {
    this.map = map;
    const corner1 = L.latLng(-100, -190);
    const corner2 = L.latLng(100, 190);
    const bounds = L.latLngBounds(corner1, corner2);
    map.setMaxBounds(bounds);
    // this.buscarDadosDaCidade();
    // this.layersGroup.addTo(this.map);

  }

  colorirMapa(){
    let mapColor = new Map()
    for(let geojson of this.allLayers){
      if(!mapColor.has(geojson.properties.pai)){
        mapColor.set(geojson.properties.pai,   chroma.random().hex());
      }
      if(!geojson.properties.tipoPai){
        let cor  =chroma.random().hex();
        geojson.setStyle({
          fillColor: cor,
          fillOpacity:1,
          weight: 1,
          opacity: 1,
          color: "#666666",
          dashArray: '1'
        });
      } else {
        geojson.setStyle({
          fillColor: mapColor.get(geojson.properties.pai),
          fillOpacity: 1,
          weight: 1,
          opacity: 1,
          color: "#666666",
          dashArray: '1'
        });
      }
    }
  }
}
