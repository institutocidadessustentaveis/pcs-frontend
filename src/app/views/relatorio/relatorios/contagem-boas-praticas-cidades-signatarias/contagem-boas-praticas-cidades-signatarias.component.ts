import { Router } from '@angular/router';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { ExportadorRelatoriosComponent } from './../exportador-relatorios/exportador-relatorios.component';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { RelatorioContagemBoasPraticas } from './../../../../model/Relatorio/RelatorioContagemBoasPraticas';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-contagem-boas-praticas-cidades-signatarias',
  templateUrl: './contagem-boas-praticas-cidades-signatarias.component.html',
  styleUrls: ['./contagem-boas-praticas-cidades-signatarias.component.css']
})
export class ContagemBoasPraticasCidadesSignatariasComponent implements OnInit {

  public tipoVariavel: string;
  public tipoBoaPratica: string = 'Prefeitura';
  public loading: boolean = false;
  public nenhumRegistroEncontrado: boolean = false;
  public displayedColumns: string[] = ["nome","contagem"];
  public registros: Array<RelatorioContagemBoasPraticas> = new Array<RelatorioContagemBoasPraticas>();
  public formFiltro: FormGroup;
  public tituloRelatorio: string = 'Relatório de contagem de boas práticas das cidades signatárias';

  public dataSource = new MatTableDataSource<RelatorioContagemBoasPraticas>();
  public   colunas = [
    { title: 'Nome', dataKey: 'nome' },
    { title: 'Contagem', dataKey: 'contagem' },
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
    private router: Router) {
      this.scrollUp = this.router.events.subscribe(path => {
        element.nativeElement.scrollIntoView();
      });
      this.formFiltro = this.formBuilder.group({
        tipoVariavel: ['Eixos'],
      });
    }

  ngOnInit() {
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

  gerarRelatorio() {
    this.loading = true;

    this.tipoVariavel = this.formFiltro.controls.tipoVariavel.value;

    this.relatorioService.searchRelatorioContagemBoasPraticas(this.tipoVariavel, this.tipoBoaPratica).subscribe(
      response => {
        this.verificaResultadoEncontrado(response);
        this.pesquisou = true;
        this.nenhumRegistroEncontrado = response.length === 0;
        this.registros = response;
        this.dataSource = new MatTableDataSource<RelatorioContagemBoasPraticas>(
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

  formatarParaExportar(registros: Array<RelatorioContagemBoasPraticas>): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['nome'] = registro.nome;
      formatado['contagem'] = registro.contagem;
      formatados.push(formatado);
    });
    return formatados;
  }

  formatarParaXls(registros: Array<RelatorioContagemBoasPraticas>): any[] {
    let formatadosXls: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['nome'] = registro.nome;
      formatado['contagem'] = registro.contagem;
      formatadosXls.push(formatado);
    });
    return formatadosXls;
  }
}
