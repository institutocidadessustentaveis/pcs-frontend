import { GrupoAcademicoService } from 'src/app/services/grupo-academico.service';
import { Component, OnInit } from '@angular/core';
import { FiltroGrupoAcademico } from 'src/app/model/filtroGrupoAcademico';
import { Eixo } from 'src/app/model/eixo';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { EixoService } from 'src/app/services/eixo.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { PaisService } from 'src/app/services/pais.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contribuicoes-academicas-principal',
  templateUrl: './contribuicoes-academicas-principal.component.html',
  styleUrls: ['./contribuicoes-academicas-principal.component.css']
})
export class ContribuicoesAcademicasPrincipalComponent implements OnInit {
  public paginationLimit = 3;
  public formFiltro: FormGroup;
  public idsGruposAcademicos: any =[];

  public eixosCombo: Array<Eixo> = [];
  public odsCombo: Array<ItemCombo> = [];
  public paisesCombo: Array<ItemCombo> = [];
  public cidadesCombo: Array<ItemCombo> = [];
  public provinciaEstadoCombo: Array<ItemCombo> = [];
  public areasInteresseCombo: Array<AreaInteresse> = [];
  public filtroGrupoAcademico: FiltroGrupoAcademico = new FiltroGrupoAcademico();


  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    private eixoService: EixoService, 
    private paisService: PaisService,
    private cidadeService: CidadeService,
    private areaInteresseService: AreaInteresseService,
    private gruposAcademicosService: GrupoAcademicoService,
    private provinciaEstadoService: ProvinciaEstadoService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    ) {
    this.formFiltro = this.formBuilder.group({
      idOds: [null],
      idEixo: [null],
      idPais: [null],
      idCidade: [null],      
      palavraChave: [null],
      idAreaInteresse: [null],
      idProvinciaEstado: [null],
    });
    this.route.queryParams.subscribe(params => {
      this.formFiltro.controls.idOds.setValue(params['ods'])
      this.formFiltro.controls.idEixo.setValue(params['eixo'])
      this.formFiltro.controls.idPais.setValue(params['pais'])
      this.formFiltro.controls.idCidade.setValue(params['cidade'])
      this.formFiltro.controls.idProvinciaEstado.setValue(params['estado'])
      this.formFiltro.controls.palavraChave.setValue(params['palavraChave'])
      this.formFiltro.controls.idAreaInteresse.setValue(params['areaInteresse'])
  });
   }

  ngOnInit() {
    this.carregarSelectJaComValor()
    this.buscarGruposAcademicos()
    this.carregarCombos()
    this.titleService.setTitle(`Contribuições Acadêmicas - Cidades Sustentáveis`)
  }

  public buscarGruposAcademicos(){
    this.construirParamsURL()
    this.paginationLimit = 3
    this.filtroGrupoAcademico.tipoCadastro = "Grupo Acadêmico"
    this.filtroGrupoAcademico.idOds =  this.formFiltro.controls['idOds'].value
    this.filtroGrupoAcademico.idEixo =  this.formFiltro.controls['idEixo'].value
    this.filtroGrupoAcademico.idPais =  this.formFiltro.controls['idPais'].value
    this.filtroGrupoAcademico.idCidade =  this.formFiltro.controls['idCidade'].value
    this.filtroGrupoAcademico.palavraChave = this.formFiltro.controls.palavraChave.value
    this.filtroGrupoAcademico.palavraChave =  this.formFiltro.controls['palavraChave'].value
    this.filtroGrupoAcademico.idAreaInteresse =  this.formFiltro.controls['idAreaInteresse'].value
    this.filtroGrupoAcademico.idProvinciaEstado =  this.formFiltro.controls['idProvinciaEstado'].value
    
    this.gruposAcademicosService.buscarGruposAcademicosFiltrados(this.filtroGrupoAcademico).subscribe(res => {
      this.idsGruposAcademicos = res.reverse();
    });
  }

  public construirParamsURL(){
    this.filtroGrupoAcademico.idOds = this.formFiltro.controls.idOds.value
    this.filtroGrupoAcademico.idPais = this.formFiltro.controls.idPais.value
    this.filtroGrupoAcademico.idCidade = this.formFiltro.controls.idCidade.value
    this.filtroGrupoAcademico.palavraChave = this.formFiltro.controls.palavraChave.value
    this.filtroGrupoAcademico.idAreaInteresse = this.formFiltro.controls.idAreaInteresse.value
    this.filtroGrupoAcademico.idProvinciaEstado = this.formFiltro.controls.idProvinciaEstado.value

    if (this.filtroGrupoAcademico.palavraChave === undefined){
      this.filtroGrupoAcademico.palavraChave = ''
    }
    if (this.filtroGrupoAcademico.idAreaInteresse === undefined){
      this.filtroGrupoAcademico.idAreaInteresse = null
    }
    if (this.filtroGrupoAcademico.idEixo === undefined){
      this.filtroGrupoAcademico.idEixo = null
    }
    if (this.filtroGrupoAcademico.idOds === undefined){
      this.filtroGrupoAcademico.idOds = null
    }
    if (this.filtroGrupoAcademico.idPais === undefined){
      this.filtroGrupoAcademico.idPais = null
    }
    if (this.filtroGrupoAcademico.idProvinciaEstado === undefined){
      this.filtroGrupoAcademico.idProvinciaEstado = null;
    }
    if (this.filtroGrupoAcademico.idCidade === undefined){
      this.filtroGrupoAcademico.idCidade = null
    }

    let new_URL = 
    this.filtroGrupoAcademico.palavraChave ? 
      `/colaboracoes-academicas?palavraChave=${this.filtroGrupoAcademico.palavraChave}` : null;
    this.filtroGrupoAcademico.idAreaInteresse ?
    (new_URL ? new_URL += `&areaInteresse=${this.filtroGrupoAcademico.idAreaInteresse}` : `/colaboracoes-academicas?areaInteresse=${this.filtroGrupoAcademico.idAreaInteresse}`) : null;
    this.filtroGrupoAcademico.idEixo ?
    (new_URL ? new_URL += `&eixo=${this.filtroGrupoAcademico.idEixo}` : `/colaboracoes-academicas?eixo=${this.filtroGrupoAcademico.idEixo}`) : null;
    this.filtroGrupoAcademico.idOds ?
    (new_URL ? new_URL += `&ods=${this.filtroGrupoAcademico.idOds}` : `/colaboracoes-academicas?ods=${this.filtroGrupoAcademico.idOds}`) : null;
    this.filtroGrupoAcademico.idPais ?
    (new_URL ? new_URL += `&pais=${this.filtroGrupoAcademico.idPais}` : `/colaboracoes-academicas?pais=${this.filtroGrupoAcademico.idPais}`) : null;
    this.filtroGrupoAcademico.idProvinciaEstado ?
    (new_URL ? new_URL += `&estado=${this.filtroGrupoAcademico.idProvinciaEstado}` : `/colaboracoes-academicas?estado=${this.filtroGrupoAcademico.idProvinciaEstado}`) : null;
    this.filtroGrupoAcademico.idCidade ?
    (new_URL ? new_URL += `&cidade=${this.filtroGrupoAcademico.idCidade}` : `/colaboracoes-academicas?cidade=${this.filtroGrupoAcademico.idCidade}`) : null;
    
    window.history.replaceState( {} , '', new_URL );
  }

  public verMaisGruposAcademicos() {
    this.paginationLimit += 3;
  }

  public carregarCombos() {
    this.paisService.buscarPaisesCombo().subscribe(res => {this.paisesCombo = res});
    this.eixoService.buscarEixosParaCombo(false).subscribe(res => {this.eixosCombo = res});
    this.odsService.buscarOdsCombo().subscribe(res => {this.odsCombo = res});
    this.areaInteresseService.buscaAreasInteresses().subscribe(res => {this.areasInteresseCombo = res});
  }

  public carregarSelectJaComValor(){
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

}
