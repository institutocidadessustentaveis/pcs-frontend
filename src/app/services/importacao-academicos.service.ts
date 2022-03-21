import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { PcsUtil } from './pcs-util.service';
@Injectable({
  providedIn: 'root'
})
export class ImportacaoAcademicosService {

  private urlEndPoint: string = `${environment.API_URL}indicadores/importacaoAcademicos`;

  constructor(private http: HttpClient, private router: Router) { }

  public importar(obj) {
    let formData = new FormData();
    formData.append('file', obj);
    return this.http.post(`${this.urlEndPoint}`, formData ).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Não foi possível realizar a importação.', msg, 'error');
        return throwError(e);
      })
    );
  }



}
