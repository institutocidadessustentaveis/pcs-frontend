import { MaterialInstitucionalService } from './../../../../services/material-institucional.service';
import { MaterialInstitucional } from './../../../../model/material-institucional';
import { Component, OnInit, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Arquivo } from 'src/app/model/arquivo';
import { MatTableDataSource } from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: "app-material-institucional-form",
  templateUrl: "./material-institucional-form.component.html",
  styleUrls: ["./material-institucional-form.component.css"]
})
export class MaterialInstitucionalFormComponent implements OnInit {
  public loading = false;

  public modoEdicao = false;

  public materialInstitucionalParaEditar: MaterialInstitucional = new MaterialInstitucional();

  public formGroup: FormGroup;

  public linksRelacionados = [];
  public tagPalavrasChave = [];
  public addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  public arquivo: Arquivo = new Arquivo();
  public arquivosMultimidia: Arquivo[] = [];
  public displayedColumnsArquivosMultimidia: string[] = [
    "nomeArquivo",
    "remover"
  ];
  public dataSourceArquivosMultimidia: MatTableDataSource<Arquivo>;

  public editorConfig = {
    height: "200px",
    // uploadImagePath: '/api/upload',
    toolbar: [
      ["misc", ["undo", "redo"]],
      [
        "font",
        [
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "superscript",
          "subscript",
          "clear"
        ]
      ],
      ["fontsize", ["fontname", "fontsize", "color"]],
      ["para", ["style0", "ul", "ol", "paragraph", "height"]],
      ["insert", ["table", "picture", "link", "video", "hr"]],
      ["view", ["fullscreen", "codeview", "help"]]
    ],
    fontNames: [
      "Helvetica",
      "Arial",
      "Arial Black",
      "Comic Sans MS",
      "Courier New",
      "Roboto",
      "Times"
    ],
    // callbacks : { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText);} }
    callbacks: {
      onPaste: function(e) {
        var bufferText = (
          (e.originalEvent || e).clipboardData || window["clipboardData"]
        ).getData("Text");
        e.preventDefault();
        document.execCommand("insertText", false, bufferText);
      }
    }
  };
  scrollUp: any;

  constructor(
    private formBuilder: FormBuilder,
    private materialInstitucionalService: MaterialInstitucionalService,
    private router: Router,
    private element: ElementRef,
    public activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private titleService: Title,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.formGroup = this.formBuilder.group({
      titulo: ["", Validators.required],
      subtitulo: ["", Validators.required],
      autor: ["", Validators.required],
      linksRelacionados: [[]],
      tagPalavrasChave: [[]],
      corpoTexto: ["", Validators.required]
    });
    this.titleService.setTitle("Formulário de Material Institucional - Cidades Sustentáveis");
  }

  ngOnInit() {
    this.buscarMaterialInstitucional();
  }

  public buscarMaterialInstitucional() {
    this.activatedRoute.params.subscribe(
      async params => {
        let id = params.id;
        if (id) {
          this.loading = true;
          this.materialInstitucionalService.buscarPorId(id).subscribe(
            async response => {
              this.materialInstitucionalParaEditar = response as MaterialInstitucional;
              this.carregarAtributosMaterial();
              this.modoEdicao = true;
              this.loading = false;
            },
            error => {
              this.router.navigate(["/boaspraticas"]);
            }
          );
        }
        this.loading = false;
      },
      error => {
        this.router.navigate(["/boaspraticas"]);
      }
    );
  }

  public carregarAtributosMaterial() {
    this.formGroup.controls.titulo.setValue(
      this.materialInstitucionalParaEditar.titulo
    );
    this.formGroup.controls.subtitulo.setValue(
      this.materialInstitucionalParaEditar.subtitulo
    );
    this.formGroup.controls.autor.setValue(
      this.materialInstitucionalParaEditar.autor
    );

    this.linksRelacionados = this.materialInstitucionalParaEditar.linksRelacionados;
    this.formGroup.controls.linksRelacionados.setValue(
      this.materialInstitucionalParaEditar.linksRelacionados
    );

    this.tagPalavrasChave = this.materialInstitucionalParaEditar.tagPalavrasChave;
    this.formGroup.controls.tagPalavrasChave.setValue(
      this.materialInstitucionalParaEditar.tagPalavrasChave
    );

    this.formGroup.controls.corpoTexto.setValue(
      this.materialInstitucionalParaEditar.corpoTexto
    );

    this.arquivosMultimidia = this.materialInstitucionalParaEditar.arquivos;
    this.dataSourceArquivosMultimidia = new MatTableDataSource(
      this.arquivosMultimidia
    );
  }

