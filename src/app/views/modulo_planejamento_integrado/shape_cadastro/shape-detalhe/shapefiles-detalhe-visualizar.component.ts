import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';

import * as L from "leaflet";
import "leaflet.markercluster";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { latLng, tileLayer, geoJSON } from "leaflet";
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material';
import { ShapefileDetalheDTO } from 'src/app/model/shapefileDetalheDTO';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { RasterItem } from 'src/app/model/rasterItem';
import { PcsUtil } from 'src/app/services/pcs-util.service';

declare var $;

@Component({
  selector: 'app-shapefiles-detalhe-visualizar',
  templateUrl: './shapefiles-detalhe-visualizar.component.html',
  styleUrls: ['./shapefiles-detalhe-visualizar.component.css']
})

export class ShapeFilesDetalheVisualizarComponent implements OnInit {

  public importFeatureGroup;
  public importFeatureGroupOld = null;
  public importFeatureGroupRaster;

  public shapefile: ShapefileDetalheDTO = new ShapefileDetalheDTO();

  public listaOds: ObjetivoDesenvolvimentoSustentavel[] = [];
  public odsSelecionado: ObjetivoDesenvolvimentoSustentavel = null;

  private map: L.Map;
  private layerControl;
  private overlays = {};

  public loading = false;

  scrollUp: any;

  @ViewChild('modalLoading') modalLoading: TemplateRef<any>;

