import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent, Sort, MatDialog, MatDialogConfig } from '@angular/material';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { saveAs } from 'file-saver';
import { DadosDownloadComponent } from '../../../../components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { TemaGeoespacialService } from 'src/app/services/tema-geoespacial.service';


@Component({
  selector: 'app-catalogo-shape',
  templateUrl: './catalogo-shape.component.html',
  styleUrls: ['./catalogo-shape.component.css'],
})
export class CatalogoShapeComponent implements OnInit {

  @Output() carregarNoMapaEvent = new EventEmitter();
  
  @Output() configurarAtributosEvent = new EventEmitter();

  private urlEndPoint = `${environment.API_URL}shapefile`;

  displayedColumns: string[] = ['Título', 'Ano', 'Sistema de referência', 'Tipo', 'Origem', 'Download', 'Ações'];

  dataSource = new MatTableDataSource();

  shapes: any[] = [];

  public loading: boolean = false;

  public formFiltro: FormGroup;

  public pageSize = 5;

  public length = 5;

  private orderBy: string = 'titulo';

  private direction: string = 'ASC';

  public filtrado: boolean = false;

  public exibirMensagemAlerta: boolean = false;

  idCidade = null;

  dadosDownload = new DadosDownload;

  public chamarModal = false;

  public usuario = new Usuario;

  private estaLogado: boolean = false;

