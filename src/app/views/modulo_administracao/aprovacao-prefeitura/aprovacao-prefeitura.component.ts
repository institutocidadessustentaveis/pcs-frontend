import { FiltroAprovacaoPrefeitura } from './../../../model/filtroAprovacaoPrefeitura';
import { Component, OnInit, ViewChild, HostListener, Inject, ElementRef } from '@angular/core';
import { PedidoAprovacaoPrefeitura } from 'src/app/model/pedido-aprovacao-prefeitura';
import { MatTableDataSource, MatSort, MatPaginator, MatDialogConfig, MatDialog, MAT_DIALOG_DATA, MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { DetalhamentoPedidoAprovacaoComponent } from '../pedido-aprovacao-detalhamento/detalhamento-pedido-aprovacao.component';
import { AprovacaoPrefeituraService } from 'src/app/services/aprovacao-prefeitura.service';
import { PrefeituraService } from 'src/app/services/prefeitura-service';
import { Validators, FormGroup, FormBuilder, FormGroupDirective, NgForm, FormControl } from '@angular/forms';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router } from '@angular/router';
import { DialogModalPlanoMeta } from '../../modulo_plano_de_metas/administracao/plano-metas/plano-metas.component';
import { EmailTokenService } from 'src/app/services/emailToken.service';
import { CartaCompromisso } from 'src/app/model/carta-compromisso';
import moment from 'moment';

@Component({
  selector: 'app-aprovacao-prefeitura',
  templateUrl: './aprovacao-prefeitura.component.html',
  styleUrls: ['./aprovacao-prefeitura.component.css']
})
export class AprovacaoPrefeituraComponent implements OnInit {

  displayedColumns: string[] = ['Prefeitura', 'Data' , 'DataAprov' , 'DataInicioMandato', 'DataFimMandato', 'Status', 'Ações'];
  dataSource: any;
  pedidosAprovacao: PedidoAprovacaoPrefeitura[] = [];
  pedidoAprovacao: PedidoAprovacaoPrefeitura = new PedidoAprovacaoPrefeitura();
  innerWidth: any;
  public loading = true;
  cartasCompromisso: CartaCompromisso[] = [];
  cartaCompromisso: CartaCompromisso = new CartaCompromisso();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  scrollUp: any;

  formGroup: FormGroup;
  filtroAprovacaoPrefeitura: FiltroAprovacaoPrefeitura = new FiltroAprovacaoPrefeitura();

