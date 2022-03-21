import { Premiacao } from './../../../model/premiacao';
import { ImportacaoVariaveisService } from 'src/app/services/importacao-variaveis.service';
import { Component, OnInit, ElementRef, ViewChild,  TemplateRef } from '@angular/core';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MatTableDataSource, MatSort, MatPaginator, MatDialogConfig } from '@angular/material';
import { ModalErroComponent } from './modal-erro/modal-erro.component';
import { saveAs } from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { PremiacaoService } from 'src/app/services/premiacao.service';
import { Prefeitura } from 'src/app/model/prefeitura';
import { trigger, state, transition, animate, style } from '@angular/animations';
import { EixoService } from 'src/app/services/eixo.service';
import { Eixo } from 'src/app/model/eixo';
import { SubdivisaoService } from 'src/app/services/subdivisao.service';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';

import { PainelIndicadorCidadeService } from 'src/app/services/painel-indicador-cidade.service';
import { SessaoService } from 'src/app/services/sessao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { Usuario } from 'src/app/model/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ModalInfoVariaveisComponent } from './modal-info-variaveis/modal-info-variaveis.component';

export class IndicadoresPreenchidosStatusDTO {
  id?: Number;
  nome: string;
  prefeitura: string;
  status: string;
  exibirListaVariaveis = false;
  idEixo: number;
  complementar: Boolean;
}

