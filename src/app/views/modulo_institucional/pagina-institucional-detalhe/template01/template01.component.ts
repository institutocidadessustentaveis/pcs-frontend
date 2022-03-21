import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { InstitucionalInterno } from 'src/app/model/institucional-interno';
import { DadosDownloadService } from 'src/app/services/dados-download.service';

@Component({
  selector: 'app-template01',
  templateUrl: './template01.component.html',
  styleUrls: ['./template01.component.css']
})

export class Template01Component implements OnInit {

  private dadosDownload = new DadosDownload;

  @Input() tituloPagina;
  @Input() dadosDownloadUser: DadosDownload;
  @Input() pagina: InstitucionalInterno;

  constructor(private dadosDownloadService: DadosDownloadService,
              public dialog: MatDialog) { }

  ngOnInit() {
  }

  public btnIrPara(url: string){
    window.open(url, "_blank");
  }

  verificaTipoLink(link: string){
    if(link.includes('.pdf' || '.doc' || '.docx' || '.xls' || '.xlsx' || '.csv')){
      this.validacaoDownload(link)
    } else {
      this.btnIrPara(link)
    }
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
