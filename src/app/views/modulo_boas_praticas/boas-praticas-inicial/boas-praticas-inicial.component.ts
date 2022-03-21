import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { CombosCidadesComBoaPratica } from '../../../model/combosCidadesComBoasPraticas';
import { CidadeComBoaPratica } from './../../../model/cidadeComBoaPratica';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ProvinciaEstadoShapeService } from 'src/app/services/provincia-estado-shape.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { ItemCombo } from 'src/app/model/itemCombo';
import { FiltroCidadesComBoasPraticas } from 'src/app/model/filtroCidadesComBoasPraticas';
import { PageEvent, MatSort, MatPaginator, MatAutocompleteTrigger, MatAutocomplete } from '@angular/material';
import { BoasPraticasFiltradas } from 'src/app/model/boasPraticasFiltradas';
import { BoaPraticaItem } from 'src/app/model/boaPraticaItem';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { NewsletterService } from 'src/app/services/newsletter.service';
import { environment } from 'src/environments/environment';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { PaisService } from 'src/app/services/pais.service';
import { ProvinciaEstadoDTO } from '../../modulo_administracao/cidade-form/cidade-form.component';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

import * as L from 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
import { SeoService } from 'src/app/services/seo-service.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownload } from 'src/app/model/dados-download';

export interface PaisDTO {
  id?: number;
  nome: string;
  provinciaEstado: Array<ProvinciaEstadoDTO>;
}

@Component({
  selector: 'app-boas-praticas-inicial',
  templateUrl: './boas-praticas-inicial.component.html',
  styleUrls: ['./boas-praticas-inicial.component.css', '../../../../animate.css'],
})



export class BoasPraticasInicialComponent implements OnInit  {

  private cidadesExibidasNoMapa: any[];

  public ngxScrollToDestination: string;

  public layersControl = [];

  public listBoasPraticas: BoaPraticaItem[];

  public listBoasPraticasCarousel: BoaPraticaItem[];

  public loading = true;

  public combosCidadesComBoaPratica: CombosCidadesComBoaPratica;

  public boaPraticaPublicadaVazia = true;

  public listaOds: ItemCombo[];
  public listaEixos: ItemCombo[];
  public listaPaises: ItemCombo[];
  public listaCidades: ItemCombo[];
  public listaOdsBkp: ItemCombo[];
  public listaMetaOds: ItemCombo[];
  public listaPaisesBkp: ItemCombo[];
  public listaCidadesBkp: ItemCombo[];
  public listaMetaOdsBkp: ItemCombo[];
  public listaContinentes: ItemCombo[];
  public listaProvinciasEstados: ItemCombo[];
  public listaProvinciasEstadosBkp: ItemCombo[];
  public filtroCidadesComBoasPraticas: FiltroCidadesComBoasPraticas = new FiltroCidadesComBoasPraticas();

  public length2 = 10;
  public pageSize = 3;

  filteredPaisOptions: Observable<ItemCombo[]>;
  filteredEstadoOptions: Observable<ItemCombo[]>;
  filteredCidadeOptions: Observable<ItemCombo[]>;
  filteredMetaOdsOptions: Observable<ItemCombo[]>;

  public dadosDownload = new DadosDownload;
  public usuario = new Usuario;

  @ViewChild('autoCompleteEstado') autoCompleteEstado: ElementRef;

  private idCidade: number = null;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  emailNewsletter: string = '';

  success: boolean = false;
  scrollUp: any;

  isUsuarioLogado = false;

  public options = {
    layers: [
      L.tileLayer(environment.MAP_TILE_SERVER, {
        detectRetina: true,
        attribution: environment.MAP_ATTRIBUTION,
        noWrap: true,
        minZoom: 1
      })
    ],
    zoom: 3,
    zoomControl: true,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: L.latLng([-15.03144, -53.09227])
  };

  formulario: FormGroup;

  constructor(
    element: ElementRef,
    private router: Router,
    private titleService: Title,
    private cd: ChangeDetectorRef,
    private seoService: SeoService,
    private paisService: PaisService,
    private domSanitizer: DomSanitizer,
    public cidadesService: CidadeService,
    private cidadeService: CidadeService,
    public activatedRoute: ActivatedRoute,
    private _scrollToService: ScrollToService,
    private boaPraticaService: BoaPraticaService,
    private newsletterService: NewsletterService,
    public shapeService: ProvinciaEstadoShapeService,
    private provinciaEstadoService: ProvinciaEstadoService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService
    ) {
     this.scrollUp = this.router.events.subscribe(() => {
      element.nativeElement.scrollIntoView();
     });
     this.formulario = this.formBuilder.group({
      idEixo: [''],
      idOds: [''],
      metaOds: [''],
      continente: [''],
      pais: [''],
      estado: [''],
      cidade: [''],
      popuMin: [''],
      popuMax: [''],
      palavraChave: [null],
    });

     L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
  }

