import { ChangeDetectorRef, Component, OnInit, ViewChild, EventEmitter, Output, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSelectChange } from '@angular/material';
import { Estado } from 'src/app/model/PainelIndicadorCidades/estado';
import { PainelIndicadorCidadeService } from 'src/app/services/painel-indicador-cidade.service';
import { Cidade } from 'src/app/model/cidade';
import { ProvinciaEstadoShapeService } from 'src/app/services/provincia-estado-shape.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';
import { Router } from '@angular/router';

import * as L from 'leaflet';
import { GestureHandling } from "leaflet-gesture-handling";
import { latLng, tileLayer, geoJSON, circle, marker, circleMarker } from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-painel-indicadores-cidade-grupo-cidade',
  templateUrl: './painel-indicadores-cidade-grupo-cidade.component.html',
  styleUrls: ['./painel-indicadores-cidade-grupo-cidade.component.css']
})

export class PainelIndicadoresCidadeGrupoCidadeComponent implements OnInit {
  displayedColumns: string[] = ['cidade', 'Acoes'];
  dataSource = new MatTableDataSource<Cidade>();
  listaEstado: Array<Estado>;
  listaCidade: Array<Cidade> = new Array<Cidade>();
  exibirMensagemAlerta:boolean = false;
  provider = new OpenStreetMapProvider();
  cidades: any[];
  options = {
    layers: [
      tileLayer(environment.MAP_TILE_SERVER, {
                detectRetina: true,
                attribution: environment.MAP_ATTRIBUTION,
                noWrap: true,
                minZoom: 2
      })
    ],
    zoom: 4,
    gestureHandling: true,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([ -15.03144, -53.09227 ])
  }

  layersControl = [ ]

  estadoSelecionado: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  scrollUp: any;

  constructor(public painelIndicadorCidadeService: PainelIndicadorCidadeService,
              public shapeService: ProvinciaEstadoShapeService,
              public cidadesService: CidadeService,
              private indicadoresPreenchidosService: IndicadoresPreenchidosService,
              private changeDetectorRefs: ChangeDetectorRef,
              private element: ElementRef, 
              private router: Router) {
    this.scrollUp = this.router.events.subscribe((path) => {
      element.nativeElement.scrollIntoView();
    });

    L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
  }

  ngOnInit() {
    this.buscarEstadosSignatarios();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.carregarDadosMapa();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  buscarIndicadoresPreenchidosCidade(){
    this.indicadoresPreenchidosService.buscarQtIndicadorPreenchidoPorCidade().subscribe( res => {
      this.cidades = res as  any[];
      for(let i = 0 ; i< this.cidades.length; i++) {
        let cidade  = this.cidades[i];
        if (cidade.latitude !== null && cidade.longitude !== null){
          this.layersControl.push(circleMarker([ cidade.latitude, cidade.longitude ],
            { radius: 10,
              fillColor: 'red',
              color: 'red',
              fillOpacity: .7,
              weight: 1
            }).bindPopup(`<strong>${cidade.cidade}, ${cidade.provinciaEstado}</strong></br>
                          <strong>Nº de Indicadores Preenchidos: </strong>${cidade.qtdIndicadoresPreenchidos}`));
        }
      }
    });
  }

  buscarEstadosSignatarios() {
    this.painelIndicadorCidadeService.buscarEstadosSignatarios().subscribe(response => {
      this.listaEstado = response;
    });
  }

  tradeEstado(idEstado:number){
    this.painelIndicadorCidadeService.buscarCidadesSignatarios(idEstado).subscribe(response => {
      this.listaCidade = response as Array<Cidade>;
      this.dataSource = new MatTableDataSource<Cidade>(this.listaCidade);
      this.paginator._intl.itemsPerPageLabel = 'Itens por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 de ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize; const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} de ${length}`; }
      this.dataSource.paginator = this.paginator;
      this.paginator.pageIndex = 0;
      this.paginator.length = this.listaCidade.length;
      this.dataSource.sort = this.sort;
      this.paginator._intl.firstPageLabel = 'Primeira página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Próxima página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.exibirMensagemAlerta = this.listaCidade.length > 0 ? false : true;
      this.changeDetectorRefs.detectChanges();
    });
  }

  public carregarDadosMapa() {
    this.cidadesService.calcularPorcentagemCidadesSignatariasPorEstado().subscribe(porcentagens => {
      this.cidadesService.calcularNumeroCidadesSignatariasPorEstado().subscribe(response => {
        if(response.length > 0) {
          this.shapeService.buscarPorEstados(response.map(r => r['idEstado'])).subscribe(shapes => {
            shapes.forEach(shape => {
              let porcentagem = porcentagens.filter(p => p['idEstado'] === shape['estado']['idProvinciaEstado'])[0]['porcentagemSignatarias'];
              let opacity = this.calcularOpacidadeShape(porcentagem);

              let options = {"color": "#037000", "weight": 1, "opacity": opacity, "fillOpacity": opacity}

              let geoJson = geoJSON([shape['geometria']], options)
              geoJson.on('click', () => {
                this.estadoSelecionado = shape['estado']['idProvinciaEstado'];
                this.tradeEstado(shape['estado']['idProvinciaEstado']);
                this.changeDetectorRefs.detectChanges();
              })

              this.layersControl.push(geoJson);
            });

            this.buscarIndicadoresPreenchidosCidade();
          });
        }
      });
    });
  }

  private calcularOpacidadeShape(porcentagem: number) {
    let opacidade : number = porcentagem / 100;

    if(opacidade < 0.25) {
      return 0.25
    }

    if(opacidade > 0.85) {
      return 0.85;
    }

    return opacidade;
  }

}