  public temasGeoespaciais: any = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public shapeFileService: ShapeFileService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              public dialog: MatDialog,
              private dadosDownloadService: DadosDownloadService,
              private router: Router,
              private usuarioService: UsuarioService,
              private temaGeoespacialService: TemaGeoespacialService
             ) {
    this.formFiltro = this.formBuilder.group({
      titulo: [''],
      ano: [],
      sistemaDeReferencia: ['TODOS'],
      tipo: ['TODOS'],
      nivelTerritorial: ['TODOS'],
      temaGeoespacial: []
    });
  }

  ngOnInit() {
    const usuarioLogado:any  = JSON.parse(this.authService.getUsuarioLogado());
    if (usuarioLogado && usuarioLogado.dadosPrefeitura && usuarioLogado.dadosPrefeitura.id ) {
      this.idCidade = usuarioLogado.dadosPrefeitura.cidade.id;
    }
    
    this.filtrarShapes();
    this.carregarTemasGeoespaciais();

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true) {
      this.getDadosUsuariosLogadosDownload();
    }
    
    
  }

  public configurarAtributos() {
    this.configurarAtributosEvent.emit()
  }

  public filtrarShapes() {
    this.loading = true;

    let titulo = this.formFiltro.controls.titulo.value;
    let ano = this.formFiltro.controls.ano.value;
    let sistemaDeReferencia = this.formFiltro.controls.sistemaDeReferencia.value;
    let tipo = this.formFiltro.controls.tipo.value;
    let nivelTerritorial = this.formFiltro.controls.nivelTerritorial.value;
    let temaGeoespacial = this.formFiltro.controls.temaGeoespacial.value;

    let query = {
      'page': this.paginator.pageIndex,
      'itemsPerPage': this.paginator.pageSize ? this.paginator.pageSize : 5,
      'orderBy': this.orderBy,
      'direction': this.direction
    }

    if(titulo) {
      query['titulo'] = titulo;
    }

    if(ano) {
      query['ano'] = parseInt(ano);
    }

    if(sistemaDeReferencia) {
      query['sistemaDeReferencia'] = sistemaDeReferencia;
    }

    if(tipo) {
      query['tipo'] = tipo;
    }

    if(nivelTerritorial) {
      query['nivelTerritorial'] = nivelTerritorial;
    }

    if(temaGeoespacial) {
      query['temaGeospacial'] = temaGeoespacial;
    }
    this.shapeFileService.filtrarShape(query).subscribe((response) => {
      this.filtrado = true;
      this.loading = false;
      this.shapes = response.shapes;
      this.exibirMensagemAlerta = response.shapes.length < 1;
      this.dataSource = new MatTableDataSource(this.shapes);
      this.dataSource.sort = this.sort;
      this.paginator.length = response.totalCount;
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; };
    });
  }

  private carregarTemasGeoespaciais() {
    this.temaGeoespacialService.buscarTodosSimples().subscribe(res => {
      this.temasGeoespaciais = res;
    });
  }

  public buscarShapesPaginados(page: number, itemsPerPage: number, orderBy: string, direction: string) {
    this.shapeFileService.buscarComPaginacao(page, itemsPerPage, orderBy, direction).subscribe((response) => {
      this.shapes = response.shapes;
      this.exibirMensagemAlerta = response.shapes.length < 1;
      this.dataSource = new MatTableDataSource(this.shapes);
      this.dataSource.sort = this.sort;
      this.paginator.length = response.totalCount;
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; };
      this.loading = false;
    });
  }

  public carregarListaShapesPaginador(event: PageEvent): PageEvent {
    this.loading = true;

    let columnSort: string = "titulo";

    if(this.sort.active != undefined) {
      columnSort = this.sort.active;
    }

    this.orderBy = columnSort;

    this.filtrarShapes();

    this.pageSize = event.pageSize;

    return event;
  }

  public limparFiltro() {
    this.loading = true;
    this.formFiltro.controls.titulo.setValue('');
    this.formFiltro.controls.ano.setValue('');
    this.formFiltro.controls.sistemaDeReferencia.setValue('TODOS');
    this.formFiltro.controls.tipo.setValue('TODOS');
    this.formFiltro.controls.nivelTerritorial.setValue('TODOS');
    this.formFiltro.controls.temaGeoespacial.setValue(null)
    this.filtrado = false;
    this.filtrarShapes();
  }

  public excluirShapeFile(idShapeFile: number) {
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
        this.shapeFileService.excluirShapeFilePorId(idShapeFile).subscribe(response => {
          PcsUtil.swal().fire('Excluído!', `Shapefile excluído.`, 'success');
          this.filtrarShapes();
        });
      }
    });
  }

  sortData(sort: Sort) {
    this.loading = true;

    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();

      this.filtrarShapes();
    }
  }

  public gerarUrlArquivo(id: number, extensao: string) {
    return `${this.urlEndPoint}/${id}.${extensao}`;
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  public carregarShapeParaEdicao(idShapeFile: number) {
    this.carregarNoMapaEvent.emit(idShapeFile);
  }

  public downloadshapeFile(shape: any, extensao: string) {
    this.shapeFileService.downloadShapeFile(shape.id, extensao).subscribe(res => {
      const blob = new Blob([res], { type: 'application/octet-stream' });
      if(extensao == 'shp') {
        extensao = 'zip';
      }
      let nomeArquivo = null;
      if (shape.ano != null) {
        nomeArquivo = shape.titulo + '-' + shape.ano + '.' + extensao;
      } else {
        nomeArquivo = shape.titulo + '.' + extensao;
      }
      saveAs(blob, nomeArquivo);
    });
    
  }

  public validacaoDownloadGeojson(shape: any, extensao: string){
    if(this.estaLogado) {
      this.dadosDownload.arquivo = shape.titulo;
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadshapeFile(shape, extensao);
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Geojson';
      this.dadosDownload.pagina = 'Catálogo de Camadas';
      this.dadosDownload.arquivo = shape.titulo;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadshapeFile(shape, extensao);
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Geojson",
      pagina: "Catálogo de Camadas",
      arquivo: shape.titulo
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.downloadshapeFile(shape, extensao);
      }
    });
    }
  }

  public validacaoDownloadShape(shape: any, extensao: string){
   if(this.estaLogado) {
    this.dadosDownload.arquivo = shape.titulo;
    this.cadastrarDadosDownload(this.dadosDownload);
    this.downloadshapeFile(shape, extensao);

    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Shapefile';
      this.dadosDownload.pagina = 'Catálogo de Camadas';
      this.dadosDownload.arquivo = shape.titulo;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadshapeFile(shape, extensao);
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Shapefile",
      pagina: "Catálogo de Camadas",
      arquivo: shape.titulo
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
               
        this.downloadshapeFile(shape, extensao);
       }
    });
    }
  }

  public getDadosUsuariosLogadosDownload() {
    this.getUsuarioLogadoDadosDownloadGeojson();
    this.getUsuarioLogadoDadosDownloadShape();
  }

  public getUsuarioLogadoDadosDownloadShape(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Shapefile';
    this.dadosDownload.pagina = 'Catálogo de Camadas';    
    });
  }

  public getUsuarioLogadoDadosDownloadGeojson(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Geojson';
    this.dadosDownload.pagina = 'Catálogo de Camadas';    
    });
  }
  
public cadastrarDadosDownload(dados: DadosDownload) {
  this.dadosDownloadService.cadastrarDados(dados).subscribe();
}


}