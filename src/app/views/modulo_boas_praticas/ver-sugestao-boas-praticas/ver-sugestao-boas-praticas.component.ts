import { PcsUtil } from './../../../services/pcs-util.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SugestaoBoasPraticas } from 'src/app/model/sugestaoBoasPraticas';
import { SugestaoBoasPraticasService } from 'src/app/services/sugestaoBoasPraticas.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent } from '@angular/material';
import moment from 'moment';

@Component({
  selector: 'app-ver-sugestao-boas-praticas',
  templateUrl: './ver-sugestao-boas-praticas.component.html',
  styleUrls: ['./ver-sugestao-boas-praticas.component.css']
})

export class VerSugestaoBoasPraticasComponent implements OnInit {
  loading: any;
  scrollUp: any;
  paginador: any;
  visualizacao = false;
  @ViewChild(MatSort) sort: MatSort;
  verSugestaoDescricaoForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sugestoesBoasPraticas: SugestaoBoasPraticas[] = [];
  dataSource = new MatTableDataSource<SugestaoBoasPraticas>();
  sugestaoBoasPraticasSelecionado = new SugestaoBoasPraticas();
  displayedColumns = ['nomeUsuario', 'nomePais', 'nomeEstado', 'nomeCidade', 'dataPublicacao', 'horarioPublicacao', 'Ações'];

  constructor(private sugestaoBoasPraticasService: SugestaoBoasPraticasService,
      private activatedRoute: ActivatedRoute,
      private element: ElementRef,
      private router: Router) {this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });}

  ngOnInit() {
    this.buscarSugestoesBoasPraticas();
  }

  public buscarSugestoesBoasPraticas() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.sugestaoBoasPraticasService.buscarSugestoesBoasPraticas().subscribe(response => {
        this.sugestoesBoasPraticas = response as SugestaoBoasPraticas[];
        this.dataSource = new MatTableDataSource(response);

      });
    });
  }

  public formatarDataSolicitacao(data){
    let dataFormatada = '';

    if(data){
      dataFormatada = moment(data).format('DD/MM/YYYY');
    }

    return dataFormatada;
  }
}
