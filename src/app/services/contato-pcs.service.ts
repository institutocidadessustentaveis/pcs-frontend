import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ContatoPcsService {

  private urlEndPoint = `${environment.API_URL}contatoPcs`;

  @Output() contatoChanged: EventEmitter<any[]> = new EventEmitter();

  constructor(private http: HttpClient) { }

  public salvarContatoPcs(contato) {
    return this.http.put(`${this.urlEndPoint}`, contato).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar dados do contato', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarContatoMaisRecente() {
    return this.http.get(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        console.log('Erro ao carregar dados do contato do rodapé');
        return throwError(e);
      })
    );
  }

  public buscarContatoMaisRecenteComCache() {
    return this.http.get(`${this.urlEndPoint}/cache`).pipe(
      catchError(e => {
        console.log('Erro ao carregar dados do contato do rodapé');
        return throwError(e);
      })
    );
  }

}
