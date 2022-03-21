import { DadosDownload } from 'src/app/model/dados-download';
import { DadosDownloadComponent } from 'src/app/components/dados-download/dados-download.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { EventosFiltrados } from './../../../model/eventoFiltro';
import { CidadeService } from './../../../services/cidade.service';
import { EventoService } from 'src/app/services/evento.service';
import * as XLSX from 'xlsx';

import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarView } from 'angular-calendar';
import { CalendarEvent } from './calendar-utils';
import FileSaver from 'file-saver';
import {
  isSameDay,
  isSameMonth,
} from 'date-fns';

import moment from 'moment';
import { StripTagsPipe } from 'src/app/components/strip-tags/strip-tags.pipe';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DadosDownloadService } from 'src/app/services/dados-download.service';
import { Usuario } from 'src/app/model/usuario';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

const pipeRemoveTagsHtml = new StripTagsPipe();

const colors: any = {
  PCS: {
    primary: '#00e676',
  },
  Prefeitura: {
    primary: '#B0C4DE',
  },
  Terceiros: {
    primary: '#ffea00',
  },
  RedeNossaSP: {
    primary: '#ff1744',
  },
  Capacitacao: {
    primary: '#ff9100',
  },
  Academia: {
    primary: '#d500f9',
  },
  ICS: {
    primary: '#00b0ff',
  },
  Default: {
    primary: '#fc50a0',
  },
};

@Component({
  selector: 'app-eventos-calendario',
  templateUrl: './eventos-calendario.component.html',
  styleUrls: ['../../../../../node_modules/angular-calendar/css/angular-calendar.css', './eventos-calendario.component.css']
})

export class EventosCalendarioComponent implements OnInit, OnChanges {

  events: any[] = [];
  eventsToIcs: any[] = [];
  eventsToXls: any [] = [];

  @Input() idCidade;
  
  public colors: any = {
    green: {
      primary: '#47825E',
    }
  };

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  refresh: Subject<any> = new Subject();
  @Input() eventos: any;
  activeDayIsOpen: boolean = true;

  public dadosDownload = new DadosDownload;
  public usuario: Usuario;
  public estaLogado: boolean = false;

  constructor(
    private eventoService: EventoService, private router: Router,
    public dialog: MatDialog,
    private usuarioService: UsuarioService,
    private dadosDownloadService: DadosDownloadService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.eventos.length > 0) {
      this.buscarEventos();            
    }

