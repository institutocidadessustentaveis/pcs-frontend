import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { CidadeService } from 'src/app/services/cidade.service';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { EixoService } from 'src/app/services/eixo.service';
import { Eixo } from 'src/app/model/eixo';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { FiltroInstituicao } from 'src/app/model/filtro-instituicao';
import { GrupoAcademicoService } from 'src/app/services/grupo-academico.service';
import { FiltroGrupoAcademico } from 'src/app/model/filtroGrupoAcademico';

@Component({
  selector: 'app-contribuicoes-privadas-principal',
  templateUrl: './contribuicoes-privadas-principal.component.html',
  styleUrls: ['./contribuicoes-privadas-principal.component.css']
})
export class ContribuicoesPrivadasPrincipalComponent implements OnInit {

  public eixos: Array<Eixo>
  public paginationLimit = 3
  public formFiltro: FormGroup
  public cidades: Array<ItemCombo>
  public participaApl:  boolean = false
  public idsInstituicoes: Array<any> = []
  public setoresEconomicos: Array<string>
  public areasInteresse: Array<AreaInteresse>
  public ods: Array<ObjetivoDesenvolvimentoSustentavelService>
  public filtroInstituicoes: FiltroGrupoAcademico = new FiltroGrupoAcademico();
  constructor(
    private eixoService: EixoService,
    private formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private areaInteresseService: AreaInteresseService,
    private grupoAcademicoService: GrupoAcademicoService,
    private objetivoDesenvolvimentoSustentavelService: ObjetivoDesenvolvimentoSustentavelService,
  ) { 
    this.formFiltro = this.formBuilder.group({
      ods: [null],
      eixo: [null],
      cidade: [null],
      vinculo: [null],
      nomeGrupo: [null],
      setoresApl: [null],
      cidadesApl: [null],
      receitaAnual: [null],
      areaInteresse: [null],
      participaApl: [false],
      setorEconomico: [null],
      associadaEthos: [false],
      quantidadeFuncionarios: [null],
      atuaProjetoSustentabilidade: [false],
    })

    this.setoresEconomicos = ['Comercial', 'Rural', 'Industrial', 'Serviços']
  }

  ngOnInit() {
    this.carregarCombos()
    this.buscarInstituicoes()
  }

  public verMaisGruposAcademicos() {
    this.paginationLimit += 3;
  }

  public carregarCombos() {
    this.buscarOds()
    this.buscarEixos()
    this.buscarCidades()
    this.buscarAreasInteresse()
  }

  public buscarCidades() {
    this.cidadeService.buscarCidadeComboBox().subscribe( cidades => {
      this.cidades = cidades
    })
  }

  public buscarAreasInteresse() {
    this.areaInteresseService.buscaAreasInteresses().subscribe(areasInteresse => {
      this.areasInteresse = areasInteresse
    })
  }

  public buscarEixos() {
    this.eixoService.buscarEixosParaCombo(false).subscribe(eixos => {
      this.eixos = eixos
    })
  }

  public buscarOds() {
    this.objetivoDesenvolvimentoSustentavelService.buscarOdsCombo().subscribe(ods => {
      this.ods = ods
    })
  }

  public onParticipaAplChange(event) {
    this.participaApl = event;
    if (this.participaApl == false) {
      this.formFiltro.controls.setoresApl.setValue(null)
      this.formFiltro.controls.cidadesApl.setValue(null)
    }
  }

  public buscarInstituicoes() {
    this.filtroInstituicoes.tipoCadastro = "Empresa, Fundação Empresarial"
    this.filtroInstituicoes.palavraChave = ''
    this.filtroInstituicoes.idOds = this.formFiltro.controls['ods'].value
    this.filtroInstituicoes.idEixo = this.formFiltro.controls['eixo'].value
    this.filtroInstituicoes.idCidade = this.formFiltro.controls['cidade'].value
    this.filtroInstituicoes.vinculo = this.formFiltro.controls['vinculo'].value
    this.filtroInstituicoes.nomeGrupo = this.formFiltro.controls['nomeGrupo'].value
    this.filtroInstituicoes.setoresApl = this.formFiltro.controls['setoresApl'].value
    this.filtroInstituicoes.cidadesApl = this.formFiltro.controls['cidadesApl'].value
    this.filtroInstituicoes.receitaAnual = this.formFiltro.controls['receitaAnual'].value
    this.filtroInstituicoes.participaApl = this.formFiltro.controls['participaApl'].value
    this.filtroInstituicoes.idAreaInteresse = this.formFiltro.controls['areaInteresse'].value
    this.filtroInstituicoes.associadaEthos = this.formFiltro.controls['associadaEthos'].value
    this.filtroInstituicoes.setorEconomico = this.formFiltro.controls['setorEconomico'].value
    this.filtroInstituicoes.quantidadeFuncionarios = this.formFiltro.controls['quantidadeFuncionarios'].value
    this.filtroInstituicoes.atuaProjetoSustentabilidade = this.formFiltro.controls['atuaProjetoSustentabilidade'].value
    this.grupoAcademicoService.buscarGruposAcademicosFiltrados(this.filtroInstituicoes).subscribe(res => {
      this.idsInstituicoes = res
      
    })

  }

  public limparFiltro() {
    this.formFiltro.controls.ods.setValue(null)
    this.formFiltro.controls.eixo.setValue(null)
    this.formFiltro.controls.cidade.setValue(null)
    this.formFiltro.controls.vinculo.setValue(null)
    this.formFiltro.controls.nomeGrupo.setValue(null)
    this.formFiltro.controls.setoresApl.setValue(null)
    this.formFiltro.controls.cidadesApl.setValue(null)
    this.formFiltro.controls.receitaAnual.setValue(null)
    this.formFiltro.controls.participaApl.setValue(null)
    this.formFiltro.controls.areaInteresse.setValue(null)
    this.formFiltro.controls.associadaEthos.setValue(null)
    this.formFiltro.controls.setorEconomico.setValue(null)
    this.formFiltro.controls.quantidadeFuncionarios.setValue(null)
    this.formFiltro.controls.atuaProjetoSustentabilidade.setValue(null) 
  }

}
