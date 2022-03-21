import { InstitucionalDinamicoSecao1 } from '../../../model/institucional-dinamico-secao1';
import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { InstitucionalDinamico } from 'src/app/model/institucional-dinamico';
import { InstitucionalDinamicoService } from 'src/app/services/institucional-dinamico.service';
import { environment } from 'src/environments/environment';
import { InstitucionalInternoService } from 'src/app/services/institucional-interno.service';
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $;

@Component({
  selector: 'app-institucional-dinamico-form',
  templateUrl: './institucional-dinamico-list.component.html',
  styleUrls: ['./institucional-dinamico-list.component.css', './institucional-dinamico-list.component.scss']
})
export class InstitucionalDinamicoListComponent implements OnInit {

  public institucionalDinamico: InstitucionalDinamico = new InstitucionalDinamico();

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  loading: any;

  public urlBase;
  scrollUp: any;

  public step;
  public todasSecoes: any[] = [];
  public todasSecoesResumidas: any[] = [];
  public listaPaginas = new Array<any>();
  public displayedColumnsSecao: string[] = ['titulo', 'link','exibir', 'acoes'];
  public formFiltro: FormGroup;

  constructor(public institucionalDinamicoService: InstitucionalDinamicoService,
              public institucionalInternoService: InstitucionalInternoService,
              public dialog: MatDialog,
              public authService: AuthService,
              private router: Router,
              private element: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private activatedRoute: ActivatedRoute, 
              public domSanitizationService: DomSanitizer,
              private formBuilder: FormBuilder) {
                this.scrollUp = this.router.events.subscribe((path) => {
                  element.nativeElement.scrollIntoView();
                });

                this.formFiltro = this.formBuilder.group({
                  campoPesquisa: ['']
                });
              }

  ngOnInit() {
    this.urlBase = window.location.origin;
    this.buscarListaInstitucionalDinamicoResumida();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  private async buscarListaInstitucionalDinamicoResumida() {
      await this.institucionalDinamicoService.buscarTodasPaginasInstitucional().subscribe(response => {
        this.listaPaginas = response as Array<any>;
        this.dataSource = new MatTableDataSource<any>(this.listaPaginas);
        this.paginator._intl.itemsPerPageLabel = 'Itens por página';
        this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._intl.firstPageLabel = 'Primeira página';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.nextPageLabel = 'Próxima página';
        this.paginator._intl.lastPageLabel = 'Última página';
      });
  }

  public excluirPagina(id: number) {
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a página selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.institucionalDinamicoService.excluirInstitucionalDinamico(id).subscribe(pagina => {
          PcsUtil.swal().fire('Excluído!', `Página excluída.`, 'success');
          this.buscarListaInstitucionalDinamicoResumida();
        });
      } else {
        this.loading = false;
      }
    });
  }

  public cadastrarInstitucionalDinamico() {
    this.router.navigate([`/paginas-editor/cadastrar`]);
  }

  public editarInstitucionalDinamico(id: number){
    this.router.navigate([`/paginas-editor/editar/${id}`]);
  }

  public setStep(index: number) {
    this.step = index;
  }

  public openPageNewTab(link_pagina) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/paginas/${link_pagina}`])
    );
    window.open(url, '_blank');
  }

  filtrarPaginaPorPalavraChave(){
    let listaFiltrada: any[] = [];
    let palavraChave: string = this.formFiltro.controls.campoPesquisa.value;

    if(palavraChave){
      listaFiltrada = this.listaPaginas.filter(pagina => {
        return pagina.titulo.toLowerCase().includes(palavraChave.toLowerCase())
      });     
      this.reloadDataSource(listaFiltrada);
    } else {
      this.buscarListaInstitucionalDinamicoResumida();
    }
  }

  reloadDataSource(listaFiltrada){
    this.listaPaginas = listaFiltrada;
    this.dataSource = new MatTableDataSource<any>(this.listaPaginas);
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
  }

}


