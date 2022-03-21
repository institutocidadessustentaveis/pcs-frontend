import { FiltroBiblioteca } from 'src/app/model/filtroBiblioteca';
import { SetimaSecao } from './../../../model/setima-secao';
import { SextaSecao } from 'src/app/model/sexta-secao';
import { SegundaSecao } from 'src/app/model/segunda-secao';
import { PrimeiraSecao } from 'src/app/model/primeira-secao';
import { TerceiraSecao } from 'src/app/model/terceira-secao';
import { QuartaSecao } from 'src/app/model/quarta-secao';
import { QuintaSecao } from 'src/app/model/quinta-secao';
import { SecaoLateral } from 'src/app/model/secao-lateral';
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
import { Home } from 'src/app/model/home';
import { HomeService } from 'src/app/services/home.service';
import { SeoService } from 'src/app/services/seo-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CidadeService } from 'src/app/services/cidade.service';
import { BibliotecaService } from 'src/app/services/bibliotecaService';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { AuthService } from 'src/app/services/auth.service';
import { DadosDownload } from 'src/app/model/dados-download';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownloadService } from 'src/app/services/dados-download.service';

@Component({
  selector: 'app-pagina-institucional-detalhe',
  templateUrl: './home.component.html',
  styleUrls: [
    './home.component.css',
    './home-side-bar.component.css',
    '../../../../animate.css',
    './home.component.scss'
  ]
})
export class HomeComponent implements OnInit  {
  public displayedColumns: string[] = ["nomeArquivo"];

  public dataSource: MatTableDataSource<ArquivoInstitucional>;

  public loading = false;

  public home: Home = new Home();

  public  paginaBreadCrumb: any;

  public isStatic: boolean = false;

  public fromEixos = false;

  scrollUp: any;

  public todasSecoes: any[] = [];

  public secoes: any[] = [];

  public palavraChave: any;
  public permitirBuscaAvancada: boolean = false;
  public modulos = [];
  public odsCombo: Array<ItemCombo> = [];
  public eixosCombo: Array<ItemCombo> = [];
  public indicadoresCombo: Array<any> = [];
  public paisesCombo: Array<ItemCombo> = [];
  public cidadesCombo: Array<ItemCombo> = [];
  public metasOdsCombo: Array<ItemCombo> = [];
  public provinciaEstadoCombo: Array<ItemCombo> = [];
  public areasInteresseCombo: Array<AreaInteresse> = [];
  public formFiltro: FormGroup;

  public dadosDownload = new DadosDownload;
  public usuario = new Usuario;

  constructor(
    private router: Router,
    private titleService: Title,
    private element: ElementRef,
    private seoService: SeoService,
    private homeService: HomeService,
    private domSanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private bibliotecaService: BibliotecaService,
    private indicadoresService: IndicadoresService,
    private provinciaEstadoService: ProvinciaEstadoService,
    private metaOdsService: ObjetivoDesenvolvimentoSustentavelService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    public dialog: MatDialog,
    private dadosDownloadService: DadosDownloadService
      ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.titleService.setTitle('Home - Cidades Sustentáveis');

    this.modulos = [
      'Eventos',
      'Notícias',
      'Biblioteca',
      'Capacitação',
      'Indicadores',
      'Boas Práticas',
      'Financiamento',
      'Institucional',
      'Participação Cidadã',
      'Contribuições Privadas',
      'Planejamento Integrado',
      'Contribuições Acadêmicas',
      'Plano, Leis e Regulamentações',
    ]

    this.formFiltro = this.formBuilder.group({
      idOds: [null],
      idPais: [null],
      idEixo: [null],
      modulo: [null],
      idCidade: [null],
      idMetasOds: [null],
      idIndicador: [null],
      palavraChave: [null],
      idAreaInteresse: [null],
      idProvinciaEstado: [null],
    });
  }

