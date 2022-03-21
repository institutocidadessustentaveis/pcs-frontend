import { ChartDataSets, ChartOptions } from 'chart.js';
import { environment } from 'src/environments/environment';
import { latLng, tileLayer, geoJSON } from 'leaflet';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubdivisaoService } from 'src/app/services/subdivisao.service';
import * as L from 'leaflet';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { IndicadoresPreenchidosService } from 'src/app/services/indicadores-preenchidos.service';
import { GestureHandling } from "leaflet-gesture-handling";
import { Location } from '@angular/common';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'app-pagina-subdivisao',
  templateUrl: './pagina-subdivisao.component.html',
  styleUrls: ['./pagina-subdivisao.component.css']
})
export class PaginaSubdivisaoComponent implements OnInit {


  subdivisao:any  = {};
  arvoreSubdivisao:any =[];
  tiposSubdivisao:any = [];
  eixosIndicadores:any = [];
  features: any;
  siglaUrl: any;
  nomeCidadeUrl: any;
  nomeSubdivisaoUrl: any;
  indicadorUrl: any;
  url = environment.API_URL;
  indicadorSelecionado: any;
  indicadoresPreenchidos: any;
  fontes =[];
  observacoes =[];
  serieHistorica = {cabecalho:[], valores:[]};
  labels = [];
  fatorDesigualdade = [];
  anos :any= [];
  anoSelecionado = new Date().getFullYear()-1;
  indicadoresPreenchidosPorAno = [];
  tresMelhoresIndicadores = [];
  tresPioresIndicadores = [];
  eixoOptions: Observable<any>;
  classes=[];
  qtdLinhas = 3;
  mediana = null;

