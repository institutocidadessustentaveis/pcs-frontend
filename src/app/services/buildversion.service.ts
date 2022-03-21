import { HttpClient } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { BuildVersion } from '../model/buildversion';

@Injectable({
  providedIn: 'root'
})
export class BuildVersionService {

  constructor(private http: HttpClient, private router: Router) { }
  private urlEndPoint = `${environment.API_URL}build`;


  public buscarBuildBackendAtual(): Observable<BuildVersion>{
    return this.http.get<BuildVersion>(`${this.urlEndPoint}/backend`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  public buscarBuildFrontendAtual(): Observable<BuildVersion>{
    return this.http.get<BuildVersion>(`${this.urlEndPoint}/frontend`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
}
