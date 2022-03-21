import { SubDivisao } from './../model/SubDivisao';
import { ShapeFile } from '../model/shapeFile';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ShapeFileMerged } from '../model/shapeFileMerged';


@Injectable({
  providedIn: 'root'
})

export class ShapeItemService {

  private urlEndPoint = `${environment.API_URL}shapeitens`;

  constructor(private http: HttpClient, private router: Router) { }

  public inserirNovaCamadaShapeFile(shapeFileMerged: ShapeFileMerged): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/inserirNovaCamada`, shapeFileMerged ).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao salvar a camada', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public inserirSubdivisaoShapeFile(subDivisao: SubDivisao): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/inserirSubdivisaoShapeFile`, subDivisao ).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao salvar a subdivisao', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public exportarShapeFile(features: any[]): Observable<any> {
    return this.http.post(`${this.urlEndPoint}/inserir`, features ).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao salvar camada', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public editarPorIdShapeFile(idShapeFile: number, features: any[]) {
    return this.http.put<any>(`${this.urlEndPoint}/editarPorIdShapeFile/${idShapeFile}`, features).pipe(
      catchError(e => {
        swal.fire('Erro ao editar a camada', "", 'error');
        return throwError(e);
      })
    );
  }

  public editarAtributos(idShape: number, atributos: any[]) {
    return this.http.put<any>(`${this.urlEndPoint}/editarAtributos/${idShape}`, atributos).pipe(
      catchError(e => {
        swal.fire('Erro ao editar atributos', "", 'error');
        return throwError(e);
      })
    );
  }

}


