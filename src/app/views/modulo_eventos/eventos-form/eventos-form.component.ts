import { Prefeitura } from 'src/app/model/prefeitura';
import { cidade } from './../../../model/PainelIndicadorCidades/cidade';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import { Estado } from 'src/app/model/PainelIndicadorCidades/estado';
import { Usuario } from 'src/app/model/usuario';
import { Cidade } from './../../../model/cidade';
import { Eixo } from 'src/app/model/eixo';
import { Evento } from './../../../model/Evento';
import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { ItemCombo } from 'src/app/model/itemCombo';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EixoService } from 'src/app/services/eixo.service';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { PaisService } from './../../../services/pais.service';
import { PcsUtil } from './../../../services/pcs-util.service';
import { PerfisService } from 'src/app/services/perfis.service';
import { CidadeService } from './../../../services/cidade.service';
import { EventoService } from './../../../services/evento.service';
import { UsuarioService } from './../../../services/usuario.service';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { AlertaEventoService } from './../../../services/alerta-evento.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ProvinciaEstadoService } from './../../../services/provincia-estado.service';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { ObjetivoDesenvolvimentoSustentavelService } from './../../../services/objetivo-desenvolvimento-sustentavel.service';
import * as L from 'leaflet';
import { latLng, tileLayer, circleMarker, marker, icon } from 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { environment } from 'src/environments/environment';
import { Pais } from 'src/app/model/pais';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { NoticiaService } from 'src/app/services/noticia.service';
import { Noticia } from 'src/app/model/noticia';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { MatDialog, MatSelect } from '@angular/material';


@Component({
  selector: 'app-eventos-form',
  templateUrl: './eventos-form.component.html',
  styleUrls: ['./eventos-form.component.css']
})
export class EventosFormComponent implements OnInit {

  public id;
  public formEvento: FormGroup;
  public formAlerta: FormGroup;
  public tipoUsuario: string;
  public listaPerfil: any = [];
  public listaAlerta: any = [];
  public usuarioLogado: Usuario;
  public clonar: boolean = false;
  public exibirLinkExterno: boolean;
  public eixosCombo: Array<Eixo> = [];
  public listaAlertaExcluir: any = [];
  public evento: Evento = new Evento();
  public estados: Array<ItemCombo> = [];
  public habilitarRegiaoDoBrasil = false;
  public cadastrarAlertas: boolean = false;
  public paisesCombo: Array<ItemCombo> = [];
  public cidadesComboFiltrada: Array<ItemCombo> = [];
  public cidadesComboCompleta: Array<ItemCombo> = [];
  public noticiasCombo: Array<ItemCombo> = [];
  public areasInteresseCombo: Array<AreaInteresse> = [];
  public odsCombo: Array<ObjetivoDesenvolvimentoSustentavel> = [];
  public paisPrefeitura: Number;
  public estadoPrefeitura: Number;
  public cidadePrefeitura: Number;

