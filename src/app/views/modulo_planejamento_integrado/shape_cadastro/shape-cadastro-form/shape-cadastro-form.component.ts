import { Validators } from '@angular/forms';
import { ShapeFile } from './../../../../model/shapeFile';
import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';

import * as L from "leaflet";
import "leaflet.markercluster";
import { latLng, tileLayer, geoJSON } from "leaflet";
import { FormGroup, FormBuilder } from '@angular/forms';
import { ShapeUpload } from 'src/app/model/shapeUpload';
import * as shapefileApi from "shapefile";
import { GestureHandling } from "leaflet-gesture-handling";
import { AreaInteresse } from 'src/app/model/area-interesse';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RasterItem } from 'src/app/model/rasterItem';
import { environment } from 'src/environments/environment';
import { TemaGeoespacialService } from 'src/app/services/tema-geoespacial.service';
import swal from 'sweetalert2';
import { EixoService } from 'src/app/services/eixo.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { PaisService } from 'src/app/services/pais.service';
import { MatDialog } from '@angular/material';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-shape-cadastro-form',
  templateUrl: './shape-cadastro-form.component.html',
  styleUrls: ['./shape-cadastro-form.component.css']
})
export class ShapeCadastroFormComponent implements OnInit {

  public scrollUp: any;
  public loading = false;

  public formGroup: FormGroup;
  public importFeatureGroup;
  public importFeatureGroupOld = null;
  public importFeatureGroupRaster;
  public shapeFile: ShapeFile = new ShapeFile();
  public arquivoShp: File;
  public arquivoDbf: File;
  public arquivoShx: File;
  public arquivoTiff: File;
  public arquivoKml: File;
  public arquivosCarregados: Array<string> = [];
  public temasGeoespaciais: any = [];
  public exibirFolhaMosaico = false;
  public paisesCombo: Array<ItemCombo> = [];
  public estados: Array<ItemCombo> = [];
  public cidadesComboFiltrada: Array<ItemCombo> = [];
  public listaAnos: any = [];
  public usuarioLogado: Usuario = new Usuario();
  public isAdmin: boolean;

  private map: L.Map;
  private layerControl;
  private overlays = {};

  listaAreaInteresse: any[] = [];

  eixos = [];
  ods = [];
  todosOds = [];
  metas = [];

  listaIndicadores = [];

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

