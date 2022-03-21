import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { BoaPratica } from 'src/app/model/boaPratica';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialApoio } from 'src/app/model/MaterialApoio';
import { MaterialApoioService } from 'src/app/services/materialApoio.service';

@Component({
  selector: 'app-material-apoio-list',
  templateUrl: './material-apoio-list.component.html',
  styleUrls: ['./material-apoio-list.component.css']
})
export class MaterialApoioListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  loading = false;

  public boaPratica: BoaPratica = new BoaPratica();

  public dataSource: MatTableDataSource<MaterialApoio>;
  public displayedColumns: string[] = ['dataPublicacao', 'titulo', 'localExibicao', 'tipoDocumento', 'acoes'];
  scrollUp: any;

  constructor(private materialApoioService: MaterialApoioService, private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private element: ElementRef) {
   this.scrollUp = this.router.events.subscribe((path) => {
   element.nativeElement.scrollIntoView();
   });
              }

  ngOnInit() {

    this.buscarMateriaisDeApoio();

    if (!this.hasRole('ROLE_EDITAR_MATERIAL_APOIO') && !this.hasRole('ROLE_DELETAR_MATERIAL_APOIO')) {
      this.displayedColumns = ['titulo', 'localExibicao', 'tipoDocumento'];
    }
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private buscarMateriaisDeApoio() {
    this.materialApoioService.buscarMateriaisDeApoio().subscribe(response => {
      this.dataSource = new MatTableDataSource<MaterialApoio>(response);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; };
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (item, property) => {
        if (property.includes('.')) return property.split('.').reduce((o,i)=>o[i], item)
        return item[property];
     };
      this.dataSource.sort = this.sort;
    }, error => { });
  }

  public excluirMaterialApoio(idMaterialApoio: number): void {
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir o item selecionado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.materialApoioService.excluirMaterialApoio(idMaterialApoio).subscribe(response => {
          PcsUtil.swal().fire('Material de apoio!', `Excluído com sucesso.`, 'success');
          this.buscarMateriaisDeApoio();
        });
      }
    });
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

}
