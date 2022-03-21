import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
// Exportação de arquivos
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer } from "docx";
// Model
import { AtividadeUsuario } from '../../../../model/Relatorio/AtividadeUsuario';
import moment from 'moment';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-atividade-usuario',
  templateUrl: './atividade-usuario.component.html',
  styleUrls: ['./atividade-usuario.component.css']
})

export class AtividadeUsuarioComponent implements OnInit {

  date = new Date();
  displayedColumns: string[] = ['nomeUsuario', 'data', 'hora', 'acao', 'modulo'];
  dataSource = new MatTableDataSource<AtividadeUsuario>();
  atividadeUsuario: AtividadeUsuario = new AtividadeUsuario();
  tabela: Array<AtividadeUsuario> = new Array<AtividadeUsuario>();
  loading: any;
  formRelatorio: FormGroup;
  titulo = "Atividade do Usuário";
  listaUsuario = [];
  colunas = [
    { title: 'Usuario', dataKey: 'nomeUsuario' },
    { title: 'Data', dataKey: 'data' },
    { title: 'Hora', dataKey: 'hora' },
    { title: 'Ação', dataKey: 'acao' },
    { title: 'Modulo', dataKey: 'modulo' },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() idRelatorio: number;

  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(public relatorioService: RelatorioService, public activatedRoute: ActivatedRoute, public authService: AuthService,
    public formBuilder: FormBuilder, private usuarioService: UsuarioService ,private element: ElementRef
    ,private router: Router) {
    registerLocaleData(localePtBr);
    this.formRelatorio = this.formBuilder.group({
      dataInicio: [''],
      dataFim: [''],
      dataHora: [''],
      usuario: [''],
      modulo: ['']
    });
  }

  ngOnInit() {
    this.tabela = [];
    this.atividadeUsuario.id = 0;
    this.atividadeUsuario.nomeUsuario = '';
    this.atividadeUsuario.acao = '';
    this.atividadeUsuario.modulo = '';
    this.atividadeUsuario.usuarioLogado = this.authService.credencial.login;
    this.atividadeUsuario.dataInicio = new Date();
    this.atividadeUsuario.dataFim = new Date();
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.loading = false;
    this.formRelatorio.controls['usuario'].setValue('');
    this.formRelatorio.controls['modulo'].setValue('');

    this.usuarioService.buscarComboBoxUsuario().subscribe(response => {
      this.listaUsuario = response as ItemCombo[];
    });
  }

  searchReport() {
    this.loading = true;

    //Build Object to send
    this.atividadeUsuario.dataHora = this.formRelatorio.controls['dataHora'].value;
    this.atividadeUsuario.nomeUsuario = this.formRelatorio.controls['usuario'].value.label;
    this.atividadeUsuario.modulo = this.formRelatorio.controls['modulo'].value;
    let dataInicio = this.formRelatorio.controls['dataInicio'].value;
    let dataFim = this.formRelatorio.controls['dataFim'].value;
    this.atividadeUsuario.dataInicio = new Date(dataInicio);
    this.atividadeUsuario.dataFim = new Date(dataFim);

    this.relatorioService.searchAtividadeUsuario(this.atividadeUsuario).subscribe(response => {
      this.verificaResultadoEncontrado(response);
      this.pesquisou = true;
      this.dataSource = new MatTableDataSource<AtividadeUsuario>(response);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.tabela = response;
    }, error => { this.loading = false });
  }

  formatarParaExportar(registros: AtividadeUsuario[]): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['nomeUsuario'] = registro.nomeUsuario;
      formatado['data'] = moment(registro.dataHora).format("DD/MM/YYYY");
      formatado['hora'] = moment(registro.dataHora).format("HH:mm:ss");
      formatado['acao'] = registro.acao;
      formatado['modulo'] = registro.modulo;
      formatados.push(formatado)
    });
    return formatados;
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
