import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoricoCompartilhamentoService {

  private urlEndPoint = `${environment.API_URL}historicoCompartilhamento`;

  constructor(private http: HttpClient) { }

  public gerarHistoricoCompartilhamento(redeSocial: string, tipoConteudo: string): Observable<any> { 
    return this.http.post<any>(`${this.urlEndPoint}`, {"redeSocial": redeSocial, "tipoConteudo": tipoConteudo}).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
}
