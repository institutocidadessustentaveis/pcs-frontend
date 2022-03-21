import swal from 'sweetalert2';
import { Pais } from 'src/app/model/pais';
import { Eixo } from 'src/app/model/eixo';
import { Arquivo } from 'src/app/model/arquivo';
import { Usuario } from 'src/app/model/usuario';
import { Component, OnInit } from '@angular/core';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { Indicador } from 'src/app/model/indicadores';
import { Biblioteca } from 'src/app/model/biblioteca';
import { MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { PaisService } from 'src/app/services/pais.service';
import { EixoService } from 'src/app/services/eixo.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { CidadeService } from 'src/app/services/cidade.service';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ImagemBiblioteca } from 'src/app/model/imagemBiblioteca';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { BibliotecaService } from 'src/app/services/bibliotecaService';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { GrupoAcademicoCombo } from './../../../model/GrupoAcademicoCombo';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { GrupoAcademicoService } from 'src/app/services/grupo-academico.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { Video } from '../../modulo_boas_praticas/boas-praticas/boa-pratica-form/boas-praticas-form.component';
import { ObjetivoDesenvolvimentoSustentavelService } from './../../../services/objetivo-desenvolvimento-sustentavel.service';

@Component({
  selector: 'app-biblioteca-form',
  templateUrl: './biblioteca-form.component.html',
  styleUrls: ['./biblioteca-form.component.css']
})
export class BibliotecaFormComponent implements OnInit {

  public usuario: Usuario;
  public shapeFiles: any[];
  public nomeArquivoImagemCapa;
  public modulos: Array<String>;
  public idiomas: Array<String>;
  public loading: boolean = false;
  public formBiblioteca: FormGroup;
  public tipoArquivo: Array<String>;
  public publicoAlvo: Array<String>;
  public eixoCombo: Array<Eixo> = [];
  public paisCombo: Array<Pais> = [];
  public tipoMaterial: Array<String>;
  public imageChangedEvent: any = '';
  public tiposAutores: Array<String>;
  public localExibicao: Array<String>;
  public galeriaDeVideos: Video[] = [];
  public estados: Array<ItemCombo> = [];
  public galeriaDeAudios: Arquivo[] = [];
  public arquivo: Arquivo = new Arquivo();
  public imagemPrincipal: ImagemBiblioteca;
  public arquivosMultimidia: Arquivo[] = [];
  public desabilitarSalvar: boolean = false;
  public metasOdsCombo: Array<ItemCombo> = [];
  public indicadorCombo: Array<Indicador> = [];
  public biblioteca: Biblioteca = new Biblioteca();
  public mostrarGrupoAcademicoNome: boolean = false;
  public arquivoOutrosTipos: Arquivo = new Arquivo();
  public cidadesComboCompleta: Array<ItemCombo> = [];
  public cidadesComboFiltrada: Array<ItemCombo> = [];
  public displayedColumnsArquivosMultimidia: string[];
  public areasInteresseCombo: Array<AreaInteresse> = [];
  public gruposAcademicosCombo: Array<GrupoAcademicoCombo> = [];
  public odsCombo: Array<ObjetivoDesenvolvimentoSustentavel> = [];
  public dataSourceArquivosMultimidia: MatTableDataSource<Arquivo>;

  public editorConfig: any;

  constructor(
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
    private eixoService: EixoService,
    private paisService: PaisService,
    public domSanitizer: DomSanitizer,
    private cidadeService: CidadeService,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private shapeFileService: ShapeFileService,
    private bibliotecaService: BibliotecaService,
    private estadoService: ProvinciaEstadoService,
    private indicadoresService: IndicadoresService,
    private areaInteresseService: AreaInteresseService,
    private grupoAcademicoService: GrupoAcademicoService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
  ) {
    this.formBiblioteca = this.formBuilder.group({
      ods: [null],
      meta: [null],
      eixos: [null],
      cidade: [null],
      estado: [null],
      idioma: [null],
      modulo: [null],
      urlVideo: [null],
      tipoAutor: [null],
      subtitulo: [null],
      descricao: [null],
      shapeFiles: [null],
      imagemCapa: [null],
      publicoAlvo: [null],
      instituicao: [null],
      indicadores: [null],
      palavraChave: [null],
      tipoMaterial: [null],
      localExibicao: [null],
      paisPublicacao: [null],
      areasInteresse: [null],
      grupoAcademico: [null],
      galeriaDeAudios: [null],
      arquivoMultimidia: [null],
      autor: [null, Validators.required],
      tituloPublicacao: [null, Validators.required],
      grupoAcademicoNome: [null],
    })

    this.editorConfig = {
      height: '200px',
      toolbar: [
        ['misc', ['undo', 'redo']],
        ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
        ['fontsize', []],
        ['para', ['style0', 'ul', 'ol']],
        ['insert', ['table', 'picture', 'link']],
        ['view', ['fullscreen']]
      ],
      fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
      callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
    };

    this.displayedColumnsArquivosMultimidia = [
      "nomeArquivo",
      "remover"
    ];

    this.tipoMaterial = [
      'PDF',
      'DOCX',
      'ODT',
      'TXT',
      'PPT',
      'CSV',
      'XLSX',
      'SHP',
      'TIFF',
      'JPG',
      'GIF',
      'MP3',
      'MP4',
      'MKV',
      'AVCHD',
      'MOV/QT',
      'FLV/SWF',
      'AVI/WMV',
      'Link de Texto',
      'Link de Áudio',
      'Link de Vídeo'
    ]
    this.localExibicao = [
      'Publicações não PCS',
      'Institucional sobre o PCS',
      'Publicações Orientações do PCS',
    ]
    this.publicoAlvo = [
      'Outro',
      'Academia',
      'Estudantes',
      'Empresarial',
      'Sociedade Civil',
      'Gestores Públicos',
      'Técnicos Municipais',
    ]
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
      "Plano, Leis e Regulamentações",
    ]
    this.idiomas = [
      'Outra',
      'Inglês',
      'Alemão',
      'Chinês',
      'Francês',
      'Japonês',
      'Espanhol',
      'Italiano',
      'Português',
      'Tupi/Macro-Jê',
    ]

    this.tiposAutores = [
      'PCS',
      'RNSP',
      'ICS',
      'Governo',
      'Academia',
      'Iniciativa Privada',
      'Organização da Sociedade Civil',
    ]

  }

  ngOnInit() {
    this.carregarCombos();
    this.carregarUsuario();
    this.buscarBiblioteca();
    this.carregarEstadoECidade();
    this.titleService.setTitle(`Biblioteca - Cidades Sustentáveis`)
  }

  public buscarBiblioteca() {
    this.activatedRoute.params.subscribe( params => {
      let id = params.id;
      if (id) {
        this.loading = true;
        this.bibliotecaService.buscarBibliotecaPorId(id).subscribe( biblioteca => {         
          this.biblioteca = biblioteca as Biblioteca;
          this.carregarEstadoECidade();
          this.carregarAtributos();
          this.loading = false;
          this.titleService.setTitle(`Biblioteca - ${this.biblioteca.tituloPublicacao} - Cidades Sustentáveis`)
        }, error => { this.router.navigate(['/biblioteca/administracao']); });
      }
    }, error => {
      this.router.navigate(['/biblioteca/administracao']);
    });
  }

  public buscarComboAreasInteresse() {
    this.areaInteresseService.buscaAreasInteresses()
    .subscribe(res => this.areasInteresseCombo = res)
  }
  public buscarComboPaises() {
    this.paisService.buscarPaisesCombo()
    .subscribe(res => this.paisCombo = res);
  }
  public buscarComboEixos() {
    this.eixoService.buscarEixosParaCombo(false)
    .subscribe(res => this.eixoCombo = res);
  }

  public buscarComboOds() {
    this.odsService.buscarOdsCombo()
    .subscribe(res => this.odsCombo = res);
  }
  public buscarComboIndicadores() {
    this.indicadoresService.buscarIndicadoresPcsParaCombo()
    .subscribe(res => this.indicadorCombo = res);
  }
  public carregarCombos() {
    this.buscarComboOds();
    this.buscarComboEixos();
    this.buscarComboPaises();
    this.buscarComboShapes();
    this.buscarComboIndicadores();
    this.buscarComboAreasInteresse();
    this.buscarComboGruposAcademicos();
  }

  private buscarComboShapes() {
    this.shapeFileService.buscarShapesListagemMapa().subscribe((shapes) => {
      this.shapeFiles = shapes;
    });
  }

  public carregarEstadoECidade(){
    if(this.formBiblioteca.controls.paisPublicacao.value){
      this.onPaisChange();
    }

    if(this.formBiblioteca.controls.estado.value){
      this.onEstadoChange();
    }
  }

  public carregarUsuario() {
    this.usuarioService.buscarUsuarioLogado()
    .subscribe( usuario => this.usuario = usuario);
  }

  public onPaisChange() {
    this.estadoService.buscarProvinciaEstadoComboPorPais(this.formBiblioteca.controls.paisPublicacao.value).subscribe(res => {
      this.estados = res;
      this.cidadesComboFiltrada = [];
    })
  }

  public onEstadoChange() {
    this.cidadeService.buscarCidadeParaComboPorIdEstado(this.formBiblioteca.controls.estado.value).subscribe(res => {
      this.cidadesComboFiltrada = res;
    })
  }

  public carregarMetasOds() {
    this.metasOdsCombo = [];
    if (this.formBiblioteca.controls.ods.value) {
     let odsSelecionados = [];
     odsSelecionados = this.formBiblioteca.controls.ods.value;
     odsSelecionados.forEach(ods => {
       this.odsService.buscarMetaOdsPorIdOdsItemCombo(ods)
       .subscribe(metas =>{
        metas.forEach(meta => {
          this.metasOdsCombo.push(meta)
        });
        })
     });
    }
  }

  public fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  public grupoAcademicoChange(tipo) {
    if (tipo === "Outro") {
      this.mostrarGrupoAcademicoNome = true;
      this.formBiblioteca.controls.grupoAcademicoNome.setValidators([Validators.required])
    }
    else {
      this.mostrarGrupoAcademicoNome = false;
      this.biblioteca.grupoAcademicoNome = null;
      this.formBiblioteca.controls.grupoAcademicoNome.setValue(null)
      this.formBiblioteca.controls.grupoAcademicoNome.setValidators([])
    
    }
  }

  public async processImage(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      const arquivo = new Arquivo();
      arquivo.nomeArquivo = event.target.files[0].name;
      this.nomeArquivoImagemCapa = event.target.files[0].name;
      arquivo.extensao = reader.result.toString().split(',')[0];
      arquivo.conteudo = reader.result.toString().split(',')[1];

      this.formBiblioteca.controls.imagemCapa.setValue(arquivo);
    };
  }

  public excluirImagemCapa() {
    this.formBiblioteca.controls.imagemCapa.setValue(null);
    this.nomeArquivoImagemCapa = null;
  }

  public salvar() {
    if (this.formBiblioteca.valid) {
      this.loading = true;
      this.desabilitarSalvar = true;
      this.biblioteca.usuario = this.usuario.id;
      this.biblioteca.ods = this.formBiblioteca.controls.ods.value;
      this.biblioteca.meta = this.formBiblioteca.controls.meta.value;
      this.biblioteca.eixos = this.formBiblioteca.controls.eixos.value;
      this.biblioteca.autor = this.formBiblioteca.controls.autor.value;
      this.biblioteca.estado = this.formBiblioteca.controls.estado.value;
      this.biblioteca.idioma = this.formBiblioteca.controls.idioma.value;
      this.biblioteca.modulo = this.formBiblioteca.controls.modulo.value;
      this.biblioteca.cidade = this.formBiblioteca.controls.cidade.value;
      this.biblioteca.subtitulo = this.formBiblioteca.controls.subtitulo.value;
      this.biblioteca.tipoAutor = this.formBiblioteca.controls.tipoAutor.value;
      this.biblioteca.descricao = this.formBiblioteca.controls.descricao.value;
      this.biblioteca.imagemCapa = this.formBiblioteca.controls.imagemCapa.value;
      this.biblioteca.shapeFiles = this.formBiblioteca.controls.shapeFiles.value;
      this.biblioteca.instituicao = this.formBiblioteca.controls.instituicao.value;
      this.biblioteca.publicoAlvo = this.formBiblioteca.controls.publicoAlvo.value;
      this.biblioteca.indicadores = this.formBiblioteca.controls.indicadores.value;
      this.biblioteca.tipoMaterial = this.formBiblioteca.controls.tipoMaterial.value;
      this.biblioteca.palavraChave = this.formBiblioteca.controls.palavraChave.value;
      this.biblioteca.localExibicao = this.formBiblioteca.controls.localExibicao.value;
      this.biblioteca.paisPublicacao = this.formBiblioteca.controls.paisPublicacao.value;
      this.biblioteca.areasInteresse = this.formBiblioteca.controls.areasInteresse.value;
      this.biblioteca.grupoAcademico = this.formBiblioteca.controls.grupoAcademico.value;
      this.biblioteca.tituloPublicacao = this.formBiblioteca.controls.tituloPublicacao.value;
      const videos: string[] = [];
      for (const video of this.galeriaDeVideos) {
        videos.push(video.url);
      }
      this.biblioteca.galeriaDeVideos = videos;
      this.biblioteca.galeriaDeAudios = this.galeriaDeAudios;
      this.biblioteca.arquivoMultimidia = this.arquivosMultimidia;
      if (this.formBiblioteca.controls.grupoAcademicoNome.value != null) {
        this.biblioteca.grupoAcademico = null;
        this.biblioteca.grupoAcademicoNome = this.formBiblioteca.controls.grupoAcademicoNome.value;
      }
      else {
        this.biblioteca.grupoAcademico = this.formBiblioteca.controls.grupoAcademico.value;
      }
      if (this.biblioteca.id) return this.editar()
      
      this.cadastrar();

    }
  }
  carregarAtributos() {

    this.formBiblioteca.controls.ods.setValue(this.biblioteca.ods);
    this.formBiblioteca.controls.meta.setValue(this.biblioteca.meta);
    this.formBiblioteca.controls.eixos.setValue(this.biblioteca.eixos);
    this.formBiblioteca.controls.autor.setValue(this.biblioteca.autor);
    this.formBiblioteca.controls.ods.setValue(this.biblioteca.ods);
    this.formBiblioteca.controls.estado.setValue(this.biblioteca.estado);
    this.formBiblioteca.controls.cidade.setValue(this.biblioteca.cidade);
    this.formBiblioteca.controls.idioma.setValue(this.biblioteca.idioma);
    this.formBiblioteca.controls.modulo.setValue(this.biblioteca.modulo);
    this.formBiblioteca.controls.tipoAutor.setValue(this.biblioteca.tipoAutor);
    this.formBiblioteca.controls.subtitulo.setValue(this.biblioteca.subtitulo);
    this.formBiblioteca.controls.descricao.setValue(this.biblioteca.descricao);
    this.formBiblioteca.controls.imagemCapa.setValue(this.biblioteca.imagemCapa);
    this.formBiblioteca.controls.shapeFiles.setValue(this.biblioteca.shapeFiles);
    this.formBiblioteca.controls.indicadores.setValue(this.biblioteca.indicadores);
    this.formBiblioteca.controls.publicoAlvo.setValue(this.biblioteca.publicoAlvo);
    this.formBiblioteca.controls.instituicao.setValue(this.biblioteca.instituicao);
    this.formBiblioteca.controls.palavraChave.setValue(this.biblioteca.palavraChave);
    this.formBiblioteca.controls.tipoMaterial.setValue(this.biblioteca.tipoMaterial);
    this.formBiblioteca.controls.localExibicao.setValue(this.biblioteca.localExibicao);
    this.formBiblioteca.controls.paisPublicacao.setValue(this.biblioteca.paisPublicacao)
    this.formBiblioteca.controls.areasInteresse.setValue(this.biblioteca.areasInteresse);
    this.formBiblioteca.controls.grupoAcademico.setValue(this.biblioteca.grupoAcademico);
    this.formBiblioteca.controls.tituloPublicacao.setValue(this.biblioteca.tituloPublicacao);
    if (this.biblioteca.imagemCapa) {
      this.nomeArquivoImagemCapa = this.biblioteca.imagemCapa.nomeArquivo;
    }
    if(this.biblioteca.arquivoMultimidia) {
      this.arquivosMultimidia = this.biblioteca.arquivoMultimidia;
      this.dataSourceArquivosMultimidia = new MatTableDataSource(
        this.arquivosMultimidia
      );
    if (this.biblioteca.grupoAcademicoNome == undefined || this.biblioteca.grupoAcademicoNome == null) {
      this.formBiblioteca.controls.grupoAcademicoNome.setValue(null);
      this.formBiblioteca.controls.grupoAcademico.setValue(this.biblioteca.grupoAcademico);
    }
    else {
      this.mostrarGrupoAcademicoNome = true
      this.formBiblioteca.controls.grupoAcademico.setValue("Outro");
      this.formBiblioteca.controls.grupoAcademicoNome.setValue(this.biblioteca.grupoAcademicoNome)
    }
    }

    this.carregarMetasOds();
    this.carregarEstadoECidade();
    if (this.biblioteca.galeriaDeVideos) {
      for (const item of this.biblioteca.galeriaDeVideos) {
        if (item !== '') {
          this.galeriaDeVideos.push({
            url: item,
            safeUrl: this.domSanitizer.bypassSecurityTrustResourceUrl(item)
          });
        }
      }
    }
    if (this.biblioteca.galeriaDeAudios) {
      this.galeriaDeAudios = this.biblioteca.galeriaDeAudios;
    }

  }

  public cadastrar() {
    this.bibliotecaService.cadastrarBiblioteca(this.biblioteca).subscribe(async response => {
      this.loading = false
      await PcsUtil.swal().fire({
        title: 'Biblioteca',
        text: `Material Cadastrado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/biblioteca/administracao']);
      }, error => { });
    });
  }

  public editar() {
    this.bibliotecaService.editarBiblioteca(this.biblioteca).subscribe(async response => {
      this.loading = false
      await PcsUtil.swal().fire({
        title: 'Biblioteca',
        text: `Material Editado`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/biblioteca/administracao']);
      }, error => { });
    });
  }

  public adicionarVideo() {

    let videoUrl = this.formBiblioteca.controls.urlVideo.value;

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
    this.formBiblioteca.controls.urlVideo.setValue('');
  }

  public deletarVideoDaGaleria(video: Video) {
    this.galeriaDeVideos.splice(this.galeriaDeVideos.indexOf(video), 1);
  }
  public excluirAudio(audio: Arquivo) {
    this.galeriaDeAudios.splice(this.galeriaDeAudios.indexOf(audio), 1);
  }

  public async processFile(event: any) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.arquivo = new Arquivo();
        this.arquivo.nomeArquivo = event.target.files[0].name;
        this.arquivo.extensao = reader.result.toString().split(',')[0];
        this.arquivo.conteudo = reader.result.toString().split(',')[1];
        this.galeriaDeAudios.push(this.arquivo);
      };
  }

  public async processFileMultimidia(event: any) {
    if (this.arquivosMultimidia.length < 5) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.arquivoOutrosTipos = new Arquivo();
        this.arquivoOutrosTipos.nomeArquivo = event.target.files[0].name;
        this.arquivoOutrosTipos.extensao = reader.result.toString().split(",")[0];
        this.arquivoOutrosTipos.conteudo = reader.result.toString().split(",")[1];
        this.arquivosMultimidia.push(this.arquivoOutrosTipos);
        this.dataSourceArquivosMultimidia = new MatTableDataSource(
          this.arquivosMultimidia
        );
      };
    } else {
      PcsUtil.swal()
        .fire({
          title: "Limite de arquivos atingido",
          text: `Maximo de dois arquivos`,
          type: "warning",
          showCancelButton: false,
          confirmButtonText: "Ok"
        })
        .then(result => {}, error => {});
    }
  }

  public deletarArquivoMultimidia(arquivo: Arquivo): void {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true
    });

    PcsUtil.swal()
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente excluir o arquivo?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        reverseButtons: false
      })
      .then(result => {
        if (result.value) {
          this.arquivosMultimidia.splice(
            this.arquivosMultimidia.indexOf(arquivo),
            1
          );
          this.dataSourceArquivosMultimidia = new MatTableDataSource(
            this.arquivosMultimidia
          );
        }
      });
  }

  buscarComboGruposAcademicos() {
    this.grupoAcademicoService.buscarComboGruposAcademicos()
    .subscribe(res => { 
      let outro: GrupoAcademicoCombo = new GrupoAcademicoCombo();
      outro.nomeGrupo = "Outro";
      outro.id = "Outro";
      this.gruposAcademicosCombo = res as Array<GrupoAcademicoCombo>;
      this.gruposAcademicosCombo.push(outro);       
    });

  }
}
