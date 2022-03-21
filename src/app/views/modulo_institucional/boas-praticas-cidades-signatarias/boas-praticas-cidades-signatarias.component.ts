import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { Prefeitura } from 'src/app/model/prefeitura';
import { PrefeituraService } from 'src/app/services/prefeitura-service';

@Component({
  selector: 'app-boas-praticas-cidades-signatarias',
  templateUrl: './boas-praticas-cidades-signatarias.component.html',
  styleUrls: ['./boas-praticas-cidades-signatarias.component.css']
})
export class BoasPraticasCidadesSignatariasComponent implements OnInit {

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
    this.title.setTitle("Boas Práticas de Cidades Signatárias - Cidades Sustentáveis");
    this.paginator._intl.itemsPerPageLabel="Itens por página:";
    this.loading = true;
    this.buscarSignatariasComBoasPraticas();
    
  }

  buscarSignatariasComBoasPraticas() {
    this.prefeituraService.buscarSignatariasComBoasPraticas().subscribe(cidades => { 
      this.loading = false;    
      this.cidades = cidades as any;
      this.dataSource = new MatTableDataSource<any>(this.cidades);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  gerarLinkCidade(cidade) {
    return `/boaspraticas/cidade/${cidade.idCidade}`
  }
}
