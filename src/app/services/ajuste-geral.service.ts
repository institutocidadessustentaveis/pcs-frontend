import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AjusteGeral } from '../model/ajuste-geral';

@Injectable({
  providedIn: 'root'
})

export class AjusteGeralService {

  private urlEndPoint = `${environment.API_URL}ajuste-geral`;

  constructor(private http: HttpClient) { }

  public inserirAjuste(ajuste: AjusteGeral) : Observable<AjusteGeral> {
    return this.http.post<any>(`${this.urlEndPoint}/inserir-ajuste`, ajuste).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarAjustePorLocalApp(localApp: string) : Observable<AjusteGeral> {
    return this.http.get<AjusteGeral>(`${this.urlEndPoint}/buscarAjustePorLocalApp?localApp=${localApp}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarListaAjustes(localApp: string) : Observable<Array<AjusteGeral>> {
    return this.http.get<Array<AjusteGeral>>(`${this.urlEndPoint}/buscarListaAjustes?localApp=${localApp}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public deletar(id: number) : Observable<any> {
    return this.http.delete<any>(`${this.urlEndPoint}/deletar/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
