import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HistoricoOperacaoService {

  private urlEndPoint = `${environment.API_URL}historicoOperacao`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscarHistoricoOperacao(page: number, quantity: number, orderBy: string, direction: string): Observable<any[]> {
    let params = {};
    params['page'] = `${page}`;
    params['quantity'] = `${quantity}`;

    if(orderBy != undefined) {
      params['orderBy'] = `${orderBy}`;
    }

    if(direction != undefined) {
      params['direction'] = `${direction}`;
    }

    return this.http.get<any[]>(`${this.urlEndPoint}`, { params: params }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados do histórico', '', 'error');
        return throwError(e);
      })
    );
  }

  public filtrar(usuario: string, modulo: string,
                 dataInicio: string, dataFim: string,
                 page: number, quantity: number) {
      let params = {}

      if(usuario != null && usuario !== "") {
        params['usuario'] = usuario;
      }

      if(modulo != null && modulo !== "") {
        params['modulo'] = modulo;
      }

      if(dataInicio != null && dataInicio !== "") {
        params['dataInicio'] = dataInicio;
      }

      if(dataFim != null && dataFim !== "") {
        params['dataFinal'] = dataFim;
      }

      params['page'] = page;
      params['quantity'] = quantity;

      return this.http.get<any[]>(`${this.urlEndPoint}/filtrar`, { params: params }).pipe(
        catchError(e => {
          swal.fire('Erro ao carregar dados do histórico', '', 'error');
          return throwError(e);
        })
      );

  }


  public filtrarSemPaginacao(usuario: string, modulo: string,
    dataInicio: string, dataFim: string,
    page: number, quantity: number) {
    let params = {}

    if (usuario != null && usuario !== "") {
      params['usuario'] = usuario;
    }

    if (modulo != null && modulo !== "") {
      params['modulo'] = modulo;
    }

    if (dataInicio != null && dataInicio !== "") {
      params['dataInicio'] = dataInicio;
    }

    if (dataFim != null && dataFim !== "") {
      params['dataFinal'] = dataFim;
    }

    params['page'] = page;
    params['quantity'] = quantity;

    return this.http.get<any[]>(`${this.urlEndPoint}/filtrarSemPaginacao`, { params: params }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados do histórico', '', 'error');
        return throwError(e);
      })
    );

  }

  public listarModulos() {
    return this.http.get<any[]>(`${this.urlEndPoint}/modulos`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar módulos do histórico', '', 'error');
        return throwError(e);
      })
    );
  }
}
