import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Estado } from '../model/PainelIndicadorCidades/estado';
import { Cidade } from '../model/cidade';
import { IndicadoresCidade } from '../model/PainelIndicadorCidades/indicadoresCidade';

@Injectable({
  providedIn: 'root'
})

export class PainelIndicadorCidadeService {

  private urlEndPoint: string = `${environment.API_URL}painel`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscarEstadosSignatarios():Observable<Array<Estado>> {
    return this.http.get<Array<Estado>>(`${this.urlEndPoint}/estados`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista dos estados', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadesSignatarios(idEstado:number):Observable<Array<Cidade>>{
    return this.http.get<Array<Cidade>>(`${this.urlEndPoint}/cidades/estado/${idEstado}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista de cidades', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadesPorIndicador(idIndicador:number):Observable<Array<Cidade>>{
    return this.http.get<Array<Cidade>>(`${this.urlEndPoint}/cidades/indicador/${idIndicador}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista de cidades', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadores(idCidade:number):Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/indicadores/cidade/${idCidade}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar detalhes da cidade', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidade(idCidade:number):Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/indicadores/cidade/${idCidade}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar detalhes da cidade', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarMandatos():Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/mandatos`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarTabelas(idEixo, idCidade, anoInicial, anoFinal):Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/indicadores?idEixo=${idEixo}&idCidade=${idCidade}&anoInicial=${anoInicial}&anoFinal=${anoFinal}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarVariacaoReferencias(idIndicador):Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/variacaoReferencias?idIndicador=${idIndicador}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    )
  }

  public buscarTabelasIndicadoresDaCidade(idCidade, anoInicial, anoFinal):Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/indicadoresDaCidade?idCidade=${idCidade}&anoInicial=${anoInicial}&anoFinal=${anoFinal}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarVariaveis(idIndicador, idCidade, anoInicial, anoFinal,idSubdivisao){
    return this.http.get<any>(`${this.urlEndPoint}/variaveis?idIndicador=${idIndicador}&idCidade=${idCidade}&anoInicial=${anoInicial}&anoFinal=${anoFinal}&idSubdivisao=${idSubdivisao ? idSubdivisao :''}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarCidadesPorNomeComIndicadoresPreenchidos(nome:string):Observable<Array<Cidade>>{
    return this.http.get<Array<Cidade>>(`${this.urlEndPoint}/cidades/${nome}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista de cidades', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarAnosIndicadoresPorPrefeitura(idPrefeitura: number): Observable <number[]> {
    return this.http.get<number[]>(`${this.urlEndPoint}/anos/${idPrefeitura}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista de anos', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadoresPorNomeEstadoCidade(siglaEstado, nomeCidade): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/indicadores/cidade/${siglaEstado}/${nomeCidade}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/indicadores']);
          swal.fire('Erro ao carregar detalhes da cidade', '', 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarIndicadoresPorVariavel(idIndicador){
    return this.http.get<any>(`${this.urlEndPoint}/indicadores/variavel?idVariavel=${idIndicador}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


  public buscarIndicadoresPorNomeVariavel(nomeVariavel): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/variavel/${nomeVariavel}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
}
