import { SecaoLateral } from './../../../../model/secao-lateral';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownloadService } from 'src/app/services/dados-download.service';

@Component({
  selector: 'app-secao-lateral',
  templateUrl: './secao-lateral.component.html',
  styleUrls: ['./secao-lateral.component.css',
  './secao-lateral-home.component.css',
  './secao-lateral.component.scss']
})

export class SecaoLateralComponent implements OnInit {


  paginaChild: SecaoLateral;

  private dadosDownload = new DadosDownload;

  public segundoTituloPrincipalCorTema: any;

  @Input() tituloHome;
  @Input() dadosDownloadUser: DadosDownload;
  @Input()
  set secaoLateral(secaoLateral: SecaoLateral ){
      this.paginaChild = secaoLateral;
      this.carregarSafeUrls(this.paginaChild);
      this.initAlpha(secaoLateral);
  }
  get secaoLateral(){
      return this.paginaChild;
  }

  get segundoTituloPrincipalCorTemaAux() {
    return this.initAlpha(this.paginaChild);
  }

  constructor(private domSanitizer: DomSanitizer,
    private dadosDownloadService: DadosDownloadService,
    public dialog: MatDialog) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {
  }

  initAlpha(secaoLateral: SecaoLateral): any {
    if (secaoLateral && secaoLateral.segundoTituloPrincipalCor) {
      this.segundoTituloPrincipalCorTema = this.addAlpha(secaoLateral.segundoTituloPrincipalCor, 0.1);
    }
    return this.segundoTituloPrincipalCorTema;
  }

  addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }

  private carregarSafeUrls(secaoLateral: SecaoLateral) {
    if (secaoLateral && secaoLateral.primeiraImagem) {
      secaoLateral.primeiraImagemSafeUrl = this.getSafeUrl(secaoLateral.primeiraImagem);
    }
    if (secaoLateral && secaoLateral.segundaImagem) {
      secaoLateral.segundaImagemSafeUrl = this.getSafeUrl(secaoLateral.segundaImagem);
    }

    if (secaoLateral && secaoLateral.terceiraImagem) {
      secaoLateral.terceiraImagemSafeUrl = this.getSafeUrl(secaoLateral.terceiraImagem);
    }
  }

  // public botaoSecao4IrPara() {
  //   window.open(this.paginaChild.primeiraSecao.linkBotao01, "_blank");
  // }

  public getImagePath(id: number): string {
    if(id == null) {
      return '/';
    }

    return `${environment.API_URL}home/imagem/` + id;
  }

  public urlArquivo(link){
    window.open(`${link}`, '_blank')
  }

  verificaDadosDownloadUser(){
    if(this.dadosDownloadUser === null || this.dadosDownloadUser === undefined){
      return false;
    } else {
      return true;
    }
  }

  public validacaoDownload(arquivo){
    if(this.verificaDadosDownloadUser()) {
      this.dadosDownload = this.dadosDownloadUser;
      this.dadosDownload.arquivo = arquivo;
      this.cadastrarDadosDownload(this.dadosDownload);
      this.urlArquivo(arquivo);
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = `Download de Arquivo de ${this.tituloHome}`;
      this.dadosDownload.pagina = this.tituloHome;
      this.dadosDownload.arquivo = arquivo;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.urlArquivo(arquivo);
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: `Download de Arquivo de ${this.tituloHome}`,
      pagina: this.tituloHome,
      arquivo: arquivo
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.urlArquivo(arquivo);
      }
    });
    }
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

  verificaLinks(link) {
      if (link.includes('.pdf' || '.doc' || '.docx' || '.xls' || '.xlsx' || '.csv')) {
        return true;
      } else { 
        return false; 
      }
  }

}
