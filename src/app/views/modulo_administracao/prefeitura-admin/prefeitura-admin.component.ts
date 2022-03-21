import { ItemCombo } from 'src/app/model/ItemCombo ';
import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent, Sort, MatDialogConfig, MatDialog } from '@angular/material';
import { PartidoPolitico } from 'src/app/model/partido-politico';
import { Estado } from 'src/app/model/PainelIndicadorCidades/estado';
import { PainelIndicadorCidadeService } from 'src/app/services/painel-indicador-cidade.service';
import { PartidoPoliticoService } from 'src/app/services/partido-politico.service';
import { AprovacaoPrefeituraService } from 'src/app/services/aprovacao-prefeitura.service';
import { Router } from '@angular/router';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { DadosDownload } from 'src/app/model/dados-download';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';

var moment = require('moment');

@Component({
  selector: 'app-prefeitura-admin',
  templateUrl: './prefeitura-admin.component.html',
  styleUrls: ['./prefeitura-admin.component.css']
})
export class PrefeituraAdminComponent implements OnInit {

  loading: boolean = false;

  resultados: any[] = [];

  dataSource = new MatTableDataSource<any>();

  displayedColumns: string[] = ["Cidade", "Estado", "Prefeito", "E-mail", "Telefone", "Partido", "Data de Adesão", "Início do mandato", "Fim do mandato", "Ações"];

  listaEstado: Array<Estado>;

  listaPartidos: ItemCombo[] = [];

  estadoSelecionado: number = -1;

  termoBuscaCidade: string = "";

  termoBuscaPrefeito: string = "";

  partidoSelecionado: number = -1;

  exibirMensagemAlerta: boolean = false;

  private orderBy: string = 'cidade';

  private direction: string = 'ASC';

  scrollUp: any;

  dadosDownload = new DadosDownload;

  usuario: Usuario;

