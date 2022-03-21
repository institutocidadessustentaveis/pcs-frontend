import { Component, OnInit, ElementRef } from '@angular/core';
import { Cidade } from 'src/app/model/cidade';
import { CidadeService } from 'src/app/services/cidade.service';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { PaisService } from 'src/app/services/pais.service';
import { Pais } from 'src/app/model/pais';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import { SubDivisao } from 'src/app/model/SubDivisao';
import { MatTableDataSource } from '@angular/material';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Arquivo } from 'src/app/model/arquivo';

import * as L from 'leaflet';
import { latLng, tileLayer, circleMarker, marker, icon } from 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { ImagemBoaPratica } from 'src/app/model/imagem-boa-pratica';
import { DomSanitizer } from '@angular/platform-browser';
import { CurrencyPipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ShapeFile } from 'src/app/model/shapeFile';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
declare var $;


export interface ProvinciaEstadoDTO {
  id?: Number;
  nome: string;
}

export interface PaisDTO {
  id?: Number;
  nome: string;
  provinciaEstado: Array<ProvinciaEstadoDTO>;
}

@Component({
  selector: 'app-cidade-form',
  templateUrl: './cidade-form.component.html',
  styleUrls: ['./cidade-form.component.css']
})

export class CidadeFormComponent implements OnInit {

  public fotoCidade: ImagemBoaPratica = new ImagemBoaPratica();

  public cidade: Cidade = new Cidade();
  subdivisao = new SubDivisao();
  displayedColumns = ['nome', 'remover'];
  dataSource = new MatTableDataSource<SubDivisao>();
  exibeCampos = false;

  public shapeFile: ShapeFile = new ShapeFile();
  public arquivoShp: File;
  public arquivoDbf: File;
  public arquivoShx: File;
  public arquivosCarregados: Array<string> = [];

  public usuarioLogado: Usuario = new Usuario();
  public nomePerfil: string[] = [];

  private importFeatureGroup = L.featureGroup();

  paisesCombo: Array<PaisDTO> = new Array<PaisDTO>();
  provinciaEstadoCombo: Array<ProvinciaEstadoDTO> = new Array<ProvinciaEstadoDTO>();
  paisEscolhido: number;
  estadoEscolhido: number;
  arquivo = new Arquivo();
  loading: any;

  map: L.Map;

  provider = new OpenStreetMapProvider();

  latitudeSelecionada: number;
  longitudeSelecionada: number;

  termoCidadeBusca: string = '';

  loadingBuscaCidade: boolean = false;

  options = {
    layers: [
      tileLayer(environment.MAP_TILE_SERVER, {
                detectRetina: true,
                attribution: environment.MAP_ATTRIBUTION,
                noWrap: true,
                minZoom: 2
      })
    ],
    zoom: 10,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([ -15.03144, -53.09227 ])
  }

  layersControl = [
    circleMarker([ -15.03144, -53.09227], { radius: 10, fillColor: 'red', color: 'red', fillOpacity: 1, weight: 1 })
  ]
  scrollUp: any;