  ngOnInit() {
    this.buscarPaginaHome();
    this.getParamEixoFromUrl();

    
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

  private async buscarPaginaHome() {
    await this.activatedRoute.params.subscribe(
      async params => {
        const link = params.pagina;
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

                this.todasSecoes = [];

                this.buscarPrimeiraSecaoPorId(this.home.id);

                this.buscarSegundaSecaoPorId(this.home.id);

                this.buscarTerceiraSecaoPorId(this.home.id);

                this.buscarQuartaSecaoPorId(this.home.id);

                this.buscarQuintaSecaoPorId(this.home.id);

                this.buscarSextaSecaoPorId(this.home.id);

                this.buscarSetimaSecaoPorId(this.home.id);

                this.buscarSecaoLateralPorId(this.home.id);

                this.getUsuarioLogadoDadosDownload();

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
      if(this.home.galeriaDeImagens && this.home.galeriaDeImagens.length > 0){
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
        this.home.galeriaDeImagens.forEach(homeImagem => {
          if (homeImagem.exibirBusca) {
            this.carregarCombos();
          }
        });
      }
    });
  }

  private async buscarHomeBarraPorId(id: number) {
      await this.homeService.buscarHomeBarraPorId(id).subscribe(response => {
        this.home.homeBarra = response;
      });
  }

  private async buscarPrimeiraSecaoPorId(id: number) {
      await this.homeService.buscarPrimeiraSecaoPorId(id).subscribe(response => {
        this.home.listaPrimeiraSecao = response as PrimeiraSecao[];
        if (this.home.listaPrimeiraSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.home.listaPrimeiraSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
      });
  }

  private async buscarSegundaSecaoPorId(id: number) {
      await this.homeService.buscarSegundaSecaoPorId(id).subscribe(response => {
        this.home.listaSegundaSecao = response as SegundaSecao[];
        if (this.home.listaSegundaSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.home.listaSegundaSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
      });
  }

  private async buscarTerceiraSecaoPorId(id: number) {
      await this.homeService.buscarTerceiraSecaoPorId(id).subscribe(response => {
        this.home.listaTerceiraSecao = response as TerceiraSecao[];
        if (this.home.listaTerceiraSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.home.listaTerceiraSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
      });
  }

  private async buscarQuartaSecaoPorId(id: number) {
      await this.homeService.buscarQuartaSecaoPorId(id).subscribe(response => {
        this.home.listaQuartaSecao = response as QuartaSecao[];
        if (this.home.listaQuartaSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.home.listaQuartaSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
      });
  }

  private async buscarQuintaSecaoPorId(id: number) {
      await this.homeService.buscarQuintaSecaoPorId(id).subscribe(response => {
        this.home.listaQuintaSecao = response as QuintaSecao[];
        if (this.home.listaQuintaSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.home.listaQuintaSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
      });
  }

  private async buscarSextaSecaoPorId(id: number) {
    await this.homeService.buscarSextaSecaoPorId(id).subscribe(response => {
      this.home.listaSextaSecao = response as SextaSecao[];
      if (this.home.listaSextaSecao) {
        this.todasSecoes = [...this.todasSecoes, ...this.home.listaSextaSecao];
        this.ordernarPorIndiceTodasSecoes();
      }
    });
}

private async buscarSetimaSecaoPorId(id: number) {
  await this.homeService.buscarSetimaSecaoPorId(id).subscribe(response => {
    this.home.listaSetimaSecao = response as SetimaSecao[];
    if (this.home.listaSetimaSecao) {
      this.todasSecoes = [...this.todasSecoes, ...this.home.listaSetimaSecao];
      this.ordernarPorIndiceTodasSecoes();
    }
  });
}

  private async buscarSecaoLateralPorId(id: number) {
      await this.homeService.buscarSecaoLateralPorId(id).subscribe(response => {
        this.home.listaSecaoLateral = response as SecaoLateral[];
      });
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



  public getImagePath(id: number): string {
    if (id == null) {
      return "/";
    }

    return `${environment.API_URL}home/imagem/` + id;
  }

  private ordernarPorIndiceTodasSecoes() {
    this.todasSecoes.sort((n1, n2) => {
      if (n1.indice > n2.indice) {
          return 1;
      }
      if (n1.indice < n2.indice) {
          return -1;
      }
      return 0;
    });
  }

  public buscarBibliotecas() {
    this.router.navigate(['biblioteca'], { queryParams: { palavraChave: this.palavraChave} });
  }
  public buscarBibliotecaAvancada(){
    const filtroBiblioteca: any = {};
    filtroBiblioteca.palavraChave = this.formFiltro.controls.palavraChave.value;
    filtroBiblioteca.idAreaInteresse =  this.formFiltro.controls.idAreaInteresse.value;
    filtroBiblioteca.idEixo =  this.formFiltro.controls.idEixo.value;
    filtroBiblioteca.idIndicador =  this.formFiltro.controls.idIndicador.value;
    filtroBiblioteca.idOds =  this.formFiltro.controls.idOds.value;
    filtroBiblioteca.idMetasOds =  this.formFiltro.controls.idMetasOds.value;
    filtroBiblioteca.idPais =  this.formFiltro.controls.idPais.value;
    filtroBiblioteca.idProvinciaEstado =  this.formFiltro.controls.idProvinciaEstado.value;
    filtroBiblioteca.idCidade =  this.formFiltro.controls.idCidade.value;
    filtroBiblioteca.modulo =  this.formFiltro.controls.modulo.value;

    this.router.navigate(['/biblioteca'], {queryParams: {
      palavraChave: filtroBiblioteca.palavraChave,
      areaInteresse: filtroBiblioteca.idAreaInteresse,
      eixo: filtroBiblioteca.idEixo,
      indicador: filtroBiblioteca.idIndicador,
      ods: filtroBiblioteca.idOds,
      metaOds : filtroBiblioteca.idMetasOds,
      pais: filtroBiblioteca.idPais,
      estado: filtroBiblioteca.idProvinciaEstado,
      cidade: filtroBiblioteca.idCidade,
      modulo: filtroBiblioteca.modulo
    }});
  }

  mostrarBuscaAvancada() {
    this.permitirBuscaAvancada = true;
    const el = document.getElementById('main');
    el.scrollIntoView();
  }

  fecharBuscaAvancada() {
    this.permitirBuscaAvancada = false;
    this.formFiltro.controls.idOds.setValue(null);
    this.formFiltro.controls.idPais.setValue(null);
    this.formFiltro.controls.idEixo.setValue(null);
    this.formFiltro.controls.modulo .setValue(null);
    this.formFiltro.controls.idCidade.setValue(null);
    this.formFiltro.controls.idMetasOds.setValue(null);
    this.formFiltro.controls.idIndicador.setValue(null);
    this.formFiltro.controls.palavraChave.setValue(null);
    this.formFiltro.controls.idAreaInteresse.setValue(null);
    this.formFiltro.controls.idProvinciaEstado.setValue(null);
    const el = document.getElementById('main');
    el.scrollIntoView();
  }

  public onPaisChange(event: any) {
    if (event.value) {
    this.provinciaEstadoService.buscarProvinciaEstadoComboPorPais(event.value).subscribe(res => {
      this.provinciaEstadoCombo = res as ItemCombo[];
    });
  }

    this.provinciaEstadoCombo = [];
    this.cidadesCombo = [];
  }

  onEstadoChange(event: any) {
    if (event.value) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(event.value).subscribe(res => {
        this.cidadesCombo = res as ItemCombo[];
      });
    }

    this.cidadesCombo = [];
  }

  onEixoChange(event: any) {
    if (!event && this.formFiltro.controls.idEixo.value) {
      this.indicadoresService.buscarIndicadoresPorIdEixoItemCombo(this.formFiltro.controls.idEixo.value).subscribe(res => {
        this.indicadoresCombo = res as ItemCombo[];
      });
    }

    if (!event && !this.formFiltro.controls.idEixo.value) {
      this.indicadoresCombo = [];
    }
  }

  onOdsChange(event: any) {
    if (!event && this.formFiltro.controls.idOds.value) {
      this.metaOdsService.buscarMetaOdsPorIdOdsItemCombo(this.formFiltro.controls.idOds.value).subscribe(res => {
        this.metasOdsCombo = res as ItemCombo[];
      });
    }

    if (!event && !this.formFiltro.controls.idOds.value) {
      this.metasOdsCombo = [];
    }
  }
  public carregarCombos() {
    this.bibliotecaService.carregarCombosBiblioteca().subscribe(response => {
      this.paisesCombo = response.listaPaises as ItemCombo[];
      this.areasInteresseCombo = response.listaAreasInteresse as AreaInteresse[];
      this.eixosCombo = response.listaEixos as ItemCombo[];
      this.odsCombo = response.listaOds as ItemCombo[];
    });
  }

  async getUsuarioLogadoDadosDownload(){
    if (await this.authService.isAuthenticated()) {
        this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
        this.usuario = usuario as Usuario;

        this.dadosDownload.email = usuario.email;
        this.dadosDownload.nome = usuario.nome
        this.dadosDownload.organizacao = usuario.organizacao;
        this.dadosDownload.boletim = usuario.recebeEmail;
        this.dadosDownload.usuario = usuario.id;
        this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
        this.dadosDownload.acao = `Download de Arquivo de ${this.home.titulo}`;
        this.dadosDownload.pagina = this.home.titulo;
      });
    } else {
      this.dadosDownload = null;
    }
  }

  public validacaoDownload(arquivo){
    if(this.authService.isAuthenticated()) {
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
        this.urlArquivo(arquivo);
      }
    });
    }
  }

  public urlArquivo(link){
    window.open(`${link}`, '_blank')
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
