import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, AfterContentChecked, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { InstitucionalDinamicoPublicacao } from 'src/app/model/institucional-dinamico-publicacao';
import { environment } from 'src/environments/environment';
import { InstitucionalDinamicoPublicacaoComponent } from '../institucional-dinamico-publicacao/institucional-dinamico-publicacao.component';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { InstitucionalDinamicoService } from 'src/app/services/institucional-dinamico.service';

@Component({
  selector: 'app-institucional-publicacao-visualizacao',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './institucional-dinamico-publicacao-visualizacao.component.html',
  styleUrls: ['./institucional-dinamico-publicacao-visualizacao.component.css']
})
export class InstitucionalDinamicoPublicacaoVisualizacaoComponent implements OnInit {

  constructor(
    public institucionalDinamicoService: InstitucionalDinamicoService,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef) { }
  @Input() publicacao: InstitucionalDinamicoPublicacao ;
  @Output() resultado = new EventEmitter();
  @Output() moverParaEsquerda = new EventEmitter();
  @Output() moverParaDireita = new EventEmitter();
  
  public urlbackend = environment.API_URL;

  ngOnInit() {

  }

  escolherPublicacao() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = '600px';
    dialogConfig.maxWidth = '600px';
    dialogConfig.data = this.publicacao;
    const dialog = this.dialog.open(
      InstitucionalDinamicoPublicacaoComponent,
      dialogConfig
    );
    dialog.afterClosed().subscribe(res => {
      if (!res.cancelado) {    
        this.publicacao = res;        
        this.resultado.emit(this.publicacao);
        this.publicacao = null;
      }
    });
  }
  excluirPublicacao() {

    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        if(this.publicacao.id){
          this.institucionalDinamicoService.excluirPublicacaoDinamica(this.publicacao.id).subscribe(resp => {
            PcsUtil.swal().fire('Excluído!', `Publicação excluída.`, 'success');
          });
        }
        this.publicacao = null;
        this.resultado.emit(this.publicacao);
      } else {

      }
    });
  }

  paraDireita(publicacao: any) {
    this.moverParaDireita.emit(publicacao);
  }
  paraEsquerda(publicacao:any) {
    this.moverParaEsquerda.emit(publicacao);
  }

}
