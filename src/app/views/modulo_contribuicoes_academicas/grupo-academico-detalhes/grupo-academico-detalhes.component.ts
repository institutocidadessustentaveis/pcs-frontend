import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as L from "leaflet";
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { latLng, tileLayer, circleMarker, marker, icon } from 'leaflet';
import { GrupoAcademicoDetalheDTO } from 'src/app/model/grupo-academico-detalhe-dto';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { GrupoAcademicoService } from 'src/app/services/grupo-academico.service';
import { PcsUtil } from 'src/app/services/pcs-util.service'
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml, Title } from '@angular/platform-browser';
import { Eixo } from 'src/app/model/eixo';


@Component({
  selector: 'app-grupo-academico-detalhes',
  templateUrl: './grupo-academico-detalhes.component.html',
  styleUrls: ['./grupo-academico-detalhes.component.css']
})
export class GrupoAcademicoDetalhesComponent implements OnInit {

  public importFeatureGroup;

  public grupoAcademicoDTO: GrupoAcademicoDetalheDTO = new GrupoAcademicoDetalheDTO;

  public listaOds: ObjetivoDesenvolvimentoSustentavel[] = [];
  public odsSelecionado: ObjetivoDesenvolvimentoSustentavel = null;

  public url = environment.API_URL;
  paginaOnline: string;
  nomeContato: string;
  emailContato: string;
  telefoneContato: string;
  emailInstitucional: string;
  telefoneInstitucional: string;
  linkBaseDados: string;
  observacoes: string;
  descricaoInstituicao: string;
  experienciasDesenvolvidas: string;
  experienciasDesenvolvidasSafeUrl: SafeHtml;
  logradouro: string;
  numero: string;
  complemento: string;
  quantidadeAlunos: number;
  nomeAcademia: string;
  nomeApl: string;
  descricaoApl: string;
  areasInteresse: string[] = [];
  eixos: Array<Eixo>;
  ods: string[] = [];
  vinculo: string;
  tipoFundacao: string;
  atuaProjetoSustentabilidade: boolean;
  associadaEthos: boolean;
  latitude: number;
  longitude: number;
  nomeGrupo: string;
  porteEmpresa: string;
  setorEconomico: string;
  quantidadeFuncionarios: number;
  receitaAnual: number;
  participaApl: boolean;
  tipoCadastro: string; 
  continente: string;
  cidade: string;
  estado: string;
  pais: string;
  dataCadastro: Date;
  cidadesApl: string[] = [];
  setoresApl: string[] = [];
  tipo: string;
  mailTo: string;
  endereco: string;

  map: L.Map;
  provider = new OpenStreetMapProvider();
  

  options = {
    layers: [
        tileLayer(environment.MAP_TILE_SERVER, {
                  detectRetina: true,
                  attribution: environment.MAP_ATTRIBUTION,
                  noWrap: true,
                  minZoom: 2
        })
      ],
      zoom:3,
      gestureHandling: true,
      gestureHandlingOptions: {
        duration: 5000
      },
      center: latLng([ -15.03144, -53.09227 ])
    };

    layersControl = [];
    scrollUp: any;
  
  constructor(private activatedRoute: ActivatedRoute,
              public router: Router,
              private grupoAcademicoService: GrupoAcademicoService,
              private pcsUtil: PcsUtil,
              private titleService: Title,
              public domSanitizationService: DomSanitizer,
              private _location: Location,
              private element: ElementRef) {

    this.scrollUp = this.router.events.subscribe(path => {
    element.nativeElement.scrollIntoView();
     });
   }

  ngOnInit() {
    this.buscarGrupoAcademico();
    
    
  }

  buscarGrupoAcademico(){
    this.importFeatureGroup = L.featureGroup();
    this.activatedRoute.params.subscribe(async params => {
      let id = params.id;
      if (id) {
        this.grupoAcademicoService.buscarGrupoAcademicoPorIdDetalhesDTO(id).subscribe(response => {  
          this.popularDetalhesGrupoAcademico(response);
          this.carregarDadosOds(id);
          this.grupoAcademicoDTO = response as GrupoAcademicoDetalheDTO; 
          this.titleService.setTitle(`${this.nomeGrupo} - Cidades Sustentáveis`);
          });
          
        }
    }); 
  }

  public gerarLink(text: string) {
    if (!(text === null || text === undefined) && text.includes('http')) return text
    return 'http://' + text
  }

