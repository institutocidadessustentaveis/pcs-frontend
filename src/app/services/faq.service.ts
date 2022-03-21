import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { faq } from '../model/faq';
import { FiltroFaq } from '../model/filtroFaq';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  urlEndPoint: string = `${environment.API_URL}faq`;


  constructor(
    private http: HttpClient,
  ) { }

  public cadastrarFaq(faq: faq){
    return this.http.post(`${this.urlEndPoint}/cadastrar`, faq).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível cadastrar no FAQ', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarFaqFiltrado(palavrasChave: string): Observable<Array<any>> {
    let params: HttpParams = new HttpParams();
    params =  params.append("q", palavrasChave);
    return this.http.get<Array<any>>(`${this.urlEndPoint}/buscarFaqFiltrado`,  { params: params }).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

  public listar(): Observable<any> {
    return this.http.get<faq>(`${this.urlEndPoint}/listar`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarFaqPorId(id: number): Observable<faq> {
    return this.http.get<faq>(`${this.urlEndPoint}/buscarFaqPorId/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


  public editarFaq(faq: faq){
    return this.http.put(`${this.urlEndPoint}/editar`, faq).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível editar o faq', msg, 'error');
        return throwError(e);
      })
    );
  }

  public excluirFaq(id: number): Observable<faq> {
    return this.http.delete<faq>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir o faq', '', 'error');
        return throwError(e);
      })
    );
  }

  public salvarImagemCorpoFaq(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.API_URL}imagens/upload`, formData).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar imagem', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public apagarImagemCorpoFaq(id: number): Observable<any> {
    return this.http.delete(`${environment.API_URL}imagens/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao apagar imagem', '', 'error');
        return throwError(e);
      })
    );
  }
  
}