  ngOnInit() {
    this.buscarCidadesComBoasPraticas();
    this.carregarCombosCidadesComBoasPraticas();
    this.getParamIdCidade();
    if (this.idCidade) {
      this.buscarBoasPraticasPorCidade(this.idCidade);
    } else {
      this.buscarBoasPraticas(0, this.pageSize);
    }
    this.buscarUsuarioLogado();
    this.getUsuarioLogadoDadosDownload()
  }

  private _filter(value: string, typeFilter): ItemCombo[] {
    const filterValue = value.toLowerCase();
    if (typeFilter == 'pais') {
      return this.listaPaises.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
    } else if (typeFilter == 'estado') {
      return this.listaProvinciasEstados.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
    } else if (typeFilter == 'cidade') {
      return this.listaCidades.filter(option => option.label.toLowerCase().indexOf(filterValue) === 0);
    } else if (typeFilter == 'metaOds') {
      return this.listaMetaOds.filter(option => option.label.toLowerCase().indexOf(filterValue) != -1);
    }
  }

  buscarUsuarioLogado(){
    this.isUsuarioLogado = this.authService.isAuthenticated();
  }

  onChangeEixo() {
      if (this.formulario.controls.idEixo.value === undefined) {
        this.listaOds = this.listaOdsBkp;
        this.formulario.controls.idOds.setValue(undefined);
      } else {
        this.odsService.buscarPorEixo(this.formulario.controls.idEixo.value).subscribe(a => {
        this.listaOds = a as ItemCombo[];
        });
      }
  }

