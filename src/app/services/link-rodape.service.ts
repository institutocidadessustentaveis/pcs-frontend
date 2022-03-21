import { Injectable, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class LinkRodapeService {

  private urlEndPoint = `${environment.API_URL}linksRodape`;

  @Output() linksChanged: EventEmitter<any[]> = new EventEmitter();

  constructor(private http: HttpClient) { }

  public buscarLinksOrdenados() {
    return this.http.get(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        console.log('Erro ao listar links do rodapé '+ msg);
        return throwError(e);
      })
    );
  }

  public buscarLinksOrdenadosComCache() {
    return this.http.get(`${this.urlEndPoint}/cache`).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        console.log('Erro ao listar links do rodapé '+ msg);
        return throwError(e);
      })
    );
  }

  public save(links: any[]) {
    return this.http.put(`${this.urlEndPoint}`, links).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        console.log('Erro ao listar links do rodapé '+ msg);
        return throwError(e);
      })
    );
  }

  public delete(id: number) {
    return this.http.delete(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao remover link do rodapé', msg, 'error');
        return throwError(e);
      })
    );
  }

}
