import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { InteracaoChatForum } from 'src/app/model/Relatorio/InteracaoChatForum';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExportadorRelatoriosComponent } from '../exportador-relatorios/exportador-relatorios.component';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { AuthService } from 'src/app/services/auth.service';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-interacao-chat-forum',
  templateUrl: './interacao-chat-forum.component.html',
  styleUrls: ['./interacao-chat-forum.component.css']
})
export class InteracaoChatForumComponent implements OnInit {

  loading: boolean = false;
  nenhumRegistroEncontrado: boolean = false;
  displayedColumns: string[] = ['Nome do usuário', 'Data', 'Ferramenta'];
  dataSource = new MatTableDataSource<InteracaoChatForum>();
  filtro: InteracaoChatForum = new InteracaoChatForum();
  registros: Array<InteracaoChatForum> = new Array<InteracaoChatForum>();
  formFiltro: FormGroup;
  titulo: string = "Interação com as ferramentas CHAT e Fórum";
  colunas = [
    { title: 'Nome do usuário', dataKey: 'nomeDoUsuario' },
    { title: 'Data', dataKey: 'data' },
    { title: 'Ferramenta', dataKey: 'ferramenta' }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ExportadorRelatoriosComponent) exportador: ExportadorRelatoriosComponent;
  scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(private service: RelatorioService,
    public formBuilder: FormBuilder,
    private authService: AuthService,private element: ElementRef
    ,private router: Router) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
    registerLocaleData(localePtBr);
    this.formFiltro = this.formBuilder.group({
      dataInicio: [''],
      dataFim: [''],
      nomeDoUsuario: [''],
      dataHora: [''],
      ferramenta: [''],
    });
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.loading = false;
    this.formFiltro.controls['nomeDoUsuario'].setValue('');
    this.formFiltro.controls['dataHora'].setValue('');
    this.formFiltro.controls['ferramenta'].setValue('');
  }

  gerarRelatorio() {
    this.loading = true;
    this.filtro.dataInicio = this.formFiltro.controls['dataInicio'].value;
    this.filtro.dataFim = this.formFiltro.controls['dataFim'].value;
    this.filtro.nomeUsuario = this.formFiltro.controls['nomeDoUsuario'].value;
    this.filtro.dataHora = this.formFiltro.controls['dataHora'].value;
    this.filtro.ferramenta = this.formFiltro.controls['ferramenta'].value;
    this.filtro.usuarioLogado = this.authService.credencial.login;

    this.service.searchInteracaoChatForum(this.filtro).subscribe((response) => {
      this.verificaResultadoEncontrado(response);
      this.pesquisou = true;
      this.nenhumRegistroEncontrado = (response.length === 0);
      this.registros = response;
      this.dataSource = new MatTableDataSource<InteracaoChatForum>(response);
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

  formatarParaExportar(registros: Array<any>): any[] {
    let formatados: any[] = [];
    console.log(registros)
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['nomeDoUsuario'] = registro.nomeDoUsuario;
      formatado['data'] = moment(registro.dataHora).format("DD/MM/YYYY");
      formatado['ferramenta'] = registro.ferramenta;
      formatados.push(formatado);
    });
    //console.log(formatados)
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
