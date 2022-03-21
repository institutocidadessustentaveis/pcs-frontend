import { forEach } from '@angular/router/src/utils/collection';
import { ItemCombo } from './../../../../model/ItemCombo ';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import { ProvinciaEstadoService } from '../../../../services/provincia-estado.service';
import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { BoaPratica } from 'src/app/model/boaPratica';
import { BoaPraticaService } from 'src/app/services/boa-pratica.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';
import { PaisService } from 'src/app/services/pais.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { Pais } from 'src/app/model/pais';
import { Cidade } from 'src/app/model/cidade';
import { Arquivo } from 'src/app/model/arquivo';
import { MatTableDataSource, MatDialog } from '@angular/material';
import { Eixo } from 'src/app/model/eixo';
import { EixoService } from 'src/app/services/eixo.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { MetaObjetivoDesenvolvimentoSustentavel } from 'src/app/model/metaObjetivoDesenvolvimentoSustentavel';
import { Indicador } from 'src/app/model/indicadores';
import moment from 'moment';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagemBoaPratica } from 'src/app/model/imagem-boa-pratica';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PreVisualizacaoComponent } from './pre-visualizacao/pre-visualizacao.component';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from 'src/app/services/auth.service';
import { IntegracaoService } from 'src/app/services/integracao.service';
import { environment } from 'src/environments/environment';
declare var $;

export interface Video {
  url: string;
  safeUrl: SafeResourceUrl;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-boas-praticas',
  templateUrl: './boas-praticas-form.component.html',
  styleUrls: ['./boas-praticas-form.component.css']
})
export class BoasPraticasFormComponent implements OnInit {

  @ViewChild('componentePreview') preVisualizacaoComponent: PreVisualizacaoComponent;
  @ViewChild('modalLoading') modalLoading: TemplateRef<any>;

  desabilitarBotaoSalvar: boolean = false;

  public imageChangedEvent: any = '';

  public listaProvinciaEstadoFiltrada: Observable<ProvinciaEstado[]>;

  public varEstadoSelecionado: ProvinciaEstado;

  public loading = true;

  public modoEdicao = false;
  public modoPrefeitura = true;

  public arquivo: Arquivo = new Arquivo();
  public arquivosFonteReferencia: Arquivo[] = [];
  public dataSourceFonteReferencia: MatTableDataSource<Arquivo>;
  public displayedColumnsFonteReferencia: string[] = ['nomeArquivo', 'remover'];

  public matcher = new MyErrorStateMatcher();

  public firstFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  public fifthFormGroup: FormGroup;
  public sixthFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public fourthFormGroup: FormGroup;
  public boaPratica: BoaPratica = new BoaPratica();
  public listaPaisesCombo: Array<Pais> = new Array<Pais>();
  public listaEixosCombo: Array<Eixo> = new Array<Eixo>();
  public listaCidadeCombo: Array<ItemCombo> = new Array<ItemCombo>();
  public listaIndicadoresCombo: Array<Indicador> = new Array<Indicador>();
  public listaProvinciaEstadoAutoComplete: Array<ProvinciaEstado> = new Array<ProvinciaEstado>();
  public listaOdsCombo: Array<ObjetivoDesenvolvimentoSustentavel> = new Array<ObjetivoDesenvolvimentoSustentavel>();
  public listaMetasCombo: Array<MetaObjetivoDesenvolvimentoSustentavel> = new Array<MetaObjetivoDesenvolvimentoSustentavel>();

  public nomeAutor: string;
  public imagemPrincipal: ImagemBoaPratica;
  public solucoesIntegracao: Array<any> = new Array<any>();


  public imagensGaleria: ImagemBoaPratica[] = [];

  public galeriaDeVideos: Video[] = [];
  public urlsGaleriaVideo: SafeResourceUrl[] = [];

  public dataSourceIndicadores: MatTableDataSource<Indicador>;
  public listaIndicadoresSelecionados: Array<Indicador> = new Array<Indicador>();
  public dataSourceSolucoes: MatTableDataSource<any>;
  public listaSolucoesSelecionados: Array<any> = new Array<any>();
  public displayedColumnsIndicadores: string[];
  public displayedColumnsSolucoes: string[];

  imagensCorpoBoaPratica: any[] = [];

