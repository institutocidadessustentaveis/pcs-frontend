import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ForumDiscussao } from './../model/forum-discussao';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FiltroForum } from '../model/filtroForum';

@Injectable({
  providedIn: 'root'
})
export class ForumDiscussaoService {

  urlEndPoint: string = `${environment.API_URL}forum-discussao`;
  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  salvar(forumDiscussao): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/salvar`, forumDiscussao).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarPorId(id: number): Observable<ForumDiscussao> {
    return this.http.get<ForumDiscussao>(`${this.urlEndPoint}/buscarDiscussaoPorId/${id}`).pipe(
      catchError(e => {        
        console.log(e);
        if (e.status == 403){
          swal.fire('Sem permissão', 'Você não tem permissão para visualizar esta discussão', 'warning');
        }
        if (e.status == 416) {
          swal.fire('Inativa', 'Esta discussão não está ativa', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public buscarDiscussoesToList(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarDiscussoesToList`).pipe(
      catchError(e => {
        if (e.error.message){
          swal.fire('Erro ao carregar Discussões', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public atualizarDiscussao(discussao: ForumDiscussao): Observable<any> {
    return this.http.post<ForumDiscussao>(`${this.urlEndPoint}/atualizarDiscussao`, discussao).pipe(
      catchError(e => {
        if (e.error.message){
          swal.fire('Erro ao atualizar Discussao', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public atualizarVisualizacao(discussao: ForumDiscussao) {
    return this.http.post(`${this.urlEndPoint}/atualizarVisualizacao`, discussao).pipe(
      catchError(e => {
        if (e.error.message){
          swal.fire('Erro ao atualizar Visualizacao', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarParaEdicao(id: number): Observable<ForumDiscussao> {
    return this.http.get<ForumDiscussao>(`${this.urlEndPoint}/buscar/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/participacao-cidada/forum']);
          swal.fire('Erro ao carregar discussão', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public editar(forumDiscussao: ForumDiscussao){
    return this.http.put(`${this.urlEndPoint}/editar`, forumDiscussao).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível editar a discussão', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarListaDiscussoes(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarListaDiscussoes`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarListaDiscussoesPorIdPrefeitura(idPrefeitura: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarListaDiscussoesPorIdPrefeitura/${idPrefeitura}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public deletar(idDiscussao: number): Observable<any> {
    return this.http.delete<ForumDiscussao>(`${this.urlEndPoint}/excluir/${idDiscussao}`).pipe(
      catchError(e => {
        swal.fire('A discossão não foi excluída', e.error.message, 'warning');
        return throwError(e);
      })
    );
  }

  public buscarDiscussoesFiltradas(filtroForum: FiltroForum): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarDiscussoesFiltradas?palavraChave=${filtroForum.palavraChave ? filtroForum.palavraChave : ''}&idsTemas=${filtroForum.idsTemas ? filtroForum.idsTemas : []}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public atualizarUsuarioUltimaPostagem(discussao: ForumDiscussao) {
    return this.http.post(`${this.urlEndPoint}/atualizarUsuarioUltimaPostagem`, discussao).pipe(
      catchError(e => {
        if (e.error.message){
          swal.fire('Erro ao atualizar usuário última postagem', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public salvarImagemCorpoComentario(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.API_URL}imagens/upload`, formData).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar imagem', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public apagarImagemCorpoComentario(id: number): Observable<any> {
    return this.http.delete(`${environment.API_URL}imagens/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao apagar imagem', '', 'error');
        return throwError(e);
      })
    );
  }

}
