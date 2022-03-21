
import { ItemCombo } from '../../../../model/ItemCombo ';
import { VariavelService } from '../../../../services/variavel.service';
import { Component, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { EixoService } from 'src/app/services/eixo.service';
import { Eixo } from 'src/app/model/eixo';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';
import { FiltroVariaveisPorMunicipios } from 'src/app/model/filtroVariaveisPorMunicipio';
import { FiltroIndicadoresPorMunicipios } from 'src/app/model/filtroIndicadoresPorMunicipio';
import { PlanejamentoIntegradoConsulta } from 'src/app/services/planejamento-integrado.consulta.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material';
import { EditarPropriedadesFiltroComponent } from '../editar-propriedades-filtro/editar-propriedades-filtro.component';

interface Opcoes {
  viewValue: string;
  value: boolean;
}

@Component({
  selector: 'app-filtro-indicador',
  templateUrl: './filtro-indicador.component.html',
  styleUrls: ['./filtro-indicador.component.css']
})
export class FiltroIndicadorComponent implements OnInit {

  public static exibirEstilo = false;

  @Output() carregarNoMapaEvent = new EventEmitter();
  @Output() clearEvent = new EventEmitter();
  @Output() exportarShapeEvent = new EventEmitter();
  @Output() carregarEstiloNoMapaEvent = new EventEmitter();

  @ViewChild('modalLoading') modalLoading: TemplateRef<any>;

  public variaveisCombo;
  public anosCombo;

  public listaIndicadores = [];
  public listaIndicadoresInicial = [];

  public formulaIndicadorSelecionadoTreeMap;

 
  public listaEixosCombo: Array<Eixo> = new Array<Eixo>();


  public listaOdsCombo: Array<ObjetivoDesenvolvimentoSustentavel> = new Array<ObjetivoDesenvolvimentoSustentavel>();

 
  public listaCidades: [];


  public idxFormula: number;



  public filtroIndicadoresPorMunicipio = new FiltroIndicadoresPorMunicipios();

  public listaConsultasIndicadores: FiltroIndicadoresPorMunicipios[];
  public   opcoes: Opcoes[] = [
    {value: true, viewValue: 'Ponto'},
    {value: false, viewValue: 'Polígono'}
  ];
  public consultaSelecionada: any;

  constructor(private variavelService: VariavelService,
              private variavelPreenchidaService: VariavelPreenchidaService,
              private indicadorPreenchidoService: IndicadoresPreenchidosService,
              private indicadorService: IndicadoresService,
              private eixoService: EixoService,
              private odsService: ObjetivoDesenvolvimentoSustentavelService,
              private cidadeService: CidadeService,
              private authService: AuthService,
              private planejamentoIntegradoConsulta: PlanejamentoIntegradoConsulta,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.carregarComboVariaveis();
    this.carregarComboEixos();
    this.populaComboIndicador();
    this.carregarOdsSelecionados();
    this.carregarCidades();
    this.buscarConsultasIndicador();
  }

  private carregarComboVariaveis(){
    this.variavelService.buscarVariaveisPcsParaCombo().subscribe(res => {
      this.variaveisCombo = res as ItemCombo[];
    });
  }

  private carregarComboAnosPreenchidos(){
    this.variavelPreenchidaService.carregarComboAnosPreenchidos().subscribe(res => {
      this.anosCombo = res as number[];
      this.filtroIndicadoresPorMunicipio.anoSelecionado = res[0];
    });
  }

  private carregarComboAnosPreenchidosPorIndicador(idIndicador: number){
    this.indicadorService.carregarComboAnosPreenchidosPorIndicador(idIndicador).subscribe(res => {
      this.anosCombo = res as number[];
      this.filtroIndicadoresPorMunicipio.anoSelecionado = res[0];
    });
  }

  private populaComboIndicador() {
    this.indicadorService
      .buscarIndicadoresParaComboPorPreenchidos()
      .subscribe(response => {
        this.listaIndicadores = response;
        this.listaIndicadoresInicial = response;
      });
  }

  private carregarComboEixos() {
    this.eixoService.buscarEixosDto().subscribe(response => {
      this.listaEixosCombo = response;
      this.listaEixosCombo = response as Array<Eixo>;
    });
  }

  private carregarOdsSelecionados() {
    this.odsService.buscar().subscribe(response => {
      this.listaOdsCombo = response as Array<ObjetivoDesenvolvimentoSustentavel>;
    });
  }

  private carregarCidades() {
    this.cidadeService.buscarCidadesSignatariasParaCombo().subscribe( res => {
      this.listaCidades = res;
    });
  }

  public clear() {
    this.clearEvent.emit();
    FiltroIndicadorComponent.exibirEstilo = false;
    FiltroIndicadorComponent.styleDefault = {
      fillColor: '#FFC164',
      color: '#ffff00',
      fillOpacity: 1,
      weight: 0.3
    };
  }


  changeVariavel(value: any) {
    this.formulaIndicadorSelecionadoTreeMap = null;
    if (value) {
      this.indicadorService
      .buscarIndicadoresPcsParaComboPorVariavel(value)
      .subscribe(response => {
        this.listaIndicadores = response;
      });
    } else {
        this.listaIndicadores = this.listaIndicadoresInicial;
    }

  }

  changeIndicador(id: any) {

    if (id) {
      this.carregarComboAnosPreenchidosPorIndicador(id);
      this.indicadorService.buscarIndicadorSimplesId(id)
        .subscribe(res => {
          const indicadorSelecionadoObj: any = res;
          this.formulaIndicadorSelecionadoTreeMap = indicadorSelecionadoObj.formula.split('<br>');
        });
    }

  }

  public buscarCidadesComIndicadorPreenchido() {

    const dialogRef = this.dialog.open(this.modalLoading, {
      height: '300px',
      width: '300px',
    });

    this.indicadorPreenchidoService.buscarCidadesComIndicadorPreenchido( this.filtroIndicadoresPorMunicipio.idIndicador, this.filtroIndicadoresPorMunicipio.idEixo, this.filtroIndicadoresPorMunicipio.idOds,
       this.filtroIndicadoresPorMunicipio.idCidade, this.filtroIndicadoresPorMunicipio.popuMin, this.filtroIndicadoresPorMunicipio.popuMax, this.filtroIndicadoresPorMunicipio.valorPreenchido,
      this.filtroIndicadoresPorMunicipio.anoSelecionado, this.filtroIndicadoresPorMunicipio.idxFormula, this.filtroIndicadoresPorMunicipio.visualizarComoPontos).subscribe(res => {
      this.carregarNoMapaEvent.emit(res);
      if (res != null && res.length > 0) {
        FiltroIndicadorComponent.exibirEstilo = true;
      }
      this.dialog.closeAll();
    });
  }

  public exportarShapeIndicadores() {
    this.exportarShapeEvent.emit(true);
  }



  public salvarConsultaIndicadores() {
    this.planejamentoIntegradoConsulta.inserirConsultaIndicador(this.filtroIndicadoresPorMunicipio).subscribe(async() => {
      await PcsUtil.swal().fire({
        title: 'Consulta - Indicador',
        text: `Consulta - Indicador cadastrada`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.limparFiltroIndicadoresPorMunicipios();
        this.buscarConsultasIndicador();
      }, error => { });
    });
  }

  private buscarConsultasIndicador() {
    if(this.isAuthenticated()) {
      this.planejamentoIntegradoConsulta.buscarConsultasIndicador().subscribe(response => {
        this.listaConsultasIndicadores = response as Array<FiltroIndicadoresPorMunicipios>;
     });
    }
  }

  public onChangeConsultaIndicador(filtroSelecionado: FiltroIndicadoresPorMunicipios){
    if (filtroSelecionado != null && filtroSelecionado !== undefined) {
      this.filtroIndicadoresPorMunicipio = filtroSelecionado;
    } else {
      this.limparFiltroIndicadoresPorMunicipios();
    }
  }

  public excluirConsultaIndicador(idConsulta: number): void {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    });
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Consulta - Indicador selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.planejamentoIntegradoConsulta.excluirConsultaIndicador(idConsulta).subscribe(response => {
          PcsUtil.swal().fire('Excluído!', `Consulta - Indicador excluída.`, 'success');
          this.limparFiltroIndicadoresPorMunicipios();
          this.buscarConsultasIndicador();
        });
      }
    });
}

  public limparFiltroIndicadoresPorMunicipios() {
    this.filtroIndicadoresPorMunicipio = new FiltroIndicadoresPorMunicipios();
    this.consultaSelecionada = null;
    this.clear();
  }

  public isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  private static styleDefault = {
    fillColor: '#FFC164',
    color: '#ffff00',
    fillOpacity: 1,
    weight: 0.3
  };

  public openDialogPropriedades(): void {
    const style = FiltroIndicadorComponent.styleDefault;
    const dialogRef = this.dialog.open(EditarPropriedadesFiltroComponent, {
      width: '25%',
      data: {
        obj : style
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        FiltroIndicadorComponent.styleDefault = result;
        this.carregarEstiloNoMapaEvent.emit(result);
      }
    });
  }

  get exibirEstilo() {
    return FiltroIndicadorComponent.exibirEstilo;
  }

}