  constructor(private dialog: MatDialog,
    private service: AprovacaoPrefeituraService,
    private prefeituraService: PrefeituraService,
    private emailToken: EmailTokenService,
    private element: ElementRef,
    public formBuilder: FormBuilder,
    private router: Router) {
    this.scrollUp = this.router.events.subscribe((path) => {
       element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
    this.formGroup = this.formBuilder.group({
      nomePrefeitura: [null],
      dataInicioMandato: [null],
      dataFimMandato: [null],
      status: [null],
      dataPedidoCadastramento: [null]
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.carregaPedidosAprovacao();
  }

  filtrar() {
    this.filtroAprovacaoPrefeitura.nomePrefeitura = this.formGroup.controls.nomePrefeitura.value;
    this.filtroAprovacaoPrefeitura.status = this.formGroup.controls.status.value;
    this.filtroAprovacaoPrefeitura.dataInicioMandato = this.formGroup.controls.dataInicioMandato.value != null ? moment(this.formGroup.controls.dataInicioMandato.value).format('YYYY-MM-DD') : null;
    this.filtroAprovacaoPrefeitura.dataFimMandato = this.formGroup.controls.dataFimMandato.value != null ? moment(this.formGroup.controls.dataFimMandato.value).format('YYYY-MM-DD') : null;
    this.filtroAprovacaoPrefeitura.dataPedidoCadastramento = this.formGroup.controls.dataPedidoCadastramento.value != null ? moment(this.formGroup.controls.dataPedidoCadastramento.value).format('YYYY-MM-DD') : null;

    this.service.filtrarAprovacaoPrefeitura(this.filtroAprovacaoPrefeitura).subscribe(res => {
      this.configurarTabela(res);
    });
  }

  limparFiltro() {
    this.formGroup.controls.nomePrefeitura.setValue(null);
    this.formGroup.controls.status.setValue(null);
    this.formGroup.controls.dataInicioMandato.setValue(null);
    this.formGroup.controls.dataFimMandato.setValue(null);
    this.formGroup.controls.dataPedidoCadastramento.setValue(null);
    this.filtrar();
  }

  abrirDetalhamento(pedidoAprovacao: PedidoAprovacaoPrefeitura) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '95%';
    dialogConfig.maxWidth = '100vw';

    this.prefeituraService.buscarDetalhesParaAprovacao(pedidoAprovacao.prefeitura.id).subscribe(response => {
      pedidoAprovacao.prefeitura = response;
      dialogConfig.data = pedidoAprovacao;
      const dialog = this.dialog.open(DetalhamentoPedidoAprovacaoComponent, dialogConfig);
      dialog.afterClosed().subscribe(pedido => {
        this.carregaPedidosAprovacao();
      });
    });
  }

  async ativarInputCartaCompromisso(pedidoAprovacao: PedidoAprovacaoPrefeitura) {
    this.pedidoAprovacao = pedidoAprovacao;
    let inputCartaCompromisso = document.getElementById("inpCartaCompromisso");
    inputCartaCompromisso.click();
  }

  
  async processFile(event: any) {
    this.cartasCompromisso = [];
    if (event.target.files.length <= 2) {
      for(let carta of event.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(carta);
      reader.onload = () => {
          this.cartaCompromisso = new CartaCompromisso();
          this.cartaCompromisso.nomeArquivo = carta.name;
          this.cartaCompromisso.extensao = reader.result.toString().split(',')[0];
          this.cartaCompromisso.arquivo = reader.result.toString().split(',')[1];
          if (PcsUtil.tamanhoArquivoEstaDentroDoLimite(reader.result.toString().split(',')[1])) {
            this.cartasCompromisso.push(this.cartaCompromisso);
            if(event.target.files.length == this.cartasCompromisso.length) {
              this.pedidoAprovacao.prefeitura.cartaCompromisso = this.cartasCompromisso;
              this.alterarCartaCompromisso();
            }
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
        }
      }
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

  public alterarCartaCompromisso() {
    PcsUtil.swal().fire({
      title: 'Carta compromisso',
      text: `Deseja realmente alterar a carta compromisso?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.prefeituraService.alterarCartaCompromisso(this.pedidoAprovacao.prefeitura).subscribe((retorno) => {
          PcsUtil.swal().fire({
            title: 'Carta compromisso',
            text: `Carta compromisso alterada com sucesso`,
            type: 'success',
            showCancelButton: false,
            confirmButtonText: 'Ok',
          }).then((result) => {
            this.router.navigate(['/aprovacao-prefeitura']);
          }, error => { });
        }, (error) => {
          this.loading = false;
        });
      } else {
        this.loading = false;
      }
    });

  }

  private configurarTabela(response) {
    this.pedidosAprovacao = response;
    this.loading = false;
    this.pedidosAprovacao.forEach(element => {
      element.nome = element.prefeitura.cidade.nome
    });
    this.dataSource = new MatTableDataSource(this.pedidosAprovacao);
    this.dataSource.sort = this.sort;
    this.paginator._intl.itemsPerPageLabel = 'Itens por página';
    this.paginator._intl.getRangeLabel =
      (page: number, pageSize: number, length: number) => {
        if (length == 0 || pageSize == 0) { return `0 de ${length}`; }
        length = Math.max(length, 0); const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
    this.paginator._intl.firstPageLabel = 'Primeira página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.nextPageLabel = 'Próxima página';
    this.paginator._intl.lastPageLabel = 'Última página';
    this.dataSource.paginator = this.paginator;
  }

  private carregaPedidosAprovacao() {
    this.loading = true;
    this.service.buscar().subscribe(response => {
      this.configurarTabela(response)
    });
  }

  reenviarEmailAprovacao(innerWidth, pedidoAprovacao: PedidoAprovacaoPrefeitura): void {
    this.emailToken.isAtivadoByIdAprovacaoPrefeitura(pedidoAprovacao.id).subscribe(isAtivo => {
      if (isAtivo) {
        if (innerWidth <= 500) {
          const dialogModalReenvioEmail = this.dialog.open(DialogModalReenvioEmail, {
            data: {
              datakey: pedidoAprovacao,
            }
          });
          dialogModalReenvioEmail.afterClosed().subscribe(result => {
          });
        }
        else {
          const dialogModalReenvioEmail = this.dialog.open(DialogModalReenvioEmail, {
            height: 'auto',
            width: '50%',
            data: {
              datakey: pedidoAprovacao,
            }
          });
          dialogModalReenvioEmail.afterClosed().subscribe(result => {
          });
        }
      }
      else {
        PcsUtil.swal().fire({
          title: 'Aprovação de Prefeitura',
          text: `Não é possível efetuar o envio de e-mail de aprovação de prefeitura, pois esta prefeitura já cadastrou usuários.`,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
        }, error => { });
      }
    })
  }

  isPedidoAprovado(pedidoAprovacao: PedidoAprovacaoPrefeitura) {
    return pedidoAprovacao.status === 'Aprovada' || pedidoAprovacao.status === 'Concluída';
  }
}

//MODAL DE REENVIO DE EMAIL PARA APROVAÇÃO
@Component({
  selector: 'reenvioEmailAprovacaoPrefeitura',
  templateUrl: './reenvioEmailAprovacaoPrefeitura.html',
  styleUrls: ['./aprovacao-prefeitura.component.css']
})

export class DialogModalReenvioEmail implements OnInit {

  formReenvioEmail: FormGroup;
  listaEmail: string = '';
  habilitarBotaoLimpar: boolean = false;
  pedidoAprovacaoPrefeitura: PedidoAprovacaoPrefeitura = new PedidoAprovacaoPrefeitura();
  PedidoAprovacaoPrefeituraSimples
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogModalPlanoMeta>, public formBuilder: FormBuilder, public service: AprovacaoPrefeituraService) {

    this.formReenvioEmail = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.pedidoAprovacaoPrefeitura = this.data.datakey;
  }

  addEmail() {
    this.listaEmail = this.listaEmail + this.formReenvioEmail.controls['email'].value + ';';
    this.formReenvioEmail.controls['email'].setValue('');
    this.habilitarBotaoLimpar = this.listaEmail.length > 0 ? true : false;
    this.formReenvioEmail.controls['email'].reset();
  }

  cleanListEmail() {
    this.listaEmail = '';
    this.habilitarBotaoLimpar = false;
    this.formReenvioEmail.controls['email'].reset();
  }

  reenviarEmail() {
    this.service.reenviarEmail(this.pedidoAprovacaoPrefeitura.prefeitura.id, this.listaEmail).subscribe(response => {
      if (response === true)
        PcsUtil.swal().fire({
          title: 'Aprovação de Prefeitura',
          text: `E-mail de aprovação da prefeitura enviado.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.cleanListEmail();
          this.dialogRef.close();
        }, error => { });
      else
        PcsUtil.swal().fire({
          title: 'Aprovação de Prefeitura',
          text: `Erro ao efetuar o envio de e-mail de aprovação de prefeitura.`,
          type: 'error',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
        }, error => { });
    });
  }

  fechar() {
    this.dialogRef.close();
  }
}
