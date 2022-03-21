import { saveAs } from 'file-saver';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Component, OnInit, ViewChild, PipeTransform, Pipe, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { PainelIndicadorCidadeService } from 'src/app/services/painel-indicador-cidade.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IndicadoresCidade } from 'src/app/model/PainelIndicadorCidades/indicadoresCidade';
import { ProvinciaEstadoShapeService } from 'src/app/services/provincia-estado-shape.service';
import { CidadeService } from 'src/app/services/cidade.service';

import 'src/assets/mapmarker.png';
import { url } from 'inspector';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { EixoService } from 'src/app/services/eixo.service';
import { DownloadslogService } from 'src/app/services/downloadslog.service';

import * as L from 'leaflet';
import { GestureHandling } from 'leaflet-gesture-handling';
import { latLng, tileLayer, marker, icon } from 'leaflet';

import { environment } from 'src/environments/environment';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/model/Evento';
import { FormularioService } from 'src/app/services/formulario.service';
import { StripTagsPipe } from 'src/app/components/strip-tags/strip-tags.pipe';
import { SeoService } from 'src/app/services/seo-service.service';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/model/usuario';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { AuthService } from 'src/app/services/auth.service';

const path = 'assets/pdf/Carta de Compromisso.pdf';
const pipeRemoveTagsHtml = new StripTagsPipe();
export class CidadeDetalhesDTO {
  idCidade: number;
  idEstado: number;
  nomeCidade: string;
  nomeEstado: string;
  siglaEstado: string;
  nomePais: string;
  documentos: string;
}

@Component({
  selector: 'app-painel-indicadores-cidade-detalhes',
  templateUrl: './painel-indicadores-cidade-detalhes.component.html',
  styleUrls: ['./painel-indicadores-cidade-detalhes.component.css']
})

export class PainelIndicadoresCidadeDetalhesComponent implements OnInit {
  ambiente = environment.NOME;
  cidadesDetalhesDTO: CidadeDetalhesDTO = new CidadeDetalhesDTO();
  dadosCidade: IndicadoresCidade = new IndicadoresCidade();
  idCidade: number;
  eventos: any = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource();
  options = {
    layers: [
      tileLayer(environment.MAP_TILE_SERVER, {
        attribution: environment.MAP_ATTRIBUTION
      })
    ],
    zoom: 16,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
  };

  formularioList: any = [];

  center = latLng([0, 0]);

  layersControl = [];

  someObject = {
    key1: 'value1',
    key2: 'value2'
  };

  myParams: object = {};
  myStyle: object = {};

  mandatos = [];
  eixos = [];

  ultimoMandato = '';

  idIndicadorCidadeDetalhe: number;
  urlIndicadorCidadeDetalhe: string;
  buscarIndicadorCidadeDetalhePorId = false;
  nomeCidade: string;
  siglaEstado: string;

  public cidades: Array<any> = [];

  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  public estaLogado: boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scrollUp: any;

