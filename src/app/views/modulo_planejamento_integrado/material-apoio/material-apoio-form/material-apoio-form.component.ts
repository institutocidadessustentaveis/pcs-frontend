import { MaterialApoioService } from './../../../../services/materialApoio.service';
import { EixoService } from 'src/app/services/eixo.service';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { CidadeService } from 'src/app/services/cidade.service';
import { PaisService } from 'src/app/services/pais.service';
import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Arquivo } from 'src/app/model/arquivo';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { MaterialApoio } from 'src/app/model/MaterialApoio';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import { resolve } from 'url';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { MetaObjetivoDesenvolvimentoSustentavel } from 'src/app/model/metaObjetivoDesenvolvimentoSustentavel';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';

@Component({
  selector: 'app-material-apoio-form',
  templateUrl: './material-apoio-form.component.html',
  styleUrls: ['./material-apoio-form.component.css']
})
export class MaterialApoioFormComponent implements OnInit {

  public loading = false;
  public scrollUp: any;

  public materialApoio: MaterialApoio = new MaterialApoio();

  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public thirdFormGroup: FormGroup;
  public fourthFormGroup: FormGroup;
  public fifthFormGroup: FormGroup;
  public sixthFormGroup: FormGroup;

  public paisesCombo: Array<ItemCombo> = [];
  public provinciaEstadoCombo: Array<ItemCombo> = [];
  public cidadesCombo: Array<ItemCombo> = [];
  public areasInteresseCombo: Array<AreaInteresse> = [];
  public eixosCombo: Array<ItemCombo> = [];
  public indicadoresCombo: Array<any> = [];
  public odsCombo: Array<ItemCombo> = [];
  public metasOdsCombo: Array<ItemCombo> = [];
  public habilitarRegiaoDoBrasil = false;

  public nomeArquivoImagemCapa;
  public nomeArquivoMaterialPublicacao;

  public editorConfig: any = {
    height: '200px',
    // uploadImagePath: '/api/upload',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'clear']],
      ['fontsize', []],
      ['para', []],
      ['insert', ['table', 'link']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    // callbacks : { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText);} }
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  constructor(private formBuilder: FormBuilder, private router: Router, public activatedRoute: ActivatedRoute,
    public domSanitizer: DomSanitizer, private element: ElementRef,
    private paisService: PaisService, private provinciaEstado: ProvinciaEstadoService,
    private cidadeService: CidadeService, private areaInteresseService: AreaInteresseService,
    private eixoService: EixoService, private indicadoresService: IndicadoresService,
    private metaOdsService: ObjetivoDesenvolvimentoSustentavelService, private materialApoioService: MaterialApoioService) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.firstFormGroup = this.formBuilder.group({
      titulo: [null, Validators.required],
      subtitulo: [null],
      autor: [null, Validators.required],
      instituicao: [null, Validators.required],
      dataPublicacao: [null, Validators.required],
      idioma: [null],
      continente: [null],
      pais: [null],
      regiao: [null],
      provinciaEstado: [null],
      cidade: [null]
    });
    this.secondFormGroup = this.formBuilder.group({
      areasInteresse: [null],
      eixo: [null],
      indicador: [null],
      ods: [null],
      metaOds: [null],
      palavraChave: [null],
      tag: [null],
      publicoAlvo: [null]
    });
    this.thirdFormGroup = this.formBuilder.group({
      tipoArquivo: [null],
      tipoDocumento: [null],
      tipoMaterial: [null],
      tipologiaCgee: [null],
      localExibicao: [null]
    });
    this.fourthFormGroup = this.formBuilder.group({
      resumo: [null],
      imagemCapa: [null],
      arquivoPublicacao: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.carregarCombos();
    this.buscarMaterial();
  }

  private buscarMaterial() {
    this.activatedRoute.params.subscribe(async params => {
      let id = params.id;
      if (id) {
        this.loading = true;
        await this.materialApoioService.buscarMaterialDeApoioPorId(id).subscribe(async response => {
          this.materialApoio = response as MaterialApoio;
          //Monta os combo box que são interligados
          this.montarComboBox(response);

          this.carregarAtributos();
          this.loading = false;
        }, error => { this.router.navigate(['/planejamento-integrado/material-apoio']); });
      }
      this.loading = false;
    }, error => {
      this.router.navigate(['/planejamento-integrado/material-apoio']);
    });
  }

  private montarComboBox(response) {
    if (response.pais) {
      this.provinciaEstado.buscarProvinciaEstadoComboPorPais(response.pais).subscribe(res => { this.provinciaEstadoCombo = res as ItemCombo[]; })
    }
    if (response.provinciaEstado) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(response.provinciaEstado).subscribe(res => { this.cidadesCombo = res as ItemCombo[]; })
    }
    if (response.eixo.length > 0) {
      this.indicadoresService.buscarIndicadoresPorIdEixoItemCombo(response.eixo).subscribe(res => { this.indicadoresCombo = res as ItemCombo[]; })
    }
    if (response.ods.length > 0) {
      this.metaOdsService.buscarMetaOdsPorIdOdsItemCombo(response.ods).subscribe(res => { this.metasOdsCombo = res as ItemCombo[]; })
    }
  }

  private carregarCombos() {
    this.materialApoioService.carregarCombosMaterialApoio().subscribe(response => {
      this.paisesCombo = response.listaPaises as ItemCombo[];
      this.areasInteresseCombo = response.listaAreasInteresse as AreaInteresse[];
      this.eixosCombo = response.listaEixos as ItemCombo[];
      this.odsCombo = response.listaOds as ItemCombo[];
    });
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

      this.fourthFormGroup.controls.imagemCapa.setValue(arquivo);
      this.loading = false;
    };
  }

  public async processFile(event: any) {
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      const arquivo = new Arquivo();
      arquivo.nomeArquivo = event.target.files[0].name;
      this.nomeArquivoMaterialPublicacao = event.target.files[0].name;
      arquivo.extensao = reader.result.toString().split(',')[0];
      arquivo.conteudo = reader.result.toString().split(',')[1];

      this.fourthFormGroup.controls.arquivoPublicacao.setValue(arquivo);
    };
  }

