import { saveAs } from 'file-saver';
import { MaterialInstitucionalService } from 'src/app/services/material-institucional.service';
import { MaterialApoioService } from 'src/app/services/materialApoio.service';
import { environment } from 'src/environments/environment';
import { Component, OnInit, Input } from '@angular/core';
import { StripTagsPipe } from 'src/app/components/strip-tags/strip-tags.pipe';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { Usuario } from 'src/app/model/usuario';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-item-publicacao',
  templateUrl: './item-publicacao.component.html',
  styleUrls: ['./item-publicacao.component.css']
})
export class ItemPublicacaoComponent implements OnInit {

  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  public estaLogado: boolean = false;

  @Input() publicacao;
  @Input() pagina;

  urlbackend = environment.API_URL;
  constructor(
    private router: Router,
    private materialApoioService: MaterialApoioService,
    private materialInstitucionalService: MaterialInstitucionalService,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private dadosDownloadService: DadosDownloadService,
    private authService: AuthService) { }


  ngOnInit() {
    this.configurarPublicacao(this.publicacao);

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true){
      this.buscarDadosDownloadUsuarioLogado();
    }
    
  }

  public configurarPublicacao(publicacao) {
    if (publicacao) {
      if ( publicacao.idMaterialApoio ) {
        this.materialApoioService.buscarMaterialDeApoioPorId(publicacao.idMaterialApoio ).subscribe(materialApoio => {
          publicacao.materialApoio = materialApoio;
          publicacao.materialApoio.resumo =  (publicacao.materialApoio && publicacao.materialApoio.resumo) ? new StripTagsPipe().transform(publicacao.materialApoio.resumo) : '';
        });
      }
      if ( publicacao.idMaterialInstitucional ) {
        this.materialInstitucionalService.buscarPorPublicacaoId(publicacao.id ).subscribe(materialInstitucional => {
          publicacao.materialInstitucional = materialInstitucional;
          publicacao.materialInstitucional.corpoTexto =  (publicacao.materialInstitucional && publicacao.materialInstitucional.corpoTexto) ? new StripTagsPipe().transform(publicacao.materialInstitucional.corpoTexto) : '';
        });
      }
    }
  }

  downloadMaterialApoio() {
    this.materialApoioService.download(this.publicacao.materialApoio.id).subscribe(res=> {
      const contentType: string = res.headers.get('content-type');
      const nomeArquivoDownload: string = contentType.substring(contentType.indexOf('/') + 1, contentType.length);
      const blob = new Blob([res.body], { type: 'application/octet-stream' });
      saveAs(blob, this.publicacao.materialApoio.arquivoPublicacao.nomeArquivo );
    });

  }

  abrirMaterialApoio() {
    if (this.publicacao.materialApoio) {
      return 'participacao-cidada/material-apoio/detalhe/' + this.publicacao.materialApoio.id + '';
    }
  }


  downloadMaterialInstitucional() {
    this.publicacao.materialInstitucional.arquivos.forEach(arquivo => {
      this.materialInstitucionalService.download(arquivo.id).subscribe(res=> {
        const contentType: string = res.headers.get('content-type');
        const blob = new Blob([res.body], { type: 'application/octet-stream' });
        saveAs(blob, arquivo.nomeArquivo );
      });
    });
  }

  public validacaoDownloadMaterialApoio(){

    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadMaterialApoio();
    } else {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Material de Apoio",
      pagina: this.pagina.link_pagina,
      arquivo: this.publicacao.materialApoio.arquivoPublicacao.nomeArquivo
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.downloadMaterialApoio();
      }
    });
   }
  }

  public validacaoDownloadMaterialInstitucional(){
    let nomeArquivo;
    this.publicacao.materialInstitucional.arquivos.forEach(arquivo => {
      nomeArquivo =  arquivo.nomeArquivo
    })

    if(this.estaLogado) {
      this.dadosDownload.arquivo = nomeArquivo;
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadMaterialInstitucional();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Material Institucional';
      this.dadosDownload.pagina = this.pagina.link_pagina;
      this.dadosDownload.arquivo = nomeArquivo
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadMaterialInstitucional();
    } else {
    
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Material Institucional",
      pagina: this.pagina.link_pagina,
      arquivo: nomeArquivo
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.downloadMaterialInstitucional();
      }
    });
    }
  }

  public getUsuarioLogadoDadosDownloadMaterialApoio(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Material de Apoio';
    this.dadosDownload.pagina = this.pagina.link_pagina; 
    this.dadosDownload.arquivo =  this.publicacao.materialApoio.arquivoPublicacao.nomeArquivo;  
    });
  }
  
  public getUsuarioLogadoDadosDownloadMaterialInstitucional(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Material Institucional';
    this.dadosDownload.pagina = this.pagina.link_pagina; 
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

  public buscarDadosDownloadUsuarioLogado() {
    this.getUsuarioLogadoDadosDownloadMaterialApoio();
    this.getUsuarioLogadoDadosDownloadMaterialInstitucional();
  }

}
