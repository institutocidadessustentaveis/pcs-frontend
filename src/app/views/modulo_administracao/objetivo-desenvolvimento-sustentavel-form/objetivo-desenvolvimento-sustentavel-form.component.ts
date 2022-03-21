import { Component, OnInit, ViewChild, Inject, ElementRef } from "@angular/core";
import {
  FormsModule,
  Validators,
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { DomSanitizer, Meta, SafeUrl } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { AuthService } from 'src/app/services/auth.service';
import { MetaObjetivoDesenvolvimentoSustentavel } from 'src/app/model/metaObjetivoDesenvolvimentoSustentavel';
import { MatSort, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatPaginator } from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Arquivo } from 'src/app/model/arquivo';
@Component({
  selector: "app-objetivo-desenvolvimento-sustentavel-form",
  templateUrl: "./objetivo-desenvolvimento-sustentavel-form.component.html",
  styleUrls: ["./objetivo-desenvolvimento-sustentavel-form.component.css"]
})
export class ObjetivoDesenvolvimentoSustentavelFormComponent implements OnInit {
  public ods: ObjetivoDesenvolvimentoSustentavel = new ObjetivoDesenvolvimentoSustentavel();
  metaPreenchido: MetaObjetivoDesenvolvimentoSustentavel = new MetaObjetivoDesenvolvimentoSustentavel();
  criaMeta = false;
  displayedColumns: string[] = ["numero", "descricao", "acoes"];
  dataSource: MatTableDataSource<MetaObjetivoDesenvolvimentoSustentavel>;
  arquivo = new Arquivo();
  imagemIconeSafeUrl: SafeUrl;
  imagemIconeReduzidoSafeUrl: SafeUrl;
  loading: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scrollUp: any;

