import { ObjetivoDesenvolvimentoSustentavel } from './../../../../model/objetivoDesenvolvimentoSustentavel';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AreaInteresseService } from 'src/app/services/area-interesse.service';
import { EixoService } from 'src/app/services/eixo.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { TemaGeoespacialService } from 'src/app/services/tema-geoespacial.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'app-tema-geoespacial-form',
  templateUrl: './tema-geoespacial-form.component.html',
  styleUrls: ['./tema-geoespacial-form.component.css']
})
export class TemaGeoespacialFormComponent implements OnInit {
  @ViewChild('autosize') autosize: CdkTextareaAutosize;

  loading = false;
  scrollUp: any;
  formGroup: FormGroup;

  areas = [];
  eixos = [];
  ods = [];
  todosOds = [];
  metas = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private element: ElementRef,
    private activatedRoute: ActivatedRoute,
    private areaService: AreaInteresseService,
    private eixoService: EixoService,
    private odsService: ObjetivoDesenvolvimentoSustentavelService,
    private temaService: TemaGeoespacialService
  ) {
      this.scrollUp = this.router.events.subscribe(path => {
        element.nativeElement.scrollIntoView();
      });

      this.formGroup = this.formBuilder.group({
        id: [null],
        nome: ['', Validators.required],
        descricao: [null],
        areasInteresse: [null],
        eixos : [null],
        ods: [null],
        metas: [null],
      });
     }

  ngOnInit() {
    this.areaService.buscaAreasInteresses().subscribe(res => {
      this.areas = res;
    });
    this.eixoService.buscarEixosParaCombo(true).subscribe(res => {
      this.eixos = res;
      this.odsService.buscarOdsComboComMetas().subscribe(res2 => {
        this.ods = res2;
        this.todosOds = res2;
        this.buscarTema();
      });
    });
  }
  buscarTema() {
    this.activatedRoute.params.subscribe(async params => {
      const id = params.id;
      if (id) {
        this.temaService.buscar(id).subscribe(res => {
          const tema = res;
          this.formGroup.controls.id.setValue(tema.id);
          this.formGroup.controls.nome.setValue(tema.nome);
          this.formGroup.controls.descricao.setValue(tema.descricao);
          if (tema.areasInteresse != null && tema.areasInteresse.length > 0 ) {
            this.formGroup.controls.areasInteresse.setValue(tema.areasInteresse);
          }
          if (tema.eixos != null && tema.eixos.length > 0 ) {
            this.formGroup.controls.eixos.setValue(tema.eixos);
            this.tradeEixo(tema.eixos);
          }
          if (tema.ods != null && tema.ods.length > 0 ) {
            this.formGroup.controls.ods.setValue(tema.ods);
            this.tradeOds(tema.ods);
          }
          this.formGroup.controls.metas.setValue(tema.metas);
        });
      }
    });
  }

  tradeEixo(eixoSelecionado: any) {
    this.ods = [];
    this.metas = [];
    if ( eixoSelecionado == null || eixoSelecionado.length === 0) {
      this.ods = this.todosOds;
    } else {
      this.geraListaODS(eixoSelecionado);
    }
  }

  geraListaODS(eixoSelecionado) {
    eixoSelecionado.forEach(idEixo => {
      const eixo = this.eixos.filter(x => x.id === idEixo);
      eixo[0].listaODS.forEach(ods => {
        let existe = false;
        for (const o of this.ods) {
          if (o.id == ods.id ) {
            existe = true;
            break;
          }
        }
        if (!existe) {
          this.ods.push(ods);
        }
      });
      this.ods.sort((a, b) => a.id - b.id);
    });
  }


  tradeOds(odsSelecionada) {
    this.metas = [];
    odsSelecionada.forEach(id_ods => {
      const ods = this.todosOds.filter(x => x.id === id_ods);
      ods[0].metas.forEach(x => {
        this.metas.push(x);
      });
    });
  }

  salvar() {
    const tema = this.formGroup.value;
    if (!tema.id) {
      this.inserir(tema);
    } else {
      this.atualizar(tema);
    }
  }

  inserir(tema) {
    this.temaService.inserir(tema).subscribe(res => {
      PcsUtil.swal()
      .fire({
        title: 'Tema Geoespacial salvo!',
        text: '',
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok'
      })
      .then(
        result => {
          this.router.navigate(['/planejamento-integrado/temas-geoespaciais']);
        },
        error => {}
      );
    });
  }
  atualizar(tema) {
    this.temaService.atualizar(tema).subscribe(res => {
      PcsUtil.swal()
      .fire({
        title: 'Tema Geoespacial salvo!',
        text: '',
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok'
      })
      .then(
        result => {
          this.router.navigate(['/planejamento-integrado/temas-geoespaciais']);
        },
        error => {}
      );
    });
  }
}
