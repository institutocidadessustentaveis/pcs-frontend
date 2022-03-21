import { Label } from 'ng2-charts';
import { UsuarioService } from './../../../../services/usuario.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { RelatorioSessaoUsuario } from 'src/app/model/relatorio-sessao-usuario';
import { FormBuilder, FormGroup } from '@angular/forms';
import moment from 'moment';
import { AuthService } from 'src/app/services/auth.service';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { Router } from '@angular/router';

@Component({
  selector: 'app-relatorio-sessoes-usuarios',
  templateUrl: './relatorio-sessoes-usuarios.component.html',
  styleUrls: ['./relatorio-sessoes-usuarios.component.css']
})
export class RelatorioSessoesUsuariosComponent implements OnInit {

  displayedColumns: string[] = ['Usuário', 'Prefeitura', 'Data Inicio', 'Hora Inicio', 'Data Fim', 'Hora Fim', 'Duração'];
  dataSource: any;
  listaSessoes: RelatorioSessaoUsuario[] = [];
  formulario: FormGroup;
  loading: boolean = false;
  public resultadoEncontrado = false;
  public pesquisou = false;

  titulo: string = 'Sessões de Usuário';
  listaUsuario = [];
  colunas = [
    { title: 'Usuário', dataKey: 'nomeUsuario' },
    { title: 'Data Início', dataKey: 'dataInicioSessao' },
    { title: 'Data Fim', dataKey: 'dataFimSessao'},
    { title: 'Hora Início', dataKey: 'horaInicioSessao' },
    { title: 'Hora Fim', dataKey: 'horaFimSessao'},
    { title: 'Prefeitura', dataKey: 'prefeitura' },
    { title: 'Duração', dataKey: 'duracao' },
    
  ];
  scrollUp: any;

  constructor(public serviceRelatorio: RelatorioService, public formBuilder: FormBuilder, private authService: AuthService,
    private usuarioService: UsuarioService,private element: ElementRef, private router: Router) {
    this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
    registerLocaleData(localePtBr);
    this.formulario = this.formBuilder.group({
      usuario: [''],
      inicioSessao: [''],
      fimSessao: [''],
      dataInicio: [''],
      dataFim: [''],
    });
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.usuarioService.buscarComboBoxUsuario().subscribe(response => {
      this.listaUsuario = response as ItemCombo[];
    });
  }

  getRelatorioSessoesUsuarios() {
    this.loading = true;
    let filtro = new RelatorioSessaoUsuario();
    filtro.dataInicio = this.formulario.controls.dataInicio.value;
    filtro.dataFim = this.formulario.controls.dataFim.value;
    filtro.nomeUsuario = this.formulario.controls.usuario.value.label;
    filtro.usuarioLogado = this.authService.credencial.login;

    this.serviceRelatorio.getRelatorioSessoesUsuarios(filtro).subscribe((dados) => {
      this.verificaResultadoEncontrado(dados);
      this.pesquisou = true;
      this.listaSessoes = dados;
      this.dataSource = new MatTableDataSource(dados);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
    }, (error => { this.loading = false }));
  }

  formatarParaExportar(registros: RelatorioSessaoUsuario[]): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['nomeUsuario'] = registro.nomeUsuario;
      formatado['prefeitura'] = registro.cidadePrefeitura ? registro.cidadePrefeitura : 'N/A';
      formatado['dataInicioSessao'] = moment(registro.inicioSessao).format('DD/MM/YYYY');
      formatado['dataFimSessao'] = moment(registro.fimSessao).format('DD/MM/YYYY');
      formatado['horaInicioSessao'] = moment(registro.inicioSessao).format('HH:mm:ss');
      formatado['horaFimSessao'] = moment(registro.fimSessao).format('HH:mm:ss');
      formatado['duracao'] = registro.duracao;
      formatados.push(formatado);
    });
    return formatados;
  }

  async verificaResultadoEncontrado(res: any) {
    if (res != null && res !== undefined && res.length > 0) {
      this.resultadoEncontrado = true;
      this.loading = false;
    } else {
      this.resultadoEncontrado = false;
      this.loading = false;
    }
  }
}
