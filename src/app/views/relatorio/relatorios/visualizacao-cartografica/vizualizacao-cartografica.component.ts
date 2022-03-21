import { CidadeService } from "src/app/services/cidade.service";
import { ProvinciaEstadoService } from "src/app/services/provincia-estado.service";
import { PcsUtil } from "src/app/services/pcs-util.service";
import { MAT_DATE_FORMATS } from "@coachcare/datepicker";
import { QuantidadeIndicadoresCadastrados } from "src/app/model/Relatorio/QuantidadeIndicadoresCadastrados";
import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { RelatorioService } from "src/app/services/relatorio.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from "@angular/forms";
// Model
import { VisualizacaoCartografica } from "../../../../model/Relatorio/VisualizacaoCartografica";
import { Observable } from "rxjs";
import { startWith, map } from "rxjs/operators";
import moment from "moment";
import { time } from "console";
import { ItemCombo } from "src/app/model/ItemCombo ";
import { IndicadoresService } from "src/app/services/indicadores.service";

@Component({
  selector: "app-vizualizacao-cartografica",
  templateUrl: "./vizualizacao-cartografica.component.html",
  styleUrls: ["./vizualizacao-cartografica.component.css"]
})
export class VisualizacaoCartograficaComponent implements OnInit {
  formRelatorio: FormGroup;
  displayedColumns: string[] = [
    "cidade",
    "estado",
    "usuario",
    "data",
    "hora",
    "acao"
  ];
  dataSource = new MatTableDataSource<VisualizacaoCartografica>();
  visualizacaoCartografica: VisualizacaoCartografica = new VisualizacaoCartografica();
  tabela: Array<VisualizacaoCartografica> = new Array<VisualizacaoCartografica>();

  filteredOptionsIndicador: Observable<Array<{id: string, nome: string, numerico: boolean}>>;
  loading: any;
  date = new Date();
  myControl = new FormControl();
  options: string[];
  filteredOptions: Observable<string[]>;
  titulo = "Visualização Cartográfica";
  listaEstado = [];
  listaCidade = [];
  listaIndicadores = [];
  listaIndicadoresDispersao = [];

  indicadorEscolhido: string;
  qtdVisualizacao: Number;
  qtdExportacao: Number;

