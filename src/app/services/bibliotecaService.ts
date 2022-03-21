import { FiltroBibliotecaPlanoLeisRegulamentacao } from './../model/FiltroBibliotecaPlanoLeisRegulamentacao';
import { Biblioteca } from './../model/biblioteca';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { BibliotecaDetalhe } from '../model/bibliotecaDetalhe';
import { CombosBiblioteca } from '../model/combosBiblioteca';
import { FiltroBiblioteca } from '../model/filtroBiblioteca';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaService {
  urlEndPoint: string = `${environment.API_URL}biblioteca`;

  constructor(
    private http: HttpClient,
  ) { }

  public cadastrarBiblioteca(biblioteca: Biblioteca){
    return this.http.post(`${this.urlEndPoint}/cadastrar`, biblioteca).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível cadastrar biblioteca', msg, 'error');
        return throwError(e);
      })
    );
  }
  public buscarBibliotecaPorId(id: number): Observable<Biblioteca> {
    return this.http.get<Biblioteca>(`${this.urlEndPoint}/buscarBibliotecaPorId/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  public buscarBibliotecaSimples(id: number): Observable<Biblioteca> {
    return this.http.get<Biblioteca>(`${this.urlEndPoint}/buscarBibliotecaSimples/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarBibliotecaDetalhesPorId(id: number): Observable<BibliotecaDetalhe> {
    return this.http.get<BibliotecaDetalhe>(`${this.urlEndPoint}/buscarBibliotecaDetalhesPorId/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarBibliotecas(idUsuario: number): Observable<any> {
    return this.http.get<Biblioteca>(`${this.urlEndPoint}/buscarBibliotecasToList/${idUsuario}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarBibliotecasParaComboBox(): Observable<any> {
    return this.http.get<Biblioteca>(`${this.urlEndPoint}/buscarBibliotecasParaComboBox`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarBibliotecasToListAdmin(): Observable<any> {
    return this.http.get<Biblioteca>(`${this.urlEndPoint}/buscarBibliotecasToListAdmin`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public idBibliotecasOrdenadas(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/idBibliotecasOrdenadas`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarBibliotecasFiltrado(
    relObj: FiltroBiblioteca
  ): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.urlEndPoint}/buscarBibliotecasFiltrado?idAreaInteresse=${relObj.idAreaInteresse ? relObj.idAreaInteresse : ''}&modulo=${relObj.modulo ? relObj.modulo : ''}&idEixo=${relObj.idEixo ? relObj.idEixo : ''}&idOds=${relObj.idOds ? relObj.idOds : ''}&idMetasOds=${relObj.idMetasOds ? relObj.idMetasOds : ''}&idIndicador=${relObj.idIndicador ? relObj.idIndicador : ''}&idCidade=${relObj.idCidade ? relObj.idCidade : ''}&idProvinciaEstado=${relObj.idProvinciaEstado ? relObj.idProvinciaEstado : ''}&idPais=${relObj.idPais ? relObj.idPais : ''}&palavraChave=${relObj.palavraChave ? relObj.palavraChave : ''}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public editarBiblioteca(biblioteca: Biblioteca) {
    return this.http.put<Biblioteca>(`${this.urlEndPoint}/editar/${biblioteca.id}`, biblioteca).pipe(
      catchError(e => {
        swal.fire('Erro ao editar a Biblioteca', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirBiblioteca(id: number): Observable<Biblioteca> {
    return this.http.delete<Biblioteca>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir biblioteca', '', 'error');
        return throwError(e);
      })
    );
  }

  public carregarCombosBiblioteca(): Observable<any> {
    return this.http.get<CombosBiblioteca>(`${this.urlEndPoint}/carregarCombosBiblioteca`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarBibliotecaPlanoLeisRegulamentacaoFiltrida(
      relObj: FiltroBibliotecaPlanoLeisRegulamentacao
    ): Observable<Array<FiltroBibliotecaPlanoLeisRegulamentacao>> {
      return this.http.get<Array<FiltroBibliotecaPlanoLeisRegulamentacao>>(`${this.urlEndPoint}/buscarBibliotecaPlanoLeisRegulamentacaoFiltrida?idCidade=${relObj.idCidade ? relObj.idCidade : ''}&idProvinciaEstado=${relObj.idProvinciaEstado ? relObj.idProvinciaEstado : ''}&idPais=${relObj.idPais ? relObj.idPais : ''}&idTema=${relObj.idTema ? relObj.idTema : ''}&palavraChave=${relObj.palavraChave ? relObj.palavraChave : ''}`).pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados de biblioteca",
            "",
            "error"
          );
          return throwError(e);
        })
      );
    }
}