  private baseLayers = {
    Mapa: L.tileLayer(environment.MAP_TILE_SERVER, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 2,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    }),
    Satélite: L.tileLayer(environment.MAP_TILE_SERVER_SAT, {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    })
  };
  private baseLayersAnalise = {
    Mapa: L.tileLayer(environment.MAP_TILE_SERVER, {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 2,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    }),
    Satélite: L.tileLayer(environment.MAP_TILE_SERVER_SAT, {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      maxNativeZoom: 23,
      maxZoom: 23,
      attribution: environment.MAP_ATTRIBUTION,
      crossOrigin: true
    })
  };

  public optionsLeaflet = {
    layers: [
      this.baseLayers.Mapa
    ],
    zoom: 4,
    zoomControl: true,
    gestureHandling: true,
    // scrollWheelZoom: false,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227]),
  };

  public optionsLeafletAnalise = {
    layers: [
      this.baseLayersAnalise.Mapa
    ],
    zoom: 4,
    zoomControl: true,
    gestureHandling: true,
    // scrollWheelZoom: false,
    gestureHandlingOptions: {
      duration: 5000
    },
    center: latLng([-15.03144, -53.09227]),
  };

  map: any;
  mapAnalise: any;
  mapCenter = latLng([-15.03144, -53.09227]);
  mapZoom = 4;
  layersControl:any ={baseLayers: this.baseLayers,overlays:{}};
  layersControlAnalise:any ={baseLayers: this.baseLayersAnalise,overlays:{}};
  leafletLayers:any =[];
  leafletLayersAnalise:any =[];
  allLayers:any = [];


  form: FormGroup;

  lineChartData: ChartDataSets[] = [
    { data: [], label: '' },
  ];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  scrollUp:any;


  constructor(private activatedRoute: ActivatedRoute,
    private subdivisaoService: SubdivisaoService,
    private indicadorService: IndicadoresService,
    private indicadorPreenchidoService: IndicadoresPreenchidosService,
    private formBuilder: FormBuilder,
    private location: Location,
    private router: Router,
    private element: ElementRef,
    private _scrollToService: ScrollToService) {
      this.form = this.formBuilder.group({
        indicador: ['']
      });
      L.Map.addInitHook("addHandler", "gestureHandling", GestureHandling);
      this.scrollUp = this.router.events.subscribe((path) => {
        element.nativeElement.scrollIntoView();
      });
    }

  ngOnInit() {

    this.buscarDadosDaCidade();
    for(let ano = 2003; ano < new Date().getFullYear(); ano++){
      this.anos.push(ano);
    }
  }

  buscarDadosDaCidade(){
    this.activatedRoute.params.subscribe(async params => {
      let sigla = PcsUtil.toSlug(params.siglaestado);
      let nomeCidade = PcsUtil.toSlug(params.nomecidade);
      let nomeSubdivisao = PcsUtil.toSlug(params.subdivisao);
      let nomeIndicador = (params.indicador ? PcsUtil.toSlug(params.indicador) : null);
      this.siglaUrl = sigla;
      this.nomeCidadeUrl = nomeCidade;
      this.indicadorUrl = nomeIndicador;
      this.nomeSubdivisaoUrl = nomeSubdivisao;

      this.subdivisaoService.buscarUfCidadeSubdivisao(sigla,nomeCidade,nomeSubdivisao).subscribe(res =>{
        this.subdivisao = res;
        this.buscarArvoreSubdivisoes(this.subdivisao.cidade);
        this.buscarFeature(this.subdivisao.id);

        this.buscarIndicadoresCidade(this.subdivisao.cidade, nomeIndicador);
      });
    });
  }

  buscarArvoreSubdivisoes(idCidade){
    this.subdivisaoService.buscarArvoreSubdivisoes(idCidade).subscribe(res => {
      this.arvoreSubdivisao = res;

    });
  }

  buscarFeature(idCidade){
    this.subdivisaoService.buscarFeatureSubdivisao(idCidade).subscribe(res => {
      let sub = res;
      if(sub.features){
        let layerGroup = L.featureGroup();
        for(let feature of sub.features){
          let propriedades ={
            cidade: this.subdivisao.nomeCidade,
            estado: this.subdivisao.uf,
            subdivisao: this.subdivisao.nome,
            idSubdivisao: this.subdivisao.id,
            tipo:  sub.tipoSubdivisao.nome,
            pai: sub.subdivisaoPai ? sub.subdivisaoPai.nome : '',
            tipoPai: sub.subdivisaoPai ? sub.subdivisaoPai.tipoSubdivisao.nome : '',
          }

          let geojson = L.geoJSON(feature,{});
          geojson.properties = propriedades;
          const texto = propriedades.pai ?
            `<div><b>Cidade:</b> ${propriedades.cidade} - ${propriedades.estado} <br>
            <b>${propriedades.tipo}</b> ${propriedades.subdivisao}<br>
            <b>${propriedades.tipoPai}:</b> ${propriedades.pai}</div>` :
            `<div><b>Cidade:</b> ${propriedades.cidade} - ${propriedades.estado} <br>
            <b>${propriedades.tipo}</b> ${propriedades.subdivisao}</div>`;
          geojson.bindPopup(texto)
          geojson.on('mouseover', function (e) {
            this.openPopup();
          });
          geojson.on('mouseout', function (e) {
              this.closePopup();
          });
          layerGroup.addLayer(geojson);
          this.leafletLayers.push(geojson);
        }
        let bounds = layerGroup.getBounds();
        this.map.fitBounds(bounds);
      }
    });
  }



  public onMapReady(map) {
    this.map = map;
    const corner1 = L.latLng(-100, -190);
    const corner2 = L.latLng(100, 190);
    const bounds = L.latLngBounds(corner1, corner2);
    map.setMaxBounds(bounds);

  }

  public onMapReadyAnalise(map) {
    this.mapAnalise = map;
    const corner1 = L.latLng(-100, -190);
    const corner2 = L.latLng(100, 190);
    const bounds = L.latLngBounds(corner1, corner2);
    map.setMaxBounds(bounds);

  }

  public buscarIndicadoresCidade(idCidade, nomeIndicador){
    this.indicadorService.buscarComboCidade(idCidade).subscribe(res => {
      this.eixosIndicadores = res;
      this.eixoOptions = this.form.get('indicador')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterEixo(value))
      );
      if(nomeIndicador){
        let encontrouEixo = true;
        for(let eixo of this.eixosIndicadores){
          for(let indicador of eixo.indicadores){
            if(nomeIndicador == PcsUtil.toSlug(indicador.nome)){
              encontrouEixo = true;
              this.form.controls.indicador.setValue(indicador.id);
              break;
            }
          }

          if(encontrouEixo){
            this.buscarIndicador(this.form.controls.indicador.value);
            break;
          }

        }
      }

    });
  }

  private _filterEixo(value: string): any {
    value = PcsUtil.toSlug(value);
    if (value) {
      return this.eixosIndicadores
        .map(eixo => ({id: eixo.id, nome: eixo.nome ,indicadores: _filter(eixo.indicadores, value)}))
        .filter(eixo => {
          return eixo.indicadores.length > 0 || PcsUtil.toSlug(eixo.nome).indexOf(value) > -1 });
    }
    return this.eixosIndicadores;
  }

  getLabelIndicador(indicadorId: string){
    for(let eixo of this.eixosIndicadores){
      for(let indicador of eixo.indicadores){
        if(indicador.id == indicadorId){
          return indicador.nome;
        }
      }
    }
    return '';
  }

  buscarIndicador(id){
    this.indicadorService.buscarIndicadorSimplesId(id).subscribe(res => {
      this.indicadorSelecionado = res;
      this.buscarIndicadoresPreenchidos(id, this.subdivisao.id);
      this.buscarIndicadoresPreenchidosNivel(this.anoSelecionado);
      this.indicadorUrl = PcsUtil.toSlug(this.indicadorSelecionado.nome);
      this.location.replaceState(`/painel-subdivisoes/${this.siglaUrl}/${this.nomeCidadeUrl}/${this.nomeSubdivisaoUrl}/${this.indicadorUrl}`);
      const config: ScrollToConfigOptions = {
        target: 'dados-indicador'
      };
      this._scrollToService.scrollTo(config);
    });
  }



  buscarIndicadoresPreenchidos(idIndicador, idSubdivisao){
    this.indicadoresPreenchidos = [];
    this.indicadorPreenchidoService.buscarPorSubdivisaoIndicador(idIndicador,idSubdivisao).subscribe(res => {
      this.indicadoresPreenchidos = res;
      this.configurarFontes(this.indicadoresPreenchidos.variaveisPreenchidasPorAno.variaveisPreenchidas);
      this.configurarObservacoes(this.indicadoresPreenchidos.variaveisPreenchidasPorAno.variaveisPreenchidas);
      this.configurarSerieHistorica(this.indicadoresPreenchidos);
      this.configurarGrafico(this.indicadoresPreenchidos);
      this.configurarFatorDesigualdade();
    });
  }

  configurarFontes(listaVariaveis){
    this.fontes=[];
    let keys = Object.keys(listaVariaveis);
    for(let key of keys){
      let variaveis = listaVariaveis[key];
      for(let variavel of variaveis){
        if(this.fontes.indexOf(variavel.fonteTexto) == -1){
          this.fontes.push(variavel.fonteTexto);
        }
      }
    }
  }

  configurarObservacoes(listaVariaveis){
    this.observacoes=[];
    let keys = Object.keys(listaVariaveis);
    for(let key of keys){
      let variaveis = listaVariaveis[key];
      for(let variavel of variaveis){
        if(variavel.observacao && variavel.observacao.trim().length > 0){
          if(this.observacoes.indexOf(variavel.observacao) == -1){
            this.observacoes.push(variavel.observacao);
          }
        }
      }
    }
  }

  configurarSerieHistorica(ips){
    let anos:any = ips.preenchidos.map(x=> x.ano);
    anos.sort((a,b)=>(a-b));
    let cabecalho = ['Ano'];
    let nomesVariaveis = ips.indicador.variaveis.map(v => v.nome);
    nomesVariaveis.forEach(nome => cabecalho.push(nome));
    cabecalho.push('Resultado');
    let valores =  [];
    for(const ano of anos){
      let valor =[ano];
      for(const nomeVariavel of nomesVariaveis){
        for( const variavel of ips.variaveisPreenchidasPorAno.variaveisPreenchidas[ano]){
          if(variavel.nomeVariavel == nomeVariavel){
            valor.push(variavel.valor);
            break;
          }
        }
      }
      for(const ip of ips.preenchidos){
        if(ip.ano == ano){
          valor.push(ip.resultado);
        }
      }
      valores.push(valor);
    }
    this.serieHistorica.cabecalho = cabecalho;
    this.serieHistorica.valores = valores;
  }

  configurarGrafico(ips){
    this.labels = ips.preenchidos.map(x=> x.ano);
    this.labels.sort((a, b) => a - b);

    this.lineChartData[0].data =[];
    this.lineChartData[0].label ='';

    for(const label of this.labels){
      for(const ip of ips.preenchidos){
        if(ip.ano == label){
          try{
            let resultado:any = ip.resultado.replace(',','.');
            resultado = Number.parseFloat(resultado);
            (this.lineChartData[0].data as number[]).push(resultado);
            this.lineChartData[0].label = this.indicadorSelecionado.nome;
            break;
          }catch(erro){
            console.error(erro);
          }
        }
      }

    }
  }

  configurarFatorDesigualdade(){
    this.indicadorPreenchidoService.fatorDesigualdade(this.indicadorSelecionado.id, this.subdivisao.cidade, this.subdivisao.tipoSubdivisao.nivel).subscribe(res => {
      this.fatorDesigualdade = res;
    })
  }

  configurarMelhoresPiores(){
    this.tresMelhoresIndicadores = [];
    this.tresPioresIndicadores = [];
    let tamanho = this.indicadoresPreenchidosPorAno.length;
    let metade = Math.trunc(tamanho/2);
    let qtdDados = 3;
    if(metade >= 3){
      qtdDados = 3;
    } else {
      qtdDados = metade;
    }
    this.qtdLinhas = qtdDados;
    if(qtdDados >0){
      for(let i =0 ; i< qtdDados ; i++) {
        this.tresMelhoresIndicadores.push(this.indicadoresPreenchidosPorAno[i])
        this.tresPioresIndicadores.push(this.indicadoresPreenchidosPorAno[(tamanho-qtdDados)+i])
      }
    }
  }

  buscarIndicadoresPreenchidosNivel(ano){
    this.anoSelecionado = ano;
    this.indicadorPreenchidoService.porNivel(this.indicadorSelecionado.id, this.subdivisao.cidade, this.subdivisao.tipoSubdivisao.nivel, ano ? ano : this.anoSelecionado ).subscribe(res => {
      this.indicadoresPreenchidosPorAno = res;
      let setDeResultados = new Set();
      try{

        let maiorMelhor = this.indicadorSelecionado.ordemClassificacao == '1';
        if(maiorMelhor){
          this.indicadoresPreenchidosPorAno.sort((a, b) => Number(a.resultado) > Number(b.resultado) ? -1 : (Number(a.resultado) < Number(b.resultado) ? 1 : 0 ));
        } else {
          this.indicadoresPreenchidosPorAno.sort((a, b) => Number(a.resultado) < Number(b.resultado) ? -1 : (Number(a.resultado) > Number(b.resultado) ? 1 : 0 ));
        }
        this.indicadoresPreenchidosPorAno.forEach(ip => setDeResultados.add(Number(ip.resultado)));
        let listaResultados = Array.from(setDeResultados);
        this.mediana = this.calcularMediana(listaResultados);

      } catch(erro){
        console.error(erro)
      }
      this.buscarFeatureTipoSubdivisao(this.subdivisao.cidade, this.subdivisao.tipoSubdivisao.nivel);

      this.configurarMelhoresPiores();
    });
  }
  buscarFeatureTipoSubdivisao(idCidade,idTipo){
    if(this.leafletLayersAnalise.length > 0){
      this.colorirMapa();
    } else {
      this.subdivisaoService.buscarTodosPorCidadeIdNivel(idCidade ,idTipo).subscribe(res => {
        let featureGroup = L.featureGroup();
        let retorno = res;
        for(let subdivisao of retorno){
          if(subdivisao.features){
            for(let feature of subdivisao.features){
              let propriedades ={
                cidade: this.subdivisao.nomeCidade,
                estado: this.subdivisao.uf,
                subdivisao: subdivisao.nome,
                idSubdivisao: subdivisao.id,
                tipo:  subdivisao.tipoSubdivisao.nome,
                pai: subdivisao.subdivisaoPai ? subdivisao.subdivisaoPai.nome : '',
                tipoPai: subdivisao.subdivisaoPai ? subdivisao.subdivisaoPai.tipoSubdivisao.nome : '',
              }

              let geojson = L.geoJSON(feature,{});
              geojson.properties = propriedades;
              const texto = propriedades.pai ?
                `<div><b>Cidade:</b> ${propriedades.cidade} - ${propriedades.estado} <br>
                <b>${propriedades.tipo}</b> ${propriedades.subdivisao}<br>
                <b>${propriedades.tipoPai}:</b> ${propriedades.pai}</div>` :
                `<div><b>Cidade:</b> ${propriedades.cidade} - ${propriedades.estado} <br>
                <b>${propriedades.tipo}</b> ${propriedades.subdivisao}</div>`;
              geojson.bindPopup(texto)
              geojson.on('mouseover', function (e) {
                this.openPopup();
                try{
                  let options = e.layer.options;
                  let estilo = {
                    color: '#00ff2f',
                    fillColor: options.fillColor,
                    weight: 4,
                    fillOpacity: 1,
                    strokeOpacity: 0.5,
                  }
                  e.layer.setStyle(estilo)
                } catch(erro){
                  console.error(erro)
                }
              });
              geojson.on('mouseout', function (e) {
                  this.closePopup();
                  let options = e.layer.options;
                  let estilo = {
                    color: '#666666',
                    fillColor: options.fillColor,
                    weight: 2,
                    fillOpacity: 1,
                    strokeOpacity: 0.5,
                  }
                  e.layer.setStyle(estilo)
              });

              featureGroup.addLayer(geojson);
              this.leafletLayersAnalise.push(geojson);
            }
          }
        }
        let bounds = featureGroup.getBounds();
        this.mapAnalise.fitBounds(bounds);
        this.colorirMapa();
      });
    }
  }

  colorirMapa(){
    let styleDefault = {
      color: '#666666',
      fillColor: '#666f7f',
      weight: 2,
      fillOpacity: 1,
      strokeOpacity: 1,
    }
    this.leafletLayersAnalise.forEach(feature => {
      feature.setStyle(styleDefault)
    });

    let maiorMelhor = this.indicadorSelecionado.ordemClassificacao == '1';
    let qtdIndicadoresPreenchidosPorAno = this.indicadoresPreenchidosPorAno.length-1;
    let menorValor = Number(this.indicadoresPreenchidosPorAno[!maiorMelhor ? 0 : qtdIndicadoresPreenchidosPorAno].resultado);
    let maiorValor = Number(this.indicadoresPreenchidosPorAno[!maiorMelhor ? qtdIndicadoresPreenchidosPorAno : 0].resultado);
    let amplitude = maiorValor - menorValor;
    let tamanhoCadaClasse = Math.abs(amplitude / 5);
    let classes = []
    if(maiorMelhor){
      classes[0]={
        min: menorValor+(4*tamanhoCadaClasse),
        max: maiorValor,
        cor: "#D7E7FF",
        nome: 'Alta / Melhor'
      };
      classes[1]={
        min: menorValor+(3*tamanhoCadaClasse),
        max: menorValor+(4*tamanhoCadaClasse),
        cor: "#A5DFF7",
        nome: 'Acima da média'
      };
      classes[2]={
        min: menorValor+(2*tamanhoCadaClasse),
        max: menorValor+(3*tamanhoCadaClasse),
        cor: "#5A9CE8",
        nome: 'Média'
      };
      classes[3]={
        min: menorValor+(tamanhoCadaClasse),
        max: menorValor+(2*tamanhoCadaClasse),
        cor: "#0041B5",
        nome: 'Abaixo da média'
      };
      classes[4]={
        min: menorValor,
        max: menorValor+(tamanhoCadaClasse),
        cor: "#20007B",
        nome: 'Baixa / Pior'
      };
    } else {
      classes[0]={
        min: menorValor,
        max: menorValor+(tamanhoCadaClasse),
        cor: "#D7E7FF",
        nome: 'Alta / Melhor'
      };
      classes[1]={
        min: menorValor+(tamanhoCadaClasse),
        max: menorValor+(2*tamanhoCadaClasse),
        cor: "#A5DFF7",
        nome: 'Acima da média'
      };
      classes[2]={
        min: menorValor+(2*tamanhoCadaClasse),
        max: menorValor+(3*tamanhoCadaClasse),
        cor: "#5A9CE8",
        nome: 'Média'
      };
      classes[3]={
        min: menorValor+(3*tamanhoCadaClasse),
        max: menorValor+(4*tamanhoCadaClasse),
        cor: "#0041B5",
        nome: 'Abaixo da média'
      };
      classes[4]={
        min: menorValor+(4*tamanhoCadaClasse),
        max: maiorValor,
        cor: "#20007B",
        nome: 'Baixa / Pior'
      };
    }
    this.classes = classes;
    this.indicadoresPreenchidosPorAno.forEach(ip =>{
      classes.forEach(c => {
          if(c.min <= c.max ?
            ip.resultado >= c.min && ip.resultado <= c.max :
            ip.resultado <= c.min && ip.resultado >= c.max ){
            let indexFeature = this.leafletLayersAnalise.map(feature => feature.properties.idSubdivisao).indexOf(ip.idSubdivisao)
            if(indexFeature > -1){
              let estilo = {
                color: '#666666',
                fillColor: c.cor,
                weight: 2,
                fillOpacity: 1,
                strokeOpacity: 0.5,
              }
              this.leafletLayersAnalise[indexFeature].setStyle(estilo);
              ip.cor = c.cor;

            }
          }
      });
      if(!ip.cor){
        ip.cor = "#666f7f"
      }
    })
    this.classes[5] = {
      min: null,
      max: null,
      cor: "#666f7f",
      nome: 'Baixa / Pior'
    }
  }

  calcularMediana(numbers) {
    const middle = (numbers.length + 1) / 2;
    const sorted = [...numbers].sort((a, b) => a - b); // you have to add sorting function for numbers
    const isEven = sorted.length % 2 === 0;
    return isEven ? (sorted[middle - 1.5] + sorted[middle - 0.5]) / 2 : sorted[middle - 1];
  }
}

export const _filter = (opt: any[], value: string): string[] => {
  const filterValue = value ? PcsUtil.toSlug(value.toLowerCase()) : '';
  const filtrado = opt.filter(item => PcsUtil.toSlug(item.nome).indexOf(filterValue) > -1);
  return filtrado;
};
