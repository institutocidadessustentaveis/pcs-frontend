import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import swal from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class RelatorioVisualizacaoCartograficaService {

  urlEndPoint = `${environment.API_URL}visualizacaoCartografica`;

  constructor(private http: HttpClient) { }

  public inserirRelatorio(nomeIndicador: string, idCidade: Number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/inserirRelatorioVisualizacao/${nomeIndicador}/${idCidade}`)
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }
}
