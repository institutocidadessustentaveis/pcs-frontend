import { Component, OnInit, ElementRef } from '@angular/core';
import { Cidade } from 'src/app/model/cidade';
import { CidadeService } from 'src/app/services/cidade.service';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { Title } from '@angular/platform-browser';
import { SeoService } from 'src/app/services/seo-service.service';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownload } from 'src/app/model/dados-download';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Usuario } from 'src/app/model/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dados-abertos',
  templateUrl: './dados-abertos.component.html',
  styleUrls: ['./dados-abertos.component.css']
})
export class DadosAbertosComponent implements OnInit {

  private urlEndpoint: string = `${environment.API_URL}dados-abertos/`;

  cidades: Cidade[];
  indicadores: any[];
  idCidade: number = -1;
  idIndicador: number = -1;
  formato: string = ".xls";
  loading: boolean = false;
  scrollUp: any;

  dadosDownload = new DadosDownload;
  usuario: Usuario;
  private estaLogado: boolean = false;

  urlDownloadIndicadores: string = "";
  urlDownloadVariaveis: string = "";

  constructor(private cidadeService: CidadeService,
              private indicadoresPreenchidosService: IndicadoresPreenchidosService,
              private indicadoresService: IndicadoresService,
              private element: ElementRef,
              private router: Router,
              public dialog: MatDialog,
              private titleService: Title,
              private seoService: SeoService,
              private dadosDownloadService: DadosDownloadService,
              private usuarioService: UsuarioService,
              private authService: AuthService,
              ) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.titleService.setTitle("Dados Abertos - Cidades Sustentáveis");
  }

  ngOnInit() {
    const config = {
      title: 'Dados Abertos - Cidades Sustentáveis',
      description: ' ',
      slug: '',
      site: 'Cidades Sustentáveis' ,
      url: `${environment.APP_URL}dados-abertos`
    };
    this.seoService.generateTags(config);
    this.buscarCidadesSignatarias();
    this.buscarIndicadoresPreenchidos();


    this.estaLogado = this.authService.isAuthenticated()
    if(this.estaLogado == true) {
      this.buscarDadosDownloadUsuarioLogado();
    }
    
  }

  private buscarCidadesSignatarias() {
    this.cidadeService.buscarSignatarias().subscribe((response) => {
      this.cidades = response as Cidade[];
    });
  }

  private buscarIndicadoresPreenchidos() {
    this.loading = true;

    this.indicadoresService.buscarIndicadoresPcsParaCombo().subscribe((response) => {
      this.indicadores = response;
      this.loading = false;
    })
  }

  public gerarUrlDownloadIndicadores() {
    window.open(`${this.urlEndpoint}indicadores${this.formato}?idCidade=${this.idCidade}&idIndicador=${this.idIndicador}`, "_blank");
  }

  public gerarUrlDownloadVariaveis() {
    window.open(`${this.urlEndpoint}variaveis${this.formato}?idCidade=${this.idCidade}&idIndicador=${this.idIndicador}`, "_blank");
  }

  public validacaoDownloadIndicadores(){
    if(this.estaLogado) {
      
      this.cadastrarDadosDownload(this.dadosDownload);
      
      this.gerarUrlDownloadIndicadores();
     
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Indicadores';
      this.dadosDownload.pagina = 'Dados Abertos';
      this.dadosDownload.arquivo = "Indicadores";
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.gerarUrlDownloadIndicadores();
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Indicadores",
      pagina: "Dados Abertos",
      arquivo: "Indicadores"
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.dadosDownload = result;
      if(result != null) {
        this.gerarUrlDownloadIndicadores();
      }
    });
    }
  }

  public validacaoDownloadVariaveis(){
    if(this.estaLogado) {
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.gerarUrlDownloadVariaveis();

    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Variáveis';
      this.dadosDownload.pagina = 'Dados Abertos';
      this.dadosDownload.arquivo = "Variáveis";
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.gerarUrlDownloadVariaveis();
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Variáveis",
      pagina: "Dados Abertos",
      arquivo: "Variáveis"
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;

        this.gerarUrlDownloadVariaveis();
      }
    });
    }
  }

  public buscarDadosDownloadUsuarioLogado(){
    this.getUsuarioLogadoDadosDownloadIndicadores();
    this.getUsuarioLogadoDadosDownloadVariaveis();
  }


  public getUsuarioLogadoDadosDownloadIndicadores(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Indicadores';
    this.dadosDownload.pagina = 'Dados Abertos';
    this.dadosDownload.arquivo = 'Indicadores';    
    });
  }

  public getUsuarioLogadoDadosDownloadVariaveis(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Variáveis';
    this.dadosDownload.pagina = 'Dados Abertos';
    this.dadosDownload.arquivo = 'Variáveis';    
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }


}
