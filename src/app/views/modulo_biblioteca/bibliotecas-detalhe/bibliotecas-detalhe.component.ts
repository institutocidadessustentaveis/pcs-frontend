import * as L from 'leaflet';
import "leaflet.markercluster";
import { geoJSON, circleMarker} from 'leaflet';
import { Arquivo } from './../../../model/arquivo';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { Component, OnInit, ElementRef, OnChanges } from '@angular/core';
import { CidadeService } from 'src/app/services/cidade.service';
import { FiltroBiblioteca } from 'src/app/model/filtroBiblioteca';
import { SeoService } from 'src/app/services/seo-service.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { BibliotecaDetalhe } from 'src/app/model/bibliotecaDetalhe';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { BibliotecaService } from 'src/app/services/bibliotecaService';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { Title, DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { Video } from '../../modulo_boas_praticas/boas-praticas/boa-pratica-form/boas-praticas-form.component';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownload } from 'src/app/model/dados-download';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { HistoricoCompartilhamentoService } from 'src/app/services/historico-compartilhamento.service';

declare var $;

export interface Audio {
  url: string;
  safeUrl: SafeResourceUrl;
}

@Component({
  selector: 'app-bibliotecas-detalhe',
  templateUrl: './bibliotecas-detalhe.component.html',
  styleUrls: ['./bibliotecas-detalhe.component.css']
})
export class BibliotecasDetalheComponent implements OnInit {
  public areasInteresse: any;
  public galeriaDeVideosVazio = true;
  public biblioteca: BibliotecaDetalhe;
  public galeriaDeVideos: Video[] = [];
  public galeriaDeAudios: Audio[] = [];
  public mediaSource = new MediaSource();

  idBiblioteca: number = null;
  public BASE64_MARKER = ';base64,';

