import { MaterialInstitucional } from './../../../../model/material-institucional';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialInstitucionalService } from 'src/app/services/material-institucional.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-material-institucional-list",
  templateUrl: "./material-institucional-list.component.html",
  styleUrls: ["./material-institucional-list.component.css"]
})
export class MaterialInstitucionalListComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public loading = false;

  public dataSource: MatTableDataSource<MaterialInstitucional>;
  public displayedColumns: string[] = ["titulo", "dtPublicacao", "acoes"];
  scrollUp: any;

  constructor(
    private materialInstitucionalService: MaterialInstitucionalService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private element: ElementRef,
    private router: Router,
    private titleService: Title,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.titleService.setTitle("Administrar Material Institucional - Cidades Sustentáveis");    
  }

  ngOnInit() {
    this.buscarMateriaisInstitucionais();
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private buscarMateriaisInstitucionais() {
    this.loading = true;
    this.materialInstitucionalService.buscarToList().subscribe(
      response => {
        this.dataSource = new MatTableDataSource<MaterialInstitucional>(
          response
        );
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
        this.paginator._intl.firstPageLabel = "Primeira página";
        this.paginator._intl.previousPageLabel = "Página anterior";
        this.paginator._intl.nextPageLabel = "Próxima página";
        this.paginator._intl.lastPageLabel = "Última página";
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          if (property.includes("."))
            return property.split(".").reduce((o, i) => o[i], item);
          return item[property];
        };
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
  }

  public excluirMaterialInstitucional(id: number): void {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true
    });

    PcsUtil.swal()
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente excluir o material selecionado?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        reverseButtons: false
      })
      .then(result => {
        if (result.value) {
          this.materialInstitucionalService
            .excluirMaterialInstitucional(id)
            .subscribe(response => {
              PcsUtil.swal().fire(
                "Excluído!",
                `Material institucional excluído.`,
                "success"
              );
              this.buscarMateriaisInstitucionais();
            });
        }
      });
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }
}
