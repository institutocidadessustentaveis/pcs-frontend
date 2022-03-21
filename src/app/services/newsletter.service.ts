import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  urlEndPoint: string = `${environment.API_URL}newsletter`;

  constructor(private http: HttpClient) { }

  public assinarNewsletter(email: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append("email", email);

    return this.http.post<any>(`${this.urlEndPoint}`, {}, { params: params }).pipe(
      catchError(e => {
        swal.fire('Erro ao assinar boletim', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarBoletinsTemplate01():Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarBoletinsTemplate01`).pipe(
      catchError(e => {
        swal.fire('Erro ao buscar boletins', '', 'error');
        return throwError(e);
      })
    )
  }

  public buscarBoletimTempate01PorId(id: number):Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarBoletimTempate01PorId/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao buscar boletim', '', 'error');
        return throwError(e);
      })
    )
  }

  public deletar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlEndPoint}/deletar/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir a notícia', '', 'error');
        return throwError(e);
      })
    );
  }

}
