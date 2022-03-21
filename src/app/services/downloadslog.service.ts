import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class DownloadslogService {

  private urlEndPoint:string = `${environment.API_URL}downloadsexportacoes`;

  constructor(private http: HttpClient) { }

  public registrarLogDownload(nomeArquivo: string): Observable<any> {
    return this.http.post<any>(`${this.urlEndPoint}/registraLogDownloadsExportacoes`, { nomeArquivo: nomeArquivo }).pipe(
      catchError(e => {
        swal.fire('Erro ao registrar download', '', 'error');
        return throwError(e);
      })
    );
  }

}
