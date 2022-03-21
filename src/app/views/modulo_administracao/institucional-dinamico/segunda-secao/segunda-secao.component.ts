import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { InstitucionalDinamicoSecao2 } from 'src/app/model/institucional-dinamico-secao2';
import { DadosDownload } from 'src/app/model/dados-download';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownloadService } from 'src/app/services/dados-download.service';

@Component({
  selector: 'app-segunda-secao',
  templateUrl: './segunda-secao.component.html',
  styleUrls: ['./segunda-secao.component.css']
})

export class SegundaSecaoComponent implements OnInit {

  paginaChild: InstitucionalDinamicoSecao2;

  private dadosDownload = new DadosDownload;

  @Input()
  set segundaSecao(pagina: InstitucionalDinamicoSecao2 ){
      this.paginaChild = pagina;
  }
  get segundaSecao(){
      return this.paginaChild;
  }

  @Input() dadosDownloadUser: DadosDownload;
  @Input() tituloPagina;

  public disableLink = false;
  
  constructor(private domSanitizer: DomSanitizer , 
    private dadosDownloadService: DadosDownloadService,
    public dialog: MatDialog) { }


  ngOnInit() {
  }

  
  public getImagePath(id: number): string {
    if (id == null) {
      return "/";
    }

    return `${environment.API_URL}institucionalDinamico/imagem/` + id;
  }

  public urlArquivo(link){
    window.open(`${link}`, '_blank')
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
