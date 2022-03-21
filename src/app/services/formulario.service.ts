import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  private urlEndPoint = `${environment.API_URL}formulario`;
  constructor(private http: HttpClient, private router: Router) {}

  buscarPorId(id: any): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  buscarPorLink(link: string) {
    return this.http.get(`${this.urlEndPoint}/link?link=${link}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  buscar(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  salvar(formulario): Observable<any> {
    return this.http.post(`${this.urlEndPoint}`, formulario).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  atualizar(formulario): Observable<any> {
    return this.http.put(`${this.urlEndPoint}`, formulario).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  excluir(id): Observable<any> {
    return this.http.delete(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  buscarFormulariosResumido(idCidade: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarFormulariosResumido/` + idCidade).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  } 
}
