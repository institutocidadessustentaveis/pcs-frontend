import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { VisualizarIndicador } from '../model/visualizarIndicador';

@Injectable({
  providedIn: 'root'
})

export class VisualizarIndicadorService {
  urlEndPoint: string = `${environment.API_URL}visualizarindicador`;
  constructor(private http: HttpClient, private router: Router) { }

  public buscarIndicadorPorId(idIndicador): Observable<VisualizarIndicador> {
    return this.http.get<VisualizarIndicador>(`${this.urlEndPoint}/indicador/${idIndicador}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados do indicador', '', 'error');
        return throwError(e);
      })
    );
  }

}
