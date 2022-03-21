import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { SugestaoBoasPraticasService } from 'src/app/services/sugestaoBoasPraticas.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SugestaoBoasPraticas } from 'src/app/model/sugestaoBoasPraticas';
import moment from 'moment';

@Component({
  selector: 'app-ver-sugestao-boas-praticas-detalhado',
  templateUrl: './ver-sugestao-boas-praticas-detalhado.component.html',
  styleUrls: ['./ver-sugestao-boas-praticas-detalhado.component.css']
})
export class VerSugestaoBoasPraticasDetalhadoComponent implements OnInit {
  loading: any;
  scrollUp: any;
  sugestaoBoaPratica:any =[];
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<SugestaoBoasPraticas>();

  constructor(
      private router: Router,
      private element: ElementRef,
      private activatedRoute: ActivatedRoute,
      private sugestaoBoasPraticasService: SugestaoBoasPraticasService,
    ) {
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
   }

  ngOnInit() {
    this.descricaoBoaPratica();
  }

  async descricaoBoaPratica() {
    await this.activatedRoute.params.subscribe(async params => {
      let id = params.id;
      if (id) {
        await this.sugestaoBoasPraticasService.buscarSugestaoBoasPraticasId(id).subscribe(async response => {
          this.sugestaoBoaPratica = response;

          this.dataSource.sort = this.sort;
          this.loading = false;
        }, error => { this.loading = false; });
      }
    }, error => { this.loading = false; });
  }

  public formatarDataSolicitacao(){
    let dataFormatada = '';

    if(this.sugestaoBoaPratica.dataPublicacao){
      dataFormatada = moment(this.sugestaoBoaPratica.dataPublicacao).format('DD/MM/YYYY');
    }

    return dataFormatada;
  }
}
