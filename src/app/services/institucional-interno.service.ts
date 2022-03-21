import { ArquivoInstitucional } from './../model/arquivo-institucional';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
// Models InstitucionalInterno
import { InstitucionalInterno } from 'src/app/model/institucional-interno';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class InstitucionalInternoService {
  urlEndPoint: string = `${environment.API_URL}institucional`;
  constructor(private http: HttpClient, private router: Router) { }

  public buscarInstitucional() : Observable<Array<InstitucionalInterno>> {
    return this.http.get<Array<InstitucionalInterno>>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados institucional', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalId(id: number): Observable<InstitucionalInterno>{
    return this.http.get<InstitucionalInterno>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/institucional-interno']);
          swal.fire('Erro ao carregar Institucional', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public salvarImagemCorpoPaginaInstitucional(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.API_URL}imagens/upload`, formData).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar imagem', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public apagarImagemCorpoPaginaInstitucional(id: number): Observable<any> {
    return this.http.delete(`${environment.API_URL}imagens/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao apagar imagem', '', 'error');
        return throwError(e);
      })
    );
  }

  public inserir(institucional: InstitucionalInterno) {
    return this.http.post(`${this.urlEndPoint}`, institucional).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar institucional', msg, 'warning');
        return throwError(e);
      })
    );
  }

  public editar(institucional: InstitucionalInterno) {
    return this.http.put<InstitucionalInterno>(`${this.urlEndPoint}/${institucional.id}`, institucional).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Institucional', "", 'error');
        return throwError(e);
      })
    );
  }

  public deletar(id: number): Observable<InstitucionalInterno> {
    return this.http.delete<InstitucionalInterno>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        swal.fire('A página não foi excluída', e.error.message, 'warning');
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalsParaCombo(): Observable<Array<InstitucionalInterno>> {
    return this.http.get<Array<InstitucionalInterno>>(`${this.urlEndPoint}/buscarInstitucionalsCombo`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Institucionals', '', 'error');
        return throwError(e);
      })
    );
  }

  public deletarArquivo(idInstitucional: number, idArquivo: number): Observable<ArquivoInstitucional> {
    return this.http.delete<ArquivoInstitucional>(`${this.urlEndPoint}/${idInstitucional}/arquivos/${idArquivo}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir Arquivo', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPaginaInstitucionalPorLink(link: string): Observable<InstitucionalInterno> {
    return this.http.get<InstitucionalInterno>(`${this.urlEndPoint}/buscarPaginaInstitucionalPorLink/${link}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/institucional']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public existePaginaInstitucionalComLink(link: string): Observable<InstitucionalInterno> {
    return this.http.get<InstitucionalInterno>(`${this.urlEndPoint}/existePaginaInstitucionalComLink/${link}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/institucional']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public buscarArquivoInstitucionalPorId(id: number): Observable<ArquivoInstitucional>{
    return this.http.get<ArquivoInstitucional>(`${this.urlEndPoint}/buscarArquivoInstitucionalPorId/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/institucional']);
          swal.fire('Erro ao baixar arquivo', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalParaEdicao(id: number): Observable<InstitucionalInterno>{
    return this.http.get<InstitucionalInterno>(`${this.urlEndPoint}/buscarParaEdicao/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/institucional-interno']);
          swal.fire('Erro ao carregar Institucional', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

}
