import swal from 'sweetalert2';
import { TemaForum } from './../model/tema-forum';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TemaForumService {

    urlEndPoint: string = `${environment.API_URL}temaforum`;
    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    cadastrar(temaForum): Observable<any> {
        return this.http.post(`${this.urlEndPoint}/cadastrar`, temaForum).pipe(
            catchError(e => {
                return throwError(e);
            })
        );
    }

    public editar(temaForum: TemaForum) {
        return this.http.put(`${this.urlEndPoint}/editar`, temaForum).pipe(
            catchError(e => {
                let msg: string = "";
                if (e.error.errors) {
                    msg = e.error.errors[0].message;
                }
                swal.fire('Não foi possível editar o tema de fórum', msg, 'error');
                return throwError(e);
            })
        );
    }

    public buscarListaTemaForum(): Observable<any> {
        return this.http.get(`${this.urlEndPoint}/buscarListaTemaForum`).pipe(
            catchError(e => {
                return throwError(e);
            })
        );
    }

    public deletar(idTemaForum: number): Observable<any> {
        return this.http.delete<TemaForum>(`${this.urlEndPoint}/excluir/${idTemaForum}`).pipe(
            catchError(e => {
                swal.fire('O tema de fórum não foi excluído', e.error.message, 'warning');
                return throwError(e);
            })
        );
    }

    public buscarParaEdicao(id: number): Observable<TemaForum> {
        return this.http.get<TemaForum>(`${this.urlEndPoint}/buscar/${id}`).pipe(
          catchError(e => {
            if (e.status != 401 && e.error.message){
              this.router.navigate(['/biblioteca/temas-forum']);
              swal.fire('Erro ao carregar o tema de fórum', e.error.message, 'error');
            }
            return throwError(e);
          })
        );
    }
}