  map: L.Map;
  provider = new OpenStreetMapProvider();
  latitudeSelecionada: number;
  longitudeSelecionada: number;
  loadingBuscaCidade = false;

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
    center: latLng([ -15.03144, -53.09227 ])
  }

  layersControl = [
    circleMarker([ -15.03144, -53.09227], { radius: 10, fillColor: 'red', color: 'red', fillOpacity: 1, weight: 1 })
  ]
  scrollUp: any;

  public editorConfig: any = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['fontsize', []],
      ['para', ['style0', 'ul', 'ol']],
      ['insert', ['table', 'picture', 'link']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };
  alertaEscolhido: any;

   public noticiasMultiFilter: FormControl = new FormControl();
   public filteredNoticias: ReplaySubject<ItemCombo[]> = new ReplaySubject<ItemCombo[]>(1);
   @ViewChild('multiSelect', { read: false }) multiSelect: MatSelect;
   protected _onDestroy = new Subject<void>();
   @ViewChild('modalVerSelecionados') modalVerSelecionados: TemplateRef<any>;
   public noticiasSelecionadas: Array<ItemCombo> = [];

  constructor(
    private router: Router,
    private element: ElementRef,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private eixosService: EixoService,
    private paisesService: PaisService,
    private perfilService: PerfisService,
    private eventoService: EventoService,
    private cidadesService: CidadeService,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private prefeituraService: PrefeituraService,
    private estadoService: ProvinciaEstadoService,
    private alertaEventoService: AlertaEventoService,
    private areaInteresseService: AreaInteresseService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private noticiaService: NoticiaService,
    public dialog: MatDialog,
  ) {
    this.formEvento = this.formBuilder.group({
      ods: [null],
      site: [null],
      eixos: [null],
      temas: [null],
      noticiasRelacionadas: [null],
      linkExterno: [null],
      tipo: [null, Validators.required],
      nome: [null, Validators.required],
      data: [null, Validators.required],
      pais: [null, Validators.required],
      estado: [null, Validators.required],
      cidade: [null, Validators.required],
      horario: [null, Validators.required],
      endereco: [null, Validators.required],
      latitude: [null, Validators.required],
      descricao: [null, Validators.required],
      isOnline: [false, Validators.required],
      longitude: [null, Validators.required],
      isExterno: [false, Validators.required],
      organizador: [null, Validators.required],
      isPublicado: [false, Validators.required],
    });
    this.configurarFormAlerta(null);
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
  }

  ngOnInit() {
    this.buscarUsuarioLogado();
    this.carregarPerfis();
    this.buscarEvento();
    this.carregarCombos();
    this.exibeCampoLinkExterno();
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }



  public buscarUsuarioLogado() {
        this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuarioLogado = usuario;
      this.verificaTipoUsuario();
    })
  }

  carregarPerfis() {
    this.perfilService.buscarComboBoxPerfis().subscribe( res => {
      this.listaPerfil = res;
    });
  }

  public buscarEvento() {
    this.activatedRoute.params.subscribe( params => {
      let id = params.id;
      if (id) {
        this.eventoService.buscarEventoPorId(id).subscribe( response => {
          this.evento = response as Evento;
          this.carregarEstadoECidade();
          this.carregarAtributos();
          this.alertaEventoService.buscar(id).subscribe(dtos => {
            this.listaAlerta = dtos;
          });
        }, error => { this.router.navigate(['/eventos/lista']); });
      } else {
        this.formEvento.controls.latitude.setValue(-15.03144);
        this.formEvento.controls.longitude.setValue(-53.09227);
      }
    }, error => {
      this.router.navigate(['/eventos/lista']);
    });
  }

  carregarCombos() {
    this.areaInteresseService.buscaAreasInteresses()
    .subscribe(res => this.areasInteresseCombo = res)

    this.paisesService.buscarPaisesCombo()
    .subscribe(res => this.paisesCombo = res);

    this.eixosService.buscarEixosParaCombo(false)
    .subscribe(res => this.eixosCombo = res);

    this.odsService.buscarOdsCombo()
    .subscribe(res => this.odsCombo = res);

    this.noticiaService.buscarNoticiaTituloEId()
    .subscribe(res => {
      this.noticiasCombo = res;
    // load the initial noticia list
      this.filteredNoticias.next(this.noticiasCombo.slice());

    // listen for search field value changes
      this.noticiasMultiFilter.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterNoticiasMulti();
      });
  });
}

  public verificaTipoUsuario() {
    if (this.authService.isUsuarioPrefeitura()) {
      this.tipoUsuario = "Prefeitura";
      this.desabilitarPaisEstadoCidade()
      this.buscarPaisEstadoCidadePorPrefeitura();
    } else {
      this.usuarioService.buscarUsuarioLogado()
      .subscribe(res  => {
        if (res.nomePerfil.includes('Administrador')) {
          this.tipoUsuario = "Administrador";
          this.clonar = true;
        } else {
          this.tipoUsuario = "Responsável pelo PCS";
        }
      });
    }
  }

  public desabilitarPaisEstadoCidade() {
     this.formEvento.controls.pais.disable();
     this.formEvento.controls.estado.disable();
     this.formEvento.controls.cidade.disable();
  }

  buscarPaisEstadoCidadePorPrefeitura() {

    this.prefeituraService.buscarPaisEstadoCidadePorPrefeitura(this.usuarioLogado.prefeitura.id).subscribe(res => {
      let paisSelecionado: ItemCombo = this.paisesCombo.filter(x => x.id === res.idPais)[0];
      this.paisPrefeitura = paisSelecionado.id;
      this.carregarComboEstadoPrefeitura(res.idEstado, res.idCidade);
    })
  }

  public carregarComboEstadoPrefeitura(idEstado, idCidade) {
    this.estadoService.buscarComboBoxEstado().subscribe(estados => {
      this.estados = estados;
      let estadoSelecionado: ItemCombo = this.estados.filter(x => x.id ===idEstado)[0];
      this.estadoPrefeitura = estadoSelecionado.id;
      this.carregarComboCidadePrefeitura(idCidade);
    })
  }

  public carregarComboCidadePrefeitura(idCidade) {
    this.cidadesService.buscarCidadeComboBox().subscribe(cidades => {
      this.cidadesComboFiltrada = cidades
      let cidadeSelecionado: ItemCombo = this.cidadesComboFiltrada.filter(x => x.id === idCidade)[0];
      this.cidadePrefeitura = cidadeSelecionado.id;
      this.preencherPaisEstadoCidadePrefeitura();
    })
  }

  public preencherPaisEstadoCidadePrefeitura() {
    this.formEvento.controls.pais.setValue(this.paisPrefeitura);
    this.formEvento.controls.cidade.setValue(this.cidadePrefeitura);
    this.formEvento.controls.estado.setValue(this.estadoPrefeitura);

  }


  public carregarEstadoECidade(){
    if(this.formEvento.controls.pais.value){
      this.onPaisChange();
    }

    if(this.formEvento.controls.estado.value){
      this.onEstadoChange();
    }
  }

  public onPaisChange() {
    this.estadoService.buscarProvinciaEstadoComboPorPais(this.formEvento.controls.pais.value).subscribe(res => {
      this.estados = res;
      this.cidadesComboFiltrada = [];
    })
  }

  public onEstadoChange() {
    this.cidadesService.buscarCidadeParaComboPorIdEstado(this.formEvento.controls.estado.value).subscribe(res => {
      this.cidadesComboFiltrada = res;
    })
  }

  public onOnlineChange() {
    if (this.formEvento.controls.isOnline.value) {
      this.formEvento.controls.endereco.setValue(null);
      this.formEvento.controls.endereco.setValidators([]);
      this.formEvento.controls.endereco.updateValueAndValidity();
      this.formEvento.controls.latitude.setValue(null);
      this.formEvento.controls.latitude.setValidators([]);
      this.formEvento.controls.latitude.updateValueAndValidity();
      this.formEvento.controls.longitude.setValue(null);
      this.formEvento.controls.longitude.setValidators([]);
      this.formEvento.controls.longitude.updateValueAndValidity();
    } else {
      this.formEvento.controls.endereco.setValidators([Validators.required]);
      this.formEvento.controls.endereco.updateValueAndValidity();
      this.formEvento.controls.latitude.setValidators([Validators.required]);
      this.formEvento.controls.latitude.updateValueAndValidity();
      this.formEvento.controls.longitude.setValidators([Validators.required]);
      this.formEvento.controls.longitude.updateValueAndValidity();
    }
  }

  public exibeCampoLinkExterno() {
    if (this.formEvento.controls.isExterno.value == true) {
      this.exibirLinkExterno = true;
    } else {
      this.formEvento.controls.linkExterno.setValue(null);
      this.exibirLinkExterno = false;
    }
  }
  salvar() {
   if (this.formEvento.valid) {
     this.evento.ods = this.formEvento.controls.ods.value;
     this.evento.tipo = this.formEvento.controls.tipo.value;
     this.evento.nome = this.formEvento.controls.nome.value;
     this.evento.site = this.formEvento.controls.site.value;
     this.evento.data = this.formEvento.controls.data.value;
     this.evento.pais = this.formEvento.controls.pais.value;
     this.evento.temas = this.formEvento.controls.temas.value;
     this.evento.eixos = this.formEvento.controls.eixos.value;
     this.evento.estado = this.formEvento.controls.estado.value;
     this.evento.cidade = this.formEvento.controls.cidade.value;
     this.evento.horario = this.formEvento.controls.horario.value;
     this.evento.online = this.formEvento.controls.isOnline.value;
     this.evento.endereco = this.formEvento.controls.endereco.value;
     this.evento.latitude = this.formEvento.controls.latitude.value;
     this.evento.externo = this.formEvento.controls.isExterno.value;
     this.evento.longitude = this.formEvento.controls.longitude.value;
     this.evento.descricao = this.formEvento.controls.descricao.value;
     this.evento.publicado = this.formEvento.controls.isPublicado.value;
     this.evento.organizador = this.formEvento.controls.organizador.value;
     this.evento.noticiasRelacionadas = this.formEvento.controls.noticiasRelacionadas.value;
     if (this.evento.externo == true) {
        this.evento.linkExterno = this.formEvento.controls.linkExterno.value;
      } else {
        this.evento.linkExterno = null;
      }

     if (this.evento.id != null && this.evento.id != undefined) {
        this.editar();
      } else {
        this.cadastrar();
      }
   } else {
   }
  }
  salvarAlertas(idEvento) {
    for (const alerta of this.listaAlerta) {
      alerta.idEvento = idEvento;
      this.alertaEventoService.salvar(alerta).subscribe(resp => {
        alerta.id = resp;
      });
    }
  }

  adicionarAlertaParaExcluir(indice){
    const id = this.listaAlerta[indice].id;
    this.listaAlertaExcluir.push(id);
    this.listaAlerta.splice(indice,1);
  }

  excluirAlertas(){
    if (this.listaAlertaExcluir) {
      for (const idAlerta of this.listaAlertaExcluir) {
        this.alertaEventoService.excluir(idAlerta).subscribe();
      }
    }
  }

  cadastrar() {
    this.eventoService.cadastrarEvento(this.evento).subscribe(async response => {
      const _evento: any = response;
      this.salvarAlertas(_evento.id);
      this.excluirAlertas();
      await PcsUtil.swal().fire({
        title: 'Evento',
        text: `Evento Cadastrado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/eventos/lista']);
      }, error => { });
    });
  }
  editar() {
    this.eventoService.editarEvento(this.evento).subscribe(async response => {
      this.salvarAlertas(this.evento.id);
      this.excluirAlertas();
      await PcsUtil.swal().fire({
        title: 'Evento',
        text: `Evento Editado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/eventos/lista']);
      }, error => { });
    });
  }

  carregarAtributos() {
    if (this.tipoUsuario == 'Prefeitura') {
      this.formEvento.controls.tipo.setValue('Prefeitura');
      this.formEvento.controls.pais.setValue(this.paisPrefeitura);
      this.formEvento.controls.estado.setValue(this.estadoPrefeitura);
      this.formEvento.controls.cidade.setValue(this.cidadePrefeitura);
    } else {
      this.formEvento.controls.tipo.setValue(this.evento.tipo);
      this.formEvento.controls.pais.setValue(this.evento.pais);
      this.formEvento.controls.estado.setValue(this.evento.estado);
      this.formEvento.controls.cidade.setValue(this.evento.cidade);
    }
    this.formEvento.controls.ods.setValue(this.evento.ods);
    this.formEvento.controls.data.setValue(this.evento.data);
    this.formEvento.controls.nome.setValue(this.evento.nome);
    this.formEvento.controls.site.setValue(this.evento.site);
    this.formEvento.controls.temas.setValue(this.evento.temas);
    this.formEvento.controls.eixos.setValue(this.evento.eixos);
    this.formEvento.controls.horario.setValue(this.evento.horario);
    this.formEvento.controls.isOnline.setValue(this.evento.online);
    this.formEvento.controls.latitude.setValue(this.evento.latitude);
    this.formEvento.controls.endereco.setValue(this.evento.endereco);
    this.formEvento.controls.longitude.setValue(this.evento.longitude);
    this.formEvento.controls.descricao.setValue(this.evento.descricao);
    this.formEvento.controls.isPublicado.setValue(this.evento.publicado);
    this.formEvento.controls.linkExterno.setValue(this.evento.linkExterno);
    this.formEvento.controls.organizador.setValue(this.evento.organizador);
    this.formEvento.controls.noticiasRelacionadas.setValue(this.evento.noticiasRelacionadas);

    if (this.evento.online === undefined || this.evento.online === null || !this.evento.online) {
      this.formEvento.controls.isOnline.setValue(false);
      this.formEvento.controls.endereco.updateValueAndValidity();
      this.formEvento.controls.endereco.setValidators([Validators.required]);
      this.addMarkerOnMap(this.evento.latitude, this.evento.longitude);
    } else {
      this.formEvento.controls.endereco.setValue(null);
      this.formEvento.controls.endereco.setValidators([]);
      this.formEvento.controls.endereco.updateValueAndValidity();
      this.formEvento.controls.latitude.setValue(null);
      this.formEvento.controls.latitude.setValidators([]);
      this.formEvento.controls.latitude.updateValueAndValidity();
      this.formEvento.controls.longitude.setValue(null);
      this.formEvento.controls.longitude.setValidators([]);
      this.formEvento.controls.longitude.updateValueAndValidity();
    }
    if (this.evento.publicado === undefined || this.evento.publicado === null ) {
      this.formEvento.controls.isPublicado.setValue(false);
    }
    this.formEvento.controls.isExterno.setValue(this.evento.externo);
    if (this.evento.externo === undefined || this.evento.externo === null) {
      this.formEvento.controls.isExterno.setValue(false);
    }

    if(this.formEvento.controls.pais.value){
      this.onPaisChange();
    }

    if(this.formEvento.controls.estado.value){
      this.onEstadoChange();
    }

  }

  habilitarAreaAlerta(novo) {
    if (this.cadastrarAlertas) {
        this.configurarFormAlerta(null);
    } else {
      if (novo) {
        this.configurarFormAlerta(null);
      }
    }
    this.cadastrarAlertas = !this.cadastrarAlertas;
  }

  adicionarAlerta() {
    if (this.formAlerta.valid) {
      const alerta = this.formAlerta.value;
      if (this.alertaEscolhido){
        this.listaAlerta.splice(this.alertaEscolhido.index, 1);
        this.alertaEscolhido = {};
        this.alertaEscolhido.id = alerta.id;
        this.alertaEscolhido.titulo = alerta.titulo;
        this.alertaEscolhido.imagem = alerta.imagem;
        this.alertaEscolhido.qtdDias = alerta.qtdDias;
        this.alertaEscolhido.descricao = alerta.descricao;
        this.alertaEscolhido.apenasPrefeitura = alerta.apenasPrefeitura;
        this.listaAlerta.push(alerta);
      } else {
        this.listaAlerta.push(alerta);
      }
      this.habilitarAreaAlerta(false);
    }
  }

  escolherAlerta(alerta, index) {
    this.habilitarAreaAlerta(false);
    this.alertaEscolhido = alerta;
    index ? this.alertaEscolhido.index = index : null;
    this.configurarFormAlerta(this.alertaEscolhido);
  }

  configurarFormAlerta(alerta) {
    if (alerta) {
      this.formAlerta.controls.id.setValue(alerta.id);
      this.formAlerta.controls.titulo.setValue(alerta.titulo);
      this.formAlerta.controls.perfis.setValue(alerta.perfis);
      this.formAlerta.controls.imagem.setValue(alerta.imagem);
      this.formAlerta.controls.qtdDias.setValue(alerta.qtdDias);
      this.formAlerta.controls.descricao.setValue(alerta.descricao);
      this.formAlerta.controls.apenasPrefeitura.setValue(alerta.apenasPrefeitura);
    } else {
      this.formAlerta = this.formBuilder.group({
        id : [null],
        perfis: [null],
        imagem: [null],
        titulo: [null, Validators.required],
        qtdDias: [null, Validators.required],
        descricao: [null, Validators.required],
        apenasPrefeitura: [false, Validators.required],
      });
    }
  }

  onMapReady(map: L.Map) {
    this.map = map;
    map.on('click', (e) => {
      this.addMarkerOnMap(e.latlng.lat, e.latlng.lng);

      this.formEvento.controls.latitude.setValue(e.latlng.lat);
      this.formEvento.controls.longitude.setValue(e.latlng.lng);
    });
  }

  addMarkerOnMap(latitude: number, longitude: number) {
    let options = { radius: 10, fillColor: 'red', color: 'red', fillOpacity: 1, weight: 1 };
    let marker: circleMarker = circleMarker([ latitude, longitude], options);

    this.layersControl = [];
    this.layersControl.push(marker);
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





  public selecionarCidadeBusca(lat: number, long: number) {
    this.addMarkerOnMap(lat, long);

    this.formEvento.controls.latitude.setValue(lat);
    this.formEvento.controls.longitude.setValue(long);
  }

  buscarCidadeMapa() {
    if (this.formEvento.controls.endereco.value !== '') {
      this.loadingBuscaCidade = true;

      this.provider.search({query: this.formEvento.controls.endereco.value}).then((resultados) => {
        if(resultados.length > 0) {
          this.limparMapa();

          this.desenharMarcadoresCidadesEncontradas(resultados)

          this.focarPonto(resultados[0]['y'], resultados[0]['x']);

          this.loadingBuscaCidade = false;
        } else {
          PcsUtil.swal().fire({
            title: 'Não foi possível encontrar nenhuma cidade',
            text: `Não foi possível encontrar localidades chamadas '${this.formEvento.controls.endereco.value}'. Verifique a grafia e tente novamente.`,
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

  protected filterNoticiasMulti() {
    if (!this.noticiasCombo) {
      return;
    }
    // get the search keyword
    let search = this.noticiasMultiFilter.value;
    if (!search) {
      this.filteredNoticias.next(this.noticiasCombo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the noticias
    this.filteredNoticias.next(
      this.noticiasCombo.filter(noticia => noticia.label.toLowerCase().indexOf(search) > -1)
    );
  }

  verNoticiasSelecionadas(){
    this.noticiasSelecionadas = this.noticiasCombo.filter(({id}) => this.formEvento.controls.noticiasRelacionadas.value.includes(id));

    let dialogRef = this.dialog.open(this.modalVerSelecionados, {
      height: '50%',
      width: '50%',
    });
  }

}
