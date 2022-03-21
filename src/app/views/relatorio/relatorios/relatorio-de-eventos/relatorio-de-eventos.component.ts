import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { RelatorioEventos } from 'src/app/model/Relatorio/RelatorioEventos';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ExportadorRelatoriosComponent } from '../exportador-relatorios/exportador-relatorios.component';
import moment from 'moment';
import { PaisService } from 'src/app/services/pais.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { StripTagsPipe } from 'src/app/components/strip-tags/strip-tags.pipe';

const pipeRemoveTagsHtml = new StripTagsPipe();

@Component({
  selector: 'app-relatorio-de-eventos',
  templateUrl: './relatorio-de-eventos.component.html',
  styleUrls: ['./relatorio-de-eventos.component.css']
})
export class RelatorioDeEventosComponent implements OnInit {

  public tipo: string;
  public dataInicial: string;
  public dataFinal: string;
  public endereco: string;
  public titulo: string;
  public cidade: number;
  public estado: number;
  public pais: number;

  public loading: boolean = false;
  public nenhumRegistroEncontrado: boolean = false;
  public displayedColumns: string[] = ["titulo", "tipo", "dataEvento","endereco","organizador","site","publicado"];
  public registros: Array<RelatorioEventos> = new Array<RelatorioEventos>();
  public formFiltro: FormGroup;
  public tituloRelatorio: string = 'Relatório de Eventos';

  public listaPaises = [];
  public listaProvinciasEstados = [];
  public listaCidades = [];

  public dataSource = new MatTableDataSource<RelatorioEventos>();
  public colunas = [
    { title: 'Título', dataKey: 'titulo' },
    { title: 'Tipo', dataKey: 'tipo' },
    { title: 'Data evento', dataKey: 'dataEvento' },
    { title: 'Organizador', dataKey: 'organizador' },
    { title: 'Online', dataKey: 'online' },
    { title: 'Site', dataKey: 'site' },
    { title: 'Publicado', dataKey: 'publicado' },
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
    private element: ElementRef,
    private paisService: PaisService,
    private provinciaEstadoService: ProvinciaEstadoService,
    private cidadeService: CidadeService,
    private router: Router
  ) { 
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.formFiltro = this.formBuilder.group({
      tipo: [null],
      dataInicial: [null],
      dataFinal: [null],
      endereco: [null],
      titulo: [null],
      pais: [null],
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
    this.paisService.buscarPaisesCombo().subscribe(response => {
      this.listaPaises = response as ItemCombo[];
    });

  }

  gerarRelatorio() {
    this.loading = true;

    this.tipo = this.formFiltro.controls['tipo'].value;
    this.dataInicial = this.formFiltro.controls['dataInicial'].value != null ? moment(this.formFiltro.controls['dataInicial'].value).format('YYYY-MM-DD') : '';
    this.dataFinal = this.formFiltro.controls['dataFinal'].value != null ? moment(this.formFiltro.controls['dataFinal'].value).format('YYYY-MM-DD') : '';
    this.endereco = this.formFiltro.controls['endereco'].value;
    this.titulo = this.formFiltro.controls['titulo'].value;
    this.pais = this.formFiltro.controls['pais'].value;
    this.estado = this.formFiltro.controls['estado'].value;
    this.cidade = this.formFiltro.controls['cidade'].value;    

    this.service.searchRelatorioEventos(this.tipo, this.dataInicial, this.dataFinal, this.endereco, this.titulo, this.cidade, this.estado, this.pais).subscribe(
      response => {
        this.verificaResultadoEncontrado(response);
        this.pesquisou = true;
        this.nenhumRegistroEncontrado = response.length === 0;
        this.registros = response;
        this.dataSource = new MatTableDataSource<RelatorioEventos>(
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

  formatarParaExportar(registros: Array<RelatorioEventos>): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['tipo'] = registro.tipo;
      formatado['dataEvento'] = moment(registro.dataEvento).format('DD/MM/YYYY');
      formatado['endereco'] = registro.endereco;
      formatado['titulo'] = registro.nome;
      formatado['organizador'] = registro.organizador;
      formatado['online'] = registro.online;
      formatado['site'] = registro.site;
      if(registro.publicado) {
        formatado['publicado'] = "Sim";
      } else {
        formatado['publicado'] = "Não";
      }
      formatados.push(formatado);
    });
    return formatados;
  }

  formatarParaXls(registros: Array<RelatorioEventos>): any[] {
    let formatadosXls: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['titulo'] = registro.nome;
      formatado['tipo'] = registro.tipo;
      formatado['dataEvento'] = moment(registro.dataEvento).format('DD/MM/YYYY');
      formatado['endereco'] = registro.endereco;
      formatado['pais'] = registro.nomePais;
      formatado['estado'] = registro.nomeProvinciaEstado;
      formatado['cidade'] = registro.nomeCidade;
      formatado['descricao'] = pipeRemoveTagsHtml.transform(registro.descricao);
      formatado['organizador'] = registro.organizador;
      formatado['temas'] = registro.temas;
      formatado['eixos'] = registro.eixos;
      formatado['ods'] = registro.tituloOds;
      if(registro.online){
        formatado['online'] = "Sim";
      } else {
        formatado['online'] = "Não";
      }
      formatado['site'] = registro.site;
      formatado['latitude'] = registro.latitude;
      formatado['longitude'] = registro.longitude;
      if(registro.publicado){
        formatado['publicado'] = "Sim";
      } else {
        formatado['publicado'] = "Não";
      }
      if(registro.externo){
        formatado['externo'] = "Sim";
      } else {
        formatado['externo'] = "Não";
      }
      formatado['linkExterno'] = registro.linkExterno;
      formatadosXls.push(formatado);
    });
    return formatadosXls;
  }

  public async paisSelecionado(event: any) {
    this.formFiltro.controls['estado'].setValue("");
    this.formFiltro.controls['cidade'].setValue("");
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

  public async estadoSelecionado(event: any) {
    this.formFiltro.controls['cidade'].setValue("");
    if (event) {
      this.cidadeService.buscarPorIdEstado(event).subscribe(response => {
        this.listaCidades = response as ItemCombo[];
      });
    } else { 
      this.listaCidades = [];
    }
  }

}
