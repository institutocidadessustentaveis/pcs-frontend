import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CidadesSignatariasService {

  urlEndPoint: string = `${environment.API_URL}cidadesSignatarias`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscarTxt(): Observable<any>{
    return this.http.get(`${this.urlEndPoint}/conteudoTxtFtp`, {responseType: 'text'}).pipe(
      catchError(e => {
        Swal.fire('Erro ao carregar texto do subtitulo');
        return throwError(e);
      })
    );
  }
}
