import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator, MatSort, PageEvent, Sort, MatTableDataSource } from '@angular/material';
import { TemaGeoespacialService } from 'src/app/services/tema-geoespacial.service';
import { HistoricoShapeService } from 'src/app/services/historico-shape.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

var moment = require('moment');

@Component({
  selector: 'app-historico-shapes',
  templateUrl: './historico-shapes.component.html',
  styleUrls: ['./historico-shapes.component.css']
})
export class HistoricoShapesComponent implements OnInit {

  formFiltro: FormGroup;

  displayedColumns: string[] = ["Data de criação", "Data de edição", "Usuário", "Nome do arquivo", "Tema"];

  dataSource = new MatTableDataSource<any>();

  historico: any[] = [];

  temas: any[] = [];

  filtrado: boolean = false;

  public pageSize = 5;

  public length = 5;

  private orderBy: string = 'dataCriacao';

  private direction: string = 'DESC';

  loading: boolean = false;

  scrollUp: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public historicoShapeService: HistoricoShapeService,
              public temaGeoespacialService: TemaGeoespacialService, 
              public formBuilder: FormBuilder,
              private element: ElementRef,
              private router: Router,
              private titleService: Title) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    
    this.formFiltro = this.formBuilder.group({
      dataCriacao: [''],
      dataEdicao: [''],
      usuario: [''],
      nomeArquivo: [''],
      tema: ['']
    });
  }

  ngOnInit() {
    this.titleService.setTitle("Histórico de shapes - Cidades sustentáveis");
    this.buscarHistoricoShape(0, 10, "dataCriacao", "DESC");
    this.carregarTemas();
  }

  public filtrarHistoricoShapes() {
    this.loading = true;

    let dataCriacao = this.formFiltro.controls.dataCriacao.value;
    let dataEdicao = this.formFiltro.controls.dataEdicao.value;
    let usuario = this.formFiltro.controls.usuario.value;
    let nomeArquivo = this.formFiltro.controls.nomeArquivo.value;
    let tema = this.formFiltro.controls.tema.value;

    let query = {
      'page': this.paginator.pageIndex,
      'itemsPerPage': this.paginator.pageSize
    };

    if(dataCriacao) {
      query['dataCriacao'] = dataCriacao.format('YYYY-MM-DDTHH:mm:SS.sssZ');
    }

    if(dataEdicao) {
      query['dataEdicao'] = dataEdicao.format('YYYY-MM-DDTHH:mm:SS.sssZ');
    }

    if(usuario) {
      query['usuario'] = usuario;
    }

    if(nomeArquivo) {
      query['nomeArquivo'] = nomeArquivo;
    }

    if(tema) {
      query['tema'] = tema;
    }

    this.historicoShapeService.filtrarHistoricoShape(query).subscribe((response) => {
      this.historico = response['historico'];

      this.historico.forEach(r => {
        r["dataCriacao"] = moment.utc(r["dataCriacao"]);
        r["dataEdicao"] = r["dataEdicao"] ? moment.utc(r["dataEdicao"]) : null;
      });

      this.dataSource = new MatTableDataSource<any>(this.historico);
      this.dataSource.sort = this.sort;
      this.paginator.length = response['totalCount'];
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
      this.paginator._intl.itemsPerPageLabel = "Itens por página";
      this.paginator._intl.firstPageLabel = "Primeira página";
      this.paginator._intl.previousPageLabel = "Página anterior";
      this.paginator._intl.nextPageLabel = "Próxima página";
      this.paginator._intl.lastPageLabel = "Última página";
      this.loading = false;
    });
  }

  public buscarHistoricoShape(page: number, quantity: number, 
                              orderBy: string, direction: string) {
    this.historicoShapeService.buscarHistoricoShape(page, quantity, orderBy, direction).subscribe((response) => {
      this.historico = response['historico'];

      this.historico.forEach(r => {
        r["dataCriacao"] = moment.utc(r["dataCriacao"]);
        r["dataEdicao"] = r["dataEdicao"] ? moment.utc(r["dataEdicao"]) : null;
      });

      this.dataSource = new MatTableDataSource<any>(this.historico);
      this.dataSource.sort = this.sort;
      this.paginator.length = response['totalCount'];
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
      this.paginator._intl.itemsPerPageLabel = "Itens por página";
      this.paginator._intl.firstPageLabel = "Primeira página";
      this.paginator._intl.previousPageLabel = "Página anterior";
      this.paginator._intl.nextPageLabel = "Próxima página";
      this.paginator._intl.lastPageLabel = "Última página";
      this.loading = false;
    });
  }

  public limparFiltro() {
    this.formFiltro.reset();
    this.buscarHistoricoShape(0, 10, "dataCriacao", "DESC");
  }

  public carregarTemas() {
    this.temaGeoespacialService.buscarTodos().subscribe((temas) => {
      this.temas = temas;
    });
  }

  public carregarPaginaHistorico(event: PageEvent): PageEvent {
    if (this.filtrado) {
      this.filtrarHistoricoShapes();
    } else {
      this.buscarHistoricoShape(event.pageIndex, event.pageSize, 
                                this.sort.active, this.sort.direction.toUpperCase());
    }

    return event;
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();
      this.buscarHistoricoShape(this.paginator.pageIndex, this.paginator.pageSize, this.orderBy , this.direction);
    }
  }

}
