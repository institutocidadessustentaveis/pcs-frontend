import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { saveAs } from 'file-saver';
import { Title } from '@angular/platform-browser';
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CidadeDetalhe } from './../../../model/cidadeDetalhe';
import { Component, OnInit, HostListener} from '@angular/core';
import { PlanoMeta } from 'src/app/model/PlanoMetas/plano-meta';
import { CidadeService } from 'src/app/services/cidade.service';
import { PlanoMetaAno } from 'src/app/model/PlanoMetas/plano-meta-ano';
import { PlanoMetasService } from 'src/app/services/plano-metas.service';
import { PlanoMetaDetalhes } from 'src/app/model/PlanoMetas/plano-meta-detalhes';
import { PlanoMetasDetalhadoHistoricoService } from 'src/app/services/plano-metas-detalhado-historico.service';
import { PlanoDeMetasDetalhadoHistorico } from 'src/app/model/plano-metas-detalhado-historico';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Prefeitura } from 'src/app/model/prefeitura';
import { MatDialog, MatDialogConfig, MatSnackBar } from '@angular/material';
import { environment } from 'src/environments/environment';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { DadosDownload } from 'src/app/model/dados-download';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { Usuario } from 'src/app/model/usuario';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-plano-metas-cidade',
  templateUrl: './plano-de-metas-cidade.component.html',
  styleUrls: ['./plano-de-metas-cidade.component.css']
})

export class PlanoDeMetasCidadeComponent implements OnInit {
  mailTo: string;
  innerWidth: any;
  isValid: boolean;
  cidade: CidadeDetalhe = new CidadeDetalhe();
  prefeitura: Prefeitura;
  formSolicitacao: FormGroup;
  objetoPlanoMeta: PlanoMeta = new PlanoMeta();
  objetoPlanoMetaAno: PlanoMetaAno = new PlanoMetaAno();
  listaPlanoMetaIndicador: Array<PlanoMetaDetalhes> = new Array<PlanoMetaDetalhes>();
  metasHistorico: PlanoDeMetasDetalhadoHistorico[] = new Array<PlanoDeMetasDetalhadoHistorico>();
  API_URL = environment.API_URL;
  APP_URL = environment.APP_URL;

  editorConfig = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['fontsize', []],
      ['para', ['style0', 'ul', 'ol']],
      ['insert', ['table', 'picture','video', 'link']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  public estaLogado: boolean = false;

  constructor(
    private titleService: Title,
    private _snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public cidadeService: CidadeService,
    public activatedRoute: ActivatedRoute,
    public planoMetaService: PlanoMetasService,
    private prefeituraService: PrefeituraService,
    private planoMetasDetalhadoHistoricoService: PlanoMetasDetalhadoHistoricoService,
    public dialog: MatDialog,
    private usuarioService: UsuarioService,
    private dadosDownloadService: DadosDownloadService,
    private authService: AuthService
     ) {
    registerLocaleData(localePtBr);
    this.formSolicitacao = this.formBuilder.group({
      temas: [null, Validators.required]
    })


  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.buscarPlanoMeta();
    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true) {
      this.buscarDadosDownloadUsuarioLogado();
    }
    
  }

