import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { NoticiaService } from 'src/app/services/noticia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Noticia } from 'src/app/model/noticia';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { NoticiasFiltradas } from 'src/app/model/noticiasFiltradas';

@Component({
  selector: 'app-noticia-list',
  templateUrl: './noticia-list.component.html',
  styleUrls: ['./noticia-list.component.css']
})
export class NoticiaListComponent implements OnInit {

  loading = true;
  displayedColumns: string[] = ['Título', 'Autor', 'Usuário', 'Data/Hora Criação', 'Data/Hora Publicação', 'Ações'];
  dataSource = new MatTableDataSource();

  public length = 10;
  public pageSize = 10;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private orderBy: string = 'dataHoraCriacao';

  private direction: string = 'DESC';

  scrollUp: any;
  
  constructor(public noticiaService: NoticiaService, 
              public activatedRoute: ActivatedRoute, 
              private element: ElementRef, 
              private router: Router) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.buscarNoticias(0, this.pageSize, "dataHoraCriacao", "DESC");
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  buscarNoticias(page: number, linesPerPage: number, orderBy: string, direction: string) {
    this.loading = true;
    this.noticiaService.buscarComPaginacao(page, linesPerPage, orderBy, direction).subscribe(response => {
      const noticiasDTO = response as NoticiasFiltradas;
      this.dataSource = new MatTableDataSource(noticiasDTO.listaNoticias);
      this.dataSource.sort = this.sort;
      this.paginator.length = noticiasDTO.countTotalNoticias;
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; };
      this.loading = false;
    });
  }

  excluir(noticia) {
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Notícia: '${noticia.titulo}'?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    }).then((result) => {
      this.loading = true;
      if (result.value) {
        this.noticiaService.deletar(noticia.idNoticia)
          .subscribe(response => {
            this.buscarNoticias(0, this.pageSize, "dataHoraCriacao", "DESC");
            PcsUtil.swal().fire('Excluído!', `Notícia: '${noticia.titulo}' excluída!`, 'success');
          });
      } else {
        this.loading = false;
      }
    }, error => { this.loading = false; });
  }

  public carregarPaginaBoasPraticas(event: PageEvent): PageEvent {
    let columnSort: string = "dataHoraCriacao";

    if(this.sort.active != undefined) {
      columnSort = this.sort.active;
    }

    this.buscarNoticias(event.pageIndex, event.pageSize, columnSort, this.sort.direction.toUpperCase());
    this.pageSize = event.pageSize;
    return event;
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();
      this.buscarNoticias(this.paginator.pageIndex, this.paginator.pageSize, this.orderBy , this.direction);
    }
  }

}
