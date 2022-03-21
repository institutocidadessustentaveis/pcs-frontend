import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertaEventoService {

  private urlEndPoint = `${environment.API_URL}alertaEvento`;

  constructor(private http: HttpClient, private router: Router) { }


  public salvar(alerta) {
    return this.http.post(`${this.urlEndPoint}`, alerta).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  public excluir(id) {
    return this.http.delete(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscar(idEvento){
    return this.http.get(`${this.urlEndPoint}/${idEvento}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
}
