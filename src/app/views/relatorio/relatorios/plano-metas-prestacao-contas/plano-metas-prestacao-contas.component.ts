import { PainelIndicadorCidadeService } from './../../../../services/painel-indicador-cidade.service';
import localePtBr from "@angular/common/locales/pt";
import { registerLocaleData } from '@angular/common';
import { ProvinciaEstadoService } from './../../../../services/provincia-estado.service';
import { Router } from '@angular/router';
import { CidadeService } from './../../../../services/cidade.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { ExportadorRelatoriosComponent } from './../exportador-relatorios/exportador-relatorios.component';
import { ItemCombo } from './../../../../model/ItemCombo ';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RelatorioPlanoDeMetasPrestacaoDeContas } from './../../../../model/Relatorio/RelatorioPlanoMetasPrestacaoContas';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RelatorioShapesCadastrados } from './../../../../model/Relatorio/RelatorioShapesCadastrados';
import { RelatorioPlanoDeMetas } from './../../../../model/Relatorio/RelatorioPlanoDeMetas';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RelatorioPlanoDeMetasComponent } from '../relatorio-plano-de-metas/relatorio-plano-de-metas.component';
import moment from 'moment';

@Component({
  selector: 'app-plano-metas-prestacao-contas',
  templateUrl: './plano-metas-prestacao-contas.component.html',
  styleUrls: ['./plano-metas-prestacao-contas.component.css']
})
export class PlanoMetasPrestacaoContasComponent implements OnInit {

  public idEstado: number;
  public idCidade: number;

  public loading: boolean = false;
  public nenhumRegistroEncontrado: boolean = false;
  public displayedColumns: string[] = [
    'planoDeMetas',
    'prestacaoDeContas',
    'dataUploadPlano',
    'horaUploadPlano',
    'dataUploadPrestacao',
    'horaUploadPrestacao',
    'estado',
    'cidade',
    'mandato',
    'nomeUsuario'
  ];

  public dataSource = new MatTableDataSource<RelatorioPlanoDeMetasPrestacaoDeContas>();
  public filtro: RelatorioPlanoDeMetasPrestacaoDeContas = new RelatorioPlanoDeMetasPrestacaoDeContas();
  public registros: Array<RelatorioPlanoDeMetasPrestacaoDeContas> = new Array<RelatorioPlanoDeMetasPrestacaoDeContas>();
  public formFiltro: FormGroup;
  public titulo = 'Relatório Plano de Metas e Prestação de Contas';
  public listaEstados = [];
  public listaCidades = [];

  public colunas = [
    { title: 'Plano de Metas', dataKey: 'planoDeMetas' },
    { title: 'Prestação de Contas', dataKey: 'prestacaoDeContas' },
    { title: 'Data Upload Plano de Metas', dataKey: 'dataUploadPlano' },
    { title: 'Hora Upload Plano de Metas', dataKey: 'horaUploadPlano' },
    { title: 'Data Upload Prestação de Contas', dataKey: 'dataUploadPrestacao' },
    { title: 'Hora Upload Prestação de Contas', dataKey: 'horaUploadPrestacao' },
    { title: 'Província/Estado', dataKey: 'estado' },
    { title: 'Cidade', dataKey: 'cidade' },
    { title: 'Período do Mandato', dataKey: 'mandato' },
    { title: 'Usuário', dataKey: 'nomeUsuario' }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ExportadorRelatoriosComponent)
  public exportador: ExportadorRelatoriosComponent;
  public scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(
    private service: RelatorioService,
    public formBuilder: FormBuilder,
    private estadoService: ProvinciaEstadoService,
    private cidadeService: CidadeService,
    private element: ElementRef,
    private router: Router,
    private painelIndicadorCidadeService: PainelIndicadorCidadeService,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
    this.formFiltro = this.formBuilder.group({
      estado: [null],
      cidade: [null]
    });
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length == 0 || pageSize == 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = "Primeira página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.nextPageLabel = "Próxima página";
    this.paginator._intl.lastPageLabel = "Última página";
    this.loading = false;

    this.populaComboEstados();
    // this.populaComboCidades(this.idEstado);
  }

