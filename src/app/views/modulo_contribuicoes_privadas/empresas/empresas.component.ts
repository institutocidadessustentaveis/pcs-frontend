import { AreaInteresse } from 'src/app/model/area-interesse';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { Eixo } from 'src/app/model/eixo';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { PaisService } from 'src/app/services/pais.service';
import { EixoService } from 'src/app/services/eixo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CidadeDetalhe } from 'src/app/model/cidadeDetalhe';
import { CidadeService } from 'src/app/services/cidade.service';
import { FiltroGrupoAcademico } from 'src/app/model/filtroGrupoAcademico';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { GrupoAcademico } from 'src/app/model/grupo-academico';
import { GrupoAcademicoService } from '../../../services/grupo-academico.service';
import { Title } from '@angular/platform-browser';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { latLng, tileLayer, circleMarker, marker, icon } from 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
import { EventoService } from 'src/app/services/evento.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent implements OnInit {

  public gruposAcademicos: GrupoAcademico[] = [];

  public baseLayers = {
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

  public map: L.Map;
  public overlays = {};
  public layersControl: any;
  public vermaisvar = false;
  layers = [];
  public formFiltro: FormGroup;
  public filtroGrupoAcademico: FiltroGrupoAcademico = new FiltroGrupoAcademico();
  public cidadesComboCompleta: CidadeDetalhe[] = [];
  public cidadesIds: number[] = [];
  public cidadeFiltrada: number;

  public eixosCombo: Array<Eixo> = [];
  public odsCombo: Array<ItemCombo> = [];
  public paisesCombo: Array<ItemCombo> = [];
  public cidadesCombo: Array<ItemCombo> = [];
  public provinciaEstadoCombo: Array<ItemCombo> = [];
  public areasInteresseCombo: Array<AreaInteresse> = [];
  public tiposInstituicaoAcademia: Array<String>;
  public participaApl: boolean = false;
  public setoresEconomicos: Array<string>;
  public cidadesApl: Array<ItemCombo>;

  dataSource = new MatTableDataSource<GrupoAcademico>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ["empresas"];
  pesquisou = false;
  loading = false;

  scrollUp: any;
  constructor(
    private titleService: Title,
    private grupoAcademicoService: GrupoAcademicoService,
    private eventoService: EventoService,
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private route: ActivatedRoute,
    private eixoService: EixoService,
    private paisService: PaisService,
    private areaInteresseService: AreaInteresseService,
    private provinciaEstadoService: ProvinciaEstadoService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private element: ElementRef,
    private router: Router

  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.formFiltro = this.formBuilder.group({
      idOds: [null],
      idEixo: [null],
      idPais: [null],
      idCidade: [null],
      palavraChave: [null],
      idAreaInteresse: [null],
      idProvinciaEstado: [null],
      quantidadeAlunosMin: [null],
      quantidadeAlunosMax: [null],
      possuiExperiencias: [false],
      participaApl: [false],
      setoresApl: [null],
      cidadesApl: [null],
      tipoInstituicaoAcademia: [null],
    });
    this.route.queryParams.subscribe(params => {
      this.formFiltro.controls.idOds.setValue(params['ods']);
      this.formFiltro.controls.idEixo.setValue(params['eixo']);
      this.formFiltro.controls.idPais.setValue(params['pais']);
      this.formFiltro.controls.idCidade.setValue(params['cidade']);
      this.formFiltro.controls.idProvinciaEstado.setValue(params['estado']);
      this.formFiltro.controls.palavraChave.setValue(params['palavraChave']);
      this.formFiltro.controls.idAreaInteresse.setValue(params['areaInteresse']);
      this.formFiltro.controls.tipoInstituicaoAcademia.setValue(params['tipoInstituicaoAcademia']);
      this.formFiltro.controls.quantidadeAlunosMin.setValue(params['quantidadeAlunosMin']);
      this.formFiltro.controls.quantidadeAlunosMax.setValue(params['quantidadeAlunosMax']);
      this.formFiltro.controls.possuiExperiencias.setValue(params['possuiExperiencias']);
      this.formFiltro.controls.participaApl.setValue(params['participaApl']);
      this.formFiltro.controls.cidadesApl.setValue(params['cidadesApl']);
      let setorParamsArray = [];
      if(params['setoresApl'] !== undefined) {
        setorParamsArray = params['setoresApl'].split(',');
        this.formFiltro.controls.setoresApl.setValue(setorParamsArray);
      }
    });
    this.tiposInstituicaoAcademia = ['Institutos e Centros de Pesquisa', 'Instituições de Ensino Médio', 'Instituições de Ensino Superior', 'Outras Instituições'];
    this.setoresEconomicos = ['Comercial', 'Rural', 'Industrial', 'Serviços'];
  }

  ngOnInit() {
    this.titleService.setTitle('Empresas e Fundações Empresariais - Cidades Sustentáveis');
    this.carregarSelectJaComValor();
    //this.buscarGruposAcademicos();
    this.carregarCombos();
  }

  public carregarSelectJaComValor() {
    if(this.formFiltro.controls['idPais'].value){
      this.provinciaEstadoService.buscarProvinciaEstadoComboPorPais(this.formFiltro.controls['idPais'].value).subscribe(res => {
        this.provinciaEstadoCombo = res as ItemCombo[];
      })
    }

    if(this.formFiltro.controls['idProvinciaEstado'].value){
      this.cidadeService.buscarCidadeParaComboPorIdEstado(this.formFiltro.controls['idProvinciaEstado'].value).subscribe(res => {
        this.cidadesCombo = res as ItemCombo[];
      })
    }
  }

  public onPaisChange(event: any) {
    if(event.value){
    this.provinciaEstadoService.buscarProvinciaEstadoComboPorPais(event.value).subscribe(res => {
      this.provinciaEstadoCombo = res as ItemCombo[];
    })
  }
    this.provinciaEstadoCombo = [];
    this.cidadesCombo = [];
  }

  onEstadoChange(event: any){
    if (event.value) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(event.value).subscribe(res => {
        this.cidadesCombo = res as ItemCombo[];
      })
    }
    this.cidadesCombo = [];
  }



  public buscarGruposAcademicos() {
    this.markerClusters = L.markerClusterGroup({
      maxClusterRadius: 20,
      iconCreateFunction: function (cluster) {
        var childCount = cluster.getChildCount();

        var c = ' marker-cluster-';

        if (childCount > 0) {
          c += 'large';
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

    this.construirParamsURL();
    this.filtroGrupoAcademico.tipoCadastro = 'Empresa';
    this.filtroGrupoAcademico.idOds =  this.formFiltro.controls['idOds'].value;
    this.filtroGrupoAcademico.idEixo =  this.formFiltro.controls['idEixo'].value;
    this.filtroGrupoAcademico.idPais =  this.formFiltro.controls['idPais'].value;
    this.filtroGrupoAcademico.idCidade =  this.formFiltro.controls['idCidade'].value;
    this.filtroGrupoAcademico.palavraChave = this.formFiltro.controls.palavraChave.value;
    this.filtroGrupoAcademico.idAreaInteresse =  this.formFiltro.controls['idAreaInteresse'].value;
    this.filtroGrupoAcademico.idProvinciaEstado =  this.formFiltro.controls['idProvinciaEstado'].value;
    this.filtroGrupoAcademico.quantidadeAlunosMin =  this.formFiltro.controls['quantidadeAlunosMin'].value;
    this.filtroGrupoAcademico.quantidadeAlunosMax =  this.formFiltro.controls['quantidadeAlunosMax'].value;
    this.filtroGrupoAcademico.possuiExperiencias =  this.formFiltro.controls['possuiExperiencias'].value;
    this.filtroGrupoAcademico.tipoInstituicaoAcademia =  this.formFiltro.controls['tipoInstituicaoAcademia'].value;
    this.filtroGrupoAcademico.setoresApl = this.formFiltro.controls['setoresApl'].value;
    this.filtroGrupoAcademico.cidadesApl = this.formFiltro.controls['cidadesApl'].value;
    this.filtroGrupoAcademico.participaApl = this.formFiltro.controls['participaApl'].value;
    this.loading = true;
    this.grupoAcademicoService.buscarGruposAcademicosFiltrados(this.filtroGrupoAcademico)
      .subscribe(res => {
        this.gruposAcademicos = res as GrupoAcademico[];
        this.pesquisou = true;
        this.dataSource = new MatTableDataSource<GrupoAcademico>(this.gruposAcademicos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._intl.itemsPerPageLabel = 'Itens por página';
        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
        this.paginator._intl.firstPageLabel = 'Primeira página';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.nextPageLabel = 'Próxima página';
        this.paginator._intl.lastPageLabel = 'Última página';
        this.loading = false;
        this.gruposAcademicos.forEach((grupoAcademico) => {
          let clicouNoGrupo = false;
          if (grupoAcademico.latitude && grupoAcademico.longitude) {
            let marker: L.circleMarker = L.circleMarker(
              [grupoAcademico.latitude, grupoAcademico.longitude],
              {
                radius: 10,
                color: 'rgba(211, 20, 20, 0.918)',
                fillOpacity: 1,
                weight: 0.3,
              }
            );

            marker.bindPopup(
              this.definirPopup(grupoAcademico)
            );

            marker.on('mouseover', (e) => {
              e.target.openPopup();
            });


            marker.on('mouseout', (e) => {
              if (!clicouNoGrupo) {
                e.target.closePopup();
              }
            });


            marker.on('click', (e) => {
              clicouNoGrupo = !clicouNoGrupo;
            });

            this.markerClusters.addLayer(marker);
          }
        });

        this.overlays['cidades'] = this.markerClusters;
        this.layers.push(this.markerClusters);

      });
  }

  onMapReady(mapa) {
    this.map = mapa;
    this.initLayerControl();
    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
  }

  public initLayerControl() {
    this.layersControl = L.control
      .layers(this.baseLayers, this.overlays, { collapsed: false })
      .addTo(this.map);
  }

  definirPopup(grupoAcademico: GrupoAcademico) {
    let textoPopup = '';
    textoPopup = `<strong>${this.truncate(grupoAcademico.nomeGrupo, 3, '')} </strong>`;

    return textoPopup;
  }

  public truncate(value: string, limit: number, trail: string = ''): string {
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

  public construirParamsURL() {
    this.filtroGrupoAcademico.idOds = this.formFiltro.controls.idOds.value;
    this.filtroGrupoAcademico.idPais = this.formFiltro.controls.idPais.value;
    this.filtroGrupoAcademico.idCidade = this.formFiltro.controls.idCidade.value;
    this.filtroGrupoAcademico.palavraChave = this.formFiltro.controls.palavraChave.value;
    this.filtroGrupoAcademico.idAreaInteresse = this.formFiltro.controls.idAreaInteresse.value;
    this.filtroGrupoAcademico.idProvinciaEstado = this.formFiltro.controls.idProvinciaEstado.value;
    this.filtroGrupoAcademico.tipoInstituicaoAcademia = this.formFiltro.controls.tipoInstituicaoAcademia.value;
    this.filtroGrupoAcademico.quantidadeAlunosMin = this.formFiltro.controls.quantidadeAlunosMin.value;
    this.filtroGrupoAcademico.quantidadeAlunosMax = this.formFiltro.controls.quantidadeAlunosMax.value;
    this.filtroGrupoAcademico.possuiExperiencias = this.formFiltro.controls.possuiExperiencias.value;
    this.filtroGrupoAcademico.participaApl = this.formFiltro.controls.participaApl.value;
    this.filtroGrupoAcademico.cidadesApl = this.formFiltro.controls.cidadesApl.value;
    this.filtroGrupoAcademico.setoresApl = this.formFiltro.controls.setoresApl.value;

    if (this.filtroGrupoAcademico.palavraChave === undefined){
      this.filtroGrupoAcademico.palavraChave = '';
    }
    if (this.filtroGrupoAcademico.idAreaInteresse === undefined){
      this.filtroGrupoAcademico.idAreaInteresse = null;
    }
    if (this.filtroGrupoAcademico.idEixo === undefined){
      this.filtroGrupoAcademico.idEixo = null;
    }
    if (this.filtroGrupoAcademico.idOds === undefined){
      this.filtroGrupoAcademico.idOds = null;
    }
    if (this.filtroGrupoAcademico.idPais === undefined){
      this.filtroGrupoAcademico.idPais = null;
    }
    if (this.filtroGrupoAcademico.idProvinciaEstado === undefined){
      this.filtroGrupoAcademico.idProvinciaEstado = null;
    }
    if (this.filtroGrupoAcademico.idCidade === undefined){
      this.filtroGrupoAcademico.idCidade = null;
    }
    if (this.filtroGrupoAcademico.tipoInstituicaoAcademia === undefined){
      this.filtroGrupoAcademico.tipoInstituicaoAcademia = '';
    }
    if (this.filtroGrupoAcademico.quantidadeAlunosMin === undefined){
      this.filtroGrupoAcademico.quantidadeAlunosMin = null;
    }
    if (this.filtroGrupoAcademico.quantidadeAlunosMax === undefined){
      this.filtroGrupoAcademico.quantidadeAlunosMax = null;
    }
    if (this.filtroGrupoAcademico.possuiExperiencias === undefined){
      this.filtroGrupoAcademico.possuiExperiencias = false;
    }
    if (this.filtroGrupoAcademico.participaApl === undefined){
      this.filtroGrupoAcademico.participaApl = false;
    }
    if (this.filtroGrupoAcademico.cidadesApl === undefined){
      this.filtroGrupoAcademico.cidadesApl = null;
    }
    if (this.filtroGrupoAcademico.setoresApl === undefined){
      this.filtroGrupoAcademico.setoresApl = null;
    }

    let new_URL = 
    this.filtroGrupoAcademico.palavraChave ?
      `/colaboracoes-academicas/grupos-academicos?palavraChave=${this.filtroGrupoAcademico.palavraChave}` : null;
    this.filtroGrupoAcademico.idAreaInteresse ?
    (new_URL ? new_URL += `&areaInteresse=${this.filtroGrupoAcademico.idAreaInteresse}` : `/colaboracoes-academicas/grupos-academicos?areaInteresse=${this.filtroGrupoAcademico.idAreaInteresse}`) : null;
    this.filtroGrupoAcademico.idEixo ?
    (new_URL ? new_URL += `&eixo=${this.filtroGrupoAcademico.idEixo}` : `/colaboracoes-academicas/grupos-academicos?eixo=${this.filtroGrupoAcademico.idEixo}`) : null;
    this.filtroGrupoAcademico.idOds ?
    (new_URL ? new_URL += `&ods=${this.filtroGrupoAcademico.idOds}` : `/colaboracoes-academicas/grupos-academicos?ods=${this.filtroGrupoAcademico.idOds}`) : null;
    this.filtroGrupoAcademico.idPais ?
    (new_URL ? new_URL += `&pais=${this.filtroGrupoAcademico.idPais}` : `/colaboracoes-academicas/grupos-academicos?pais=${this.filtroGrupoAcademico.idPais}`) : null;
    this.filtroGrupoAcademico.idProvinciaEstado ?
    (new_URL ? new_URL += `&estado=${this.filtroGrupoAcademico.idProvinciaEstado}` : `/colaboracoes-academicas/grupos-academicos?estado=${this.filtroGrupoAcademico.idProvinciaEstado}`) : null;
    this.filtroGrupoAcademico.idCidade ?
    (new_URL ? new_URL += `&cidade=${this.filtroGrupoAcademico.idCidade}` : `/colaboracoes-academicas/grupos-academicos?cidade=${this.filtroGrupoAcademico.idCidade}`) : null;
    this.filtroGrupoAcademico.tipoInstituicaoAcademia ?
    (new_URL ? new_URL += `&tipoInstituicaoAcademia=${this.filtroGrupoAcademico.tipoInstituicaoAcademia}` : `/colaboracoes-academicas/grupos-academicos?tipoInstituicaoAcademia=${this.filtroGrupoAcademico.tipoInstituicaoAcademia}`) : null;
    this.filtroGrupoAcademico.quantidadeAlunosMin ?
    (new_URL ? new_URL += `&quantidadeAlunosMin=${this.filtroGrupoAcademico.quantidadeAlunosMin}` : `/colaboracoes-academicas/grupos-academicos?quantidadeAlunosMin=${this.filtroGrupoAcademico.quantidadeAlunosMin}`) : null;
    this.filtroGrupoAcademico.quantidadeAlunosMax ?
    (new_URL ? new_URL += `&quantidadeAlunosMax=${this.filtroGrupoAcademico.quantidadeAlunosMax}` : `/colaboracoes-academicas/grupos-academicos?quantidadeAlunosMax=${this.filtroGrupoAcademico.quantidadeAlunosMax}`) : null;
    this.filtroGrupoAcademico.possuiExperiencias ?
    (new_URL ? new_URL += `&possuiExperiencias=${this.filtroGrupoAcademico.possuiExperiencias}` : `/colaboracoes-academicas/grupos-academicos?possuiExperiencias=${this.filtroGrupoAcademico.possuiExperiencias}`) : false;
    this.filtroGrupoAcademico.participaApl ?
    (new_URL ? new_URL += `&participaApl=${this.filtroGrupoAcademico.participaApl}` : `/colaboracoes-academicas/grupos-academicos?participaApl=${this.filtroGrupoAcademico.participaApl}`) : false;
    this.filtroGrupoAcademico.cidadesApl ?
    (new_URL ? new_URL += `&cidadesApl=${this.filtroGrupoAcademico.cidadesApl}` : `/colaboracoes-academicas/grupos-academicos?cidadesApl=${this.filtroGrupoAcademico.cidadesApl}`) : null;
    this.filtroGrupoAcademico.setoresApl ?
    (new_URL ? new_URL += `&setoresApl=${this.filtroGrupoAcademico.setoresApl}` : `/colaboracoes-academicas/grupos-academicos?setoresApl=${this.filtroGrupoAcademico.setoresApl}`) : null;

    window.history.replaceState( {} , '', new_URL );

    this.onParticipaAplChange(this.filtroGrupoAcademico.participaApl);
  }

  public limparFiltro() {
    this.formFiltro.controls.palavraChave.setValue(null);
    this.formFiltro.controls.idCidade.setValue(null);
    this.formFiltro.controls.idProvinciaEstado.setValue(null);
    this.formFiltro.controls.idPais.setValue(null);
    this.formFiltro.controls.idOds.setValue(null);
    this.formFiltro.controls.idEixo.setValue(null);
    this.formFiltro.controls.idAreaInteresse.setValue(null);
    this.formFiltro.controls.tipoInstituicaoAcademia.setValue(null);
    this.formFiltro.controls.quantidadeAlunosMin.setValue(null);
    this.formFiltro.controls.quantidadeAlunosMax.setValue(null);
    this.formFiltro.controls.setoresApl.setValue(null);
    this.formFiltro.controls.cidadesApl.setValue(null);
    this.formFiltro.controls.participaApl.setValue(null);
    this.participaApl = false;
    this.formFiltro.controls.possuiExperiencias.setValue(null);
    window.history.replaceState( {} , '', '/colaboracoes-academicas/grupos-academicos' );
    this.buscarGruposAcademicos();
  }

  public carregarCombos() {
    this.paisService.buscarPaisesCombo().subscribe(res => {this.paisesCombo = res});
    this.eixoService.buscarEixosParaCombo(false).subscribe(res => {this.eixosCombo = res});
    this.odsService.buscarOdsCombo().subscribe(res => {this.odsCombo = res});
    this.areaInteresseService.buscaAreasInteresses().subscribe(res => {this.areasInteresseCombo = res});
    this.cidadeService.buscarCidadeComboBox().subscribe( cidades => {this.cidadesApl = cidades});
  }

  public onParticipaAplChange(event) {
    this.participaApl = event;
    if (this.participaApl == false) {
      this.formFiltro.controls.setoresApl.setValue(null);
      this.formFiltro.controls.cidadesApl.setValue(null);
    }
  }
}
