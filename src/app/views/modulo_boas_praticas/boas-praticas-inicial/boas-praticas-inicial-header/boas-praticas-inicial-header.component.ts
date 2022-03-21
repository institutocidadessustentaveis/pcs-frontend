import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { Home } from 'src/app/model/home';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { HomeService } from 'src/app/services/home.service';
import { SeoService } from 'src/app/services/seo-service.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-boas-praticas-inicial-header',
  templateUrl: './boas-praticas-inicial-header.component.html',
  styleUrls: ['./boas-praticas-inicial-header.component.css', './home.component.scss']
})
export class BoasPraticasInicialHeaderComponent implements OnInit {
 

  // HOME
  public home: Home = new Home();
  public  paginaBreadCrumb: any;
  public isStatic: boolean = false;
  public loading: boolean;

  private dadosDownload = new DadosDownload;

  @Input() dadosDownloadUser: DadosDownload;

  constructor(
    private homeService: HomeService,
    private route: ActivatedRoute,
    private router: Router,
    private seoService: SeoService,
    private dadosDownloadService: DadosDownloadService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit() {
    this.buscarPaginaHome()
  }

  private async buscarPaginaHome() {
    await this.route.params.subscribe(
      async params => {
        const link = 'boas-praticas';
        this.paginaBreadCrumb = link;
        if (this.paginaBreadCrumb != null && this.paginaBreadCrumb != '') {
          this.isStatic = true;
        } else {
          this.isStatic = false;
        }
        if (link) {
          this.loading = true;
          await this.homeService
            .buscarIdsPaginaHomePorLink(link)
            .subscribe(
              async response => {
                this.home = response as Home;

                if (this.home && this.home.id) {
                  this.buscarListaImagensGaleriaPorId(this.home.id);
                }

                if (this.home.homeBarra && this.home.homeBarra.id) {
                  this.buscarHomeBarraPorId(this.home.homeBarra.id);
                }

                this.loading = false;
              },
              error => {
                this.router.navigate(["/"]);
              }
            );
        }
        this.loading = false;
      },
      error => {
        this.router.navigate(["/"]);
      }
    );
  }
  private async buscarListaImagensGaleriaPorId(id: number) {
    await this.homeService.buscarTodasSemConteudoPorIdHome(id).subscribe(response => {
      this.home.galeriaDeImagens = response;
      const config = {
        title: this.home.titulo,
        description: `${this.home.galeriaDeImagens[0].titulo} - ${this.home.galeriaDeImagens[0].subtitulo}`,
        twitterImage: `${environment.APP_URL}home/imagem/` + this.home.galeriaDeImagens[0].id,
        image:  `${environment.APP_URL}home/imagem/` + this.home.galeriaDeImagens[0].id,
        slug: '',
        site: 'Cidades Sustentáveis' ,
        url: `${environment.APP_URL}inicial/${this.home.link_pagina}`,
      };
      this.seoService.generateTags(config);
    });
  }

  private async buscarHomeBarraPorId(id: number) {
      await this.homeService.buscarHomeBarraPorId(id).subscribe(response => {
        this.home.homeBarra = response;
      });
  }


  public verificaLinkAtivo(itemLink: string): string {
    let cor: string = "";
    this.route.params.subscribe(
      async params => {
        if (itemLink === params.pagina) {
          cor = "bold";
        }
      },
      error => {}
    );
    return cor;
  }



  public getImagePath(id: number): string {
    if (id == null) {
      return "/";
    }

    return `${environment.API_URL}home/imagem/` + id;
  }

  public urlArquivo(link){
    window.open(`${link}`, '_blank')
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
      this.urlArquivo(arquivo);
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = `Download de Arquivo de ${this.home.titulo}`;
      this.dadosDownload.pagina = this.home.titulo;
      this.dadosDownload.arquivo = arquivo;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.urlArquivo(arquivo);
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: `Download de Arquivo de ${this.home.titulo}`,
      pagina: this.home.titulo,
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