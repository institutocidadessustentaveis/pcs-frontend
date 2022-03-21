import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { Comentario } from '../model/comentario';
import { FiltroComentario } from '../model/filtroComentario';
@Injectable({
  providedIn: 'root'
})
export class ComentarioService {
  urlEndPoint: string = `${environment.API_URL}comentario`;

  constructor(
    private http: HttpClient,
  ) { }

  public cadastrarComentario(comentario: Comentario){
    return this.http.post(`${this.urlEndPoint}/cadastrar`, comentario).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível cadastrar o comentario', msg, 'error');
        return throwError(e);
      })
    );
  }
  public buscarComentarioPorId(id: number): Observable<Comentario> {
    return this.http.get<Comentario>(`${this.urlEndPoint}/buscarComentarioPorId/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarComentariosToList(idUsuario: number): Observable<any> {
    return this.http.get<Comentario>(`${this.urlEndPoint}/buscarComentariosToList/${idUsuario}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarComentariosToListPublica(): Observable<any> {
    return this.http.get<Comentario>(`${this.urlEndPoint}/buscarComentariosToListPublica`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public editarComentario(comentario: Comentario){
    return this.http.put(`${this.urlEndPoint}/editar`, comentario).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível editar o comentário', msg, 'error');
        return throwError(e);
      })
    );
  }

  public excluirComentario(id: number): Observable<Comentario> {
    return this.http.delete<Comentario>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir o comentario', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarComentarioFiltrado(
    relObj: FiltroComentario
  ): Observable<Array<FiltroComentario>> {
    return this.http.get<Array<FiltroComentario>>(`${this.urlEndPoint}/buscarComentarioFiltrado?palavraChave=${relObj.palavraChave ? relObj.palavraChave : ''}&dataInicial=${relObj.dataInicial ? relObj.dataInicial : ''}&dataFinal=${relObj.dataFinal ? relObj.dataFinal : ''}&idCidade=${relObj.idCidade ? relObj.idCidade : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }
}