@Component({
  selector: "app-indicadores-para-preencher",
  templateUrl: "./indicadores-para-preencher.component.html",
  styleUrls: ["./indicadores-para-preencher.component.scss"],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({transform: 'rotate(0deg)'})),
      state('expanded', style({transform: 'rotate(180deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class IndicadoresParaPreencherComponent implements OnInit  {
  indicadores: IndicadoresPreenchidosStatusDTO[] = [];
  indicadoresDTOPaginado: IndicadoresPreenchidosStatusDTO[] = [];
  listaIndicadoresDTO: Array<IndicadoresPreenchidosStatusDTO> = new Array<IndicadoresPreenchidosStatusDTO>();
  listaEixos: Eixo[] = [];
  listaSubdivisoes:any = [];
  loading = true;
  form: FormGroup;
  gestorLogado: boolean = false;
  nomeArquivo = "";
  fileUrl = null;
  scrollUp: any;
  quantidadePreenchida: number;
  quantidadePreenchidaAnosAnteriores: number;
  quantidadeNaoPreenchida: number;

  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  public estaLogado: boolean = false;

  cidadeUsuario = {};
  subdivisaoSelecionada:any ={};

  indicadorParametro;
  foiProIndicador = false;
  carregouPorSubdivisao = false;
  subdivisaoParametro;
  posicaoTopo:any = 0;

  listaInfoArquivo: any;
  listaErros: any;


  public indicador: number;
  public cidade: number;
  public anoInicial: number;
  public anoFinal: number;
  paginador: any;
  dataSource = new MatTableDataSource();
  displayedColumns = [
    "Indicador",
    "Status",
    "Ações"
  ];
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('modalLoading') modalLoading: TemplateRef<any>;
  constructor(
    public indicadoresPreenchidosService: IndicadoresPreenchidosService,
    private importacaoVariaveisService: ImportacaoVariaveisService,
    private builder: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
    public activateRouter: ActivatedRoute,
    private element: ElementRef,
    public premiacaoService: PremiacaoService,
    private eixoService: EixoService,
    private subdivisaoService: SubdivisaoService,
    private painelService: PainelIndicadorCidadeService,
    private sessaoService: SessaoService,
    private usuarioService: UsuarioService,
    private dadosDownloadService: DadosDownloadService,
    private authService: AuthService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.form = this.builder.group({
      busca: [''],
      buscaIdVariavel: [null],
      buscaNomeVariavel: [''],
      status: ['Todos'],
      eixo: [null],
      subdivisao: [null],
      id: [null],
    });
    
    this.selecionarIndicadorSubdivisao();
  }

  ngOnInit() {
    this.buscarCidade();
    this.buscarTodosIndicadores();
    this.setGestorLogado();
    this.verificaParticipacaoPremiacaoEmAvaliacao();

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true){
      this.getUsuarioLogadoDadosDownloadTabelaVariaveis();
    }
    
    this.eixoService.buscarEixosParaCombo(true).subscribe(
      response => {
        this.listaEixos = response
      }
    )
    this.carregarSubdivisoes();
    const sessionPrefeitura = JSON.parse(localStorage.getItem("usuarioLogado"));
    const dadosPrefeitura: Prefeitura = sessionPrefeitura.dadosPrefeitura;
    if (dadosPrefeitura){
      if (dadosPrefeitura.cidade) {
        this.cidade = dadosPrefeitura.cidade.id;
      }
      if (dadosPrefeitura.inicioMandato && dadosPrefeitura.fimMandato) {
        this.anoInicial = new Date(dadosPrefeitura.inicioMandato).getUTCFullYear()-1;
        this.anoFinal = new Date(dadosPrefeitura.fimMandato).getUTCFullYear()-1;
      }
    }

    setInterval( ()=>{
      this.irParaIndicador();
    }, 1000)
  }

  buscarCidade() {
    this.sessaoService.cidade().subscribe(res =>{
      this.cidadeUsuario = res;
    })
  }

  // PCS-380 Bloquear preenchimento de indicadores no período de avaliação
  async verificaParticipacaoPremiacaoEmAvaliacao() {
    let listaPremiacao: Premiacao[];
    await this.premiacaoService
      .verificaParticipacaoPremiacaoEmAvaliacao()
      .subscribe(
        async response => {
          listaPremiacao = response as Premiacao[];

          if (
            listaPremiacao != null &&
            listaPremiacao.length != null &&
            listaPremiacao.length > 0
          ) {
            this.bloquearPreenchimento();
          }
        },
        error => {}
      );
  }

  bloquearPreenchimento() {
    PcsUtil.swal()
      .fire({
        title: "Preencher Indicadores",
        text: `Preenchimento de Indicadores bloqueado no período de avaliação da premiação!`,
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Ok"
      })
      .then(
        result => {
          this.router.navigate(["/"]);
        },
        error => {}
      );
  }

  modalErro(erros) {
    const dialogRef = this.dialog.open(ModalErroComponent, {
      data: {
        mensagem: erros
      }
    });
    dialogRef.afterClosed().subscribe(result => {});
  }

  modalInfo(listaDados){
    const dialogRef = this.dialog.open(ModalInfoVariaveisComponent, {
      data: {
        qtdVariaveisPreenchidas: listaDados[0],
        qtdVariaveisPreenchidasSub: listaDados[1],
        erros: listaDados[2]
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.modalErro(listaDados[2]);
    });
  }

  buscarTodosIndicadores() {
    this.form.controls.busca.setValue("");
    this.form.controls.buscaIdVariavel.setValue("");
    this.form.controls.buscaNomeVariavel.setValue("");
    this.loading = true;
    let idSubdivisao = this.form.controls.subdivisao.value;
    if(idSubdivisao){
      this.subdivisaoSelecionada = this.listaSubdivisoes.filter(sub => sub.id == idSubdivisao)[0]
    
      this.indicadoresPreenchidosService
      .buscarIndicadoresPreenchidosStatusSubdivisao(idSubdivisao,new Date().getFullYear() - 1)
      .subscribe(
        res => {
          this.configurarTabelaIndicadores(res);
          this.carregouPorSubdivisao = true;
        },
        error => {
          this.loading = false;
        });
    } else {

      this.indicadoresPreenchidosService
        .buscarIndicadoresPreenchidosStatus(new Date().getFullYear() - 1)
        .subscribe(
          res => {
            this.configurarTabelaIndicadores(res);
          },
          error => {
            this.loading = false;
          });
    }

  }

  configurarTabelaIndicadores(res){
    
    this.indicadores = res as IndicadoresPreenchidosStatusDTO[];
    this.listaIndicadoresDTO = res as IndicadoresPreenchidosStatusDTO[];
    this.indicadores.forEach(i => i.exibirListaVariaveis = false);
    this.listaIndicadoresDTO.forEach(i => i.exibirListaVariaveis = false);
    this.ordenarIndicadores();
    this.dataSource = new MatTableDataSource(this.indicadores);
    this.dataSource.sort = this.sort;
    this.dataSource.connect().subscribe(data => {this.indicadoresDTOPaginado = data as IndicadoresPreenchidosStatusDTO[]; });
    this.verificarPorcentagemPreenchida();
    this.loading = false;
  }

  downloadTabelaVariaveis() {
    this.importacaoVariaveisService.downloadTabelaVariaveis().subscribe(res => {
      const blob = new Blob([res], { type: "application/octet-stream" });
      saveAs(blob, "Tabela de Variaveis.xlsx");
    });
  }

  enviarArquivo(event: any) {
    
    this.loading = true;

    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      PcsUtil.swal()
        .fire({
          title: "Enviar Arquivo",
          text: `Tem certeza que deseja importar o arquivo ${file.name} ?`,
          type: "info",
          showCancelButton: true,
          confirmButtonText: "Sim",
          cancelButtonText: "Não"
        })
        .then(valor => {
          if (valor.value === true) {

            let dialogRef = this.dialog.open(this.modalLoading, {
              height: '300px',
              width: '300px',
            });

            this.importacaoVariaveisService.importar(file).subscribe(res => {
              this.dialog.closeAll();
              this.listaInfoArquivo = res
             
              this.buscarTodosIndicadores();
              
              let erros = this.listaInfoArquivo[2];

              if (erros != null) {
                PcsUtil.swal()
                  .fire(
                    "Arquivo importado",
                    `Foram registrados alguns erros`,
                    "success"
                  )
                  .then(res => {
                    this.modalInfo(this.listaInfoArquivo);
                  });
              } else {
                PcsUtil.swal().fire("Arquivo importado", "", "success");
              }
            },error =>{
              this.dialog.closeAll();
            });
          }
        });
    }
    this.loading = false;
  }

  buscarIndicadorPorNome() {
    let busca: string = this.form.controls.busca.value;
    let buscaIdVariavel: number = this.form.controls.buscaIdVariavel.value;
    let buscaNomeVariavel: string = this.form.controls.buscaNomeVariavel.value;
    let status: string = this.form.controls.status.value.toLowerCase();
    let eixo: number = this.form.controls.eixo.value;
    let id: number = this.form.controls.id.value;
    
    this.indicadores = this.listaIndicadoresDTO.filter(indicador =>
      indicador.nome.toLowerCase().includes(busca.toLowerCase())
    );

    if (busca) {
      this.loadDataSource();
    }
    if (status != 'todos') {
      if (status === 'preenchido') {
        this.indicadores = this.indicadores.filter(indicador => 
          !indicador.status.toLowerCase().includes('preenchido (anos anteriores)') && indicador.status.toLowerCase().includes(status.toLowerCase()) && indicador.nome.toLowerCase().includes(busca.toLowerCase())
        )
      } else {
        this.indicadores = this.indicadores.filter(indicador => 
          indicador.status.toLowerCase().includes(status.toLowerCase()) && indicador.nome.toLowerCase().includes(busca.toLowerCase())
        )
      }
      this.loadDataSource();
    } else {
      this.loadDataSource();
    }
    if (eixo != null) {
      this.indicadores = this.indicadores.filter(indicador =>
        indicador.idEixo === eixo && indicador.nome.toLowerCase().includes(busca.toLowerCase()))
      this.loadDataSource();
    }
   
    if (id != null) {      
      this.indicadores = this.listaIndicadoresDTO.filter(indicador =>
        indicador.id == id && indicador.nome.toLowerCase().includes(busca.toLowerCase()))
    }



    if(buscaIdVariavel){
      this.painelService.buscarIndicadoresPorVariavel(buscaIdVariavel)
        .subscribe(res => {
          if(res){
            var idIndicadores = res as Number[];
            this.indicadores = this.indicadores.filter(ind => idIndicadores.includes(ind.id))
            this.loadDataSource();
          }else{
            this.indicadores = [];
            this.loadDataSource();
          }
        }
      );
    }


    if(buscaNomeVariavel){
      this.painelService.buscarIndicadoresPorNomeVariavel(buscaNomeVariavel)
        .subscribe(res => {
          if(res){
            var idIndicadores = res as Number[];
            this.indicadores = this.indicadores.filter(ind => idIndicadores.includes(ind.id))
            this.loadDataSource();
          }else{
            this.indicadores = [];
            this.loadDataSource();
          }
        }
      );
   
    }
  }

  public loadDataSource(){
    this.dataSource = new MatTableDataSource(this.indicadores);
    /*this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';*/

    this.dataSource.connect().subscribe(data => {this.indicadoresDTOPaginado = data as IndicadoresPreenchidosStatusDTO[]; });
   
  }

  private verificarPorcentagemPreenchida(){
    let preenchido: number = 0;
    let pendente: number = 0;
    let totalIndicadores: number = this.indicadores.length;
    let porcentagemPreenchida: number;
    let porcentagemPendente: number;
    for(let item in this.indicadores){
      if(!this.indicadores[item].complementar) {
        if (this.indicadores[item].status == "Preenchido"){
          preenchido++;
        }
        else if (this.indicadores[item].status == "Pendente") {
          pendente++;
        }
      }
    }
    porcentagemPreenchida = (100/totalIndicadores) * preenchido;
    porcentagemPreenchida = parseFloat(porcentagemPreenchida.toFixed(1));
    porcentagemPendente = (100/totalIndicadores) * pendente;
    porcentagemPendente = parseFloat(porcentagemPendente.toFixed(1));
    
    this.quantidadePreenchida = porcentagemPreenchida;
    this.quantidadeNaoPreenchida = porcentagemPendente;
    this.quantidadePreenchidaAnosAnteriores = 100 - (porcentagemPreenchida + porcentagemPendente);
    this.quantidadePreenchidaAnosAnteriores = parseFloat(this.quantidadePreenchidaAnosAnteriores.toFixed(1));
  }
  

  private ordenarIndicadores() {
    this.listaIndicadoresDTO.sort((a, b) => {
      const indicadorA = a.nome.toLowerCase();
      const indicadorB = b.nome.toLowerCase();
      if (indicadorA < indicadorB) {
        return -1;
      }
      if (indicadorA > indicadorB) {
        return 1;
      }
      return 0;
    });
  }

  isGestor() {
    return this.gestorLogado;
  }

  private setGestorLogado() {
    let usuarioLogadoCredencial = JSON.parse(
      localStorage.getItem("usuarioLogado")
    );
    this.gestorLogado = usuarioLogadoCredencial.usuarioPrefeitura;
  }

  public exibirVariaveis(item: IndicadoresPreenchidosStatusDTO) {
    item.exibirListaVariaveis =  !item.exibirListaVariaveis;
  }

  carregarSubdivisoes(){
    this.subdivisaoService.buscarTodosPorCidade().subscribe(res => {
      this.listaSubdivisoes = res;

      if(this.subdivisaoParametro){
        this.subdivisaoSelecionada = this.listaSubdivisoes.filter(sub => PcsUtil.toSlug(sub.nome) == PcsUtil.toSlug(this.subdivisaoParametro))[0];
        this.form.controls.subdivisao.setValue(this.subdivisaoSelecionada.id);
      }
    });
  }

  public validacaoDownloadTabelaVariaveis(){

    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadTabelaVariaveis();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Tabela de Variáveis';
      this.dadosDownload.pagina = 'Lista de Preenchimento de Indicadores';
      this.dadosDownload.arquivo = 'Tabela de Variáveis';
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadTabelaVariaveis();
    } else {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Tabela de Variáveis",
      pagina: "Lista de Preenchimento de Indicadores",
      arquivo: "Tabela de Variáveis"
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.downloadTabelaVariaveis();
        
      }
    });
    }
  }

  public getUsuarioLogadoDadosDownloadTabelaVariaveis(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Tabela de Variáveis';
    this.dadosDownload.pagina = 'Lista de Preenchimento de Indicadores';  
    this.dadosDownload.arquivo = 'Tabela de Variáveis';  
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }
  
  selecionarIndicadorSubdivisao(){
    this.subdivisaoParametro = this.activateRouter.snapshot.queryParams["subdivisao"];
    this.indicadorParametro = this.activateRouter.snapshot.queryParams["indicador"];
  }

  irParaIndicador(){
    
    if(this.subdivisaoParametro && !this.carregouPorSubdivisao){
      if(this.listaSubdivisoes){
        let subdivisaoEscolhida = this.listaSubdivisoes.filter(sub => PcsUtil.toSlug(sub.nome) == PcsUtil.toSlug(this.subdivisaoParametro))[0]
        if(subdivisaoEscolhida){
          if(this.form.controls.subdivisao.value != subdivisaoEscolhida.id){
            this.form.controls.subdivisao.setValue(subdivisaoEscolhida.id);
          }
        } else {
          return
        }
      }else{
        return;
      }
    }
    if(this.indicadorParametro && !this.foiProIndicador ){
        let linhaIndicador = this.element.nativeElement.querySelector('#indicador-'+this.indicadorParametro);
        if(linhaIndicador){
          linhaIndicador.scrollIntoView();
          this.foiProIndicador = true;
          let colunaIndicador:any = document.querySelector('#td-'+this.indicadorParametro);
          if(colunaIndicador){
            colunaIndicador.click();
          }
        }
    }
  }

  tamanhoTela(){
    return (window.innerHeight)
  }

  definirCorStatus(status: String) {
    if(status === 'Preenchido') {
      return '#47825e'
    } else if (status === 'Pendente'){
      return '#ff9800'
    } else {
      return '#00b0ff'
    }
  }

}
