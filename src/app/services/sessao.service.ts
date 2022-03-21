import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessaoService {

  urlEndPoint = `${environment.API_URL}sessao`;
  constructor(private http: HttpClient) { }

  public cidade(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/cidade`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
}
