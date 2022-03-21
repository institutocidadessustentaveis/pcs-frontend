import { Title } from '@angular/platform-browser';
import { MaterialApoioService } from 'src/app/services/materialApoio.service';
import { AreaInteresse } from './../../../model/area-interesse';
import { ItemCombo } from './../../../model/ItemCombo ';
import { CidadeService } from './../../../services/cidade.service';
import { ProvinciaEstadoService } from './../../../services/provincia-estado.service';
import { PaisService } from './../../../services/pais.service';
import { FiltroMaterialApoio } from './../../../model/filtroMaterialApoio';
import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';

@Component({
  selector: 'app-material-apoio-principal',
  templateUrl: './material-apoio-principal.component.html',
  styleUrls: ['./material-apoio-principal.component.css']
})
export class MaterialApoioPrincipalComponent implements OnInit, OnChanges {

  public filtroMaterialApoio: FiltroMaterialApoio = new FiltroMaterialApoio();

  public formFiltro: FormGroup;

  public paisesCombo: Array<ItemCombo> = [];
  public provinciaEstadoCombo: Array<ItemCombo> = [];
  public cidadesCombo: Array<ItemCombo> = [];
  public areasInteresseCombo: Array<AreaInteresse> = [];
  public eixosCombo: Array<ItemCombo> = [];
  public indicadoresCombo: Array<any> = [];
  public odsCombo: Array<ItemCombo> = [];
  public metasOdsCombo: Array<ItemCombo> = [];

  public materiaisApoio: any = [];
  public habilitarRegiaoDoBrasil = false;
  public materiaisApoioVazio = true;
  public paginationLimit = 3;
  loading = false;

  constructor(
    public formBuilder: FormBuilder,
    private materialApoioService: MaterialApoioService,
    private provinciaEstadoService: ProvinciaEstadoService,
    private cidadeService: CidadeService,
    private indicadoresService: IndicadoresService,
    private metaOdsService: ObjetivoDesenvolvimentoSustentavelService,
    private titleService: Title,
  ) {
    this.formFiltro = this.formBuilder.group({
      idAreaInteresse: [null],
      idEixo: [null],
      idOds: [null],
      idMetasOds: [null],
      idIndicador: [null],
      idCidade: [null],
      regiao: [null],
      idProvinciaEstado: [null],
      idPais: [null],
      continente: [null],
      populacaoMin: [null],
      populacaoMax: [null],
      palavraChave: [null]
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Materiais de Apoio - Cidades Sustentáveis');
    this.carregarCombos();
    this.buscarMaterialApoio();
  }

  ngOnChanges() {
  }

  public carregarCombos() {
    this.materialApoioService.carregarCombosMaterialApoio().subscribe(response => {
      this.paisesCombo = response.listaPaises as ItemCombo[];
      this.areasInteresseCombo = response.listaAreasInteresse as AreaInteresse[];
      this.eixosCombo = response.listaEixos as ItemCombo[];
      this.odsCombo = response.listaOds as ItemCombo[];
    });
  }
  public onPaisChange(event: any) {
    //ID 1 == Brasil
    if(event.value === 1) {
      this.habilitarRegiaoDoBrasil = true;
    }
    else {
      this.formFiltro.controls.regiao.setValue("");
      this.habilitarRegiaoDoBrasil = false;
    }
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

  onEixoChange(event:any){
    if(!event && this.formFiltro.controls['idEixo'].value){      
      this.indicadoresService.buscarIndicadoresPorIdEixoItemCombo(this.formFiltro.controls['idEixo'].value).subscribe(res => {
        this.indicadoresCombo = res as ItemCombo[];
      })
    }

    if(!event && !this.formFiltro.controls['idEixo'].value){
      this.indicadoresCombo = [];
    }
  }

  onOdsChange(event:any){
    if(!event && this.formFiltro.controls['idOds'].value){      
      this.metaOdsService.buscarMetaOdsPorIdOdsItemCombo(this.formFiltro.controls['idOds'].value).subscribe(res => {
        this.metasOdsCombo = res as ItemCombo[];
      })
    }

    if(!event && !this.formFiltro.controls['idOds'].value){
      this.metasOdsCombo = [];
    }

  }

  limparFiltro(){
    this.filtroMaterialApoio = new FiltroMaterialApoio();
    this.formFiltro.controls.idAreaInteresse.setValue(null);
    this.formFiltro.controls.idEixo.setValue(null);
    this.formFiltro.controls.idOds.setValue(null);
    this.formFiltro.controls.idMetasOds.setValue(null);
    this.formFiltro.controls.idIndicador.setValue(null);
    this.formFiltro.controls.idCidade.setValue(null);
    this.formFiltro.controls.regiao.setValue(null);
    this.formFiltro.controls.idProvinciaEstado.setValue(null);
    this.formFiltro.controls.idPais.setValue(null);
    this.formFiltro.controls.continente.setValue(null);
    this.formFiltro.controls.populacaoMin.setValue(null);
    this.formFiltro.controls.populacaoMax.setValue(null);
    this.formFiltro.controls.palavraChave.setValue(null);
  }

  buscarMaterialApoio() {
    this.paginationLimit = 3;
    this.filtroMaterialApoio.idAreaInteresse = this.formFiltro.controls['idAreaInteresse'].value;
    this.filtroMaterialApoio.idEixo = this.formFiltro.controls['idEixo'].value;
    this.filtroMaterialApoio.idOds = this.formFiltro.controls['idOds'].value;
    this.filtroMaterialApoio.idMetasOds = this.formFiltro.controls['idMetasOds'].value;
    this.filtroMaterialApoio.idIndicador = this.formFiltro.controls['idIndicador'].value;
    this.filtroMaterialApoio.idCidade = this.formFiltro.controls['idCidade'].value;
    this.filtroMaterialApoio.regiao = this.formFiltro.controls['regiao'].value;
    this.filtroMaterialApoio.idProvinciaEstado = this.formFiltro.controls['idProvinciaEstado'].value;
    this.filtroMaterialApoio.idPais = this.formFiltro.controls['idPais'].value;
    this.filtroMaterialApoio.continente = this.formFiltro.controls['continente'].value;
    this.filtroMaterialApoio.populacaoMin = this.formFiltro.controls['populacaoMin'].value;
    this.filtroMaterialApoio.populacaoMax = this.formFiltro.controls['populacaoMax'].value;
    this.filtroMaterialApoio.palavraChave = this.formFiltro.controls['palavraChave'].value;

    this.materialApoioService.buscarMaterialApoioFiltrado(this.filtroMaterialApoio).subscribe(
      res => {
        this.materiaisApoio = res.reverse();
        this.varificaSeExisteInformação();
      }
    );
  }

  private varificaSeExisteInformação() {
    if (this.materiaisApoio.length > 0 ) {
      this.materiaisApoioVazio = false;
    } else {
      this.materiaisApoioVazio = true;
    }
  }

  carregarMaisNoticias() {
    this.paginationLimit += 3;
  }

}
