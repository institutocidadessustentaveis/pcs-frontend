import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';
import { SegundaSecao } from 'src/app/model/segunda-secao';
import { DadosDownload } from 'src/app/model/dados-download';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownloadService } from 'src/app/services/dados-download.service';

@Component({
  selector: 'app-segunda-secao',
  templateUrl: './segunda-secao.component.html',
  styleUrls: ['./segunda-secao.component.css']
})

export class SegundaSecaoComponent implements OnInit {

  paginaChild: SegundaSecao;

  private dadosDownload = new DadosDownload;
  
  public corTema: any;

  @Input() tituloHome;
  @Input() dadosDownloadUser: DadosDownload;
  @Input()
  set segundaSecao(segundaSecao: SegundaSecao ){
      this.paginaChild = segundaSecao;
      this.carregarSafeUrls(this.paginaChild);
      this.initAlpha(segundaSecao);
  }
  get segundaSecao(){
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

  initAlpha(segundaSecao: SegundaSecao): any {
    if (this.segundaSecao && this.segundaSecao.tituloPrincipalCor) {
      this.corTema = this.addAlpha(this.segundaSecao.tituloPrincipalCor, 0.1);
    }
    return this.corTema;
  }

  addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }

  private carregarSafeUrls(segundaSecao: SegundaSecao) {
    if (segundaSecao && segundaSecao.primeiraImagem) {
      segundaSecao.primeiraImagemSafeUrl = this.getSafeUrl(segundaSecao.primeiraImagem);
    }
    if (segundaSecao && segundaSecao.segundaImagem) {
      segundaSecao.segundaImagemSafeUrl = this.getSafeUrl(segundaSecao.segundaImagem);
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
