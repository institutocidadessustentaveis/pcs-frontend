import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { ItemCombo } from './../../../../model/ItemCombo ';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RelatorioShapesCadastrados } from 'src/app/model/Relatorio/RelatorioShapesCadastrados';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExportadorRelatoriosComponent } from '../exportador-relatorios/exportador-relatorios.component';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { registerLocaleData } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import localePtBr from '@angular/common/locales/pt';
import { saveAs } from 'file-saver';
import { PlanoMetasService } from 'src/app/services/plano-metas.service';
import moment from 'moment';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { Router } from '@angular/router';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { Usuario } from 'src/app/model/usuario';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-shapes-cadastrados',
  templateUrl: './shapes-cadastrados.component.html',
  styleUrls: ['./shapes-cadastrados.component.css']
})
export class ShapesCadastradosComponent implements OnInit {

  public idShape: number;
  public usuario: number;
  public tituloShape: string;
  public dataCriacao: string;
  public dataEdicao: string;

  public loading: boolean = false;
  public nenhumRegistroEncontrado: boolean = false;
  public displayedColumns: string[] = ['usuario', 'tituloShape', 'dataCriacao', 'dataEdicao'];
  public dataSource = new MatTableDataSource<RelatorioShapesCadastrados>();
  public filtro: RelatorioShapesCadastrados = new RelatorioShapesCadastrados();
  public registros: Array<RelatorioShapesCadastrados> = new Array<RelatorioShapesCadastrados>();
  public formFiltro: FormGroup;
  public titulo: string = 'Relatório de Shapes Cadastrados pelo PCS';
  public listaUsuario: ItemCombo[] = [];
  public colunas = [
    { title: 'Título do shape', dataKey: 'tituloShape' },
    { title: 'Nome do usuário', dataKey: 'usuario' },
    { title: 'Data Cadastro', dataKey: 'dataCriacao' },
    { title: 'Data Edição', dataKey: 'dataEdicao' }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ExportadorRelatoriosComponent)
  public exportador: ExportadorRelatoriosComponent;
  public scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;

  public dadosDownload = new DadosDownload;
  public usuarioDados: Usuario;
  public estaLogado: boolean;

  constructor(
    private planoMetasService: PlanoMetasService,
    private service: RelatorioService,
    public formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private element: ElementRef,
    private router: Router,
    public dialog: MatDialog,
    private dadosDownloadService: DadosDownloadService,
    private authService: AuthService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
    this.formFiltro = this.formBuilder.group({
      dataCriacao: [null],
      dataEdicao: [null],
      usuario: [null],
      tituloShape: [null]
    });
  }

  ngOnInit() {
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.loading = false;

    this.usuarioService.buscarComboBoxUsuarioSemPrefeitura().subscribe(response => {
      this.listaUsuario = response as ItemCombo[];
    });

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true) {
      this.getUsuarioLogadoDadosDownload();
    }
    
  }

  gerarRelatorio() {
    this.loading = true;

    this.usuario = this.formFiltro.controls['usuario'].value;
    this.tituloShape = this.formFiltro.controls['tituloShape'].value;
    this.dataEdicao = this.formFiltro.controls['dataEdicao'].value != null ? moment(this.formFiltro.controls['dataEdicao'].value).format('YYYY-MM-DD') : '';
    this.dataCriacao = this.formFiltro.controls['dataCriacao'].value != null ? moment(this.formFiltro.controls['dataCriacao'].value).format('YYYY-MM-DD') : '';

    this.service.searchShapesCadastrados(this.usuario, this.dataCriacao, this.dataEdicao, this.tituloShape).subscribe(
      response => {
        this.verificaResultadoEncontrado(response);
        this.pesquisou = true;
        this.nenhumRegistroEncontrado = response.length === 0;
        this.registros = response;
        this.dataSource = new MatTableDataSource<RelatorioShapesCadastrados>(
          response
        );
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator._intl.firstPageLabel = 'Primeira página';
        this.paginator._intl.previousPageLabel = 'Página anterior';
        this.paginator._intl.nextPageLabel = 'Próxima página';
        this.paginator._intl.lastPageLabel = 'Última página';
      },
      error => {
        this.loading = false;
      }
    );
  }

  formatarParaExportar(registros: Array<RelatorioShapesCadastrados>): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['tituloShape'] = registro.tituloShape;
      formatado['usuario'] = registro.usuario;
      formatado['dataCriacao'] = moment(registro.dataCriacao).format(
        'DD/MM/YYYY'
      );
      if (registro.dataEdicao == null) {
        formatado['dataEdicao'] = 'Não alterado';
      } else {
        formatado['dataEdicao'] = moment(registro.dataEdicao).format(
          'DD/MM/YYYY'
        );
      }
      formatados.push(formatado);
    });
    return formatados;
  }

  download(id) {
    this.planoMetasService.download(id).subscribe(res => {
      let bytes: any = res;
      const blob = new Blob([bytes], { type: 'application/octet-stream' });
      saveAs(blob, `Plano de Metas.xlsx`);
    });
  }

  verificaResultadoEncontrado(res: any) {
    if (res != null && res !== undefined && res.length > 0) {
      this.resultadoEncontrado = true;
      this.loading = false;
    } else {
      this.resultadoEncontrado = false;
      this.loading = false;
    }
  }

  public validacaoDownload(id) {
    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.download(id);
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download do Plano de Metas';
      this.dadosDownload.pagina = 'Shapes Cadastrados';
      this.dadosDownload.arquivo = this.tituloShape
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.download(id);
    } else {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      acao: "Download do Plano de Metas",
      pagina: "Shapes Cadastrados",
      arquivo: this.tituloShape
    }

    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.download(id);
      }
    });
    }
  }

  public getUsuarioLogadoDadosDownload(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuarioDados = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download do Plano de Metas';
    this.dadosDownload.pagina = 'Shapes Cadastrados';  
    this.dadosDownload.arquivo = this.tituloShape;  
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }
}