  public formFiltro: FormGroup;
  public ultimasPublicacoes = [];
  public url = environment.API_URL;
  public modulos: Array<string> = [];
  public esconderMapa: boolean = true;
  public urlAPI = environment.API_URL;
  public permitirBuscaAvancada = false;
  public odsCombo: Array<ItemCombo> = [];
  public urlatual = window.location.href;
  public eixosCombo: Array<ItemCombo> = [];
  public indicadoresCombo: Array<any> = [];
  public paisesCombo: Array<ItemCombo> = [];
  public cidadesCombo: Array<ItemCombo> = [];
  public metasOdsCombo: Array<ItemCombo> = [];
  public provinciaEstadoCombo: Array<ItemCombo> = [];
  public areasInteresseCombo: Array<AreaInteresse> = [];
  public filtroBiblioteca: FiltroBiblioteca = new FiltroBiblioteca();
  scrollUp: any;

  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  public estaLogado: boolean = false
  public urlDownload = '';

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
    })
  };

  public options = {
    zoom: 4,
    zoomControl: false,
    gestureHandling: false,
    scrollWheelZoom: false,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: L.latLng([-15.03144, -53.09227]),
    layers: [this.baseLayers.Mapa]
  };

  public loading = false;

  markerClusters: any;

  private map;

  layerControl = null;

  stylelayer = {
    defecto: {
        color: '#3388ff',
        weight: 0,
        fillOpacity: .5,
        strokeOpacity: 0.5
    },
    highlight: {
        weight: 5,
        color: '#0D8BE7',
        dashArray: '',
        fillOpacity: 0.7
    },
    selected: {
        color: '#0D8BE7',
        weight: 4,
        fillOpacity: .9,
        strokeOpacity: 1
    }

  };

  constructor(

    private router: Router,
    private dialog: MatDialog,
    private element: ElementRef,
    private titleService: Title,
    private route: ActivatedRoute,
    private seoService: SeoService,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private domSanitizer: DomSanitizer,
    private cidadeService: CidadeService,
    private usuarioService: UsuarioService,
    private shapeFileService: ShapeFileService,
    public domSanitizationService: DomSanitizer,
    private bibliotecaService: BibliotecaService,
    private indicadoresService: IndicadoresService,
    private dadosDownloadService: DadosDownloadService,
    private provinciaEstadoService: ProvinciaEstadoService,
    private metaOdsService: ObjetivoDesenvolvimentoSustentavelService,
    private historicoCompartilhamentoService: HistoricoCompartilhamentoService,
  ) {

    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.formFiltro = this.formBuilder.group({
      idOds: [null],
      modulo: [null],
      idEixo: [null],
      idPais: [null],
      idCidade: [null],
      idMetasOds: [null],
      idIndicador: [null],
      palavraChave: [null],
      idAreaInteresse: [null],
      idProvinciaEstado: [null],
    });
    this.route.queryParams.subscribe(params => {
      this.formFiltro.controls.palavraChave.setValue(params.palavraChave);
      this.formFiltro.controls.idAreaInteresse.setValue(params.areaInteresse);
      this.formFiltro.controls.idEixo.setValue(params.eixo);
      this.formFiltro.controls.idIndicador.setValue(params.indicador);
      this.formFiltro.controls.idOds.setValue(params.ods);
      this.formFiltro.controls.idMetasOds.setValue(params.metaOds);
      this.formFiltro.controls.idPais.setValue(params.pais);
      this.formFiltro.controls.idProvinciaEstado.setValue(params.estado);
      this.formFiltro.controls.idCidade.setValue(params.cidade);
      this.formFiltro.controls.modulo.setValue(params.modulo);

    });

    this.modulos = [
      'Eventos',
      'Notícias',
      'Biblioteca',
      'Capacitação',
      'Indicadores',
      'Boas Práticas',
      'Financiamento',
      'Institucional',
      'Participação Cidadã',
      'Contribuições Privadas',
      'Planejamento Integrado',
      'Contribuições Acadêmicas',
      'Plano, Leis e Regulamentações',
    ]
   }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.idBiblioteca = parseInt(params.get('idBiblioteca'), 10);
      this.buscarBibliotecaPorId(this.idBiblioteca);
    })
    this.carregarSelectJaComValor();
    this.carregarUltimasBibliotecas();
    this.carregarCombos();

  }

  public salvarLogCompartilhamento (redeSocial: string) {
    this.historicoCompartilhamentoService.gerarHistoricoCompartilhamento(redeSocial, 'Biblioteca').subscribe(res => {})
  }

  public onMapReady(map) {
    this.map = map;

    this.layerControl = L.control.layers(null, null, {
      collapsed: false}).addTo(map);

  }

  private async prepararListaShapeFiles(shapeFiles: number[]) {
    this.loading = true;

    const shapes = await this.shapeFileService.buscarShapesListagemMapa().toPromise();
    let firstDefault = true;

    for (const shapeid of shapeFiles) {
      let featureGroup = L.featureGroup();
      const shape =  shapes.find(x=> x.id === shapeid);
      this.shapeFileService.buscarFeaturesPorShapeId(shapeid).subscribe((resp) => {
        this.adicionarShapesLayersMerged(featureGroup, resp);
        this.layerControl.addOverlay(featureGroup, shape.nome);
        if (firstDefault) {
          featureGroup.addTo(this.map);
          firstDefault = false;
        }
      });
    }
    this.loading = false;
  }

  private adicionarShapesLayersMerged(featureGroup: any, features: any[]) {
    if (features) {
      this.esconderMapa = false;
      let markerClusters = L.markerClusterGroup({
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
            iconSize: new L.Point(30, 30)
          });
        },
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
      });

      features.forEach(feature => {
        if (feature.geometry.type == 'Point' && feature.properties.radius != undefined) {
          const circle = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], { radius: feature.properties.radius });
          circle.setStyle(this.stylelayer.defecto);
          circle.bindPopup(this.propriedadesToString(feature.properties));
          circle.on('mouseover', (e) => {
          e.target.openPopup();
          });
          circle.on('mouseout', (e) => {
            e.target.closePopup();
          });
          circle.addTo(featureGroup);
        } else if (feature.geometry.type == 'Point' && feature.properties.radius == undefined) {
          let options = {
            radius: 10,
            fillColor: "#E02020",
            color: "#C04040",
            fillOpacity: 0.75,
            weight: 1
          };
          let marker: circleMarker = circleMarker(
            [feature.geometry.coordinates[1], feature.geometry.coordinates[0]], options,
            options
          );

          marker.bindPopup(this.propriedadesToString(feature.properties));
          marker.on('mouseover', (e) => {
            e.target.openPopup();
          });
          marker.on('mouseout', (e) => {
            e.target.closePopup();
          });

          markerClusters.addLayer(marker);
          markerClusters.addTo(featureGroup);
        } 
         else if(feature.geometry.type == 'MultiPoint' && feature.geometry.coordinates[0][1] && feature.geometry.coordinates[0][0]){           
          let options = {
            radius: 10,
            fillColor: "#E02020",
            color: "#C04040",
            fillOpacity: 0.75,
            weight: 1
          };
          let marker: circleMarker = circleMarker(
            [feature.geometry.coordinates[0][1], feature.geometry.coordinates[0][0]], options,
            options
          );

          marker.bindPopup(this.propriedadesToString(feature.properties));
          marker.on('mouseover', (e) => {
            e.target.openPopup();
          });
          marker.on('mouseout', (e) => {
            e.target.closePopup();
          });

          markerClusters.addLayer(marker);
          markerClusters.addTo(featureGroup);
        }
          else { 
          const optionsShapes = {
            color: '#000022',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
          };

          const options = $.extend(optionsShapes, feature.properties);
          const geoJson = geoJSON([feature], options);
          geoJson.setStyle(this.stylelayer.defecto);

          geoJson.bindPopup(this.propriedadesToString(feature.properties));

          geoJson.on('mouseover', (e) => {
            e.target.openPopup();
          });

          geoJson.on('mouseout', (e) => {
            e.target.closePopup();
          });

          geoJson.addTo(featureGroup);
        }
      });
    }
  }

  private propriedadesToString(properties: any): string {
    let aux = '';
    for (const proper in properties) {
      if (properties.hasOwnProperty(proper)) {
        const element = properties[proper];
        aux = aux + proper + ' : ' + element + ' <br> ';
      }
    }
    return aux;
  }

  public getImagePath(id: number): string {
    if (id == null) {
      return "/";
    }

    return `${environment.API_URL}biblioteca/imagem/` + id;
  }

  public gerarLinkImagem(ods: ObjetivoDesenvolvimentoSustentavel) {
    return `${environment.API_URL}ods/imagem/${ods.id}`;
  }

  public buscarBibliotecaPorId(idBiblioteca: number) {
    this.loading = true;
    this.bibliotecaService.buscarBibliotecaDetalhesPorId(idBiblioteca).subscribe(res => {  
      
      this.biblioteca = res as BibliotecaDetalhe;     
      if (this.biblioteca.galeriaDeVideos !== null && this.biblioteca.galeriaDeVideos.length > 0 && this.biblioteca.galeriaDeVideos[0] !== '') {
        this.galeriaDeVideosVazio = false;
      }
      if (this.biblioteca.galeriaDeVideos) {
        this.prepararGaleriaVideo(this.biblioteca.galeriaDeVideos);
      }
      if (this.biblioteca.galeriaDeAudios) {
        this.prepararGaleriaAudio(this.biblioteca.galeriaDeAudios);
      }
      if (this.biblioteca.shapeFiles) {               
        this.prepararListaShapeFiles(this.biblioteca.shapeFiles);
      }
      this.titleService.setTitle(`${this.biblioteca.tituloPublicacao} - Cidades Sustentáveis`);

      const config = {
        title: this.biblioteca.tituloPublicacao,
        description: this.biblioteca.subtitulo,
        twitterImage: `${environment.APP_URL}bibliotecas/imagem/` + this.biblioteca.id,
        image:  `${environment.APP_URL}bibliotecas/imagem/` + this.biblioteca.id,
        slug: '',
        site: 'Cidades Sustentáveis' ,
        url: `${environment.APP_URL}bibliotecas/detalhe/${this.biblioteca.id}`
      };
      this.seoService.generateTags(config);
      
      if(this.authService.isAuthenticated()) {
        this.getUsuarioLogadoDadosDownloadBiblioteca();
      }

      this.loading = false;
    });
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

  private prepararGaleriaAudio(audios: Array<Arquivo>) {

    for (const audio of audios) {
      if (audio) {
        let audioUrl = audio.extensao + ',' + audio.conteudo;
        this.galeriaDeAudios.push({
          url: audioUrl,
          safeUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(audioUrl)
        });
      }
    }
  }
  public carregarCombos() {
    this.bibliotecaService.carregarCombosBiblioteca().subscribe(response => {
      this.paisesCombo = response.listaPaises as ItemCombo[];
      this.areasInteresseCombo = response.listaAreasInteresse as AreaInteresse[];
      this.eixosCombo = response.listaEixos as ItemCombo[];
      this.odsCombo = response.listaOds as ItemCombo[];
    });
  }

  public carregarSelectJaComValor() {
    if (this.formFiltro.controls.idOds.value) {
      this.metaOdsService.buscarMetaOdsPorIdOdsItemCombo(this.formFiltro.controls.idOds.value).subscribe(res => {
        this.metasOdsCombo = res as ItemCombo[];
      });
    }

    if (this.formFiltro.controls.idPais.value) {
      this.provinciaEstadoService.buscarProvinciaEstadoComboPorPais(this.formFiltro.controls.idPais.value).subscribe(res => {
        this.provinciaEstadoCombo = res as ItemCombo[];
      });
    }

    if (this.formFiltro.controls.idProvinciaEstado.value) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(this.formFiltro.controls.idProvinciaEstado.value).subscribe(res => {
        this.cidadesCombo = res as ItemCombo[];
      });
    }

    if (this.formFiltro.controls.idEixo.value) {
      this.indicadoresService.buscarIndicadoresPorIdEixoItemCombo(this.formFiltro.controls.idEixo.value).subscribe(res => {
        this.indicadoresCombo = res as ItemCombo[];
      });
    }

  }

  public onPaisChange(event: any) {
    if (event.value) {
    this.provinciaEstadoService.buscarProvinciaEstadoComboPorPais(event.value).subscribe(res => {
      this.provinciaEstadoCombo = res as ItemCombo[];
    });
  }

    this.provinciaEstadoCombo = [];
    this.cidadesCombo = [];
  }

  onEstadoChange(event: any) {
    if (event.value) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(event.value).subscribe(res => {
        this.cidadesCombo = res as ItemCombo[];
      });
    }

    this.cidadesCombo = [];
  }

  onEixoChange(event: any) {
    if (!event && this.formFiltro.controls.idEixo.value) {
      this.indicadoresService.buscarIndicadoresPorIdEixoItemCombo(this.formFiltro.controls.idEixo.value).subscribe(res => {
        this.indicadoresCombo = res as ItemCombo[];
      });
    }

    if (!event && !this.formFiltro.controls.idEixo.value) {
      this.indicadoresCombo = [];
    }
  }

  onOdsChange(event: any) {
    if (!event && this.formFiltro.controls.idOds.value) {
      this.metaOdsService.buscarMetaOdsPorIdOdsItemCombo(this.formFiltro.controls.idOds.value).subscribe(res => {
        this.metasOdsCombo = res as ItemCombo[];
      });
    }

    if (!event && !this.formFiltro.controls.idOds.value) {
      this.metasOdsCombo = [];
    }
  }

  mostrarBuscaAvancada() {
    this.permitirBuscaAvancada = true;
    const el = document.getElementById('secao-filtro');
    el.scrollIntoView();
  }

  fecharBuscaAvancada() {
    this.permitirBuscaAvancada = false;
    this.formFiltro.controls.idOds.setValue(null);
    this.formFiltro.controls.idPais.setValue(null);
    this.formFiltro.controls.idEixo.setValue(null);
    this.formFiltro.controls.modulo .setValue(null);
    this.formFiltro.controls.idCidade.setValue(null);
    this.formFiltro.controls.idMetasOds.setValue(null);
    this.formFiltro.controls.idIndicador.setValue(null);
    this.formFiltro.controls.palavraChave.setValue(null);
    this.formFiltro.controls.idAreaInteresse.setValue(null);
    this.formFiltro.controls.idProvinciaEstado.setValue(null);
    const el = document.getElementById('carousel');
    el.scrollIntoView();
  }

  carregarUltimasBibliotecas() {
    this.bibliotecaService.idBibliotecasOrdenadas().subscribe(res => {
      let lista = res;
      if (lista.length > 5) {
        lista = lista.slice(0, 5);
      }
      lista.forEach(item => {
        this.bibliotecaService.buscarBibliotecaPorId(item.id).subscribe(itemBiblioteca => {
          if (itemBiblioteca.autor.length > 40 ) {
            itemBiblioteca.autor = `${itemBiblioteca.autor.slice(0, 37)}...`;
          }
          if (itemBiblioteca.tituloPublicacao.length > 50 ) {
            itemBiblioteca.tituloPublicacao = `${itemBiblioteca.tituloPublicacao.slice(0, 47)}...`;
          }
          this.ultimasPublicacoes.push(itemBiblioteca);
        });
      });
    });
  }
  buscarBibliotecas(){
    this.filtroBiblioteca.palavraChave = this.formFiltro.controls.palavraChave.value;
    this.filtroBiblioteca.palavraChave =  this.formFiltro.controls.palavraChave.value;
    this.filtroBiblioteca.idAreaInteresse =  this.formFiltro.controls.idAreaInteresse.value;
    this.filtroBiblioteca.idEixo =  this.formFiltro.controls.idEixo.value;
    this.filtroBiblioteca.idIndicador =  this.formFiltro.controls.idIndicador.value;
    this.filtroBiblioteca.idOds =  this.formFiltro.controls.idOds.value;
    this.filtroBiblioteca.idMetasOds =  this.formFiltro.controls.idMetasOds.value;
    this.filtroBiblioteca.idPais =  this.formFiltro.controls.idPais.value;
    this.filtroBiblioteca.idProvinciaEstado =  this.formFiltro.controls.idProvinciaEstado.value;
    this.filtroBiblioteca.idCidade =  this.formFiltro.controls.idCidade.value;
    this.filtroBiblioteca.modulo =  this.formFiltro.controls.modulo.value;

    this.router.navigate(['/biblioteca'], {queryParams: {
      palavraChave: this.filtroBiblioteca.palavraChave,
      areaInteresse: this.filtroBiblioteca.idAreaInteresse,
      eixo: this.filtroBiblioteca.idEixo,
      indicador: this.filtroBiblioteca.idIndicador,
      ods: this.filtroBiblioteca.idOds,
      metaOds : this.filtroBiblioteca.idMetasOds,
      pais: this.filtroBiblioteca.idPais,
      estado: this.filtroBiblioteca.idProvinciaEstado,
      cidade: this.filtroBiblioteca.idCidade,
      modulo: this.filtroBiblioteca.modulo,
    }});
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}img-deafult-publicacao.png`
  }

  public downloadBiblioteca(){
    window.open(`${this.url}biblioteca/download/${this.biblioteca.id}`, "_blank");
  }

  public validacaoDownloadBiblioteca(){
    if(this.authService.isAuthenticated()) { 
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadBiblioteca();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Arquivos de Biblioteca';
      this.dadosDownload.pagina = this.biblioteca.tituloPublicacao;
      this.dadosDownload.arquivo = `Arquivos da Biblioteca ${this.biblioteca.tituloPublicacao}`;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadBiblioteca();
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Arquivos de Biblioteca",
      pagina: "this.biblioteca.tituloPublicacao",
      arquivo: `Arquivos da Biblioteca ${this.biblioteca.tituloPublicacao}`
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.downloadBiblioteca();
      }
    });
    }
  }

  public getUsuarioLogadoDadosDownloadBiblioteca(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
    this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Arquivos de Biblioteca';
    this.dadosDownload.pagina = this.biblioteca.tituloPublicacao;
    this.dadosDownload.arquivo = `Arquivos da Biblioteca ${this.biblioteca.tituloPublicacao}`;
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

}
