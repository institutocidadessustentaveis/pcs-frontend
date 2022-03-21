import { CidadeService } from "./../../../../services/cidade.service";
import { UsuarioService } from "src/app/services/usuario.service";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RelatorioPlanoDeMetas } from "src/app/model/Relatorio/RelatorioPlanoDeMetas";
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from "@angular/material";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ExportadorRelatoriosComponent } from "../exportador-relatorios/exportador-relatorios.component";
import { RelatorioService } from "src/app/services/relatorio.service";
import { registerLocaleData } from "@angular/common";
import { AuthService } from "src/app/services/auth.service";
import localePtBr from "@angular/common/locales/pt";
import { saveAs } from "file-saver";
import { PlanoMetasService } from "src/app/services/plano-metas.service";
import moment from "moment";
import { ItemCombo } from "src/app/model/ItemCombo ";
import { ProvinciaEstadoService } from "src/app/services/provincia-estado.service";
import { Router } from "@angular/router";
import { DadosDownload } from "src/app/model/dados-download";
import { DadosDownloadComponent } from "src/app/components/dados-download/dados-download.component";
import { DadosDownloadService } from "src/app/services/dados-download.service";
import { Usuario } from "src/app/model/usuario";
import { PcsUtil } from "src/app/services/pcs-util.service";
import { PainelIndicadorCidadeService } from "src/app/services/painel-indicador-cidade.service";
import { Cidade } from "src/app/model/cidade";

@Component({
  selector: "app-relatorio-plano-de-metas",
  templateUrl: "./relatorio-plano-de-metas.component.html",
  styleUrls: ["./relatorio-plano-de-metas.component.css"]
})
export class RelatorioPlanoDeMetasComponent implements OnInit {
  loading: boolean = false;
  nenhumRegistroEncontrado: boolean = false;
  displayedColumns: string[] = ["nomeUsuario", "dataHora", "cidade", "estado", "inicioMandato", "fimMandato", "Codigo IBGE", "arquivo"];
  dataSource = new MatTableDataSource<RelatorioPlanoDeMetas>();
  filtro: RelatorioPlanoDeMetas = new RelatorioPlanoDeMetas();
  registros: Array<RelatorioPlanoDeMetas> = new Array<RelatorioPlanoDeMetas>();
  formFiltro: FormGroup;
  titulo: string = "Relatório de Plano de Metas";
  listaUsuario = [];
  listaEstado = [];
  listaCidade = [];
  colunas = [
    { title: "Nome do usuário", dataKey: "nomeUsuario" },
    { title: "Data/Hora", dataKey: "dataHora" },
    { title: "Cidade", dataKey: "cidade" },
    { title: "Estado", dataKey: "estado" },
    { title: "Início do Mandato", dataKey: "inicioMandato" },
    { title: "Fim do Mandato", dataKey: "fimMandato" },
    { title: "Codigo IBGE", dataKey: "codigoIBGE" }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ExportadorRelatoriosComponent)
  exportador: ExportadorRelatoriosComponent;
  scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;
  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  public estaLogado: boolean;

  constructor(
    private planoMetasService: PlanoMetasService,
    private service: RelatorioService,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private cidadeService: CidadeService,
    private element: ElementRef,
    private router: Router,
    private provinciaEstadoService: ProvinciaEstadoService,
    public dialog: MatDialog,
    private dadosDownloadService: DadosDownloadService,
    private painelIndicadorCidadeService: PainelIndicadorCidadeService
    

  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
    this.formFiltro = this.formBuilder.group({
      dataInicio: [""],
      dataFim: [""],
      usuario: [""],
      dataHora: [""],
      estado: [""],
      cidade: [""]
    });
  }

  ngOnInit() {
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
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = "Primeira página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.nextPageLabel = "Próxima página";
    this.paginator._intl.lastPageLabel = "Última página";
    this.loading = false;

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado){
      this.getUsuarioLogadoDadosDownload();
    }

    this.populaComboEstados();
    this.buscarComboBoxUsuarios();
   
  }

  gerarRelatorio() {
    this.loading = true;
    this.filtro.dataInicio = this.formFiltro.controls["dataInicio"].value;
    this.filtro.dataFim = this.formFiltro.controls["dataFim"].value; 
    this.filtro.nomeUsuario = this.formFiltro.controls["usuario"].value.nome;
    this.filtro.estado = this.formFiltro.controls["estado"].value.nome;
    this.filtro.cidade = this.formFiltro.controls["cidade"].value.label;
    this.filtro.usuarioLogado = this.authService.credencial.login;

    this.service.searchPlanoDeMetas(this.filtro).subscribe(
      response => {
        this.verificaResultadoEncontrado(response);
        this.pesquisou = true;
        this.nenhumRegistroEncontrado = response.length === 0;
        this.registros = response;
        this.dataSource = new MatTableDataSource<RelatorioPlanoDeMetas>(
          response
        );
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
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  formatarParaExportar(registros: Array<RelatorioPlanoDeMetas>): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado["nomeUsuario"] = registro.nomeUsuario;
      formatado["dataHora"] = moment(registro.dataHora).format(
        "DD/MM/YYYY HH:mm:ss"
      );
      formatado["cidade"] = registro.cidade;
      formatado["estado"] = registro.estadoSigla ? registro.estadoSigla : registro.estado;
      formatado["inicioMandato"] = moment(registro.inicioMandato).format("DD/MM/YYYY");
      formatado["fimMandato"] = moment(registro.fimMandato).format("DD/MM/YYYY");
      formatado["codigoIBGE"] = registro.codigoIBGE;
      formatados.push(formatado);
    });
    return formatados;
  }

  download(id, cidade) {
    /*this.planoMetasService.download(id).subscribe(res => {
      let bytes: any = res;
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      saveAs(blob, `Plano de Metas ${cidade}.xlsx`);
    });*/
    this.loading = true;
    this.cidadeService.download(id).subscribe(res => {
      saveAs(this.b64toBlob(res.conteudo), res.nomeArquivo);
      this.loading = false;
    });
  }

  private b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
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

  public validacaoDownload(id, cidade){

    if(this.estaLogado) {
      this.dadosDownload.arquivo = `Arquivo de Plano de Metas de ${cidade}`; 
      this.cadastrarDadosDownload(this.dadosDownload);
      this.download(id, cidade);
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Arquivo de Plano de Metas';
      this.dadosDownload.pagina = 'Relatório de Plano de Metas';
      this.dadosDownload.arquivo = `Arquivo de Plano de Metas de ${cidade}`
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.download(id, cidade);
    } else {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Arquivo de Plano de Metas",
      pagina: "Relatório de Plano de Metas",
      arquivo: `Arquivo de Plano de Metas de ${cidade}`
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.download(id, cidade);
      }
    });
    }
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
    this.dadosDownload.acao = 'Download de Arquivo de Plano de Metas';
    this.dadosDownload.pagina = 'Relatório de Plano de Metas'; 
      
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

  public populaComboEstados() {
    this.painelIndicadorCidadeService
      .buscarEstadosSignatarios()
      .subscribe(response => {
        this.listaEstado = response;
      });
    }

  public estadoSelecionado(idEstado: any) {
      if(idEstado != null){
        this.cidadeService.buscarSignatariasComboPorIdEstado(idEstado).subscribe(response => {
          this.listaCidade = response as Array<ItemCombo>;
        });
      }
    }

    public buscarComboBoxUsuarios(){
      this.usuarioService.buscarPorPerfil(6).subscribe(response => {
        this.listaUsuario = response;
      });
    }
    
}
