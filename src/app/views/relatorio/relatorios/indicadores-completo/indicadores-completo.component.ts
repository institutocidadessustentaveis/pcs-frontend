import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { RelatorioIndicadoresCompleto } from 'src/app/model/relatorio-indicadores-completo';
import { RelatorioService } from 'src/app/services/relatorio.service';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer, CenterTabStop, PageOrientation } from "docx";
import { PcsUtil } from 'src/app/services/pcs-util.service';

@Component({
  selector: 'app-indicadores-completo',
  templateUrl: './indicadores-completo.component.html',
  styleUrls: ['./indicadores-completo.component.css']
})
export class IndicadoresCompletoComponent implements OnInit {

  registros: any[] = [];
  listaRelatorio: any[] = [];
  loading = false;
  listaParaExportar: any[] = [];
  displayedColumns: string[] = [
    'codigoIbge', 
    'cidade', 
    'estado', 
    'prefeito', 
    'partido', 
    'populacao', 
    'porte', 
    'usuarioCadastrado', 
    'qtdUsuarioCadastrado', 
    'indicadoresMinimos', 
    'qtdIndicadoresPreenchidos', 
    'porcentagemIndicadoresPreenchidos'
  ];
  dataSource = new MatTableDataSource<RelatorioIndicadoresCompleto>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() idRelatorio: number;

  date: Date = new Date();
  nomeArquivo: string = 'indicadores-completo';
  titulo = 'Indicadores Completo';
  colunas = [
    { title: 'Código IBGE', dataKey: 'codigoIBGE' },
    { title: 'Cidade', dataKey: 'cidade' },
    { title: 'Estado', dataKey: 'estado' },
    { title: 'Prefeito', dataKey: 'prefeito' },
    { title: 'Partido', dataKey: 'partido' },
    { title: 'População', dataKey: 'populacao' },
    { title: 'Porte', dataKey: 'porte' },
    { title: 'Usuários Cadastrados', dataKey: 'usuarioCadastrado' },
    { title: 'Qtd. de Usuários Cadastrados', dataKey: 'qtdUsuarioCadastrado' },
    { title: 'Indicadores Mínimos', dataKey: 'indicadoresMinimos' },
    { title: 'Qtd. Indicadores Preenchidos', dataKey: 'qtdIndicadoresPreenchidos' },
    { title: '% Indicadores Preenchidos', dataKey: 'porcentagemIndicadoresPreenchidos' },
  ];

  constructor(private relatorioService: RelatorioService) { }

  ngOnInit() {
  }

  public buscarRelatorio() {
    this.loading = true;
    this.relatorioService.buscarRelatorioIndicadoresCompletos().subscribe(res => {
      this.listaRelatorio = res as RelatorioIndicadoresCompleto[];
      this.dataSource = new MatTableDataSource(this.listaRelatorio);
      this.paginator.length = this.listaRelatorio.length
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length2: number) => { if (length2 == 0 || pageSize == 0) { return `0 de ${length2}`; } length2 = Math.max(length2, 0); const startIndex = page * pageSize; const endIndex = startIndex < length2 ? Math.min(startIndex + pageSize, length2) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length2}`; };     
      this.loading = false;
      this.formatarParaExportar(this.listaRelatorio)
    }, error => { this.loading = false });
  }

  public formatarParaExportar(listaRelatorio: RelatorioIndicadoresCompleto[]) {
      this.registros = []
      listaRelatorio.forEach(item => {
        let formatado: {} = {};
        formatado['codigoIBGE'] = item.codigoIBGE;
        formatado['cidade'] = item.cidade;
        formatado['estado'] = item.estado;
        formatado['prefeito'] = item.prefeito;
        formatado['partido'] = item.partido;
        formatado['populacao'] = item.populacao;
        formatado['porte'] = item.porte;
        formatado['usuarioCadastrado'] = item.usuarioCadastrado ? 'Sim' : 'Não';
        formatado['qtdUsuarioCadastrado'] = item.qtdUsuarioCadastrado;
        formatado['indicadoresMinimos'] = item.indicadoresMinimos;
        formatado['qtdIndicadoresPreenchidos'] = item.qtdIndicadoresPreenchidos;
        formatado['porcentagemIndicadoresPreenchidos'] = item.porcentagemIndicadoresPreenchidos;
        this.registros.push(formatado);
      });
  }

  async exportXls() {
    this.loading = true;
    this.relatorioService.downloadRelatorioIndicadoresCompleto().subscribe(res  => {
      const blob = new Blob([res], { type: "application/octet-stream" });
      saveAs(blob, "indicadores-completo.xlsx");
      this.loading = false;
    })
    
  }

  async exportCsv() {
    this.loading = true;
    const registrosExportacao =  this.registros;
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(PcsUtil.buildDataToReport(this.titulo, registrosExportacao));
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
    XLSX.utils.sheet_to_csv(workSheet);
    await XLSX.writeFile(workBook, this.nomeArquivo + '-' + this.date.toLocaleDateString() + '.csv');
    this.loading = false;
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

    doc.Styles

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
  }

  exportPdf = async () => {
    this.loading = true;
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
    await doc.save(this.nomeArquivo + '-' + this.date.toLocaleDateString() + '.pdf');
    this.loading = false;
  }

  formatarPopulacao(p: number) {
    const formatado = p.toLocaleString('pt-BR');
    return formatado;
  }

}
