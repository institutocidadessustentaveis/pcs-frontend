import { DownloadsExportacoesService } from './../../../../services/downloadsexportacoes.service';
import { UsuarioService } from './../../../../services/usuario.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource, MatPaginator, MatSort, PageEvent } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import moment from 'moment';
// Model
import { DownloadsExportacoes } from '../../../../model/Relatorio/DownloadsExportacoes';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { DadosDownloadDTO } from 'src/app/model/dados-download-dto';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { Title } from '@angular/platform-browser';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-download-exportacoes',
  templateUrl: './download-exportacoes.component.html',
  styleUrls: ['./download-exportacoes.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DownloadExportacoesComponent implements OnInit {

  dadosDownload: DadosDownloadDTO = new DadosDownloadDTO();

  public listaCompleta: Array<DadosDownloadDTO>;
  listaFiltrada: Array<DadosDownloadDTO> = new Array<DadosDownloadDTO>();
  listaPaginas = [];
  listaAcao = [];
  listaCidades = [];

  public resultadoEncontrado = false;
  public loading = false;
  public pesquisou = false;

  public page = 0;
  public itemsPerPage = 10;
  public orderBy: string = 'dataDownload';
  public direction: string = 'ASC';
  public pageSize = 5;
  public length = 5;

  formFiltro: FormGroup;

  displayedColumns: string[] = ["nomeCidade", "email", "nome", "dataDownload"];
  expandedElement: DadosDownloadDTO | null;
  date: Date = new Date();
  nomeArquivo = 'Relatórios Dados Download';
  titulo: string = "Relatórios Dados Download";
  colunas: any[] = [
    { title: "Cidade", dataKey: "cidade" },
    { title: "Email", dataKey: "email" },
    { title: "Nome", dataKey: "nome" },
    { title: "Organização", dataKey: "organizacao" },
    { title: "Boletim", dataKey: "boletim" },
    { title: "Arquivo", dataKey: "arquivo" },
    { title: "Data Download", dataKey: "dataDownload" },
    { title: "Ação", dataKey: "acao" },
    { title: "Página", dataKey: "pagina" }
  ];

  dataSource = new MatTableDataSource<DadosDownloadDTO>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() idRelatorio: number;
  scrollUp: any;

  constructor(
    public relatorioService: RelatorioService, 
    public activatedRoute: ActivatedRoute,
    public authService: AuthService, 
    public formBuilder: FormBuilder, 
    private element: ElementRef,
    private router: Router,
    private dadosDownloadService: DadosDownloadService,
    public title: Title,
    private service: RelatorioService
    ) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
    registerLocaleData(localePtBr);
    this.formFiltro = this.formBuilder.group({
      dataInicio: [''],
      dataFim: [''],
      pagina: [''],
      acao: [''],
      cidade: [''],
    });
  }

  ngOnInit() {
    this.buscarCombosBox();
    
    this.formFiltro.controls['acao'].setValue('');
    this.formFiltro.controls['pagina'].setValue('');
    this.formFiltro.controls['cidade'].setValue('');
    
  }

  public buscarDadosFiltrados() {
    this.loading = true;
    this.dadosDownload.dataInicio = this.formFiltro.controls['dataInicio'].value;
    this.dadosDownload.dataFim = this.formFiltro.controls['dataFim'].value;
    this.dadosDownload.acao = this.formFiltro.controls['acao'].value.label;
    this.dadosDownload.pagina = this.formFiltro.controls['pagina'].value.label;
    this.dadosDownload.nomeCidade = this.formFiltro.controls['cidade'].value.label;

    this.dadosDownloadService.searchDadosDownload(this.dadosDownload).subscribe(response => {
      this.verificaResultadoEncontrado(response);
      this.listaFiltrada = response as Array<DadosDownloadDTO>;
      this.dataSource = new MatTableDataSource<DadosDownloadDTO>(this.listaFiltrada);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
    }, error => { this.loading = false });
    
  }

  public buscarCombosBox(){
    this.buscarComboBoxAcao();
    this.buscarComboBoxPagina();
    this.buscarComboBoxCidade();
  }

  public buscarComboBoxAcao(){
    this.dadosDownloadService.buscarComboBoxAcao().subscribe(response => {
      this.listaAcao = response as ItemCombo[];
    });
  }

  public buscarComboBoxPagina(){
    this.dadosDownloadService.buscarComboBoxPagina().subscribe(response => {
      this.listaPaginas = response as ItemCombo[];
    });
  }

  public buscarComboBoxCidade(){
    this.dadosDownloadService.buscarComboBoxCidade().subscribe(response => {
      this.listaCidades = response as ItemCombo[];
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

  formatarParaExportar(downloads: DadosDownloadDTO[]): any[] {
    if(downloads) {
    let formatados: any[] = [];
      downloads.forEach(download => {
      let formatado: {} = {};
      formatado["dataDownload"] = moment(download.dataDownload).format("DD/MM/YYYY");
      formatado["cidade"] = download.nomeCidade ? download.nomeCidade : 'N/A';
      formatado["nome"] = download.usuarioNome ? download.usuarioNome : download.nome;
      formatado["email"] = download.email;
      formatado["organizacao"] = download.organizacao ? download.organizacao : 'N/A';
      formatado["boletim"] = download.boletim ? 'Sim' : 'Não';
      formatado["arquivo"] = download.arquivo;
      formatado["acao"] = download.acao;
      formatado["pagina"] = download.pagina;

      formatados.push(formatado);
    });
    return formatados;
    } else {
      return;
    }
  }

  formatarParaXls(downloads: DadosDownloadDTO[]): any[] {
    if(downloads) {
    let formatadosXls: any[] = [];
    downloads.forEach(download => {
      let formatado: {} = {};
      formatado["dataDownload"] = moment(download.dataDownload).format("DD/MM/YYYY");
      formatado["cidade"] = download.nomeCidade ? download.nomeCidade : 'N/A';
      formatado["nome"] = download.usuarioNome ? download.usuarioNome : download.nome;
      formatado["email"] = download.email;
      formatado["organizacao"] = download.organizacao ? download.organizacao : 'N/A';
      formatado["boletim"] = download.boletim ? 'Sim' : 'Não';
      formatado["arquivo"] = download.arquivo;
      formatado["acao"] = download.acao;
      formatado["pagina"] = download.pagina;
      formatadosXls.push(formatado);
    });
    return formatadosXls;
    } else {
      return;
    }
  }
}
