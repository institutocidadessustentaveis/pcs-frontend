import { Injectable } from '@angular/core';
import { Prefeitura } from '../model/prefeitura';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { throwError, Observable } from 'rxjs';
import { PartidoPolitico } from '../model/partido-politico';
import { PrefeituraEdicao } from '../model/prefeitura-edicao';

@Injectable({
  providedIn: 'root'
})
export class PrefeituraService {

  private urlEndPoint = `${environment.API_URL}prefeitura`;

  constructor(private http: HttpClient, private router: Router) { }

  downloadCartaCompromisso(idCidade: number, numeroArquivo:number ) {
    return this.http.get(`${this.urlEndPoint}/downloadCartaCompromisso/${idCidade}/${numeroArquivo}`, { responseType:'blob', observe: 'response' as 'response'} ).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  public inserir(prefeitura: Prefeitura) {
    return this.http.post(this.urlEndPoint + '/', prefeitura).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.message) {
          msg = e.error.message;
        }
        swal.fire('Ação cancelada', msg, 'error');
        return throwError(e);
      })
    );
  }
  public importar(prefeitura: any) {
    return this.http.post(this.urlEndPoint + '/importarPrefeitura', prefeitura).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.message) {
          msg = e.error.message;
        }
        return throwError(e);
      })
    );
  }

  public editar(prefeitura: PrefeituraEdicao) {
    return this.http.put(`${this.urlEndPoint}`, prefeitura).pipe(
      catchError(e => {
        console.log(e)
        let msg = '';
        if (e.error.message) {
          msg = e.error.message;
        }
        if(e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível editar a prefeitura', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscar(): Observable<any> {
    return this.http.get<Array<Prefeitura>>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar a Prefeitura.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarDetalhesParaAprovacao(id: number): Observable<Prefeitura> {
    return this.http.get<Prefeitura>(`${this.urlEndPoint}/buscarDetalhesParaAprovacao/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar a Prefeitura.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarLogin(id: number): Observable<Prefeitura> {
    return this.http.get<Prefeitura>(`${this.urlEndPoint}/buscarLogin/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar a Prefeitura.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPaisEstadoCidadePorPrefeitura(idPrefeitura: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarPaisEstadoCidadePorPrefeitura/${idPrefeitura}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar a Prefeitura.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPrefeiturasSignatarias() {
    return this.http.get(`${this.urlEndPoint}/buscarPrefeiturasSignatariasVigentes`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadesSignatariasPorEstado(idEstado: number) {
    return this.http.get(`${this.urlEndPoint}/buscarPrefeiturasSignatariasVigentesPorEstado?idEstado=${idEstado}`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarPrefeiturasSignatariasVigentesPorEstadoCidadePartidoPopulacao(idEstado: number, cidade: string,
                                                                    prefeito: string, idPartido: number,
                                                                    populacaoMin: number, populacaoMax: number): Observable<PartidoPolitico[]> {
    const params = {};

    if(idEstado != undefined) {
      params['idEstado'] = `${idEstado}`;
    }

    if(cidade != undefined && cidade != "") {
      params["cidade"] = `${cidade}`
    }

    if(prefeito != undefined && prefeito != "") {
      params["prefeito"] = `${prefeito}`
    }

    if(idPartido != undefined) {
      params["idPartido"] = `${idPartido}`;
    }

    if(populacaoMin != undefined) {
      params["populacaoMin"] = `${populacaoMin}`;
    }

    if(populacaoMax != undefined) {
      params["populacaoMax"] = `${populacaoMax}`;
    }

    return this.http.get<PartidoPolitico[]>(`${this.urlEndPoint}/buscarPrefeiturasSignatariasVigentesPorEstadoCidadePartidoPopulacao`,
                                          {params: params})
            .pipe(catchError(exception => {
              swal.fire('Erro ao buscar cidades', '', 'error');
              return throwError(exception);
              })
            );
  }

  public filtrarPrefeituras(idEstado: number, cidade: string,
                            prefeito: string, idPartido: number): Observable<any[]> {
    const params = {};

    if(idEstado != undefined) {
      params['idEstado'] = `${idEstado}`;
    }

    if(cidade != undefined && cidade != "") {
      params["cidade"] = `${cidade}`
    }

    if(prefeito != undefined && prefeito != "") {
      params["prefeito"] = `${prefeito}`
    }

    if(idPartido != undefined) {
      params["idPartido"] = `${idPartido}`;
    }

    return this.http.get<any[]>(`${this.urlEndPoint}/filtrarPrefeituras`, { params: params})
      .pipe(catchError(exception => {
        swal.fire('Erro ao buscar cidades', '', 'error');
        return throwError(exception);
      }));
  }

  public buscarComboBoxPrefeitura(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarComboBoxPrefeitura`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Prefeitura', '', 'error');
        return throwError(e);
      })
    );
  }

  public listarComPaginacao(page: number, itemsPerPage: number): Observable<any[]> {
    return this.listarComPaginacaoEOrdenacao(page, itemsPerPage, "cidade", "asc");
  }

  public listarComPaginacaoEOrdenacao(page: number, itemsPerPage: number, orderBy: string, direction: string): Observable<any[]> {
    let params: HttpParams = new HttpParams();
    params = params.append("page", page.toString());
    params = params.append("itemsPerPage", itemsPerPage.toString());
    params = params.append("orderBy", orderBy);
    params = params.append("direction", direction);

    return this.http.get<any[]>(`${this.urlEndPoint}/listarComPaginacao`, { params: params }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar prefeituras', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPrefeituraEdicao(id: number) {
    let params: HttpParams = new HttpParams();
    params =  params.append("id", id.toString());

    return this.http.get<any>(`${this.urlEndPoint}/buscarPrefeituraEdicao`, { params: params }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar prefeitura', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPrefeituraPlanoDeMetas(): Observable<any> {
    return this.http.get<Array<Prefeitura>>(`${this.urlEndPoint}/planometasporcidade`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar a Prefeitura.', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadesSignatariasDataMandatos() {
    return this.http.get(`${this.urlEndPoint}/buscarCidadesSignatariasDataMandatos`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadesSignatariasDataMandatosPorIdCidade(idCidade: number) {
    return this.http.get(`${this.urlEndPoint}/buscarCidadesSignatariasDataMandatosPorIdCidade?idCidade=${idCidade}`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarSignatariasComBoasPraticas() {
    return this.http.get(`${this.urlEndPoint}/buscarPrefeiturasSignatariasComBoasPraticas`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public alterarCartaCompromisso(prefeitura: Prefeitura) {
    return this.http.put(`${this.urlEndPoint}/alterarCartaCompromisso`, prefeitura).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.message) {
          msg = e.error.message;
        }
        if(e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível editar a prefeitura', msg, 'error');
        return throwError(e);
      })
    );
  }
}
