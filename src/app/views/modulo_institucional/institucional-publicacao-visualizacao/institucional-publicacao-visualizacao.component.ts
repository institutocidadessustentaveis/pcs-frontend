import { InstitucionalPublicacaoComponent } from '../institucional-publicacao/institucional-publicacao.component';
import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, AfterContentChecked, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog } from '@angular/material';
import { environment } from 'src/environments/environment';
import { PublicacaoService } from 'src/app/services/publicacao.service';
import { Publicacao } from 'src/app/model/publicacao';

@Component({
  selector: 'app-institucional-publicacao-visualizacao',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './institucional-publicacao-visualizacao.component.html',
  styleUrls: ['./institucional-publicacao-visualizacao.component.css']
})
export class InstitucionalPublicacaoVisualizacaoComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public publicacaoService: PublicacaoService,
    private ref: ChangeDetectorRef) { }
  @Input() publicacao: Publicacao ;
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
      InstitucionalPublicacaoComponent,
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
    this.publicacao = null;
    this.resultado.emit(this.publicacao);
  }

  paraDireita() {
    this.moverParaDireita.emit('>');
  }
  paraEsquerda() {
    this.moverParaEsquerda.emit('<');
  }

}
