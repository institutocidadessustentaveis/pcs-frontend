import { MaterialApoio } from './../../../model/MaterialApoio';
import { Component, OnInit, Input } from '@angular/core';
import { saveAs } from 'file-saver';
import { MaterialApoioService } from 'src/app/services/materialApoio.service';
import { environment } from 'src/environments/environment';
import { StripTagsPipe } from 'src/app/components/strip-tags/strip-tags.pipe';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { Usuario } from 'src/app/model/usuario';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-item-material-apoio',
  templateUrl: './item-material-apoio.component.html',
  styleUrls: ['./item-material-apoio.component.css']
})
export class ItemMaterialApoioComponent implements OnInit {

  @Input() materialApoioId;

  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  public estaLogado: boolean = false

  materialApoio: MaterialApoio;
  urlbackend = environment.API_URL;
  constructor(
    private materialApoioService: MaterialApoioService,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private dadosDownloadService: DadosDownloadService,
    private authService: AuthService) { }


  ngOnInit() {
    this.buscarMaterialDeApoio(this.materialApoioId);

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true) {
      this.getUsuarioLogadoDadosDownload();
    }
    
  }

  public buscarMaterialDeApoio(materialApoioId) {
        this.materialApoioService.buscarMaterialDeApoioPorId(materialApoioId).subscribe(materialApoio => {
          this.materialApoio = materialApoio;
          this.materialApoio.resumo = (this.materialApoio && this.materialApoio.resumo) ? new StripTagsPipe().transform(this.materialApoio.resumo) : '';
        });
  }

  public gerarLinkNoticia(materialDeApoioId: number) {
    return 'participacao-cidada/material-apoio/detalhe/' + materialDeApoioId + '';
  }

  downloadMaterialApoio() {
    this.materialApoioService.download(this.materialApoioId).subscribe(res => {
      const contentType: string = res.headers.get('content-type');
      const nomeArquivoDownload: string = contentType.substring(contentType.indexOf('/') + 1, contentType.length);
      const blob = new Blob([res.body], { type: 'application/octet-stream' });
      saveAs(blob, this.materialApoio.arquivoPublicacao.nomeArquivo );
    });

  }

  public validacaoDownloadMaterialApoio(){

    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadMaterialApoio();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Material de Apoio';
      this.dadosDownload.pagina = 'Material de Apoio';
      this.dadosDownload.arquivo = this.materialApoio.titulo;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadMaterialApoio();
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Material de Apoio",
      pagina: "Material de Apoio",
      arquivo: this.materialApoio.titulo
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

  public getUsuarioLogadoDadosDownload(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Material de Apoio';
    this.dadosDownload.pagina = 'Material de Apoio';  
    this.dadosDownload.arquivo = this.materialApoio.titulo;
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

}
