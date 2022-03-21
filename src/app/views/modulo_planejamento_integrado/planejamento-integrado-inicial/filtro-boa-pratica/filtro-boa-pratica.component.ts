import { FormArray } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { BoaPraticaItem } from 'src/app/model/boaPraticaItem';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { FiltroCidadesComBoasPraticas } from 'src/app/model/filtroCidadesComBoasPraticas';
import { CidadeService } from 'src/app/services/cidade.service';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { PaisService } from 'src/app/services/pais.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { CombosCidadesComBoaPratica } from 'src/app/model/combosCidadesComBoasPraticas';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { PaisDTO } from 'src/app/views/modulo_administracao/cidade-form/cidade-form.component';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
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
  selector: 'app-filtro-boa-pratica',
  templateUrl: './filtro-boa-pratica.component.html',
  styleUrls: ['./filtro-boa-pratica.component.css']
})
export class FiltroBoaPraticaComponent implements OnInit {

  public static exibirEstilo = false;

  @Output() carregarNoMapaEvent = new EventEmitter();
  @Output() clearEvent = new EventEmitter();
  @Output() exportarShapeEvent = new EventEmitter();
  @Output() carregarEstiloNoMapaEvent = new EventEmitter();

  @ViewChild('modalLoading') modalLoading: TemplateRef<any>;

  public listBoasPraticas: BoaPraticaItem[];
  public listaContinentes: ItemCombo[];
  public listaPaises: ItemCombo[];
  public listaProvinciasEstados: ItemCombo[];
  public listaCidades: ItemCombo[];
  public listaPaisesBkp: ItemCombo[];
  public listaProvinciasEstadosBkp: ItemCombo[];
  public listaCidadesBkp: ItemCombo[];
  public listaEixos: ItemCombo[];
  public listaOds: ItemCombo[];
  public listaMetaOds: ItemCombo[];
  public listaOdsBkp: ItemCombo[];
  public listaMetaOdsBkp: ItemCombo[];
  public filtroCidadesComBoasPraticas: FiltroCidadesComBoasPraticas = new FiltroCidadesComBoasPraticas();
  public listaIndicadores = [];

  public listaConsultasBoaPratica: FiltroCidadesComBoasPraticas[];
  public   opcoes: Opcoes[] = [
    {value: true, viewValue: 'Ponto'},
    {value: false, viewValue: 'Polígono'}
  ];
  public consultaSelecionada: any;

  constructor(public cidadesService: CidadeService,
              private boaPraticaService: BoaPraticaService,
              public activatedRoute: ActivatedRoute,
              private odsService: ObjetivoDesenvolvimentoSustentavelService,
              private paisService: PaisService,
              private provinciaEstadoService: ProvinciaEstadoService,
              private cidadeService: CidadeService,
              private indicadorService: IndicadoresService,
              private planejamentoIntegradoConsulta: PlanejamentoIntegradoConsulta,
              private authService: AuthService,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    this.carregarCombosCidadesComBoasPraticas();
    this.populaComboIndicador();
    this.buscarConsultasBoaPratica();
  }

  private async carregarCombosCidadesComBoasPraticas() {

    await this.boaPraticaService.buscarCombosCidadesComBoasPraticas().subscribe(response => {
     
      const combosCidadesComBoaPratica = response as CombosCidadesComBoaPratica;
      this.listaContinentes = combosCidadesComBoaPratica.listaContinentes;
      this.listaPaises = combosCidadesComBoaPratica.listaPaises;
      this.listaProvinciasEstados = combosCidadesComBoaPratica.listaProvinciasEstados;
      this.listaCidades = combosCidadesComBoaPratica.listaCidades;

      this.listaPaisesBkp = combosCidadesComBoaPratica.listaPaises;
      this.listaProvinciasEstadosBkp = combosCidadesComBoaPratica.listaProvinciasEstados;
      this.listaCidadesBkp = combosCidadesComBoaPratica.listaCidades;

      this.listaEixos = combosCidadesComBoaPratica.listaEixos;
      this.listaOds = combosCidadesComBoaPratica.listaOds;
      this.listaMetaOds = combosCidadesComBoaPratica.listaMetaOds;

      this.listaOdsBkp = combosCidadesComBoaPratica.listaOds;
      this.listaMetaOdsBkp = combosCidadesComBoaPratica.listaMetaOds;

    }, () => { });
  }

