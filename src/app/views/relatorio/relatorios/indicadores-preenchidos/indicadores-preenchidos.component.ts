import { ItemCombo } from './../../../../model/ItemCombo ';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSort, MatPaginator, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { DomSanitizer } from '@angular/platform-browser';
import { EixoService } from 'src/app/services/eixo.service';
import { Eixo } from 'src/app/model/eixo';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { RelatorioIndicadoresPreenchidos } from 'src/app/model/relatorio-indicadores-preenchidos';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Indicador } from 'src/app/model/indicadores';
import { AuthService } from 'src/app/services/auth.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import moment from 'moment';
import { Prefeitura } from 'src/app/model/prefeitura';
import { Router } from '@angular/router';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';

@Component({
  selector: 'app-indicadores-preenchidos',
  templateUrl: './indicadores-preenchidos.component.html',
  styleUrls: ['./indicadores-preenchidos.component.css']
})
export class IndicadoresPreenchidosComponent implements OnInit {

  formulario: FormGroup;
  displayedColumns: string[] = ['Prefeitura', 'Estado', 'Codigo IBGE', 'Indicador', 'ODS', 'Eixo', 'anoIndicador','dataPreenchimento','horaPreenchimento'];
  dataSource = new MatTableDataSource<RelatorioIndicadoresPreenchidos>();
  listaOds = [];
  listaEixos = [];
  listaIndicadores = [];
  listaPrefeitura = [];
  listaEstados = [];
  listaDTO = [];
  loading: any;
  odsCtrl = new FormControl();
  indicadorPreenchido: RelatorioIndicadoresPreenchidos = new RelatorioIndicadoresPreenchidos();
  titulo = 'Indicadores Preenchidos';
  colunas = [
    { title: 'Prefeitura', dataKey: 'prefeitura' },
    { title: 'Estado', dataKey: 'estado' },
    { title: 'Código IBGE', dataKey: 'codigoIBGE' },
    { title: 'Indicador', dataKey: 'indicador' },
    { title: 'ODS', dataKey: 'ods' },
    { title: 'Eixo', dataKey: 'eixo' },
    { title: 'Ano', dataKey: 'anoIndicador' },
    { title: 'Data Preenchimento', dataKey: 'dataPreenchimento' },
    { title: 'Hora Preenchimento', dataKey: 'horaPreenchimento' },
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() idRelatorio: number;
  scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;

  public page = 0;
  public pageSize = 10;
  public length2 = 10;

  public listaParaExportar: any[] = [];

  constructor(public formBuilder: FormBuilder,
    public relatorioService: RelatorioService,
    public domSanitizationService: DomSanitizer,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private eixoService: EixoService,
    private indicadoresService: IndicadoresService,
    private authService: AuthService,
    private prefeituraService: PrefeituraService,private element: ElementRef
    ,private router: Router,
    private provinciaEstadoService: ProvinciaEstadoService) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });

    this.formulario = this.formBuilder.group({
      anoInicio: [''],
      anoFim: [''],
      indicador: [''],
      ods: [''],
      prefeitura: [''],
      estado: [''],
      eixo: [''],
      dataPreenchimento: ['']
    });
  }

  ngOnInit() {
    this.loading = false;
    this.odsService.buscar().subscribe(response => {
      this.listaOds = response as ObjetivoDesenvolvimentoSustentavelService[];
    });
    this.eixoService.buscarEixo().subscribe(response => {
      this.listaEixos = response as Eixo[];
    });
    this.indicadoresService.buscarIndicadorItemCombo().subscribe(response => {
      this.listaIndicadores = response as ItemCombo[];
    });
    this.prefeituraService.buscarComboBoxPrefeitura().subscribe(response => {
      this.listaPrefeitura = response as ItemCombo[];
    });

    this.buscarEstadosComboBox();
  }

  sortData(sort: Sort) {
    if (sort) {
      this.indicadorPreenchido.orderBy = sort.active;
      this.indicadorPreenchido.direction = sort.direction.toUpperCase();
      this.searchReport();
      this.paginator.pageIndex = 0;
    }
  }

  public searchReport() {

    this.indicadorPreenchido.anoInicio = this.formulario.controls.anoInicio.value;
    this.indicadorPreenchido.anoFim = this.formulario.controls.anoFim.value;
    this.indicadorPreenchido.prefeitura = this.formulario.controls.prefeitura.value.label;
    this.indicadorPreenchido.estadoNomecompleto = this.formulario.controls.estado.value.label;
    this.indicadorPreenchido.indicador = this.formulario.controls.indicador.value;
    this.indicadorPreenchido.ods = this.formulario.controls.ods.value;
    this.indicadorPreenchido.eixo = this.formulario.controls.eixo.value;
    this.indicadorPreenchido.page = this.page;
    this.indicadorPreenchido.linesPerPage = this.pageSize;

    this.relatorioService.searchIndicadoresPreenchidosComPaginacao(this.indicadorPreenchido).subscribe(response => {
      this.verificaResultadoEncontrado(response);
      this.pesquisou = true;
      
      this.listaDTO = response as RelatorioIndicadoresPreenchidos[];
      
      this.dataSource = new MatTableDataSource(this.listaDTO);

      if (response.length > 0) {
        this.paginator.length = this.listaDTO[0].count;
        this.paginator._intl.itemsPerPageLabel = 'Itens por página';
        this.paginator._intl.firstPageLabel = 'Primeira página';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.nextPageLabel = 'Próxima página';
        this.paginator._intl.lastPageLabel = 'Última página';
        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length2: number) => { if (length2 == 0 || pageSize == 0) { return `0 de ${length2}`; } length2 = Math.max(length2, 0); const startIndex = page * pageSize; const endIndex = startIndex < length2 ? Math.min(startIndex + pageSize, length2) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length2}`; };
      }

      this.loading = false;
      this.dataSource.sort = this.sort;

      this.formatarParaExportar();
    }, error => { this.loading = false });
  }

  formatarParaExportar(){
    this.relatorioService.searchIndicadoresPreenchidos(this.indicadorPreenchido).subscribe(response => {
      this.listaParaExportar = [];    
      response.forEach(registro => {
        let formatado: {} = {};
        formatado['prefeitura'] = registro.prefeitura;
        formatado['estado'] = registro.estado ? registro.estado : registro.estadoNomecompleto;
        formatado['codigoIBGE'] = registro.codigoIBGE;
        formatado['indicador'] = registro.indicador;
        formatado['ods'] = registro.ods;
        formatado['eixo'] = registro.eixo;
        formatado['anoIndicador'] = registro.anoIndicador;
        formatado['dataPreenchimento'] = moment(registro.dataPreenchimento).format("DD/MM/YYYY");
        formatado['horaPreenchimento'] = moment(registro.dataPreenchimento).format("HH:MM:SS");
        this.listaParaExportar.push(formatado);
      });     
    });
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

  public carregarPagina(event: PageEvent){

    this.pageSize = event.pageSize;

    this.indicadorPreenchido.page = event.pageIndex;
    this.indicadorPreenchido.linesPerPage = event.pageSize;

    this.relatorioService.searchIndicadoresPreenchidosComPaginacao(this.indicadorPreenchido).subscribe(response => {
      this.verificaResultadoEncontrado(response);
      this.pesquisou = true;
      this.listaDTO = response as RelatorioIndicadoresPreenchidos[];
      this.dataSource = new MatTableDataSource(response);

      if (response) {
        this.paginator.length = this.listaDTO[0].count;
        this.paginator._intl.itemsPerPageLabel = 'Itens por página';
        this.paginator._intl.firstPageLabel = 'Primeira página';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.nextPageLabel = 'Próxima página';
        this.paginator._intl.lastPageLabel = 'Última página';
        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length2: number) => { if (length2 == 0 || pageSize == 0) { return `0 de ${length2}`; } length2 = Math.max(length2, 0); const startIndex = page * pageSize; const endIndex = startIndex < length2 ? Math.min(startIndex + pageSize, length2) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length2}`; };
      }

      this.dataSource.sort = this.sort;

      this.formatarParaExportar();
    }, error => { this.loading = false });
  }

  buscarEstadosComboBox(){
    this.provinciaEstadoService.buscarComboBoxEstadosBrasil().subscribe(res => {
      this.listaEstados = res as ItemCombo[];
    });
  }

}