  public excluirImagemCapa() {
    this.fourthFormGroup.controls.imagemCapa.setValue(null);
    this.nomeArquivoImagemCapa = null;
  }

  public salvar() {
    this.materialApoio.titulo = this.firstFormGroup.controls.titulo.value;
    this.materialApoio.subtitulo = this.firstFormGroup.controls.subtitulo.value;
    this.materialApoio.autor = this.firstFormGroup.controls.autor.value;
    this.materialApoio.instituicao = this.firstFormGroup.controls.instituicao.value;
    this.materialApoio.dataPublicacao = this.firstFormGroup.controls.dataPublicacao.value;
    this.materialApoio.idioma = this.firstFormGroup.controls.idioma.value;
    this.materialApoio.continente = this.firstFormGroup.controls.continente.value;
    this.materialApoio.pais = this.firstFormGroup.controls.pais.value;
    this.materialApoio.regiao = this.firstFormGroup.controls.regiao.value;
    this.materialApoio.provinciaEstado = this.firstFormGroup.controls.provinciaEstado.value;
    this.materialApoio.cidade = this.firstFormGroup.controls.cidade.value;
    this.materialApoio.areasInteresse = this.secondFormGroup.controls.areasInteresse.value;
    this.materialApoio.eixo = this.secondFormGroup.controls.eixo.value;
    this.materialApoio.indicador = this.secondFormGroup.controls.indicador.value;
    this.materialApoio.ods = this.secondFormGroup.controls.ods.value;
    this.materialApoio.metaOds = this.secondFormGroup.controls.metaOds.value;
    this.materialApoio.palavraChave = this.secondFormGroup.controls.palavraChave.value;
    this.materialApoio.tag = this.secondFormGroup.controls.tag.value;
    this.materialApoio.publicoAlvo = this.secondFormGroup.controls.publicoAlvo.value;
    this.materialApoio.tipoArquivo = this.thirdFormGroup.controls.tipoArquivo.value;
    this.materialApoio.tipoDocumento = this.thirdFormGroup.controls.tipoDocumento.value;
    this.materialApoio.tipoMaterial = this.thirdFormGroup.controls.tipoMaterial.value;
    this.materialApoio.tipologiaCgee = this.thirdFormGroup.controls.tipologiaCgee.value;
    this.materialApoio.localExibicao = this.thirdFormGroup.controls.localExibicao.value;
    this.materialApoio.resumo = this.fourthFormGroup.controls.resumo.value;
    this.materialApoio.imagemCapa = this.fourthFormGroup.controls.imagemCapa.value;
    this.materialApoio.arquivoPublicacao = this.fourthFormGroup.controls.arquivoPublicacao.value;

    if (this.materialApoio.id !== null && this.materialApoio.id !== undefined) {
      this.editarMaterialDeApoio();
    } else {
      this.inserirMaterialDeApoio();
    }

  }

