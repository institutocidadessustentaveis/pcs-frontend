
import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { HistoricoCompartilhamentoService } from 'src/app/services/historico-compartilhamento.service';
import { Arquivo } from 'src/app/model/arquivo';
import { MatTableDataSource } from '@angular/material';
import { saveAs } from 'file-saver';
import { ImagemBoaPratica } from 'src/app/model/imagem-boa-pratica';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation, NgxGalleryPreviewComponent } from 'ngx-gallery';
import { BoaPraticaDetalhe } from 'src/app/model/boaPraticaDetalhe';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { environment } from 'src/environments/environment';
import { latLng, tileLayer, Map, marker, icon } from 'leaflet';
import * as L from 'leaflet';
import GestureHandling from 'leaflet-gesture-handling';
import { SeoService } from 'src/app/services/seo-service.service';
import { CidadeDetalhe } from 'src/app/model/cidadeDetalhe';
import { Video } from '../boas-praticas/boa-pratica-form/boas-praticas-form.component';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { CidadeService } from 'src/app/services/cidade.service';

@Component({
  selector: 'app-boa-pratica-detalhe',
  templateUrl: './boa-pratica-detalhe.component.html',
  styleUrls: ['./boa-pratica-detalhe.component.css', '../../../../animate.css']
})
export class BoaPraticaDetalheComponent implements OnInit {


  public loading = false;
  public urlatual: string;
  public objetivoGeralVazio = true;
  public galeriaDeVideosVazio = true;
  public publicoAtingidoVazio = true;
  public galeriaDeImagensVazio = true;
  public galeriaDeVideos: Video[] = [];
  public boaPratica: BoaPraticaDetalhe;
  public fontesDeReferenciaVazio = true;
  public parceirosEnvolvidosVazio = true;
  public galleryImages: NgxGalleryImage[];
  public objetivosEspecificosVazio = true;
  public principaisResultadosVazio = true;
  public parametrosContempladosVazio = true;
  public resultadosQualitativosVazio = true;
  public galleryOptions: NgxGalleryOptions[];
  public resultadosQuantitativosVazio = true;
  public umAprendizadoFundamentalVazio = true;
  public informacoesComplementaresVazio = true;
  public solucoesVazio = true;
  public dataSource: MatTableDataSource<Arquivo>;
  public displayedColumns: string[] = ['nomeArquivo'];
  public url = environment.API_URL;


  public listaOds: ObjetivoDesenvolvimentoSustentavel[] = [];
  public odsSelecionado: ObjetivoDesenvolvimentoSustentavel = null;


  public cidadeSelecionada: CidadeDetalhe;

  scrollUp: any;

  map: Map;


