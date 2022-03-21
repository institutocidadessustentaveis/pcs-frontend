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



export class TemaGeoespacialService {

  dialogData: any;
  private urlEndPoint = `${environment.API_URL}tema-geoespacial`;

  constructor(private http: HttpClient, private router: Router) { }

  buscar(id: any): Observable <any> {
    return this.http.get<any>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  buscarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.urlEndPoint).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  buscarTodosSimples(): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlEndPoint}/listar`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public inserir(tema: any) {
    return this.http.post(`${this.urlEndPoint}`, tema).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível cadastrar esse tema', msg, 'error');
        return throwError(e);
      })
    );
  }

  atualizar(tema: any) {
    return this.http.put(`${this.urlEndPoint}`, tema).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível atualizar esse tema', msg, 'error');
        return throwError(e);
      })
    );
  }

  public excluir(id: any) {
    return this.http.delete(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível cadastrar esse tema', 'O registro está sendo utilizado pelo sistema.', 'error');
        return throwError(e);
      })
    );
  }

}
