
import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ObjetivoDesenvolvimentoSustentavel } from '../model/objetivoDesenvolvimentoSustentavel';
import { MetaObjetivoDesenvolvimentoSustentavel } from '../model/metaObjetivoDesenvolvimentoSustentavel';
import { ItemCombo } from '../model/ItemCombo ';

@Injectable({
  providedIn: 'root'
})
export class ObjetivoDesenvolvimentoSustentavelService {

  private urlEndPoint:string = `${environment.API_URL}ods`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscar(): Observable<any> {
    return this.http.get<Array<ObjetivoDesenvolvimentoSustentavel>>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os ODS.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarOds(id: number): Observable<ObjetivoDesenvolvimentoSustentavel> {
    return this.http.get<ObjetivoDesenvolvimentoSustentavel>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/ods']);
          swal.fire('Erro ao carregar ODS', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  inserir(ods: ObjetivoDesenvolvimentoSustentavel) {
    return this.http.post(`${this.urlEndPoint}`, ods).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar ODS', msg, 'error');
        return throwError(e);
      })
    );
  }

  editar(ods: ObjetivoDesenvolvimentoSustentavel) {
    return this.http.put<ObjetivoDesenvolvimentoSustentavel>(`${this.urlEndPoint}/${ods.id}`, ods).pipe(
      catchError(e => {
        swal.fire('Erro ao editar ODS', '', 'error');
        return throwError(e);
      })
    );
  }

  editarMeta(idOds: number, meta: MetaObjetivoDesenvolvimentoSustentavel) {
    return this.http.put<MetaObjetivoDesenvolvimentoSustentavel>(`${this.urlEndPoint}/${idOds}/metas/${meta.id}`, meta).pipe(
      catchError(e => {
        swal.fire('Erro ao editar a Meta', '', 'error');
        return throwError(e);
      })
    );
  }

  public deletar(id: number): Observable<ObjetivoDesenvolvimentoSustentavel> {
    return this.http.delete<ObjetivoDesenvolvimentoSustentavel>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir ODS', '', 'error');
        return throwError(e);
      })
    );
  }

  public deletarMeta(idOds: number, idMeta: number): Observable<MetaObjetivoDesenvolvimentoSustentavel> {
    return this.http.delete<MetaObjetivoDesenvolvimentoSustentavel>(`${this.urlEndPoint}/${idOds}/metas/${idMeta}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir Meta', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorEixo(idEixo: number): Observable<any> {
    return this.http.get<Array<ObjetivoDesenvolvimentoSustentavel>>(`${this.urlEndPoint}/buscarPorEixo/${idEixo}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os ODS.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarOdsParaPaginaInstitucional(): Observable<ObjetivoDesenvolvimentoSustentavel[]> {
    return this.http.get<ObjetivoDesenvolvimentoSustentavel[]>(`${this.urlEndPoint}/buscarOdsParaPaginaInstitucional`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os ODS.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarOdsParaCombo(): Observable<any> {
    return this.http.get<Array<ItemCombo>>(`${this.urlEndPoint}/buscarOdsParaCombo`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os ODS.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarOdsCombo(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarOdsCombo`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/ods']);
          swal.fire('Erro ao carregar ODS', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarOdsComboComMetas(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarOdsParaComboComMetas`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarPorListaIds(ids: number[]): Observable<any> {
    return this.http.get<Array<ObjetivoDesenvolvimentoSustentavel>>(`${this.urlEndPoint}/buscarPorListaIds?idsOds=${ids}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os ODS.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarMetaOdsPorIdOdsItemCombo(idsOds: number[]): Observable<any> {
    return this.http.get<Array<ObjetivoDesenvolvimentoSustentavel>>(`${this.urlEndPoint}/buscarMetaOdsPorIdOdsItemCombo?idsOds=${idsOds}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar as Metas ODS.', '', 'error');
        return throwError(e);
      })
    );
  }
}