  public addLinksRelacionados(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || "").trim()) {
      const index = this.linksRelacionados.indexOf(value);
      if (index < 0) {
        this.linksRelacionados.push(value.toLowerCase().trim());
        this.formGroup.controls.linksRelacionados.setValue(
          this.linksRelacionados
        );
      }
    }
    if (input) {
      input.value = "";
    }
  }

  public removerLinksRelacionados(link): void {
    const index = this.linksRelacionados.indexOf(link);
    if (index >= 0) {
      this.linksRelacionados.splice(index, 1);
    }
  }

  public addTagPalavrasChave(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || "").trim()) {
      const index = this.tagPalavrasChave.indexOf(value);
      if (index < 0) {
        this.tagPalavrasChave.push(value.toLowerCase().trim());
        this.formGroup.controls.tagPalavrasChave.setValue(
          this.tagPalavrasChave
        );
      }
    }
    if (input) {
      input.value = "";
    }
  }

  public removerTagPalavrasChave(value): void {
    const index = this.tagPalavrasChave.indexOf(value);

    if (index >= 0) {
      this.tagPalavrasChave.splice(index, 1);
    }
  }

  public async processFile(event: any) {
    if (this.arquivosMultimidia.length < 5) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        if (
          PcsUtil.tamanhoArquivoEstaDentroDoLimite(
            reader.result.toString().split(",")[1]
          )
        ) {
          this.arquivo = new Arquivo();
          this.arquivo.nomeArquivo = event.target.files[0].name;
          this.arquivo.extensao = reader.result.toString().split(",")[0];
          this.arquivo.conteudo = reader.result.toString().split(",")[1];
          this.arquivosMultimidia.push(this.arquivo);
          this.dataSourceArquivosMultimidia = new MatTableDataSource(
            this.arquivosMultimidia
          );
        } else {
          PcsUtil.swal()
            .fire({
              title: "Cadastro de Material Institucional",
              text: `Arquivo excede o tamanho limite de 10 MB`,
              type: "warning",
              showCancelButton: false,
              confirmButtonText: "Ok"
            })
            .then(result => {}, error => {});
        }
      };
      this.loading = false;
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

  public deletarArquivo(arquivo: Arquivo): void {
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

  public salvarMaterialInstitucional() {
    if (this.modoEdicao) {
      this.editarMaterialInstitucional();
    } else {
      this.inserirMaterialInstitucional();
    }
  }

  public inserirMaterialInstitucional() {
    const objToInsert: MaterialInstitucional = this.formGroup
      .value as MaterialInstitucional;
    objToInsert.arquivos = this.arquivosMultimidia;

    this.materialInstitucionalService
      .inserir(objToInsert)
      .subscribe(async response => {
        await PcsUtil.swal()
          .fire({
            title: "Material institucional",
            text: `Material institucional cadastrado.`,
            type: "success",
            showCancelButton: false,
            confirmButtonText: "Ok"
          })
          .then(
            result => {
              this.router.navigate(["/material_institucional"]);
            },
            error => {}
          );
      });
  }

  public editarMaterialInstitucional() {
    this.materialInstitucionalParaEditar.titulo = this.formGroup.controls.titulo.value;
    this.materialInstitucionalParaEditar.subtitulo = this.formGroup.controls.subtitulo.value;
    this.materialInstitucionalParaEditar.autor = this.formGroup.controls.autor.value;
    this.materialInstitucionalParaEditar.linksRelacionados = this.formGroup.controls.linksRelacionados.value;
    this.materialInstitucionalParaEditar.tagPalavrasChave = this.formGroup.controls.tagPalavrasChave.value;
    this.materialInstitucionalParaEditar.corpoTexto = this.formGroup.controls.corpoTexto.value;
    this.materialInstitucionalParaEditar.arquivos = this.arquivosMultimidia;

    this.materialInstitucionalService
      .editar(this.materialInstitucionalParaEditar)
      .subscribe(
        async response => {
          await PcsUtil.swal()
            .fire({
              title: "Alteração de material institucional",
              text: `Material institucional atualizado.`,
              type: "success",
              showCancelButton: false,
              confirmButtonText: "Ok"
            })
            .then(
              result => {
                this.router.navigate(["/material_institucional"]);
              },
              error => {}
            );
          this.router.navigate(["/material_institucional"]);
        },
        error => {}
      );
  }
}
