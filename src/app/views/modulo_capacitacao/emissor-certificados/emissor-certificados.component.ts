import { HistoricoCertificadoCapacitacao } from './../../../model/historicoCertificadoCapacitacao';
import { Arquivo } from 'src/app/model/arquivo';
import { environment } from 'src/environments/environment';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HistoricoCertificadoService } from './../../../services/historico-certificado.service';
import { CertificadoService } from './../../../services/certificado.service';
import { EventoService } from 'src/app/services/evento.service';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { CertificadoCapacitacao } from './../../../model/certificadoCapacitacao';
import { Title, DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Certificado } from './../../../model/certificado';
import * as XLSX from 'xlsx';
import { ReadVarExpr } from '@angular/compiler';
import { resolve } from 'url';
import { MatDialog, MatDialogConfig, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { PerfisService } from 'src/app/services/perfis.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';

type AOA = any[][];
@Component({
  selector: 'app-emissor-certificados',
  templateUrl: './emissor-certificados.component.html',
  styleUrls: ['./emissor-certificados.component.css']
})

export class EmissorCertificadosComponent implements OnInit {

  public certificadoCapacitacao: CertificadoCapacitacao;
  public certificadoCapacitacaoPorPerfil = new CertificadoCapacitacao;
  public historicoCertificadoCapacitacao: HistoricoCertificadoCapacitacao = new HistoricoCertificadoCapacitacao();
  public eventos: any = [];
  public templates: Certificado[] = [];
  public editorConfig: any;
  public safeUrl: any;
  public safeUrlBackground: any;
  public templateEscolhido: Certificado;
  public nomeEscolhido: string;
  public dataEscolhida: string;
  public texto1: any;
  public texto2: any;
  public texto3: any;
  public imagemTemplateSelecionado: Arquivo;
  public nomeArquivo: string = null;
  public exibiuCertificado = false;
  public emitirNovo = true;
  public loading = false;
  public carregamentoTabela: number = 0;
  public labelCarregamentoTabela: string;
  public emitindoCertificados: boolean = false;
  data: AOA = [];
  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  public loadingCertificadoPorPerfil: boolean = false;
  public loadingCertificadoPorTabela: boolean = false;

  estaLogado = false;

  perfisCombo: [] = [];
  idPerfil: number;

  listaUsuarios: [] = [];
  pesquisou = false;

  listUser: AOA = [];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ["nome", "email", "acao"];


  @ViewChild('file') fileInput;

  constructor(
    private titleService: Title,
    private eventoService: EventoService,
    private certificadoService: CertificadoService,
    private historicoCertificadoService: HistoricoCertificadoService,
    public domSanitizer: DomSanitizer,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public domSanitizationService: DomSanitizer,
    public dialog: MatDialog,
    private usuarioService: UsuarioService,
    private dadosDownloadService: DadosDownloadService,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private perfilService:  PerfisService
  ) {
    this.editorConfig = {
      height: '200px',
      toolbar: [
        ['misc', ['undo', 'redo']],
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['style0', 'ul', 'ol', 'paragraph']],
        ['insert'],
        ['view', ['fullscreen', 'codeview']]
      ],
      fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
      callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
    };

    this.certificadoCapacitacao = new CertificadoCapacitacao();
  }

  ngOnInit() {
    this.titleService.setTitle(`Emissor de certificados - Cidades Sustentáveis`);
    this.buscarEventosCapacitacao();
    this.buscarTemplatesCertificado();
    this.carregarComboPerfil();

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true){
      this.getUsuarioLogadoDadosDownloadCertificado();
    }
  }

  excelDateToJSDate(serial) {
    
    var utc_days  = Math.floor(serial - 25569);
    
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
 }

  onFileChange(evt: any) {
    this.carregamentoTabela = 30
    this.labelCarregamentoTabela = `Lendo Tabela...`
        this.emitindoCertificados = true;
        this.nomeArquivo = evt.srcElement.files[0].name
        /* wire up file reader */
        const target: DataTransfer = <DataTransfer>(evt.target);
        if (target.files.length === 1) {
          const reader: FileReader = new FileReader();
          reader.onload = (e: any) => {

            /* read workbook */
            const bstr: string = e.target.result;

            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];

            /* save data */
            this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
            
            let colunas = this.data.slice(0, 1)[0];
            let colunaTemplateValida = false;
            let colunaUsuarioValida = false;
            let colunaDataValida = false;
            let colunaEmailValida = false;

            if (colunas[0]) {
              if (colunas[0].toUpperCase() === 'TEMPLATE') {
                colunaTemplateValida = true;
              }
            }
            if (colunas[1]) {
              if (colunas[1].toUpperCase() === 'USUARIO' || colunas[1].toUpperCase() === 'USUÁRIO') {
                colunaUsuarioValida = true;
              }
            }
            if (colunas[2]) {
              if (colunas[2].toUpperCase() === 'DATA') {
                colunaDataValida = true;
              }
            }

            if (colunas[3]) {
              if (colunas[3].toUpperCase() === 'EMAIL' || colunas[3].toUpperCase() === 'E-MAIL') {
                colunaEmailValida = true;
              }
            }
            if (colunaTemplateValida && colunaUsuarioValida && colunaDataValida && colunaEmailValida) {
              this.carregamentoTabela = 50;
              this.data.splice(0, 1);
              this.gerarCertificados()
            }
            else {
              this.nomeArquivo = null;
              PcsUtil.swal().fire('Colunas inválidas, mantenha o padrão TEMPLATE | USUÁRIO | DATA')
            }
        }
          reader.readAsBinaryString(target.files[0]);
          this.fileInput.nativeElement.value = '';
          this.data = [];
        }
  }
  
  templateEscolhidoValido(linha) {
    let templateSelecionado: Certificado;
    for (let i = 0; i < this.templates.length; i++) {
      if (this.templates[i].titulo == linha[0]) {
        templateSelecionado = this.templates[i]
      }
    }
    return templateSelecionado;
  }

  snackBarEmailEnviado(email) {
    this._snackBar.open(email != null ? `certificado enviado no email: ${email}` : `Campo email vazio para um dos certificados.`, 'Fechar', {
      duration: 5000
    });
  }

  gerarCertificados() {
      this.carregamentoTabela = 60      
      this.loadingCertificadoPorTabela = true
      let that = this;
      this.gerarCertificadosRecursivo(0, that);
  }


  gerarCertificadosRecursivo(count, that) {
    if(this.data[count]) {
      if (this.data[count].length > 0) {      
        this.carregamentoTabela = 30
        this.popularDadosCertificado(this.templateEscolhidoValido(this.data[count]), this.data[count], that).then(r => {      
         this.emitir(this.templateEscolhidoValido(this.data[count]), false).then( r => {                
           count += 1;
           this.gerarCertificadosRecursivo(count, that);
         });
        });
      }
    } else {
      Swal.fire('Processo finalizado', '', 'success')
      this.emitindoCertificados = false;

      this.templateEscolhido.id = null;
      this.templateEscolhido.imagem = null;
      this.templateEscolhido.texto1 = null;
      this.templateEscolhido.texto2 = null;
      this.templateEscolhido.texto3 = null;
      this.templateEscolhido.titulo = null;
      this.certificadoCapacitacao.id = null;
      this.certificadoCapacitacao.data = null;
      this.certificadoCapacitacao.email = null;
      this.certificadoCapacitacao.certificado = null;
      this.certificadoCapacitacao.nomeUsuario = null;
      this.templateEscolhido.orientacaoPaisagem = null;

      this.nomeArquivo = null;
      this.carregamentoTabela = 0;
      this.loadingCertificadoPorTabela = false;
      this.buscarTemplatesCertificado()
    }
  }

  public changeTemplate(event: Certificado) {
    this.templateEscolhido = event;
    this.changeDados(this.templateEscolhido);
    this.mostrarImagem(this.templateEscolhido);
  }

  async popularDadosCertificado(template, element, that) {
    that.certificadoCapacitacao = new CertificadoCapacitacao();
      that.templateEscolhido = template
      
      that.certificadoCapacitacao.certificado = template

      that.nomeEscolhido = element[1];
      that.certificadoCapacitacao.nomeUsuario = element[1]
      this.certificadoCapacitacao.nomeUsuario = element[1]

      that.dataEscolhida = that.excelDateToJSDate(element[2]);
      that.certificadoCapacitacao.data = that.excelDateToJSDate(element[2]); 
      this.certificadoCapacitacao.data = that.excelDateToJSDate(element[2]); 

      that.certificadoCapacitacao.email = element[3];
      this.certificadoCapacitacao.email = element[3];

      that.changeTemplate(template)
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 2000)
      })      
  }

  async popularDadosCertificadoPorUsuario(template, element, that) {
    that.certificadoCapacitacao = new CertificadoCapacitacao();
      that.templateEscolhido = template
      
      that.certificadoCapacitacao.certificado = template

      that.nomeEscolhido = element[1];
      that.certificadoCapacitacao.nomeUsuario = element[1];
      this.certificadoCapacitacao.nomeUsuario = element[1];

      that.dataEscolhida = element[2];
      that.certificadoCapacitacao.data = element[2];
      this.certificadoCapacitacao.data = element[2];

      that.certificadoCapacitacao.email = element[3];
      this.certificadoCapacitacao.email = element[3];

      that.changeTemplate(template)
      return new Promise<void>((resolve) => {
        setTimeout(resolve, 2000)
      })      
  }
  
  onLoadCertificado(template, idElement, formatoPdf, email, that, baixar, nomeUsuario) { 
    this.templateEscolhido = template;
    this.nomeEscolhido = nomeUsuario;
    
    let  element = document.getElementById(idElement)
    html2canvas(element).then(canvas => {
      let imgData = canvas.toDataURL('image/jpg');
      let documento = new jsPDF(formatoPdf, 'mm', 'a4');
      documento.addImage(imgData, 'PNG', 0, 0); 
           
      let dataToRemove = documento.output("datauristring").split(',')[0];
      let documentoBase64: string = documento.output("datauristring").replace(dataToRemove + ',', '')
      if (email != null) {
        this.labelCarregamentoTabela = `Processando certificados...`
        that.certificadoService.enviarPorEmail(documentoBase64, email, this.nomeEscolhido).subscribe(res => {
          this.snackBarEmailEnviado(email)
        })
      }
      if (baixar == true) {
        documento.save(`${this.nomeEscolhido}.pdf`);      
      }
      this.emitindoCertificados = false;
    });
  }

  async emitir(template: Certificado, baixar) {
    this.emitindoCertificados = true;
    if (template != null) {
      this.templateEscolhido = template;
    }
    this.salvarHistoricoCertificado();
    if (this.templateEscolhido != null) {
      if (!this.templateEscolhido.orientacaoPaisagem) {
        this.onLoadCertificado(this.templateEscolhido, 'retrato', 'p',this.certificadoCapacitacao.email, this, baixar, this.nomeEscolhido) 
     } 
     else {
      this.onLoadCertificado(this.templateEscolhido, 'paisagem', 'landscape', this.certificadoCapacitacao.email, this, baixar, this.nomeEscolhido)
     }
    }
    else {
      if (!template.orientacaoPaisagem) {
        this.onLoadCertificado(template, 'retrato', 'p', this.certificadoCapacitacao.email, this, baixar, this.nomeEscolhido)
        
     } else {
       this.onLoadCertificado(template, 'paisagem', 'landscape', this.certificadoCapacitacao.email, this, baixar, this.nomeEscolhido)
     }
    }
    if (!baixar) {
      setTimeout(() => {
        this.carregamentoTabela = 100
        setTimeout(() => {this.carregamentoTabela = 0}, 300)
      }, 8000)
      setTimeout(() => {
        this.carregamentoTabela = 60
      }, 5000)
    }
    return new Promise<void>((resolve) => {
      setTimeout(resolve, 9000)
    }) 
  }

  public buscarEventosCapacitacao() {
    this.eventoService.buscarTodosEventosCapacitacao().subscribe(res => {
      this.eventos = res;
    });
  }

  public buscarTemplatesCertificado() {
    this.certificadoService.buscarCertificados().subscribe(res => {
      this.templates = res as Certificado[];
    });
  }

  mostrarImagem(templateEscolhido) {
    if (templateEscolhido) {
      this.templateEscolhido = templateEscolhido;
      this.safeUrlBackground = null;
      this.certificadoService.buscarImagemCertificado(this.templateEscolhido.id).subscribe(res => {
        this.imagemTemplateSelecionado = res as Arquivo;
  
        if (this.imagemTemplateSelecionado) {
          this.safeUrlBackground = this.domSanitizer.bypassSecurityTrustStyle(
            `url(${'data:image/png;base64,' + this.imagemTemplateSelecionado.conteudo})`
          );
          this.safeUrl = this.domSanitizer.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + this.imagemTemplateSelecionado.conteudo
          );
          return this.safeUrl;
        }
      });
    }
  }

  salvarHistoricoCertificado() {
    if (this.certificadoCapacitacao != null) {
      this.historicoCertificadoCapacitacao.nomeUsuario = this.certificadoCapacitacao.nomeUsuario;
      this.historicoCertificadoCapacitacao.certificado = this.certificadoCapacitacao.certificado.titulo;
      this.historicoCertificadoCapacitacao.data = this.certificadoCapacitacao.data;
      this.historicoCertificadoService.cadastrarHistoricoCertificado(this.historicoCertificadoCapacitacao).subscribe(res => { },
        error => {
          PcsUtil.swal().fire('Erro ao salvar certificado no histórico de certificados', error.error.message, 'error');
        });
    }
  }

  changeDados(templateEscolhido) {
    if (templateEscolhido != null) {
      this.templateEscolhido = templateEscolhido
    }    
    if (this.templateEscolhido) {
      this.nomeEscolhido = this.certificadoCapacitacao.nomeUsuario;
      this.dataEscolhida = this.formatarData();
      
      this.texto1 = this.templateEscolhido.texto1;
      this.texto2 = this.templateEscolhido.texto2;
      this.texto3 = this.templateEscolhido.texto3;
      if (this.nomeEscolhido) {
        this.texto1 = this.texto1.replaceAll('%nome%', this.nomeEscolhido);
        this.texto2 = this.texto2.replaceAll('%nome%', this.nomeEscolhido);
        this.texto3 = this.texto3.replaceAll('%nome%', this.nomeEscolhido);
      }
      if (this.dataEscolhida) {
        this.texto1 = this.texto1.replaceAll('%data%', this.dataEscolhida);
        this.texto2 = this.texto2.replaceAll('%data%', this.dataEscolhida);
        this.texto3 = this.texto3.replaceAll('%data%', this.dataEscolhida);
      }
    }
  }

  public formatarData(): string {
    if (this.certificadoCapacitacao.data) {
      
      const date = new Date(this.certificadoCapacitacao.data.toString());
      date.setDate(date.getDate() + 1);

      let month = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

      let mes = month[date.getMonth()];

      return date.getDate() + ' de ' + mes + ' de ' + date.getFullYear();
    }
    return '';
  }

  validacaoEmissaoCerficado(template: Certificado, baixar) {

    if(this.estaLogado) {
      this.dadosDownload.arquivo = this.certificadoCapacitacao.nomeUsuario;
      this.cadastrarDadosDownload(this.dadosDownload);
      this.emitir(template, baixar);
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Certificado de Capacitação';
      this.dadosDownload.pagina = 'Emissão de Certificado';
      this.dadosDownload.arquivo = this.certificadoCapacitacao.nomeUsuario
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.emitir(template, baixar)
    } else {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Certificado de Capacitação",
      pagina: "Emissão de Certificado",
      arquivo: this.certificadoCapacitacao.nomeUsuario
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.emitir(template, baixar)
      }
    });
    }
  }

  public getUsuarioLogadoDadosDownloadCertificado(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Certificado de Capacitação';
    this.dadosDownload.pagina = 'Emissão de Certificado';    
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

  public carregarComboPerfil() {
    this.perfilService.buscarComboBoxPerfis().subscribe(perfis => {
      this.perfisCombo = perfis;
    })
  }

public buscarUsuariosPorIdPerfil(id){
    this.usuarioService.buscarPorPerfil(id).subscribe(usuarios => {
      this.listaUsuarios = usuarios
      this.pesquisou = true;
      this.dataSource = new MatTableDataSource<any>(this.listaUsuarios);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
    });
  }

  onUserSelection(event, nome, email){
    if(event) {
      let arrAux: any[] = []
      let titulo: any = this.certificadoCapacitacaoPorPerfil.certificado.titulo;
      let data = new Date(this.certificadoCapacitacaoPorPerfil.data);
    
      arrAux.push(titulo, nome, data, email)
    
      this.listUser.push(arrAux); 
    } else {
      for(let i = 0; i < this.listUser.length; i++) {
        if(this.listUser[i][3] === email){
          this.listUser.splice(i, 1);
          break
        }
      }
    }
  }

  gerarCertificadoPorPerfil(){
    let that = this;
    this.loadingCertificadoPorPerfil = true
    this.emitirCertificadosPorPerfilRecursivo(0, that);
  }

  emitirCertificadosPorPerfilRecursivo(count, that){
    if (this.listUser[count] != undefined) {
      if (that.listUser[count].length > 0) {
        this.carregamentoTabela = 60 + count
        this.popularDadosCertificadoPorUsuario(this.templateEscolhidoValido(this.listUser[count]), this.listUser[count], that).then(r => {      
         this.emitir(this.templateEscolhidoValido(this.listUser[count]), false).then( r => {                
           count += 1;
           this.emitirCertificadosPorPerfilRecursivo(count, that);
         })
        })
      }
    } else {
      Swal.fire('Processo finalizado', '', 'success')
      this.emitindoCertificados = false;
      this.loadingCertificadoPorPerfil = false

      this.templateEscolhido.id = null;
      this.templateEscolhido.imagem = null;
      this.templateEscolhido.texto1 = null;
      this.templateEscolhido.texto2 = null;
      this.templateEscolhido.texto3 = null;
      this.templateEscolhido.titulo = null;
      this.certificadoCapacitacao.id = null;
      this.certificadoCapacitacao.data = null;
      this.certificadoCapacitacao.email = null;
      this.certificadoCapacitacao.certificado = null;
      this.certificadoCapacitacao.nomeUsuario = null;
      this.templateEscolhido.orientacaoPaisagem = null;

      this.nomeArquivo = null;
      
      this.labelCarregamentoTabela = ''
      this.buscarTemplatesCertificado();
      this.carregarComboPerfil();
    }  
  }


}