  private async buscarCidadesComBoasPraticas() {
    const dialogRef = this.dialog.open(this.modalLoading, {
      height: '300px',
      width: '300px',
    });
    
    await this.boaPraticaService.buscarCidadesComBoasPraticasFiltradas(this.filtroCidadesComBoasPraticas).subscribe(res => {
      this.carregarNoMapaEvent.emit(res);
      if (res != null && res.length > 0) {
        FiltroBoaPraticaComponent.exibirEstilo = true;
      }
      this.dialog.closeAll();
    }, () => { });
  }

  public onChangeEixo() {
    if (this.filtroCidadesComBoasPraticas.idEixo === undefined) {
      this.listaOds = this.listaOdsBkp;
      this.filtroCidadesComBoasPraticas.idOds = undefined;
    } else {
      this.odsService.buscarPorEixo(this.filtroCidadesComBoasPraticas.idEixo).subscribe(a => {
        this.listaOds = a as ItemCombo[];
      });
    }
  }

  public onChangeODS() {
    if (this.filtroCidadesComBoasPraticas.idOds === undefined) {
      this.listaMetaOds = this.listaMetaOdsBkp;
      this.filtroCidadesComBoasPraticas.idMetaOds = undefined;
    } else {
      this.odsService.buscarOds(this.filtroCidadesComBoasPraticas.idOds).subscribe(a => {
        const listaAux = a as ObjetivoDesenvolvimentoSustentavel;
        this.listaMetaOds = new Array<ItemCombo>();
        listaAux.metas.forEach(element => {
          const item: ItemCombo = new ItemCombo();
          item.id = element.id;
          item.label = element.numero + ' - ' + element.descricao;
          this.listaMetaOds.push(item);
        });
      });
    }
  }

  public onChangeContinente() {
    if (this.filtroCidadesComBoasPraticas.continente === undefined) {
      this.listaPaises = this.listaPaisesBkp;
      this.filtroCidadesComBoasPraticas.idPais = undefined;
    } else {
      this.paisService.buscarPaisesPorContinente(this.filtroCidadesComBoasPraticas.continente).subscribe(response => {
        const listaAux = response as Array<PaisDTO>;
        this.listaPaises = new Array<ItemCombo>();
        listaAux.forEach(element => {
          const item: ItemCombo = new ItemCombo();
          item.id = element.id as number;
          item.label = element.nome;
          this.listaPaises.push(item);
        });
      });
    }
  }

  public onChangePais() {
    if (this.filtroCidadesComBoasPraticas.idPais === undefined) {
      this.listaProvinciasEstados = this.listaProvinciasEstadosBkp;
      this.filtroCidadesComBoasPraticas.idEstado = undefined;
    } else {
      this.provinciaEstadoService.buscarPorPais(this.filtroCidadesComBoasPraticas.idPais).subscribe(response => {
        const listaAux = response as Array<ProvinciaEstado>;
        this.listaProvinciasEstados = new Array<ItemCombo>();
        listaAux.forEach(element => {
          const item: ItemCombo = new ItemCombo();
          item.id = element.id;
          item.label = element.nome;
          this.listaProvinciasEstados.push(item);
        });
      });
    }
  }

