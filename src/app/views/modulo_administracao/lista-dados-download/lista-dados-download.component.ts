import { FormBuilder, FormGroup } from '@angular/forms';
import  moment  from 'moment';
import { RelatorioService } from './../../../services/relatorio.service';
import { AuthService } from 'src/app/services/auth.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer, CenterTabStop } from "docx";
import { Component, OnInit, ViewChild } from '@angular/core';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { DadosDownloadDTO } from 'src/app/model/dados-download-dto';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-lista-dados-download',
  templateUrl: './lista-dados-download.component.html',
  styleUrls: ['./lista-dados-download.component.css']
})
export class ListaDadosDownloadComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  dataSource = new MatTableDataSource<DadosDownloadDTO>();

  public listaCompleta: Array<DadosDownloadDTO>;
  public listaFiltrada: Array<DadosDownloadDTO>;
  listaPaginas = [];
  listaAcao = [];
  listaCidades = [];

  public resultadoEncontrado = false;
  public loading = false;
  public pesquisou = false;

  registros;
  registrosXls;


 displayedColumns: string[] = ["cidade", "email", "nome", "organizacao", "boletim", "arquivo", "dataDownload", "usuario", "acao", "pagina"];
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
    { title: "Usuário", dataKey: "usuario" },
    { title: "Ação", dataKey: "acao" },
    { title: "Página", dataKey: "pagina" }
  ];

  dadosDownload: DadosDownloadDTO = new DadosDownloadDTO();
  formFiltro: FormGroup;

  public page = 0;
  public itemsPerPage = 10;
  public orderBy: string = 'dataDownload';
  public direction: string = 'ASC';
  public pageSize = 5;
  public length = 5;
		 
  constructor(
    private dadosDownloadService: DadosDownloadService,
    private authService: AuthService,
    public relatorioService: RelatorioService,
    public formBuilder: FormBuilder,
    public title: Title,
    private service: RelatorioService
  ) { 
    this.formFiltro = this.formBuilder.group({
      dataInicio: [''],
      dataFim: [''],
      pagina: [''],
      acao: [''],
      cidade: [''],
    });
  }

  

  ngOnInit() {
    this.title.setTitle('Lista de Dados de Downloads');
    this.listaCompleta = [];
    this.listaFiltrada = [];
    this.buscarDadosFiltrados();
    //this.buscarTodos();
    //this.buscarDadosDownloadPaginados(0, 10, "dataDownload", "ASC");
    this.buscarCombosBox();
    
    this.formFiltro.controls['acao'].setValue('');
    this.formFiltro.controls['pagina'].setValue('');
    this.formFiltro.controls['cidade'].setValue('');
    
  }

  public buscarTodos(){
    this.loading = true;
    this.dadosDownloadService.buscarTodosDadosDownload().subscribe(response => {
      this.verificaResultadoEncontrado(response);
      this.listaCompleta = response as Array<DadosDownloadDTO>;
      this.dataSource = new MatTableDataSource<DadosDownloadDTO>(response);
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
      this.registros = this.formatarParaExportar(this.listaFiltrada);
      this.registrosXls = this.formatarParaXls(this.listaFiltrada);
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

  public buscarDadosDownloadPaginados(page: number, itemsPerPage: number, orderBy: string, direction: string){
    this.loading = true;
    this.dadosDownloadService.buscarComPaginacao(page, itemsPerPage, orderBy, direction).subscribe(response => {
      this.listaCompleta = response.dados 
      //this.listaCompleta = response as Array<DadosDownloadDTO>;
       this.verificaResultadoEncontrado(this.listaCompleta);
       this.pesquisou = true;
       this.dataSource = new MatTableDataSource<DadosDownloadDTO>(this.listaCompleta);
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

  public carregarListaDadosPaginador(event: PageEvent): PageEvent {
    this.loading = true;

    let columnSort: string = "titulo";

    if(this.sort.active != undefined) {
      columnSort = this.sort.active;
    }

    this.orderBy = columnSort;

    this.buscarDadosFiltrados();

    this.pageSize = event.pageSize;

    return event;
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
    let formatados: any[] = [];
      downloads.forEach(download => {
      let formatado: {} = {};
      formatado["dataDownload"] = moment(download.dataDownload).format(
        "DD/MM/YYYY"
      );
      formatado["cidade"] = download.nomeCidade;
      formatado["nome"] = download.nome;
      formatado["email"] = download.email
      formatado["organizacao"] = download.organizacao;

      if(download.boletim === true){
        formatado["boletim"] = "Sim"
      }else{
        formatado["boletim"] = "Não"
      }

      formatado["arquivo"] = download.arquivo;
      formatado["usuario"] = download.usuarioNome;
      formatado["acao"] = download.acao;
      formatado["pagina"] = download.pagina;

      formatados.push(formatado);
    });
    return formatados;
  }

  formatarParaXls(downloads: DadosDownloadDTO[]): any[] {
    let formatadosXls: any[] = [];
    downloads.forEach(download => {
      let formatado: {} = {};
      formatado["dataDownload"] = moment(download.dataDownload).format(
        "DD/MM/YYYY"
      );
      formatado["cidade"] = download.nomeCidade;
      formatado["nome"] = download.nome;
      formatado["email"] = download.email
      formatado["organizacao"] = download.organizacao;

      if(download.boletim === true){
        formatado["boletim"] = "Sim"
      }else{
        formatado["boletim"] = "Não"
      }

      formatado["arquivo"] = download.arquivo;
      formatado["usuario"] = download.usuarioNome;
      formatado["acao"] = download.acao;
      formatado["pagina"] = download.pagina;
      formatadosXls.push(formatado);
    });
    return formatadosXls;
  }

  exportXls() {
    const registrosExportacao = this.registrosXls ? this.registrosXls : this.registros;
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(PcsUtil.buildDataToReport(this.titulo, registrosExportacao));
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
    XLSX.writeFile(workBook, this.nomeArquivo + '_' + this.date.toLocaleDateString() + '.xlsx');
    this.service.gravaLogDownExport(this.authService.credencial.login, this.titulo + "(Xlsx)").subscribe(response => {});
  }

  exportCsv() {
    const registrosExportacao = this.registrosXls ? this.registrosXls : this.registros;
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(PcsUtil.buildDataToReport(this.titulo, registrosExportacao));
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
    XLSX.utils.sheet_to_csv(workSheet);
    XLSX.writeFile(workBook, this.nomeArquivo + '_' + this.date.toLocaleDateString() + '.csv');
    this.service.gravaLogDownExport(this.authService.credencial.login, this.titulo + "(csv)").subscribe(response => { });

  }

  exportDoc() {
    let column: number = 0;
    let row: number = 1;

    const doc = new Document();
    doc.Styles.createParagraphStyle('Heading1', 'Heading 1').basedOn("Normal")
      .next("Normal")
      .quickFormat()
      .size(28)
      .bold()
      .italics()
      .color('#47825e')
      .spacing({ after: 120 });

    doc.Styles.createParagraphStyle('Heading2', 'Heading 2').basedOn("Normal")
      .next("Normal")
      .quickFormat()
      .size(16)
      .bold()
      .color('#47825e')
      .spacing({ after: 10 });

    doc.createParagraph(this.titulo).heading1().center();
    const table = doc.createTable(this.registros.length + 1, this.colunas.length);
    let k = 0;
    this.colunas.forEach(coluna => {
      table.getCell(0, k).addContent(new Paragraph(coluna.title.toString()).heading2().center());
      k++;
    });

    for (const item of this.registros) {
      this.colunas.forEach(coluna => {
        if (item[coluna.dataKey] == null){
          item[coluna.dataKey] = '';
        }
        table.getCell(row, column).addContent(new Paragraph(item[coluna.dataKey].toString()));
        column++;
      });
      row++;
      column = 0;
    }

    const packer = new Packer();

    packer.toBlob(doc).then(blob => {
      saveAs(blob, this.nomeArquivo + '_' + this.date.toLocaleDateString() + '.docx');
    });
    this.service.gravaLogDownExport(this.authService.credencial.login, this.titulo + "(Docx)").subscribe(response => { });

  }

  exportPdf = () => {
    const doc = new jsPDF('p', 'pt', 'a4', true);
    let rows = [];

    let xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(this.colunas[0]) * doc.internal.getFontSize() / 2);

    doc.setTextColor('#47825e');
    doc.text(this.titulo, xOffset, 30, 'center');

    for (let item of this.registros) {
      let row: {} = {};
      this.colunas.forEach(coluna => {
          row[coluna.dataKey] = item[coluna.dataKey];
      });
      rows.push(row);
    }
    doc.autoTable(this.colunas, rows, {
      headStyles: {
        fillColor: '#47825e',
        fontSize: 12
      },
    });
    doc.save(this.nomeArquivo + '_' + this.date.toLocaleDateString() + '.pdf');
    this.service.gravaLogDownExport(this.authService.credencial.login, this.titulo + "(Pdf)").subscribe(response => { });

   
  }

}
