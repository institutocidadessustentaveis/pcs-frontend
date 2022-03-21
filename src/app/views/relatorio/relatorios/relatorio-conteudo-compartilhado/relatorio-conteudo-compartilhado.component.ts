import { UsuarioService } from 'src/app/services/usuario.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RelatorioService } from 'src/app/services/relatorio.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';
import { Document, Paragraph, Packer } from 'docx';
import * as XLSX from 'xlsx';
import { FormBuilder, FormGroup } from '@angular/forms';
import { registerLocaleData, DatePipe } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import moment from 'moment';
import { RelatorioConteudoCompartilhado } from 'src/app/model/relatorio-conteudo-compartilhado';
import { AuthService } from 'src/app/services/auth.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { Router } from '@angular/router';

@Component({
  selector: "app-relatorio-conteudo-compartilhado",
  templateUrl: "./relatorio-conteudo-compartilhado.component.html",
  styleUrls: ["./relatorio-conteudo-compartilhado.component.css"]
})
export class RelatorioConteudoCompartilhadoComponent implements OnInit {
  conteudocompartilhado: RelatorioConteudoCompartilhado = new RelatorioConteudoCompartilhado();
  date = new Date();
  displayedColumns: string[] = [
    "Data",
    "Usuário",
    "Rede Social",
    "Conteúdo Compartilhado"
  ];
  dataSource: any;
  listaHistorico: any[] = [];
  loading: any;
  formulario: FormGroup;
  titulo = "Conteúdos Compartilhados";
  listaUsuario = [];
  colunas = [
    { title: "Data Hora", dataKey: "dataHora" },
    { title: "Usuario", dataKey: "nomeUsuario" },
    { title: "Rede Social", dataKey: "redeSocial" },
    { title: "Conteudo Compartilhado", dataKey: "conteudoCompartilhado" }
  ];
  scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(
    public serviceRelatorio: RelatorioService,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
    this.formulario = this.formBuilder.group({
      dataInicio: [""],
      dataFim: [""],
      dataHora: [""],
      usuario: [""],
      redeSocial: [""]
    });
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    this.loading = false;
    this.conteudocompartilhado.nomeUsuario = "";

    this.usuarioService.buscarComboBoxUsuario().subscribe(response => {
      this.listaUsuario = response as ItemCombo[];
    });
  }

  searchReport() {
    this.loading = true;

    this.conteudocompartilhado.dataInicio = this.formulario.controls[
      "dataInicio"
    ].value;
    this.conteudocompartilhado.dataFim = this.formulario.controls[
      "dataFim"
    ].value;
    this.conteudocompartilhado.nomeUsuario = this.formulario.controls[
      "usuario"
    ].value.label;
    this.conteudocompartilhado.redeSocial = this.formulario.controls[
      "redeSocial"
    ].value;
    this.conteudocompartilhado.usuarioLogado = this.authService[
      "credencial"
    ].login;
    this.serviceRelatorio
      .getFiltroRelatorioConteudoCompartilhado(this.conteudocompartilhado)
      .subscribe(
        dados => {
          this.verificaResultadoEncontrado(dados);
          this.pesquisou = true;
          this.listaHistorico = dados;
          this.dataSource = new MatTableDataSource(dados);
          this.paginator._intl.itemsPerPageLabel = "Itens por página";
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
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.paginator._intl.firstPageLabel = "Primeira página";
          this.paginator._intl.previousPageLabel = "Página anterior";
          this.paginator._intl.nextPageLabel = "Próxima página";
          this.paginator._intl.lastPageLabel = "Última página";
        },
        error => {
          this.loading = false;
        }
      );
  }

  formatarParaExportar(registros: RelatorioConteudoCompartilhado[]): any[] {
    const formatados: any[] = [];
    registros.forEach(registro => {
      const formatado: {} = {};
      formatado["nomeUsuario"] = registro.nomeUsuario;
      formatado["dataHora"] = moment(registro.dataHora).format(
        "DD/MM/YYYY HH:MM:SS"
      );
      formatado["redeSocial"] = registro.redeSocial;
      formatado["conteudoCompartilhado"] = registro.conteudoCompartilhado;
      formatados.push(formatado);
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
