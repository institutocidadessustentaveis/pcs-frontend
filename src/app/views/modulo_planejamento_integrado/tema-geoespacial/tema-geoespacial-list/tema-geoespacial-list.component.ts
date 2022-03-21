import { TemaGeoespacialService } from './../../../../services/tema-geoespacial.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-tema-geoespacial-list',
  templateUrl: './tema-geoespacial-list.component.html',
  styleUrls: ['./tema-geoespacial-list.component.css']
})
export class TemaGeoespacialListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  loading = true;
  dataSource: any = [];
  displayedColumns = ['nome', 'acoes'];
  lista = [];
  constructor(private service: TemaGeoespacialService,
              private authService: AuthService) { }

  ngOnInit() {
    this.carregarLista();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  carregarLista() {
    this.loading = false;
    this.service.buscarTodos().subscribe( res => {
      this.lista = res;
      this.dataSource = new MatTableDataSource<any>( this.lista );
      this.configuraPaginator();
      this.loading = false;
    });
  }

  public configuraPaginator() {
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
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.dataSource.paginator = this.paginator;
    this.dataSource.sortingDataAccessor = (item, property) => {
          if (property.includes('.')) {
            return property.split('.').reduce((o, i) => o[i], item);
          }
          return item[property];
        };
    this.dataSource.sort = this.sort;
  }

  questionarExclusao(id, nome) {
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja excluir o tema: ${nome}? `,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
          this.service.excluir(id).subscribe(res => {
            this.carregarLista();
            PcsUtil.swal().fire({
              title: 'Registro excluído!',
              type: 'success',
            });
          });
      }
    });
  }

}