    this.estaLogado = this.authService.isAuthenticated();
    if(this.estaLogado == true){
      this.getUsuarioLogadoDadosDownloadCalendario();
    }
   
  }

  ngOnChanges() {
    if (this.eventos.length > 0) {
      this.buscarEventos();
      this.compararDataCalendario();      
    }
  }
  

  public compararDataCalendario(){
    let dataAtual = new Date();   
   
     let arrayProximasData = this.eventos.filter(evento => {       
       let dataEvento = new Date(evento.dataEvento);
      return dataEvento >= dataAtual;
    });    

    if (arrayProximasData.length > 0) {
      this.viewDate = arrayProximasData[0].dataHorario;
    }
  }

  public buscarEventos() {
    this.eventsToXls = this.eventos;
    this.eventsToIcs = this.eventos;
    this.events = [];
    
    this.eventsToIcs.forEach((evento) => {
      this.events = [
        ...this.events,
        {
          id: evento.id,
          title: evento.nome,
          tipo: evento.tipo,
          publicado: evento.publicado,
          organizador: evento.organizador,
          horario: evento.horario,
          start: new Date(evento.dataHorario),
          color: colors.PCS,
          draggable: false,
          resizable: {
            beforeStart: false,
            afterEnd: false,
          },
          site: evento.site,
          linkExterno: evento.linkExterno
        },
      ];
    });
    this.events.forEach(event => {
      if (event.tipo == "PCS") {
        event.color = colors.PCS;
      }
      if (event.tipo == "Prefeitura") {
        event.color = colors.Prefeitura;
      }
      if (event.tipo == "Terceiros") {
        event.color = colors.Terceiros;
      }
      if (event.tipo == "Rede Nossa São Paulo") {
        event.color = colors.RedeNossaSP;
      }
      if (event.tipo == "Capacitação para Prefeituras Signatárias") {
        event.color = colors.Capacitacao;
      }       
      if (event.tipo == "Academia") {
        event.color = colors.Academia;
      } 
      if (event.tipo == "ICS") {
        event.color = colors.ICS;
      }  
    })
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
  if(isSameMonth(date, this.viewDate)) {
  if (
    (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
    events.length === 0
  ) {
    this.activeDayIsOpen = false;
  } else {
    this.activeDayIsOpen = true;
  }
  this.viewDate = date;
}
  }


setView(view: CalendarView) {
  this.view = view;
}

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  openEvent(event) {
    if (event) {
      if(event.linkExterno){
        //Trata link que foi digitado inves de copiado(sem http ou https)
        event.linkExterno.includes('http') ? window.open(event.linkExterno) : window.open('//' + event.linkExterno);
      }else {
        window.open(`/eventos/detalhe/${event.id}`);
      }
    }
  }

  generateEventIcs() {
    if (this.eventsToIcs) {
    //Cria o cabeçalho do .ics
    let ics = `BEGIN:VCALENDAR\nPRODID:-//Mozilla.org/NONSGML Mozilla Calendar V1.1//EN\nVERSION:2.0\n`;
    let descricao = '';

    this.eventsToIcs.forEach(event => {
      //Formata o para DateTime, pois os programas de email só conseguem ler DateTime,
      //e no momento atual as datas do banco estão com hífen.
      let dateTime = event.dataHorario;
      if (dateTime) {
        dateTime = dateTime.split("-").join("");
        dateTime = dateTime.split(":").join("");
        dateTime += 'Z';
      };

      if(event.descricao){
       descricao = pipeRemoveTagsHtml.transform(event.descricao);
      }

      let endereco = "";
      if(event.endereco != null && event.endereco != undefined){
        endereco = event.endereco;
      }

      //Cria uma string que depois será convertida em arquivo .ics.
      //Data de inicio está igual a data de fim,
      //pois até o momento a criação de evento não conta com data de fim.
      ics +=
          `BEGIN:VEVENT\n` +
          `SUMMARY:${event.nome}\n` +
          `CATEGORIES:${event.tipo}\n` +
          `DTSTART:${dateTime}\n` +
          `DTEND:${dateTime}\n` +
          `LOCATION:${endereco}\n` +
          `DESCRIPTION:${descricao}\n` +
          `END:VEVENT\n`;
    });

    ics += `END:VCALENDAR`;
    let blob = new Blob ([ics], {type: "text/calendar;"});
    FileSaver.saveAs(blob, "calendario-de-eventos-pcs.ics")
    }
  }

  formatarEventXls(){
    let formatadosXlsList: any[] = [];
    if(this.eventsToXls){
      this.eventsToXls.forEach( event => {
        let formatadosXls: {} = {};
        formatadosXls['evento'] = event.nome;
        formatadosXls['tipo'] = event.tipo;
        if(event.descricao){
          formatadosXls['descricao'] = pipeRemoveTagsHtml.transform(event.descricao);
        }
        formatadosXls['data'] = moment(event.data).format("DD/MM/YYYY");
        if(event.horario){
          formatadosXls['horario'] = event.horario.substr(0, 5);
        }
        if(event.endereco){
          formatadosXls['endereco'] = event.endereco;
        }
        formatadosXlsList.push(formatadosXls);
        }); 
        return formatadosXlsList
    }
    return null;
  }

  generateXls(){
    const registrosExportacao = this.formatarEventXls();
    const workBook = XLSX.utils.book_new();
    if (registrosExportacao) {
      const workSheet = XLSX.utils.json_to_sheet(registrosExportacao);
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Registros');
      XLSX.writeFile(workBook, 'lista-eventos.xlsx');
    }
    else {
      Swal.fire("Erro", "Não foi possível exportar a tabela.", "error")
    }
}
  

  public validacaoDownloadCalendarioIcs() {
    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.generateEventIcs();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download do Calendario Eventos Capacitação';
      this.dadosDownload.pagina = 'Eventos Capacitação';
      this.dadosDownload.arquivo = 'Calendario de Eventos';
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.generateEventIcs();
    } else {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      acao: "Download do Calendario Eventos Capacitação",
      pagina: "Eventos Capacitação",
      arquivo: "Calendario de Eventos"
    }

    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.generateEventIcs();
      }
    });
    }
  }

  public validacaoDownloadCalendarioXls() {
    if(this.estaLogado) {
      this.cadastrarDadosDownload(this.dadosDownload);
      this.generateXls();
    } else if(localStorage.getItem('dadosDownload')) {
      this.dadosDownload = JSON.parse(localStorage.getItem('dadosDownload'));
      
      this.dadosDownload.acao = 'Download do Calendario Eventos Capacitação';
      this.dadosDownload.pagina = 'Eventos Capacitação';
      this.dadosDownload.arquivo = 'Calendario de Eventos';
      
      this.cadastrarDadosDownload(this.dadosDownload);
      this.generateXls();
    } else {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      acao: "Download do Calendario Eventos Capacitação",
      pagina: "Eventos Capacitação",
      arquivo: "Calendario de Eventos"
    }

    const dialogRef = this.dialog.open(DadosDownloadComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if(result != null) {
        this.dadosDownload = result;
        this.generateXls();
      }
    });
    }
  }


  public getUsuarioLogadoDadosDownloadCalendario(){
    this.usuarioService.buscarUsuarioLogado().subscribe(usuario => {
      this.usuario = usuario as Usuario;  
      
    this.dadosDownload.email = usuario.email;
    this.dadosDownload.nome = usuario.nome
    this.dadosDownload.organizacao = usuario.organizacao;
    this.dadosDownload.boletim = usuario.recebeEmail;
    this.dadosDownload.usuario = usuario.id;
    this.dadosDownload.nomeCidade = usuario.prefeitura.cidade ? usuario.prefeitura.cidade.nome : usuario.cidadeInteresse;
    this.dadosDownload.acao = 'Download do Calendario Eventos Capacitacao';
    this.dadosDownload.pagina = 'Eventos Capacitacao';  
    this.dadosDownload.arquivo = 'Calendario de Eventos';  
    });
  }

  public cadastrarDadosDownload(dados: DadosDownload) {
    this.dadosDownloadService.cadastrarDados(dados).subscribe();
  }

}
