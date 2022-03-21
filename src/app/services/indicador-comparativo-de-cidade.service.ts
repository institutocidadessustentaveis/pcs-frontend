import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { BuildVersion } from '../model/buildversion';

@Injectable({
  providedIn: 'root'
})
export class IndicadorComparativoDeCidadeService {

  constructor(private http: HttpClient, private router: Router) { }

  private urlEndPoint = `${environment.API_URL}buscarindicadorcomparativodecidades`;

  private urlEndPointMesmaCidade = `${environment.API_URL}buscarComparativoDeIndicadoresMesmaCidade`;


  public buscarIndicadorComparativoDeCidades(idIndicador, filtroCidades:string): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}?indicador=${idIndicador}&filtroCidades=${filtroCidades}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarComparativoDeIndicadoresMesmaCidade(idCidade, sigla, filtroIndicadores:string): Observable<any> {
    return this.http.get<any>(`${this.urlEndPointMesmaCidade}?cidade=${idCidade}&sigla=${sigla}&filtroIndicadores=${filtroIndicadores}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
