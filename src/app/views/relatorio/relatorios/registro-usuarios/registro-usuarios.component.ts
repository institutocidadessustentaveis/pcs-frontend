import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';

import moment from 'moment';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { RegistroUsuariosFiltro } from 'src/app/model/registro-usuarios';
import { PerfisService } from 'src/app/services/perfis.service';

@Component({
  selector: 'app-registro-usuarios',
  templateUrl: './registro-usuarios.component.html',
  styleUrls: ['./registro-usuarios.component.css']
})

export class RegistroUsuariosComponent implements OnInit {

  date = new Date();
  displayedColumns: string[] = ['nomeUsuario', 'perfil', 'email', 'telefone', 'municipio', 'instituicao'];
  dataSource = new MatTableDataSource<Usuario>();
  registroUsuario: RegistroUsuariosFiltro = new RegistroUsuariosFiltro();
  tabela: Array<Usuario> = new Array<Usuario>();
  loading: any;
  formRelatorio: FormGroup;
  titulo = "Registro de Usuarios";
  listaTipos = [];
  colunas = [
    { title: 'Usuario', dataKey: 'usuario' },
    { title: 'Perfil', dataKey: 'perfil' },
    { title: 'E-mail', dataKey: 'email' },
    { title: 'Telefone', dataKey: 'telefone' },
    { title: 'Municipio', dataKey: 'municipio' },
    { title: 'Instituição', dataKey: 'instituição' },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() idRelatorio: number;

  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(public relatorioService: RelatorioService, public activatedRoute: ActivatedRoute, public authService: AuthService,
    public formBuilder: FormBuilder,private element: ElementRef, private perfilService: PerfisService) {
    registerLocaleData(localePtBr);
    this.formRelatorio = this.formBuilder.group({
      tipoUsuario: [''],
      instituicao: [''],
    });
  }

  ngOnInit() {
    this.criarTabela()
    this.limparFormulario()
    this.carregarComboPerfil()
  }

  criarTabela() {
    this.tabela = [];
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.loading = false;
  }

  popularTabela(response: any) {
    this.dataSource = new MatTableDataSource<Usuario>(response);
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.tabela = response;
  }

  limparFormulario() {
    this.formRelatorio.controls['tipoUsuario'].setValue('');
  }

  public carregarComboPerfil() {
    this.perfilService.buscarComboBoxPerfis().subscribe(perfis => {
      this.listaTipos = perfis;
    })
  }

  searchReport() {
    this.loading = true;

    //Build Object to send
    this.registroUsuario.tipoUsuario = this.formRelatorio.controls['tipoUsuario'].value;
    this.registroUsuario.instituicao = this.formRelatorio.controls['instituicao'].value;
    this.registroUsuario.usuarioLogado = this.authService.credencial.login;

    this.relatorioService.searchRegistroUsuarios(this.registroUsuario).subscribe(response => {
      this.verificaResultadoEncontrado(response);
      console.log(response)
      this.tabela = response;
      this.pesquisou = true;
      this.popularTabela(this.tabela)
    }, error => { this.loading = false });
  }

  formatarParaExportar(registros): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado['usuario'] = registro.nome != undefined ? registro.nome : 'N/A';
      formatado['perfil'] = registro.nomePerfil != undefined ? registro.nomePerfil : 'N/A';
      formatado['email'] = registro.email != undefined ? registro.email : 'N/A';
      formatado['telefone'] = registro.telefone != undefined ? registro.telefone : 'N/A';
      formatado['municipio'] = registro.cidade != undefined ? registro.cidade : 'N/A';
      formatado['instituição'] = registro.organizacao != undefined ? registro.organizacao : 'N/A';
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
