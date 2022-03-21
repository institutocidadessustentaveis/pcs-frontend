import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import swal from 'sweetalert2';
import { Certificado } from './../model/certificado';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Arquivo } from '../model/arquivo';
import { Header } from 'docx/build/file/header/header';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class CertificadoService {

    private urlEndPoint = `${environment.API_URL}certificado`;

    constructor(
        private http: HttpClient,
    ) { }

    public cadastrarCertificado(certificado: Certificado) {
        return this.http.post(`${this.urlEndPoint}/cadastrar`, certificado).pipe(
            catchError(e => {
                let msg = '';
                if (e.error.errors) {
                    msg = e.error.errors[0].message;
                }
                swal.fire('Não foi possível cadastrar o certificado', msg, 'error');
                return throwError(e);
            })
        );
    }

    public enviarPorEmail(certificado, destinatario, nomeUsuario) {          
      return this.http.post(`${this.urlEndPoint}/enviarPorEmail/${destinatario}/${nomeUsuario}`, certificado).pipe(
        catchError(e => {
            let msg = '';
            if (e.error.errors) {
                msg = e.error.errors[0].message;
            }
            swal.fire('Não foi possível enviar o certificado por email', msg, 'error');
            return throwError(e);
        })
    );
    }

    public buscarCertificadoPorId(id: number): Observable<Certificado> {
        return this.http.get<Certificado>(`${this.urlEndPoint}/buscarCertificadoPorId/${id}`).pipe(
          catchError(e => {
            return throwError(e);
          })
        );
    }

    public buscarCertificados(): Observable<any> {
        return this.http.get<Certificado>(`${this.urlEndPoint}/buscarCertificadoToList`).pipe(
          catchError(e => {
            return throwError(e);
          })
        );
    }

    public buscarCertificadosResumidos(): Observable<any> {
      return this.http.get<Certificado>(`${this.urlEndPoint}/buscarCertificadoToListResumido`).pipe(
        catchError(e => {
          return throwError(e);
        })
      );
  }

    public editarCertificado(certificado: Certificado) {
        return this.http.put<Certificado>(`${this.urlEndPoint}/editar/${certificado.id}`, certificado).pipe(
          catchError(e => {
            swal.fire('Erro ao editar o Certificado', '', 'error');
            return throwError(e);
          })
        );
    }

    public excluirCertificado(id: number): Observable<Certificado> {
        return this.http.delete<Certificado>(`${this.urlEndPoint}/excluir/${id}`).pipe(
          catchError(e => {
            swal.fire('Não foi possível excluir o certificado', '', 'error');
            return throwError(e);
          })
        );
      }

    public buscarImagemCertificado(id: number): Observable<Arquivo> {
      return this.http.get<Arquivo>(`${this.urlEndPoint}/imagem/${id}`).pipe(
        catchError(e => {
          return throwError(e);
        })
      );
    }
}