  onChangeODS() {
    this.formulario.controls.metaOds.setValue('');
    if (this.formulario.controls.idOds.value === undefined) {
      this.listaMetaOds = this.listaMetaOdsBkp;
      this.formulario.controls.idMetaOds.setValue(undefined);
      this.filteredMetaOdsOptions = this.formulario.get('metaOds')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'metaOds') : this.listaMetaOds.slice()));
    } else {
      this.odsService.buscarOds(this.formulario.controls.idOds.value).subscribe(a => {
      const listaAux = a as ObjetivoDesenvolvimentoSustentavel;
      this.listaMetaOds = new Array<ItemCombo>();
      listaAux.metas.forEach(element => {
        const item: ItemCombo = new ItemCombo();
        item.id = element.id;
        item.label = element.numero + ' - ' + element.descricao
        this.listaMetaOds.push(item);
        });
        this.filteredMetaOdsOptions = this.formulario.get('metaOds')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'metaOds') : this.listaMetaOds.slice()));
      });
    }
  }

  onChangeContinente() {
    if (this.formulario.controls.continente.value === undefined) {
      this.listaPaises = this.listaPaisesBkp;
      this.formulario.controls.idPais.setValue(undefined);
    } else {
      this.paisService.buscarPaisesPorContinente(this.formulario.controls.continente.value).subscribe(response => {
          const listaAux = response as Array<PaisDTO>;
          this.listaPaises = new Array<ItemCombo>();
          listaAux.forEach(element => {
          const item: ItemCombo = new ItemCombo();
          item.id = element.id;
          item.label = element.nome;
          this.listaPaises.push(item);
        });
      });
    }
  }

  onChangePais(pais) {
    if (pais && pais.id) {
      this.provinciaEstadoService.buscarPorPais(pais.id).subscribe(response => {
        const listaAux = response as Array<ProvinciaEstado>;
        this.listaProvinciasEstados = new Array<ItemCombo>();

        listaAux.forEach(element => {
          const item: ItemCombo = new ItemCombo();
          item.id = element.id;
          item.label = element.nome;
          this.listaProvinciasEstados.push(item);
        });

        this.filteredEstadoOptions = this.formulario.get('estado')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'estado') : this.listaProvinciasEstados.slice()));
      });
    } else {
      this.listaProvinciasEstados = this.listaProvinciasEstadosBkp;
      this.listaCidades = this.listaCidadesBkp;
      this.filtroCidadesComBoasPraticas.estado = null;
      this.filteredEstadoOptions = this.formulario.get('estado')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'estado') : this.listaProvinciasEstados.slice()));
      this.filteredCidadeOptions = this.formulario.get('cidade')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'cidade') : this.listaCidades.slice()));
    }
  }

  onChangeEstado(estado) {
    if (estado && estado.id) {
      this.listaCidades = new Array<ItemCombo>();
      this.cidadeService.buscarPorEstado(estado).subscribe(res => {
        this.listaCidades = res as ItemCombo[];
        this.filteredCidadeOptions = this.formulario.get('cidade')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'cidade') : this.listaCidades.slice()));
      });

    } else {
      this.listaCidades = this.listaCidadesBkp;
      this.filtroCidadesComBoasPraticas.cidade = null;
      this.filteredCidadeOptions = this.formulario.get('cidade')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'cidade') : this.listaCidades.slice()));
    }
  }

  private getParamIdCidade() {
    this.activatedRoute.params.subscribe(async params => {
      const id = params.id;
      if (id) {
        this.idCidade =  id;
      }
    }, () => {});
  }

  private async buscarBoasPraticas(page: number, linesPerPage: number) {
    this.filtroCidadesComBoasPraticas.idEixo = this.formulario.controls.idEixo.value;
    this.filtroCidadesComBoasPraticas.idOds = this.formulario.controls.idOds.value;
    this.filtroCidadesComBoasPraticas.metaOds = this.formulario.controls.metaOds.value ? this.formulario.controls.metaOds.value : null;
    this.filtroCidadesComBoasPraticas.continente = this.formulario.controls.continente.value;
    this.filtroCidadesComBoasPraticas.pais = this.formulario.controls.pais.value ? this.formulario.controls.pais.value : null;
    this.filtroCidadesComBoasPraticas.estado = this.formulario.controls.estado.value ? this.formulario.controls.estado.value : null;
    this.filtroCidadesComBoasPraticas.cidade = this.formulario.controls.cidade.value ? this.formulario.controls.cidade.value : null;
    this.filtroCidadesComBoasPraticas.popuMin = this.formulario.controls.popuMin.value;
    this.filtroCidadesComBoasPraticas.popuMax = this.formulario.controls.popuMax.value;
    this.filtroCidadesComBoasPraticas.page = page;
    this.filtroCidadesComBoasPraticas.linesPerPage = linesPerPage;
    this.filtroCidadesComBoasPraticas.palavraChave = this.formulario.controls.palavraChave.value;
    this.loading = true;
    this.buscarCidadesComBoasPraticas();

    await this.boaPraticaService.buscarBoasPraticasFiltradas(this.filtroCidadesComBoasPraticas).subscribe(response => {
    const boasPraticasFiltradas = response as BoasPraticasFiltradas;
    this.listBoasPraticas = boasPraticasFiltradas.listBoasPraticas;
    if (this.listBoasPraticasCarousel == null) {
      this.listBoasPraticasCarousel = Object.assign([], this.listBoasPraticas).slice(0, 3);

      this.listBoasPraticasCarousel.forEach(item => {
        item.imagemPrincipalSafe = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + item.imagemPrincipal);
      });
    }

    this.listBoasPraticas.forEach(item => {
      item.imagemPrincipalSafe =  this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + item.imagemPrincipal);
    });

    if (response) {
        this.paginator.length = boasPraticasFiltradas.countTotalBoasPraticas;
        this.paginator._intl.itemsPerPageLabel = 'Itens por página';
        this.paginator._intl.firstPageLabel = 'Primeira página';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.nextPageLabel = 'Próxima página';
        this.paginator._intl.lastPageLabel = 'Última página';
        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length2: number) => { if (length2 == 0 || pageSize == 0) { return `0 de ${length2}`; } length2 = Math.max(length2, 0); const startIndex = page * pageSize; const endIndex = startIndex < length2 ? Math.min(startIndex + pageSize, length2) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length2}`; };

      }
    this.loading = false;

    this.cd.detectChanges();
    this.varificaSeExisteInformação();

    this.titleService.setTitle(`Boas Práticas - Cidades Sustentáveis`);
    const config = {
      title: 'Tipos e Classificações de Indicadores - Cidades Sustentáveis',
      description: 'As Boas Práticas publicadas pelo Programa Cidades Sustentáveis apresentam exemplos de políticas públicas no Brasil e no mundo que produziram resultados concretos e servem de inspiração para outras cidades.',
      image:  this.getImagePath(this.listBoasPraticasCarousel[0].idBoaPratica),
      slug: '',
      site: 'Cidades Sustentáveis' ,
      url: `${environment.APP_URL}boaspraticasinicial`
    };
    this.seoService.generateTags(config);
    }, () => { this.loading = false; });
  }

  private varificaSeExisteInformação() {
    if (this.listBoasPraticas.length > 0 ) {
      this.boaPraticaPublicadaVazia = false;
    } else {
      this.boaPraticaPublicadaVazia = true;
    }
  }

  private async carregarCombosCidadesComBoasPraticas() {
    this.loading = true;
    await this.boaPraticaService.buscarCombosCidadesComBoasPraticas().subscribe(response => {
      this.combosCidadesComBoaPratica = response as CombosCidadesComBoaPratica;
      this.listaContinentes = this.combosCidadesComBoaPratica.listaContinentes;
      this.listaPaises = this.combosCidadesComBoaPratica.listaPaises;
      this.listaProvinciasEstados = this.combosCidadesComBoaPratica.listaProvinciasEstados;
      this.listaCidades = this.combosCidadesComBoaPratica.listaCidades;

      this.listaPaisesBkp = this.combosCidadesComBoaPratica.listaPaises;
      this.listaProvinciasEstadosBkp = this.combosCidadesComBoaPratica.listaProvinciasEstados;
      this.listaCidadesBkp = this.combosCidadesComBoaPratica.listaCidades;

      this.listaEixos = this.combosCidadesComBoaPratica.listaEixos;
      this.listaOds = this.combosCidadesComBoaPratica.listaOds;
      this.listaMetaOds = this.combosCidadesComBoaPratica.listaMetaOds;

      this.listaOdsBkp = this.combosCidadesComBoaPratica.listaOds;
      this.listaMetaOdsBkp = this.combosCidadesComBoaPratica.listaMetaOds;

      this.loading = false;

      this.filteredPaisOptions = this.formulario.get('pais')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'pais') : this.listaPaises.slice()));
      this.filteredEstadoOptions = this.formulario.get('estado')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'estado') : this.listaProvinciasEstados.slice()));
      this.filteredCidadeOptions = this.formulario.get('cidade')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'cidade') : this.listaCidades.slice()));
      this.filteredMetaOdsOptions = this.formulario.get('metaOds')!.valueChanges.pipe(startWith(''),map(value => typeof value === 'string' ? value : value.label),map(label => label ? this._filter(label, 'metaOds') : this.listaMetaOds.slice()));

    }, () => { this.loading = false; });

  }

  private async buscarCidadesComBoasPraticas() {
    this.loading = true;
    this.boaPraticaService.buscarCidadesComBoasPraticasFiltradas(this.filtroCidadesComBoasPraticas).subscribe(res => {
      this.layersControl = [];
      this.cidadesExibidasNoMapa = res as CidadeComBoaPratica[];
      for (let i = 0; i < this.cidadesExibidasNoMapa.length; i++) {
        let cidade = this.cidadesExibidasNoMapa[i];
        if (cidade.longitude !== null && cidade.latitude !== null) {
          let marker: L.circleMarker = L.circleMarker([cidade.latitude, cidade.longitude], {
            radius: 10,
            fillColor: this.getColor(cidade.countBoasPraticas),
            color: '#ffffff',
            fillOpacity: 1,
            weight: 0.3
          });

          marker.on('click', () => {
            this.triggerScrollTo();
            this.popularCidade(cidade);
          });

          marker.bindPopup(`<strong>${cidade.nomeCidade}</strong> <p>Quantidade de boas práticas: ${cidade.countBoasPraticas}</p>`);

          marker.on('mouseover', (e) => {
            e.target.openPopup();
          });

          marker.on('mouseout', (e) => {
            e.target.closePopup();
          });

          this.layersControl.push(marker);
        }
      }
      this.loading = false;
    }, () => { this.loading = false; });
  }

  public triggerScrollTo() {
    const config: ScrollToConfigOptions = {
      target: 'destination'
    };
    this._scrollToService.scrollTo(config);
  }


  private getColor(d: any) {
    if(d == 1) {
      return '#FFC164';
    }

    if(d == 2) {
      return '#FF9C00';
    }

    if(d >= 3 && d <= 5) {
      return '#FF7701';
    }

    if(d >= 6 && d <= 7) {
      return '#E24800';
    }

    if(d >= 8 && d <= 10) {
      return '#B31F00';
    }

    if(d > 10) {
      return '#860200';
    }

    return '#FFC164';
  }

  private buscarBoasPraticasPorCidade(idCidade: number) {
    this.filtroCidadesComBoasPraticas = new FiltroCidadesComBoasPraticas();
    this.filtroCidadesComBoasPraticas.idCidade = idCidade;
    this.buscarBoasPraticas(0, this.pageSize);
  }

  public onMapReady(map) {
    let info = L.control();

    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };

    info.update = function (props) {
      this._div.innerHTML = '<h4>Densidade de boas práticas</h4>' + (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' cidade<sup>2</sup>'
        : 'Sobre cada cidade');
    };

    info.addTo(map);

    map.attributionControl.addAttribution('Densidade de Boas Práticas - <a href="https://www.cidadessustentaveis.org.br/">Programa Cidades Sustentáveis</a>');

    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = map => {

      let div = L.DomUtil.create('div', 'info legend'),
        grades = [1, 2, 3, 5, 6, 7, 8, 10],
        labels = [],
        from, to;

      let pairs: any[] = grades.reduce((result, value, index, array) => {
        if (index % 2 === 0) {
          result.push(array.slice(index, index + 2));
        }

        return result;
      }, []);

      for(var i = 0; i < pairs.length; i++) {
        from = pairs[i][0];
        to = pairs[i][1];

        if(i == 0) {
          labels.push('<i style="opacity:1;background:' + this.getColor(1) + '"></i> ' + from);
          labels.push('<i style="opacity:1;background:' + this.getColor(2) + '"></i> ' + to);
        } else {
          labels.push('<i style="opacity:1; background:' + this.getColor(from + 1) + '"></i> ' + from + (to ? '&ndash;' + to : '+'));
        }

        if(i == (pairs.length - 1)) {
          labels.push('<i style="opacity:1;background:' + this.getColor(to +1) + '"></i> + ' + to);
        }
      }

      div.innerHTML = labels.join('<br>');

      return div;
    };

    legend.addTo(map);
  }

  public carregarPaginaBoasPraticas(event: PageEvent): PageEvent {
    this.buscarBoasPraticas(event.pageIndex, event.pageSize);
    this.pageSize = event.pageSize;
    return event;
  }

  public pesquisarBoasPraticas() {
    this.triggerScrollTo();
    this.buscarBoasPraticas(0, this.pageSize);
  }

  public clear() {
    this.formulario.controls.idEixo.setValue('');
    this.formulario.controls.idOds.setValue('');
    this.formulario.controls.metaOds.setValue('');
    this.formulario.controls.continente.setValue('');
    this.formulario.controls.pais.setValue('');
    this.formulario.controls.estado.setValue('');
    this.formulario.controls.cidade.setValue('');
    this.formulario.controls.popuMin.setValue('');
    this.formulario.controls.popuMax.setValue('');
    this.formulario.controls.palavraChave.setValue('');
    this.buscarBoasPraticas(0, this.pageSize);
  }

  public assinarNewsletter() {
    if(this.emailFormControl.valid) {
      this.newsletterService.assinarNewsletter(this.emailNewsletter).subscribe(() => {
        this.emailNewsletter = "";
        this.emailFormControl.clearValidators();
        this.success = true;
      });
    }
  }

  public getImagePath(id: number): string {
    if(id == null) {
      return "/";
    }
    return `${environment.API_URL}boapratica/imagem/` + id
  }

  public getTextoExibicao(itemCombo?): string | undefined {
    if(itemCombo.label2){
      return itemCombo.label2 ? itemCombo.label + ' - ' + itemCombo.label2 : undefined;
    }else {
      return itemCombo ? itemCombo.label : undefined;
    }
  }

public removerDisplayWidthDinamico(value){
  if(value == 'pais'){
    this.formulario.controls.estado.setValue('');
    this.formulario.controls.cidade.setValue('');
  }

  if(value == 'estado'){
    this.formulario.controls.cidade.setValue('');
  }
}

  public popularCidade(cidade: CidadeComBoaPratica) {
    this.filtroCidadesComBoasPraticas = new FiltroCidadesComBoasPraticas();
    let novaCidade = new ItemCombo();
    novaCidade.id = cidade.idCidade;
    novaCidade.label = cidade.nomeCidade;

    this.formulario.controls.cidade.setValue(novaCidade);
    this.buscarBoasPraticas(0, this.pageSize);
  }

  async getUsuarioLogadoDadosDownload(){
    if (await this.authService.isAuthenticated()) {
        this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
        this.usuario = usuario as Usuario;

        this.dadosDownload.email = usuario.email;
        this.dadosDownload.nome = usuario.nome
        this.dadosDownload.organizacao = usuario.organizacao;
        this.dadosDownload.boletim = usuario.recebeEmail;
        this.dadosDownload.usuario = usuario.id;
        this.dadosDownload.nomeCidade = usuario.cidadeInteresse;
        this.dadosDownload.acao = `Download de Arquivo da Home de Boas Práticas`;
        this.dadosDownload.pagina = `Boas Práticas Inicial`;
      });
    } else {
      this.dadosDownload = null;
    }
  }

}