  colunas = [
    { title: "Indicador", dataKey: "indicador" },
    { title: "Quantidade de visualizações", dataKey: "qtdeVisualizacao" },
    { title: "Quantidade de exportações", dataKey: "qtdeExportacao" },
    { title: "Cidade", dataKey: "cidade" },
    { title: "Estado", dataKey: "estado" },
    { title: "Usuário", dataKey: "usuario" },
    { title: "Data", dataKey: "data" },
    { title: "Data/Hora", dataKey: "dataHora" },
    { title: "Ação", dataKey: "acao" },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() idRelatorio: number;
  scrollUp: any;

  public resultadoEncontrado = false;
  public pesquisou = false;

  constructor(
    public relatorioService: RelatorioService,
    public activatedRoute: ActivatedRoute,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    private provinciaEstadoService: ProvinciaEstadoService,
    private cidadeService: CidadeService,
    private element: ElementRef,
    private router: Router,
    private indicadorService: IndicadoresService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.formRelatorio = this.formBuilder.group({
      dataInicio: [""],
      dataFim: [""],
      indicador: ["",[ Validators.required]],
      estado: [""],
      cidade: [""],
    });
  }

  ngOnInit() {
    
    this.tabela = [];
    this.visualizacaoCartografica.indicador = "";
    this.visualizacaoCartografica.cidade = "";
    this.visualizacaoCartografica.usuarioLogado = this.authService.credencial.login;
    this.paginator._intl.itemsPerPageLabel = "Itens por página";
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length == 0 || pageSize == 0) {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1} - ${endIndex} de ${length}`;
    };
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.paginator._intl.firstPageLabel = "Primeira página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.nextPageLabel = "Próxima página";
    this.paginator._intl.lastPageLabel = "Última página";
    this.loading = false;
    this.formRelatorio.controls["dataInicio"].setValue("");
    this.formRelatorio.controls["dataFim"].setValue("");
    this.formRelatorio.controls["estado"].setValue("");
    this.formRelatorio.controls["cidade"].setValue("");
    this.loadCidades();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );
    

    this.populaComboIndicador();
    this.populaComboEstado();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  loadCidades() {
    this.options = [];
    this.relatorioService.carregarCidades().subscribe(response => {
      for (const itemCidade of response) {
        this.options.push(itemCidade.nome);
      }
    });
  }

  formatarParaExportar(registros: VisualizacaoCartografica[]): any[] {
    let formatados: any[] = [];
    registros.forEach(registro => {
      let formatado: {} = {};
      formatado["indicador"] = registro.indicador;
      formatado["qtdeVisualizacao"] = this.qtdVisualizacao;
      formatado["qtdeExportacao"] = this.qtdExportacao;
      formatado["cidade"] = registro.cidade ? registro.cidade : 'N/A';
      formatado["estado"] = registro.estado ? registro.estado : 'N/A';
      formatado["usuario"] = registro.usuario ? registro.usuario : 'N/A';
      formatado["data"] = moment(registro.data).format("DD/MM/YYYY");
      formatado["dataHora"] = moment(registro.data).format("HH:mm:ss");
      formatado["acao"] = registro.acao;
      formatados.push(formatado);
    });
    return formatados;
  }

  searchReport() {
    this.loading = true;

    //Build Object to send
    this.visualizacaoCartografica.dataInicio = this.formRelatorio.controls["dataInicio"].value;
    this.visualizacaoCartografica.dataFim = this.formRelatorio.controls["dataFim"].value;
    this.visualizacaoCartografica.indicador = this.formRelatorio.controls["indicador"].value
    this.visualizacaoCartografica.estado = this.formRelatorio.controls["estado"].value.label;
    this.visualizacaoCartografica.cidade = this.formRelatorio.controls["cidade"].value.label;

    this.indicadorEscolhido = this.formRelatorio.controls["indicador"].value;
   

    this.relatorioService
      .searchVisualizacaoCartografica(this.visualizacaoCartografica)
      .subscribe(
        response => {
          this.calculaQtdVisualizacaoExportacao(response);
          this.verificaResultadoEncontrado(response);
          this.pesquisou = true;
          this.dataSource = new MatTableDataSource<VisualizacaoCartografica>(response);
          this.paginator._intl.itemsPerPageLabel = "Itens por página";
          this.paginator._intl.getRangeLabel = (
            page: number,
            pageSize: number,
            length: number
          ) => {
            if (length == 0 || pageSize == 0) {
              return `0 de ${length}`;
            }
            length = Math.max(length, 0);
            const startIndex = page * pageSize;
            const endIndex =
              startIndex < length
                ? Math.min(startIndex + pageSize, length)
                : startIndex + pageSize;
            return `${startIndex + 1} - ${endIndex} de ${length}`;
          };
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.paginator._intl.firstPageLabel = "Primeira página";
          this.paginator._intl.previousPageLabel = "Página anterior";
          this.paginator._intl.nextPageLabel = "Próxima página";
          this.paginator._intl.lastPageLabel = "Última página";
          this.tabela = response;

        },
        error => {
          this.loading = false;
        }
      );
  }

  public async estadoSelecionado(event: any) {
    if(event){
      this.cidadeService.buscarPorIdEstado(event.id).subscribe(response => {
        this.listaCidade = response as ItemCombo[];
      });
    }
   
  }

  verificaResultadoEncontrado(res: any) {
    if (res != null && res !== undefined && res.length > 0) {
      this.resultadoEncontrado = true;
      this.loading = false;
    } else {
      this.resultadoEncontrado = false;
      this.loading = false;
    }
  }

  public populaComboIndicador() {
    this.indicadorService
      .buscarIndicadoresPcsParaCombo()
      .subscribe(response => {
        this.listaIndicadores = response;
        this.filteredOptionsIndicador = this.formRelatorio.controls.indicador.valueChanges.pipe(startWith(''), map(value => this._filterIndicador(value)));
        this.listaIndicadoresDispersao = response;
      });
  }

  private _filterIndicador(value: string): Array<{id: string, nome: string, numerico: boolean}> {
    if (value && typeof value == "string" && value != undefined) {
      const filterValue = value;
      return this.listaIndicadores.filter(option => option.nome.toLowerCase().includes(filterValue.toLowerCase()));
    } else {
        return this.listaIndicadores.slice(0, this.listaIndicadores.length)
     
    }
  }

  getLabelIndicador(indicador: string){
    if(this.listaIndicadores.find(x => x.nome == indicador) !=null && this.listaIndicadores.find(x => x.nome == indicador) != undefined){
      return this.listaIndicadores.find(x => x.nome == indicador).nome;
    }else{
      return "";
    }
  }

  populaComboEstado(){
    this.provinciaEstadoService.buscarComboBoxEstado().subscribe(response => {
      this.listaEstado = response as ItemCombo[];
    });
  }

  calculaQtdVisualizacaoExportacao(res: VisualizacaoCartografica[]){
    let qtdVisualizacoAux = res.filter((data) => { return data.acao === "Visualizacao"});
    let qtdExpAux =  res.filter((data) => { return data.acao === "Exportacao"});
    this.loading = true;
   
    this.qtdVisualizacao = qtdVisualizacoAux.length;
    this.qtdExportacao = qtdExpAux.length;

    this.loading = false;
  }

}