  estaLogado: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private prefeituraService: PrefeituraService,
              private painelIndicadorCidadeService: PainelIndicadorCidadeService,
              private partidoService: PartidoPoliticoService,
              private aprovacaoPrefeituraService: AprovacaoPrefeituraService,
              private changeDetectorRefs: ChangeDetectorRef,
              private element: ElementRef,
              private router: Router,
              private dadosDownloadService: DadosDownloadService,
              private authService: AuthService,
              private usuarioService: UsuarioService,
              private dialog: MatDialog) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    //this.buscarPrefeituras(0, 10, this.orderBy, this.direction);
    this.filtrarPrefeituras();
    this.buscarEstadosSignatarios();
    this.carregarPartidos();

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true){
      this.buscarUsuarioLogado();
    }
  }

  buscarUsuarioLogado() {
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
    });
  }

  buscarPrefeituras(page: number, itens: number, orderBy: string, direction: string) {
    this.loading = true;

    this.prefeituraService.listarComPaginacaoEOrdenacao(page, itens, orderBy, direction).subscribe(response => {
      this.resultados = response['prefeituras'] as any[];
      this.resultados.forEach(r => {
        r["inicioMandato"] = moment.utc(r["inicioMandato"]);
        r["fimMandato"] = moment.utc(r["fimMandato"]);
      });
      this.dataSource = new MatTableDataSource<any>(this.resultados);
      this.dataSource.sort = this.sort;
      this.paginator.length = response["total"];
      this.exibirMensagemAlerta = this.resultados.length == 0;
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
      this.paginator._intl.itemsPerPageLabel = "Itens por página";
      this.paginator._intl.firstPageLabel = "Primeira página";
      this.paginator._intl.previousPageLabel = "Página anterior";
      this.paginator._intl.nextPageLabel = "Próxima página";
      this.paginator._intl.lastPageLabel = "Última página";

      this.loading = false;
    });
  }

  buscarEstadosSignatarios() {
    this.painelIndicadorCidadeService.buscarEstadosSignatarios().subscribe(response => {
      this.listaEstado = response;
    });
  }

  carregarPartidos() {
    this.partidoService.buscarItemCombo().subscribe(resp => {
      this.listaPartidos = resp as ItemCombo[];
    });
  }

  filtrarPrefeituras() {
    this.loading = true;

    this.prefeituraService.filtrarPrefeituras(this.estadoSelecionado, this.termoBuscaCidade,
                                              this.termoBuscaPrefeito, this.partidoSelecionado)
                          .subscribe(response => {
                            this.resultados = response['prefeituras'] as any[];

                            this.resultados.forEach(r => {
                              r["inicioMandato"] = moment.utc(r["inicioMandato"]);
                              r["fimMandato"] = moment.utc(r["fimMandato"]);
                            });

                            this.dataSource = new MatTableDataSource<any>(this.resultados);
                            this.dataSource.paginator = this.paginator;
                            this.exibirMensagemAlerta = this.resultados.length == 0;
                            this.dataSource.sort = this.sort;
                            this.paginator.length = this.resultados.length;
                            this.exibirMensagemAlerta = this.resultados.length == 0;
                            this.loading = false;
                            this.changeDetectorRefs.detectChanges();
                          });
  }

  public carregarPagina(event: PageEvent): PageEvent {
    this.buscarPrefeituras(event.pageIndex, event.pageSize, this.sort.active, this.sort.direction);
    return event;
  }

  sortData(sort: Sort) {
    if (sort) {
      this.orderBy = sort.active;
      this.direction = sort.direction.toUpperCase();
      this.buscarPrefeituras(this.paginator.pageIndex, this.paginator.pageSize, this.orderBy , this.direction);
    }
  }

  public mask(val: string, mask: string) {
    return PcsUtil.mask(val, mask);
  }

  maskString(value, pattern) {
    var i = 0,
        v = value.toString();
    return pattern.replace(/#/g, _ => v[i++]);
}

  formatarDadosParaXls() {
    let formatadosXlsList: any[] = [];
    if(this.resultados){
      this.resultados.forEach( prefeitura => {        
        let formatadosXls: {} = {};
        formatadosXls['Cidade'] = prefeitura.nomeCidade;
        formatadosXls['Estado'] = prefeitura.nomeEstado;
        formatadosXls['Prefeito'] = prefeitura.nomePrefeito;
        formatadosXls['Email'] = prefeitura.email;
        formatadosXls['Telefone'] = this.maskString(prefeitura.telefone, prefeitura.telefone.length >= 11 ? '(##) # ####-####' : '(##) ####-####');
        formatadosXls['Partido'] = prefeitura.partido;
        formatadosXls['DataAprovacao'] = moment.utc(prefeitura.aprovacaoPrefeitura.data).format("DD/MM/YYYY");
        formatadosXls['InicioMandato'] = moment.utc(prefeitura.inicioMandato).format("DD/MM/YYYY");
        formatadosXls['FimMandato'] = moment.utc(prefeitura.fimMandato).format("DD/MM/YYYY");
        
        formatadosXlsList.push(formatadosXls);
        });
        return formatadosXlsList
    }
    return null;
  }

  generateXls(){
    const registrosExportacao = this.formatarDadosParaXls();
    const workBook = XLSX.utils.book_new();
    if (registrosExportacao) {
      const workSheet = XLSX.utils.json_to_sheet(registrosExportacao);
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
      XLSX.writeFile(workBook, 'lista-prefeituras.xlsx');
    }
    else {
      Swal.fire("Erro", "Não foi possível exportar a tabela.", "error")
    }
}

preencherDadosDownload() {
  this.dadosDownload.email = this.usuario.email;
  this.dadosDownload.nome = this.usuario.nome
  this.dadosDownload.organizacao = this.usuario.organizacao;
  this.dadosDownload.boletim = this.usuario.recebeEmail;
  this.dadosDownload.usuario = this.usuario.id;
  this.dadosDownload.nomeCidade = this.usuario.prefeitura.cidade ? this.usuario.prefeitura.cidade.nome : this.usuario.cidadeInteresse;
  this.dadosDownload.acao = 'Download da Tabela de Prefeituras';
  this.dadosDownload.pagina = 'Administrar Prefeituras';  
  this.dadosDownload.arquivo = 'Lista de Prefeituras';  
}

public validacaoDownloadListaPrefeiturasXls() {
  if(this.estaLogado) {
    this.preencherDadosDownload()
    this.cadastrarDadosDownload(this.dadosDownload);
    this.generateXls();
  } else if(localStorage.getItem('dadosDownload')) {
    this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
    
    this.dadosDownload.acao = 'Download da Tabela de Prefeituras';
    this.dadosDownload.pagina = 'Administrar Prefeituras';
    this.dadosDownload.arquivo = 'Lista de Prefeituras';
    
    this.cadastrarDadosDownload(this.dadosDownload);
    this.generateXls();
  } else {

  const dialogConfig = new MatDialogConfig();

  dialogConfig.data = {
    acao: "Download da Tabela de Prefeituras",
    pagina: "Administrar Prefeituras",
    arquivo: "Lista de Prefeituras"
  }

  const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

  dialogRef.afterClosed().subscribe(result => {
    if(result != null) {
      this.dadosDownload = result;
      this.generateXls();
    }
  });
  }
}

public cadastrarDadosDownload(dados: DadosDownload) {
  this.dadosDownloadService.cadastrarDados(dados).subscribe();
}

}
