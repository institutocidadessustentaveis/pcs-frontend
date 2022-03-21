import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Premiacao } from '../model/premiacao';
import { Arquivo } from '../model/arquivo';

@Injectable({
  providedIn: 'root'
})

export class PremiacaoService {

  private urlEndPoint = `${environment.API_URL}premiacao`;

  private urlEndPointPrefeitura = `${environment.API_URL}premiacaoPrefeitura`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscarTodos(page: number, itemsPerPage: number, orderBy: string, direction: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('itemsPerPage', itemsPerPage.toString());

    if(orderBy != undefined) {
      params = params.append('orderBy', orderBy);
    }

    if(direction != undefined) {
      params = params.append('direction', direction);
    }

    return this.http.get(`${this.urlEndPoint}/buscarTodos`, { params: params }).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarPorDescricao(descricao: string): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscar/` + descricao).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public editarPremiacao(premiacao: Premiacao, idBannerPremiacaoRemover: any): Observable<Premiacao> {
    return this.http.put<Premiacao>(`${this.urlEndPoint}/editarPremiacao/${premiacao.id}
                                    /idArquivo/` + idBannerPremiacaoRemover, premiacao).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public inserirPremiacao(premiacao: Premiacao) {
    return this.http.post(`${this.urlEndPoint}/inserirPremiacao`, premiacao).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar premiação', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorId(id: number): Observable<Premiacao> {
    return this.http.get<Premiacao>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar a Premiação.', '', 'error');
        return throwError(e);
      })
    );
  }

  public deletarPremiacao(id: number): Observable<Premiacao> {
    return this.http.delete<Premiacao>(`${this.urlEndPoint}/deletar/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir premiação', '', 'error');
        return throwError(e);
      })
    );
  }

  public participarPremiacao(id: number) {
    return this.http.get(`${this.urlEndPoint}/participarPremiacao/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao participar de premiação', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPremiacoesPorPrefeitura(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarPremiacoesPorPrefeitura`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar premiações', '', 'error');
        return throwError(e);
      })
    );
  }

  public cancelarInscricao(id: number): Observable<Premiacao> {
    return this.http.delete<Premiacao>(`${this.urlEndPoint}/cancelarInscricao/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao cancelar inscrição', '', 'error');
        return throwError(e);
      })
    );
  }


  public verificaParticipacaoPremiacaoEmAvaliacao(): Observable<any> {
    return this.http.get<Premiacao>(`${this.urlEndPoint}/verificaParticipacaoPremiacaoEmAvaliacao`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar a Premiação.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarTodasInscricoesAbertas(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarTodasInscricoesAbertas`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar premiações', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadesInscritas(id: number): Observable<any> {
    return this.http.get(`${this.urlEndPointPrefeitura}/buscarCidadesInscritas/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', '', 'error');
        return throwError(e);
      })
    );
  }



}


