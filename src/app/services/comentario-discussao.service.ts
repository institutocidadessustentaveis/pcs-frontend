import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

import { comentarioDiscussao } from '../model/comentario-discussao';

@Injectable({
  providedIn: 'root'
})

export class ComentariosDiscussaoService {

  private urlEndPoint = `${environment.API_URL}comentarioDiscussao`;

  constructor(private http: HttpClient, private router: Router) { }

  public inserir(comentarioDiscussao: comentarioDiscussao) {
    return this.http.post(`${this.urlEndPoint}/cadastrar`, comentarioDiscussao).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar comentário na discussão', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarComentariosDiscussaoPorIdDiscussao(id: number): Observable<any> {
    return this.http.get<comentarioDiscussao>(`${this.urlEndPoint}/buscarComentariosDiscussaoPorIdDiscussao/${id}`).pipe(
        catchError(e => {
          if (e.error.message){
            swal.fire('Erro ao carregar comentários na discussão', e.error.message, 'error');
          return throwError(e);
          }   
        })
      );
  }
  

  public buscarComentariosDiscussaoPorId(id: number): Observable<comentarioDiscussao> {
    return this.http.get<comentarioDiscussao>(`${this.urlEndPoint}/buscarComentariosDiscussaoPorId/${id}`).pipe(
        catchError(e => {
            if (e.error.message){
              swal.fire('Erro ao carregar comentário', e.error.message, 'error');
            return throwError(e);
            }   
        })
    );
  }

  public excluirComentarioDiscussao(id: number): Observable<comentarioDiscussao> {
    return this.http.delete<comentarioDiscussao>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir comentario', '', 'error');
        return throwError(e);
      })
    );
  }

  public editar(comentarioDiscussao: comentarioDiscussao) {
    return this.http.put<comentarioDiscussao>(`${this.urlEndPoint}/editar`, comentarioDiscussao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar comentario', "", 'error');
        return throwError(e);
      })
    );
  }
}


