import { environment } from 'src/environments/environment';
import { Component, ElementRef, OnInit } from '@angular/core';
import { BibliotecaService } from 'src/app/services/bibliotecaService';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItemCombo } from 'src/app/model/ItemCombo ';
import { AreaInteresse } from 'src/app/model/area-interesse';
import { ProvinciaEstadoService } from 'src/app/services/provincia-estado.service';
import { CidadeService } from 'src/app/services/cidade.service';
import { IndicadoresService } from 'src/app/services/indicadores.service';
import { ObjetivoDesenvolvimentoSustentavelService } from 'src/app/services/objetivo-desenvolvimento-sustentavel.service';
import { FiltroBiblioteca } from 'src/app/model/filtroBiblioteca';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import {DomSanitizer} from '@angular/platform-browser';


@Component({
  selector: 'app-bibliotecas',
  templateUrl: './bibliotecas.component.html',
  styleUrls: ['./bibliotecas.component.css']
})
export class BibliotecasComponent implements OnInit {
  public paginationLimit = 3;
  public formFiltro: FormGroup;
  public idsBibliotecas: any = [];
  public filtroBiblioteca: FiltroBiblioteca = new FiltroBiblioteca();
  public tituloPublicacaoTooltip: String;

  public ultimasPublicacoes = [];
  public modulos: Array<ItemCombo> = [];
  public permitirBuscaAvancada = false;
  public odsCombo: Array<ItemCombo> = [];
  public eixosCombo: Array<ItemCombo> = [];
  public indicadoresCombo: Array<any> = [];
  public paisesCombo: Array<ItemCombo> = [];
  public cidadesCombo: Array<ItemCombo> = [];
  public metasOdsCombo: Array<ItemCombo> = [];
  public provinciaEstadoCombo: Array<ItemCombo> = [];
  public areasInteresseCombo: Array<AreaInteresse> = [];
  public urlAPI = environment.API_URL;
  public nadaEncontrado: boolean = false;

