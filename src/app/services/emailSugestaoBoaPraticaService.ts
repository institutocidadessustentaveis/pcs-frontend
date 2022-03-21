import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Pais } from 'src/app/model/pais';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EmailSugestaoBoaPraticaService {

  private urlEndPoint = `${environment.API_URL}parametrogeral`;
  constructor(private http: HttpClient, private router: Router) { }

  public retornaEmailSugestaoBoaPratica(){
    return this.http.get(`${this.urlEndPoint}/emailsugestaoboaspraticas`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao carregar e-mail da sugestão de boa prática', msg, 'error');
        return throwError(e);
      })
    );
  }
}


