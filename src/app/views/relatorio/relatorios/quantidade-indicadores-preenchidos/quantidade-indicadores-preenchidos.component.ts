import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { QuantidadeIndicadoresPreenchidos } from 'src/app/model/Relatorio/QuantidadeIndicadoresPreenchidos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ExportadorRelatoriosComponent } from '../exportador-relatorios/exportador-relatorios.component';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { Prefeitura } from 'src/app/model/prefeitura';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quantidade-indicadores-preenchidos',
  templateUrl: './quantidade-indicadores-preenchidos.component.html',
  styleUrls: ['./quantidade-indicadores-preenchidos.component.css']
})
export class QuantidadeIndicadoresPreenchidosComponent implements OnInit {

  loading: boolean = false;
  nenhumRegistroEncontrado: boolean = false;
  displayedColumns: string[] = ['Prefeitura', 'Estado', 'Codigo IBGE', 'Ano', 'População', 'Quantidade de Indicadores Preenchidos'];
  dataSource = new MatTableDataSource<QuantidadeIndicadoresPreenchidos>();
  filtro: QuantidadeIndicadoresPreenchidos = new QuantidadeIndicadoresPreenchidos();
  registros: Array<QuantidadeIndicadoresPreenchidos> = new Array<QuantidadeIndicadoresPreenchidos>();
  formFiltro: FormGroup;
  titulo: string = "Quantidade de Indicadores Preenchidos";
  listaPrefeitura = [];
  colunas = [
    { title: 'Prefeitura', dataKey: 'prefeitura' },
    { title: 'Estado', dataKey: 'estado' },
    { title: 'Código IBGE', dataKey: 'codigoIBGE' },
    { title: 'Ano', dataKey: 'ano' },
    { title: 'População', dataKey: 'populacao' },
    { title: 'Quantidade de Indicadores Preenchidos', dataKey: 'quantidade' },
  ];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ExportadorRelatoriosComponent) exportador: ExportadorRelatoriosComponent;
  scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(private service: RelatorioService,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private prefeituraService: PrefeituraService, private element: ElementRef
    , private router: Router) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
    this.formFiltro = this.formBuilder.group({
      anoInicio: [''],
      anoFim: [''],
      ano: [''],
      prefeitura: ['']
    });
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.loading = false;

    this.prefeituraService.buscarComboBoxPrefeitura().subscribe(response => {
      this.listaPrefeitura = response as Prefeitura[];
    });
  }

  gerarRelatorio() {
    this.loading = true;
    this.filtro.anoInicio = this.formFiltro.controls['anoInicio'].value;
    this.filtro.anoFim = this.formFiltro.controls['anoFim'].value;
    this.filtro.prefeitura = this.formFiltro.controls['prefeitura'].value.label;
    this.filtro.usuarioLogado = this.authService.credencial.login;

    this.service.searchQuantidadeIndicadoresPreenchidos(this.filtro).subscribe((response) => {
      this.verificaResultadoEncontrado(response);
      this.pesquisou = true;
      this.nenhumRegistroEncontrado = (response.length === 0);
      this.registros = response;
      this.dataSource = new MatTableDataSource<QuantidadeIndicadoresPreenchidos>(response);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
    }, error => { this.loading = false });
  }

  formatarParaExportar(registros: Array<QuantidadeIndicadoresPreenchidos>): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['prefeitura'] = registro.prefeitura;
      formatado['estado'] = registro.estadoSigla ? registro.estadoSigla : registro.estado;
      formatado['codigoIBGE'] = registro.codigoIBGE;
      formatado['ano'] = registro.ano;
      formatado['quantidade'] = registro.quantidade;
      formatado['populacao'] = registro.populacao;
      formatados.push(formatado);
    });
    return formatados;
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

}
