import { ObservacaoVariavel } from './../model/PainelIndicadorCidades/observacaoVariavel';
import { VariavelPreenchida } from './../views/modulo_indicadores/preenchimento-indicadores/preenchimento-indicadores-variaveis/preenchimento-indicadores-variaveis.component';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
// Models Eixo
import { VariaveisPreenchidas } from 'src/app/model/variaveis-preenchidas';
import { environment } from 'src/environments/environment';
import { VariavelPreenchidaMapa } from '../model/variavelPreenchidaMapa';
import { VariaveisPreenchidasDTO, VariaveisPreenchidasSimplesDTO } from '../views/modulo_indicadores/preenchimento-indicadores/preenchimento-indicadores.component';

@Injectable({
  providedIn: 'root'
})

export class VariavelPreenchidaService {
  urlEndPoint: string = `${environment.API_URL}variavelPreenchida`;
  constructor(private http: HttpClient, private router: Router) { }

  public seriePreenchida(id: any): Observable<any> {
    return this.http.get<VariaveisPreenchidas>(`${this.urlEndPoint}/serie/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  public seriePreenchidaSubdivisao(id: any, subdivisao:any): Observable<any> {
    return this.http.get<VariaveisPreenchidas>(`${this.urlEndPoint}/serie/${id}/${subdivisao}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarVariavelPreenchidalAno(ano: number , idVariavel: number): Observable<VariaveisPreenchidas>{
    return this.http.get<VariaveisPreenchidas>(`${this.urlEndPoint}/buscaPorAnoeCidade/${ano}/${idVariavel}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarVariavelPreenchidalAnoSubdivisao(ano: number , idVariavel: number, subdivisao): Observable<VariaveisPreenchidas>{
    return this.http.get<VariaveisPreenchidas>(`${this.urlEndPoint}/buscaPorAnoCidade/${ano}/${idVariavel}/${subdivisao}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarVariavelPreenchidalId(ano: number, idCidade: number, idVariavel: number): Observable<VariaveisPreenchidas>{
    return this.http.get<VariaveisPreenchidas>(`${this.urlEndPoint}/buscaPorAnoeCidade/${ano}/${idCidade}/${idVariavel}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


  public buscarVariavelPreenchidalIdSubdivisao(ano: number, idCidade: number, idVariavel: number, idSubdivisao:number): Observable<VariaveisPreenchidas>{
    return this.http.get<VariaveisPreenchidas>(`${this.urlEndPoint}/buscaPorAnoCidade/${ano}/${idCidade}/${idVariavel}/${idSubdivisao}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


  public buscarVariaveisParaPreencher(idSubdivisao): Observable<VariaveisPreenchidas>{
    if(idSubdivisao){
      return this.http.get<any>(`${this.urlEndPoint}/${idSubdivisao}`).pipe(
        catchError(e => {
          return throwError(e);
        })
      );
    } else {
      return this.http.get<any>(`${this.urlEndPoint}`).pipe(
        catchError(e => {
          return throwError(e);
        })
      );

    }
  }

  public buscarSerieHistoricaIndicadorCidade(idIndicador, idCidade, anoInicial, anoFinal): Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/serieHistorica?idCidade=${idCidade}&idIndicador=${idIndicador}&anoInicial=${anoInicial}&anoFinal=${anoFinal}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
        }
        return throwError(e);
      })
    );
  }

  public buscarVariaveisPreenchidas(idVariavel, cidades): Observable<any>{
    if(cidades == null){
      cidades = '';
    }
    return this.http.get<any>(`${this.urlEndPoint}/variavel?idVariavel=${idVariavel}&cidades=${cidades}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public carregarComboAnosPreenchidos(): Observable<Array<number>> {
    return this.http.get<Array<number>>(`${this.urlEndPoint}/carregarComboAnosPreenchidos`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public carregarComboAnosPreenchidosPorVariavel(idVariavel: number): Observable<Array<number>> {
    return this.http.get<Array<number>>(`${this.urlEndPoint}/carregarComboAnosPreenchidosPorVariavel?idVariavel=${idVariavel ? idVariavel : ''}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarCidadesComVariavelPreenchida(idVariavelSelecionada: number, valorPreenchido: string, anoSelecionado: number, visualizarComoPontos: boolean): Observable<Array<VariavelPreenchidaMapa>> {
    return this.http.get<Array<VariavelPreenchidaMapa>>(`${this.urlEndPoint}/buscarCidadesComVariavelPreenchida?idVariavel=${idVariavelSelecionada ? idVariavelSelecionada : ''}&valorPreenchido=${valorPreenchido ? valorPreenchido : ''}&anoSelecionado=${anoSelecionado ? anoSelecionado : ''}&visualizarComoPontos=${visualizarComoPontos}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarObservacaoVariavel(idIndicador: number, idCidade: number): Observable<ObservacaoVariavel[]> {
    return this.http.get<ObservacaoVariavel[]>(`${this.urlEndPoint}/buscarObservacaoVariavel?idIndicador=${idIndicador ? idIndicador : ''}&idCidade=${idCidade ? idCidade : ''}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public listarPorIndicadorAndCidade(idIndicador: number, idCidade: number): Observable<VariaveisPreenchidasSimplesDTO[]> {
    return this.http.get<VariaveisPreenchidasSimplesDTO[]>(`${this.urlEndPoint}/listarPorIndicadorAndCidade?idIndicador=${idIndicador ? idIndicador : ''}&idCidade=${idCidade ? idCidade : ''}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }
  
  public listarPorIndicadorAndCidadeAndSubdivisao(idIndicador: number, idCidade: number, idSubdivisao: number): Observable<VariaveisPreenchidasSimplesDTO[]> {
    return this.http.get<VariaveisPreenchidasSimplesDTO[]>(`${this.urlEndPoint}/listarPorIndicadorCidadeSubdivisao?idIndicador=${idIndicador ? idIndicador : ''}&idCidade=${idCidade ? idCidade : ''}&idSubdivisao=${idSubdivisao ? idSubdivisao : ''}`).pipe(
      catchError(e => {
        console.log('Erro ao carregar dados no mapa', '', 'error');
        return throwError(e);
      })
    );
  }


  public deletar(id): Observable<any> {
    return this.http.delete(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        console.log('Erro ao tentar excluir esse registro');
        return throwError(e);
      })
    );
  }
  
  public preencher(variavelPreenchidaDTO: any) {
    return this.http.post(`${this.urlEndPoint}`, variavelPreenchidaDTO).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }



}
