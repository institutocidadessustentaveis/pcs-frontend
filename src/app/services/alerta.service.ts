import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})



export class AlertaService {
  dialogData: any;
  public qtdNovos = 0;
  private urlEndPoint = `${environment.API_URL}alerta`;

  constructor(private http: HttpClient, private router: Router) { }

  get(): Observable<any[]> {
    return this.http.get<any[]>(this.urlEndPoint).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  getVisualizados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/visualizados`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getQuantidade(): Observable<number> {
    return this.http.get<number>(`${this.urlEndPoint}/quantidadeNovas`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  visualizar(alerta: any) : Observable<any[]> {
    return this.http.post<any>(`${this.urlEndPoint}/visualizar`, alerta ).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  inserir(alerta) : Observable<any[]> {
    return this.http.post<any>(`${this.urlEndPoint}/inserir`, alerta ).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