  constructor(public activatedRoute: ActivatedRoute,
              public painelIndicadorCidadeService: PainelIndicadorCidadeService,
              public eixoService: EixoService,
              public shapeService: ProvinciaEstadoShapeService,
              public cidadesService: CidadeService,
              public prefeituraService: PrefeituraService,
              public domSanitizer: DomSanitizer,
              private downloadsLogService: DownloadslogService,
              public router: Router,
              public pcsUtil: PcsUtil,
              private element: ElementRef,
              private eventoService: EventoService,
              private formularioService: FormularioService,
              private titleService: Title,
              private seoService: SeoService,
              public dialog: MatDialog,
              public usuarioService: UsuarioService,
              public dadosDownloadService: DadosDownloadService,
              private authService: AuthService) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
  }

  ngOnInit() {
    this.buscarDetalhesCidade();
    
    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true) {
      this.buscarDadosUsuariosLogadosDownload();
    }
    

    this.myStyle = {
      'width': '100%',
      'height': '100%',
      'z-index': -1,
      'top': 0,
      'left': 0,
      'right': 0,
      'bottom': 0,
    };

    this.myParams = {
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: '#ffffff'
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 7,
          direction: 'none',
          random: true,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onhover: {
            enable: false,
            mode: 'grab'
          },
          onclick: {
            enable: false,
            mode: 'push'
          },
          resize: true
        },
      },
      retina_detect: true
    };
    // this.buscarSignatarias();
  }

  buscarEventos() {
    this.eventoService.buscarEventosPorIdCidade(this.idCidade)
      .subscribe(res => {
        this.eventos = res;
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  buscarFormularios() {
    this.formularioService.buscarFormulariosResumido(this.idCidade).subscribe(res => {
      this.formularioList = res;
      if (this.formularioList) {
        this.formularioList.forEach(formulario => {
          formulario.descricao ? formulario.descricao = pipeRemoveTagsHtml.transform(formulario.descricao) : null;
        })
      }
    })
  }

  abrirFormulario(formulario: any) {
    return '/formulario/' + formulario.link;
  }

  buscarDetalhesCidade() {
    this.activatedRoute.params.subscribe(async params => {
      this.buscarIndicadorCidadeDetalhePorId = (params.id ? true: false);

      if (this.buscarIndicadorCidadeDetalhePorId) {
        this.idIndicadorCidadeDetalhe = params.id;
      } else {
        this.siglaEstado = PcsUtil.toSlug(params.siglaestado);
        this.nomeCidade = PcsUtil.toSlug(params.nomecidade);
      }
      if (this.siglaEstado && this.nomeCidade ) {
        this.painelIndicadorCidadeService.buscarIndicadoresPorNomeEstadoCidade(this.siglaEstado, this.nomeCidade).subscribe(response => {
          this.idCidade = response;
          this.painelIndicadorCidadeService.buscarCidade(this.idCidade).subscribe(response => {
            this.dadosCidade = response as IndicadoresCidade;
            this.buscarDadosCidade();
          });
          this.buscarSignatarias();
        });
      } else if (this.idIndicadorCidadeDetalhe) {
        this.idCidade = this.idIndicadorCidadeDetalhe;
        this.painelIndicadorCidadeService.buscarCidade(this.idIndicadorCidadeDetalhe).subscribe(response => {
          this.dadosCidade = response as IndicadoresCidade;
          this.buscarDadosCidade();
        });
        this.buscarSignatarias();
      } else {
        this.dadosCidade = new IndicadoresCidade();
      }
    }, error => { });
  }

  numberWithCommas(value: string) {
    if (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
  }

  buscarDadosPainelIndicadores() {
    this.dadosCidade.mandatos.sort((m1, m2) => {
      return m1.inicioMandato - m2.inicioMandato;
    });

    if (this.dadosCidade.fotoCidade != null) {
      this.dadosCidade.fotoCidade = `${environment.API_URL}${this.dadosCidade.fotoCidade}`;
    } else {
      this.dadosCidade.fotoCidade = `${environment.APP_IMAGEM}img-default-pagina-cidade.png`;
    }

    this.titleService.setTitle(`${this.dadosCidade.cidade} - Cidades Sustentáveis`);
    const config = {
      title: `${this.dadosCidade.cidade} - Cidades Sustentáveis`,
      description: `${this.dadosCidade.textoCidade}`,
      image: this.dadosCidade.fotoCidade != null ? `${environment.API_URL}${this.dadosCidade.fotoCidade}` : `${environment.APP_IMAGEM}img-default-pagina-cidade-og.png`,
      slug: '',
      site: 'Cidades Sustentáveis',
      url: `${environment.APP_URL}painel-cidade/${this.idIndicadorCidadeDetalhe}`
    };
    this.seoService.generateTags(config);

    this.center = latLng([this.dadosCidade.latitude, this.dadosCidade.longitude]);

    if (this.dadosCidade) {
      this.dadosCidade.populacao = this.numberWithCommas(this.dadosCidade.populacao);
    }

    this.layersControl.push(
      marker([this.dadosCidade.latitude, this.dadosCidade.longitude],
        {
          icon: icon({
            iconSize: [50, 50],
            iconAnchor: [25, 60],
            iconUrl: 'assets/mapmarker.png'
          })
        }
      )
        .bindPopup(`<strong>${this.dadosCidade.cidade}, ${this.dadosCidade.estado}</strong></br>`)
    );
  }

  buscarMandatos() {
    this.painelIndicadorCidadeService.buscarMandatos().subscribe(res => {
      const mandatos = res;
      for (const mandato of mandatos) {
        mandato[0] = Number(mandato[0]);
        mandato[1] = Number(mandato[1]);
      }
      this.mandatos = mandatos;
      for (const mandato of mandatos) {
        this.ultimoMandato = mandato[2];
      }
      this.buscarEixos();
    });
  }

  buscarEixos() {
    this.eixoService.buscarEixosParaCombo(true).subscribe(res => {
      this.eixos = res;
      for (const mandato of this.mandatos) {
        mandato[3] = res;
      }
    });
  }

  selecionarEixo(idMandato, idEixo) {
    let alterado = false;
    for (let mandato of this.mandatos) {
      if (mandato[2] === idMandato) {
        for (let eixo of mandato[3]) { //Mandato[3] são os vinculos de eixo com o mandato
          if (eixo.id === idEixo) {
            eixo.selecionado = true;
            alterado = true;
            break;
          }
        }
      }
      if (alterado) {
        break;
      }
    }
  }

  loadIndicadores(indicadores: Array<Map<string, string>>) {
    this.displayedColumns = Object.keys(indicadores[0]);
    this.dataSource = new MatTableDataSource(indicadores);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public botaoIrParaSite() {
    window.open(this.dadosCidade.site, '_blank');
  }

  public botaoComparativoIndicadores() {
    this.router.navigate(['/comparacaoIndicadores']);
  }

  fileDownloadCarta() {
    this.prefeituraService.downloadCartaCompromisso(this.idCidade, 0).subscribe(res => {

      const blob = new Blob([res.body], { type: 'application/octet-stream' });
      const extensao: string = res.headers.get('content-disposition');
      saveAs(blob, 'carta_compromisso' + extensao);
    });

    setTimeout(() => {
      this.prefeituraService.downloadCartaCompromisso(this.idCidade, 1).subscribe(res => {
        const blob = new Blob([res.body], { type: 'application/octet-stream' });
        const extensao: string = res.headers.get('content-disposition');
        saveAs(blob, 'carta_compromisso2' + extensao);
      });
    }, 1000);


  }



  fileDownloadRelatorioContas() {
    this.cidadesService.download(this.dadosCidade.idRelatorioContas).subscribe(res => {
      saveAs(this.b64toBlob(res.conteudo), res.nomeArquivo);
    });
  }

  fileDownloadPlanoMetas() {
    this.cidadesService.download(this.dadosCidade.idPlanoMetas).subscribe(res => {
      saveAs(this.b64toBlob(res.conteudo), res.nomeArquivo);
    });
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
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

  buscarDadosCidade() {
    this.buscarDadosPainelIndicadores();
    this.buscarMandatos();
    this.buscarEventos();
    this.buscarFormularios();
  }

  public buscarSignatarias() {
    this.prefeituraService.buscarCidadesSignatariasDataMandatosPorIdCidade(this.idCidade).subscribe(cidades => {
      this.cidades = cidades as any;
    })
  }

  public jaFoiSignataria(prefeituras: Array<any>) {
    var listAux: Array<any> = [];
    if(prefeituras.length >= 1) {
      for (let prefeitura of prefeituras) {
        if(!prefeitura.signataria) {
          listAux.push(prefeitura);
        }
      }
    }
    return listAux.length;
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}img-default-pagina-cidade.png`
  }

  public validacaoDownloadCarta(){

    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.fileDownloadCarta();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Carta-Compromisso';
      this.dadosDownload.pagina = 'Painel de Indicadores de Cidades';
      this.dadosDownload.arquivo = `Carta-Compromisso de ${this.dadosCidade.cidade}`
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.fileDownloadCarta();
    } else {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Carta-Compromisso",
      pagina: "Painel de Indicadores Cidades",
      arquivo: `Carta-Compromisso de ${this.dadosCidade.cidade}`
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.fileDownloadCarta();
      }
    });
   }
  }

  public validacaoDownloadRelatorioContas(){

    if(this.estaLogado) {
      this.dadosDownload.arquivo = `Relatório de Contas de ${this.dadosCidade.cidade}`  
      this.cadastrarDadosDownload(this.dadosDownload);
      this.fileDownloadRelatorioContas();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Relatório de Contas';
      this.dadosDownload.pagina = 'Painel de Indicadores de Cidades';
      this.dadosDownload.arquivo = `Relatório de Contas de ${this.dadosCidade.cidade}`  
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.fileDownloadRelatorioContas();
    } else {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Relatório de Contas",
      pagina: "Painel de Indicadores de Cidades",
      arquivo: `Relatório de Contas de ${this.dadosCidade.cidade}`
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.fileDownloadRelatorioContas();
      }
    });
    }
  }

  public validacaoDownloadPlanoMetas(){
    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.fileDownloadPlanoMetas();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Plano de Metas';
      this.dadosDownload.pagina = 'Painel de Indicadores de Cidades';
      this.dadosDownload.arquivo = `Plano de Metas de ${this.dadosCidade.cidade}`; 
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.fileDownloadPlanoMetas();
    } else {

    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Plano de Metas",
      pagina: "Painel de Indicadores de Cidades",
      arquivo:  `Plano de Metas de ${this.dadosCidade.cidade}` 
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.fileDownloadPlanoMetas();
      }
    });
    }
  }
  
  public btnIrParaSubdivisoes(){
    let uf = PcsUtil.toSlug(this.dadosCidade.uf);
    let cidade = PcsUtil.toSlug(this.dadosCidade.cidade);
    window.open(`/painel-subdivisoes/${uf}/${cidade}`, "_blank");
  }

  public getUsuarioLogadoDadosDownloadCarta(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Carta-Compromisso';
    this.dadosDownload.pagina = 'Painel de Indicadores de Cidades';
    this.dadosDownload.arquivo = `Carta-Compromisso de ${this.dadosCidade.cidade}`   
    });
  }

  public getUsuarioLogadoDadosDownloadContas(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Relatório de Contas';
    this.dadosDownload.pagina = 'Painel de Indicadores de Cidades'; 
    this.dadosDownload.arquivo = `Relatório de Contas de ${this.dadosCidade.cidade}`  
    });
  }

  public getUsuarioLogadoDadosDownloadPlanoMetas(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Plano de Metas';
    this.dadosDownload.pagina = 'Painel de Indicadores de Cidades';  
    this.dadosDownload.arquivo = `Plano de Metas de ${this.dadosCidade.cidade}`  
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

  public buscarDadosUsuariosLogadosDownload(){
    this.getUsuarioLogadoDadosDownloadCarta();
    this.getUsuarioLogadoDadosDownloadContas();
    this.getUsuarioLogadoDadosDownloadPlanoMetas();
  }
}