  private inserirMaterialDeApoio() {
    this.materialApoioService.inserir(this.materialApoio).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Material de apoio',
        text: `Cadastrado com sucesso`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/planejamento-integrado/material-apoio']);
      }, error => { });
      this.router.navigate(['/planejamento-integrado/material-apoio']);
    }, error => { });
  }

  private editarMaterialDeApoio() {
    this.materialApoioService.editar(this.materialApoio).subscribe(async response => {
      await PcsUtil.swal().fire({
        title: 'Material de apoio',
        text: `Editado com sucesso`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/planejamento-integrado/material-apoio']);
      }, error => { });
      this.router.navigate(['/planejamento-integrado/material-apoio']);
    }, error => { });
  }

  private carregarAtributos() {
    this.firstFormGroup.controls.titulo.setValue(this.materialApoio.titulo);
    this.firstFormGroup.controls.subtitulo.setValue(this.materialApoio.subtitulo);
    this.firstFormGroup.controls.autor.setValue(this.materialApoio.autor);
    this.firstFormGroup.controls.instituicao.setValue(this.materialApoio.instituicao);
    this.firstFormGroup.controls.dataPublicacao.setValue(this.materialApoio.dataPublicacao);
    this.firstFormGroup.controls.idioma.setValue(this.materialApoio.idioma);
    this.firstFormGroup.controls.continente.setValue(this.materialApoio.continente);
    this.firstFormGroup.controls.pais.setValue(this.materialApoio.pais);
    this.firstFormGroup.controls.regiao.setValue(this.materialApoio.regiao);
    this.firstFormGroup.controls.provinciaEstado.setValue(this.materialApoio.provinciaEstado);
    this.firstFormGroup.controls.cidade.setValue(this.materialApoio.cidade);
    this.secondFormGroup.controls.areasInteresse.setValue(this.materialApoio.areasInteresse);
    this.secondFormGroup.controls.eixo.setValue(this.materialApoio.eixo);
    this.secondFormGroup.controls.indicador.setValue(this.materialApoio.indicador);
    this.secondFormGroup.controls.ods.setValue(this.materialApoio.ods);
    this.secondFormGroup.controls.metaOds.setValue(this.materialApoio.metaOds);
    this.secondFormGroup.controls.palavraChave.setValue(this.materialApoio.palavraChave);
    this.secondFormGroup.controls.tag.setValue(this.materialApoio.tag);
    this.secondFormGroup.controls.publicoAlvo.setValue(this.materialApoio.publicoAlvo);
    this.thirdFormGroup.controls.tipoArquivo.setValue(this.materialApoio.tipoArquivo);
    this.thirdFormGroup.controls.tipoDocumento.setValue(this.materialApoio.tipoDocumento);
    this.thirdFormGroup.controls.tipoMaterial.setValue(this.materialApoio.tipoMaterial);
    this.thirdFormGroup.controls.tipologiaCgee.setValue(this.materialApoio.tipologiaCgee);
    this.thirdFormGroup.controls.localExibicao.setValue(this.materialApoio.localExibicao);
    this.fourthFormGroup.controls.resumo.setValue(this.materialApoio.resumo);
    this.fourthFormGroup.controls.imagemCapa.setValue(this.materialApoio.imagemCapa);
    this.fourthFormGroup.controls.arquivoPublicacao.setValue(this.materialApoio.arquivoPublicacao);

    this.nomeArquivoImagemCapa = this.materialApoio.imagemCapa != null ? this.materialApoio.imagemCapa.nomeArquivo : null;
    this.nomeArquivoMaterialPublicacao = this.materialApoio.arquivoPublicacao != null ? this.materialApoio.arquivoPublicacao.nomeArquivo : null;
  }

  public onPaisChange(event: any) {
    //ID 1 == Brasil
    if (event.value === 1) {
      this.habilitarRegiaoDoBrasil = true;
    }
    else {
      this.firstFormGroup.controls.regiao.setValue("");
      this.habilitarRegiaoDoBrasil = false;
    }

    if (event.value) {
      this.provinciaEstado.buscarProvinciaEstadoComboPorPais(event.value).subscribe(res => {
        this.provinciaEstadoCombo = res as ItemCombo[];
      })
    }
    else {
      this.provinciaEstadoCombo = [];
      this.cidadesCombo = [];
      this.firstFormGroup.controls.provinciaEstado.setValue(null);
      this.firstFormGroup.controls.cidade.setValue(null);
    }

  }

  onEstadoChange(event: any) {
    if (event.value) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(event.value).subscribe(res => {
        this.cidadesCombo = res as ItemCombo[];
      })
    }
    else {
      this.cidadesCombo = [];
      this.firstFormGroup.controls.cidade.setValue(null);
    }
  }

  onEixoChange(event: any) {
    if (!event && this.secondFormGroup.controls.eixo.value.length > 0) {
      this.indicadoresService.buscarIndicadoresPorIdEixoItemCombo(this.secondFormGroup.controls.eixo.value).subscribe(res => {
        this.indicadoresCombo = res as ItemCombo[];
      })
    }
    else {
      this.indicadoresCombo = [];
      this.secondFormGroup.controls.indicador.setValue(null);
    }
  }

  onOdsChange(event: any) {
    if (!event && this.secondFormGroup.controls.ods.value.length > 0) {
      this.metaOdsService.buscarMetaOdsPorIdOdsItemCombo(this.secondFormGroup.controls.ods.value).subscribe(res => {
        this.metasOdsCombo = res as ItemCombo[];
      })
    }
    else {
      this.metasOdsCombo = [];
      this.secondFormGroup.controls.metaOds.setValue(null);
    }
  }

}
