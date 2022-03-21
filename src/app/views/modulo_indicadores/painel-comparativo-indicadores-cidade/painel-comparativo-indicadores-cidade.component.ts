import { Component,  ViewChild, OnInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { MatTableDataSource, MatPaginator, MatSort, MatTable } from '@angular/material';
import { Indicador } from 'src/app/model/indicadores';
import { Cidade } from 'src/app/model/cidade';
import { Eixo } from 'src/app/model/eixo';
import { Variavel } from 'src/app/model/variaveis';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { FiltroIndicadores } from 'src/app/model/filtroIndicadores';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface DropDownList {
  value: number;
  viewValue: string;
}

@Component({
  selector: "app-painel-comparativo-indicadores-cidade",
  templateUrl: "./painel-comparativo-indicadores-cidade.component.html",
  styleUrls: ["./painel-comparativo-indicadores-cidade.component.css"]
})
export class PainelComparativoIndicadoresCidadeComponent implements OnInit {
  idGrupo: number;
  loading: any;
  idIndicador: number;
  indicadorEscolhido: any;
  listaCidade: any[] = [];
  filtroCidades: string;
  displayedColumns: string[] = ["Indicador", "Ações"];
  displayedColumns2: string[] = ["cidade"];
  dataSource = new MatTableDataSource<Indicador>();
  dataSource2 = new MatTableDataSource<Cidade>();
  indicadorSelecionado: Indicador = new Indicador();
  checked: boolean = false;
  mostra: boolean = true;
  exibirMensagemAlerta: boolean = false;
  exibirIndicador: boolean = false;

  listaEixo: Array<Eixo>;
  listaVariaveis: Array<Variavel> = new Array<Variavel>();
  listaODS: Array<ObjetivoDesenvolvimentoSustentavel>;
  listaCidadeCombo: Array<Cidade>;
  filtro: FiltroIndicadores = new FiltroIndicadores();
  formFiltro: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  scrollUp: any;

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    public indicadoresService: IndicadoresService,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    private element: ElementRef,
    private http: HttpClient,
    public formBuilder: FormBuilder
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
    this.formFiltro = this.formBuilder.group({
      eixo: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      variavel: ["", [Validators.minLength(4), Validators.maxLength(4)]],
      ods: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      nomeIndicador: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      cidade: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      valorIndicador: [
        "",
        [Validators.minLength(3), Validators.maxLength(200)]
      ],
      popDe: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      popAte: ["", [Validators.minLength(3), Validators.maxLength(200)]],
      dataPreenchimento: [
        "",
        [Validators.minLength(3), Validators.maxLength(200)]
      ],
      tipologias: [""],
      modoentrada: [""]
    });
  }

  async ngOnInit() {
    //this.idIndicador = Number(this.route.snapshot.paramMap.get('id'));
    //this.indicadorEscolhido = this.route.snapshot.paramMap.get('nome');
    this.idGrupo = 0;
    this.loading = true;
    this.carregarDados();
  }

  carregarDadosCidades(idIndicador: number, nome: string) {
    this.idIndicador = idIndicador;
    this.indicadorEscolhido = nome;
    this.carregarCidades();
    this.exibirIndicador = true;
  }

  tradeGrupo(value) {
    this.idGrupo = value;
  }

  listarCidades(id: number, nome: string) {
    this.mostra = true;
    // Redirect page
    this.router.navigate([
      "/painelComparativoIndicadoresCidade/mostraCidades",
      id,
      nome
    ]);
  }

  fecharPainelCidades() {
    this.listaCidade = [];
    this.exibirIndicador = false;
  }

  compararCidades() {
    this.filtroCidades = "";
    let quantidadeCidadesSelecionadas = 0;

    for (let cidade of this.listaCidade) {
      if (cidade.habilitada == true) {
        if (cidade.id !== "undefined") {
          this.filtroCidades += cidade.id + ",";
          quantidadeCidadesSelecionadas++;
        }
      }
    }

    if (quantidadeCidadesSelecionadas > 0) {
      // Redirect page
      this.router.navigate(
        ["/painelComparativoIndicadoresCidade/detalhes", this.idIndicador],
        { queryParams: { filtroCidades: this.filtroCidades } }
      );
    } else {
      PcsUtil.swal().fire({
        title: "Escolha no mínimo uma cidade para exibir o comparativo",
        text: "",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Ok"
      });
    }
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  async carregarDados() {
    await this.indicadoresService.buscarIndicadoresPcs().subscribe(
      async response => {
        this.dataSource = new MatTableDataSource<Indicador>(response);
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

        this.indicadoresService.carregaEixo().subscribe(response => {
          this.listaEixo = response;
        });

        this.indicadoresService.carregaVariaveis().subscribe(response => {
          this.listaVariaveis = response;
        });

        this.indicadoresService.carregaOds().subscribe(response => {
          this.listaODS = response;
        });
        this.indicadoresService
          .carregaCidadeSignataria()
          .subscribe(response => {
            this.listaCidadeCombo = response as Cidade[];
          });

        this.loading = false;
      },
      error => {
        this.loading = false;
      }
    );
    this.loading = false;
  }

  async carregarCidades() {
    await this.indicadoresService
      .buscarCidadesPorIndicador(this.idIndicador)
      .subscribe(
        async res => {
          this.listaCidade = res;
          this.dataSource2 = new MatTableDataSource<Cidade>(res);
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
  }

  public selectAll(checked): void {
    this.checked = checked === false ? true : false;
    if (this.checked) {
      for (let cidade of this.listaCidade) {
        cidade.habilitada = true;
      }
    } else {
      for (let cidade of this.listaCidade) {
        cidade.habilitada = false;
      }
    }
  }

  buscarIndicador(id) {
    this.activatedRoute.params.subscribe(
      params => {
        this.indicadorSelecionado = new Indicador();

        if (id) {
          this.indicadoresService.buscarIndicadorId(id).subscribe(
            response => {
              {
                this.indicadorSelecionado = response;
              }
            },
            error => {
              this.loading = false;
            }
          );
        } else {
          this.loading = false;
        }
      },
      error => {
        this.loading = false;
      }
    );
  }

  public setarHabilitada(id: number) {
    for (let cidade of this.listaCidade) {
      if (cidade.id === id) {
        if (cidade.habilitada == true) {
          cidade.habilitada = false;
        } else {
          cidade.habilitada = true;
        }
      }
    }
  }

  public applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();

    this.indicadoresService
      .buscarCidadesPorIndicadorENome(this.idIndicador, filterValue)
      .subscribe(response => {
        this.listaCidade = response as Cidade[];
        this.exibirMensagemAlerta = this.listaCidade.length < 1;
      });
  }

  filtrar() {
    this.loading = true;
    this.filtro.eixo = this.formFiltro.controls["eixo"].value;

    this.filtro.variavel = this.formFiltro.controls["variavel"].value;
    this.filtro.ods = this.formFiltro.controls["ods"].value;
    this.filtro.nome = this.formFiltro.controls["nomeIndicador"].value;
    this.filtro.cidade = this.formFiltro.controls["cidade"].value;
    // De , ate
    this.filtro.popDe = this.formFiltro.controls["popDe"].value;
    this.filtro.popAte = this.formFiltro.controls["popAte"].value;

    this.filtro.valor = this.formFiltro.controls["valorIndicador"].value;
    this.filtro.dataPreenchimento = this.formFiltro.controls[
      "dataPreenchimento"
    ].value;
    if (!this.filtro.eixo) {
      this.filtro.eixo = null;
    }
    if (!this.filtro.variavel) {
      this.filtro.variavel = null;
    }
    if (!this.filtro.ods) {
      this.filtro.ods = null;
    }
    if (!this.filtro.cidade) {
      this.filtro.cidade = null;
    }

    //alert(JSON.stringify(this.filtro));

    this.indicadoresService.buscarIndicadorFiltrado(this.filtro).subscribe(
      response => {
        this.dataSource = new MatTableDataSource<Indicador>(response);
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
      },
      error => {
        this.loading = false;
      }
    );
  }

  limpar() {
    this.formFiltro.reset();
  }
}
