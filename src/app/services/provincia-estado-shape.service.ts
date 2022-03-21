import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProvinciaEstadoShape } from '../model/provincia-estado-shape';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { throwError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaEstadoShapeService {

  private urlEndPoint = `${environment.API_URL}shape/estado`;

  constructor(private http: HttpClient) { }

  public buscarPorEstado(idEstado: number): Observable<ProvinciaEstadoShape> {
    return this.http.get<ProvinciaEstadoShape>(`${this.urlEndPoint}/` + idEstado).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os shapes.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorEstados(ids: number[]): Observable<ProvinciaEstadoShape[]> {
    let params = new HttpParams();

    for(let val of ids) {
      params = params.append("id", `${val}`);
    }

    return this.http.get<ProvinciaEstadoShape[]>(`${this.urlEndPoint}/buscarListaShapesPorEstados`, { params: params }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os shapes.', '', 'error');
        return throwError(e);
      })
    );
  }

  public findAll(): Observable<Array<ProvinciaEstadoShape>> {
    return this.http.get<Array<ProvinciaEstadoShape>>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os shapes.', '', 'error');
        return throwError(e);
      })
    );
  }
}
