import { PcsUtil } from './pcs-util.service';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AreaInteresseService {
  private urlEndPoint = `${environment.API_URL}areaInteresse`;
  constructor(private http: HttpClient, private router: Router) { }

  buscaAreasInteresses(): Observable<any[]> {
    return this.http.get<any[]>(this.urlEndPoint ).pipe(
      catchError(e => {
        PcsUtil.swal().fire('Erro ao carregar area interesse', '', 'error');
        return throwError(e);
      })
    );
  }

  
}