  public editorConfig: any = {
    height: '200px',
    tabsize: 2,
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol']],
      ['insert', ['table', 'picture', 'link']],
      ['view', ['fullscreen']],
      ['customButtons', ['Blockquote', 'H1', 'H2', 'H3']]
    ],
    fontNames: [
      'Arial',
      'Arial Black',
      'AT Surt',
      'AT Surt Bold',
      'AT Surt Light',
      'Calibri',
      'Comic Sans MS',
      'Courier New',
      'Futura Book', 
      'Futura Light', 
      'Georgia',
      'Glacial Indiff',
      'Helvetica',
      'Helvetica Neue',
      'Noto Sans',
      'Open Sans',
      'Roboto',
      'Source Sans Pro',
      'Tahoma',
      'Times',
      'trebuchet ms',
      'Verdana'
    ],
    buttons: {
      'Blockquote': this.insertBlockquoteButton(),
      'H1': this.intertituloH1Button(),
      'H2': this.intertituloH2Button(),
      'H3': this.intertituloH3Button(),
    },
    callbacks: { 
      onPaste: function (e) { 
        var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); 
        e.preventDefault(); document.execCommand('insertText', false, bufferText); 
      },
      onImageUpload: file => {
        this.boaPraticaService
          .salvarImagemCorpoBoaPratica(file[0])
          .subscribe(response => {
            let path: string = `${environment.API_URL}${response.path}`;
            this.imagensCorpoBoaPratica.push({
              id: response.id,
              path: path,
              file: file[0]
            });
            document.execCommand('insertImage', false, path);
          });
      },
      onMediaDelete: e => {
        let imagensEncontradas = this.imagensCorpoBoaPratica.filter(
          i => i.path === e[0].src
        );

        if (imagensEncontradas.length > 0) {
          let imagem = imagensEncontradas[0];

          this.boaPraticaService
            .apagarImagemCorpoBoaPratica(imagem.id)
            .subscribe(response => {});
        }
      },
    }
  };
  scrollUp: any;

  filteredOptionsIndicador: Observable<Array<Indicador>>;
  filteredOptionsSolucao: Observable<Array<any>>;

  constructor(private formBuilder: FormBuilder, private boaPraticaService: BoaPraticaService, private router: Router,
              private paisService: PaisService, private estadoService: ProvinciaEstadoService, private cidadeService: CidadeService,
              private eixoService: EixoService, private odsService: ObjetivoDesenvolvimentoSustentavelService,
              public activatedRoute: ActivatedRoute, private prefeituraService: PrefeituraService,
              public domSanitizer: DomSanitizer, private element: ElementRef, private authService: AuthService,
              public dialog: MatDialog, public integracaoService: IntegracaoService) {
    this.scrollUp = this.router.events.subscribe((path) => {
    element.nativeElement.scrollIntoView();
    });
    this.firstFormGroup = this.formBuilder.group({
      site: [''],
      contato: [''],
      celular: [''],
      endereco: [''],
      telefone: [''],
      dtInicio: [''],
      urlVideo: [''],
      nomeAutor: [''],
      paginaInicial: [''],
      dataPublicacao: [''],
      nomeInstituicao: [''],
      nomeResponsavel: [''],
      email: ['', Validators.email],
      pais: ['', Validators.required],
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      imagemPrincipal: ['', Validators.required],
      possuiFiltro: [''],
      autorImagemPrincipal: ['']
    });
    this.secondFormGroup = this.formBuilder.group({
      titulo: [''],
      subtitulo: [''],
      objetivoGeral: [''],
      objetivoEspecifico: [''],
      principaisResultados: ['']
    });
    this.thirdFormGroup = this.formBuilder.group({
      publicoAtingido: [''],
      parceirosEnvolvidos: [''],
      aprendizadoFundamental: [''],
    });
    this.fourthFormGroup = this.formBuilder.group({
      fontesReferencia: [''],
      resultadosQualitativos: [''],
      parametrosContemplados: [''],
      resultadosQuantitativos: [''],
    });
    this.fifthFormGroup = this.formBuilder.group({
      solucoes: [''],
      metasOds: [''],
      indicadores: [''],
      ods: ['', Validators.required],
      eixo: ['', Validators.required],
    });
    this.sixthFormGroup = this.formBuilder.group({
      informacoesComplementares: ['']
    });
    this.displayedColumnsIndicadores = [
      "nomeIndicador",
      "remover"
    ];
    this.displayedColumnsSolucoes = [
      "nomeSolucao",
      "remover"
    ];
  }

  ngOnInit() {
    this.verificaLogin();
    this.modoPrefeitura = this.isUsuarioPrefeitura();
    if (this.modoPrefeitura) {
      this.firstFormGroup.controls.estado.disable();
      this.carregarComboPaises();
      this.carregarInfoPrefeituraLogada();
    } else {
      this.editorConfig = {
        height: '200px',
        tabsize: 2,
        toolbar: [
          ['misc', ['undo', 'redo']],
          ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
          ['fontsize', ['fontname', 'fontsize', 'color']],
          ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
          ['insert', ['table', 'picture', 'link', 'video', 'hr']],
          ['view', ['fullscreen', 'codeview', 'help']],
          ['customButtons', ['Blockquote', 'H1', 'H2', 'H3']]
        ],
        fontNames: [
          'Arial',
          'Arial Black',
          'AT Surt',
          'AT Surt Bold',
          'AT Surt Light',
          'Calibri',
          'Comic Sans MS',
          'Courier New',
          'Futura Book', 
          'Futura Light', 
          'Georgia',
          'Glacial Indiff',
          'Helvetica',
          'Helvetica Neue',
          'Noto Sans',
          'Open Sans',
          'Roboto',
          'Source Sans Pro',
          'Tahoma',
          'Times',
          'trebuchet ms',
          'Verdana'
        ],
        buttons: {
          'Blockquote': this.insertBlockquoteButton(),
          'H1': this.intertituloH1Button(),
          'H2': this.intertituloH2Button(),
          'H3': this.intertituloH3Button(),
        },
        callbacks: { 
          onPaste: function (e) { 
            var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); 
            e.preventDefault(); document.execCommand('insertText', false, bufferText); 
          },
          onImageUpload: file => {
            this.boaPraticaService
              .salvarImagemCorpoBoaPratica(file[0])
              .subscribe(response => {
                let path: string = `${environment.API_URL}${response.path}`;
                this.imagensCorpoBoaPratica.push({
                  id: response.id,
                  path: path,
                  file: file[0]
                });
                document.execCommand('insertImage', false, path);
              });
          },
          onMediaDelete: e => {
            let imagensEncontradas = this.imagensCorpoBoaPratica.filter(
              i => i.path === e[0].src
            );
    
            if (imagensEncontradas.length > 0) {
              let imagem = imagensEncontradas[0];
    
              this.boaPraticaService
                .apagarImagemCorpoBoaPratica(imagem.id)
                .subscribe(response => {});
            }
          },
        }
      };
      this.carregarComboPaises();
    }
  }

  async verificaLogin(){
    if (!this.authService.getUsuarioLogado()) {
      await PcsUtil.swal().fire('Você precisa relogar.', 'Por favor recarregue sua página e faça login novamente.', 'error');
      document.location.reload(true);
    }
  }

  async buscarBoaPratica() {
    await this.activatedRoute.params.subscribe(async params => {

      let id = params.id;
      if (id) {
        this.loading = true;
        await this.boaPraticaService.buscarPorId(id).subscribe(async response => {
          this.boaPratica = response as BoaPratica;
          this.carregarAtributosBoaPratica();
          this.modoEdicao = true;
          this.verificaPermissaoEdicao();
          this.loading = false;
        }, error => { this.router.navigate(['/boaspraticas']); });
      }
      this.loading = false;
    }, error => { this.router.navigate(['/boaspraticas']); });

  }

  compareObjects(o1: any, o2: any): boolean {
    return o1._id === o2._id;
  }

  private carregarComboSolucoes(){
    this.integracaoService.consultarBoasPraticasPlataformaCGEE().subscribe(res => {
      this.solucoesIntegracao = this.converterSolucoesAPIEmObjetoPCS(res);
      this.fifthFormGroup.controls.solucoes.setValue(null);
      this.filteredOptionsSolucao = this.fifthFormGroup.controls.solucoes.valueChanges.pipe(startWith(''), map(value => this._filterSolucao(value)));
    })
  }

  ordenar(a,b) {
    if(a.nome.replace(/[^a-zA-Zs]/g, "") < b.nome.replace(/[^a-zA-Zs]/g, "")) {
       return -1;
    }
    else if(a.nome.replace(/[^a-zA-Zs]/g, "") > b.nome.replace(/[^a-zA-Zs]/g, "")) {
      return 1;
    }
  }

  private carregarComboPaises() {
    this.loading = true;
    this.paisService.buscarTodos().subscribe(response => {
      this.listaPaisesCombo = response;
      this.listaPaisesCombo = response as Array<Pais>;
      this.carregarComboEixos();
      this.carregarComboSolucoes();
    });
  }

  public async paisSelecionado(event: any) {
    this.estadoService.buscarPorPais(event.id).subscribe(response => {
      this.listaProvinciaEstadoAutoComplete = response;
      this.listaProvinciaEstadoAutoComplete = response as Array<ProvinciaEstado>;
      this.listaProvinciaEstadoFiltrada = this.firstFormGroup.controls.estado.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(name => name ? this._filter(name) : this.listaProvinciaEstadoAutoComplete.slice())
      );
      this.listaCidadeCombo = new Array<ItemCombo>();
      this.firstFormGroup.controls.estado.setValue(null);
      this.firstFormGroup.controls.municipio.setValue(null);
    });
  }


  public async estadoSelecionado(item: any) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(this.firstFormGroup.controls.estado.value.id).subscribe(response => {
        this.listaCidadeCombo = response;
        this.listaCidadeCombo = response as Array<ItemCombo>;
        this.firstFormGroup.controls.municipio.setValue(null);
      });
  }

  private carregarComboEixos() {
    this.eixoService.buscarEixosParaCombo(true).subscribe(response => {
      this.listaEixosCombo = response;
      this.listaEixosCombo = response as Array<Eixo>;
      this.buscarBoaPratica();
    });
  }

  public async eixoSelecionado(event: any) {
    this.listaMetasCombo = [];
    this.fifthFormGroup.controls.metasOds.setValue(null);
    this.listaIndicadoresCombo = [];
    this.fifthFormGroup.controls.indicadores.setValue(null);
    this.listaOdsCombo = event.listaODS.sort(this.ordenarPorNumero);
    this.fifthFormGroup.controls.ods.setValue(null);
    this.listaIndicadoresSelecionados = []
    this.dataSourceIndicadores = new MatTableDataSource(
      this.listaIndicadoresSelecionados
    );
  }

  public async odsSelecionado(event: any) {
    this.listaIndicadoresCombo = [];
    this.fifthFormGroup.controls.indicadores.setValue(null);
    this.fifthFormGroup.controls.metasOds.setValue(null);
    let listaMetasComboAux: Array<MetaObjetivoDesenvolvimentoSustentavel> = [];
    for (const ods of event as Array<ObjetivoDesenvolvimentoSustentavel>) {
      for (const meta of ods.metas) {
        listaMetasComboAux.push(meta);
      }
    }
    this.listaMetasCombo = listaMetasComboAux;
    this.listaIndicadoresSelecionados = []
    this.dataSourceIndicadores = new MatTableDataSource(
      this.listaIndicadoresSelecionados
    );
  }

  public async metasSelecionadas(event: any) {
    this.listaIndicadoresCombo = [];
    this.fifthFormGroup.controls.indicadores.setValue(null);
    let listaIndicadoresComboAux: Array<Indicador> = [];
    for (const meta of event as Array<MetaObjetivoDesenvolvimentoSustentavel>) {
      for (const indicador of meta.indicadores) {
        listaIndicadoresComboAux.push(indicador);
      }
    }
    this.listaIndicadoresCombo = listaIndicadoresComboAux;
    this.filteredOptionsIndicador = this.fifthFormGroup.controls.indicadores.valueChanges.pipe(startWith(''), map(value => this._filterIndicador(value)));
    this.listaIndicadoresSelecionados = []
    this.dataSourceIndicadores = new MatTableDataSource(
      this.listaIndicadoresSelecionados
    );
  }

  public indicadoresSelecionados(event: any) {
    let listaIndicadoresSemVerificar = this.listaIndicadoresSelecionados;
    listaIndicadoresSemVerificar.push(event);
    this.listaIndicadoresSelecionados = listaIndicadoresSemVerificar.filter(function(atual, i) {
      return listaIndicadoresSemVerificar.indexOf(atual) === i;
    })

    this.dataSourceIndicadores = new MatTableDataSource(
      this.listaIndicadoresSelecionados
    );
  }

  public deletarIndicador(indicador: Indicador): void {
    this.listaIndicadoresSelecionados.splice(this.listaIndicadoresSelecionados.indexOf(indicador), 1);
    this.dataSourceIndicadores = new MatTableDataSource(this.listaIndicadoresSelecionados);
  }

  public deletarSolucoes(solucao: any): void {
    this.listaSolucoesSelecionados.splice(this.listaSolucoesSelecionados.indexOf(solucao), 1);
    this.dataSourceSolucoes = new MatTableDataSource(this.listaSolucoesSelecionados);
  }

  public finalizar() {
    this.desabilitarBotaoSalvar = true;

    let dialogRef = this.dialog.open(this.modalLoading, {
      height: '300px',
      width: '300px',
    });

    if (this.authService.getUsuarioLogado()) {
      this.setarDadosDoForm();
      this.boaPraticaService.inserir(this.boaPratica).subscribe(async response => {
        this.dialog.closeAll();
        this.desabilitarBotaoSalvar = false;
        await PcsUtil.swal().fire({
          title: 'Boa prática',
          text: `Boa prática cadastrada`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.router.navigate(['/cadastro-boas-praticas']);
        }, error => { });
      }, error => {
        this.dialog.closeAll();
        this.desabilitarBotaoSalvar = false;
      });
    }
    else{
      this.dialog.closeAll();
      this.desabilitarBotaoSalvar = false;
      PcsUtil.swal().fire('Você precisa relogar.', 'Por favor recarregue sua página e faça login novamente.', 'error');
    }
  }

  public async processFile(event: any) {
    if (this.arquivosFonteReferencia.length < 2) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.arquivo = new Arquivo();
        this.arquivo.nomeArquivo = event.target.files[0].name;
        this.arquivo.extensao = reader.result.toString().split(',')[0];
        this.arquivo.conteudo = reader.result.toString().split(',')[1];
        this.arquivosFonteReferencia.push(this.arquivo);
        this.dataSourceFonteReferencia = new MatTableDataSource(this.arquivosFonteReferencia);
      };
    } else {
      PcsUtil.swal().fire({
        title: 'Limite de arquivos atingido',
        text: `Maximo de dois arquivos`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
    }
  }

  public carregarAtributosBoaPratica() {

    this.carregarInformacoesDasCombos();

    this.firstFormGroup.controls.site.setValue(this.boaPratica.site);
    this.firstFormGroup.controls.email.setValue(this.boaPratica.email);
    this.firstFormGroup.controls.contato.setValue(this.boaPratica.contato);
    this.firstFormGroup.controls.celular.setValue(this.boaPratica.celular);
    this.firstFormGroup.controls.endereco.setValue(this.boaPratica.endereco);
    this.firstFormGroup.controls.telefone.setValue(this.boaPratica.telefone);
    this.firstFormGroup.controls.nomeInstituicao.setValue(this.boaPratica.nomeInstituicao);
    this.firstFormGroup.controls.nomeResponsavel.setValue(this.boaPratica.nomeResponsavel);
    this.firstFormGroup.controls.autorImagemPrincipal.setValue(this.boaPratica.autorImagemPrincipal);

    if (this.boaPratica.dtInicio) {
      this.firstFormGroup.controls.dtInicio.setValue(moment(this.boaPratica.dtInicio).format('YYYY-MM-DD'));
    }
    if (this.boaPratica.dataPublicacao) {
      this.firstFormGroup.controls.dataPublicacao.setValue(moment(this.boaPratica.dataPublicacao).format('YYYY-MM-DD'));
    }
    this.firstFormGroup.controls.paginaInicial.setValue(this.boaPratica.paginaInicial);
    this.firstFormGroup.controls.possuiFiltro.setValue(this.boaPratica.possuiFiltro);

    this.imagensGaleria = this.boaPratica.galeriaDeImagens != null ? this.boaPratica.galeriaDeImagens : [];
    for (let item of this.imagensGaleria) {
      item.safeUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + item.conteudo);
    }
    this.nomeAutor = this.firstFormGroup.controls.nomeAutor.value;

    if(this.boaPratica.imagemPrincipal !== null) {
      this.imagemPrincipal = this.boaPratica.imagemPrincipal;
      this.imagemPrincipal.safeUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + this.imagemPrincipal.conteudo);
      this.firstFormGroup.controls.imagemPrincipal.setValue(this.imagemPrincipal);
      this.firstFormGroup.controls.nomeAutor.setValue(this.imagemPrincipal.nomeAutor);
    }

    if (this.boaPratica.galeriaDeVideos) {
      for (const item of this.boaPratica.galeriaDeVideos) {
        if (item !== '') {
          this.galeriaDeVideos.push({
            url: item,
            safeUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(item)
          });
        }
      }
    }

    this.secondFormGroup.controls.titulo.setValue(this.boaPratica.titulo);
    this.secondFormGroup.controls.subtitulo.setValue(this.boaPratica.subtitulo);
    this.secondFormGroup.controls.objetivoGeral.setValue(this.boaPratica.objetivoGeral);
    this.secondFormGroup.controls.objetivoEspecifico.setValue(this.boaPratica.objetivoEspecifico);
    this.secondFormGroup.controls.principaisResultados.setValue(this.boaPratica.principaisResultados);

    this.thirdFormGroup.controls.publicoAtingido.setValue(this.boaPratica.publicoAtingido);
    this.thirdFormGroup.controls.parceirosEnvolvidos.setValue(this.boaPratica.parceirosEnvolvidos);
    this.thirdFormGroup.controls.aprendizadoFundamental.setValue(this.boaPratica.aprendizadoFundamental);

    this.fourthFormGroup.controls.fontesReferencia.setValue(this.boaPratica.fontesReferencia);
    this.fourthFormGroup.controls.resultadosQualitativos.setValue(this.boaPratica.resultadosQualitativos);
    this.fourthFormGroup.controls.parametrosContemplados.setValue(this.boaPratica.parametrosContemplados);
    this.fourthFormGroup.controls.resultadosQuantitativos.setValue(this.boaPratica.resultadosQuantitativos);

    this.filteredOptionsSolucao = this.fifthFormGroup.controls.solucoes.valueChanges.pipe(startWith(''), map(value => this._filterSolucao(value)));
    this.fifthFormGroup.controls.solucoes.setValue(this.boaPratica.solucoes);
    this.listaSolucoesSelecionados = this.fifthFormGroup.controls.solucoes.value;
    this.dataSourceSolucoes = new MatTableDataSource(
      this.listaSolucoesSelecionados.sort(this.ordenar)
    );
    this.sixthFormGroup.controls.informacoesComplementares.setValue(this.boaPratica.informacoesComplementares);
  }

  private carregarInformacoesDasCombos() {
    /*Combo País*/
    if (this.boaPratica.idPais) {
      const paisSelecionado: Pais = this.listaPaisesCombo.filter(x => x.id === this.boaPratica.idPais)[0];
      this.firstFormGroup.controls.pais.setValue(paisSelecionado);
      this.carregarEstadoSelecionado(paisSelecionado.id, this.boaPratica.idEstado, this.boaPratica.idMunicipio);
    }

    /*Combo Eixo*/
    const eixoSelecionado: Eixo = this.listaEixosCombo.filter(x => x.id === this.boaPratica.idEixo)[0];
    this.fifthFormGroup.controls.eixo.setValue(eixoSelecionado);
    this.carregarOdsSelecionados(eixoSelecionado);
  }

  private carregarEstadoSelecionado(idPais: number, idEstado: number, idMunicipio: number) {
    this.estadoService.buscarPorPais(idPais).subscribe(response => {
      this.listaProvinciaEstadoAutoComplete = response;
      this.listaProvinciaEstadoAutoComplete = response as Array<ProvinciaEstado>;
      this.listaProvinciaEstadoFiltrada = this.firstFormGroup.controls.estado.valueChanges.pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.nome),
        map(name => name ? this._filter(name) : this.listaProvinciaEstadoAutoComplete.slice())
      );
      const estado: ProvinciaEstado = this.listaProvinciaEstadoAutoComplete.filter(x => x.id === idEstado)[0];
      this.firstFormGroup.controls.estado.setValue(estado);
      this.carregarMunicipioSelecionado(estado.id, idMunicipio);
    });
  }

  private carregarMunicipioSelecionado(idEstado: number, idMunicipio: number) {
    this.cidadeService.buscarCidadeParaComboPorIdEstado(idEstado).subscribe(response => {
      this.listaCidadeCombo = response;
      this.listaCidadeCombo = response as Array<ItemCombo>;
      const municipio: ItemCombo = this.listaCidadeCombo.filter(x => x.id === idMunicipio)[0];
      this.firstFormGroup.controls.municipio.setValue(municipio);
    });
  }

  private carregarOdsSelecionados(eixo: Eixo) {
    this.listaOdsCombo = eixo.listaODS;
    const odsSelecionados: ObjetivoDesenvolvimentoSustentavel[] = this.listaOdsCombo.filter(x => this.boaPratica.idsOds.includes(x.id));

    this.fifthFormGroup.controls.ods.setValue(odsSelecionados);

    this.carregarMetasSelecionadas(odsSelecionados);
  }

  private carregarMetasSelecionadas(odsSelecionados: ObjetivoDesenvolvimentoSustentavel[]) {
    const listaMetasComboAux: Array<MetaObjetivoDesenvolvimentoSustentavel> = [];
    for (const ods of odsSelecionados) {
      for (const meta of ods.metas) {
        listaMetasComboAux.push(meta);
      }
    }

    this.listaMetasCombo = listaMetasComboAux;
    const metasOdsSelecionadas: MetaObjetivoDesenvolvimentoSustentavel[] = this.listaMetasCombo.filter(x => this.boaPratica.idsMetasOds.includes(x.id));
    this.fifthFormGroup.controls.metasOds.setValue(metasOdsSelecionadas);

    this.carregarIndicadoresSelecionados(metasOdsSelecionadas);
  }

  private carregarIndicadoresSelecionados(metasOdsSelecionadas: MetaObjetivoDesenvolvimentoSustentavel[]) {
    const listaIndicadoresComboAux: Array<Indicador> = [];
    for (const meta of metasOdsSelecionadas) {
      for (const indicador of meta.indicadores) {
        listaIndicadoresComboAux.push(indicador);
      }
    }
    this.listaIndicadoresCombo = listaIndicadoresComboAux;

    const indicadoresSelecionados: Indicador[] = this.listaIndicadoresCombo.filter(x => this.boaPratica.idsIndicadores.includes(x.id));
    this.listaIndicadoresSelecionados = indicadoresSelecionados;
    this.dataSourceIndicadores = new MatTableDataSource(
      this.listaIndicadoresSelecionados
    );
    this.fifthFormGroup.controls.indicadores.setValue(indicadoresSelecionados);
    this.filteredOptionsIndicador = this.fifthFormGroup.controls.indicadores.valueChanges.pipe(startWith(''), map(value => this._filterIndicador(value)));
  }

  public editar() {
    this.desabilitarBotaoSalvar = true;

    let dialogRef = this.dialog.open(this.modalLoading, {
      height: '300px',
      width: '300px',
    });
    this.setarDadosDoForm();
    this.boaPraticaService.editar(this.boaPratica).subscribe(async response => {
      this.dialog.closeAll();
      this.desabilitarBotaoSalvar = false;
      await PcsUtil.swal().fire({
        title: 'Alteração de Boa Prática',
        text: `Boa Prática atualizada`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/cadastro-boas-praticas']);
      }, error => { });
      this.router.navigate(['/cadastro-boas-praticas']);
    }, error => {
      this.dialog.closeAll();
      this.desabilitarBotaoSalvar = false;
     });
  }

  private setarDadosDoForm() {
    this.imagemPrincipal.nomeAutor = this.nomeAutor;
    this.boaPratica.imagemPrincipal = this.imagemPrincipal;
    this.boaPratica.galeriaDeImagens = this.imagensGaleria;
    this.boaPratica.possuiFiltro = this.firstFormGroup.controls.possuiFiltro.value;
    // this.boaPratica.galeriaDeVideos = this.galeriaDeVideos;
    this.nomeAutor = this.firstFormGroup.controls.nomeAutor.value;
    this.boaPratica.site = this.firstFormGroup.controls.site.value;
    this.boaPratica.email = this.firstFormGroup.controls.email.value;
    this.boaPratica.idPais = this.firstFormGroup.controls.pais.value.id;
    this.boaPratica.contato = this.firstFormGroup.controls.contato.value;
    this.boaPratica.celular = this.firstFormGroup.controls.celular.value;
    this.boaPratica.endereco = this.firstFormGroup.controls.endereco.value;
    this.boaPratica.telefone = this.firstFormGroup.controls.telefone.value;
    this.boaPratica.idEstado = this.firstFormGroup.controls.estado.value.id;
    this.boaPratica.idMunicipio = this.firstFormGroup.controls.municipio.value.id;
    this.boaPratica.paginaInicial = this.firstFormGroup.controls.paginaInicial.value;
    this.boaPratica.nomeInstituicao = this.firstFormGroup.controls.nomeInstituicao.value;
    this.boaPratica.nomeResponsavel = this.firstFormGroup.controls.nomeResponsavel.value;
    this.boaPratica.autorImagemPrincipal = this.firstFormGroup.controls.autorImagemPrincipal.value;
    this.boaPratica.dtInicio = this.firstFormGroup.controls.dtInicio ? this.firstFormGroup.controls.dtInicio.value : null;
    this.boaPratica.dataPublicacao = this.firstFormGroup.controls.dataPublicacao ? this.firstFormGroup.controls.dataPublicacao.value : null;


    const videos: string[] = [];
    for (const video of this.galeriaDeVideos) {
      videos.push(video.url);
    }
    this.boaPratica.galeriaDeVideos = videos;

    this.boaPratica.titulo = this.secondFormGroup.controls.titulo.value;
    this.boaPratica.subtitulo = this.secondFormGroup.controls.subtitulo.value;
    this.boaPratica.objetivoGeral = this.secondFormGroup.controls.objetivoGeral.value;
    this.boaPratica.objetivoEspecifico = this.secondFormGroup.controls.objetivoEspecifico.value;
    this.boaPratica.principaisResultados = this.secondFormGroup.controls.principaisResultados.value;

    this.boaPratica.publicoAtingido = this.thirdFormGroup.controls.publicoAtingido.value;
    this.boaPratica.parceirosEnvolvidos = this.thirdFormGroup.controls.parceirosEnvolvidos.value;
    this.boaPratica.aprendizadoFundamental = this.thirdFormGroup.controls.aprendizadoFundamental.value;

    this.boaPratica.fontesReferencia = this.fourthFormGroup.controls.fontesReferencia.value;
    this.boaPratica.resultadosQualitativos = this.fourthFormGroup.controls.resultadosQualitativos.value;
    this.boaPratica.parametrosContemplados = this.fourthFormGroup.controls.parametrosContemplados.value;
    this.boaPratica.resultadosQuantitativos = this.fourthFormGroup.controls.resultadosQuantitativos.value;

    this.boaPratica.idEixo = this.fifthFormGroup.controls.eixo.value.id;
    this.boaPratica.solucoes = this.listaSolucoesSelecionados;

    const idsOdsSelecionados: number[] = [];
    for (const ods of this.fifthFormGroup.controls.ods.value) {
      idsOdsSelecionados.push(ods.id);
    }
    this.boaPratica.idsOds = idsOdsSelecionados;

    const idsMetasOdsSelecionadas: number[] = [];
    if (this.fifthFormGroup.controls.metasOds.value) {
      for (const meta of this.fifthFormGroup.controls.metasOds.value) {
        idsMetasOdsSelecionadas.push(meta.id);
      }
    }
    this.boaPratica.idsMetasOds = idsMetasOdsSelecionadas;
    const idsIndicadoresSelecionados: number[] = [];
    if (this.listaIndicadoresSelecionados) {
      for (const indicador of this.listaIndicadoresSelecionados) {
        idsIndicadoresSelecionados.push(indicador.id);
      }
    }
    this.boaPratica.idsIndicadores = idsIndicadoresSelecionados;
    this.boaPratica.informacoesComplementares = this.sixthFormGroup.controls.informacoesComplementares.value;
  }

  public converterSolucoesAPIEmObjetoPCS(solucoesApi: any){
    let solucoesPCSList = [];
    let solucaoPCSObject: any = {};
    if (solucoesApi) {
      solucoesApi.forEach(solucaoAPI => {
        if(solucaoAPI.geral){
          solucaoPCSObject._id = solucaoAPI._id;
          solucaoPCSObject.tema = solucaoAPI.geral.tema.tema;
          solucaoPCSObject.nome = solucaoAPI.geral.nome;
          solucaoPCSObject.caracterizacaoSolucao = solucaoAPI.geral.caracterizacaoSolucao;
          solucoesPCSList.push(solucaoPCSObject);
          solucaoPCSObject = {};
        }
      })
    }
    return solucoesPCSList;
  }

  public isUsuarioPrefeitura(): boolean {
    if (localStorage.getItem('usuarioLogado') != null && Boolean(JSON.parse(localStorage.getItem('usuarioLogado')).usuarioPrefeitura) === true) {
      this.boaPratica.idPrefeituraCadastro = JSON.parse(localStorage.getItem('usuarioLogado')).dadosPrefeitura.id;
      return true;
    }
    return false;
  }

  public carregarInfoPrefeituraLogada() {
    this.prefeituraService.buscarPaisEstadoCidadePorPrefeitura(this.boaPratica.idPrefeituraCadastro).subscribe(response => {
      const paisSelecionado: Pais = this.listaPaisesCombo.filter(x => x.id === response.idPais)[0];
      this.firstFormGroup.controls.pais.setValue(paisSelecionado);
      this.carregarEstadoSelecionado(paisSelecionado.id, response.idEstado, response.idCidade);
    });
  }

  private verificaPermissaoEdicao() {
    if (this.modoEdicao && this.modoPrefeitura && JSON.parse(localStorage.getItem('usuarioLogado')).dadosPrefeitura.cidade.id != this.boaPratica.idMunicipio) {
      this.router.navigate([`/institucional`]);
      swal.fire('Sem permissão', 'Você não possui permissão para editar os dados dessa Boa Prática!', 'warning');
    }

    if (this.modoEdicao && this.modoPrefeitura && this.boaPratica.idPrefeituraCadastro == null) {
      this.router.navigate([`/institucional`]);
      swal.fire('Sem permissão', 'Você não possui permissão para editar os dados dessa Boa Prática!', 'warning');
    }

    if (this.modoEdicao && !this.modoPrefeitura && this.boaPratica.idPrefeituraCadastro != null) {
      this.router.navigate([`/institucional`]);
      swal.fire('Sem permissão', 'Você não possui permissão para editar os dados dessa Boa Prática!', 'warning');
    }

  }

  /*Upload imagem*/
  _handleReaderLoadedPrincipal(readerEvt) {
    const imagem: ImagemBoaPratica = new ImagemBoaPratica();
    imagem.conteudo = btoa(readerEvt.target.result);
    imagem.tipo = 'principal';
    imagem.safeUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + imagem.conteudo);
    this.imagemPrincipal = imagem;
    this.firstFormGroup.controls.imagemPrincipal.setValue(this.imagemPrincipal);
  }

  _handleReaderLoadedGaleria(readerEvt) {
    if (this.imagensGaleria.length < 6) {
      const imagem: ImagemBoaPratica = new ImagemBoaPratica();
      imagem.conteudo = btoa(readerEvt.target.result);
      imagem.tipo = 'galeria';
      imagem.safeUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + imagem.conteudo);
      this.imagensGaleria.push(imagem);
    } else {
      PcsUtil.swal().fire({
        title: 'Limite de arquivos atingido',
        text: `Máximo de seis arquivos`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
    }
  }

  processImage(eventInput: any, nomeInput: string) {
   this.loading = true;
   const reader = new FileReader();
   reader.readAsDataURL(eventInput.target.files[0]);
   reader.onload = () => {

     this.arquivo.nomeArquivo = eventInput.target.files[0].name;
     this.arquivo.extensao = reader.result.toString().split(',')[0];
     this.arquivo.conteudo = reader.result.toString().split(',')[1];

     if (PcsUtil.tamanhoArquivoEstaDentroDoLimite(reader.result.toString().split(',')[1])) {

      const file: File = eventInput.target.files[0];
      const reader = new FileReader();
      if (nomeInput === 'principal') {
        reader.onload = this._handleReaderLoadedPrincipal.bind(this);
      } else if (nomeInput === 'galeria') {
        reader.onload = this._handleReaderLoadedGaleria.bind(this);
      }
      reader.readAsBinaryString(file);

      } else {
       PcsUtil.swal().fire({
         title: 'Cadastro de Boas Práticas',
         text: `Arquivo excede o tamanho limite de 10 MB`,
         type: 'warning',
         showCancelButton: false,
         confirmButtonText: 'Ok',
       }).then((result) => {
       }, error => { });
     }

   };
   this.loading = false;

  }

  public deletarImagemDaGaleria(imagem: ImagemBoaPratica) {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    });

    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a imagem?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.imagensGaleria.splice(this.imagensGaleria.indexOf(imagem), 1);
        if (imagem.id != null) {
          this.boaPraticaService.excluirImagemBoaPratica(imagem.id).subscribe();
        }

      }
    });
  }

  public deletarImagemPrincipal(imagem: ImagemBoaPratica) {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    });

    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a imagem?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.imagemPrincipal = null;
        this.firstFormGroup.controls.imagemPrincipal.setValue(null);
        this.firstFormGroup.controls.nomeAutor.setValue(null);
      }
    });
  }

  public adicionarVideo() {

    let videoUrl = this.firstFormGroup.controls.urlVideo.value;

    const regexpYoutube = new RegExp('https:\/\/www.youtube.com\/watch\\?v=[A-z0-9]+');
    const regexpYoutubeEmbed = new RegExp('https:\/\/www.youtube.com\/embed\/[A-z0-9]+');
    const regexpVimeo = new RegExp('https:\/\/player.vimeo.com\/video\/[A-z0-9]');

    if (regexpYoutube.test(videoUrl)) {
      const videoId = videoUrl.substr(32, videoUrl.length);
      videoUrl = 'https://www.youtube.com/embed/' + videoId;
    }

    if (regexpYoutubeEmbed.test(videoUrl) || regexpVimeo.test(videoUrl)) {
      this.galeriaDeVideos.push({
        url: videoUrl,
        safeUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(videoUrl)
      });
    }
    this.firstFormGroup.controls.urlVideo.setValue('');
  }

  public deletarVideoDaGaleria(video: Video) {
    this.galeriaDeVideos.splice(this.galeriaDeVideos.indexOf(video), 1);
  }

  public getTextoExibicaoProvinciaEstado(user?: ProvinciaEstado): string | undefined {
    return user ? user.nome : undefined;
  }

  private _filter(name: string): ProvinciaEstado[] {
    const filterValue = name.toLowerCase();
    return this.listaProvinciaEstadoAutoComplete.filter(option => option.nome.toLowerCase().indexOf(filterValue) === 0);
  }

  public onEnter(value: string, item: ImagemBoaPratica ) {
    item.nomeAutor = value;
  }

  public prepararPreVisualizacao(selectedIndex: number) {
    if (selectedIndex == 6) {
      this.setarDadosDoForm();
      this.preVisualizacaoComponent.carregarInformacoesDaCidade();
    }
  }

  public fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  public imageCropped(event: ImageCroppedEvent) {
    const imagem: ImagemBoaPratica = new ImagemBoaPratica();
    imagem.conteudo = event.base64.split('base64,')[1];
    imagem.tipo = 'principal';
    imagem.safeUrl = this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + imagem.conteudo);
    this.imagemPrincipal = imagem;
    this.firstFormGroup.controls.imagemPrincipal.setValue(this.imagemPrincipal);
  }

  getLabelIndicador(indicador: string){
    if(this.listaIndicadoresCombo.find(x => x.nome == indicador)){
      return this.listaIndicadoresCombo.find(x => x.nome == indicador).nome;
    }else{
      return "";
    }
  }

  getLabelSolucao(solucao: string){
    if(this.solucoesIntegracao.find(x => x.nome == solucao)){
      return this.solucoesIntegracao.find(x => x.nome == solucao).nome;
    }else{
      return "";
    }
  }

  public solucoesSelecionadas(event: any) {
    let index = this.listaSolucoesSelecionados.findIndex(valor => valor._id == event._id);
    if(index < 0) {
      this.listaSolucoesSelecionados.push(event);
    }
    this.dataSourceSolucoes = new MatTableDataSource(
      this.listaSolucoesSelecionados.sort(this.ordenar)
    );
  }

  private _filterIndicador(value: string): Array<Indicador> {
    if (value && typeof value == "string" && value != undefined) {
      const filterValue = value;
      return this.listaIndicadoresCombo.filter(option => option.nome.toLowerCase().includes(filterValue.toLowerCase()));
    } else {
        return this.listaIndicadoresCombo.slice(0, this.listaIndicadoresCombo.length)
     
    }
  }

  private _filterSolucao(value: string): Array<any> {
    if (value && typeof value == "string" && value != undefined) {
      const filterValue = value;
      return this.solucoesIntegracao.filter(option => option.nome.toLowerCase().includes(filterValue.toLowerCase())).sort(this.ordenar);
    } else {
        return this.solucoesIntegracao.slice(0, this.solucoesIntegracao.length).sort(this.ordenar)
    }
  }

  public insertBlockquoteButton() {
    return (context) => {
      const ui = $.summernote.ui;
      const button = ui.button({
        contents: 'Blockquote',
        tooltip: 'Blockquote',
        click: function () {
          document.execCommand('insertHtml', null, '<blockquote>BLOCKQUOTE</blockquote>');
        }
      });
      return button.render();
    }
  }

  public intertituloH1Button() {
    return (context) => {
      const ui = $.summernote.ui;
      const button = ui.button({
        contents: 'H1',
        tooltip: 'H1',
        click: function () {
          document.execCommand('insertHtml', null, '<h1>Intertítulo H1</h1>');
        }
      });
      return button.render();
    }
  }

  public intertituloH2Button() {
    return (context) => {
      const ui = $.summernote.ui;
      const button = ui.button({
        contents: 'H2',
        tooltip: 'H2',
        click: function () {
          document.execCommand('insertHtml', null, '<h2>Intertítulo H2</h2>');
        }
      });
      return button.render();
    }
  }

  public intertituloH3Button() {
    return (context) => {
      const ui = $.summernote.ui;
      const button = ui.button({
        contents: 'H3',
        tooltip: 'H3',
        click: function () {
          document.execCommand('insertHtml', null, '<h3>Intertítulo H3</h3>');
        }
      });
      return button.render();
    }
  }

  ordenarPorNumero(a, b) {
    if ( a.numero < b.numero){
      return -1;
    }
    if ( a.numero > b.numero){
      return 1;
    }
    return 0;
  }

}
