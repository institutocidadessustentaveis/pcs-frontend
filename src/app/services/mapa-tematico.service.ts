import { ShapeFile } from '../model/shapeFile';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ShapeFileMerged } from '../model/shapeFileMerged';
import { MapaTematico } from '../model/mapaTematico';


@Injectable({
  providedIn: 'root'
})

export class MapaTematicoService {

  private urlEndPoint = `${environment.API_URL}mapaTematico`;

  constructor(private http: HttpClient, private router: Router) { }

  public inserirMapaTematico(mapaTematico: MapaTematico): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/inserirMapaTematico`, mapaTematico ).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao salvar mapa temático', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public excluirMapaTematico(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlEndPoint}/excluirMapaTematico/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir mapa temático', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarMapasTematico(idShapeFile: number): Observable<MapaTematico[]> {
    return this.http.get<MapaTematico[]>(`${this.urlEndPoint}/buscarMapasTematico/${idShapeFile}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar as configurações do mapa temático.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarMapaTematicoExibirAuto(idShapeFile: number): Observable<MapaTematico> {
    return this.http.get<MapaTematico>(`${this.urlEndPoint}/buscarMapaTematicoExibirAuto/${idShapeFile}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar as configurações do mapa temático.', '', 'error');
        return throwError(e);
      })
    );
  }

  public editarExibirAuto(id, exibirAuto, shapeId): Observable<any> {
    let _headers = new HttpHeaders();    
    _headers.append('Content-Type', 'application/json;charset=utf-8');    
    return this.http.put(`${this.urlEndPoint}/editarExibirAuto/${id}/${exibirAuto}/${shapeId}`, {headers: _headers}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao editar mapa temático', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public editarExibirLegenda(id, exibirLegenda, shapeId): Observable<any> {
    let _headers = new HttpHeaders();    
    _headers.append('Content-Type', 'application/json;charset=utf-8');    
    return this.http.put(`${this.urlEndPoint}/editarExibirLegenda/${id}/${exibirLegenda}/${shapeId}`, {headers: _headers}).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao editar mapa temático', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

}