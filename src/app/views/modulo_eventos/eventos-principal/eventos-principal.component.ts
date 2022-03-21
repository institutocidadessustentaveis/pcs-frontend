import { PcsUtil } from 'src/app/services/pcs-util.service';
import moment from 'moment';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EventoService } from 'src/app/services/evento.service';
import { EventosFiltrados } from './../../../model/eventoFiltro';
import { NoticiaService } from 'src/app/services/noticia.service';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { environment } from 'src/environments/environment';
import { HistoricoCompartilhamentoService } from 'src/app/services/historico-compartilhamento.service';

@Component({
  selector: 'app-eventos-principal',
  templateUrl: './eventos-principal.component.html',
  styleUrls: ['./eventos-principal.component.css']
})
export class EventosPrincipalComponent implements OnInit {

  public tipo: string;
  public dataInicial: string;
  public dataFinal: string;
  public palavraChave: string;
  public urlatual: string;
  mostrarDataPeriodo = false;

  paginationLimit = 3;
  idNoticias = [];
  idNoticiasTemplate = [];
  //Foi preciso criar essa redundancia pela regra de exibir eventos passados no calendario e no mapa não.
  eventosCalendario: any = [];
  eventosMapa: any = [];
  public formFiltro: FormGroup;
  public registros: Array<EventosFiltrados> = new Array<EventosFiltrados>();

  constructor(
    private titleService: Title,
    public formBuilder: FormBuilder,
    private eventoService: EventoService,
    private noticiaService: NoticiaService,
    public jwSocialButtonsModule: JwSocialButtonsModule,
    public historicoCompartilhamentoService: HistoricoCompartilhamentoService,
    ) { this.formFiltro = this.formBuilder.group({
          tipo: [null],
          dataInicial: [null],
          dataFinal: [null],
          palavraChave: [null]
      });
      this.titleService.setTitle("Eventos - Cidades Sustentáveis")
    }

  ngOnInit() {
    this.carregarEventosCalendario();
    this.carregarEventosMapa();
    this.carregarIdNoticias();
    this.urlatual = window.location.href;
    
  }

  public salvarLogCompartilhamento (redeSocial: string) {
    this.historicoCompartilhamentoService.gerarHistoricoCompartilhamento(redeSocial, 'Evento').subscribe(res => {})
  }

  carregarIdNoticias() {
    this.noticiaService.buscarIdNoticiasEventos()
    .subscribe(res => {
      res.forEach(noticia => {
        if (!this.idNoticias.includes(noticia.id)) {
          this.idNoticias.push(noticia.id);
        }
      });
    })
  }

  carregarEventosCalendario() {
    this.eventoService.buscarEventosNaoPrefeitura().subscribe(res => {
      this.eventosCalendario = res;
    });
  }

  carregarEventosMapa() {
    this.eventoService.buscarEventosFiltrados(null, null, null, null).subscribe(res => {
      this.eventosMapa = res;
    });
  }

  carregarMaisNoticias() {
    this.paginationLimit += 3;

    this.carregarIdNoticias();
  }

  buscarEventos() {
    this.tipo = this.formFiltro.controls['tipo'].value;
    this.dataInicial = this.formFiltro.controls['dataInicial'].value != null ? moment(this.formFiltro.controls['dataInicial'].value).format('YYYY-MM-DD') : '';
    this.dataFinal = this.formFiltro.controls['dataFinal'].value != null ? moment(this.formFiltro.controls['dataFinal'].value).format('YYYY-MM-DD') : '';
    this.palavraChave = this.formFiltro.controls['palavraChave'].value;

    this.eventoService.buscarEventosFiltrados(this.tipo, this.dataInicial, this.dataFinal, this.palavraChave).subscribe(
      res => {
        this.eventosCalendario = res;
        this.eventosMapa = res;

        const toast = PcsUtil.swal().mixin({
          toast: true,
          position: 'center',
          showConfirmButton: false,
          timer: 3000,
        });

        if (res.length > 0) {
          let el = document.getElementById('calendario');
          el.scrollIntoView();
          toast.fire({
            type: 'success',
            title: 'Agenda e mapa atualizados.'
          });
        }
        else {
          toast.fire({
            type: 'error',
            title: 'Não foram encontrados eventos com os filtros utilizados.'
          });
        }
      }
    );
  }

  public limparFiltro() {
    this.formFiltro.controls['tipo'].setValue(null);
    this.formFiltro.controls['dataInicial'].setValue(null);
    this.formFiltro.controls['dataFinal'].setValue(null);
    this.formFiltro.controls['palavraChave'].setValue(null);
  }

  public mostraDataPeriodo() {
    this.mostrarDataPeriodo = true;
  }

  public esconderDataPeriodo() {
    this.mostrarDataPeriodo = false;
  }

  public limparDatas() {
    this.formFiltro.controls['dataInicial'].setValue(null);
    this.formFiltro.controls['dataFinal'].setValue(null);
  }

  urlImagem(){
    return `${environment.APP_IMAGEM}ilustra-modulo-de-eventos.png`;
  }
  

}