  popularDetalhesGrupoAcademico(grupoAcademico: GrupoAcademicoDetalheDTO){

  this.paginaOnline = grupoAcademico.paginaOnline;
  this.nomeContato = grupoAcademico.nomeContato;
  this.emailContato = grupoAcademico.emailContato;
  this.telefoneContato = grupoAcademico.telefoneContato;
  this.emailInstitucional = grupoAcademico.emailInstitucional;
  this.mailTo = `mailto:${this.emailInstitucional}`;
  this.telefoneInstitucional = grupoAcademico.telefoneInstitucional;
  this.linkBaseDados = grupoAcademico.linkBaseDados;
  this.logradouro = grupoAcademico.logradouro;
  this.numero = grupoAcademico.numero;
  this.complemento = grupoAcademico.complemento;
  this.nomeAcademia = grupoAcademico.nomeAcademia;
  this.nomeApl = grupoAcademico.nomeApl;
  this.areasInteresse = grupoAcademico.areasInteresse;
  this.eixos = grupoAcademico.eixos;
  this.ods = grupoAcademico.ods;
  this.vinculo = grupoAcademico.vinculo;
  this.tipoFundacao = grupoAcademico.tipoFundacao;
  this.atuaProjetoSustentabilidade = grupoAcademico.atuaProjetoSustentabilidade;
  this.associadaEthos = grupoAcademico.associadaEthos;
  this.latitude = grupoAcademico.latitude;
  this.longitude = grupoAcademico.longitude;
  this.nomeGrupo = grupoAcademico.nomeGrupo;
  this.porteEmpresa = grupoAcademico.porteEmpresa;
  this.setorEconomico = grupoAcademico.setorEconomico;
  this.quantidadeFuncionarios = grupoAcademico.quantidadeFuncionarios;
  this.receitaAnual = grupoAcademico.receitaAnual;
  this.participaApl = grupoAcademico.participaApl;
  this.tipoCadastro = grupoAcademico.tipoCadastro;
  this.continente = grupoAcademico.continente;
  this.cidade = grupoAcademico.cidade;
  this.estado = grupoAcademico.estado;
  this.pais = grupoAcademico.pais;
  this.cidadesApl = grupoAcademico.cidadesApl;
  this.setoresApl = grupoAcademico.setoresApl;
  this.tipo = grupoAcademico.tipo;
  this.quantidadeAlunos = grupoAcademico.quantidadeAlunos;

  this.descricaoApl = grupoAcademico.descricaoApl
  this.descricaoInstituicao = grupoAcademico.descricaoInstituicao
  this.observacoes = grupoAcademico.observacoes
  this.experienciasDesenvolvidas = grupoAcademico.experienciasDesenvolvidas

  this.experienciasDesenvolvidasSafeUrl = this.domSanitizationService.bypassSecurityTrustHtml(this.experienciasDesenvolvidas);

  this.gerarEndereço(this.logradouro, this.numero, this.cidade, this.estado, this.pais);
  
  if(this.latitude || this.longitude){
    this.addMarkerOnMap(this.latitude, this.longitude);
  }
  
}

private async carregarDadosOds(id: number) {
  await this.grupoAcademicoService.buscarOdsDoGrupoAcademicoPorId(id).subscribe(response => {
    this.listaOds = response as ObjetivoDesenvolvimentoSustentavel[];
    for (const item of this.listaOds) {
      item.iconeSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
        item.icone
      );
      item.iconeReduzidoSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
        item.iconeReduzido
      );
    }
  });
}

gerarEndereço(logradouro, numero, cidade, estado, pais ) {
  this.endereco = `${logradouro}, ${numero}, ${cidade}, ${estado}, ${pais}`
}

public selecionarOds(odsSelecionado: ObjetivoDesenvolvimentoSustentavel) {
  this.odsSelecionado = odsSelecionado;
  this.router.navigate([`institucional/ods/${this.odsSelecionado.id}`]);
}


public gerarLinkImagem(ods: ObjetivoDesenvolvimentoSustentavel) {
  return `${environment.API_URL}ods/imagem/${ods.id}`;
}

public addMarkerOnMap(latitude: number, longitude: number) {
  this.layersControl.push(
    marker([longitude , latitude],
      { icon : icon({
          iconSize: [ 50, 50],
          iconAnchor: [ 25, 60 ],
          iconUrl: 'assets/mapmarker.png'
      })}
      )
    .bindPopup(`<strong>${this.endereco}</strong></br>`)
  );
}

backClicked() {
  this._location.back();
}

urlImagem(){
    return `${environment.APP_IMAGEM}biblioteca.jpg`
  }

}
