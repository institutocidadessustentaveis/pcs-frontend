import { MaterialInstitucional } from './../model/material-institucional';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Arquivo } from '../model/arquivo';

@Injectable({
  providedIn: 'root'
})

export class MaterialInstitucionalService {


  private urlEndPoint = `${environment.API_URL}materialinstitucional`;

  constructor(private http: HttpClient, private router: Router) { }

  public inserir(materialInstitucional: MaterialInstitucional) {
    return this.http.post(`${this.urlEndPoint}/inserir`, materialInstitucional).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar material institucional', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarToList(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarToList`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar material institucional', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorId(id: number): Observable<MaterialInstitucional> {
    return this.http.get<MaterialInstitucional>(`${this.urlEndPoint}/buscar/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/institucional']);
          swal.fire('Erro ao carregar material institucional', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  buscarPorPublicacaoId(id: number): Observable<MaterialInstitucional> {
    return this.http.get<MaterialInstitucional>(`${this.urlEndPoint}/buscarPorPublicacao/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/institucional']);
          console.log('Erro ao carregar material institucional', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public editar(material: MaterialInstitucional) {
    return this.http.put<MaterialInstitucional>(`${this.urlEndPoint}/editar/${material.id}`, material).pipe(
      catchError(e => {
        swal.fire('Erro ao editar material institucional', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirMaterialInstitucional(id: number): Observable<MaterialInstitucional> {
    return this.http.delete<MaterialInstitucional>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir material institucional', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarParaCombo(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarParaCombo`).pipe(
      catchError(e => {
        console.log('Erro ao carregar material institucional', '', 'error');
        return throwError(e);
      })
    );
  }

  public download(idArquivo: number ) {
    return this.http.get(`${this.urlEndPoint}/download/${idArquivo}`, { responseType:'blob', observe: 'response' as 'response'} ).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}


