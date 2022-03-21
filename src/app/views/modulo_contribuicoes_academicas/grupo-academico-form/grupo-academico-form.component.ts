import { Biblioteca } from './../../../model/biblioteca';
import { BibliotecaService } from './../../../services/bibliotecaService';
import { EixoService } from './../../../services/eixo.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisService } from 'src/app/services/pais.service';
import { Pais } from 'src/app/model/pais';
import { CidadeService } from 'src/app/services/cidade.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { Eixo } from 'src/app/model/eixo';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { GrupoAcademico } from 'src/app/model/grupo-academico';
import { GrupoAcademicoService } from 'src/app/services/grupo-academico.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import * as L from 'leaflet';
import { latLng, tileLayer, circleMarker, marker, icon } from 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { environment } from 'src/environments/environment';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-grupo-academico-form',
  templateUrl: './grupo-academico-form.component.html',
  styleUrls: ['./grupo-academico-form.component.css']
})
export class GrupoAcademicoFormComponent implements OnInit {
  public usuario: Usuario;
  public editorConfig: any;
  public tipos: Array<String>;
  public modoCadastro: String;
  public paisCombo: Array<Pais>;
  public eixosCombo: Array<Eixo>;
  public estados: Array<ItemCombo>;
  public estadosApl: Array<ItemCombo>;
  public continentes: Array<String>;
  public segundoFormGrupo: FormGroup;
  public tiposFundacao: Array<String>;
  public tiposCadastro: Array<String>;
  public primeiroFormGrupo: FormGroup;
  public cidadesApl: Array<ItemCombo>;
  public portesEmpresa: Array<String>;
  public participaApl: boolean = true;
  public setoresEconomicos: Array<String>;
  public mostrarTipoFundacao: boolean = false;
  public cidadesComboFiltrada: Array<ItemCombo>;
  public cidadesAplComboFiltrada: Array<ItemCombo>;
  public areasIntesseCombo: Array<AreaInteresse>;
  public odsCombo: Array<ObjetivoDesenvolvimentoSustentavel>;
  public grupoAcademico: GrupoAcademico = new GrupoAcademico();
  public bibliotecasCombo: Array<Biblioteca>;
  public listaCidadesAplSelecionadas: Array<ItemCombo> = [];

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
    };

    layersControl = [
      circleMarker([ -15.03144, -53.09227], { radius: 10, fillColor: 'red', color: 'red', fillOpacity: 1, weight: 1 })
    ];
    scrollUp: any;

    constructor(
    private router: Router,
    private titleService: Title,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private paisService: PaisService,
    private eixoService: EixoService,
    private cidadeService: CidadeService,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private estadoService: ProvinciaEstadoService,
    private areaInteresseService: AreaInteresseService,
    private grupoAcademicoService: GrupoAcademicoService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private bibliotecaService: BibliotecaService,
  ) {
    this.primeiroFormGrupo = this.formBuilder.group({
      ods: [null],
      eixos: [null],
      endereco: [null],
      complemento: [null],
      nomeContato: [null],
      observacoes: [null],
      paginaOnline: [null],
      linkBaseDados: [null],
      areasInteresse: [null],
      telefoneContato: [null],
      descricaoInstituicao: [null],
      telefoneInstitucional: [null],
      experienciasDesenvolvidas: [null],
      pais: [null, Validators.required],
      estado: [null, Validators.required],
      cidade: [null, Validators.required],
      numero: [null, Validators.required],
      latitude: [null, Validators.required],
      longitude: [null, Validators.required],
      emailContato: [null, Validators.email],
      nomeGrupo: [null, Validators.required],
      logradouro: [null, Validators.required],
      continente: [null, Validators.required],
      tipoCadastro: [null, Validators.required],
      emailInstitucional: [null, Validators.email],
    });

    this.segundoFormGrupo = this.formBuilder.group({
      vinculo: [null],
      nomeApl: [null],
      paisApl: [null],
      estadoApl: [null],
      setoresApl: [null],
      cidadesApl: [null],
      nomeAcademia: [null],
      bibliotecas: [null],
      descricaoApl: [null],
      porteEmpresa: [null],
      receitaAnual: [null],
      participaApl: [true],
      tipoFundacao: [null],
      setorEconomico: [null],
      associadaEthos: [null],
      tipoInstituicao: [null],
      quantidadeAlunos: [null, Validators.pattern('[0-9]+([0-9]+)?')],
      tipoFundacaoSelect: [null],
      quantidadeFuncionarios: [null],
      atuaProjetoSustentabilidade: [null],
    })

    this.tiposFundacao = ['Comunitária', 'Empresarial', 'Familiar', 'Outro']
    this.setoresEconomicos = ['Comercial', 'Rural', 'Industrial', 'Serviços']
    this.tiposCadastro = ['Empresa', 'Fundação Empresarial', 'Grupo Acadêmico']
    this.continentes = ['América', 'Europa', 'Ásia', 'África', 'Oceania', 'Antártida']
    this.tipos = ['Institutos e Centros de Pesquisa', 'Instituições de Ensino Médio', 'Instituições de Ensino Superior', 'Outras Instituições']
    this.portesEmpresa = ['Microempreendedor Individual (MEI)', 'Microempresa (ME)', 'Empresa de Pequeno Porte (EPP)', 'Empresa de Médio a Grande Porte']
    this.editorConfig = {
      height: '200px',
      toolbar: [
        ['misc', ['undo', 'redo']],
        ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
        ['fontsize', []],
        ['para', ['style0', 'ul', 'ol']],
        ['insert', ['table', 'link']],
        ['view', ['fullscreen']]
      ],
      fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
      callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
    };

   }

  ngOnInit() {
    this.titleService.setTitle("Formulário de Grupo Acadêmico - Cidades Susntentáveis")
    this.buscarGrupoAcademico()
    this.carregarCombos();
    this.ajustarMapa();
  }



  public carregarCombos() {
    this.buscarUsuario();
    this.carregarOdsCombo()
    this.carregarCidedesApl()
    this.carregarEixosCombo();
    this.carregarPaisesCombo();
    this.carregarAreasInteresseCombo();
    this.carregarBibliotecasCombo();
  }

  public definirValidatorsSegundoForm() {
    this.segundoFormGrupo.controls.porteEmpresa.setValidators([])
    this.segundoFormGrupo.controls.setorEconomico.setValidators([])
    this.segundoFormGrupo.controls.tipoInstituicao.setValidators([])
    this.segundoFormGrupo.controls.tipoFundacaoSelect.setValidators([])
    if (this.modoCadastro == "Grupo Acadêmico") {
      this.segundoFormGrupo.controls.tipoInstituicao.setValidators([Validators.required])
    }
    if (this.modoCadastro == "Fundação Empresarial") {
      this.segundoFormGrupo.controls.porteEmpresa.setValidators([Validators.required])
      this.segundoFormGrupo.controls.tipoFundacaoSelect.setValidators([Validators.required])
    }
    if (this.modoCadastro == "Empresa") {
      this.segundoFormGrupo.controls.porteEmpresa.setValidators([Validators.required])
      this.segundoFormGrupo.controls.setorEconomico.setValidators([Validators.required])
    }
  }

  public buscarUsuario() {
    this.usuarioService.buscarUsuarioLogado().subscribe( usuario => {
      this.usuario = usuario;
    })
  }

  public carregarCidedesApl() {
    this.cidadeService.buscarCidadeComboBox().subscribe(cidades => {
      this.cidadesApl = cidades;
    })
  }

  public onParticipaAplChange(event) {
    this.participaApl = event;
    if (this.participaApl == false) {
      this.segundoFormGrupo.controls.nomeApl.setValue(null)
      this.segundoFormGrupo.controls.setoresApl.setValue(null)
      this.segundoFormGrupo.controls.cidadesApl.setValue(null)
      this.segundoFormGrupo.controls.descricaoApl.setValue(null)
      this.segundoFormGrupo.controls.nomeApl.setValidators([])
    }
    else {
      this.segundoFormGrupo.controls.nomeApl.setValidators([Validators.required])
    }
  }

  public onTipoFundacaoChange(event) {
    if (event == 'Outro') {
      this.mostrarTipoFundacao = true;
      this.segundoFormGrupo.controls.tipoFundacao.setValidators([Validators.required])
    }
    else {
      this.mostrarTipoFundacao = false;
    }
  }

  public carregarPaisesCombo() {
    this.paisService.buscarPaisesCombo()
    .subscribe (paises => this.paisCombo = paises);
  }

  public carregarAreasInteresseCombo() {
    this.areaInteresseService.buscaAreasInteresses()
    .subscribe(areas => this.areasIntesseCombo = areas);
  }

  public carregarEixosCombo() {
    this.eixoService.buscarEixosParaCombo(false)
    .subscribe(eixos => this.eixosCombo = eixos);
  }

  public carregarBibliotecasCombo() {
    this.bibliotecaService.buscarBibliotecasParaComboBox()
    .subscribe(bibliotecas => {
      this.bibliotecasCombo = bibliotecas;
    });
  }

  public carregarOdsCombo() {
    this.odsService.buscarOdsCombo()
    .subscribe(ods => this.odsCombo = ods)
  }

  public carregarEstadoECidadeApl(){
    if(this.segundoFormGrupo.controls.paisApl.value){
      this.onPaisAplChange();
    }

    if(this.segundoFormGrupo.controls.estadoApl.value){
      this.onEstadoAplChange();
    }
  }

  public carregarEstadoECidade(){
    if(this.primeiroFormGrupo.controls.pais.value){
      this.onPaisChange();
    }

    if(this.primeiroFormGrupo.controls.estado.value){
      this.onEstadoChange();
    }
  }

  public onTipoCadastroChange(value){
    this.modoCadastro = value;
    this.definirValidatorsSegundoForm();

  }

  public buscarGrupoAcademico() {
    this.activatedRoute.params.subscribe( params => {
      let id = params.id;
      if (id) {
        this.grupoAcademicoService.buscarGrupoAcademicoPorId(id).subscribe( grupoAcademico => {
          this.grupoAcademico = grupoAcademico as GrupoAcademico;
          
          this.carregarAtributos();
          this.titleService.setTitle(`Grupo Acadêmico - ${this.grupoAcademico.nomeGrupo} - Cidades Sustentáveis`)
        }, error => { this.router.navigate(['/colaboracoes-academicas/grupos-academicos/administracao']); });
      }
    }, error => {
      this.router.navigate(['/colaboracoes-academicas/grupos-academicos/administracao']);
    });
  }

  public carregarAtributos() {
    this.modoCadastro = this.grupoAcademico.tipoCadastro
    this.primeiroFormGrupo.controls.ods.setValue(this.grupoAcademico.ods)
    this.primeiroFormGrupo.controls.pais.setValue(this.grupoAcademico.pais)
    this.primeiroFormGrupo.controls.eixos.setValue(this.grupoAcademico.eixos)
    this.primeiroFormGrupo.controls.numero.setValue(this.grupoAcademico.numero)
    this.primeiroFormGrupo.controls.estado.setValue(this.grupoAcademico.estado)
    this.primeiroFormGrupo.controls.cidade.setValue(this.grupoAcademico.cidade)
    this.primeiroFormGrupo.controls.endereco.setValue(this.grupoAcademico.endereco)
    this.primeiroFormGrupo.controls.latitude.setValue(this.grupoAcademico.latitude)
    this.primeiroFormGrupo.controls.nomeGrupo.setValue(this.grupoAcademico.nomeGrupo)
    this.primeiroFormGrupo.controls.longitude.setValue(this.grupoAcademico.longitude)
    this.primeiroFormGrupo.controls.continente.setValue(this.grupoAcademico.continente)
    this.primeiroFormGrupo.controls.logradouro.setValue(this.grupoAcademico.logradouro)
    this.primeiroFormGrupo.controls.complemento.setValue(this.grupoAcademico.complemento)
    this.primeiroFormGrupo.controls.observacoes.setValue(this.grupoAcademico.observacoes)
    this.primeiroFormGrupo.controls.nomeContato.setValue(this.grupoAcademico.nomeContato)
    this.primeiroFormGrupo.controls.tipoCadastro.setValue(this.grupoAcademico.tipoCadastro)
    this.primeiroFormGrupo.controls.emailContato.setValue(this.grupoAcademico.emailContato)
    this.primeiroFormGrupo.controls.paginaOnline.setValue(this.grupoAcademico.paginaOnline)
    this.primeiroFormGrupo.controls.linkBaseDados.setValue(this.grupoAcademico.linkBaseDados)
    this.primeiroFormGrupo.controls.areasInteresse.setValue(this.grupoAcademico.areasInteresse)
    this.primeiroFormGrupo.controls.telefoneContato.setValue(this.grupoAcademico.telefoneContato)
    this.primeiroFormGrupo.controls.emailInstitucional.setValue(this.grupoAcademico.emailInstitucional)
    this.primeiroFormGrupo.controls.descricaoInstituicao.setValue(this.grupoAcademico.descricaoInstituicao)
    this.primeiroFormGrupo.controls.telefoneInstitucional.setValue(this.grupoAcademico.telefoneInstitucional)
    this.primeiroFormGrupo.controls.experienciasDesenvolvidas.setValue(this.grupoAcademico.experienciasDesenvolvidas)    
    
    this.segundoFormGrupo.controls.nomeApl.setValue(this.grupoAcademico.nomeApl)
    this.segundoFormGrupo.controls.vinculo.setValue(this.grupoAcademico.vinculo)
    this.segundoFormGrupo.controls.paisApl.setValue(this.grupoAcademico.paisApl)
    this.segundoFormGrupo.controls.estadoApl.setValue(this.grupoAcademico.estadoApl)
    this.segundoFormGrupo.controls.tipoInstituicao.setValue(this.grupoAcademico.tipo)
    this.segundoFormGrupo.controls.setoresApl.setValue(this.grupoAcademico.setoresApl)
    this.segundoFormGrupo.controls.cidadesApl.setValue(this.grupoAcademico.cidadesApl)
    this.segundoFormGrupo.controls.bibliotecas.setValue(this.grupoAcademico.bibliotecas)
    this.segundoFormGrupo.controls.descricaoApl.setValue(this.grupoAcademico.descricaoApl)
    this.segundoFormGrupo.controls.nomeAcademia.setValue(this.grupoAcademico.nomeAcademia)
    this.segundoFormGrupo.controls.participaApl.setValue(this.grupoAcademico.participaApl)
    this.segundoFormGrupo.controls.porteEmpresa.setValue(this.grupoAcademico.porteEmpresa)
    this.segundoFormGrupo.controls.receitaAnual.setValue(this.grupoAcademico.receitaAnual)
    this.segundoFormGrupo.controls.setorEconomico.setValue(this.grupoAcademico.setorEconomico)
    this.segundoFormGrupo.controls.associadaEthos.setValue(this.grupoAcademico.associadaEthos)
    this.segundoFormGrupo.controls.quantidadeAlunos.setValue(this.grupoAcademico.quantidadeAlunos)
    this.segundoFormGrupo.controls.quantidadeFuncionarios.setValue(this.grupoAcademico.quantidadeFuncionarios)
    this.segundoFormGrupo.controls.atuaProjetoSustentabilidade.setValue(this.grupoAcademico.atuaProjetoSustentabilidade)
    if (this.grupoAcademico.tipoFundacao != 'Comunitária' && this.grupoAcademico.tipoFundacao != 'Empresarial' && this.grupoAcademico.tipoFundacao != 'Familiar') {
      this.segundoFormGrupo.controls.tipoFundacaoSelect.setValue('Outro')
      this.segundoFormGrupo.controls.tipoFundacao.setValue(this.grupoAcademico.tipoFundacao)
    }
    else {
      this.segundoFormGrupo.controls.tipoFundacaoSelect.setValue(this.grupoAcademico.tipoFundacao)
    }

    this.addMarkerOnMap(this.grupoAcademico.latitude, this.grupoAcademico.longitude)
    this.carregarEstadoECidade();
    this.carregarEstadoECidadeApl();
  }

  public onPaisChange() {
    this.estadoService.buscarProvinciaEstadoComboPorPais(this.primeiroFormGrupo.controls.pais.value).subscribe(res => {
      this.estados = res;
      this.cidadesComboFiltrada = [];
    })
  }

  public onPaisAplChange() {
    this.estadoService.buscarProvinciaEstadoComboPorPais(this.segundoFormGrupo.controls.paisApl.value).subscribe(res => {
      this.estadosApl = res;
      this.cidadesAplComboFiltrada = [];
    })
  }

  public onEstadoChange() {
    this.cidadeService.buscarCidadeParaComboPorIdEstado(this.primeiroFormGrupo.controls.estado.value).subscribe(res => {
      this.cidadesComboFiltrada = res;
    })
  }

  public onEstadoAplChange() {
    this.cidadeService.buscarCidadeParaComboPorIdEstado(this.segundoFormGrupo.controls.estadoApl.value).subscribe(res => {
      this.cidadesAplComboFiltrada = res;
    })
  }

  removerVirgula(numeroAlunos: any) {
    if (numeroAlunos != null) {
      numeroAlunos = numeroAlunos.toString().replace(',', '')
      numeroAlunos = numeroAlunos.toString().replace('.', '')
      return parseFloat(numeroAlunos)
    }
    return null
  }


  public salvar() {
    if (this.primeiroFormGrupo.valid && this.segundoFormGrupo.valid) {
      
      this.grupoAcademico.usuario = this.usuario.id
      this.grupoAcademico.ods = this.primeiroFormGrupo.controls.ods.value
      this.grupoAcademico.pais = this.primeiroFormGrupo.controls.pais.value
      this.grupoAcademico.eixos = this.primeiroFormGrupo.controls.eixos.value
      this.grupoAcademico.cidade = this.primeiroFormGrupo.controls.cidade.value
      this.grupoAcademico.estado = this.primeiroFormGrupo.controls.estado.value
      this.grupoAcademico.numero = this.primeiroFormGrupo.controls.numero.value
      this.grupoAcademico.latitude = this.primeiroFormGrupo.controls.latitude.value
      this.grupoAcademico.longitude = this.primeiroFormGrupo.controls.longitude.value
      this.grupoAcademico.nomeGrupo = this.primeiroFormGrupo.controls.nomeGrupo.value
      this.grupoAcademico.continente = this.primeiroFormGrupo.controls.continente.value
      this.grupoAcademico.logradouro = this.primeiroFormGrupo.controls.logradouro.value
      this.grupoAcademico.observacoes = this.primeiroFormGrupo.controls.observacoes.value
      this.grupoAcademico.complemento = this.primeiroFormGrupo.controls.complemento.value
      this.grupoAcademico.nomeContato = this.primeiroFormGrupo.controls.nomeContato.value
      this.grupoAcademico.emailContato = this.primeiroFormGrupo.controls.emailContato.value
      this.grupoAcademico.paginaOnline = this.primeiroFormGrupo.controls.paginaOnline.value
      this.grupoAcademico.tipoCadastro = this.primeiroFormGrupo.controls.tipoCadastro.value
      this.grupoAcademico.linkBaseDados = this.primeiroFormGrupo.controls.linkBaseDados.value
      this.grupoAcademico.areasInteresse = this.primeiroFormGrupo.controls.areasInteresse.value
      this.grupoAcademico.telefoneContato = this.primeiroFormGrupo.controls.telefoneContato.value
      this.grupoAcademico.emailInstitucional = this.primeiroFormGrupo.controls.emailInstitucional.value
      this.grupoAcademico.descricaoInstituicao = this.primeiroFormGrupo.controls.descricaoInstituicao.value
      this.grupoAcademico.telefoneInstitucional = this.primeiroFormGrupo.controls.telefoneInstitucional.value
      this.grupoAcademico.experienciasDesenvolvidas = this.primeiroFormGrupo.controls.experienciasDesenvolvidas.value

      this.grupoAcademico.nomeApl = this.segundoFormGrupo.controls.nomeApl.value
      this.grupoAcademico.paisApl = this.segundoFormGrupo.controls.paisApl.value
      this.grupoAcademico.vinculo = this.segundoFormGrupo.controls.vinculo.value
      this.grupoAcademico.estadoApl = this.segundoFormGrupo.controls.estadoApl.value
      this.grupoAcademico.tipo = this.segundoFormGrupo.controls.tipoInstituicao.value
      this.grupoAcademico.cidadesApl = this.segundoFormGrupo.controls.cidadesApl.value
      this.grupoAcademico.setoresApl = this.segundoFormGrupo.controls.setoresApl.value
      this.grupoAcademico.bibliotecas = this.segundoFormGrupo.controls.bibliotecas.value
      this.grupoAcademico.nomeAcademia = this.segundoFormGrupo.controls.nomeAcademia.value
      this.grupoAcademico.participaApl = this.segundoFormGrupo.controls.participaApl.value
      this.grupoAcademico.descricaoApl = this.segundoFormGrupo.controls.descricaoApl.value
      this.grupoAcademico.porteEmpresa = this.segundoFormGrupo.controls.porteEmpresa.value
      this.grupoAcademico.receitaAnual = this.segundoFormGrupo.controls.receitaAnual.value
      this.grupoAcademico.setorEconomico = this.segundoFormGrupo.controls.setorEconomico.value
      this.grupoAcademico.associadaEthos = this.segundoFormGrupo.controls.associadaEthos.value
      
      this.grupoAcademico.quantidadeAlunos = this.removerVirgula(this.segundoFormGrupo.controls.quantidadeAlunos.value)
      this.grupoAcademico.quantidadeFuncionarios = this.segundoFormGrupo.controls.quantidadeFuncionarios.value
      this.grupoAcademico.atuaProjetoSustentabilidade = this.segundoFormGrupo.controls.atuaProjetoSustentabilidade.value

      if (this.segundoFormGrupo.controls.tipoFundacao.value != null) {
        this.grupoAcademico.tipoFundacao = this.segundoFormGrupo.controls.tipoFundacao.value
      }
      else {
        this.grupoAcademico.tipoFundacao = this.segundoFormGrupo.controls.tipoFundacaoSelect.value;
      }

      if(this.grupoAcademico.id) {
        this.editar();
      } else {
        this.cadastrar();
      }
      
    }
  }

  public cadastrar() {
    this.grupoAcademicoService.cadastrarGrupoAcademico(this.grupoAcademico).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Grupo Acadêmico',
        text: `Grupo Acadêmico Cadastrado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/colaboracoes-academicas/grupos-academicos/administracao']);
      }, error => { });
    });
  }

  public editar() {
    this.grupoAcademicoService.editarGrupoAcademico(this.grupoAcademico).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Grupo Acadêmico',
        text: `Grupo Acadêmico Editado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/colaboracoes-academicas/grupos-academicos/administracao']);
      }, error => { });
    });
  }

  public onMapReady(map: L.Map) {
    this.map = map;
    map.on('click', (e) => {
      this.addMarkerOnMap(e.latlng.lat, e.latlng.lng);

      this.primeiroFormGrupo.controls.latitude.setValue(e.latlng.lat);
      this.primeiroFormGrupo.controls.longitude.setValue(e.latlng.lng);
    });
  }

  public addMarkerOnMap(latitude: number, longitude: number) {
    let options = { radius: 10, fillColor: 'red', color: 'red', fillOpacity: 1, weight: 1 };
    let marker: circleMarker = circleMarker([ latitude, longitude], options);

    this.layersControl = [];
    this.layersControl.push(marker);
  }

  public limparMapa() {
    this.layersControl = [];
  }

  public focarPonto(lat: number, long: number) {
    this.map.panTo(new L.LatLng(lat, long));

    setTimeout(() => {
      this.map.setZoomAround(new L.LatLng(lat, long), 4);
    }, 300);
  }

  public selecionarCidadeBusca(lat: number, long: number) {
    this.addMarkerOnMap(lat, long);
  }

  public preencherLatLong(lat, long) {
    this.primeiroFormGrupo.controls.latitude.setValue(lat);
    this.primeiroFormGrupo.controls.longitude.setValue(long);
  }

  public buscarCidadeMapa() {
    if (this.primeiroFormGrupo.controls.logradouro.value !== null && this.primeiroFormGrupo.controls.numero.value != null) {

      this.loadingBuscaCidade = true;

      this.provider.search({query: this.primeiroFormGrupo.controls.logradouro.value + ' ' + this.primeiroFormGrupo.controls.numero.value}).then((resultados) => {
        if(resultados.length > 0) {
          this.limparMapa();
          this.desenharMarcadoresCidadesEncontradas(resultados);
          this.focarPonto(resultados[0]['y'], resultados[0]['x']);
          this.preencherLatLong(resultados[0]['y'], resultados[0]['x']);

          this.loadingBuscaCidade = false;
        } else {
          PcsUtil.swal().fire({
            title: 'Não foi possível encontrar nenhuma cidade',
            text: `Não foi possível encontrar localidades chamadas '${this.primeiroFormGrupo.controls.endereco.value}'. Verifique a grafia e tente novamente.`,
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

  public desenharMarcadoresCidadesEncontradas(cidades: any[]) {
    if (cidades === undefined) {
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
        this.preencherLatLong(cidade['y'], cidade['x']);
      })

      point.on('mouseover', (e) => {
        e.target.openPopup();
      })

      point.on('mouseout', (e) => {
        e.target.closePopup();
      })

      this.layersControl.push(point);
    }
  }
  openSnackBar() {
    if (!this.primeiroFormGrupo.valid) {
      this._snackBar.open("Preencha todos os campos corretamente.", "", {
        duration: 4000,
      });
    }
  }

  ajustarMapa() {
    setTimeout(() => {
      this.map.invalidateSize();
    }, 300);
  }

  public debilitarBtnSalvar() : boolean {
    if(this.primeiroFormGrupo.valid && this.segundoFormGrupo.valid) {
      return false;
    } else {
      return true;
    }
  }
}
