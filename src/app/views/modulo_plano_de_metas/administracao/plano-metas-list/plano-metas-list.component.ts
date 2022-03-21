import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { Prefeitura } from 'src/app/model/prefeitura';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';

export interface PrefeituraDTO{
id: number;
cidade: string;
estado: string;
responsavel: string;
inicioMandato: Date;
fimMandato: Date;
idPrefeituraLoagada: number;
}

@Component({
  selector: "app-plano-metas-list",
  templateUrl: "./plano-metas-list.component.html",
  styleUrls: ["./plano-metas-list.component.css"]
})
export class PlanoMetasListComponent implements OnInit {
  displayedColumns: string[] = [
    "Estado",
    "Cidade",
    "Responsavel",
    "InicioMandato",
    "FimMandato",
    "Acoes"
  ];
  dataSource = new MatTableDataSource<PrefeituraDTO>();
  loading: any;
  listaPrefeituraDTO: Array<PrefeituraDTO> = new Array<PrefeituraDTO>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  scrollUp: any;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    private element: ElementRef,
    public activatedRoute: ActivatedRoute,
    public prefeituraService: PrefeituraService
  ) {
    registerLocaleData(localePtBr);
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.loading = true;
    this.carregarDados();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  verificaRegistroPrefeituraLogada(idPrefeituraLista: number, idPrefeituraLogada) {
    if (idPrefeituraLista == idPrefeituraLogada) {
      return true;
    }
    return false;
  }

  carregarDados() {
    this.prefeituraService.buscarPrefeituraPlanoDeMetas().subscribe(
       response => {
        this.dataSource = new MatTableDataSource<PrefeituraDTO>(response);
        this.listaPrefeituraDTO = response;
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
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
    this.loading = false;
  }
}

