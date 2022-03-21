import { HistoricoCertificadoCapacitacao } from './../model/historicoCertificadoCapacitacao';
import { CertificadoCapacitacao } from '../model/certificadoCapacitacao';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import swal from 'sweetalert2';
import { Certificado } from '../model/certificado';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
@Injectable({
    providedIn: 'root'
})
export class HistoricoCertificadoService {

    private urlEndPoint = `${environment.API_URL}historico-certificado`;

    constructor(
        private http: HttpClient,
    ) { }

    public cadastrarHistoricoCertificado(historicoCertificadoCapacitacao: HistoricoCertificadoCapacitacao) {
        return this.http.post(`${this.urlEndPoint}/cadastrar`, historicoCertificadoCapacitacao).pipe(
            catchError(e => {
                let msg = '';
                if (e.error.errors) {
                    msg = e.error.errors[0].message;
                }
                swal.fire('Erro ao salvar o histórico de certificado', msg, 'error');
                return throwError(e);
            })
        );
    }

    public buscarHistoricoCertificadoPorId(id: number): Observable<HistoricoCertificadoCapacitacao> {
        return this.http.get<HistoricoCertificadoCapacitacao>(`${this.urlEndPoint}/buscarHistoricoCertificadoPorId/${id}`).pipe(
          catchError(e => {
            return throwError(e);
          })
        );
    }

    public buscarHistoricoCertificados(): Observable<any> {
        return this.http.get<HistoricoCertificadoCapacitacao>(`${this.urlEndPoint}/buscarHistoricoCertificadoToList`).pipe(
          catchError(e => {
            return throwError(e);
          })
        );
    }

    public excluirHistoricoCertificado(id: number): Observable<HistoricoCertificadoCapacitacao> {
        return this.http.delete<HistoricoCertificadoCapacitacao>(`${this.urlEndPoint}/excluir/${id}`).pipe(
          catchError(e => {
            swal.fire('Não foi possível excluir o histórico de certificado', '', 'error');
            return throwError(e);
          })
        );
      }
}