  constructor(
    public odsService: ObjetivoDesenvolvimentoSustentavelService,
    public dialog: MatDialog,
    public authService: AuthService,
    private router: Router,
    private element: ElementRef,
    private activatedRoute: ActivatedRoute,
    public domSanitizationService: DomSanitizer
  ) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.buscarOds();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  processFile(eventInput: any, nomeInput: string) {

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
        if (nomeInput === 'icone') {
          reader.onload = this._handleReaderLoadedIcone.bind(this);
        } else {
          reader.onload = this._handleReaderLoadedIconeReduzido.bind(this);
        }
        reader.readAsBinaryString(file);
      } else {
       PcsUtil.swal().fire({
         title: 'Cadastro de ODS',
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

  processFileIconeReduzido(eventInput: any) {

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
        reader.onload = this._handleReaderLoadedIconeReduzido.bind(this);
        reader.readAsBinaryString(file);

      } else {
       PcsUtil.swal().fire({
         title: 'Cadastro de ODS',
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

  /**
   *  Converting binary string data.
   */
  _handleReaderLoadedIcone(readerEvt) {
    this.ods.icone = btoa(readerEvt.target.result);
    this.imagemIconeSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
      "data:image/png;base64, " + this.ods.icone
    );
  }

  /**
   *  Converting binary string data.
   */
  _handleReaderLoadedIconeReduzido(readerEvt?) {
    if (readerEvt !== undefined) {
      this.ods.iconeReduzido = btoa(readerEvt.target.result);
      this.imagemIconeReduzidoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
        "data:image/png;base64, " + this.ods.iconeReduzido
      );
    }
  }

  private buscarOds() {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.odsService.buscarOds(id).subscribe(ods => {
          this.loading = true;
          this.ods = ods;
          this.imagemIconeSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            "data:image/png;base64, " + this.ods.icone
          );
          this.imagemIconeReduzidoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            "data:image/png;base64, " + this.ods.iconeReduzido
          );
          this.atualizaTabela(ods.metas);
          this.loading = false;
        });
      }
    });
  }

  public atualizaTabela(metas: MetaObjetivoDesenvolvimentoSustentavel[]) {
    this.dataSource = new MatTableDataSource(metas);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.paginator._intl.firstPageLabel = "Primeira página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.nextPageLabel = "Próxima página";
    this.paginator._intl.lastPageLabel = "Última página";
  }

  public salvar(): void {
    if (this.ods.id) {
      this.editar();
    } else {
      this.cadastrar();
    }
  }

  public cadastrar(): void {
    this.loading = true;
    this.odsService.inserir(this.ods).subscribe(response => {
      PcsUtil.swal()
        .fire({
          title: "Objetivo de Desenvolvimento Sustentavel",
          text: `ODS ${this.ods.titulo} cadastrado.`,
          type: "success",
          showCancelButton: false,
          confirmButtonText: "Ok"
        })
        .then(
          result => {
            this.router.navigate(["/ods"]);
          },
          error => {}
        );
    }, error => {this.loading = false; });
  }

  public editar(): void {
    this.loading = true;
    this.odsService.editar(this.ods).subscribe(ods => {
      PcsUtil.swal()
        .fire({
          title: "Objetivo de Desenvolvimento Sustentavel",
          text: `ODS ${this.ods.titulo} atualizado.`,
          type: "success",
          showCancelButton: false,
          confirmButtonText: "Ok"
        })
        .then(
          result => {
            this.router.navigate(["/ods"]);
          },
          error => {}
        );
    }, error => {this.loading = false; }
    );
  }

  public deletarMeta(meta: MetaObjetivoDesenvolvimentoSustentavel): void {
    PcsUtil.swal()
      .fire({
        title: "Objetivo de Desenvolvimento Sustentavel",
        text: `Deseja realmente excluir a Meta ?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não"
      })
      .then(
        result => {
          if (result.value) {
            this.ods.metas.forEach((item, index) => {
              if (
                item.descricao === meta.descricao &&
                item.numero === meta.numero
              ) {
                this.ods.metas.splice(index, 1);
                this.atualizaTabela(this.ods.metas);
                if (meta.id !== null) {
                  this.odsService
                    .deletarMeta(this.ods.id, meta.id)
                    .subscribe(response => {
                      PcsUtil.swal()
                        .fire({
                          title: "Objetivo de Desenvolvimento Sustentável",
                          text: `Meta de Objetivo de Desenvolvimento Sustentável excluída.`,
                          type: "success",
                          showCancelButton: false,
                          confirmButtonText: "Ok"
                        })
                        .then(result => {}, error => {});
                    });
                }
              }
            });
          }
        },
        error => {}
      );
  }

  openModalCadastroMeta(meta: MetaObjetivoDesenvolvimentoSustentavel): void {
    if (meta != null) {
      localStorage.setItem("meta", JSON.stringify(meta));
    } else {
      localStorage.removeItem("meta");
    }

    const dialogCadastroMeta = this.dialog.open(DialogCadastroMetas, {
      width: "50%"
    });

    dialogCadastroMeta.afterClosed().subscribe(result => {
      let metaAptaParaCadastro = true;
      if (result != null) {
        const metaLocal = JSON.parse(localStorage.getItem("meta"));
        if (metaLocal != null) {
          this.ods.metas.forEach((item, index) => {
            if (
              item.descricao === metaLocal.descricao &&
              item.numero === metaLocal.numero
            ) {
              this.ods.metas.splice(index, 1);
              metaAptaParaCadastro = true;
            }
          });
        } else {
          this.ods.metas.forEach((item, index) => {
            if (
              item.numero === result.numero &&
              item.descricao === result.descricao
            ) {
              metaAptaParaCadastro = false;
              PcsUtil.swal()
                .fire({
                  title: "Objetivo de Desenvolvimento Sustentavel",
                  text: `Meta já cadastrada!`,
                  type: "warning",
                  showCancelButton: false,
                  confirmButtonText: "Ok"
                })
                .then(result => {}, error => {});
            }
          });
        }
        if (metaAptaParaCadastro) {
          if (result.id !== null && this.ods.id !== null) {
            this.odsService
              .editarMeta(this.ods.id, result)
              .subscribe(response => {});
            this.ods.metas.push(result);
          } else {
            const novaMeta = new MetaObjetivoDesenvolvimentoSustentavel();
            novaMeta.numero = result.numero;
            novaMeta.descricao = result.descricao;
            this.ods.metas.push(novaMeta);
          }
          this.atualizaTabela(this.ods.metas);
        }
      }
    });
  }
}

@Component({
  selector: "dialog-cadastro-metas",
  templateUrl: "./dialog-cadastro-metas.html",
  styleUrls: ["./objetivo-desenvolvimento-sustentavel-form.component.css"]
})
export class DialogCadastroMetas {
  metaForm: FormGroup;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<DialogCadastroMetas>,
    @Inject(MAT_DIALOG_DATA)
    public metaPreenchido: MetaObjetivoDesenvolvimentoSustentavel,
    public formBuilder: FormBuilder
  ) {
    this.metaForm = this.formBuilder.group({
      id: [null],
      numero: ["", Validators.required],
      descricao: ["", Validators.required]
    });

    const dadosMeta =
      localStorage.getItem("meta") !== "undefined"
        ? JSON.parse(localStorage.getItem("meta"))
        : null;
    if (dadosMeta != null) {
      if (dadosMeta.id !== null) {
        this.metaForm.controls.id.setValue(dadosMeta.id);
      }
      this.metaForm.controls.numero.setValue(dadosMeta.numero);
      this.metaForm.controls.descricao.setValue(dadosMeta.descricao);
    }
  }

  salvar() {
    const novaMeta: MetaObjetivoDesenvolvimentoSustentavel = new MetaObjetivoDesenvolvimentoSustentavel();
    if (this.metaForm.controls.id.value !== "") {
      novaMeta.id = this.metaForm.controls.id.value;
    }
    novaMeta.numero = this.metaForm.controls.numero.value;
    novaMeta.descricao = this.metaForm.controls.descricao.value;
    this.dialogRef.close(novaMeta);
  }

  voltar(): void {
    this.dialogRef.close();
  }
}
