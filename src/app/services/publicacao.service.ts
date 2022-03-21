import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Publicacao } from '../model/publicacao';

@Injectable({
  providedIn: 'root'
})

export class PublicacaoService {

  private urlEndPoint = `${environment.API_URL}publicacao`;

  constructor(private http: HttpClient, private router: Router) { }

  public inserir(publicacao: Publicacao) {
    return this.http.post(`${this.urlEndPoint}/inserir`, publicacao).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        console.log('Erro ao cadastrar publicação', msg, 'error');
        return throwError(e);
      })
    );
  }

  public excluir(id: number): Observable<Publicacao> {
    return this.http.delete<Publicacao>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        console.log('Erro ao excluir publicação', '', 'error');
        return throwError(e);
      })
    );
  }

  public listar(pagina, ehPrefeitura, idInstitucional): Observable<Publicacao> {
    return this.http.get<any>(`${this.urlEndPoint}?page=${pagina}&ehPCS=${ehPrefeitura}&idInstitucional=${idInstitucional}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  public buscarPublicacaoPorId(id: number): Observable<Publicacao> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarPublicacaoPorId/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public editar(publicacao: Publicacao) {
    return this.http.put<Publicacao>(`${this.urlEndPoint}/editar/${publicacao.id}`, publicacao).pipe(
      catchError(e => {
        console.log('Erro ao editar publicação', "", 'error');
        return throwError(e);
      })
    );
  }

}


