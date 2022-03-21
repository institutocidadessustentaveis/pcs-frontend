import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { FormularioAtendimento } from 'src/app/model/formulario-atendimento';
import { FormularioAtendimentoService } from 'src/app/services/formulario-atendimento.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { ModalSolicitacaoComponent } from './modal-solicitacao/modal-solicitacao.component';

@Component({
  selector: 'app-administracao-atendimento',
  templateUrl: './administracao-atendimento.component.html',
  styleUrls: ['./administracao-atendimento.component.css']
})
export class AdministracaoAtendimentoComponent implements OnInit {

  displayedColumns: string[] = ["nomeContato", "emailContato", "telContato", "dataHora", "respondido", "solicitacao"];
  dataSource = new MatTableDataSource<FormularioAtendimento>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  warningResultado = false;

  public listaSolicitacoes = [];


  constructor(private formularioAtendimentoService: FormularioAtendimentoService, 
              private dialog: MatDialog,
              private titleService: Title) {
                this.titleService.setTitle("Administração de Atendimentos - Cidades Sustentáveis")
               }

  ngOnInit() {
    this.buscarSolicitacoes();
  }

  public buscarSolicitacoes() {
    this.formularioAtendimentoService.buscarTodos().subscribe(res => {
      this.listaSolicitacoes = res;
      this.dataSource = new MatTableDataSource<FormularioAtendimento>(this.listaSolicitacoes);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
    }, error => { this.warningResultado = true });
  }

  public mask(val: string, mask: string) {
    return PcsUtil.mask(val, mask);
  }

  public openModalSolicitacao(solicitacao: FormularioAtendimento) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      solicitacao: solicitacao
    }

    dialogConfig.width = '70%';

    const dialogRef = this.dialog.open(ModalSolicitacaoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(res => {
      this.buscarSolicitacoes();
    });
  }

  verificaStatus(status: boolean) : boolean{
    if(status) {
      return true;
    } else {
      return false;
    }
  }
}