  constructor(public cidadeService: CidadeService, public paisService: PaisService,
              public activatedRoute: ActivatedRoute, public router: Router,
              public provinciaEstadoService: ProvinciaEstadoService,
              private shapeFileService: ShapeFileService,
              private usuarioService: UsuarioService,
              private element: ElementRef,
              public domSanitizer: DomSanitizer) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
  }

  ngOnInit() {
    this.buscarUsuarioLogado();
    this.carregarComboPaises();
    this.cidade.latitude = -15.03144
    this.cidade.longitude = -53.09227
  }

  buscarUsuarioLogado() {
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuarioLogado = usuario as Usuario;
      this.nomePerfil = this.usuarioLogado.nomePerfil.split(' | ');
    });
  }

  private buscarCidade(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.exibeCampos = true;
        this.cidadeService.buscarCidadeEdicao(id).subscribe(response => {
          this.cidade = response;
          this.paisEscolhido = this.cidade.provinciaEstado.pais.id;
          this.estadoEscolhido = this.cidade.provinciaEstado.id;
          this.provinciaEstadoCombo = this.paisesCombo.find(x => x.id === this.cidade.provinciaEstado.pais.id).provinciaEstado;
          this.dataSource = new MatTableDataSource(this.cidade.subdivisoes);

          if(this.cidade.fotoCidade != null) {
            this.fotoCidade.conteudo = this.cidade.fotoCidade;
            this.fotoCidade.safeUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + this.cidade.fotoCidade);
          }

          if (this.cidade.populacao != null) {
            const populacaoFormatado: any =  this.cidade.populacao.toLocaleString('pt-BR');
            this.cidade.populacao = populacaoFormatado;
          }

          this.addMarkerOnMap(this.cidade.latitude, this.cidade.longitude)
          this.map.setView([this.cidade.latitude, this.cidade.longitude]);

          this.exibirShapeFileVetorial(this.cidade.shapeZoneamento);
        });
      }
    });
  }


  salvar() {

    if (this.cidade.populacao) {
      let populacao = String(this.cidade.populacao);
      populacao = populacao.split('.').join('');
      this.cidade.populacao = Number(populacao);
    }


    if (this.cidade.id) {
      this.editarCidade();
      if (this.verificaArquivosVetorial()) {
        this.salvarVetorial();
       }
    } else {
      this.cadastrarCidade();
    }
  }

  private verificaArquivosVetorial(): boolean  {
    if (!this.arquivoShp) {
      return false;
    } else if (!this.arquivoDbf) {
      return false;
    } else if (!this.arquivoShx) {
      return false;
    } else {
      return true;
    }
  }

  private salvarVetorial() {
    this.loading = true;

    this.shapeFileService.editarShape(this.arquivoShp, this.arquivoDbf, this.arquivoShx, this.cidade).subscribe(response => {
      if(response['shapePertenceAPrefeitura'] && !response['temIntersecacoNaAreaDaPrefeitura']) {
        this.mostrarAlertaShapeForaDoMunicipio();
      } else {
        this.mostrarAlertaShapeSalvo();
      }

      this.loading = false;
    }, error => {
      this.loading = false;
      PcsUtil.swal().fire('Não foi possível cadastrar essa camada', `${error.error.message}`, 'error');
    });
  }

  public mostrarAlertaShapeForaDoMunicipio() {
    PcsUtil.swal().fire({
      title: 'Cidade',
      text: `Cidade ${this.cidade.nome} salva, o Shape foi salvo, porém se encontra fora dos limites do município.`,
      type: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then(() => {
      this.loading = false;
    });
  }

  public mostrarAlertaShapeSalvo() {
    PcsUtil.swal().fire({
      title: 'Cidade',
      text: `Cidade ${this.cidade.nome} e Shape Files atualizados com sucesso.`,
      type: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
      this.router.navigate(['/cidade']);
      this.loading = false;
    }, error => {this.loading = false; });
  }

  private insertEstadoPais() {
    const estado: ProvinciaEstado = new ProvinciaEstado();
    estado.id = this.estadoEscolhido;
    this.cidade.provinciaEstado = estado;
  }

  public cadastrarCidade(): void {
    this.insertEstadoPais();
    this.cidadeService.cadastrar(this.cidade).subscribe(response => {
        PcsUtil.swal().fire({
          title: 'Cidade',
          text: `Cidade ${this.cidade.nome} cadastrada.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/cidade']);
        }, error => { });
    });
  }

  editarCidade() {
    this.insertEstadoPais();
    this.cidadeService.editar(this.cidade).subscribe(response => {
      if (!this.verificaArquivosVetorial()) {
        PcsUtil.swal().fire({
          title: 'Cidade',
          text: `Cidade ${this.cidade.nome} atualizada.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/cidade']);
        });
      }
    });
  }

  carregarComboPaises() {
    this.paisService.buscarTodosPaisEstado().subscribe(response => {
      this.paisesCombo = response;
      this.paisesCombo = response as Array<PaisDTO>;
      this.buscarCidade();
    });
  }

  async paisSelecionado(event: any) {
     this.provinciaEstadoCombo = this.paisesCombo.find(x => x.id === event).provinciaEstado;
  }

  changeEstado(event: number) {
    this.estadoEscolhido = event;
  }

  adicionarSubdivisao(event: any) {
    if (this.cidade.subdivisoes.length < 2) {
      this.cidade.subdivisoes.push(this.subdivisao);
      this.dataSource = new MatTableDataSource(this.cidade.subdivisoes);
      this.subdivisao = new SubDivisao();
    } else {
      PcsUtil.swal().fire({
        title: 'Cidade',
        text: `Maximo de duas Subdivisões por cidade!`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
    }
  }

  deletarSubdivisao(event: any) {
    this.cidade.subdivisoes.splice(this.cidade.subdivisoes.indexOf(event), 1);
    this.dataSource = new MatTableDataSource(this.cidade.subdivisoes);
  }

  onMapReady(map: L.Map) {
    this.map = map;

    this.importFeatureGroup.addTo(map);

    map.on('click', (e) => {
      this.addMarkerOnMap(e.latlng.lat, e.latlng.lng);

      this.cidade.latitude = e.latlng.lat;
      this.cidade.longitude = e.latlng.lng;
    });
  }

  addMarkerOnMap(latitude: number, longitude: number) {
    let options = { radius: 10, fillColor: 'red', color: 'red', fillOpacity: 1, weight: 1 }
    let marker: circleMarker = circleMarker([ latitude, longitude], options)

    this.layersControl = []
    this.layersControl.push(marker)
  }

  latitudeChange(newValue) {
    this.addMarkerOnMap(newValue, this.cidade.longitude);
    this.map.setView([newValue, this.cidade.longitude]);
  }

  longitudeChange(newValue) {
    this.addMarkerOnMap(this.cidade.latitude, newValue);
    this.map.setView([this.cidade.latitude, newValue]);
  }

  public processImage(eventInput: any) {
      this.loading = true;
      const reader = new FileReader();
      reader.readAsDataURL(eventInput.target.files[0]);
      reader.onload = () => {

        this.arquivo.nomeArquivo = eventInput.target.files[0].name;
        this.arquivo.extensao = reader.result.toString().split(',')[0];
        this.arquivo.conteudo = reader.result.toString().split(',')[1];

        if (PcsUtil.tamanhoArquivoEstaDentroDoLimite(reader.result.toString().split(',')[1])) {

          const file: File = eventInput.target.files[0];
          const reader = new FileReader();
          reader.onload = this._handleReaderLoadedPrincipal.bind(this);
          reader.readAsBinaryString(file);

          } else {
          PcsUtil.swal().fire({
            title: 'Cadastro de Cidade',
            text: `Arquivo excede o tamanho limite de 10 MB`,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
          }, error => { });
        }

      };
      this.loading = false;
  }

  _handleReaderLoadedPrincipal(readerEvt) {
    this.fotoCidade = new ImagemBoaPratica();
    this.fotoCidade.conteudo = btoa(readerEvt.target.result);
    this.fotoCidade.safeUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + this.fotoCidade.conteudo);
    this.cidade.fotoCidade = this.fotoCidade.conteudo;
  }

  public deletarFotoCidade() {
    this.fotoCidade = new ImagemBoaPratica();
    this.cidade.fotoCidade = '';
    this.fotoCidade.conteudo = '';
  }

  buscarCidadeMapa() {
    if (this.termoCidadeBusca !== '') {
      this.loadingBuscaCidade = true;

      this.provider.search({query: this.termoCidadeBusca}).then((resultados) => {
        if(resultados.length > 0) {
          this.limparMapa();

          this.desenharMarcadoresCidadesEncontradas(resultados)

          this.focarPonto(resultados[0]['y'], resultados[0]['x']);

          this.loadingBuscaCidade = false;
        } else {
          PcsUtil.swal().fire({
            title: 'Não foi possível encontrar nenhuma cidade',
            text: `Não foi possível encontrar localidades chamadas '${this.termoCidadeBusca}'. Verifique a grafia e tente novamente.`,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
          }, error => { });

          this.loadingBuscaCidade = false;
        }
      });
    }
  }

  private desenharMarcadoresCidadesEncontradas(cidades: any[]) {
    if(cidades == undefined) {
      return;
    }

    for(let i = 0; i < cidades.length; i++) {
      let cidade = cidades[i];

      let options = { radius: 10, fillColor: 'green', color: 'green', fillOpacity: 1, weight: 1 }
      let point: circleMarker = circleMarker([ cidade['y'], cidade['x'] ], options);

      point.bindPopup(`<strong>${cidade.label}</strong>
                      <p>
                        <strong>Coordenadas:</strong>
                        <span>${cidade.y}, ${cidade.x}</span>
                      </p>`);

      point.on('click', () => {
        this.selecionarCidadeBusca(cidade['y'], cidade['x']);
        this.termoCidadeBusca = "";
      })

      point.on('mouseover', (e) => {
        e.target.openPopup();
      })

      point.on('mouseout', (e) => {
        e.target.closePopup();
      })

      this.layersControl.push(point)
    }
  }

  public selecionarCidadeBusca(lat: number, long: number) {
    this.addMarkerOnMap(lat, long);

    this.cidade.latitude = lat;
    this.cidade.longitude = long;
  }

  private limparMapa() {
    this.layersControl = [];
  }

  private focarPonto(lat: number, long: number) {
    this.map.panTo(new L.LatLng(lat, long));

    setTimeout(() => {
      this.map.setZoomAround(new L.LatLng(lat, long), 4);
    }, 300);
  }

  public carregarArquivoVetorial(event) {
    this.arquivosCarregados = [];
    const arquivosCarregados = event.target.files;
    for (const arquivo of arquivosCarregados) {
      this.arquivosCarregados.push(arquivo.name);
      this.atualizarArquivosVetorial(arquivo);
    }
  }

  private atualizarArquivosVetorial(arquivo: File) {
    if (arquivo.name.includes('.shp')) {
      this.arquivoShp = arquivo;
    } else if (arquivo.name.includes('.dbf')) {
      this.arquivoDbf = arquivo;
    } else if (arquivo.name.includes('.shx')) {
      this.arquivoShx = arquivo;
    }
    
  }

  podeEditarShape() {

    if (this.nomePerfil.includes('Administrador') && this.exibeCampos) {
      return true;
    }
    return false;
  }

  private exibirShapeFileVetorial(features: Array<any>) {
    let _this = this;
    features.map(feature => {
      if (feature.geometry.type == 'MultiPolygon') {
        const optionsStyle = {
          color: '#666666',
          fillColor : '#c0c3ac',
          weight: 0,
          fillOpacity: .5,
          strokeOpacity: 0.5,
          fill : true,
        };
        const propriedades = feature.properties;
        feature.geometry.coordinates.forEach(function(shapeCoords, i) {
          const polygon = {type: 'Polygon', coordinates: shapeCoords};
          L.geoJson(polygon, {
            onEachFeature(feature, layer) {
              layer.setStyle(optionsStyle);
              layer.properties = propriedades;
              _this.importFeatureGroup.addLayer(layer);
            }
          });
        });

      }
      if (feature.geometry.type == 'Polygon') {
        const options = {
            color: '#666666',
            fillColor : '#c0c3ac',
            weight: 0,
            fillOpacity: .5,
            strokeOpacity: 0.5,
            fill : true,
        };
        const points = [];
        feature.geometry.coordinates[0].map(coordinate => {
          const point = [];
          point.push(coordinate[1]);
          point.push(coordinate[0]);
          points.push(point);
        });

        const polygon = L.polygon(points, options);
        polygon.properties = feature.properties;
        polygon.id = feature.id;
        polygon.addTo(this.importFeatureGroup);
      }
      if (feature.geometry.type.includes('Point') && feature.properties.radius != undefined) {
        const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
        const circle = L.circle([coordenadas[1], coordenadas[0]],  feature.properties.radius , { });
        circle.properties = feature.properties;
        circle.id = feature.id;
        circle.addTo(this.importFeatureGroup);
      }
      if (feature.geometry.type.includes('Point') && feature.properties.radius == undefined) {
        const coordenadas = feature.geometry.type.includes('Multi') ? [feature.geometry.coordinates[0][0], feature.geometry.coordinates[0][1]] : [feature.geometry.coordinates[0], feature.geometry.coordinates[1]];
        const marker: L.circleMarker = L.circleMarker([coordenadas[1], coordenadas[0]], {
          radius: 10,
          fillColor: '#c0c3ac',
          color: '#ffffff',
          fillOpacity: 1,
          weight: 0.3
        });
        marker.properties = feature.properties;
        marker.id = feature.id;
        marker.addTo(this.importFeatureGroup);
      } else if (feature.geometry.type.includes('LineString')) {
        const optionsLine = {
            color: '#666666',
            fillColor : '#c0c3ac',
            weight: 4,
            opacity: 0.5,
            draggable: true,
            transform: true,
          };
        const options = $.extend(optionsLine, feature.properties);

        const points = [];
        feature.geometry.coordinates.map(coordinate => {
          const point = [];
          point.push(coordinate[1]);
          point.push(coordinate[0]);
          points.push(point);
        });

        const polyline: L.polyline = L.polyline(points, options);

        polyline.properties = feature.properties;
        polyline.id = feature.id;
        polyline.addTo(this.importFeatureGroup);
      }
    });
}

}
