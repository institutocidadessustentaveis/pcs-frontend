import { EixoService } from 'src/app/services/eixo.service';
import { PaisService } from 'src/app/services/pais.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { Eixo } from 'src/app/model/eixo';
import { CombosCidadesComBoaPratica } from 'src/app/model/combosCidadesComBoasPraticas';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { CidadeService } from 'src/app/services/cidade.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { RelatorioBoasPraticasCidadesSignatariasFiltro } from './../../../../model/Relatorio/RelatorioBoasPraticasCidadesSignatariasFiltro';
import { Router } from '@angular/router';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { ExportadorRelatoriosComponent } from './../exportador-relatorios/exportador-relatorios.component';
import { RelatorioBoasPraticasCidadesSignatarias } from './../../../../model/Relatorio/RelatorioBoasPraticasCidadesSignatarias';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import moment from 'moment';

@Component({
  selector: 'app-boas-praticas-cidades-signatarias',
  templateUrl: './boas-praticas-cidades-signatarias.component.html',
  styleUrls: ['./boas-praticas-cidades-signatarias.component.css']
})
export class BoasPraticasCidadesSignatariasComponent implements OnInit {

  public listaOds: ItemCombo[];
  public listaMetaOds: ItemCombo[];
  public listaPaises: ItemCombo[];
  public listaProvinciasEstados: ItemCombo[];
  public listaCidades: ItemCombo[];
  public listaEixos: Array<Eixo> = [];
  public listaMetasOds: ItemCombo[];

  public loadingCombo: boolean = false;

  public boaPraticaFiltro: RelatorioBoasPraticasCidadesSignatariasFiltro = new RelatorioBoasPraticasCidadesSignatariasFiltro();

  public loading: boolean = false;
  public nenhumRegistroEncontrado: boolean = false;
  public displayedColumns: string[] = ["titulo","provinciaEstado","cidade","ods"];
  public registros: Array<RelatorioBoasPraticasCidadesSignatarias> = new Array<RelatorioBoasPraticasCidadesSignatarias>();
  public formFiltro: FormGroup;
  public tituloRelatorio: string = 'Extrair Conteúdo das Boas Práticas de Prefeituras Signatárias';

  public dataSource = new MatTableDataSource<RelatorioBoasPraticasCidadesSignatarias>();
  public   colunas = [
    { title: 'Título', dataKey: 'titulo' },
    { title: 'Estado', dataKey: 'provinciaEstado' },
    { title: 'Cidade', dataKey: 'cidade' },
    { title: 'ODS', dataKey: 'ods' },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ExportadorRelatoriosComponent)
  public exportador: ExportadorRelatoriosComponent;
  public scrollUp: any;
  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(
    private relatorioService: RelatorioService,
    public formBuilder: FormBuilder,
    private element: ElementRef,
    private provinciaEstadoService: ProvinciaEstadoService,
    private cidadeService: CidadeService,
    private boaPraticaService: BoaPraticaService,
    private router: Router,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private paisService: PaisService,
    private eixoService: EixoService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.formFiltro = this.formBuilder.group({
      titulo: [null],
      idEixo: [null],
      idOds: [null],
      idMetaOds: [null],
      continente: [null],
      idPais: [null],
      idEstado: [null],
      idCidade: [null],
      popuMin: [null],
      popuMax: [null],
    });
  }

  ngOnInit() {
    this.carregarCombos();
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
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
  }

  carregarCombos() {
    this.buscarComboEixos();
    this.buscarComboPaises();
    this.buscarComboOds();
  }

  public buscarComboPaises() {
    this.loadingCombo = true;
    this.paisService.buscarPaisesCombo()
    .subscribe(res => {
      this.listaPaises = res;
      this.loading = false;
    });
  }

  public buscarComboEixos() {
    this.loadingCombo = true;
    this.eixoService.buscarEixosParaCombo(false)
    .subscribe(res => {
      this.listaEixos = res;
      this.loading = false;
    });
  }

  public buscarComboOds() {
    this.odsService.buscarOdsCombo()
    .subscribe(res => {
      this.listaOds = res;
      this.loadingCombo = false;
    });
  }

  public carregarMetasOds() {
    this.listaMetasOds = [];
    if (this.formFiltro.controls.idOds.value) {
    this.odsService.buscarMetaOdsPorIdOdsItemCombo(this.formFiltro.controls.idOds.value)
       .subscribe(metas => {
        this.listaMetasOds = metas as ItemCombo[];
      });
    } else {
      this.formFiltro.controls.idOds.setValue(null);
      this.formFiltro.controls.idMetaOds.setValue(null);
    }
  }

