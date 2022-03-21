import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { PaginaInicialBannerItem } from '../model/paginaInicialBannerItem';

@Injectable({
  providedIn: 'root'
})

export class PaginaInicialService {
  urlEndPoint: string = `${environment.API_URL}pagina-inicial`;
  constructor(private http: HttpClient, private router: Router) { }

  public buscarBannerPrincipal(): Observable<Array<PaginaInicialBannerItem>> {
    return this.http.get<Array<PaginaInicialBannerItem>>(`${this.urlEndPoint}/bannerPrincipal`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


}
