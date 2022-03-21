import { EventoDetalhe } from './../model/EventoDetalhe';
import { EventosFiltrados } from './../model/eventoFiltro';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Evento } from './../model/Evento';
import { Injectable, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { Eventos } from '../model/Relatorio/Eventos';
@Injectable({
  providedIn: 'root'
})
export class EventoService {
  urlEndPoint: string = `${environment.API_URL}evento`;

  constructor(
    private http: HttpClient,
  ) { }

  public cadastrarEvento(evento: Evento){
    return this.http.post(`${this.urlEndPoint}/cadastrar`, evento).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível cadastrar o evento', msg, 'error');
        return throwError(e);
      })
    );
  }
  public buscarEventoPorId(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarEventoPorId/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarEventoDetalhePorId(id: number) {
    return this.http.get<EventoDetalhe>(`${this.urlEndPoint}/buscarEventoDetalhePorId/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarEventos(): Observable<any> {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarEventosToList`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarEventosPorIdCidade(idCidade): Observable<any> {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarEventosToListByIdCidade/${idCidade}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public editarEvento(evento: Evento){
    return this.http.put(`${this.urlEndPoint}/editar`, evento).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível editar o evento', msg, 'error');
        return throwError(e);
      })
    );
  }

  public excluirEvento(id: number): Observable<Evento> {
    return this.http.delete<Evento>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir o evento', '', 'error');
        return throwError(e);
      })
    );
  }


  public buscarEventosOficiais(): Observable<Evento> {
    return this.http.get<Evento>(`${this.urlEndPoint}/pcs`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarEventosFiltrados(tipo: string, dataInicial: string, dataFinal: string, palavraChave: string): Observable<Array<EventosFiltrados>> {
    return this.http.get<Array<EventosFiltrados>>(`${this.urlEndPoint}/buscarEventosFiltrados?tipo=${tipo ? tipo : ''}&dataInicial=${dataInicial ? dataInicial : ''}&dataFinal=${dataFinal ? dataFinal : ''}&palavraChave=${palavraChave ? palavraChave : ''}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarEventosParticipacaoCidada() {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarEventosParticipacaoCidada`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarEventosNaoPrefeitura() {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarEventosNaoPrefeitura`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  
  public buscarEventosTipoAcademiaCalendario() {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarEventosTipoAcademiaCalendario`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarEventosParticipacaoCidadaFiltrados(dataInicial: string, dataFinal: string) {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarEventosParticipacaoCidadaFiltrados?dataInicial=${dataInicial}&dataFinal=${dataFinal}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarEventosCapacitacao() {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarEventosCapacitacao`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarTodosEventosCapacitacao() {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarTodosEventosCapacitacao`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarEventosCapacitacaoFiltrados(palavraChave: string, dataInicial: string, dataFinal: string) {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarEventosCapacitacaoFiltrados?palavraChave=${palavraChave}&dataInicial=${dataInicial}&dataFinal=${dataFinal}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  /*public buscarEventosFiltradosPorNomeData(relObj: Evento): Observable<Evento> {
    return this.http.get<Evento>(`${this.urlEndPoint}/buscarEventosFiltradosPorNomeData,`relObj).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }*/

  public buscarEventosFiltradosPorNomeData(relObj: Evento): Observable<Array<Evento>> {
    return this.http.post<Array<Evento>>(`${this.urlEndPoint}/buscarEventosFiltradosPorNomeData`,relObj)
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar os eventos solicitados",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }
}
