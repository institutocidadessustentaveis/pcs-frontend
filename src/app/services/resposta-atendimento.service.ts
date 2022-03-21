import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RespostaAtendimento } from '../model/resposta-atendimento';

@Injectable({
  providedIn: 'root'
})
export class RespostaAtendimentoService {

  private urlEndPoint = `${environment.API_URL}respostaAtendimento`;

  constructor(private http: HttpClient) { }

  public salvarResposta(resposta: RespostaAtendimento) : Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/salvar`, resposta).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarRespostaAtendimentoPorIdFormulario(id: number) : Observable<RespostaAtendimento> {
    return this.http.get<RespostaAtendimento>(`${this.urlEndPoint}/buscarRespostaAtendimentoPorIdFormulario/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
}