  public onChangeEstado() {
    if (this.filtroCidadesComBoasPraticas.idEstado === undefined) {
      this.listaCidades = this.listaCidadesBkp;
      this.filtroCidadesComBoasPraticas.idCidade = undefined;
    } else {
      const estado: ProvinciaEstado = new ProvinciaEstado();
      estado.id = this.filtroCidadesComBoasPraticas.idEstado;
      this.listaCidades = new Array<ItemCombo>();
      this.cidadeService.buscarPorEstado(estado).subscribe(res => {
        this.listaCidades = res as ItemCombo[];
      });
    }
  }

  public pesquisarBoasPraticas() {
    this.buscarCidadesComBoasPraticas();
  }

  public clear() {
    this.limparFiltroCidadesComBoasPraticas();
    this.clearEvent.emit();
    FiltroBoaPraticaComponent.exibirEstilo = false;
    FiltroBoaPraticaComponent.styleDefault = {
      fillColor: '#FFC164',
      color: '#ffff00',
      fillOpacity: 1,
      weight: 0.3
    };
  }

  public populaComboIndicador() {
    this.indicadorService
      .buscarIndicadoresPcsParaCombo()
      .subscribe(response => {
        this.listaIndicadores = response;
      });
  }

  public exportarShapeBoasPraticas(){
    this.exportarShapeEvent.emit();
  }

  public salvarConsultaBoasPraticas() {
    this.planejamentoIntegradoConsulta.inserirConsultaBoaPratica(this.filtroCidadesComBoasPraticas).subscribe(async() => {
      await PcsUtil.swal().fire({
        title: 'Consulta - Boa prática',
        text: `Consulta - Boa prática cadastrada`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.limparFiltroCidadesComBoasPraticas();
        this.buscarConsultasBoaPratica();
      }, error => { });
    });
  }

  private buscarConsultasBoaPratica() {
    if(this.isAuthenticated()) {
      this.planejamentoIntegradoConsulta.buscarConsultasBoaPratica().subscribe(response => {
        this.listaConsultasBoaPratica = response as Array<FiltroCidadesComBoasPraticas>;
      });
    }
  }

  public onChangeConsultaBoaPratica(filtroSelecionado: FiltroCidadesComBoasPraticas){
    if (filtroSelecionado != null && filtroSelecionado !== undefined) {
      this.filtroCidadesComBoasPraticas = filtroSelecionado;
    } else {
      this.limparFiltroCidadesComBoasPraticas();
    }
  }

  public excluirConsultaBoaPratica(idConsultaBoaPratica: number): void {
      const swalWithBootstrapButtons = swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: true,
      });
      PcsUtil.swal().fire({
        title: 'Deseja Continuar?',
        text: `Deseja realmente excluir a Consulta - Boa Prática selecionada?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: false
      }).then((result) => {
        if (result.value) {
          this.planejamentoIntegradoConsulta.excluirConsultaBoaPratica(idConsultaBoaPratica).subscribe(response => {
            PcsUtil.swal().fire('Excluído!', `Consulta - Boa Prática excluída.`, 'success');
            this.limparFiltroCidadesComBoasPraticas();
            this.buscarConsultasBoaPratica();
          });
        }
      });
  }

  public limparFiltroCidadesComBoasPraticas() {
    this.filtroCidadesComBoasPraticas = new FiltroCidadesComBoasPraticas();
    this.consultaSelecionada = null;
    this.clearEvent.emit();
    FiltroBoaPraticaComponent.exibirEstilo = false;
    FiltroBoaPraticaComponent.styleDefault = {
      fillColor: '#FFC164',
      color: '#ffff00',
      fillOpacity: 1,
      weight: 0.3
    };
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
    const style = FiltroBoaPraticaComponent.styleDefault;
    const dialogRef = this.dialog.open(EditarPropriedadesFiltroComponent, {
      width: '25%',
      data: {
        obj : style
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        FiltroBoaPraticaComponent.styleDefault = result;
        this.carregarEstiloNoMapaEvent.emit(result);
      }
    });
  }

  get exibirEstilo() {
    return FiltroBoaPraticaComponent.exibirEstilo;
  }

}
