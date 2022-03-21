import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { Component, OnInit, ElementRef } from '@angular/core';
import { InstitucionalInterno } from 'src/app/model/institucional-interno';
import { ActivatedRoute, Router } from '@angular/router';
import { InstitucionalInternoService } from 'src/app/services/institucional-interno.service';
import { MatDialog, MatDialogConfig, MatTableDataSource } from '@angular/material';
import { ArquivoInstitucional } from 'src/app/model/arquivo-institucional';
import { saveAs } from 'file-saver';
import { SafeUrl, DomSanitizer, Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/services/seo-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DadosDownload } from 'src/app/model/dados-download';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';

@Component({
  selector: "app-pagina-institucional-detalhe",
  templateUrl: "./pagina-institucional-detalhe.component.html",
  styleUrls: [
    "./pagina-institucional-detalhe.component.scss",
    "../../../../animate.css"
  ]
})
export class PaginaInstitucionalDetalheComponent implements OnInit  {
  public displayedColumns: string[] = ["nomeArquivo"];

  public dataSource: MatTableDataSource<ArquivoInstitucional>;

  public loading = false;

  public pagina: InstitucionalInterno = new InstitucionalInterno();

  public  paginaBreadCrumb: any;

  public isStatic: boolean = false;

  public subMenuInstitucional: InstitucionalInterno[] = [];

  public fromEixos = false;

  public dadosDownload = new DadosDownload;

