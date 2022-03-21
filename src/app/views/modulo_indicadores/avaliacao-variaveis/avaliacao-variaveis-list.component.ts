import {
  Component,
  ViewChild,
  OnInit,
  QueryList,
  ViewChildren,
  ElementRef
} from "@angular/core";
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatTable
} from "@angular/material";
import { AuthService } from "src/app/services/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import localePtBr from "@angular/common/locales/pt";
import { registerLocaleData } from "@angular/common";
import { AvaliacaoVariavelService } from "src/app/services/avaliacao-variavel.service";

export class AvaliacaoVariavelDTO {
  id?: Number;
  cidade: string;
  qtdVariaveis: number;
  dataPreenchimento: Date;
  dataAvaliacao: Date;
  status: string;
}

@Component({
  selector: "app-avaliacao-variaveis-list",
  templateUrl: "./avaliacao-variaveis-list.component.html",
  styleUrls: ["./avaliacao-variaveis-list.component.css"]
})
export class AvaliacaoVariaveisListComponent implements OnInit {
  displayedColumns: string[] = [
    "Prefeitura",
    "QtdeVariaveis",
    "DtPreenchimento",
    "DtAvaliacao",
    "Status",
    "#Acoes"
  ];
  dataSource = new MatTableDataSource<AvaliacaoVariavelDTO>();
  loading: any;
  listaDados: Array<AvaliacaoVariavelDTO>;
  dados: AvaliacaoVariavelDTO;
  filtroStatus: string;
  statusSelecionado: string;
  qtdeVariaveisTexto: number;
  selected: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  scrollUp: any;

  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public avaliacaoVariavelService: AvaliacaoVariavelService,
    private element: ElementRef
  ) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });
    registerLocaleData(localePtBr);
  }

  ngOnInit() {
    this.loading = true;
    this.carregaDados();
  }

  async carregaDados() {
    await this.avaliacaoVariavelService.buscar().subscribe(async response => {
      this.listaDados = response;
      this.dataSource = new MatTableDataSource<AvaliacaoVariavelDTO>(
        this.listaDados
      );
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
      this.paginator._intl.firstPageLabel = "Primeira página";
      this.paginator._intl.previousPageLabel = "Página anterior";
      this.paginator._intl.nextPageLabel = "Próxima página";
      this.paginator._intl.lastPageLabel = "Última página";
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.loading = false;
      this.selected = "Todos";
    });
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  tradeStatus(statusSelecionado: string) {
    let lista: Array<AvaliacaoVariavelDTO> = new Array<AvaliacaoVariavelDTO>();
    lista =
      statusSelecionado === null || statusSelecionado === "Todos"
        ? this.listaDados
        : this.listaDados.filter(
            x =>
              x.status.trim().toUpperCase() ===
              statusSelecionado.trim().toUpperCase()
          );
    this.dataSource = new MatTableDataSource<AvaliacaoVariavelDTO>(lista);
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
    this.paginator._intl.firstPageLabel = "Primeira página";
    this.paginator._intl.previousPageLabel = "Página anterior";
    this.paginator._intl.nextPageLabel = "Próxima página";
    this.paginator._intl.lastPageLabel = "Última página";
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loading = false;
    this.selected =
      statusSelecionado === null || statusSelecionado === "Todos"
        ? "Todos"
        : statusSelecionado;
  }
}
