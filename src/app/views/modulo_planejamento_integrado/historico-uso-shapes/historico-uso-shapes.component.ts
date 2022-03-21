import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, Sort } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HistoricoUsoShapesService } from 'src/app/services/historico-uso-shapes.service';

var moment = require('moment');

@Component({
  selector: 'app-historico-uso-shapes',
  templateUrl: './historico-uso-shapes.component.html',
  styleUrls: ['./historico-uso-shapes.component.css']
})
export class HistoricoUsoShapesComponent implements OnInit {

  formFiltro: FormGroup;

  dataSource = new MatTableDataSource<any>();

  historico: any[] = [];

  displayedColumns: string[] = ["Data de acesso", "Cidade", "Usuário", "Título", "Tipo"];

  loading: boolean = false;

  exibirMensagemAlerta: boolean = false;

  filtrado: boolean = false;

  scrollUp: any;

  private orderBy: string = 'dataCriacao';

  private direction: string = 'DESC';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private historicoUsoShapesService: HistoricoUsoShapesService,
              private formBuilder: FormBuilder,
              private element: ElementRef,
              private router: Router,
              private titleService: Title) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.formFiltro = this.formBuilder.group({
      dataAcesso: [''],
      cidade: [''],
      usuario: [''],
      titulo: [''],
      tipo: ['']
    });

    this.titleService.setTitle("Histórico de uso dos shapes - Cidades Sustentáveis")
  }

  ngOnInit() {
    this.buscarHistoricoUsoShape(0, 10, "dataHoraAcesso", "DESC");
  }

  public filtrarHistoricoUsoShape() {
    this.loading = true;

    let dataAcesso = this.formFiltro.controls.dataAcesso.value;
    let cidade = this.formFiltro.controls.cidade.value;
    let usuario = this.formFiltro.controls.usuario.value;
    let titulo = this.formFiltro.controls.titulo.value;
    let tipo = this.formFiltro.controls.tipo.value;

    let query = {
      'page': this.paginator.pageIndex,
      'itemsPerPage': this.paginator.pageSize
    };

    if(dataAcesso) {
      query['dataHoraAcesso'] = dataAcesso.format('YYYY-MM-DDTHH:mm:SS.sssZ');
    }

    if(cidade) {
      query['cidade'] = cidade;
    }

    if(usuario) {
      query['usuario'] = usuario;
    }

    if(titulo) {
      query['titulo'] = titulo;
    }

    if(tipo) {
      query['tipo'] = tipo;
    }

    this.historicoUsoShapesService.filtrarHistoricoUsoShape(query).subscribe((response) => {
      this.filtrado = true;
      this.historico = response['historico'];

      this.historico.forEach(r => {
        r["dataHoraAcesso"] = moment.utc(r["dataHoraAcesso"]);
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
          startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;
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

  public buscarHistoricoUsoShape(page: number, quantity: number,
                                  orderBy: string, direction: string) {
    this.loading = true;
    
    this.historicoUsoShapesService.buscarHistoricoUsoShape(page, quantity, 
                                                            orderBy, direction).subscribe((response) => {
      this.historico = response['historico'];

      this.historico.forEach(r => {
        r["dataHoraAcesso"] = moment.utc(r["dataHoraAcesso"]);
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
          startIndex < length ?
          Math.min(startIndex + pageSize, length) :
          startIndex + pageSize;
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
    this.buscarHistoricoUsoShape(0, 10, "dataHoraAcesso", "DESC");
    this.filtrado = false;
  }

  public carregarPaginaHistorico(event: PageEvent): PageEvent {
    if (this.filtrado) {
      this.filtrarHistoricoUsoShape();
    } else {
      this.buscarHistoricoUsoShape(event.pageIndex, event.pageSize, 
                                    this.sort.active, this.sort.direction.toUpperCase());
    }

    return event;
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();
      this.buscarHistoricoUsoShape(this.paginator.pageIndex, this.paginator.pageSize, 
                                    this.orderBy , this.direction);
    }
  }

  public capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

}
