
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Noticia } from '../model/noticia';
import { Buscar } from '../model/buscar';

@Injectable({
  providedIn: 'root'
})

export class BuscarService {
  urlEndPoint: string = `${environment.API_URL}buscar`;
  constructor(private http: HttpClient, private router: Router) { }


  public teste(){
    return this.http.get<Buscar>(`${this.urlEndPoint}/testeEmail`).pipe(
     
    );
  }

  public buscarPorPalavraChave(palavrasChave: string): Observable<Buscar> {
    let params: HttpParams = new HttpParams();
    if (palavrasChave === null) {
      params =  params.append('q', '');
    } else {
      params =  params.append('q', palavrasChave);
    }

    return this.http.get<Buscar>(`${this.urlEndPoint}/buscarPorPalavraChave`, { params: params }).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/buscar']);
          swal.fire('Erro ao carregar links', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }


}
