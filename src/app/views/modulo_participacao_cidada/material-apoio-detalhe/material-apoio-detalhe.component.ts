import { DadosDownload } from 'src/app/model/dados-download';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { MaterialApoioService } from 'src/app/services/materialApoio.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MaterialApoioDetalhado } from 'src/app/model/MaterialApoioDetalhado';
import { environment } from 'src/environments/environment';
import { Title, Meta } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { SeoService } from 'src/app/services/seo-service.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { Usuario } from 'src/app/model/usuario';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-material-apoio-detalhe',
  templateUrl: './material-apoio-detalhe.component.html',
  styleUrls: ['./material-apoio-detalhe.component.css']
})
export class MaterialApoioDetalheComponent implements OnInit {

  public id: number;

  public material = new MaterialApoioDetalhado();

  loading = true;

  buscarMaterialPorId = false;

  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  public estaLogado: boolean = false;

  constructor(
    private materialService: MaterialApoioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private titleService: Title,
    private dialog: MatDialog,
    private usuarioService: UsuarioService,
    private dadosDownloadService: DadosDownloadService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.buscarMaterialPorId = /^\d+$/.test(params.id);

      if (this.buscarMaterialPorId) {
        this.id = params.id;
      }
    });

    if (this.id) {
      this.loading = true;
      this.carregar();
    }

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true) {
      this.getUsuarioLogadoDadosDownloadAtributos();
    }
    
  }

  carregar() {
    this.materialService.buscarMaterialDeApoioDetalhadoPorId(this.id).subscribe(response => {
      this.material = response as MaterialApoioDetalhado;
      this.titleService.setTitle(this.material.titulo); 
      
      const config = {
        title: this.material.titulo,
        description: this.material.subtitulo,
        twitterImage: `${environment.APP_URL}material-apoio/imagem/` + this.material.id,
        image:  `${environment.APP_URL}material-apoio/imagem/` + this.material.id,
        slug: '',
        site: 'Cidades Sustentáveis' ,
        url: `${environment.APP_URL}material-apoio/detalhe/${this.material.id}`
      };
      this.seoService.generateTags(config);

      this.loading = false;
    });
  }

  public getImagePath(id: number): string {
    if (id == null) {
      return "/";
    }

    return `${environment.API_URL}materialapoio/imagem/` + id;
  }

  downloadMaterialApoio() {
    this.materialService.download(String(this.id)).subscribe(res => {
      const contentType: string = res.headers.get('content-type');
      const nomeArquivoDownload: string = contentType.substring(contentType.indexOf('/') + 1, contentType.length);
      const blob = new Blob([res.body], { type: 'application/octet-stream' });
      saveAs(blob, this.material.arquivoPublicacao.nomeArquivo);
    });
  }

  public validacaoDownloadMaterialApoio() {

    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadMaterialApoio(); 
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Material de Apoio Detalhe';
      this.dadosDownload.pagina = 'Material de Apoio Detalhe';
      this.dadosDownload.arquivo =  this.material.titulo;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadMaterialApoio();
    } else {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Material de Apoio Detalhe",
      pagina: "Material de Apoio Detalhe",
      arquivo: this.material.titulo
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

  public getUsuarioLogadoDadosDownloadAtributos(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Material de Apoio Detalhe';
    this.dadosDownload.pagina = 'Material de Apoio Detalhe'; 
    this.dadosDownload.arquivo = this.material.titulo ;
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

}
