import { BoaPratica } from './../../../../../model/boaPratica';
import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryPreviewComponent } from 'ngx-gallery';
import { Video } from '../boas-praticas-form.component';
import { MatTableDataSource } from '@angular/material';
import { Arquivo } from 'src/app/model/arquivo';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { CidadeDetalhe } from 'src/app/model/cidadeDetalhe';
import { ActivatedRoute, Router } from '@angular/router';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HistoricoCompartilhamentoService } from 'src/app/services/historico-compartilhamento.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { CidadeService } from 'src/app/services/cidade.service';
import * as L from 'leaflet';
import GestureHandling from 'leaflet-gesture-handling';
import { ImagemBoaPratica } from 'src/app/model/imagem-boa-pratica';
import { environment } from 'src/environments/environment';
import { latLng, tileLayer, Map, marker, icon } from 'leaflet';
import { EixoService } from 'src/app/services/eixo.service';

@Component({
  selector: 'app-pre-visualizacao',
  templateUrl: './pre-visualizacao.component.html',
  styleUrls: ['./pre-visualizacao.component.css']
})
export class PreVisualizacaoComponent implements OnInit {

  @Input() boaPratica: BoaPratica = null;
  @Input() modoEdicao: boolean;

  public galleryOptions: NgxGalleryOptions[];
  public galleryImages: NgxGalleryImage[];
  public galeriaDeVideos: Video[] = [];
  public displayedColumns: string[] = ['nomeArquivo'];
  public dataSource: MatTableDataSource<Arquivo>;
  public loading: boolean = false;
  public urlatual: string;
  public objetivoGeralVazio = true;
  public objetivosEspecificosVazio = true;
  public principaisResultadosVazio = true;
  public umAprendizadoFundamentalVazio = true;
  public parceirosEnvolvidosVazio = true;
  public publicoAtingidoVazio = true;
  public resultadosQuantitativosVazio = true;
  public resultadosQualitativosVazio = true;
  public parametrosContempladosVazio = true;
  public fontesDeReferenciaVazio = true;
  public galeriaDeVideosVazio = true;
  public galeriaDeImagensVazio = true;
  public informacoesComplementaresVazio =  true;
  public nomeEixo: string;

  public listaOds: ObjetivoDesenvolvimentoSustentavel[] = [];
  public odsSelecionado: ObjetivoDesenvolvimentoSustentavel = null;

  public cidadeSelecionada: CidadeDetalhe;

  scrollUp: any;

  map: Map;

  private baseLayers = {
    'MAPA': tileLayer(environment.MAP_TILE_SERVER, {
      detectRetina: true,
      attribution: environment.MAP_ATTRIBUTION,
      noWrap: true,
      minZoom: 2
    }),
  };

  options = {
    zoom: 14,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227]),
    layers: [this.baseLayers['MAPA']]
  };

  layersControl = [];

  constructor(public activatedRoute: ActivatedRoute, public router: Router, private element: ElementRef,
              private eixoService: EixoService, public domSanitizationService: DomSanitizer,
              public historicoCompartilhamentoService: HistoricoCompartilhamentoService, private domSanitizer: DomSanitizer,
              private odsService: ObjetivoDesenvolvimentoSustentavelService, private cidadeService: CidadeService) {
              this.scrollUp = this.router.events.subscribe((path) => {
                  element.nativeElement.scrollIntoView();
              });

              L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
  }

  ngOnInit() {
      
    this.urlatual = window.location.href;

    this.galleryOptions = [
      {
        width: '100%',
        height: '400px',
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true,
        thumbnails: false,
        imageDescription: true,

      },
    ];

    NgxGalleryPreviewComponent.prototype.getSafeUrl = function (image) {
      return image;
    };
  }

  public obterDataAtual() {
    var dateObj = new Date();
    var dd = String(dateObj.getDate()).padStart(2, '0');
    var mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    var yyyy = dateObj.getFullYear();
    
    return dd + '/' + mm + '/' + yyyy;
  }

  onMapReady(map: Map) {
    this.map = map;
  }

  addMarkerOnMap(latitude: number, longitude: number) {
    const markerCidade: marker = marker([latitude , longitude ],
      { icon : icon({
          iconSize: [ 50, 50],
          iconAnchor: [ 25, 60 ],
          iconUrl: 'assets/mapmarker.png'
      })}
      );

    this.layersControl = [];
    this.layersControl.push(markerCidade);
  }

  private prepararGaleriaImagem(imagens: Array<ImagemBoaPratica>) {
    this.galleryImages = [];
    for (const item of imagens) {
      this.galleryImages.push({
        small: 'data:image/png;base64, ' + item.conteudo,
        medium: 'data:image/png;base64, ' + item.conteudo,
        big: this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64, ' + item.conteudo),
        description: 'Autoria: ' + item.nomeAutor
      });
    }
  }

  private prepararGaleriaVideo(videos: Array<string>) {
    for (const item of videos) {
      if (item !== '') {
        this.galeriaDeVideos.push({
          url: item,
          safeUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(item)
        });
      }
    }
  }

  public gerarLinkImagem(ods: ObjetivoDesenvolvimentoSustentavel) {
    return `${environment.API_URL}ods/imagem/${ods.id}`;
  }

  public async carregarInformacoesDaCidade() {
    if (this.boaPratica.galeriaDeImagens){
      this.prepararGaleriaImagem(this.boaPratica.galeriaDeImagens);
    }
    if (this.boaPratica.galeriaDeVideos) {
      this.prepararGaleriaVideo(this.boaPratica.galeriaDeVideos);
    }

    if (this.boaPratica != null && this.boaPratica.idMunicipio) {
      await this.cidadeService.buscarCidadePorId(this.boaPratica.idMunicipio).subscribe(response => {
        this.cidadeSelecionada = response as CidadeDetalhe;
        this.map.panTo(new latLng(this.cidadeSelecionada.latitude, this.cidadeSelecionada.longitude));
        this.addMarkerOnMap(this.cidadeSelecionada.latitude, this.cidadeSelecionada.longitude);
      });
    }

    if (this.boaPratica != null && this.boaPratica.idEixo) {
      this.eixoService.buscarEixoId(this.boaPratica.idEixo).subscribe(response => {
        this.nomeEixo = response.nome;
      });
    }

    if (this.boaPratica != null && this.boaPratica.idsOds) {
      this.carregarDadosOds(this.boaPratica.idsOds);
    }
  }

  private async carregarDadosOds(idsOds: number[]) {
    await this.odsService.buscarPorListaIds(idsOds).subscribe(response => {
      this.listaOds = response as ObjetivoDesenvolvimentoSustentavel[];
      for (let item of this.listaOds) {
        item.iconeSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
          item.icone
        );
        item.iconeReduzidoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
          item.iconeReduzido
        );
      }
    });
  }

}
