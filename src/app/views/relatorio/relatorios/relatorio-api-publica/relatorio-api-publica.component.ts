import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { RelatorioApiPublica } from 'src/app/model/relatorio-api-publica';
import { AuthService } from 'src/app/services/auth.service';
import { RelatorioService } from 'src/app/services/relatorio.service';

@Component({
  selector: 'app-relatorio-api-publica',
  templateUrl: './relatorio-api-publica.component.html',
  styleUrls: ['./relatorio-api-publica.component.css']
})
export class RelatorioApiPublicaComponent implements OnInit {

  formFiltro: FormGroup;

  dataSource = new MatTableDataSource<RelatorioApiPublica>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() idRelatorio: number;
  scrollUp: any;

  public registros = new Array<RelatorioApiPublica>();
  public loading = false;
  public pesquisou = false;

  public listaContagem = new Array<{nome?: string, contagem?: number}>();

  displayedColumns: string[] = ["endpoint", "data", "hora", "origemReq"];

  listaEndpoint: string[] = [
    "Busca variáveis preenchidas filtradas",
    "buscarGeoJson",
    "Busca boas práticas filtradas",
    "Busca indicadores filtrados",
    "Busca cidades com indicadores preenchidos",
    "Busca variáveis filtradas",
    "Busca variáveis preenchidas filtradas"
  ]

  nomeArquivo = 'Relatório de API Pública';
  titulo: string = "Relatório de API Pública";
  colunas: any[] = [
    { title: "Endpoint", dataKey: "endpoint" },
    { title: "Data", dataKey: "data" },
    { title: "Hora", dataKey: "hora" },
    { title: "Origem Requisição", dataKey: "origemRequisicao" }
  ];


  constructor(public relatorioService: RelatorioService, 
    public activatedRoute: ActivatedRoute,
    public authService: AuthService, 
    public formBuilder: FormBuilder,) {
      this.formFiltro = this.formBuilder.group({
        dataInicio: [''],
        dataFim: [''],
        endpoint : ['']
      });
     }

  ngOnInit() {
  }

  public buscarRelatorio(){
    this.loading = true;
    this.pesquisou = true;

    const filtro = new RelatorioApiPublica();
    filtro.endpoint = this.formFiltro.controls.endpoint.value;
    filtro.dataInicio = this.formFiltro.controls.dataInicio.value;
    filtro.dataFim = this.formFiltro.controls.dataFim.value;
    filtro.dataHora = null;
    filtro.origemRequisicao = null;

    this.relatorioService.searchRelatorioApiPublica(filtro).subscribe(res => {
      this.registros = res;
      this.configurarPainelDeContagem(this.registros);
      this.dataSource = new MatTableDataSource<RelatorioApiPublica>(this.registros);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.loading = false
    }, error => { 
      this.loading = false 
    });
  }

  configurarPainelDeContagem(registros: RelatorioApiPublica[]) {
    let arrayConferencia = [];
    this.listaContagem = [];
    registros.forEach(registro => {
      if(!arrayConferencia.includes(registro.endpoint)) {
        const objAux = {
          nome: registro.endpoint,
          contagem: registros.filter(item => item.endpoint === registro.endpoint).length
        }
  
        arrayConferencia.push(registro.endpoint)
        this.listaContagem.push(objAux);
      }
    });
  }

  formatarParaExportar(registros: RelatorioApiPublica[]): any[] {
    if(registros) {
      let formatados: any[] = [];
        registros.forEach(registro => {
        let formatado: {} = {};
        formatado["endpoint"] = registro.endpoint;
        formatado["data"] = moment(registro.dataHora).format("DD/MM/YYYY");
        formatado["hora"] = moment(registro.dataHora).format("HH:mm:ss");
        formatado["origemRequisicao"] = registro.origemRequisicao

        formatados.push(formatado);
    });
    return formatados;
    } else {
      return;
    }
  }

  formatarParaXls(registros: RelatorioApiPublica[]): any[] {
    if(registros) {
      let formatados: any[] = [];
        registros.forEach(registro => {
        let formatado: {} = {};
        formatado["endpoint"] = registro.endpoint;
        formatado["data"] = moment(registro.dataHora).format("DD/MM/YYYY");
        formatado["hora"] = moment(registro.dataHora).format("HH:mm:ss");
        formatado["origemRequisicao"] = registro.origemRequisicao

        formatados.push(formatado);
      });
    return formatados;
    } else {
      return;
    }
  }

}
