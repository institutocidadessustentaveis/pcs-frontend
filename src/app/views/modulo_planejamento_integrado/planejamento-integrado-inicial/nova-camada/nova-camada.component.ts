
import { Component, OnInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ShapeFile } from 'src/app/model/shapeFile';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ShapeFileService } from 'src/app/services/shapefile.service';
import { TemaGeoespacialService } from 'src/app/services/tema-geoespacial.service';


@Component({
  selector: 'app-nova-camada',
  templateUrl: './nova-camada.component.html',
  styleUrls: ['./nova-camada.component.css']
})
export class NovaCamadaComponent implements OnInit {

  @Output() salvarNovaCamadaShapeFileEvent = new EventEmitter();

  public scrollUp: any;
  public loading = false;


  public formGroup: FormGroup;

  public areasInteresse: Array<AreaInteresse>;


  public shapeFile: ShapeFile = new ShapeFile();
  temasGeoespaciais: any[];

  public listaAnos: any = [];


  constructor(private formBuilder: FormBuilder,
              private areaInteresseService: AreaInteresseService,
              private temaGeoService: TemaGeoespacialService,
              private shapeFileService: ShapeFileService,
              private router: Router,
              private element: ElementRef,
              private activatedRoute: ActivatedRoute) {
      this.scrollUp = this.router.events.subscribe(path => {
        element.nativeElement.scrollIntoView();
      });
      this.formGroup = this.formBuilder.group({
        ano: [''],
        titulo: ['', Validators.required],
        areaInteresse: [''],
        instituicao: [''],
        fonte: [''],
        sistemaDeReferencia: [''],
        nivelTerritorial: [''],
        publicar: ['nao'],
        temaGeoespacial: [null],
        exibirAuto: ['nao']
      });

    }

    ngOnInit() {
      this.carregarAreaInteresse();
      this.carregarTemaGeo();
      this.initListaAnos();
      this.settarAnoAtual();
    }

    private carregarAreaInteresse() {
      this.areaInteresseService.buscaAreasInteresses().subscribe(res => {
        this.areasInteresse = res as Array<AreaInteresse>;
      });
    }

    private carregarTemaGeo() {
      this.temaGeoService.buscarTodosSimples().subscribe(res => {
        this.temasGeoespaciais = res;
      });
    }

    public salvar() {
      if (!this.formGroup.valid) {
        PcsUtil.swal().fire({
          title: 'Formulário inválido',
          text: `Preencha o formulário corretamente`,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        });
      } else {
        this.salvarShapeFile();
      }
    }

    private salvarShapeFile() {
      this.loading = true;
      this.shapeFile.ano = this.formGroup.controls.ano.value;
      this.shapeFile.titulo = this.formGroup.controls.titulo.value;

      const idArea = this.formGroup.controls.areaInteresse.value;
      if (idArea) {
        const listaAreaInteresseSelecionada: any[] = [];
        listaAreaInteresseSelecionada.push(idArea);
        this.shapeFile.areasInteresse = listaAreaInteresseSelecionada;
      }


      this.shapeFile.instituicao = this.formGroup.controls.instituicao.value;
      this.shapeFile.fonte = this.formGroup.controls.fonte.value;
      this.shapeFile.sistemaDeReferencia = this.formGroup.controls.sistemaDeReferencia.value;
      this.shapeFile.nivelTerritorial = this.formGroup.controls.nivelTerritorial.value;
      this.shapeFile.publicar = this.formGroup.controls.publicar.value === 'sim' ? true : false;
      this.shapeFile.temaGeoespacial = this.formGroup.controls.temaGeoespacial.value;
      this.shapeFile.exibirAuto = this.formGroup.controls.exibirAuto.value === 'sim' ? true : false;

      this.salvarNovaCamadaShapeFileEvent.emit(this.shapeFile);
      this.formGroup.reset();
      this.settarAnoAtual();
    }

    private initListaAnos() {
      const anoInicio = 1500;
      this.listaAnos.push(anoInicio);
      for (let i = 1; i < 601; i++) {
        this.listaAnos.push(anoInicio + i);
      }
    }

    settarAnoAtual() {
      this.formGroup.controls.ano.setValue(new Date().getFullYear());
    }

}
