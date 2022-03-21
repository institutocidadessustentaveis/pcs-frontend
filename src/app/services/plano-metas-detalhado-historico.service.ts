import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PlanoDeMetasDetalhadoHistorico } from '../model/plano-metas-detalhado-historico';

@Injectable({
  providedIn: 'root'
})
export class PlanoMetasDetalhadoHistoricoService {
    private urlEndPoint = `${environment.API_URL}planoDeMetasDetalhadoHistorico`;
    
    constructor(private http: HttpClient) { }

    public buscarMetasHistoricoAnos(idPlano: Number, idIndicador: Number): Observable<PlanoDeMetasDetalhadoHistorico> {
      return this.http.get<PlanoDeMetasDetalhadoHistorico>(`${this.urlEndPoint}/buscarHistoricoAnos/${idPlano}/${idIndicador}`).pipe(
        catchError(e => {
            let msg: string = "";
            if (e.error.errors) {
              msg = e.error.errors[0].message;
            }
            swal.fire('Não foi possível carregar o histórico', msg, 'error');
            return throwError(e);
          })
      );
    }
}