  onSolicitar() {
    this.verificaValidacoesForm(this.formSolicitacao);
    if (this.formSolicitacao.controls.temas.value != null ) {
      this._snackBar.open('Abrindo aplicativo de email...', '', {
        duration: 5000,
      });
      this.isValid = true;
      this.mailTo = `mailto:${this.prefeitura.email}?subject=Sugestão%20para%20a%20Prefeitura&body=Sugestão: ${this.formSolicitacao.controls.temas.value}`;
    }
    else {
      this.isValid = false;
     this.mailTo = '';
    }
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle.markAsTouched();
      if (controle instanceof FormGroup){
        this.verificaValidacoesForm(controle);
      }
    });
  }

  buscarCidade(id: number) {
    this.cidadeService.buscarCidadePorId(id)
    .subscribe(cidade => {
      this.cidade = cidade;
      this.titleService.setTitle(`Plano de metas da Cidade de ${this.cidade.nome} - Cidades Sustentáveis`)
    })
  }

  private buscarPrefeitura (idPrefeitura: number) {
    this.prefeituraService.buscarPrefeituraEdicao(idPrefeitura)
    .subscribe( prefeitura => this.prefeitura = prefeitura)
  }

  buscarPlanoMeta() {
    this.activatedRoute.params.subscribe(async params => {
      let id = params.id;
      if (id) {
        this.buscarCidade(id);
        this.planoMetaService.buscarPlanoDeMetasPorIdCidade(id).subscribe(response => {
          if (response !== null && response !== undefined) {
            this.objetoPlanoMeta = response as PlanoMeta;
            this.buscarPrefeitura(this.objetoPlanoMeta.idPrefeitura)
            this.objetoPlanoMetaAno.primeiroAnoMandato = this.objetoPlanoMeta.primeiroAnoMandato;
            this.objetoPlanoMetaAno.segundoAnoMandato = this.objetoPlanoMeta.segundoAnoMandato;
            this.objetoPlanoMetaAno.terceiroAnoMandato = this.objetoPlanoMeta.terceiroAnoMandato;
            this.objetoPlanoMetaAno.quartoAnoMandato = this.objetoPlanoMeta.quartoAnoMandato;
            if (this.objetoPlanoMeta.planosDeMetasDetalhados !== null && this.objetoPlanoMeta.planosDeMetasDetalhados !== undefined) {
              this.listaPlanoMetaIndicador = this.formatarStringDeValoresPlanoDeMetasDetalhes(this.objetoPlanoMeta.planosDeMetasDetalhados);

              const anos = [ this.objetoPlanoMeta.primeiroAnoMandato, this.objetoPlanoMeta.segundoAnoMandato, this.objetoPlanoMeta.terceiroAnoMandato, this.objetoPlanoMeta.quartoAnoMandato];

              this.objetoPlanoMeta.planosDeMetasDetalhados.forEach(function (item) {
                  item.anos = anos,
                  item.chartData = [{
                    data : [item.valorPreenchidoPrimeiroAno, item.valorPreenchidoSegundoAno, item.valorPreenchidoTerceiroAno, item.valorPreenchidoQuartoAno],
                    label: 'Valores Preenchidos'
                  },
                  {
                    data : [item.metaAnualPrimeiroAno, item.metaAnualSegundoAno, item.metaAnualTerceiroAno, item.metaAnualQuartoAno],
                    label: 'Valores das Metas'
                  }]
              });

            }
          }
        });
      }
    });
  }

  downloadPlanoDeMetas() {
    this.planoMetaService.download(this.objetoPlanoMeta.id).subscribe(res => {
      let bytes: any = res;
      const blob = new Blob([bytes], { type: "application/octet-stream" });
      saveAs(blob, `Plano de Metas ${this.objetoPlanoMeta.nomeCidade}.xlsx`);
    });
  }

  formatarStringDeValoresPlanoDeMetasDetalhes(planoDeMetasDetalhes: PlanoMetaDetalhes[]){
    planoDeMetasDetalhes.forEach(x => {
      if (x.ultimoValorIndicador) {
        x.ultimoValorIndicador = parseFloat(x.ultimoValorIndicador).toFixed(2);
      }

      if(x.valorPreenchidoPrimeiroAno){
        x.valorPreenchidoPrimeiroAno = parseFloat(x.valorPreenchidoPrimeiroAno).toFixed(2);
      }

      if(x.valorPreenchidoSegundoAno){
        x.valorPreenchidoSegundoAno = parseFloat(x.valorPreenchidoSegundoAno).toFixed(2);
      }

      if(x.valorPreenchidoTerceiroAno){
        x.valorPreenchidoTerceiroAno = parseFloat(x.valorPreenchidoTerceiroAno).toFixed(2);
      }

      if(x.valorPreenchidoQuartoAno){
        x.valorPreenchidoQuartoAno = parseFloat(x.valorPreenchidoQuartoAno).toFixed(2);
      }
    })

    return planoDeMetasDetalhes;
  }

  public buscarHistoricoMetas(idIndicador: Number, idPlano: Number) {
    this.listaPlanoMetaIndicador.forEach(planoMeta => {
      if (planoMeta.idIndicador == idIndicador && (planoMeta.historicoMetas == null || planoMeta.historicoMetas == undefined)) {
        this.planoMetasDetalhadoHistoricoService.buscarMetasHistoricoAnos(idPlano, idIndicador)
        .subscribe(historico => {
          console.log(historico)
          this.listaPlanoMetaIndicador.forEach(planoMeta => {
            if (planoMeta.idIndicador == idIndicador) {
              planoMeta.historicoMetas = historico;
            }
          })
        })
      }
    })
  }

  fileDownloadPlanoMetas() {
    this.cidadeService.download(this.objetoPlanoMeta.arquivo.id).subscribe(res => {
      saveAs(this.b64toBlob(res.conteudo), res.nomeArquivo);
    });
  }

  private b64toBlob(b64Data, contentType = '', sliceSize = 512) {
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

  // tslint:disable-next-line: member-ordering
  chartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        title: () => {
          return '';
        },
        label: (tooltipItem, data) => {
          const decimalPipe = new DecimalPipe('pt-BR');
          const valor = decimalPipe.transform(tooltipItem.yLabel);
          return `${data.datasets[tooltipItem.datasetIndex].label} - ${valor} `;
        }
      }
    },
    scales: {
      xAxes: [{
        // ticks: {
        //   callback: (dataLabel, index) => {
        //     const decimalPipe = new DecimalPipe('pt-BR');
        //     return decimalPipe.transform(dataLabel);
        //   }
        // }
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            beginAtZero: true,
            callback: (dataLabel, _index) => {
              const decimalPipe = new DecimalPipe('pt-BR');
              return decimalPipe.transform(dataLabel);
            }
          }
        }
      ]
    },
  };

  public validacaoDownloadPlanoMetas(){
    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.downloadPlanoDeMetas();
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Plano de Metas do Munícipio",
      pagina: "Plano de Metas",
      arquivo: `Plano de Metas de ${this.cidade.nome}`
    }
    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.downloadPlanoDeMetas();
      }
    });
    }
  }

  public validacaoDownloadFilePlanoMetas(){
    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.fileDownloadPlanoMetas();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download de Arquivo Plano de Metas';
      this.dadosDownload.pagina = this.cidade.nome;
      this.dadosDownload.arquivo = `Plano de Metas de ${this.cidade.nome}`
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.fileDownloadPlanoMetas();
    } else {
    const dialogConfig = new MatDialogConfig();
    
    dialogConfig.data = {
      acao: "Download de Arquivo Plano de Metas",
      pagina: this.cidade.nome,
      arquivo: `Plano de Metas de ${this.cidade.nome}`
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

  public getUsuarioLogadoDadosDownloadPlanoMetas(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Plano de Metas do Munícipio';
    this.dadosDownload.pagina = 'Plano de Metas'; 
    this.dadosDownload.arquivo =  `Plano de Metas de ${this.cidade.nome}`;   
    });
  }

  public getUsuarioLogadoDadosDownloadFilePlanoMetas(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download de Arquivo Plano de Metas';
    this.dadosDownload.pagina = 'Plano de Metas';
    this.dadosDownload.arquivo =  `Plano de Metas de ${this.cidade.nome}`; 
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

 public buscarDadosDownloadUsuarioLogado(){
   this.getUsuarioLogadoDadosDownloadFilePlanoMetas();
   this.getUsuarioLogadoDadosDownloadPlanoMetas
 }
}