  scrollUp: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private element: ElementRef,
    private institucionalInternoService: InstitucionalInternoService,
    private domSanitizer: DomSanitizer,
    private seoService: SeoService,
    private titleService: Title,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private dadosDownloadService: DadosDownloadService,
    private dialog: MatDialog
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.buscarPaginaInstitucional();
    this.getParamEixoFromUrl();
  }

  public textoComVideoResponsivo(texto){
    let str = `width="640" height="360"`
    let strReplaced = texto.replace(str, 'width="100%" height="360"')
    return strReplaced
  }

  public transformarTextosComVideosEmResponsivo(pagina: InstitucionalInterno) {    

    pagina.subtitulo != null ? pagina.subtitulo = this.textoComVideoResponsivo(pagina.subtitulo) : ``;
    
    if (pagina.template01 != null) {
      pagina.template01.txtSegundaSecao != null ?  pagina.template01.txtSegundaSecao = this.textoComVideoResponsivo(pagina.template01.txtSegundaSecao) : ``;
      pagina.template01.textoPrimeiraSecao != null ?  pagina.template01.textoPrimeiraSecao = this.textoComVideoResponsivo(pagina.template01.textoPrimeiraSecao) : ``;
    }

    if (pagina.template02 != null) {
      pagina.template02.textoPrimeiraSecao != null ? pagina.template02.textoPrimeiraSecao = this.textoComVideoResponsivo(pagina.template02.textoPrimeiraSecao) : ``;
      pagina.template02.txtSegundaSecao != null ? pagina.template02.txtSegundaSecao = this.textoComVideoResponsivo(pagina.template02.txtSegundaSecao) : ``;
      pagina.template02.txtTerceiraSecao != null ? pagina.template02.txtTerceiraSecao = this.textoComVideoResponsivo(pagina.template02.txtTerceiraSecao) : ``;
      pagina.template02.txtQuartaSecao != null ? pagina.template02.txtQuartaSecao = this.textoComVideoResponsivo(pagina.template02.txtQuartaSecao) : `;`  
    }
  }

  private getParamEixoFromUrl(){
    this.activatedRoute.queryParams.subscribe(params => {
      const eixos = params['eixos'];
      if (eixos) {
        this.fromEixos = eixos;
      } else {
        this.fromEixos = false;
      }
  });
  }

  private async buscarPaginaInstitucional() {
    let link = '';
        let saberQualRotaInicialInstitucional = this.router.url.substr(1, 13);
        let saberQualRotaInicialInstitucionalPagina = this.router.url.substr(1, 20);

        if(saberQualRotaInicialInstitucional === 'institucional' && saberQualRotaInicialInstitucionalPagina != 'institucional/pagina'){
          link = this.router.url.substr(15);
        } else if(saberQualRotaInicialInstitucionalPagina === 'institucional/pagina'){
          link = this.router.url.substr(22);
        } else {
          link = this.router.url.substr(8);
        }
        this.paginaBreadCrumb = link;
        if (this.paginaBreadCrumb != null && this.paginaBreadCrumb != '') {
          this.isStatic = true;
        } else {
          this.isStatic = false;
        }
        if (link) {
          this.loading = true;
          await this.institucionalInternoService
            .buscarPaginaInstitucionalPorLink(link)
            .subscribe(
              async response => {
                this.transformarTextosComVideosEmResponsivo(response)
                this.pagina = response as InstitucionalInterno;
                this.titleService.setTitle(`${this.pagina.titulo} - Cidades Sustentáveis`);
                const config = {
                  title: this.pagina.titulo,
                  description: this.pagina.subtitulo,
                  twitterImage: `${environment.APP_URL}institucional/imagem/` + this.pagina.id,
                  image:  `${environment.APP_URL}institucional/imagem/` + this.pagina.id,
                  slug: '',
                  site: 'Cidades Sustentáveis' ,
                  url: `${environment.APP_URL}institucional/pagina/${link}`
                };
                this.seoService.generateTags(config);
                this.carregarSafeUrls(this.pagina);
                this.loading = false;

                this.getUsuarioLogadoDadosDownload();
              },
              error => {
                this.router.navigate(["/institucional"]);
              }
            );
        }
        this.loading = false;
  }

  private carregarSafeUrls(pagina: InstitucionalInterno) {
    if (pagina.imagemPrincipal) {
      this.pagina.imagemPrincipalSafeUrl = this.getSafeUrl(
        pagina.imagemPrincipal
      );
    }
  }

  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl(
      "data:image/png;base64, " + url
    );
  }

  private carregarSubMenuInstitucional() {
    this.loading = true;
    this.institucionalInternoService.buscarInstitucional().subscribe(
      response => {
        this.subMenuInstitucional = response as Array<InstitucionalInterno>;
      },
      error => {
        this.router.navigate(["/institucional"]);
      }
    );
    this.loading = false;
  }

  public verificaLinkAtivo(itemLink: string): string {
    let cor: string = "";
    this.activatedRoute.params.subscribe(
      async params => {
        if (itemLink === params.pagina) {
          cor = "bold";
        }
      },
      error => {}
    );
    return cor;
  }

  public baixarArquivoInstitucional(idArquivo: number) {
    this.institucionalInternoService
      .buscarArquivoInstitucionalPorId(idArquivo)
      .subscribe(res => {
        saveAs(this.b64toBlob(res.arquivo), res.nomeArquivo);
      });
  }

  private b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  public botaoSubtituloIrPara() {
    this.pagina.linkBotaoSubtitulo.includes('http') ? window.open(this.pagina.linkBotaoSubtitulo, "_blank") : window.open('//' + this.pagina.linkBotaoSubtitulo, "_blank");
  }

  public getImagePath(id: number): string {
    if (id == null) {
      return "/";
    }

    return `${environment.API_URL}institucional/imagem/` + id;
  }

  async getUsuarioLogadoDadosDownload(){
    if (await this.authService.isAuthenticated()) {
        this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
        
        this.dadosDownload.email = usuario.email;
        this.dadosDownload.nome = usuario.nome
        this.dadosDownload.organizacao = usuario.organizacao;
        this.dadosDownload.boletim = usuario.recebeEmail;
        this.dadosDownload.usuario = usuario.id;
        this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
        this.dadosDownload.acao = `Download de Arquivo de ${this.pagina.titulo}`;
        this.dadosDownload.pagina = this.pagina.titulo;
      });
    } else {
      this.dadosDownload = null;
    }
  }

  verificaTipoLink(){
    let link = this.pagina.linkBotaoSubtitulo;
    if(link.includes('.pdf' || '.doc' || '.docx' || '.xls' || '.xlsx' || '.csv')){
      this.validacaoDownload(link)
    } else {
      this.botaoSubtituloIrPara();
    }
  }

  public validacaoDownload(arquivo){
    if(this.authService.isAuthenticated()) {
      this.dadosDownload.arquivo = arquivo;
      this.cadastrarDadosDownload(this.dadosDownload);
      this.botaoSubtituloIrPara();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = `Download de Arquivo de ${this.pagina.titulo}`;
      this.dadosDownload.pagina = this.pagina.titulo;
      this.dadosDownload.arquivo = arquivo;
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.botaoSubtituloIrPara();
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: `Download de Arquivo de ${this.pagina.titulo}`,
      pagina: this.pagina.titulo,
      arquivo: arquivo
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.botaoSubtituloIrPara();
      }
    });
    }
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

}
