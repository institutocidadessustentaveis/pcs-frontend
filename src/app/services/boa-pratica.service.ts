import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { BoaPratica } from '../model/boaPratica';
import { Arquivo } from '../model/arquivo';
import { ImagemBoaPratica } from '../model/imagem-boa-pratica';
import { FiltroCidadesComBoasPraticas } from '../model/filtroCidadesComBoasPraticas';
import { BoasPraticasFiltradas } from '../model/boasPraticasFiltradas';
import { BoaPraticaDetalhe } from '../model/boaPraticaDetalhe';
import { ObjetivoDesenvolvimentoSustentavel } from '../model/objetivoDesenvolvimentoSustentavel';
import { Cidade } from '../model/cidade';

@Injectable({
  providedIn: 'root'
})

export class BoaPraticaService {

  private urlEndPoint = `${environment.API_URL}boapratica`;

  constructor(private http: HttpClient, private router: Router) { }

  public inserir(boaPratica: BoaPratica) {
    return this.http.post(`${this.urlEndPoint}/inserir`, boaPratica).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar boa prática', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscar(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscar`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarPorId(id: number): Observable<BoaPratica> {
    return this.http.get<BoaPratica>(`${this.urlEndPoint}/buscar/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/institucional']);
          swal.fire('Erro ao carregar boa prática', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarBoasPraticasPCS(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarBoasPraticasPCS`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarBoasPraticasGeral(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarBoasPraticasGeral`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


  public buscarBoasPraticasPorPrefeitura(idPrefeitura: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarBoasPraticasPorPrefeitura/${idPrefeitura}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public excluirBoaPratica(id: number): Observable<BoaPratica> {
    return this.http.delete<BoaPratica>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir boa prática', '', 'error');
        return throwError(e);
      })
    );
  }

  public editar(boaPratica: BoaPratica) {
    return this.http.put<BoaPratica>(`${this.urlEndPoint}/editar/${boaPratica.id}`, boaPratica).pipe(
      catchError(e => {
        swal.fire('Erro ao editar boa prática', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirFonteReferencia(id: number): Observable<Arquivo> {
    return this.http.delete<Arquivo>(`${this.urlEndPoint}/excluirFonteReferencia/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir fonte de referência', '', 'error');
        return throwError(e);
      })
    );
  }

  public excluirImagemBoaPratica(id: number): Observable<ImagemBoaPratica> {
    return this.http.delete<ImagemBoaPratica>(`${this.urlEndPoint}/excluirImagemBoaPratica/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir imagem', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarBoasPraticasRelacionadasAoIndicador(idIndicador: any): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarBoasPraticasRelacionadasAoIndicador/${idIndicador}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


  public buscarCidadesComBoasPraticas(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarCidadesComBoasPraticas`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarArquivoPorId(id: number): Observable<Arquivo> {
    return this.http.get<Arquivo>(`${this.urlEndPoint}/buscarFonteReferencia/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/institucional']);
          swal.fire('Erro ao baixar arquivo', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarCombosCidadesComBoasPraticas(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarCombosCidadesComBoasPraticas`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarMetabjetivoSustentavelComboBox3Campos(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarMetabjetivoSustentavelComboBox3Campos`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }  

  public buscarBoasPraticasFiltradas(filtroCidadesComBoasPraticas: FiltroCidadesComBoasPraticas): Observable<any> {
    return this.http.post<BoasPraticasFiltradas>(`${this.urlEndPoint}/buscarBoasPraticasFiltradas`,
     filtroCidadesComBoasPraticas ).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarBoasPraticasFiltradasPaginaInicial(filtroCidadesComBoasPraticas: FiltroCidadesComBoasPraticas): Observable<any> {
    return this.http.post<BoasPraticasFiltradas>(`${this.urlEndPoint}/buscarBoasPraticasFiltradasPaginaInicial`,
     filtroCidadesComBoasPraticas ).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarCidadesComBoasPraticasFiltradas(filtroCidadesComBoasPraticas: FiltroCidadesComBoasPraticas): Observable<any> {
    return this.http.post<Array<Cidade>>(`${this.urlEndPoint}/buscarCidadesComBoasPraticasFiltradas`,
     filtroCidadesComBoasPraticas ).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarBoaPrticaDetalhe(id: number): Observable<BoaPraticaDetalhe> {
    return this.http.get<BoaPraticaDetalhe>(`${this.urlEndPoint}/buscarBoaPrticaDetalhe/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/institucional']);
          swal.fire('Erro ao carregar boa prática', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarBoasPraticasDaCidade(page: number, linesPerPage: number, idCidade: number): Observable<any> {
    return this.http.get<BoasPraticasFiltradas>(`${this.urlEndPoint}/buscarBoasPraticasDaCidade?page=${page}&linesPerPage=${linesPerPage ? linesPerPage : ''}&idCidade=${idCidade ? idCidade : ''}`)
    .pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarOdsDaBoaPratica(idBoaPratica: number): Observable<ObjetivoDesenvolvimentoSustentavel[]> {
    return this.http.get<ObjetivoDesenvolvimentoSustentavel[]>(`${this.urlEndPoint}/buscarOdsDaBoaPratica/${idBoaPratica}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os ODS.', '', 'error');
        return throwError(e);
      })
    );
  }
  
  public buscarBoasPraticasRelacionadasAoIndicadorCidade(idIndicador: any): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarBoasPraticasRelacionadasAoIndicadorCidade/${idIndicador}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  public buscarSolucaoImagem(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarSolucaoImagem/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public salvarImagemCorpoBoaPratica(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.API_URL}imagens/upload`, formData).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar imagem', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public apagarImagemCorpoBoaPratica(id: number): Observable<any> {
    return this.http.delete(`${environment.API_URL}imagens/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao apagar imagem', '', 'error');
        return throwError(e);
      })
    );
  }
}


