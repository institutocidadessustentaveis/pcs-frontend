import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { Arquivo } from 'src/app/model/arquivo';
// Models
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { Eixo } from 'src/app/model/eixo';

//Services
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { EixoService } from 'src/app/services/eixo.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) { }
}

@Component({
  selector: 'app-eixo',
  templateUrl: './eixo-form.component.html',
  styleUrls: ['./eixo-form.component.css']
})

export class EixoFormComponent {
  listaODS = new Array<ObjetivoDesenvolvimentoSustentavel>();
  cboListaODS = new Array<ObjetivoDesenvolvimentoSustentavel>();
  ODSSelecionado: ObjetivoDesenvolvimentoSustentavel;
  eixoSelecionado = new Eixo();
  displayedColumns: string[] = ['Icone', 'Numero', 'Titulo', 'SubTitulo', '#Remover'];
  dataSource = new MatTableDataSource<ObjetivoDesenvolvimentoSustentavel>();
  loading: any;
  formEixo: FormGroup;
  nomeBotao = 'Cadastrar Eixo';
  image2: File;
  selectedFile: ImageSnippet;
  arquivo = new Arquivo();


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  scrollUp: any;

  constructor(public eixoService: EixoService, public odsService: ObjetivoDesenvolvimentoSustentavelService,
              public authService: AuthService, public formBuilder: FormBuilder,
              public router: Router,
              public activatedRoute: ActivatedRoute,
              public _DomSanitizationService: DomSanitizer,
              private element: ElementRef) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    this.formEixo = this.formBuilder.group({
      nome: ['', [Validators.minLength(5), Validators.maxLength(100), Validators.required]],
      link: [null]
    });
  }

  private onSuccess() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'ok';
  }

  private onError() {
    this.selectedFile.pending = false;
    this.selectedFile.status = 'fail';
    this.selectedFile.src = '';
  }

  processFile(eventInput: any) {
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

      if (eventInput.target.name == 'icone') {
        reader.onload = this._handleReaderLoadedIcone.bind(this);
      }
      reader.readAsBinaryString(file);
      this.selectedFile = new ImageSnippet(eventInput.target.result, file);
      this.selectedFile.pending = true;

     } else {
       PcsUtil.swal().fire({
         title: 'Cadastro de Eixo',
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

  _handleReaderLoadedIcone(readerEvt) {
    this.eixoSelecionado.icone = btoa(readerEvt.target.result);
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; };
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.loading = true;
    this.buscarEixo();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  removeTableItem(rowTable: ObjetivoDesenvolvimentoSustentavel) {
    const rowIndex: number = this.listaODS.indexOf(rowTable);
    if (rowIndex !== -1) {
      this.listaODS.splice(rowIndex, 1);
      this.cboListaODS.push(rowTable);
      this.dataSource = new MatTableDataSource(this.listaODS);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
    }
  }

  addTableItem() {
    const rowIndex: number = this.cboListaODS.indexOf(this.ODSSelecionado);
    if (this.ODSSelecionado != null) {
      this.listaODS.push(this.ODSSelecionado);
      this.cboListaODS.splice(rowIndex, 1);
      this.dataSource = new MatTableDataSource(this.listaODS);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.ODSSelecionado = null;
    }
  }

  recarregarODS() {
    for (const ods of this.listaODS) {
      this.cboListaODS = this.cboListaODS.filter(x => x.id !== ods.id);
    }
  }

  async buscarEixo() {
    await this.activatedRoute.params.subscribe(async params => {
      let id = params.id;
      if (id) {
        await this.eixoService.buscarEixoId(id).subscribe(async response => {
          this.eixoSelecionado.id = response.id;
          this.eixoSelecionado.icone = response.icone;
          this.formEixo.controls.nome.setValue(response.nome);
          this.formEixo.controls.link.setValue(response.link);
          this.listaODS = response.listaODS;
          this.dataSource = new MatTableDataSource(this.listaODS);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.ODSSelecionado = null;
          this.loading = false;
          await this.odsService.buscar().subscribe(async response => {
            this.cboListaODS = response;
            if (this.eixoSelecionado.id > 0) {
              this.recarregarODS();
            }
          }, error => { this.loading = false; });
        }, error => { this.loading = false; });
      }
      else {
        this.eixoSelecionado.id = 0;
        await this.odsService.buscar().subscribe(async response => {
          this.cboListaODS = response;
          if (this.eixoSelecionado.id > 0) {
            this.recarregarODS();
          }
        }, error => { this.loading = false; });
        this.loading = false;
      }
    }, error => { this.loading = false; });
  }

  tradeODS(ODSSelecionado) {
    this.ODSSelecionado = ODSSelecionado;
  }

  enableSalvar(): Boolean {
    if (this.listaODS.length > 0 && this.formEixo.valid === true && (this.eixoSelecionado.icone != null || this.eixoSelecionado.icone != undefined)) {
      return false;
    }
    return true;
  }

  async salvar() {
    const novaListaODS = new Array<ObjetivoDesenvolvimentoSustentavel>();
    this.eixoSelecionado.nome = this.formEixo.controls.nome.value;
    this.eixoSelecionado.link = this.formEixo.controls.link.value;
    this.eixoSelecionado.listaODS = this.listaODS;
    this.loading = true;

    if (this.eixoSelecionado.id === 0) {
      await this.eixoService.inserir(this.eixoSelecionado).subscribe(async response => {
        await PcsUtil.swal().fire({
          title: 'Cadastro de eixo',
          text: `Eixo ${this.eixoSelecionado.nome} cadastrado.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.loading = false;
          this.router.navigate(['/eixo']);
        }, error => { this.loading = false });
      }, error => { this.loading = false });
    }
    else {
      await this.eixoService.editar(this.eixoSelecionado).subscribe(async response => {
        await PcsUtil.swal().fire({
          title: 'Alteração de eixo',
          text: `Eixo ${this.eixoSelecionado.nome} atualizado.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.loading = false;
          this.router.navigate(['/eixo']);
        }, error => { this.loading = false; });
        this.router.navigate(['/eixo']);
      }, error => { this.loading = false; });
    }
  }

  getNome() {
    return this.formEixo.get('nome').hasError('required') ? 'Campo nome é obrigatório' :
      this.formEixo.get('nome').hasError('minlength') ? 'O nome deve conter ao menos 5 dígitos' :
        this.formEixo.get('nome').hasError('maxlength') ? 'O senha deve conter no máximo 100 dígitos' : '';
  }
}
