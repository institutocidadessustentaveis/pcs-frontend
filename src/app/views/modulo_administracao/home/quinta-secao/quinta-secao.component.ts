import { QuintaSecao } from './../../../../model/quinta-secao';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';
import { DadosDownload } from 'src/app/model/dados-download';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-quinta-secao',
  templateUrl: './quinta-secao.component.html',
  styleUrls: ['./quinta-secao.component.css']
})

export class QuintaSecaoComponent implements OnInit {

  paginaChild: QuintaSecao;

  private dadosDownload = new DadosDownload;
  public usuario = new Usuario;

  @Input()
  set quintaSecao(quintaSecao: QuintaSecao) {
      this.paginaChild = quintaSecao;
  }
  get quintaSecao() {
      return this.paginaChild;
  }

  @Input() tituloHome;
  @Input() dadosDownloadUser: DadosDownload;

  constructor(private domSanitizer: DomSanitizer,
    private dadosDownloadService: DadosDownloadService,
    public dialog: MatDialog) { }


  ngOnInit() {

  }

  public btnIrPara(url: string){
    window.open(url, "_blank");
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
