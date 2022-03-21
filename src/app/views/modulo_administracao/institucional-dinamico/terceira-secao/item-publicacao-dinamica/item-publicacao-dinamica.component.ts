import { saveAs } from 'file-saver';
import { MaterialInstitucionalService } from 'src/app/services/material-institucional.service';
import { MaterialApoioService } from 'src/app/services/materialApoio.service';
import { environment } from 'src/environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { StripTagsPipe } from 'src/app/components/strip-tags/strip-tags.pipe';
import { Router } from '@angular/router';
import { DadosDownload } from 'src/app/model/dados-download';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownloadService } from 'src/app/services/dados-download.service';

@Component({
  selector: 'app-item-publicacao-dinamica',
  templateUrl: './item-publicacao-dinamica.component.html',
  styleUrls: ['./item-publicacao-dinamica.component.css']
})
export class ItemPublicacaoDinamicaComponent implements OnInit {

  @Input() dadosDownloadUser;
  @Input() tituloPagina;
  @Input() publicacao;
  public urlbackend = environment.API_URL;

  private dadosDownload = new DadosDownload;

  constructor(private dadosDownloadService: DadosDownloadService,
              public dialog: MatDialog) { }

  ngOnInit() {
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
      
      this.dadosDownload.acao = `Download de Arquivo de ${this.tituloPagina}`;
      this.dadosDownload.pagina = this.tituloPagina;
      this.dadosDownload.arquivo = arquivo;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.urlArquivo(arquivo);
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
