import { Cidade } from '../../../model/cidade';
import { Component, OnInit, ChangeDetectionStrategy, Inject, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import swal from 'sweetalert2';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import { PartidoPolitico } from 'src/app/model/partido-politico';
import { PartidoPoliticoService } from 'src/app/services/partido-politico.service';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Prefeitura } from 'src/app/model/prefeitura';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { CartaCompromisso } from 'src/app/model/carta-compromisso';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CidadeService } from 'src/app/services/cidade.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { DownloadslogService } from 'src/app/services/downloadslog.service';


export interface DialogData {
  nome: string;
  cidade: string;
}

const path = 'assets/pdf/Termo de responsabilidade para signatarias.pdf';

@Component({
  selector: 'app-prefeitura-form',
  templateUrl: './prefeitura-form.component.html',
  styleUrls: ['./prefeitura-form.component.css']
})
export class PrefeituraFormComponent implements OnInit {

  prefeitura: Prefeitura = new Prefeitura();
  formPrefeitura: FormGroup;
  searchControl: FormControl;
  listaEstados: ProvinciaEstado[];
  listaCidades: any[];
  listaPartidos: PartidoPolitico[];
  cartaCompromisso: CartaCompromisso = new CartaCompromisso();
  loading = false;
  displayedColumns: string[] = ['arquivo', 'remover'];
  dataSource: MatTableDataSource<CartaCompromisso>;
  cargo = '';
  nomePrefeito = '';
  nomeCidade = '';
  scrollUp: any;

  constructor(public formBuilder: FormBuilder, public provinciaEstadoService: ProvinciaEstadoService,
              public partidoService: PartidoPoliticoService,
              public activatedRoute: ActivatedRoute, public router: Router, private element: ElementRef,
              public prefeituraService: PrefeituraService,
              public cidadeService: CidadeService,
              public dialog: MatDialog) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });

    this.formPrefeitura = this.formBuilder.group({
      cargo: ['', Validators.required],
      nome: ['', Validators.required],
      email: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      partidoPolitico: ['', Validators.required],
      telefone: ['', Validators.required],
      termos: ['', Validators.required],
      searchControl: this.searchControl
    });
  }

  ngOnInit() {
    this.searchControl = this.formBuilder.control('');
    this.carregaEstados();
    this.listaCidades = [];
    this.carregaPartidos();
    this.dataSource = new MatTableDataSource(this.prefeitura.cartaCompromisso);
    this.formPrefeitura.get('nome').valueChanges.subscribe(val => {
      this.nomePrefeito = ' ' + val + ', ';
    });
    this.formPrefeitura.get('cidade').valueChanges.subscribe(val => {
      if (val !== null) {
        this.nomeCidade = ' de ' + val.label;
      }
    });
    this.formPrefeitura.get('cargo').valueChanges.subscribe(value => {
      if (value !== null) {
        this.cargo = value;
      }
    });
  }

  carregaEstados() {
    this.provinciaEstadoService.buscarTodosBrasil().subscribe(response => {
      this.listaEstados = response;
    });
  }

  carregaPartidos() {
    this.partidoService.buscar().subscribe(response => {
      this.listaPartidos = response;
    });
  }

  selecionaEstado(event: any) {
    this.formPrefeitura.controls.estado.setValue(event);
    this.cidadeService.buscarPorEstado(event).subscribe(res => {
      this.listaCidades = res as Cidade[];
    });
    this.listaCidades = event.cidades;
  }

  selecionaCidade(event: any) {
    this.formPrefeitura.controls.cidade.setValue(event);
  }

  selecionaPartido(event: any) {
    this.formPrefeitura.controls.partidoPolitico.setValue(event);
  }

  async processFile(event: any) {
    if (this.prefeitura.cartaCompromisso.length < 2) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.cartaCompromisso = new CartaCompromisso();
        this.cartaCompromisso.nomeArquivo = event.target.files[0].name;
        this.cartaCompromisso.extensao = reader.result.toString().split(',')[0];
        this.cartaCompromisso.arquivo = reader.result.toString().split(',')[1];
        if (PcsUtil.tamanhoArquivoEstaDentroDoLimite(reader.result.toString().split(',')[1])) {
          this.prefeitura.cartaCompromisso.push(this.cartaCompromisso);
          this.dataSource = new MatTableDataSource(this.prefeitura.cartaCompromisso);
        } else {
          PcsUtil.swal().fire({
            title: 'Cadastro de Carta-Compromisso',
            text: `Arquivo excede o tamanho limite de 10 MB`,
            type: 'warning',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
          }, error => { });
        }

      };
    } else {
      PcsUtil.swal().fire({
        title: 'Cadastro de Carta-Compromisso',
        text: `Limite de dois arquivos por cadastro`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
      }, error => { });
    }
  }

  deletarCarta(carta: CartaCompromisso) {
    this.prefeitura.cartaCompromisso.splice(this.prefeitura.cartaCompromisso.indexOf(carta), 1);
    this.dataSource = new MatTableDataSource(this.prefeitura.cartaCompromisso);
  }

  gravar() {
    this.loading = true;
    this.prefeitura.cargo = this.formPrefeitura.controls.cargo.value;
    this.prefeitura.nome = this.formPrefeitura.controls.nome.value;
    this.prefeitura.email = this.formPrefeitura.controls.email.value;
    this.prefeitura.telefone = this.formPrefeitura.controls.telefone.value;
    this.prefeitura.cidade = this.formPrefeitura.controls.cidade.value;
    this.prefeitura.partidoPolitico = this.formPrefeitura.controls.partidoPolitico.value;
    this.prefeituraService.inserir(this.prefeitura).subscribe((retorno) => {
      PcsUtil.swal().fire({
        title: 'Prefeitura',
        text: `As informações foram submetidas e vão passar pela aprovação da equipe do PCS.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.router.navigate(['/']);
        this.formPrefeitura.reset();
      }, error => { });
    }, (error) => {
      this.loading = false;
    });
  }

  alerta(titulo: any, tipo: any) {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true
    });
    swalWithBootstrapButtons.fire({
      title: titulo,
      type: tipo,
      reverseButtons: true
    });
  }

  abrirTermos(): void {
    const dialogTermos = this.dialog.open(DialogTermos, {
      width: '80%',
      height: 'auto',
      data: { nome: this.nomePrefeito, cidade: this.nomeCidade }
    });

    dialogTermos.afterClosed().subscribe(result => {
    });


  }

}

@Component({
  selector: 'dialog-termos',
  templateUrl: './dialog-termos.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DialogTermos {

  constructor(public dialogRef: MatDialogRef<DialogTermos>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private downloadsLogService: DownloadslogService) { }

  voltar(): void {
    this.dialogRef.close();
  }

  fileDownloadCarta() {
    window.open(path);
    this.downloadsLogService.registrarLogDownload('Carta de Compromisso.pdf').subscribe(() => {
    });
  }

}
