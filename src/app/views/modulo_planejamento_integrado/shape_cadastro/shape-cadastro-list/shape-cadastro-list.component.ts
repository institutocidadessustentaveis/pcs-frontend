import { MatSort, Sort } from '@angular/material';
import { MatPaginator } from '@angular/material';
import { ShapeFile } from './../../../../model/shapeFile';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { MatTableDataSource, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PaisService } from 'src/app/services/pais.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { TemaGeoespacialService } from 'src/app/services/tema-geoespacial.service';

@Component({
  selector: 'app-shape-cadastro-list',
  templateUrl: './shape-cadastro-list.component.html',
  styleUrls: ['./shape-cadastro-list.component.css']
})
export class ShapeCadastroListComponent implements OnInit {

  public listaCompleta: Array<ShapeFile>;
  public filtroOrigem: boolean = false;

  public tipoOrigem: string = '';

  public formFiltro: FormGroup;

  public dataSource: MatTableDataSource<ShapeFile>;
  public displayedColumns: string[] = ['dataHoraCadastro', 'titulo', 'exibirAuto', 'origemCadastro', 'dataHoraAlteracao', 'publicar', 'acoes'];
  scrollUp: any;
  idCidade = null;
  public orderBy: string = 'titulo';
  public direction: string = 'ASC';

  public loading: boolean = false;

  public exibirMensagemAlerta: boolean = false;

  public paisesCombo: Array<ItemCombo> = [];
  public estadosCombo: Array<ItemCombo> = [];
  public cidadesCombo: Array<ItemCombo> = [];
  public temasGeoespaciais: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public pageSize = 5;
  public length = 5;

  constructor(
    private shapeFileService: ShapeFileService,
    private router: Router,
    private element: ElementRef,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private paisService: PaisService,
    private estadoService: ProvinciaEstadoService,
    private cidadeService: CidadeService,
    private temaGeoespacialService: TemaGeoespacialService) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.formFiltro = this.formBuilder.group({
      filtro: [''],
      origem: ['Todos'],
      idPais: [''],
      idsEstados: [''],
      idsCidades: [''],
      temaGeoespacial: ['']
    });
  }

  ngOnInit() {
    this.buscarComboBox();
    this.buscarShapeFiles();
    const usuario: any = JSON.parse(this.authService.getUsuarioLogado());
    this.idCidade = usuario.dadosPrefeitura.id != null ? usuario.dadosPrefeitura.cidade.id : null;
  }

  public buscarComboBox(){
    this.paisService.buscarPaisesCombo().subscribe(res => {
      this.paisesCombo = res;
    });
    this.estadoService.buscarComboBoxEstado().subscribe(res => {
      this.estadosCombo = res;
    });
    this.cidadeService.buscarCidadeEstadoComboBox().subscribe(res => {
      this.cidadesCombo = res;
    });

    this.carregarTemasGeoespaciais();
  }

  public filtrar(){
    this.loading = true;

    let query = {
      'page': this.paginator.pageIndex,
      'itemsPerPage': this.paginator.pageSize ? this.paginator.pageSize : 5,
      'orderBy': this.orderBy,
      'direction': this.direction
    }

    if(this.formFiltro.controls.filtro.value) {
      query['filtro'] = this.formFiltro.controls.filtro.value;
    }

    if(this.formFiltro.controls.origem.value) {
      query['origem'] = this.formFiltro.controls.origem.value;
    }

    if(this.formFiltro.controls.idPais.value) {
      query['idPais'] = this.formFiltro.controls.idPais.value;
    }

    if(this.formFiltro.controls.idsEstados.value) {
      query['idsEstados'] = this.formFiltro.controls.idsEstados.value;
    }

    if(this.formFiltro.controls.idsCidades.value) {
      query['idsCidades'] = this.formFiltro.controls.idsCidades.value;
    }

    if(this.formFiltro.controls.temaGeoespacial.value) {
      query['temaGeoespacial'] = this.formFiltro.controls.temaGeoespacial.value;
    }

    this.shapeFileService.filtrarPorPalavraChave(query).subscribe(res => {
      this.loading = false;
      this.dataSource = new MatTableDataSource(res.shapes);
      this.dataSource.sort = this.sort;
      this.paginator.length = res.totalCount;
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; };
    }, error => {
      this.loading = false;
    })
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();

      this.filtrar();
    }
  }

  public carregarListaShapesPaginador(event: PageEvent): PageEvent {
    this.loading = true;

    let columnSort: string = "titulo";

    if(this.sort.active != undefined) {
      columnSort = this.sort.active;
    }

    this.orderBy = columnSort;

    this.filtrar();

    this.pageSize = event.pageSize;

    return event;
  }

  public excluirShapeFile(idShapeFile: number): void {
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir o Shapefile selecionado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.shapeFileService.excluirShapeFilePorId(idShapeFile).subscribe(response => {
          this.loading = false;
          PcsUtil.swal().fire('Excluído!', `Shapefile excluído.`, 'success');
          this.buscarShapeFiles();
        });
      }
    });
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  public publicar(shapeFile: ShapeFile) {
    return this.shapeFileService.publicar(shapeFile.id).subscribe(res => {
      shapeFile.publicar = !shapeFile.publicar;
    });
  }

  public irParaEditar(id: any) {
    this.router.navigate(['/planejamento-integrado/cadastro-shapefile/editar/' + id]);
  }

  public buscarShapeFiles() {
    let origem = this.tipoOrigem;
    let filtrarOrigem = this.filtroOrigem;
    this.loading = true;
    this.shapeFileService.buscarShapeFiles().subscribe(res => {
      if (filtrarOrigem) {
        if (origem === 'PCS') {
          this.listaCompleta = res.filter(item => item.origemCadastro === 'PCS');
          this.dataSource = new MatTableDataSource<ShapeFile>(this.listaCompleta);
        } else {
          this.listaCompleta = res.filter(item => item.origemCadastro !== 'PCS');
          this.dataSource = new MatTableDataSource<ShapeFile>(this.listaCompleta);
        }
      } else {
        this.listaCompleta = res as Array<ShapeFile>;
        this.dataSource = new MatTableDataSource<ShapeFile>(res);
      }
      this.exibirMensagemAlerta = this.listaCompleta.length == 0;
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
    this.loading = false;
}

private carregarTemasGeoespaciais() {
  this.temaGeoespacialService.buscarTodosSimples().subscribe(res => {
    this.temasGeoespaciais = res;
  });
}

}
