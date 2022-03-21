import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';
import { CidadeService } from 'src/app/services/cidade.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { ExportadorRelatoriosComponent } from './../exportador-relatorios/exportador-relatorios.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RelatorioShapesExportados } from 'src/app/model/Relatorio/RelatorioShapesExportardos';
import moment from 'moment';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { PerfisService } from 'src/app/services/perfis.service';

@Component({
  selector: 'app-shapes-exportados',
  templateUrl: './shapes-exportados.component.html',
  styleUrls: ['./shapes-exportados.component.css']
})
export class ShapesExportadosComponent implements OnInit {

  public idShape: number;
  public perfil: number;
  public cidade: number;
  public tituloShape: string;
  public dataExportacao: string;

  public loading: boolean = false;
  public nenhumRegistroEncontrado: boolean = false;
  public displayedColumns: string[] = ['usuario', 'cidade', 'tituloShape', 'dataExportacao', 'horaExportacao'];
  public dataSource = new MatTableDataSource<RelatorioShapesExportados>();
  public filtro: RelatorioShapesExportados = new RelatorioShapesExportados();
  public registros: Array<RelatorioShapesExportados> = new Array<RelatorioShapesExportados>();
  public formFiltro: FormGroup;
  public titulo: string = 'Relatório de Shapes Exportados';
  public listaPerfil = [];
  public listaCidades = [];
  public colunas = [
    { title: 'Nome do usuário', dataKey: 'usuario' },
    { title: 'Cidade', dataKey: 'cidade' },
    { title: 'Título do shape', dataKey: 'tituloShape' },
    { title: 'Data Exportação', dataKey: 'dataExportacao' },
    { title: 'Hora Exportação', dataKey: 'horaExportacao' }
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
    private perfisService: PerfisService,
    private cidadeService: CidadeService,
    private element: ElementRef,
    private router: Router,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
    this.formFiltro = this.formBuilder.group({
      perfil: [null],
      cidade: [null]
    });
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
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
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.loading = false;

    this.perfisService.buscarComboBoxPerfis().subscribe(response => {
      this.listaPerfil = response as ItemCombo[];
    });

    this.populaComboCidades();
  }

  gerarRelatorio() {
    this.loading = true;

    this.perfil = this.formFiltro.controls.perfil.value;
    this.cidade = this.formFiltro.controls.cidade.value;
    this.service.searchShapesExportados(this.perfil, this.cidade, ).subscribe(
      response => {
        this.verificaResultadoEncontrado(response);
        this.pesquisou = true;
        this.nenhumRegistroEncontrado = response.length === 0;
        this.registros = response;
        this.dataSource = new MatTableDataSource<RelatorioShapesExportados>(
          response
        );
        this.paginator._intl.itemsPerPageLabel = 'Itens por página';
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

  formatarParaExportar(registros: Array<RelatorioShapesExportados>): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['usuario'] = registro.usuario;
      formatado['cidade'] = registro.cidade;
      formatado['tituloShape'] = registro.tituloShape;
      formatado['dataExportacao'] = moment(registro.dataExportacao).format('DD/MM/YYYY');
      formatado['horaExportacao'] = moment(registro.dataExportacao).format('HH:mm:ss');

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

  private populaComboCidades() {
    this.cidadeService.buscarCidadesSignatariasParaCombo().subscribe(res => {
      this.listaCidades = res;
    });
  }

}