  private baseLayers = {
    MAPA: L.tileLayer(environment.MAP_TILE_SERVER, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 2,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    }),
  };

  public mapOptions = {
    zoom: 4,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227]),
    layers: [this.baseLayers.MAPA]
  };

  stylelayer = {
    default: {
      color: '#666666',
      weight: 3,
      fillOpacity: .5,
      strokeOpacity: 0.5,
    }
  };

  constructor(private shapeFileService: ShapeFileService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private boaPraticaService: BoaPraticaService,
    public domSanitizationService: DomSanitizer,
    private element: ElementRef,
    private titleService: Title
    ) {

      this.scrollUp = this.router.events.subscribe(path => {
        element.nativeElement.scrollIntoView();
      });
  }

  ngOnInit() {
    this.buscarShapeFileDetalhes();
    this.initLayerControl();
  }


  buscarShapeFileDetalhes() {
    this.loading = true;
    this.importFeatureGroup = L.featureGroup();
    this.activatedRoute.params.subscribe(async params => {
      const id = params.id;
      if (id) {
        this.shapeFileService.buscarShapeFileVisualizarDetalheDTOPorIdShapeFile(id).subscribe(response => {
          this.shapefile = response as ShapefileDetalheDTO;
          this.titleService.setTitle(`${this.shapefile.titulo} - Detalhes`);
          this.carregarDadosOds(id);
          this.exibirShapeFileVetorial(this.shapefile.shapes);
          this.loading = false;
        });
      }
    });
  }

  private exibirShapeFileVetorial(features: Array<any>) {
    features.forEach(feature => {

      if(feature.geometry.type == 'MultiPolygon' || feature.geometry.type == 'Polygon') {
        const options = {
          color: '#666666',
          fillColor : '#c0c3ac',
          weight: 1,
          fillOpacity: .5,
          strokeOpacity: 0.5,
          fill : true,
          draggable: true,
          transform: true
        };

        const geoJson = geoJSON([feature], options);
        this.importFeatureGroup.addLayer(geoJson);
      } else if (feature.geometry.type.includes('Point') && feature.properties.radius != undefined) {
        const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
          const optionsPontos = {
            radius: feature.properties.radius,
            color: '#666666',
            fillColor : '#c0c3ac',
            weight: 5,
            fillOpacity: .5,
            strokeOpacity: 0.5,
            draggable: true,
            opacity: 1};
          const options = $.extend(optionsPontos, feature.properties);
          const circle = L.circle([coordenadas[1], coordenadas[0]], options);
          circle.setStyle(this.stylelayer.default);

          circle.addTo(this.importFeatureGroup)

      } else if(feature.geometry.type.includes('Point') && feature.properties.radius == undefined) {
        delete feature.properties.radius;
        const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
        const optionsPontos = {
            radius: 5,
            color: '#666666',
            fillColor : '#c0c3ac',
            weight: 4,
            fillOpacity: .5,
            strokeOpacity: 0.5,
            draggable: true,
            opacity: 1};
        const options = $.extend(optionsPontos, feature.properties);
        const marker: L.circleMarker = L.circleMarker([coordenadas[1], coordenadas[0]], options);
        marker.properties = feature.properties;
        marker.setStyle(this.stylelayer.default);

        marker.addTo(this.importFeatureGroup);
      
      } else if (feature.geometry.type.includes('MultiLineString')) {
        const optionsLine = {
          color: '#666666',
          weight: 4,
          opacity: 0.5,
          draggable: true,
          transform: true
        };
        feature.properties.layerType = feature.geometry.type;
        const options = $.extend(optionsLine, feature.properties);
        feature.geometry.coordinates.map(coordinates => {
          coordinates.map(coordinate => {
            const coord1 = coordinate[1];
            const coord2 = coordinate[0];
            coordinate[0] = coord1;
            coordinate[1] = coord2;
          });
        });
        const polyline: L.polyline = L.polyline(feature.geometry.coordinates, options);


        polyline.addTo(this.importFeatureGroup);
      } else if (feature.geometry.type.includes('LineString')) {
        const optionsLine = {
          color: '#666666',
          weight: 4,
          opacity: 0.5,
          draggable: true,
          transform: true
      };
        feature.properties.layerType = feature.geometry.type;
        const options = $.extend(optionsLine, feature.properties);
        const points = [];
        feature.geometry.coordinates.map(coordinate => {
          const point = [];
          point.push(coordinate[1]);
          point.push(coordinate[0]);
          points.push(point);
        });
        const polyline: L.polyline = L.polyline(points, options);
      
        polyline.addTo(this.importFeatureGroup);
      } else {
        const optionsShapes = {
          color: '#666666',
          fillColor : '#c0c3ac',
          weight: 5,
          fillOpacity: .5,
          strokeOpacity: 0.5,
          draggable: true,
          transform: true,
          opacity: 1
        };

        feature.properties.layerType = feature.geometry.type;

        const geoJson = geoJSON([feature], optionsShapes); 
        this.importFeatureGroup.addLayer(geoJson);
      }
    });

    this.layerControl.addOverlay(this.importFeatureGroup, this.shapefile.titulo);
    this.importFeatureGroup.addTo(this.map);
    this.loading = false;
  }

  private async carregarDadosOds(idShapeFile: number) {
    await this.shapeFileService.buscarOdsDoShapeFileId(idShapeFile).subscribe(response => {
      this.listaOds = response as ObjetivoDesenvolvimentoSustentavel[];
      for (const item of this.listaOds) {
        item.iconeSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
          item.icone
        );
        item.iconeReduzidoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
          item.iconeReduzido

        );
      }
    });
  }

  public selecionarOds(odsSelecionado: ObjetivoDesenvolvimentoSustentavel) {
    this.odsSelecionado = odsSelecionado;
    this.router.navigate([`institucional/ods/${this.odsSelecionado.id}`]);
  }


  public gerarLinkImagem(ods: ObjetivoDesenvolvimentoSustentavel) {
    return `${environment.API_URL}ods/imagem/${ods.id}`;
  }

  private initLayerControl() {
    this.layerControl = L.control.layers(this.baseLayers, this.overlays, { collapsed: false });
  }

  public onMapReady(map: L.Map) {
    this.map = map;
    this.layerControl.addTo(this.map);
  }

  urlImagem() {
    return `${environment.APP_IMAGEM}foto-de-todos-os-indicadores.jpg`
  }

  buildLinkToEixoPcs(eixo: string){
    switch(eixo.toLocaleLowerCase()) {
      case 'ação local para a saúde':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/acao-local-para-saude?eixos=true`
        break;
      case 'bens naturais comuns':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/bens-naturais-comuns?eixos=true`
        break;
      case 'consumo responsável e opções de estilo de vida':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/consumo-responsavel-estilos-de-vida?eixos=true`
        break;
      case 'cultura para a sustentabilidade':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/cultura-para-a-sustentabilidade?eixos=true`
        break;
      case 'do local para o global':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/do-local-para-o-global?eixos=true`;
        break;
      case 'economia local, dinâmica, criativa e sustentável':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/economia-local-dinamica-criativa-e-sustentavel?eixos=true`
        break;
      case 'educação para a sustentabilidade e qualidade de vida':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/educacao-para-a-sustentabilidade-e-qualidade-de-vida?eixos=true`
        break;
      case 'equidade, justiça social e cultura de paz':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/equididade-justica-social-e-ecultura-de-paz?eixos=true`
        break;
      case 'gestão local para a sustentabilidade':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/gestao-local-para-a-sustentabilidade?eixos=true`
        break;
      case 'governança':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/governanca?eixos=true`
        break;
      case 'melhor mobilidade, menos tráfego':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/melhor-mobilidade-menos-trafego?eixos=true`
        break;
      case 'planejamento e desenho urbano':
        return `https://www.cidadessustentaveis.org.br/institucional/pagina/planejamento-e-desenho-urbano?eixos=true`
        break;
      }

    
  }


}





















