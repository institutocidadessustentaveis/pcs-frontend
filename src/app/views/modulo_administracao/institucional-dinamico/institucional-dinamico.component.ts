import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { ArquivoInstitucional } from 'src/app/model/arquivo-institucional';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { InstitucionalDinamicoService } from 'src/app/services/institucional-dinamico.service';
import { InstitucionalDinamico } from 'src/app/model/institucional-dinamico';
import { InstitucionalDinamicoSecao1 } from 'src/app/model/institucional-dinamico-secao1';
import { InstitucionalDinamicoSecao2 } from 'src/app/model/institucional-dinamico-secao2';
import { InstitucionalDinamicoSecao4 } from 'src/app/model/institucional-dinamico-secao4';
import { InstitucionalDinamicoSecao3 } from 'src/app/model/institucional-dinamico-secao3';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DadosDownload } from 'src/app/model/dados-download';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-institucional-dinamico',
  templateUrl: './institucional-dinamico.component.html',
  styleUrls: [
    './institucional-dinamico.component.css',
    './institucional-dinamico-side-bar.component.css',
    '../../../../animate.css',
    './institucional-dinamico.component.scss'
  ]
})
export class InstitucionalDinamicoComponent implements OnInit  {
  public displayedColumns: string[] = ["nomeArquivo"];

  public dataSource: MatTableDataSource<ArquivoInstitucional>;

  public loading = false;

  public institucionalDinamico: InstitucionalDinamico = new InstitucionalDinamico();

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

  constructor(
    private router: Router,
    private titleService: Title,
    private element: ElementRef,
    private institucionalDinamicoService: InstitucionalDinamicoService,
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,

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
    this.buscarInstitucionalDinamico();
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

  private async buscarInstitucionalDinamico() {
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
          await this.institucionalDinamicoService
            .buscarIdsInstitucionalDinamicoPorLink(link)
            .subscribe(
              async response => {
                this.institucionalDinamico = response as InstitucionalDinamico;
                this.titleService.setTitle(`${this.institucionalDinamico.txtTitulo != null ? this.institucionalDinamico.txtTitulo: "Home"} - Cidades Sustentáveis`);
          
                this.todasSecoes = [];

                this.buscarInstitucionalDinamicoSecao1PorId(this.institucionalDinamico.id);
                this.buscarInstitucionalDinamicoSecao2PorId(this.institucionalDinamico.id);
                this.buscarInstitucionalDinamicoSecao3PorId(this.institucionalDinamico.id);
                this.buscarInstitucionalDinamicoSecao4PorId(this.institucionalDinamico.id);

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

  private async buscarInstitucionalDinamicoSecao1PorId(id: number) {
      await this.institucionalDinamicoService.buscarInstitucionalDinamicoSecao01PorId(id).subscribe(response => {
        this.institucionalDinamico.listaSecao1 = response as InstitucionalDinamicoSecao1[];
        if (this.institucionalDinamico.listaSecao1) {
          this.todasSecoes = [...this.todasSecoes, ...this.institucionalDinamico.listaSecao1];
          this.ordernarPorIndiceTodasSecoes();
          
        }
      });
  }

  private async buscarInstitucionalDinamicoSecao2PorId(id: number) {
    await this.institucionalDinamicoService.buscarInstitucionalDinamicoSecao02PorId(id).subscribe(response => {
      this.institucionalDinamico.listaSecao2 = response as InstitucionalDinamicoSecao2[];
      if (this.institucionalDinamico.listaSecao2) {
        this.todasSecoes = [...this.todasSecoes, ...this.institucionalDinamico.listaSecao2];
        this.ordernarPorIndiceTodasSecoes();
      }
    });
  }

  private async buscarInstitucionalDinamicoSecao3PorId(id: number) {
    await this.institucionalDinamicoService.buscarInstitucionalDinamicoSecao03PorId(id).subscribe(response => {
      this.institucionalDinamico.listaSecao3 = response as InstitucionalDinamicoSecao3[];
      if (this.institucionalDinamico.listaSecao3) {
        this.todasSecoes = [...this.todasSecoes, ...this.institucionalDinamico.listaSecao3];
        this.ordernarPorIndiceTodasSecoes();
      }
    });
  }

  private async buscarInstitucionalDinamicoSecao4PorId(id: number) {
    await this.institucionalDinamicoService.buscarInstitucionalDinamicoSecao04PorId(id).subscribe(response => {
      this.institucionalDinamico.listaSecao4 = response as InstitucionalDinamicoSecao4[];
      if (this.institucionalDinamico.listaSecao4) {
        this.todasSecoes = [...this.todasSecoes, ...this.institucionalDinamico.listaSecao4];
        this.ordernarPorIndiceTodasSecoes();
      }
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

    return `${environment.API_URL}institucionalDinamico/imagem/` + id;
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

  public botaoSubtituloIrPara() {
    this.institucionalDinamico.linkBotaoSubtitulo.includes('http') ? window.open(this.institucionalDinamico.linkBotaoSubtitulo, "_blank") : window.open('//' + this.institucionalDinamico.linkBotaoSubtitulo, "_blank");
  }

 
  async getUsuarioLogadoDadosDownload(){
    if (await this.authService.isAuthenticated()) {
        this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
        
        this.dadosDownload.email = usuario.email;
        this.dadosDownload.nome = usuario.nome
        this.dadosDownload.organizacao = usuario.organizacao;
        this.dadosDownload.boletim = usuario.recebeEmail;
        this.dadosDownload.usuario = usuario.id;
        this.dadosDownload.nomeCidade = usuario.cidadeInteresse;
        this.dadosDownload.acao = `Download de Arquivo de ${this.institucionalDinamico.link_pagina}`;
        this.dadosDownload.pagina = this.institucionalDinamico.titulo ? this.institucionalDinamico.titulo : this.institucionalDinamico.link_pagina;
      });
    } else {
      this.dadosDownload = null;
    }
  }

}
