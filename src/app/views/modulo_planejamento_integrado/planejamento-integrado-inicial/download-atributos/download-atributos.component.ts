import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Component, OnInit, Input } from '@angular/core';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { saveAs } from 'file-saver';
import { DadosDownloadComponent } from '../../../../components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-download-atributos',
  templateUrl: './download-atributos.component.html',
  styleUrls: ['./download-atributos.component.css']
})
export class DownloadAtributosComponent implements OnInit {

  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  private estaLogado: boolean = false;

  constructor(private service: ShapeFileService,
              public dialog: MatDialog,
              private usuarioService: UsuarioService,
              private dadosDownloadService: DadosDownloadService,
              private authService: AuthService
              ) { }

  @Input() idShape;
  @Input() nomeShape;

  ngOnInit() {
    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true) {
      this.getUsuarioLogadoDadosDownloadAtributos();
    }
    
  }

  download() {
    this.service.downloadAtributos(this.idShape).subscribe(res => {
      const blob = new Blob([res], { type: "application/octet-stream" });
      saveAs(blob, "Tabela de Atributos.xlsx");
    });
  }

  public validacaoDownloadTabelaAtributos(){
   
    if(this.estaLogado) {
      this.dadosDownload.arquivo = this.nomeShape;
      this.cadastrarDadosDownload(this.dadosDownload);
      this.download();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Tabela de Atributos';
      this.dadosDownload.pagina = 'Catálogo de Camadas';
      this.dadosDownload.arquivo = this.nomeShape
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.download();
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Tabela de Atributos",
      pagina: "Catálogo de Camadas",
      arquivo: this.nomeShape
    }

    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);
    
    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
      
        this.download();
       }
    });
   }
  }

  public getUsuarioLogadoDadosDownloadAtributos(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Tabela de Atributos';
    this.dadosDownload.pagina = 'Catálogo de Camadas';    
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

 


}
