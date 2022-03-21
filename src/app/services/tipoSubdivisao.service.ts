import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { catchError } from 'rxjs/operators';
import { TipoSubdivisao } from '../model/tipoSubdivisao';

@Injectable({
  providedIn: 'root'
})
export class TipoSubdivisaoService {

  private urlEndPoint = `${environment.API_URL}tipoSubdivisao`;

  constructor(private http: HttpClient, private router: Router) { }


  public buscarTodosPorPrefeituraId(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarTodosPorPrefeituraId/${id}`);
  }

  public buscarTodosPorCidadeId(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/cidade/${id}`);
  }

  public excluirTipoSubdivisao(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        Swal.fire('Não foi possível excluir o Tipo de Subdivisão', '', 'error');
        return throwError(e);
      })
    );
  }

  public cadastrarTipoSubdivisao(tipoSubdivisao: TipoSubdivisao){
    return this.http.post(`${this.urlEndPoint}/cadastrar`, tipoSubdivisao).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        Swal.fire('Não foi possível cadastrar o Tipo de Subdivisão', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editarTipoSubdivisao(tipoSubdivisao: TipoSubdivisao){
    return this.http.put(`${this.urlEndPoint}/editar`, tipoSubdivisao).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        Swal.fire('Não foi possível editar o tipo de subdivisão', msg, 'error');
        return throwError(e);
      })
    );
  }
}
