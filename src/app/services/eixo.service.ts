import { EixoListagem } from './../model/EixoListagem';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
// Models Eixo
import { Eixo } from 'src/app/model/eixo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EixoService {
  urlEndPoint: string = `${environment.API_URL}eixo`;
  constructor(private http: HttpClient, private router: Router) { }

  public buscarEixo(): Observable<Array<Eixo>> {
    return this.http.get<Array<Eixo>>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados eixo', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarEixoId(id: number): Observable<Eixo> {
    return this.http.get<Eixo>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/eixo']);
          swal.fire('Erro ao carregar eixo', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public inserir(eixo: Eixo) {
    return this.http.post(`${this.urlEndPoint}`, eixo).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar eixo', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editar(eixo: Eixo) {
    return this.http.put<Eixo>(`${this.urlEndPoint}/${eixo.id}`, eixo).pipe(
      catchError(e => {
        swal.fire('Erro ao editar eixo', '', 'error');
        return throwError(e);
      })
    );
  }

  public deletar(id: number): Observable<Eixo> {
    return this.http.delete<Eixo>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.error.message.includes('referenced')) {
          swal.fire('Erro ao excluir eixo', 'Este eixo está viculado a outros dados do sistema, portanto não pode ser apagado.', 'error');
        }
        else {
          swal.fire('Erro ao excluir eixo','', 'error');
          return throwError(e);
        }
      })
    );
  }

  public buscarEixosParaCombo(comIndicadores): Observable<Array<Eixo>> {
    return this.http.get<Array<Eixo>>(`${this.urlEndPoint}/buscarEixosCombo?comListaIndicadores=${comIndicadores}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar eixos', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarEixosDto(): Observable<Array<Eixo>> {
    return this.http.get<Array<Eixo>>(`${this.urlEndPoint}/buscarEixosDto`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar eixos', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarEixosList(): Observable<Array<EixoListagem>> {
    return this.http.get<Array<EixoListagem>>(`${this.urlEndPoint}/buscarEixosList`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar eixos', '', 'error');
        return throwError(e);
      })
    );
  }

}
