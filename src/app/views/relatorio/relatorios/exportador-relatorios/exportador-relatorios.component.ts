import { Component, OnInit, Input, ElementRef } from '@angular/core';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer, CenterTabStop, PageOrientation } from "docx";
import { AuthService } from 'src/app/services/auth.service';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import moment from 'moment';
import { Router } from '@angular/router';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownload } from 'src/app/model/dados-download';

@Component({
  selector: 'app-exportador-relatorios',
  templateUrl: './exportador-relatorios.component.html',
  styleUrls: ['./exportador-relatorios.component.css']
})
export class ExportadorRelatoriosComponent implements OnInit {

  date: Date = new Date();
  nomeArquivo: string;
  @Input() registros: Array<any>;
  @Input() registrosXls: Array<any>;
  @Input() titulo: string;
  @Input() colunas: any[];
  scrollUp: any;

  public usuario: Usuario;
  public dadosDownload = new DadosDownload();
  public loading = false;

  constructor(private authService: AuthService,
    private service: RelatorioService,private element: ElementRef
    ,private router: Router,
    private dadosDownloadService: DadosDownloadService,
    private usuarioService: UsuarioService) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
    registerLocaleData(localePtBr);
  }

  ngOnInit() {
    
    this.nomeArquivo = this.titulo.replace(/\s/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    this.getUsuarioLogadoDadosDownload();
  }

  async exportXls() {
    this.loading = true;
    await this.gerarXls();
    this.loading = false;
    this.service.gravaLogDownExport(this.authService.credencial.login, this.titulo + "(Xlsx)").subscribe(response => {});
    this.cadastrarDadosDownload(this.dadosDownload);
  }

  public async gerarXls () {
    await this.timeout(1);
    const registrosExportacao = this.registrosXls ? this.registrosXls : this.registros;
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(PcsUtil.buildDataToReport(this.titulo, registrosExportacao));
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
    XLSX.writeFile(workBook, this.nomeArquivo + '-' + this.date.toLocaleDateString() + '.xlsx');
  }

  public async exportCsv() {
    this.loading = true;
    await this.gerarCsv();
    this.loading = false;
    this.service.gravaLogDownExport(this.authService.credencial.login, this.titulo + "(csv)").subscribe(response => { });
  
    this.cadastrarDadosDownload(this.dadosDownload);
  }

  public async gerarCsv () {
    await this.timeout(1);
    const registrosExportacao = this.registrosXls ? this.registrosXls : this.registros;
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(PcsUtil.buildDataToReport(this.titulo, registrosExportacao));
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
    XLSX.utils.sheet_to_csv(workSheet);
    XLSX.writeFile(workBook, this.nomeArquivo + '-' + this.date.toLocaleDateString() + '.csv');
  }

  async exportDoc() {
    this.loading = true;
    let column: number = 0;
    let row: number = 1;

    const doc = new Document({
      creator: "PCS",
      description: "DOC",
      title: "DOC"
    }, {
      orientation: PageOrientation.LANDSCAPE
    });
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

    await packer.toBlob(doc).then(blob => {
      saveAs(blob, this.nomeArquivo + '-' + this.date.toLocaleDateString() + '.docx');
    });
    this.loading = false;
    this.service.gravaLogDownExport(this.authService.credencial.login, this.titulo + "(Docx)").subscribe(response => { });

    this.cadastrarDadosDownload(this.dadosDownload);
  }

  exportPdf = async () => {
    this.loading = true;
    await this.gerarPdf();
    this.loading = false;
    this.service.gravaLogDownExport(this.authService.credencial.login, this.titulo + "(Pdf)").subscribe(response => { });

    this.cadastrarDadosDownload(this.dadosDownload);
  }

  public async gerarPdf () {
    await this.timeout(1);
    const doc = new jsPDF('l', 'pt', 'a4', true);
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
    doc.save(this.nomeArquivo + '-' + this.date.toLocaleDateString() + '.pdf');
  }


  public getUsuarioLogadoDadosDownload(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = `Download de Relatório de ${this.nomeArquivo}`;
    this.dadosDownload.pagina = 'Relatório';
    this.dadosDownload.arquivo = this.nomeArquivo;
    
    });
  }

  public async cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

  private timeout(ms: number): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, ms);
    });
  }
}
