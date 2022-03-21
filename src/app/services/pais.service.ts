import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Pais } from 'src/app/model/pais';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PaisService {

  private urlEndPoint = `${environment.API_URL}pais`;

  constructor(private http: HttpClient, private router: Router) { }

  public inserirPais(pais: Pais) {
    return this.http.post(`${this.urlEndPoint}/inserirPais`, pais).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar pais', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarPaises(page: number, linesPerPage: number, orderBy: string , direction: string): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscar`, {
      params: {
        page: page.toString(),
        linesPerPage: linesPerPage.toString(),
        orderBy : orderBy.toString(),
        direction : direction.toString()
      }
    }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar paises', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarTodos(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarTodos`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar paises', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorNome(nome: string, page: number, itemsPerPage: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscar/` + nome, {
      params: {
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString()
      }
    }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', '', 'error');
        return throwError(e);
      })
    );
  }

  public editarPais(pais: Pais): Observable<Pais> {
    return this.http.put<Pais>(`${this.urlEndPoint}/editar/${pais.id}`, pais).pipe(
      catchError(e => {
        swal.fire('Erro ao editar pais', "", 'error');
        return throwError(e);
      })
    );
  }

  public deletarPais(id: number): Observable<Pais> {
    return this.http.delete<Pais>(`${this.urlEndPoint}/deletar/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir pais', "", 'error');
        return throwError(e);
      })
    );
  }

  public buscarTodosPaisEstado(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarTodosPaisEstado`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar paises', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPaisesPorContinente(continente: string): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarPaisesPorContinente/${continente}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar paises', '', 'error');
        return throwError(e);
      }));
  }

  public buscarPaisesCombo(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarPaisesCombo`).pipe(
      catchError(e => {
        console.log('Erro ao carregar combo de países');
        return throwError(e);
      })
    );
  }
}


