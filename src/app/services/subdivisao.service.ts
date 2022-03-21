import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { TipoSubdivisao } from '../model/tipoSubdivisao';
import { SubDivisao } from '../model/SubDivisao';

@Injectable({
  providedIn: 'root'
})
export class SubdivisaoService {

  private urlEndPoint = `${environment.API_URL}subdivisao`;

  constructor(private http: HttpClient, private router: Router) { }


  public buscarTodosPorCidadeId(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarTodosPorCidadeId/${id}`);
  }

  public buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/${id}`);
  }

  public buscarTodosPorCidade(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarTodosPorCidade`);
  }

  public excluirSubdivisao(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        Swal.fire('Não foi possível excluir a Subdivisão', '', 'error');
        return throwError(e);
      })
    );
  }

  public cadastrarSubdivisao(subdivisao: SubDivisao){
    return this.http.post(`${this.urlEndPoint}/cadastrar`, subdivisao).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        Swal.fire('Não foi possível cadastrar a Subdivisão', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editarSubdivisao(subdivisao: SubDivisao){
    return this.http.put(`${this.urlEndPoint}/editar`, subdivisao).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        Swal.fire('Não foi possível editar subdivisão', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarTodasSubdivisaoRelacionadasComSubdivisaoPai(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarTodasSubdivisaoRelacionadasComSubdivisaoPai/${id}`);
  }


  buscarArvoreSubdivisoes(idCidade: any) {
    return this.http.get<any>(`${this.urlEndPoint}/arvore/${idCidade}`);
  }

  buscarTodosPorCidadeIdNivel(idCidade: any, nivel: any) {
    return this.http.get<any>(`${this.urlEndPoint}/feature/${idCidade}/${nivel}`);
  }
  buscarFeatureSubdivisao(idSubdivisao: any) {
    return this.http.get<any>(`${this.urlEndPoint}/feature/${idSubdivisao}`);
  }

  buscarUfCidadeSubdivisao(sigla: any, nomeCidade: any, nomeSubdivisao: any) {
    return this.http.get<any>(`${this.urlEndPoint}/${sigla}/${nomeCidade}/${nomeSubdivisao}`);
  }

}