  private baseLayers = {
    MAPA: tileLayer(environment.MAP_TILE_SERVER, {
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
    layers: [this.baseLayers.MAPA]
  };

  layersControl = [];


  constructor(
    private titleService: Title,
    public router: Router,
    private element: ElementRef,
    private seoService: SeoService,
    private domSanitizer: DomSanitizer,
    private cidadeService: CidadeService,
    public activatedRoute: ActivatedRoute,
    public domSanitizationService: DomSanitizer,
    private boaPraticaService: BoaPraticaService,
    public historicoCompartilhamentoService: HistoricoCompartilhamentoService,
              ) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
  }

  ngOnInit() {
    this.urlatual = window.location.href;
    this.buscarBoaPratica();

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

    NgxGalleryPreviewComponent.prototype.getSafeUrl = function(image) {
      return image;
    };
  }

  onMapReady(map: Map) {
    this.map = map;
  }

  addMarkerOnMap(latitude: number, longitude: number) {
    const markerCidade: marker = marker([latitude, longitude],
      {
        icon: icon({
          iconSize: [50, 50],
          iconAnchor: [25, 60],
          iconUrl: 'assets/mapmarker.png'
        })
      }
    );

    this.layersControl = [];
    this.layersControl.push(markerCidade);
  }


  private verificaSeExisteInformação(boaPratica: BoaPraticaDetalhe) {
    if (boaPratica.objetivoGeral !== null && boaPratica.objetivoGeral !== '') {
      this.objetivoGeralVazio = false;
    }
    if (boaPratica.objetivoEspecifico !== null && boaPratica.objetivoEspecifico !== '') {
      this.objetivosEspecificosVazio = false;
    }
    if (boaPratica.principaisResultados !== null && boaPratica.principaisResultados !== '') {
      this.principaisResultadosVazio = false;
    }
    if (boaPratica.aprendizadoFundamental !== null && boaPratica.aprendizadoFundamental !== '') {
      this.umAprendizadoFundamentalVazio = false;
    }
    if (boaPratica.parceirosEnvolvidos !== null && boaPratica.parceirosEnvolvidos !== '') {
      this.parceirosEnvolvidosVazio = false;
    }
    if (boaPratica.publicoAtingido !== null && boaPratica.publicoAtingido !== '') {
      this.publicoAtingidoVazio = false;
    }
    if (boaPratica.resultadosQuantitativos !== null && boaPratica.resultadosQuantitativos !== '') {
      this.resultadosQuantitativosVazio = false;
    }
    if (boaPratica.resultadosQualitativos !== null && boaPratica.resultadosQualitativos !== '') {
      this.resultadosQualitativosVazio = false;
    }
    if (boaPratica.parametrosContemplados !== null && boaPratica.parametrosContemplados !== '') {
      this.parametrosContempladosVazio = false;
    }
    if (boaPratica.fontesReferencia !== null && boaPratica.fontesReferencia !== '' || boaPratica.fontesReferencia.length > 0) {
      this.fontesDeReferenciaVazio = false;
    }
    if (boaPratica.galeriaDeVideos !== null && boaPratica.galeriaDeVideos.length > 0 && boaPratica.galeriaDeVideos[0] !== '') {
      this.galeriaDeVideosVazio = false;
    }
    if (boaPratica.galeriaDeImagens !== null) {
      if (boaPratica.galeriaDeImagens.length > 0) {
        this.galeriaDeImagensVazio = false;
      }
    }
    if (boaPratica.informacoesComplementares !== null && boaPratica.informacoesComplementares !== '') {
      this.informacoesComplementaresVazio = false;
    }
    if (boaPratica.solucoes !== null && boaPratica.solucoes.length > 0) {
      this.solucoesVazio = false;
    }

  }

  // BUSCA BOA PRÁTICA POR ID

  async buscarBoaPratica() {
    this.loading = true;
    await this.activatedRoute.params.subscribe(async (params) => {
      const id = params.id;
      if (id) {
        await this.boaPraticaService.buscarBoaPrticaDetalhe(id).subscribe(response => {
          this.boaPratica = response as BoaPraticaDetalhe;
          this.verificaSeExisteInformação(this.boaPratica);

          if (this.boaPratica.imagemPrincipal && this.boaPratica.imagemPrincipal.conteudo) {
            this.boaPratica.imagemPrincipal.safeUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + this.boaPratica.imagemPrincipal.conteudo);
          }

          if (response.galeriaDeImagens) {
            this.prepararGaleriaImagem(response.galeriaDeImagens);
          }

          if (response.galeriaDeVideos) {
            this.prepararGaleriaVideo(response.galeriaDeVideos);
          }

          if (this.boaPratica != null && this.boaPratica.idCidade) {
            this.cidadeService.buscarCidadePorId(this.boaPratica.idCidade).subscribe(response => {
              this.cidadeSelecionada = response as CidadeDetalhe;
              this.map.panTo(new latLng(this.cidadeSelecionada.latitude, this.cidadeSelecionada.longitude));
              this.addMarkerOnMap(this.cidadeSelecionada.latitude, this.cidadeSelecionada.longitude);
            });
          }

          this.titleService.setTitle(`${this.boaPratica.titulo} - Cidades Sustentáveis`);

          const config = {
            title: this.boaPratica.titulo,
            description: this.boaPratica.subtitulo,
            twitterImage: `${environment.APP_URL}boapratica/imagem/` + this.boaPratica.id,
            image: `${environment.APP_URL}boapratica/imagem/${this.boaPratica.id}`,
            slug: '',
            site: 'Cidades Sustentáveis',
            url: `${environment.APP_URL}boaspraticas/detalhes/${this.boaPratica.id}`
          };
          this.seoService.generateTags(config);

          this.loading = false;
        }, error => { this.router.navigate(['/institucional']); });

        this.carregarDadosOds(id);

      } else {
        this.router.navigate(['/institucional']);
      }
    }, error => { this.router.navigate(['/institucional']); });
  }


  public salvarHistorico(redeSocial: string) {
    this.historicoCompartilhamentoService.gerarHistoricoCompartilhamento(redeSocial, 'BOA_PRATICA').subscribe(() => {
    });
  }


  public baixarArquivo(idArquivo: number) {
    this.boaPraticaService.buscarArquivoPorId(idArquivo).subscribe(
      res => {
        saveAs(this.b64toBlob(res.conteudo), res.nomeArquivo);
      }
    );
  }


  private b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
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


  private async carregarDadosOds(idBoaPratica: number) {
    await this.boaPraticaService.buscarOdsDaBoaPratica(idBoaPratica).subscribe(response => {
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


  public getImagePathBoaPratica(boaPratica: any): string {
    if (boaPratica == undefined) {
      return '/';
    }
    return `${environment.API_URL}boapratica/imagem/` + boaPratica.id;
  }

}
