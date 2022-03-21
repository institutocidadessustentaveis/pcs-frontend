import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PropostaMunicipioService {

  private urlEndPoint = `${environment.API_URL}proposta-municipio`;

  constructor(private http: HttpClient, private router: Router) { }

  cadastrar(proposta :any){
    return this.http.post(`${this.urlEndPoint}`, proposta).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}
