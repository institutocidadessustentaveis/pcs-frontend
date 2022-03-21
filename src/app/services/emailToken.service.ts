import { EmailToken } from '../model/emailToken';
import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { PcsUtil } from './pcs-util.service';

@Injectable({
  providedIn: 'root'
})
export class EmailTokenService {

  constructor(private http: HttpClient, private router: Router) { }
  private urlEndPoint = `${environment.API_URL}emailToken`;


  public buscarByHash( token: string ): Observable<EmailToken>{
    return this.http.get<EmailToken>(`${this.urlEndPoint}/buscarPorHash?token=${token}`).pipe(
      catchError(e => {
        PcsUtil.swal().fire({
          title: 'Ação Cancelada',
          text: `${e.error.message}`,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then(() => {
          this.router.navigate(['/']);
        });
        return throwError(e);
      })
    );
  }

  public isAtivadoByIdAprovacaoPrefeitura(id: number) {
    return this.http.get<EmailToken>(`${this.urlEndPoint}/isAtivoByIdAprovacaoPrefeitura/${id}`).pipe(
      catchError(e => {
        PcsUtil.swal().fire({
          title: 'Ação Cancelada',
          text: `${e.error.message}`,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then(() => {
          this.router.navigate(['/']);
        });
        return throwError(e);
      })
    );
  }
}