  public estadoSelecionado(idEstado: any) {
    if(idEstado) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(idEstado).subscribe(response => {
        this.listaCidades = response as Array<ItemCombo>;
        this.formFiltro.controls.cidade.setValue(null);
      });
    } else {
      this.formFiltro.controls.estado.setValue(null);
      this.formFiltro.controls.cidade.setValue(null);
      this.listaCidades = [];
    }
}

  public populaComboEstados() {
    this.painelIndicadorCidadeService
      .buscarEstadosSignatarios()
      .subscribe(response => {
        this.listaEstados = response;
      });
  }

  // private populaComboCidades(idEstado: number) {
  //   this.cidadeService.buscarCidadeParaComboPorIdEstado(idEstado).subscribe(res => {
  //     this.listaCidades = res;
  //   });
  // }

  verificaResultadoEncontrado(res: any) {
    if (res != null && res !== undefined && res.length > 0) {
      this.resultadoEncontrado = true;
      this.loading = false;
    } else {
      this.resultadoEncontrado = false;
      this.loading = false;
    }
  }

  gerarRelatorio() {
    this.loading = true;

    this.idCidade = this.formFiltro.controls['cidade'].value;

    this.service
      .searchPlanoDeMetasPrestacaoDeContas(
        this.idCidade
      )
      .subscribe(
        response => {
          this.verificaResultadoEncontrado(response);
          this.pesquisou = true;
          this.nenhumRegistroEncontrado = response.length === 0;
          this.registros = response;
          this.dataSource = new MatTableDataSource<RelatorioPlanoDeMetasPrestacaoDeContas>(
            response
          );
          this.paginator._intl.itemsPerPageLabel = "Itens por página";
          this.paginator._intl.getRangeLabel = (
            page: number,
            pageSize: number,
            length: number
          ) => {
            if (length == 0 || pageSize == 0) {
              return `0 de ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            const endIndex =
              startIndex < length
                ? Math.min(startIndex + pageSize, length)
                : startIndex + pageSize;
            return `${startIndex + 1} - ${endIndex} de ${length}`;
          };
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.paginator._intl.firstPageLabel = "Primeira página";
          this.paginator._intl.previousPageLabel = "Página anterior";
          this.paginator._intl.nextPageLabel = "Próxima página";
          this.paginator._intl.lastPageLabel = "Última página";
        },
        error => {
          this.loading = false;
        }
      );
  }

  formatarParaExportar(registros: Array<RelatorioPlanoDeMetasPrestacaoDeContas>): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado["estado"] = registro.estadoSigla ? registro.estadoSigla : registro.estado;
      formatado["cidade"] = registro.cidade;
      formatado['mandato'] = registro.mandato;
      formatado['planoDeMetas'] = registro.planoDeMetas;
      formatado['prestacaoDeContas'] = registro.prestacaoDeContas;
      formatado['nomeUsuario'] = registro.nomeUsuario;

      if (registro.dataHoraUploadPlano == null || registro.dataHoraUploadPlano == undefined) {
        formatado['dataUploadPlano'] = '';
        formatado['horaUploadPlano'] = '';
      } else {
        formatado['dataUploadPlano'] = moment(registro.dataHoraUploadPlano).format('DD/MM/YYYY');
        formatado['horaUploadPlano'] = moment(registro.dataHoraUploadPlano).format('HH:mm:ss');
      }
      formatado['prestacaoDeContas'] = registro.prestacaoDeContas;
      if (registro.dataHoraUploadPrestacao == null || registro.dataHoraUploadPrestacao == undefined) {
        formatado['dataUploadPrestacao'] = '';
        formatado['horaUploadPrestacao'] = '';
      } else {
        formatado['dataUploadPrestacao'] = moment(registro.dataHoraUploadPrestacao).format('DD/MM/YYYY');
        formatado['horaUploadPrestacao'] = moment(registro.dataHoraUploadPrestacao).format('HH:mm:ss');
      }
      formatados.push(formatado);
    });
    return formatados;
  }

}
