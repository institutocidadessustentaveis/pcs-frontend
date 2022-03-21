import { ItemCombo } from './../../../../model/ItemCombo ';
import { VariavelService } from './../../../../services/variavel.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { VariavelPreenchidaService } from 'src/app/services/variavelPreenchida.service';
import { FiltroVariaveisPorMunicipios } from 'src/app/model/filtroVariaveisPorMunicipio';
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
  selector: 'app-filtro-variavel',
  templateUrl: './filtro-variavel.component.html',
  styleUrls: ['./filtro-variavel.component.css']
})
export class FiltroVariavelComponent implements OnInit {

  public static exibirEstilo = false;

  @Output() carregarNoMapaEvent = new EventEmitter();
  @Output() clearEvent = new EventEmitter();
  @Output() exportarShapeEvent = new EventEmitter();
  @Output() carregarEstiloNoMapaEvent = new EventEmitter();

  @ViewChild('modalLoading') modalLoading: TemplateRef<any>;

  public variaveisCombo;
  public anosCombo;

  public filtroVariaveisPorMunicipios = new FiltroVariaveisPorMunicipios();

  public listaConsultasVariaveis: FiltroVariaveisPorMunicipios[];
  public   opcoes: Opcoes[] = [
    {value: true, viewValue: 'Ponto'},
    {value: false, viewValue: 'Polígono'}
  ];
  public consultaSelecionada: any;


  constructor(private variavelService: VariavelService,
              private variavelPreenchidaService: VariavelPreenchidaService,
              private planejamentoIntegradoConsulta: PlanejamentoIntegradoConsulta,
              private authService: AuthService,
              public dialog: MatDialog,) { }

  ngOnInit() {
    this.carregarComboVariaveis();
    this.buscarConsultasVariavel();
  }

  private carregarComboVariaveis(){
    this.variavelService.buscarVariaveisPcsParaCombo().subscribe(res => {
      this.variaveisCombo = res as ItemCombo[];
    });
  }

  private carregarComboAnosPreenchidos(){
    this.variavelPreenchidaService.carregarComboAnosPreenchidos().subscribe(res => {
      this.anosCombo = res as number[];
      this.filtroVariaveisPorMunicipios.anoSelecionado = res[0];
    });
  }
  private carregarComboAnosPreenchidosPorVariavel(idVariavel: number){
    this.variavelPreenchidaService.carregarComboAnosPreenchidosPorVariavel(idVariavel).subscribe(res => {
      this.anosCombo = res as number[];
      this.filtroVariaveisPorMunicipios.anoSelecionado = res[0];
    });
  }

  public buscarCidadesComVariavelPreenchida() {

    const dialogRef = this.dialog.open(this.modalLoading, {
      height: '300px',
      width: '300px',
    });

    this.variavelPreenchidaService.buscarCidadesComVariavelPreenchida(this.filtroVariaveisPorMunicipios.idVariavelSelecionada,
      this.filtroVariaveisPorMunicipios.valorPreenchido, this.filtroVariaveisPorMunicipios.anoSelecionado, this.filtroVariaveisPorMunicipios.visualizarComoPontos).subscribe(res => {
      this.carregarNoMapaEvent.emit(res);
      if (res != null && res.length > 0) {
        FiltroVariavelComponent.exibirEstilo = true;
      }
      this.dialog.closeAll();
    });
  }

  public clear() {
    this.clearEvent.emit();
    FiltroVariavelComponent.exibirEstilo = false;
    FiltroVariavelComponent.styleDefault = {
      fillColor: '#FFC164',
      color: '#ffff00',
      fillOpacity: 1,
      weight: 0.3
    };
  }

  public exportarShapeVariaveis() {
    this.exportarShapeEvent.emit(this.filtroVariaveisPorMunicipios.visualizarComoPontos);
  }



  public salvarConsultaVariaveis() {
    this.planejamentoIntegradoConsulta.inserirConsultaVariavel(this.filtroVariaveisPorMunicipios).subscribe(async() => {
      await PcsUtil.swal().fire({
        title: 'Consulta - Variável',
        text: `Consulta - Variável cadastrada`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.limparFiltroVariaveisPorMunicipios();
        this.buscarConsultasVariavel();
      }, error => { });
    });
  }

  private buscarConsultasVariavel() {
    if(this.isAuthenticated()) {
      this.planejamentoIntegradoConsulta.buscarConsultasVariavel().subscribe(response => {
        this.listaConsultasVariaveis = response as Array<FiltroVariaveisPorMunicipios>;
     });
    }
  }

  public onChangeConsultaVariavel(filtroSelecionado: FiltroVariaveisPorMunicipios){
    if (filtroSelecionado != null && filtroSelecionado !== undefined) {
      this.filtroVariaveisPorMunicipios = filtroSelecionado;
    } else {
      this.limparFiltroVariaveisPorMunicipios();
    }
  }

  public excluirConsultaVariavel(idConsulta: number): void {
      const swalWithBootstrapButtons = swal.mixin({
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger',
        buttonsStyling: true,
      });
      PcsUtil.swal().fire({
        title: 'Deseja Continuar?',
        text: `Deseja realmente excluir a Consulta - Variável selecionada?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        reverseButtons: false
      }).then((result) => {
        if (result.value) {
          this.planejamentoIntegradoConsulta.excluirConsultaVariavel(idConsulta).subscribe(response => {
            PcsUtil.swal().fire('Excluído!', `Consulta - Variavel excluída.`, 'success');
            this.limparFiltroVariaveisPorMunicipios();
            this.buscarConsultasVariavel();
          });
        }
      });
  }

  public limparFiltroVariaveisPorMunicipios() {
    this.filtroVariaveisPorMunicipios = new FiltroVariaveisPorMunicipios();
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
    const style = FiltroVariavelComponent.styleDefault;
    const dialogRef = this.dialog.open(EditarPropriedadesFiltroComponent, {
      width: '25%',
      data: {
        obj : style
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        FiltroVariavelComponent.styleDefault = result;
        this.carregarEstiloNoMapaEvent.emit(result);
      }
    });
  }

  get exibirEstilo() {
    return FiltroVariavelComponent.exibirEstilo;
  }

  public async variavelSelecionada(idVariavel: any) {
    this.carregarComboAnosPreenchidosPorVariavel(idVariavel);
  }

}
