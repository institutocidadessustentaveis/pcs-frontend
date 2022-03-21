import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Perfil } from '../model/perfil';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PerfisService {

  private urlEndPoint = `${environment.API_URL}perfis`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscarPerfis(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(`${this.urlEndPoint}/buscar`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar perfis', "", 'error');
        return throwError(e);
      })
    );
  }
  public buscarPerfisGestaoPublica(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(`${this.urlEndPoint}/buscarPerfilGestaoPublica`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar perfis', "", 'error');
        return throwError(e);
      })
    );
  }

  public buscarFuncionalidades(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarFuncionalidades`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar funcionalidades', "", 'error');
        return throwError(e);
      })
    );
  }
  public buscarFuncionalidadesRestantes(id): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarFuncionalidades`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar funcionalidades', "", 'error');
        return throwError(e);
      })
    );
  }

  public buscarPerfil(id: number): Observable<Perfil>{
    return this.http.get<Perfil>(`${this.urlEndPoint}/buscar/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/perfis']);
          swal.fire('Erro ao carregar informações', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public editar(perfil: Perfil): Observable<Perfil>{
    return this.http.put<Perfil>(`${this.urlEndPoint}/editar/${perfil.id}`, perfil).pipe(
      catchError(e => {
        swal.fire('Erro ao editar perfil', "", 'error');
        return throwError(e);
      })
    );
  }

  public inserir(perfil: Perfil) {
    return this.http.post(`${this.urlEndPoint}/cadastrar`, perfil).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors){
          msg = e.error.errors[0].message;
        } else {
          msg = e.error.message;
        }
        swal.fire('Erro ao cadastrar perfil', msg, 'error');
        return throwError(e);
      })
    );
  }

  public deletar(id: number): Observable<Perfil>{
    return this.http.delete<Perfil>(`${this.urlEndPoint}/deletar/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir perfil', "", 'error');
        return throwError(e);
      })
    );
  }

  public buscarPerfilAtivo(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(`${this.urlEndPoint}/buscarPerfilAtivo`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar perfis', "", 'error');
        return throwError(e);
      })
    );
  }

  public buscarComboBoxPerfis(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarComboBoxPerfil`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar perfil', '', 'error');
        return throwError(e);
      })
    );
  }

}
