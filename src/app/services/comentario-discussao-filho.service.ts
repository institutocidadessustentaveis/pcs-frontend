import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import swal from 'sweetalert2';
import { comentarioDiscussao } from '../model/comentario-discussao';

@Injectable({
  providedIn: 'root'
})
export class ComentarioDiscussaoFilhoService {

  private urlEndPoint = `${environment.API_URL}comentarioDiscussaoFilho`;

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

  public buscarComentariosFilhosPorIdComentarioPai(id: number): Observable<Array<comentarioDiscussao>> {
    return this.http.get<Array<comentarioDiscussao>>(`${this.urlEndPoint}/buscarComentariosFilhosPorIdComentarioPai/${id}`).pipe(
        catchError(e => {
          if (e.error.message){
            swal.fire('Erro ao carregar comentários na discussão', e.error.message, 'error');
          return throwError(e);
          }   
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

  public excluir(id: number): Observable<comentarioDiscussao> {
    return this.http.delete<comentarioDiscussao>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir comentario', '', 'error');
        return throwError(e);
      })
    );
  }

  public salvarImagemCorpoComentarioFilho(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.API_URL}imagens/upload`, formData).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar imagem', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public apagarImagemCorpoComentarioFilho(id: number): Observable<any> {
    return this.http.delete(`${environment.API_URL}imagens/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao apagar imagem', '', 'error');
        return throwError(e);
      })
    );
  }
}
