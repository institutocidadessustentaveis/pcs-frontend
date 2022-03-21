import { PrimeiraSecao } from './../../../../model/primeira-secao';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Home } from 'src/app/model/home';
import { InstitucionalDinamicoSecao1 } from 'src/app/model/institucional-dinamico-secao1';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownload } from 'src/app/model/dados-download';
import { DadosDownloadService } from 'src/app/services/dados-download.service';

@Component({
  selector: 'app-primeira-secao',
  templateUrl: './primeira-secao.component.html',
  styleUrls: ['./primeira-secao.component.css']
})

export class PrimeiraSecaoComponent implements OnInit {

  paginaChild: InstitucionalDinamicoSecao1;

  btnLenght: any;

  private dadosDownload = new DadosDownload;

  @Input() tituloPagina;
  @Input() dadosDownloadUser: DadosDownload;
  @Input()
  set primeiraSecao(primeiraSecao: InstitucionalDinamicoSecao1 ) {
      this.paginaChild = primeiraSecao;
  }
  get primeiraSecao(){
      return this.paginaChild;
  }

  constructor(private domSanitizer: DomSanitizer,
              private dadosDownloadService: DadosDownloadService,
              public dialog: MatDialog) { }


  ngOnInit() {
    this.btnCount();
  }

  public btnIrPara(url: string){
    window.open(url, "_blank");
  }

  btnCount(){
    this.btnLenght = [
      this.paginaChild.txtBotao01,
      this.paginaChild.txtBotao02,
      this.paginaChild.txtBotao03,
      this.paginaChild.txtBotao04
    ].filter(function (el) {
      return el != null && el != "";
    }).length;
  }

  verificaTipoLink(link: string){
    if(link.includes('.pdf' || '.doc' || '.docx' || '.xls' || '.xlsx' || '.csv')){
      this.validacaoDownload(link)
    } else {
      this.btnIrPara(link)
    }
  }

  verificaDadosDownloadUser(){
    if(this.dadosDownloadUser === null || this.dadosDownloadUser === undefined || Object.keys(this.dadosDownloadUser).length == 0){
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
      this.btnIrPara(arquivo)
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = `Download de Arquivo de ${this.tituloPagina}`;
      this.dadosDownload.pagina = this.tituloPagina;
      this.dadosDownload.arquivo = arquivo;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.btnIrPara(arquivo)
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: `Download de Arquivo de ${this.tituloPagina}`,
      pagina: this.tituloPagina,
      arquivo: arquivo
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.btnIrPara(arquivo)
      }
    });
    }
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }
}