  scrollUp: any;
  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer,
    public formBuilder: FormBuilder,
    private cidadeService: CidadeService,
    private bibliotecaService: BibliotecaService,
    private indicadoresService: IndicadoresService,
    private provinciaEstadoService: ProvinciaEstadoService,
    private metaOdsService: ObjetivoDesenvolvimentoSustentavelService,
    private router: Router,
    private element: ElementRef,
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });

    this.modulos = [
      {"id": 0, label:'Eventos'},
      {"id": 1, label:'Notícias'},
      {"id": 2, label:'Biblioteca'},
      {"id": 3, label:'Capacitação'},
      {"id": 4, label:'Indicadores'},
      {"id": 5, label:'Boas Práticas'},
      {"id": 6, label:'Financiamento'},
      {"id": 7, label:'Institucional'},
      {"id": 8, label:'Participação Cidadã'},
      {"id": 9, label:'Contribuições Privadas'},
      {"id": 10, label:'Planejamento Integrado'},
      {"id": 11, label:'Contribuições Acadêmicas'},
      {"id": 12, label:'Plano, Leis e Regulamentações'},
    ]
    ;

    this.formFiltro = this.formBuilder.group({
      idOds: [null],
      idPais: [null],
      idEixo: [null],
      modulo: [null],
      idCidade: [null],
      idMetasOds: [null],
      idIndicador: [null],
      palavraChave: [null],
      idAreaInteresse: [null],
      idProvinciaEstado: [null],
    });
    this.route.queryParams.subscribe(params => {
      
      this.formFiltro.controls.palavraChave.setValue(params.palavraChave);
      this.formFiltro.controls.idAreaInteresse.setValue(params.areaInteresse);
      this.formFiltro.controls.idEixo.setValue(params.eixo);      
      this.formFiltro.controls.idIndicador.setValue(params.indicador);
      this.formFiltro.controls.idOds.setValue(params.ods);
      this.formFiltro.controls.idMetasOds.setValue(params.metaOds);
      this.formFiltro.controls.idPais.setValue(params.pais);
      this.formFiltro.controls.idProvinciaEstado.setValue(params.estado);
      this.formFiltro.controls.idCidade.setValue(params.cidade);
      this.formFiltro.controls.modulo.setValue(params.modulo);      
    });
  }

  ngOnInit() {
    this.carregarSelectJaComValor();
    this.carregarUltimasBibliotecas();
    this.buscarBibliotecas(false);
    this.carregarCombos();
    this.titleService.setTitle(`Biblioteca - Cidades Sustentáveis`);
  }

  public construirParamsURL() {
    if (this.filtroBiblioteca.palavraChave === undefined) {
      this.filtroBiblioteca.palavraChave = '';
    }
    if (this.filtroBiblioteca.modulo === undefined) {
      this.filtroBiblioteca.modulo = null;
    }
    if (this.filtroBiblioteca.idAreaInteresse === undefined) {
      this.filtroBiblioteca.idAreaInteresse = null;
    }
    if (this.filtroBiblioteca.idEixo === undefined) {
      this.filtroBiblioteca.idEixo = null;
    }
    if (this.filtroBiblioteca.idIndicador === undefined) {
      this.filtroBiblioteca.idIndicador = null;
    }
    if (this.filtroBiblioteca.idOds === undefined) {
      this.filtroBiblioteca.idOds = null;
    }
    if (this.filtroBiblioteca.idMetasOds === undefined) {
      this.filtroBiblioteca.idMetasOds = null;
    }
    if (this.filtroBiblioteca.idPais === undefined) {
      this.filtroBiblioteca.idPais = null;
    }
    if (this.filtroBiblioteca.idProvinciaEstado === undefined) {
      this.filtroBiblioteca.idProvinciaEstado = null;
    }
    if (this.filtroBiblioteca.idCidade === undefined) {
      this.filtroBiblioteca.idCidade = null;
    }

    let new_URL =
    this.filtroBiblioteca.palavraChave ?
      `/biblioteca?palavraChave=${this.filtroBiblioteca.palavraChave}` : '/biblioteca?';
    this.filtroBiblioteca.idAreaInteresse ?
    (new_URL ? new_URL += `&areaInteresse=${this.filtroBiblioteca.idAreaInteresse}` : `/biblioteca?areaInteresse=${this.filtroBiblioteca.idAreaInteresse}`) : '';
    this.filtroBiblioteca.modulo ?
    (new_URL ? new_URL += `&modulo=${this.filtroBiblioteca.modulo}` : `/biblioteca?modulo=${this.filtroBiblioteca.modulo}`) : '';
    this.filtroBiblioteca.idEixo ?
    (new_URL ? new_URL += `&eixo=${this.filtroBiblioteca.idEixo}` : `/biblioteca?eixo=${this.filtroBiblioteca.idEixo}`) : '';
    this.filtroBiblioteca.idIndicador ?
    (new_URL ? new_URL += `&indicador=${this.filtroBiblioteca.idIndicador}` : `/biblioteca?indicador=${this.filtroBiblioteca.idIndicador}`) : '';
    this.filtroBiblioteca.idOds ?
    (new_URL ? new_URL += `&ods=${this.filtroBiblioteca.idOds}` : `/biblioteca?ods=${this.filtroBiblioteca.idOds}`) : '';
    this.filtroBiblioteca.idMetasOds ?
    (new_URL ? new_URL += `&metaOds=${this.filtroBiblioteca.idMetasOds}` : `/biblioteca?metaOds=${this.filtroBiblioteca.idMetasOds}`) : '';
    this.filtroBiblioteca.idPais ?
    (new_URL ? new_URL += `&pais=${this.filtroBiblioteca.idPais}` : `/biblioteca?pais=${this.filtroBiblioteca.idPais}`) : '';
    this.filtroBiblioteca.idProvinciaEstado ?
    (new_URL ? new_URL += `&estado=${this.filtroBiblioteca.idProvinciaEstado}` : `/biblioteca?estado=${this.filtroBiblioteca.idProvinciaEstado}`) : '';
    this.filtroBiblioteca.idCidade ?
    (new_URL ? new_URL += `&cidade=${this.filtroBiblioteca.idCidade}` : `/biblioteca?cidade=${this.filtroBiblioteca.idCidade}`) : '';

    window.history.replaceState( {} , '', new_URL );
  }

  preencherFiltroParaBuscar() {
    this.filtroBiblioteca.palavraChave = this.formFiltro.controls.palavraChave.value;
    this.filtroBiblioteca.idAreaInteresse =  this.formFiltro.controls.idAreaInteresse.value;
    this.filtroBiblioteca.idEixo =  this.formFiltro.controls.idEixo.value;
    this.filtroBiblioteca.idIndicador =  this.formFiltro.controls.idIndicador.value;
    this.filtroBiblioteca.idOds =  this.formFiltro.controls.idOds.value;
    this.filtroBiblioteca.idMetasOds =  this.formFiltro.controls.idMetasOds.value;
    this.filtroBiblioteca.idPais =  this.formFiltro.controls.idPais.value;
    this.filtroBiblioteca.idProvinciaEstado =  this.formFiltro.controls.idProvinciaEstado.value;
    this.filtroBiblioteca.idCidade =  this.formFiltro.controls.idCidade.value;
    this.filtroBiblioteca.modulo =  this.formFiltro.controls.modulo.value;
  }

  public buscarBibliotecas(rolarParaDiv) {    
    this.preencherFiltroParaBuscar()
    this.construirParamsURL();
    
    this.paginationLimit = 10;
    if (this.formFiltro.controls.modulo.value) {
      let modulo:ItemCombo = this.modulos.find(modulo => modulo.id == this.formFiltro.controls.modulo.value)
      this.filtroBiblioteca.modulo = modulo.label;
    }
    this.bibliotecaService.buscarBibliotecasFiltrado(this.filtroBiblioteca)
    .subscribe(res => {
      this.idsBibliotecas = res.reverse();
      if (res.length > 0) {
        this.nadaEncontrado = false;
        if (rolarParaDiv) {
          const el = document.getElementById('bibliotecas');
          el.scrollIntoView();
        }
      }
      else {
        this.nadaEncontrado = true;
      }
    });
  }

  public verMaisBibliotecas() {
    this.paginationLimit += 10;
  }

  public carregarCombos() {
    this.bibliotecaService.carregarCombosBiblioteca().subscribe(response => {
      this.paisesCombo = response.listaPaises as ItemCombo[];
      this.areasInteresseCombo = response.listaAreasInteresse as AreaInteresse[];
      this.eixosCombo = response.listaEixos as ItemCombo[];
      this.odsCombo = response.listaOds as ItemCombo[];
    });
  }

  public carregarSelectJaComValor() {
    if (this.formFiltro.controls.idOds.value) {
      this.metaOdsService.buscarMetaOdsPorIdOdsItemCombo(this.formFiltro.controls.idOds.value).subscribe(res => {
        this.metasOdsCombo = res as ItemCombo[];
      });
    }

    if (this.formFiltro.controls.idPais.value) {
      this.provinciaEstadoService.buscarProvinciaEstadoComboPorPais(this.formFiltro.controls.idPais.value).subscribe(res => {
        this.provinciaEstadoCombo = res as ItemCombo[];
      });
    }

    if (this.formFiltro.controls.idProvinciaEstado.value) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(this.formFiltro.controls.idProvinciaEstado.value).subscribe(res => {
        this.cidadesCombo = res as ItemCombo[];
      });
    }

    if (this.formFiltro.controls.idEixo.value) {
      this.indicadoresService.buscarIndicadoresPorIdEixoItemCombo(this.formFiltro.controls.idEixo.value).subscribe(res => {
        this.indicadoresCombo = res as ItemCombo[];
      });
    }

 

  }

  public onPaisChange(event: any) {
    if (event.value) {
    this.provinciaEstadoService.buscarProvinciaEstadoComboPorPais(event.value).subscribe(res => {
      this.provinciaEstadoCombo = res as ItemCombo[];
    });
  }

    this.provinciaEstadoCombo = [];
    this.cidadesCombo = [];
  }

  onEstadoChange(event: any) {
    if (event.value) {
      this.cidadeService.buscarCidadeParaComboPorIdEstado(event.value).subscribe(res => {
        this.cidadesCombo = res as ItemCombo[];
      });
    }

    this.cidadesCombo = [];
  }

  onEixoChange(event: any) {
    if (!event && this.formFiltro.controls.idEixo.value) {
      this.indicadoresService.buscarIndicadoresPorIdEixoItemCombo(this.formFiltro.controls.idEixo.value).subscribe(res => {
        this.indicadoresCombo = res as ItemCombo[];
      });
    }

    if (!event && !this.formFiltro.controls.idEixo.value) {
      this.indicadoresCombo = [];
    }
  }

  onOdsChange(event: any) {
    if (!event && this.formFiltro.controls.idOds.value) {
      this.metaOdsService.buscarMetaOdsPorIdOdsItemCombo(this.formFiltro.controls.idOds.value).subscribe(res => {
        this.metasOdsCombo = res as ItemCombo[];
      });
    }

    if (!event && !this.formFiltro.controls.idOds.value) {
      this.metasOdsCombo = [];
    }
  }

  mostrarBuscaAvancada() {
    this.permitirBuscaAvancada = true;
    const el = document.getElementById('main');
    el.scrollIntoView();
  }

  fecharBuscaAvancada() {
    this.permitirBuscaAvancada = false;
    this.formFiltro.controls.idOds.setValue(null);
    this.formFiltro.controls.idPais.setValue(null);
    this.formFiltro.controls.idEixo.setValue(null);
    this.formFiltro.controls.modulo .setValue(null);
    this.formFiltro.controls.idCidade.setValue(null);
    this.formFiltro.controls.idMetasOds.setValue(null);
    this.formFiltro.controls.idIndicador.setValue(null);
    this.formFiltro.controls.palavraChave.setValue(null);
    this.formFiltro.controls.idAreaInteresse.setValue(null);
    this.formFiltro.controls.idProvinciaEstado.setValue(null);
    const el = document.getElementById('main');
    this.buscarBibliotecas(el);
    el.scrollIntoView();
  }

  carregarUltimasBibliotecas() {
    this.bibliotecaService.idBibliotecasOrdenadas().subscribe(res => {
      let lista = res;
      if (lista.length > 5) {
        lista = lista.slice(0, 5);
      }
      lista.forEach(item => {
        this.bibliotecaService.buscarBibliotecaSimples(item.id).subscribe(itemBiblioteca => {
          if (itemBiblioteca.autor != null)  {
            if (itemBiblioteca.autor.length > 28 ) {
              itemBiblioteca.autor = `${itemBiblioteca.autor.slice(0, 25)}...`;
            }
            this.ultimasPublicacoes.push(itemBiblioteca);
          }
        });
      });
    });
  }

  public sliceTituloPublicacao(titulo) {
   if (titulo.length > 50) {
     return `${titulo.slice(0, 47)}...`;
    } else {
      return titulo;
    }
  }
}
