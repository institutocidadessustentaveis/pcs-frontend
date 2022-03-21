import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Indicador } from 'src/app/model/indicadores';
import { IndicadoresCidade } from 'src/app/model/PainelIndicadorCidades/indicadoresCidade';
import { CidadeService } from 'src/app/services/cidade.service';
import { PainelIndicadorCidadeService } from 'src/app/services/painel-indicador-cidade.service';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { ProvinciaEstadoShapeService } from 'src/app/services/provincia-estado-shape.service';
import 'src/assets/mapmarker.png';
import { IndicadoresService } from './../../../services/indicadores.service';

@Component({
  selector: "app-comparar-indicadores-diferentes-mesmacidade-detalhes",
  templateUrl: "./comparacao-mesma-cidade-detalhes.component.html",
  styleUrls: ["./comparacao-mesma-cidade-detalhes.component.css"]
})
export class CompararIndicadoresDiferentesMesmaCidadeDetalhesComponent
  implements OnInit {
  scrollUp: any;

  @Input()
  set id(idCidade: number) {
    this.idCidade = idCidade;
  }

  @Input()
  set ano(anoSelecionado: number) {
    this.anoIndicador = anoSelecionado;
    this.buscarDetalhesCidade();
  }

  displayedColumns = ["Indicador", "Ações"];
  dataSource;

  anoIndicador: number;

  dadosCidade: IndicadoresCidade = new IndicadoresCidade();
  idCidade: number;

  filtroIndicadores: string;
  listaIndicadores: any[] = [];
  listaIndicadoresSelecionados: any[] = [];
  indicadorSelecionado: Indicador;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public activatedRoute: ActivatedRoute,
    public painelIndicadorCidadeService: PainelIndicadorCidadeService,
    private route: ActivatedRoute,
    public shapeService: ProvinciaEstadoShapeService,
    private router: Router,
    private element: ElementRef,
    public cidadesService: CidadeService,
    private indicadorService: IndicadoresService
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Indicador>(
      this.listaIndicadoresSelecionados
    );
  }

  buscarDetalhesCidade() {
    if (this.idCidade) {
      this.painelIndicadorCidadeService
        .buscarIndicadores(this.idCidade)
        .subscribe(response => {
          this.dadosCidade = response as IndicadoresCidade;
          this.indicadorService
            .buscarIndicadorPorIdCidadePorAno(this.idCidade, this.anoIndicador)
            .subscribe(valor => {
              this.listaIndicadores = valor as Indicador[];
            });
        });
    } else {
      this.dadosCidade = new IndicadoresCidade();
    }
  }

  geradorURL(idIndicador, siglaEstado, nomeCidade) {
    let url = encodeURI(
      `/indicador/${idIndicador}/${siglaEstado}/${nomeCidade}`
    );
    return url;
  }

  compararIndicadores() {
    this.filtroIndicadores = "";
    for (const indicador of this.listaIndicadoresSelecionados) {
      this.filtroIndicadores += indicador.id + ",";
    }

    this.router.navigate(
      [
        "/compararIndicadoresDiferentesMesmaCidade/graficos",
        this.idCidade,
        this.dadosCidade.cidade,
        this.dadosCidade.uf
      ],
      { queryParams: { filtroIndicadores: this.filtroIndicadores } }
    );
  }

  private validaIndicadoresSelecionados(): boolean {
    if (this.listaIndicadoresSelecionados.length >= 5) {
      PcsUtil.swal().fire({
        title: "Selecione no máximo 5 indicadores para comparação!",
        text: "",
        type: "warning",
        showCancelButton: false,
        confirmButtonText: "Ok"
      });
      return false;
    }
    return true;
  }

  public selecionarIndicador() {
    if (this.indicadorSelecionado && this.validaIndicadoresSelecionados()) {
      this.listaIndicadoresSelecionados.push(this.indicadorSelecionado);
      this.listaIndicadores.splice(
        this.listaIndicadores.indexOf(this.indicadorSelecionado),
        1
      );
      this.dataSource._updateChangeSubscription();
      this.indicadorSelecionado = null;
    }
  }

  public removerIndicador(indicador: Indicador) {
    this.listaIndicadores.push(indicador);
    this.listaIndicadoresSelecionados.splice(
      this.listaIndicadoresSelecionados.indexOf(indicador),
      1
    );
    this.dataSource._updateChangeSubscription();
  }
}