  gerarRelatorio() {
    this.loading = true;

    this.boaPraticaFiltro.titulo = this.formFiltro.controls.titulo.value;
    this.boaPraticaFiltro.idEixo = this.formFiltro.controls.idEixo.value;
    this.boaPraticaFiltro.idOds = this.formFiltro.controls.idOds.value;
    this.boaPraticaFiltro.idMetaOds = this.formFiltro.controls.idMetaOds.value;
    this.boaPraticaFiltro.idPais = this.formFiltro.controls.idPais.value;
    this.boaPraticaFiltro.idEstado = this.formFiltro.controls.idEstado.value;
    this.boaPraticaFiltro.idCidade = this.formFiltro.controls.idCidade.value;

    this.relatorioService.searchRelatorioBoasPraticasCidadesSignatarias(this.boaPraticaFiltro).subscribe(
      response => {
        this.verificaResultadoEncontrado(response);
        this.pesquisou = true;
        this.nenhumRegistroEncontrado = response.length === 0;
        this.registros = response;
        this.dataSource = new MatTableDataSource<RelatorioBoasPraticasCidadesSignatarias>(
          response
        );
        this.paginator._intl.itemsPerPageLabel = 'Itens por página';
        this.paginator._intl.getRangeLabel = (
          page: number,
          pageSize: number,
          length: number
        ) => {
          if (length === 0 || pageSize === 0) {
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
        this.paginator._intl.firstPageLabel = 'Primeira página';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.nextPageLabel = 'Próxima página';
        this.paginator._intl.lastPageLabel = 'Última página';
      },
      error => {
        this.loading = false;
      }
    );
  }

  verificaResultadoEncontrado(res: any) {
    if (res != null && res !== undefined && res.length > 0) {
      this.resultadoEncontrado = true;
      this.loading = false;
    } else {
      this.resultadoEncontrado = false;
      this.loading = false;
    }
  }

  formatarParaExportar(registros: Array<RelatorioBoasPraticasCidadesSignatarias>): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['titulo'] = registro.titulo;
      formatado['provinciaEstado'] = registro.provinciaEstado;
      formatado['cidade'] = registro.cidade;
      formatado['ods'] = registro.ods;
      formatados.push(formatado);
    });
    return formatados;
  }

  formatarParaXls(registros: Array<RelatorioBoasPraticasCidadesSignatarias>): any[] {
    let formatadosXls: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['nomeInstituicao'] = registro.nomeInstituicao;
      formatado['titulo'] = registro.titulo;
      formatado['provinciaEstado'] = registro.provinciaEstado;
      formatado['cidade'] = registro.cidade;
      formatado['endereco'] = registro.endereco;
      formatado['site'] = registro.site;
      formatado['nomeResponsavel'] = registro.nomeResponsavel;
      formatado['contato'] = registro.contato;
      formatado['email'] = registro.email;
      formatado['telefone'] = registro.telefone;
      formatado['celular'] = registro.celular;
      formatado['dtInicio'] = registro.dtInicio ? moment(registro.dtInicio).format('DD/MM/YYYY'): '';
      formatado['objetivoGeral'] = registro.objetivoGeral ? registro.objetivoGeral.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['objetivoEspecifico'] = registro.objetivoEspecifico ? registro.objetivoEspecifico.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['principaisResultados'] = registro.principaisResultados ? registro.principaisResultados.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['aprendizadoFundamental'] = registro.aprendizadoFundamental ? registro.aprendizadoFundamental.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['parceirosEnvolvidos'] = registro.parceirosEnvolvidos ? registro.parceirosEnvolvidos.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['resultadosQuantitativos'] = registro.resultadosQuantitativos ? registro.resultadosQuantitativos.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['resultadosQualitativos'] = registro.resultadosQualitativos ? registro.resultadosQualitativos.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['parametrosContemplados'] = registro.parametrosContemplados ? registro.parametrosContemplados.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['publicoAtingido'] = registro.publicoAtingido ? registro.publicoAtingido.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['eixo'] = registro.eixo;
      formatado['informacoesComplementares'] = registro.informacoesComplementares ? registro.informacoesComplementares.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['prefeitura'] = registro.prefeitura;
      formatado['subtitulo'] = registro.subtitulo;
      formatado['galeriaDeVideos'] = registro.galeriaDeVideos;
      formatado['fontesReferencia'] = registro.fontesReferencia ? registro.fontesReferencia.replace(/<.*?>|&nbsp;/g, '') : '';
      formatado['dataPublicacao'] = registro.dataPublicacao ? moment(registro.dataPublicacao).format('DD/MM/YYYY') : '';
      formatado['indicadores'] = registro.indicadores;
      formatado['metasOds'] = registro.metasOds;
      formatado['ods'] = registro.ods;
      formatado['tipo'] = registro.tipo;
      formatado['paginaInicial'] = registro.paginaInicial;
      formatado['possuiFiltro'] = registro.possuiFiltro;
      formatado['autorImagemPrincipal'] = registro.autorImagemPrincipal;
      formatadosXls.push(formatado);
    });
    return formatadosXls;
  }

  public paisSelecionado(event: any) {
    this.formFiltro.controls.idEstado.setValue(null);
    this.formFiltro.controls.idCidade.setValue(null);
    if (event) {
      this.provinciaEstadoService.buscarPorPais(event).subscribe(response => {
        this.listaProvinciasEstados = response as ItemCombo[];
        this.listaCidades = [];
      });
    } else {
      this.listaCidades = [];
      this.listaProvinciasEstados = [];
    }
  }

  public estadoSelecionado(event: any) {
    this.formFiltro.controls.idCidade.setValue(null);
    if (event) {
      this.cidadeService.buscarPorIdEstado(event).subscribe(response => {
        this.listaCidades = response as ItemCombo[];
      });
    } else {
      this.listaCidades = [];
    }
  }

}
