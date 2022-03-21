import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';
import { SetimaSecao } from 'src/app/model/setima-secao';
import { DadosDownload } from 'src/app/model/dados-download';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';

@Component({
  selector: 'app-setima-secao',
  templateUrl: './setima-secao.component.html',
  styleUrls: ['./setima-secao.component.css']
})

export class SetimaSecaoComponent implements OnInit {

  paginaChild: SetimaSecao;

  public corTema: any;

  private dadosDownload = new DadosDownload;

  @Input() tituloHome;
  @Input() dadosDownloadUser: DadosDownload;
  @Input()
  set setimaSecao(setimaSecao: SetimaSecao ) {
      this.paginaChild = setimaSecao;
      this.carregarSafeUrls(this.paginaChild);
      this.initAlpha(setimaSecao);
  }
  get setimaSecao() {
      return this.paginaChild;
  }

  get corTemaAux() {
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

  initAlpha(setimaSecao: SetimaSecao): any {
    if (setimaSecao && setimaSecao.tituloPrincipalCor) {
      this.corTema = this.addAlpha(setimaSecao.tituloPrincipalCor, 0.1);
    }
    return this.corTema;
  }

  addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }

  private carregarSafeUrls(setimaSecao: SetimaSecao) {
    if (setimaSecao && setimaSecao.primeiraImagem) {
      setimaSecao.primeiraImagemSafeUrl = this.getSafeUrl(setimaSecao.primeiraImagem);
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
    if(this.dadosDownloadUser === null || this.dadosDownloadUser === undefined || Object.keys(this.dadosDownloadUser).length === 0){
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
