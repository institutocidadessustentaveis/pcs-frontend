import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { PerfilUsuarioForum } from '../model/perfil-usuario-forum';

@Injectable({
  providedIn: 'root'
})

export class PerfilUsuarioForumService {

  private urlEndPoint = `${environment.API_URL}perfilUsuarioForum`;

  constructor(private http: HttpClient, private router: Router) { }

  public cadastrar(perfilUsuarioForum: PerfilUsuarioForum) {
    return this.http.post(`${this.urlEndPoint}/cadastrar`, perfilUsuarioForum).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar Perfil de usuário ao Fórum', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarPerfilPorIdUsuario(id: number): Observable<PerfilUsuarioForum> {
    return this.http.get<PerfilUsuarioForum>(`${this.urlEndPoint}/buscarPerfilPorIdUsuario/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarPorId(id: number): Observable<PerfilUsuarioForum> {
    return this.http.get<PerfilUsuarioForum>(`${this.urlEndPoint}/buscarPerfilUsuarioForumPorId/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public editar(perfilUsuarioForum: PerfilUsuarioForum){
    return this.http.put(`${this.urlEndPoint}/editar`, perfilUsuarioForum).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao editar o Perfil', msg, 'error');
        return throwError(e);
      })
    );
  }

  public deletar(id: number): Observable<PerfilUsuarioForum> {
    return this.http.delete<PerfilUsuarioForum>(`${this.urlEndPoint}/deletar/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir Perfil', "", 'error');
        return throwError(e);
      })
    );
  }
}