import { UsuarioService } from 'src/app/services/usuario.service';
import { AtividadeGestorMunicipalService } from './../../../../services/atividadeGestorMunicipalService';
import { CidadeService } from './../../../../services/cidade.service';
import { ItemCombo } from './../../../../model/ItemCombo ';
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { AtividadeGestorMunicipal } from 'src/app/model/Relatorio/AtividadeGestorMunicipal';
import moment from 'moment';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';

@Component({
  selector: 'app-acoes-gestores-municipais',
  templateUrl: './acoes-gestores-municipais.component.html',
  styleUrls: ['./acoes-gestores-municipais.component.css']
})


export class AcoesGestoresMunicipaisComponent implements OnInit {

  date = new Date();
  displayedColumns: string[] = ['nomeUsuario', 'cidade', 'data', 'hora', 'acao'];
  dataSource = new MatTableDataSource<AtividadeGestorMunicipal>();
  atividadeGestorMunicipal: AtividadeGestorMunicipal = new AtividadeGestorMunicipal();
  tabela: Array<AtividadeGestorMunicipal> = new Array<AtividadeGestorMunicipal>();
  loading: any;
  formRelatorio: FormGroup;
  listaEstado = [];
  listaCidade = [];
  listaAcao = [];
  listaUsuario = [];
  exibeCampos = false;
  titulo = "Ações Gestores Municipais";
  colunas = [
    { title: 'Usuário de Prefeitura', dataKey: 'usuario' },
    { title: 'Cidade', dataKey: 'cidade' },
    { title: 'Data', dataKey: 'data' },
    { title: 'Hora', dataKey: 'hora' },
    { title: 'Ação', dataKey: 'acao' },
  ];

  public resultadoEncontrado = false;
  public pesquisou = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() idRelatorio: number;
  scrollUp: any;

  constructor(public relatorioService: RelatorioService,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    private provinciaEstadoService: ProvinciaEstadoService,
    private cidadeService: CidadeService,
    private atividadeGestorMunicipalService: AtividadeGestorMunicipalService,
    private usuarioService: UsuarioService,private element: ElementRef
    ,private router: Router) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
    registerLocaleData(localePtBr);
    this.formRelatorio = this.formBuilder.group({
      dataInicio: [''],
      dataFim: [''],
      dataHora: [''],
      usuario: [''],
      estado: [''],
      cidade: [''],
      acao: [''],
    });
  }

  ngOnInit() {
    this.tabela = [];
    this.atividadeGestorMunicipal.id = 0;
    this.atividadeGestorMunicipal.nomeUsuario = '';
    this.atividadeGestorMunicipal.acao = '';
    this.atividadeGestorMunicipal.usuarioLogado = this.authService.credencial.login;
    this.atividadeGestorMunicipal.dataInicio = new Date();
    this.atividadeGestorMunicipal.dataFim = new Date();
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.loading = false;
    this.formRelatorio.controls['dataHora'].setValue(new Date());
    this.formRelatorio.controls['usuario'].setValue('');
    this.formRelatorio.controls['estado'].setValue('');
    this.formRelatorio.controls['cidade'].setValue('');

    this.provinciaEstadoService.buscarComboBoxEstado().subscribe(response => {
      this.listaEstado = response as ItemCombo[];
    });
    this.atividadeGestorMunicipalService.buscarComboBoxAcao().subscribe(response => {
      this.listaAcao = response as ItemCombo[];
    });
    this.usuarioService.buscarComboBoxUsuario().subscribe(response => {
      this.listaUsuario = response as ItemCombo[];
    });
  }

  searchReport() {
    this.loading = true;

    //Build Object to send
    this.atividadeGestorMunicipal.nomeUsuario = this.formRelatorio.controls['usuario'].value.label;
    this.atividadeGestorMunicipal.acao = this.formRelatorio.controls['acao'].value.label;
    this.atividadeGestorMunicipal.estado = this.formRelatorio.controls['estado'].value.label;
    this.atividadeGestorMunicipal.cidade = this.formRelatorio.controls['cidade'].value.label;
    let dataInicio = this.formRelatorio.controls['dataInicio'].value;
    let dataFim = this.formRelatorio.controls['dataFim'].value;
    this.atividadeGestorMunicipal.dataInicio = new Date(dataInicio);
    this.atividadeGestorMunicipal.dataFim = new Date(dataFim);
    this.relatorioService.searchAcaoGestorMunicipal(this.atividadeGestorMunicipal).subscribe(response => {
      this.verificaResultadoEncontrado(response);
      this.pesquisou = true;
      this.dataSource = new MatTableDataSource<AtividadeGestorMunicipal>(response);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.tabela = response;
    }, error => { this.loading = false; });
  }

  formatarParaExportar(registros: AtividadeGestorMunicipal[]): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['usuario'] = registro.nomeUsuario;
      formatado['cidade'] = registro.cidade;
      formatado['data'] = moment(registro.dataHora).format("DD/MM/YYYY");
      formatado['hora'] = moment(registro.dataHora).format("HH:mm:ss");
      formatado['acao'] = registro.acao;
      formatados.push(formatado);
    });
    return formatados;
  }

  public async estadoSelecionado(event: any) {
    if (event != '0' || event != 0) {
      this.cidadeService.buscarPorIdEstado(event.id).subscribe(response => {
        this.listaCidade = response as ItemCombo[];
      });
    } else {
      this.listaCidade = [];
    }

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

}
