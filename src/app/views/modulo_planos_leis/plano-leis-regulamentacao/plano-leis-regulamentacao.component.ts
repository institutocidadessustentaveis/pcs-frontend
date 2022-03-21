import { Title } from '@angular/platform-browser';
import { BibliotecaPlanoLeisRegulamentacao } from './../../../model/BibliotecaPlanoLeisRegulamentacao';
import { FiltroBibliotecaPlanoLeisRegulamentacao } from './../../../model/FiltroBibliotecaPlanoLeisRegulamentacao';
import { BibliotecaService } from 'src/app/services/bibliotecaService';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ItemCombo } from './../../../model/ItemCombo ';
import { CidadeService } from './../../../services/cidade.service';
import { ProvinciaEstadoService } from './../../../services/provincia-estado.service';
import { Component, OnInit, OnChanges, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import * as L from 'leaflet';
import { latLng, tileLayer, circleMarker, marker, icon } from 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { PaisService } from 'src/app/services/pais.service';
import { AreaInteresse } from 'src/app/model/area-interesse';


@Component({
  selector: 'app-plano-leis-regulamentacao',
  templateUrl: './plano-leis-regulamentacao.component.html',
  styleUrls: ['./plano-leis-regulamentacao.component.css']
})
export class PlanoLeisRegulamentacaoComponent implements OnInit {

  private bibliotecasExibidasNoMapa: BibliotecaPlanoLeisRegulamentacao[];
  public formFiltro: FormGroup;
  public filtroBibliotecaPlanoLeisRegulamentacao: FiltroBibliotecaPlanoLeisRegulamentacao = new FiltroBibliotecaPlanoLeisRegulamentacao();
  public paisesCombo: Array<ItemCombo> = [];
  public provinciaEstadoCombo: Array<ItemCombo> = [];
  public cidadesCombo: Array<ItemCombo> = [];
  public areasInteresseCombo: Array<AreaInteresse> = [];

  public habilitarRegiaoDoBrasil = false;
  public paginationLimit = 3;
  public mostrarLinkLerMais: boolean = false;
  loading = false;

  map: L.Map;

  provider = new OpenStreetMapProvider();

  latitudeSelecionada: number;
  longitudeSelecionada: number;

  options = {
    layers: [
      tileLayer(environment.MAP_TILE_SERVER, {
        detectRetina: true,
        attribution: environment.MAP_ATTRIBUTION,
        noWrap: true,
        minZoom: 2
      })
    ],
    zoom: 3,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -1.09227])
  };
  public layersControl = [];
  scrollUp: any;

  constructor(
    public formBuilder: FormBuilder,
    private provinciaEstadoService: ProvinciaEstadoService,
    private cidadeService: CidadeService,
    private element: ElementRef,
    public router: Router,
    public bibliotecaService: BibliotecaService,
    private titleService: Title,
    private route: ActivatedRoute,
    private paisesService: PaisService,
  ) {
    this.formFiltro = this.formBuilder.group({
      idCidade: [null],
      idProvinciaEstado: [null],
      idPais: [null],
      idTema: [null],
      palavraChave: [null]
    });
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
  }

  ngOnInit() {
    this.titleService.setTitle('Leis, Planos e Regulamentações - Cidades Sustentáveis');
    this.carregarCombos();
    this.buscar();
  }

  public carregarCombos() {
    this.paisesService.buscarPaisesCombo().subscribe(res => this.paisesCombo = res);
    this.bibliotecaService.carregarCombosBiblioteca().subscribe(response => { this.areasInteresseCombo = response.listaAreasInteresse as AreaInteresse[];
    });
  }
  public onPaisChange(event: any) {

    if (event.value) {
      this.provinciaEstadoService.buscarProvinciaEstadoComboPorPais(event.value).subscribe(res => {
        this.provinciaEstadoCombo = res as ItemCombo[];
      });
    }

    this.provinciaEstadoCombo = [];
    this.cidadesCombo = [];
    this.formFiltro.controls.idProvinciaEstado.setValue(null);
    this.formFiltro.controls.idCidade.setValue(null);
  }

  onEstadoChange(event: any) {
    if (event.value) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(event.value).subscribe(res => {
        this.cidadesCombo = res as ItemCombo[];
      });
    }

    this.cidadesCombo = [];
    this.formFiltro.controls.idCidade.setValue(null);
  }

  buscar() {
    this.filtroBibliotecaPlanoLeisRegulamentacao.idPais = this.formFiltro.controls.idPais.value;
    this.filtroBibliotecaPlanoLeisRegulamentacao.idProvinciaEstado = this.formFiltro.controls.idProvinciaEstado.value;
    this.filtroBibliotecaPlanoLeisRegulamentacao.idCidade = this.formFiltro.controls.idCidade.value;
    this.filtroBibliotecaPlanoLeisRegulamentacao.idTema = this.formFiltro.controls.idTema.value;
    this.filtroBibliotecaPlanoLeisRegulamentacao.palavraChave = this.formFiltro.controls.palavraChave.value;
    this.bibliotecaService.buscarBibliotecaPlanoLeisRegulamentacaoFiltrida(this.filtroBibliotecaPlanoLeisRegulamentacao).subscribe(response => {
      this.bibliotecasExibidasNoMapa = response as BibliotecaPlanoLeisRegulamentacao[];
      let bibliotecasDetalhes = [];
      this.layersControl = [];
      this.bibliotecasExibidasNoMapa.forEach(biblioteca => {
        if (biblioteca.longitude !== null && biblioteca.latitude !== null) {
          let marker: L.circleMarker = L.circleMarker([biblioteca.latitude, biblioteca.longitude], {
            radius: 10,
            fillColor: '#FF9C00',
            color: '#ffffff',
            fillOpacity: 1,
            weight: 0.3
          });

          marker.on('click', () => {
            window.open(`/biblioteca?palavraChave=&areaInteresse=&eixo=&indicador=&ods=&metaOds=&pais=${biblioteca.idPais}&estado=${biblioteca.idEstado}&cidade=${biblioteca.idCidade}`);
          });

          marker.bindPopup(this.definirPopup(bibliotecasDetalhes, biblioteca));
          bibliotecasDetalhes.push(biblioteca);

          marker.on('mouseover', (e) => {
            e.target.openPopup();
          });

          marker.on('mouseout', (e) => {
            e.target.closePopup();
          });

          this.layersControl.push(marker);
        }
      });
    });
  }

  onMapReady(map: L.Map) {
    this.map = map;
  }

  definirPopup(bibliotecas: BibliotecaPlanoLeisRegulamentacao[], bibliotecaAtual: BibliotecaPlanoLeisRegulamentacao) {
    let textoPopup = '';
    let contPublicacoes = 1;
    textoPopup = `<strong>Cidade: ${bibliotecaAtual.nomeCidade}</strong> <p><strong>Título da última publicação:</strong></p><p>${bibliotecaAtual.tituloPublicacao}</p> ${bibliotecaAtual.descricao != '' || null ? '<strong>Descrição:</strong>' + this.truncateHTML(bibliotecaAtual.descricao) : ''}`;
    bibliotecas.forEach(biblioteca => {
      if (biblioteca.idCidade === bibliotecaAtual.idCidade) {
        contPublicacoes += 1;
        textoPopup = `<strong>Cidade: ${bibliotecaAtual.nomeCidade}</strong> <p><strong>Título da última publicação:</strong></p><p>${bibliotecaAtual.tituloPublicacao}</p> ${bibliotecaAtual.descricao != '' || null ? '<strong>Descrição:</strong>' + this.truncateHTML(bibliotecaAtual.descricao) : ''}`;
      }
    });
    textoPopup += `<p><strong>Número de publicações dessa cidade: ${contPublicacoes}</strong></p>`;
    return textoPopup;
  }

  public limparFiltro() {
    this.formFiltro.controls.idCidade.setValue(null);
    this.formFiltro.controls.idProvinciaEstado.setValue(null);
    this.formFiltro.controls.idPais.setValue(null);
    this.formFiltro.controls.idTema.setValue(null);
    this.formFiltro.controls.palavraChave.setValue(null);
    this.buscar();
  }


  public truncateHTML(text: string): string {

    let charlimit = 720;
    if (!text || text.length <= charlimit) {
      return text;
    }
    this.ativarLinkLerMais();
    let shortened = text.substring(0, charlimit) + '...';
    return shortened;
  }

  public ativarLinkLerMais() {
    this.mostrarLinkLerMais = true;
  }

}
