import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Cidade } from 'src/app/model/cidade';

@Component({
  selector: 'app-ponto-focal-detalhes',
  templateUrl: './ponto-focal-detalhes.component.html',
  styleUrls: ['./ponto-focal-detalhes.component.css']
})
export class PontoFocalDetalhesComponent implements OnInit {

  cidade: Cidade;

  constructor(@Inject(MAT_DIALOG_DATA) private modalData: any,
              public dialogRef: MatDialogRef<PontoFocalDetalhesComponent>) { }

  ngOnInit() {
    this.cidade = this.modalData.cidadeRef;
  }

  closeModal() {
    this.dialogRef.close(null);
  }

}
