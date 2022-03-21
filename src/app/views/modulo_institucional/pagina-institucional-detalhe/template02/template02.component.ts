import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { InstitucionalInterno } from 'src/app/model/institucional-interno';
import { ActivatedRoute, Router } from '@angular/router';
import { InstitucionalInternoService } from 'src/app/services/institucional-interno.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { DadosDownload } from 'src/app/model/dados-download';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';

@Component({
  selector: 'app-template02',
  templateUrl: './template02.component.html',
  styleUrls: ['./template02.component.css']
})

export class Template02Component implements OnInit {

  paginaChild: InstitucionalInterno;

  private dadosDownload = new DadosDownload;

  @Input() tituloPagina;
  @Input() dadosDownloadUser: DadosDownload;
  @Input()
  set pagina(pagina: InstitucionalInterno ){
      this.paginaChild = pagina;
      this.carregarSafeUrls(this.paginaChild);
  }
  get pagina(){
      return this.paginaChild;
  }

  constructor(private domSanitizer: DomSanitizer,
    private dadosDownloadService: DadosDownloadService,
    public dialog: MatDialog) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {
  }


  private carregarSafeUrls(pagina: InstitucionalInterno) {
    
    if (pagina.template02 && pagina.template02.imagemPrimeiraSecao) {
      pagina.template02.imagemPrimeiraSecaoSafeUrl = this.getSafeUrl(pagina.template02.imagemPrimeiraSecao);
    }

    if (pagina.template02 && pagina.template02.imagemTerceiraSecao) {
      pagina.template02.imagemTerceiraSecaoSafeUrl = this.getSafeUrl(pagina.template02.imagemTerceiraSecao);
    }
  }

  public botaoSecao4IrPara() {
    window.open(this.paginaChild.template02.linkBotao01, "_blank");
  }

  public getImagePath(id: number): string {
    if(id == null) {
      return '/';
    }

    return `${environment.API_URL}institucional/imagem/` + id;
  }

  verificaTipoLink(){
    let link = this.paginaChild.template02.linkBotao01;
    if(link.includes('.pdf' || '.doc' || '.docx' || '.xls' || '.xlsx' || '.csv')){
      this.validacaoDownload(link)
    } else {
      this.botaoSecao4IrPara();
    }
  }

  verificaDadosDownloadUser(){
    if(this.dadosDownloadUser == null || this.dadosDownloadUser == undefined || Object.keys(this.dadosDownloadUser).length == 0){
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
      this.botaoSecao4IrPara();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = `Download de Arquivo de ${this.tituloPagina}`;
      this.dadosDownload.pagina = this.tituloPagina;
      this.dadosDownload.arquivo = arquivo;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.botaoSecao4IrPara();
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
        this.botaoSecao4IrPara();
      }
    });
    }
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

}
