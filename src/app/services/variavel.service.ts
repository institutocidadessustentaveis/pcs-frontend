import { ItemCombo } from './../model/ItemCombo ';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
// Models Eixo
import { Variavel } from 'src/app/model/variaveis';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class VariavelService {
  urlEndPoint: string = `${environment.API_URL}variavel`;
  constructor(private http: HttpClient, private router: Router) { }

  public buscarVariavel() : Observable<Array<Variavel>> {
    return this.http.get<Array<Variavel>>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados variavel', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarVariavelId(id: number): Observable<Variavel>{
    return this.http.get<Variavel>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/variaveis']);
          swal.fire('Erro ao carregar variavel', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }
  public buscarVariavelCompletaId(id: number): Observable<Variavel>{
    return this.http.get<Variavel>(`${this.urlEndPoint}/consulta/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public inserir(variavel: Variavel) {
    return this.http.post(`${this.urlEndPoint}`, variavel).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar variavel', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editar(variavel: Variavel) {
    return this.http.put<Variavel>(`${this.urlEndPoint}/${variavel.id}`, variavel).pipe(
      catchError(e => {
        swal.fire('Erro ao editar variavel', "", 'error');
        return throwError(e);
      })
    );
  }

  public deletar(id: number): Observable<Variavel> {
    return this.http.delete<Variavel>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          swal.fire('Não foi possível excluir', e.error.message, 'warning');
        }
        return throwError(e);
      })
    );
  }

  public carregaVariaveisPCSSimples(): Observable<Array<Variavel>>{
    return this.http.get<Array<Variavel>>(`${this.urlEndPoint}/pcsSimples`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista de variaveis', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarVariaveisPcsParaCombo(): Observable<Array<ItemCombo>> {
    return this.http.get<Array<ItemCombo>>(`${this.urlEndPoint}/buscarVariaveisPcsParaCombo`).pipe(
      catchError(e => {
        console.log('Erro ao carregar variáveis', '', 'error');
        return throwError(e);
      })
    );
  }

}
