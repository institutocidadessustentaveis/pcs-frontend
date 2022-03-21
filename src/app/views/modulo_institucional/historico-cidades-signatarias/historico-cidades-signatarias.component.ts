
import {animate, state, style, transition, trigger} from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Prefeitura } from 'src/app/model/prefeitura';
import { PrefeituraService } from 'src/app/services/prefeitura-service';

@Component({
  selector: 'app-historico-cidades-signatarias',
  templateUrl: './historico-cidades-signatarias.component.html',
  styleUrls: ['./historico-cidades-signatarias.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HistoricoCidadesSignatariasComponent implements OnInit {

  public loading: boolean;
  public cidades: Array<any> = [];

  columnsToDisplay: string[] = ["cidade"];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  expandedElement: Prefeitura | null;

  constructor(
    private title: Title,
    private prefeituraService: PrefeituraService
  ) { }

  ngOnInit() {
    this.title.setTitle("Histórico de Cidades Signatárias - Cidades Sustentáveis");
    this.paginator._intl.itemsPerPageLabel="Itens por página:";
    this.loading = true;
    this.buscarSignatarias();
  }

  public buscarSignatarias() {
    this.prefeituraService.buscarCidadesSignatariasDataMandatos().subscribe(cidades => { 
      this.loading = false;    
      this.cidades = cidades as any;
      this.dataSource = new MatTableDataSource<any>(this.cidades);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  public filtrarCidade(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(this.dataSource);

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public jaFoiSignataria(prefeituras: Array<any>) {
    var listAux: Array<any> = [];
    if(prefeituras.length >= 1) {
      for (let prefeitura of prefeituras) {
        if(!prefeitura.signataria) {
          listAux.push(prefeitura);
        }
      }
    }
    return listAux.length;
  }

  gerarLinkCidade(prefeitura) {
    return `/painel-cidade/${prefeitura.idCidade}`
  }
}


