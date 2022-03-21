import { catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DBChangelog } from '../model/dbchangelog';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DBChangelogService {

  constructor(private http: HttpClient, private router: Router) { }
  private urlEndPoint = `${environment.API_URL}dbchangelog`;


  public buscarVersaoAtual(): Observable<DBChangelog>{
    return this.http.get<DBChangelog>(`${this.urlEndPoint}/versaoAtual`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
}
