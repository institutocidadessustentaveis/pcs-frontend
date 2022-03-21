import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { SextaSecao } from 'src/app/model/sexta-secao';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sexta-secao',
  templateUrl: './sexta-secao.component.html',
  styleUrls: ['./sexta-secao.component.css']
})

export class SextaSecaoComponent implements OnInit {

  paginaChild: SextaSecao;

  public corTema: any;

  private dadosDownload = new DadosDownload;
  public usuario = new Usuario;

  @Input()
  set sextaSecao(sextaSecao: SextaSecao ) {
      this.paginaChild = sextaSecao;
      this.carregarSafeUrls(this.paginaChild);
  }
  get sextaSecao() {
      return this.paginaChild;
  }

  @Input() tituloHome;
  @Input() dadosDownloadUser: DadosDownload;

  constructor(private domSanitizer: DomSanitizer,
    private dadosDownloadService: DadosDownloadService,
    public dialog: MatDialog) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {
    if (this.sextaSecao && this.sextaSecao.tituloPrincipalCor) {
      this.corTema = this.addAlpha(this.sextaSecao.tituloPrincipalCor, 0.1);
    }

  }


  addAlpha(color: string, opacity: number): string {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

  private carregarSafeUrls(sextaSecao: SextaSecao) {
    if (sextaSecao && sextaSecao.primeiraImagem) {
      sextaSecao.primeiraImagemSafeUrl = this.getSafeUrl(sextaSecao.primeiraImagem);
    }
    if (sextaSecao && sextaSecao.segundaImagem) {
      sextaSecao.segundaImagemSafeUrl = this.getSafeUrl(sextaSecao.segundaImagem);
    }
  }

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