  constructor(private formBuilder: FormBuilder, private areaInteresseService: AreaInteresseService,
              private temaGeoespacialService: TemaGeoespacialService,
              private shapeFileService: ShapeFileService,
              private eixoService: EixoService,
              private odsService: ObjetivoDesenvolvimentoSustentavelService,
              private indicadorService: IndicadoresService,
              private paisesService: PaisService,
              private estadoService: ProvinciaEstadoService,
              private cidadesService: CidadeService,
              private router: Router,
              private element: ElementRef,
              private activatedRoute: ActivatedRoute,
              private usuarioService: UsuarioService,
              public dialog: MatDialog) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.formGroup = this.formBuilder.group({
      ano: ['', Validators.required],
      titulo: ['', Validators.required],
      areaInteresse: [null],
      instituicao: ['', Validators.required],
      fonte: [''],
      sistemaDeReferencia: [''],
      tipoArquivo: ['', Validators.required],
      nivelTerritorial: [''],
      regiao: [''],
      publicar: ['nao'],
      temaGeoespacial: [null],
      eixos : [null],
      ods: [null],
      metas: [null],
      indicadores: [null],
      palavra: [''],
      mosaico: [''],
      codigoFolha: [''],
      integridade: [''],
      codigoMapa: [''],
      resumoConteudo: [''],
      dadosMapeados: ['', Validators.required],
      escala: ['', Validators.required],
      pais: [null,  Validators.required],
      estados: [null],
      cidades: [null],
      cartografia: ['', Validators.required],
      latitude: [''],
      longitude: [''],
      atualizacao: [''],
      ambiente: [''],
      codificacao: [''],
      exibirAuto: ['nao']
    });
    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
  }

  ngOnInit() {
    this.buscarUsuario()
    this.buscarEixo();
    this.buscarOds();

    this.carregarAreaInteresse();
    this.carregarTemasGeoespaciais();
    this.initLayerControl();
    this.buscarShapeFile();
    this.populaComboIndicador();
    this.buscarPais();
    this.initListaAnos();
  }

  public isUsuarioAdmin() {
    if (this.usuarioLogado.nomePerfil.includes("Administrador")) {
      this.isAdmin = true
    }
    else {
      this.isAdmin = false;
    }
  }

  async buscarUsuario() {
   let resp = this.usuarioService.buscarUsuarioLogado().subscribe(res => {
     this.usuarioLogado = res;
     this.isUsuarioAdmin()
   })    
  }

  private carregarAreaInteresse() {
    this.areaInteresseService.buscaAreasInteresses().subscribe(res => {
      this.listaAreaInteresse = res as Array<AreaInteresse>;
    });
  }
  private carregarTemasGeoespaciais() {
    this.temaGeoespacialService.buscarTodosSimples().subscribe(res => {
      this.temasGeoespaciais = res;
    });
  }

  private buscarShapeFile() {
    this.loading = true;
    this.importFeatureGroup = L.featureGroup();
    this.activatedRoute.params.subscribe(async params => {
      let id = params.id;
      if (id) {
        this.shapeFileService.buscarShapeFilePorIdValidacao(id).subscribe(response => {
          if (response === null) {
            this.router.navigate(['/planejamento-integrado/cadastro-shapefile']);
          } else {
            this.carregarDadosForm(response);
            this.shapeFile = response as ShapeFile;
            this.montarComboBox(response);
            this.exibirShapeFileVetorial(response.shapes);
          }
        }, error => { this.loading = false; this.router.navigate(['/planejamento-integrado/cadastro-shapefile']); });
      } else {
        this.loading = false;
        this.formGroup.controls.ano.setValue(new Date().getFullYear());
      }
    }, error => { this.loading = false; this.router.navigate(['/planejamento-integrado/cadastro-shapefile']); });
  }

  private exibirShapeFileVetorial(features: Array<any>) {
    features.forEach(feature => {
      const options = {
        color: "#000022",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.6
      };

      const geoJson = geoJSON([feature], options);
      this.importFeatureGroup.addLayer(geoJson);
    });
    this.layerControl.addOverlay(this.importFeatureGroup, this.shapeFile.titulo);
    this.importFeatureGroup.addTo(this.map);
    this.loading = false;
  }

  private exibirShapeFileRaster(raster: RasterItem) {
    const mywms = L.tileLayer.wms(`http://localhost:8088/geoserver/${raster.workspaceName}/wms`, {
      layers: raster.storeName,
      format: 'image/png',
      transparent: true,
      version: '1.1.0',
      attribution: "myattribution",
      tiled: true
    });

    this.importFeatureGroupRaster = L.featureGroup();
    this.importFeatureGroupRaster.addLayer(mywms);
    this.layerControl.addOverlay(this.importFeatureGroupRaster, this.shapeFile.titulo);
    this.importFeatureGroupRaster.addTo(this.map);
    this.loading = false;
  }

  private carregarDadosForm(shapeFile: ShapeFile) {
    this.formGroup.controls.ano.setValue(shapeFile.ano);
    this.formGroup.controls.titulo.setValue(shapeFile.titulo);
    this.formGroup.controls.areaInteresse.setValue(shapeFile.areasInteresse);
    this.formGroup.controls.instituicao.setValue(shapeFile.instituicao);
    this.formGroup.controls.fonte.setValue(shapeFile.fonte);
    this.formGroup.controls.sistemaDeReferencia.setValue(shapeFile.sistemaDeReferencia);
    this.formGroup.controls.tipoArquivo.setValue(shapeFile.tipoArquivo);
    this.formGroup.controls.nivelTerritorial.setValue(shapeFile.nivelTerritorial);
    this.formGroup.controls.regiao.setValue(shapeFile.regiao);
    this.formGroup.controls.publicar.setValue(shapeFile.publicar ? 'sim' : 'nao');
    this.formGroup.controls.temaGeoespacial.setValue(shapeFile.temaGeoespacial);
    this.formGroup.controls.eixos.setValue(shapeFile.eixos);
    this.formGroup.controls.ods.setValue(shapeFile.ods);
    this.formGroup.controls.indicadores.setValue(shapeFile.indicadores);
    this.formGroup.controls.palavra.setValue(shapeFile.palavra);
    this.formGroup.controls.codigoFolha.setValue(shapeFile.codigoFolha);
    this.formGroup.controls.integridade.setValue(shapeFile.integridade);
    this.formGroup.controls.codigoMapa.setValue(shapeFile.codigoMapa);
    this.formGroup.controls.resumoConteudo.setValue(shapeFile.resumoConteudo);
    this.formGroup.controls.dadosMapeados.setValue(shapeFile.dadosMapeados);
    this.formGroup.controls.escala.setValue(shapeFile.escala);
    this.formGroup.controls.pais.setValue(shapeFile.pais);
    this.formGroup.controls.cidades.setValue(shapeFile.cidades);
    this.formGroup.controls.estados.setValue(shapeFile.estados);
    this.formGroup.controls.cartografia.setValue(shapeFile.cartografia);
    this.formGroup.controls.latitude.setValue(shapeFile.latitude);
    this.formGroup.controls.longitude.setValue(shapeFile.longitude);
    this.formGroup.controls.atualizacao.setValue(shapeFile.atualizacao);
    this.formGroup.controls.ambiente.setValue(shapeFile.ambiente);
    this.formGroup.controls.codificacao.setValue(shapeFile.codificacao);
    this.formGroup.controls.exibirAuto.setValue(shapeFile.exibirAuto ? 'sim' : 'nao');

    if (shapeFile.codigoFolha) {
      this.formGroup.controls.mosaico.setValue(true);
      this.exibirFolhaMosaico = true;
    }
  }

  private initLayerControl() {
    this.layerControl = L.control.layers(this.baseLayers, this.overlays, { collapsed: false });
  }

  public onMapReady(map: L.Map) {
    this.map = map;
    this.layerControl.addTo(this.map);
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
    } else if (arquivo.name.includes('.kml')) {
      this.arquivoKml = arquivo;
    } else if (arquivo.name.includes('.kmz')) {
      this.arquivoKml = arquivo;
    }
  }

  public salvar() {
    if (!this.formGroup.valid ) {
      return PcsUtil.swal().fire({
        title: 'Formulário inválido',
        text: `Preencha o formulário corretamente`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });
    }

    if (this.verificaArquivosVetorial()) {      
      if (this.shapeFile.id) {
        this.salvarCamposShapeFile()
      }
      else {
        this.salvarVetorial();
      }
    }
  }

  private verificaArquivosVetorial(): boolean  {
    if (this.shapeFile.shapes != undefined || this.arquivosCarregados.length > 0) {
      return true;
    }
    else {
      this.gerarErroArquivos()
    }
  }

  private erroArquivo(nomeArquivo: string) {
    PcsUtil.swal().fire({
      title: `Arquivo .${nomeArquivo}`,
      text: `Selecione também o arquivo .${nomeArquivo}`,
      type: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    });
  }

  private gerarErroArquivos() {
    if (!this.arquivoShp && this.formGroup.controls.tipoArquivo.value == "SHP") {
        this.erroArquivo('SHP')
        return false;
    } else if (!this.arquivoDbf && this.formGroup.controls.tipoArquivo.value == "SHP") {
        this.erroArquivo('DBF')
        return false;
    } else if (!this.arquivoShx && this.formGroup.controls.tipoArquivo.value == "SHP") {
        this.erroArquivo('SHX')
        return false;
    } else if (!this.arquivoKml && this.formGroup.controls.tipoArquivo.value == "KML") {
        this.erroArquivo('KML')
        return false;
    }
      else if (!this.arquivoKml && this.formGroup.controls.tipoArquivo.value == "KMZ") {
        this.erroArquivo('KMZ')
        return false;
      }
      else {
      return true;
    }
  }

  private salvarVetorial() {
    let dialogRef = this.dialog.open(this.modalLoading, {
      height: '300px',
      width: '300px',
    });

    this.loading = true;
    this.shapeFile.ano = this.formGroup.controls.ano.value;
    this.shapeFile.titulo = this.formGroup.controls.titulo.value;
    this.shapeFile.areasInteresse = this.formGroup.controls.areaInteresse.value;
    this.shapeFile.eixos = this.formGroup.controls.eixos.value;
    this.shapeFile.ods = this.formGroup.controls.ods.value;
    this.shapeFile.metas = this.formGroup.controls.metas.value;
    this.shapeFile.instituicao = this.formGroup.controls.instituicao.value;
    this.shapeFile.fonte = this.formGroup.controls.fonte.value;
    this.shapeFile.sistemaDeReferencia = this.formGroup.controls.sistemaDeReferencia.value;
    this.shapeFile.tipoArquivo = this.formGroup.controls.tipoArquivo.value;
    this.shapeFile.nivelTerritorial = this.formGroup.controls.nivelTerritorial.value;
    this.shapeFile.regiao = this.formGroup.controls.regiao.value;
    this.shapeFile.publicar = this.formGroup.controls.publicar.value === 'sim' ? true : false;
    this.shapeFile.temaGeoespacial = this.formGroup.controls.temaGeoespacial.value;
    this.shapeFile.indicadores = this.formGroup.controls.indicadores.value;
    this.shapeFile.palavra = this.formGroup.controls.palavra.value;
    this.shapeFile.mosaico = this.formGroup.controls.mosaico.value;
    this.shapeFile.codigoFolha = this.formGroup.controls.codigoFolha.value;
    this.shapeFile.integridade = this.formGroup.controls.integridade.value;
    this.shapeFile.codigoMapa = this.formGroup.controls.codigoMapa.value;
    this.shapeFile.resumoConteudo = this.formGroup.controls.resumoConteudo.value;
    this.shapeFile.dadosMapeados = this.formGroup.controls.dadosMapeados.value;
    this.shapeFile.escala = this.formGroup.controls.escala.value;
    this.shapeFile.pais = this.formGroup.controls.pais.value;
    this.shapeFile.cidades = this.formGroup.controls.cidades.value;
    this.shapeFile.estados = this.formGroup.controls.estados.value;
    this.shapeFile.cartografia = this.formGroup.controls.cartografia.value;
    this.shapeFile.latitude = this.formGroup.controls.latitude.value;
    this.shapeFile.longitude = this.formGroup.controls.longitude.value;
    this.shapeFile.atualizacao = this.formGroup.controls.atualizacao.value;
    this.shapeFile.ambiente = this.formGroup.controls.ambiente.value;
    this.shapeFile.codificacao = this.formGroup.controls.codificacao.value;
    this.shapeFile.exibirAuto = this.formGroup.controls.exibirAuto.value === 'sim' ? true : false;
    this.salvarArquivos()

  }
  
  salvarArquivos() {
    if (this.arquivoKml && !this.arquivoShp && !this.arquivoDbf && !this.arquivoShx) {
      this.shapeFileService.salvarKml(this.shapeFile, this.arquivoKml).subscribe(response => {
        this.dialog.closeAll();
        if(response['shapePertenceAPrefeitura'] && !response['temIntersecacoNaAreaDaPrefeitura']) {
          this.mostrarAlertaShapeForaDoMunicipio();
        } else {
          this.mostrarAlertaShapeSalvo();
        }
  
        this.loading = false;
        this.router.navigate(['/planejamento-integrado/cadastro-shapefile']);
      }, error => {
        this.loading = false;
        PcsUtil.swal().fire('Não foi possível cadastrar essa camada', `${error.error.message}`, 'error');
        this.dialog.closeAll();
      });

    } 
    else if (this.arquivoShp || this.arquivoShx) {
      this.shapeFileService.salvarVetorial(this.shapeFile, this.arquivoShp, this.arquivoDbf, this.arquivoShx).subscribe(response => {
        this.dialog.closeAll();
        if(response['shapePertenceAPrefeitura'] && !response['temIntersecacoNaAreaDaPrefeitura']) {
          this.mostrarAlertaShapeForaDoMunicipio();
        } else {
          this.mostrarAlertaShapeSalvo();
        }
  
        this.loading = false;
        this.router.navigate(['/planejamento-integrado/cadastro-shapefile']);
      }, error => {
        this.loading = false;
        PcsUtil.swal().fire('Não foi possível cadastrar essa camada', `${error.error.message}`, 'error');
        this.dialog.closeAll();
      });
    }
    else {
      PcsUtil.swal().fire('Não foi possível cadastrar essa camada', `É necessário carregar os arquivos da camada.`, 'error');
    }
  }

  public mostrarAlertaShapeSalvo() {
    PcsUtil.swal().fire({
      title: 'Cadastro de Shapefile',
      text: `Shapefile cadastrado com sucesso`,
      type: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then((result) => {
      this.loading = false;
      this.router.navigate(['/planejamento-integrado/cadastro-shapefile']);
    }, error => {this.loading = false; });
  }

  public mostrarAlertaShapeForaDoMunicipio() {
    PcsUtil.swal().fire({
      title: 'Shape fora dos limites do município',
      text: 'O shape foi salvo, porém se encontra fora dos limites do município.',
      type: 'warning',
      showCancelButton: false,
      confirmButtonText: 'Ok',
    }).then(() => {
      this.loading = false;
      this.router.navigate(['/planejamento-integrado/cadastro-shapefile']);
    });
  }

  public carregarArquivoRaster(event) {
    this.arquivosCarregados = [];
    this.arquivoTiff = event.target.files[0];
    this.arquivosCarregados.push(this.arquivoTiff.name);
  }

  private salvarRaster() {
    this.loading = true;
    this.shapeFile.ano = this.formGroup.controls.ano.value;
    this.shapeFile.titulo = this.formGroup.controls.titulo.value;
    this.shapeFile.areasInteresse = this.formGroup.controls.areaInteresse.value;
    this.shapeFile.instituicao = this.formGroup.controls.instituicao.value;
    this.shapeFile.fonte = this.formGroup.controls.fonte.value;
    this.shapeFile.sistemaDeReferencia = this.formGroup.controls.sistemaDeReferencia.value;
    this.shapeFile.tipoArquivo = this.formGroup.controls.tipoArquivo.value;
    this.shapeFile.nivelTerritorial = this.formGroup.controls.nivelTerritorial.value;
    this.shapeFile.regiao = this.formGroup.controls.regiao.value;
    this.shapeFile.publicar = this.formGroup.controls.publicar.value === 'sim' ? true : false;
    this.shapeFile.temaGeoespacial = this.formGroup.controls.temaGeoespacial.value;
    this.shapeFile.exibirAuto = this.formGroup.controls.exibirAuto.value === 'sim' ? true : false;

    this.shapeFileService.salvarRaster(this.shapeFile, this.arquivoTiff).subscribe(response => {
      PcsUtil.swal().fire({
        title: 'Cadastro de Shapefile',
        text: `Shapefile cadastrado com sucesso`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
        this.router.navigate(['/planejamento-integrado/cadastro-shapefile']);
      }, error => {this.loading = false; });
      this.loading = false;
      this.router.navigate(['/planejamento-integrado/cadastro-shapefile']);
    }, error => {this.loading = false; });
  }

  public limparArquivosCarregados() {
    this.arquivosCarregados = [];
  }

  public salvarCamposShapeFile() {
    if (!this.formGroup.valid) {
      PcsUtil.swal().fire({
        title: 'Formulário inválido',
        text: `Preencha o formulário corretamente`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      });
    }
    this.salvarShapeFile();
  }

  private salvarShapeFile() {
    this.loading = true;

    this.shapeFile.ano = this.formGroup.controls.ano.value;
    this.shapeFile.titulo = this.formGroup.controls.titulo.value;
    this.shapeFile.areasInteresse = this.formGroup.controls.areaInteresse.value;
    this.shapeFile.instituicao = this.formGroup.controls.instituicao.value;
    this.shapeFile.fonte = this.formGroup.controls.fonte.value;
    this.shapeFile.sistemaDeReferencia = this.formGroup.controls.sistemaDeReferencia.value;
    this.shapeFile.tipoArquivo = this.formGroup.controls.tipoArquivo.value;
    this.shapeFile.nivelTerritorial = this.formGroup.controls.nivelTerritorial.value;
    this.shapeFile.regiao = this.formGroup.controls.regiao.value;
    this.shapeFile.publicar = this.formGroup.controls.publicar.value === 'sim' ? true : false;
    this.shapeFile.temaGeoespacial = this.formGroup.controls.temaGeoespacial.value;
    this.shapeFile.eixos = this.formGroup.controls.eixos.value;
    this.shapeFile.ods = this.formGroup.controls.ods.value;
    this.shapeFile.metas = this.formGroup.controls.metas.value;
    this.shapeFile.indicadores = this.formGroup.controls.indicadores.value;
    this.shapeFile.palavra = this.formGroup.controls.palavra.value;
    this.shapeFile.mosaico = this.formGroup.controls.mosaico.value;
    this.shapeFile.codigoFolha = this.formGroup.controls.codigoFolha.value;
    this.shapeFile.integridade = this.formGroup.controls.integridade.value;
    this.shapeFile.codigoMapa = this.formGroup.controls.codigoMapa.value;
    this.shapeFile.resumoConteudo = this.formGroup.controls.resumoConteudo.value;
    this.shapeFile.dadosMapeados = this.formGroup.controls.dadosMapeados.value;
    this.shapeFile.escala = this.formGroup.controls.escala.value;
    this.shapeFile.pais = this.formGroup.controls.pais.value;
    this.shapeFile.cidades = this.formGroup.controls.cidades.value;
    this.shapeFile.estados = this.formGroup.controls.estados.value;
    this.shapeFile.cartografia = this.formGroup.controls.cartografia.value;
    this.shapeFile.latitude = this.formGroup.controls.latitude.value;
    this.shapeFile.longitude = this.formGroup.controls.longitude.value;
    this.shapeFile.atualizacao = this.formGroup.controls.atualizacao.value;
    this.shapeFile.ambiente = this.formGroup.controls.ambiente.value;
    this.shapeFile.codificacao = this.formGroup.controls.codificacao.value;
    this.shapeFile.exibirAuto = this.formGroup.controls.exibirAuto.value === 'sim' ? true : false;

    this.shapeFileService.editarCamposShapeFile(this.shapeFile).subscribe(response => {
      this.loading = false;
      this.dialog.closeAll();
      PcsUtil.swal().fire({
        title: 'Campos do Shapefile',
        text: `Campos do Shapefile alterado com sucesso`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
        this.dialog.closeAll();
      }, error => {
        this.loading = false; 
        this.dialog.closeAll();
      });
      this.router.navigate(['/planejamento-integrado/cadastro-shapefile']);
    });
  }

  alerta(titulo, tipo) {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: titulo,
      type: tipo,
      reverseButtons: true
    });
  }

  buscarEixo() {
    this.eixoService.buscarEixosParaCombo(true).subscribe(res => {
      this.eixos = res;
    });
  }
  buscarOds() {
    this.odsService.buscarOdsComboComMetas().subscribe(res2 => {
      this.ods = res2;
      this.todosOds = res2;
    });
  }

  tradeEixo(eixoSelecionado: any) {
    this.ods = [];
    this.metas = [];
    if ( eixoSelecionado == null || eixoSelecionado.length === 0) {
      this.ods = this.todosOds;
    } else {
      this.geraListaODS(eixoSelecionado);
    }
  }

  tradeOds(odsSelecionada) {
    this.metas = [];
    odsSelecionada.forEach(id_ods => {
      const ods = this.todosOds.filter(x => x.id === id_ods);
      ods[0].metas.forEach(x => {
        this.metas.push(x);
      });
      this.metas.sort((a, b) => a.numero < b.numero ? -1 : (a.numero > b.numero ? 1 : 0 ));
    });
  }

  geraListaODS(eixoSelecionado) {
    eixoSelecionado.forEach(idEixo => {
      const eixo = this.eixos.filter(x => x.id === idEixo);
      eixo[0].listaODS.forEach(ods => {
        let existe = false;
        for (const o of this.ods) {
          if (o.id == ods.id ) {
            existe = true;
            break;
          }
        }
        if (!existe) {
          this.ods.push(ods);
        }
      });
      this.ods.sort((a, b) => a.id - b.id);
    });
  }

  public populaComboIndicador() {
    this.indicadorService.buscarIndicadoresPcsParaCombo()
      .subscribe(response => {
        this.listaIndicadores = response;
        this.listaIndicadores.sort((a, b) => a.nome < b.nome ? -1 : (a.nome > b.nome ? 1 : 0 ));
      });
  }

  public exibirCampoFolhaMosaico() {
    this.exibirFolhaMosaico = !this.formGroup.controls.mosaico.value;
  }

  private montarComboBox(response: ShapeFile) {
    if (response.pais) {
      this.estadoService.buscarProvinciaEstadoComboPorPais(response.pais).subscribe(res => { this.estados = res as ItemCombo[]; });
    }
    if (response.estados.length > 0) {
      this.cidadesService.buscarCidadeParaComboPorListaIdsEstados(response.estados).subscribe(res => { this.cidadesComboFiltrada = res as ItemCombo[]; });
    }
  }

  public buscarPais() {
    this.paisesService.buscarPaisesCombo()
    .subscribe(res => this.paisesCombo = res);
  }

  public onPaisChange(event: any) {
    if (event.value) {
      this.estadoService.buscarProvinciaEstadoComboPorPais(event.value).subscribe(res => {
        this.estados = res as ItemCombo[];
      });
    } else {
      this.estados = [];
      this.cidadesComboFiltrada = [];
      this.formGroup.controls.estados.setValue(null);
      this.formGroup.controls.cidades.setValue(null);
    }
  }

  onEstadoChange(event: any) {
    if (!event) {
      if (this.formGroup.controls.estados.value.length > 0) {
        this.cidadesService.buscarCidadeParaComboPorListaIdsEstados(this.formGroup.controls.estados.value).subscribe(res => {
          this.cidadesComboFiltrada = res as ItemCombo[];
        });
      } else {
        this.cidadesComboFiltrada = [];
        this.formGroup.controls.cidades.setValue(null);
      }
    }
  }

  private initListaAnos() {
    let anoInicio = 1500;
    this.listaAnos.push(anoInicio);
    for (var i = 1; i < 601; i++) {
      this.listaAnos.push(anoInicio + i);
    }
  }
}
