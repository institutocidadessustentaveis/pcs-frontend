import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { IndicadoresPreenchidos } from 'src/app/model/indicadores-preenchidos';
import { IndicadoresPreenchidosDTO } from '../views/modulo_indicadores/preenchimento-indicadores/preenchimento-indicadores.component';
import { IndicadoresPreenchidosStatusDTO } from '../views/modulo_indicadores/indicadores-para-preencher/indicadores-para-preencher.component';
import { ResultadoIndicadorDTO } from '../views/modulo_indicadores/preenchimento-indicadores-resultado/preenchimento-indicadores-resultado.component';
import { IndicadorPreenchidoMapa } from '../model/indicadorPreenchidoMapa';

@Injectable({
  providedIn: 'root'
})

export class IndicadoresPreenchidosService {

  private urlEndPoint: string = `${environment.API_URL}indicador/preenchidos`;

  constructor(private http: HttpClient, private router: Router) { }

  public inserir(indicadorPreenchido: IndicadoresPreenchidos) {
    return this.http.post(`${this.urlEndPoint}`, indicadorPreenchido).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar indicador preenchido', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editar(indicadorPreenchido: IndicadoresPreenchidos) {
    return this.http.put<IndicadoresPreenchidos>(`${this.urlEndPoint}`, indicadorPreenchido).pipe(
      catchError(e => {
        swal.fire('Erro ao editar indicador preenchido', "", 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadoresPreenchidosStatus(ano: Number) {
    return this.http.get<Array<IndicadoresPreenchidosStatusDTO>>(`${this.urlEndPoint}/ano/${ano}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          swal.fire('Erro ao carregar o status do indicador', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }
  public buscarIndicadoresPreenchidosStatusSubdivisao(idSubdivisao:any, ano: Number) {
    return this.http.get<Array<IndicadoresPreenchidosStatusDTO>>(`${this.urlEndPoint}/subdivisao/${idSubdivisao}/${ano}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          swal.fire('Erro ao carregar o status do indicador', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarIndicadorPreenchido(idIndicador: Number) {
    return this.http.get<IndicadoresPreenchidosDTO>(`${this.urlEndPoint}/indicador/${idIndicador}`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao buscar o indicador preenchido', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadorPreenchidoSubdivisao(idIndicador: Number, idSubdivisao) {
    return this.http.get<IndicadoresPreenchidosDTO>(`${this.urlEndPoint}/indicador/${idIndicador}/${idSubdivisao}`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarResultadoIndicadorPorId(id: Number) {
    return this.http.get<ResultadoIndicadorDTO>(`${this.urlEndPoint}/resultado/${id}`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao buscar o resultado do indicador', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarQtIndicadorPreenchidoPorCidade() {
    return this.http.get<any []>(`${this.urlEndPoint}/qtdPreenchidosCidade`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarIndicadoresJaPreenchidos(estado, cidade, populacao, eixo, ods) {
    return this.http.get<any []>(`${this.urlEndPoint}/indicadoresJaPreenchidos?estado=${estado ? estado : '' }
    &cidade=${cidade ? cidade : '' }&populacao=${populacao ? populacao : '' }&eixo=${eixo ? eixo : '' }&ods=${ods ? ods : '' }`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarTodosIndicadoresJaPreenchidos() {
    return this.buscarIndicadoresJaPreenchidos(null, null, null, null, null);
  }

  public buscarPreenchidosTabela(indicador, cidades) {
    return this.http.get<any []>(`${this.urlEndPoint}/tabela/indicadores?indicador=${indicador ? indicador : '' }&cidades=${cidades ? cidades : '' }`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarPreenchidosMapa(indicador, cidades) {
    return this.http.get<any []>(`${this.urlEndPoint}/mapa/indicadores?indicador=${indicador ? indicador : '' }&cidades=${cidades ? cidades : '' }`).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }


  public buscarPreenchidosGrafico(indicador, cidades, formulaidx) {
     return this.http.get<any []>(`${this.urlEndPoint}/grafico/indicadores?indicador=${indicador ? indicador : '' }&cidades=${cidades ? cidades : ''}&formulaidx=${formulaidx}`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarCidadesPreencheram(indicador) {
    return this.http.get<any []>(`${this.urlEndPoint}/cidades?indicador=${indicador ? indicador : '' }`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarPreenchidosTabelaVisualizaIndicador(indicador, estado, cidade, populacao) {
    return this.http.get<any []>(`${this.urlEndPoint}/tabela/indicadoresvisualizaindicador?indicador=${indicador ? indicador : '' }&estado=${estado ? estado : ''}&cidade=${cidade ? cidade : '' }&populacao=${populacao ? populacao : ''}`).pipe (
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarPreenchidosMapaVisualizaIndicador(indicador, estado, cidade, populacao) {
    return this.http.get<any []>(`${this.urlEndPoint}/mapa/indicadoresvisualizaindicador?indicador=${indicador ? indicador : '' }&estado=${estado ? estado : ''}&cidade=${cidade ? cidade : '' }&populacao=${populacao ? populacao : ''}`).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarPreenchidosGraficoVisualizaIndicador(indicador, estado, cidade, populacao, indexFormula) {
    return this.http.get<any []>(`${this.urlEndPoint}/grafico/indicadoresvisualizaindicador?indicador=${indicador ? indicador : '' }&estado=${estado ? estado : ''}&cidade=${cidade ? cidade : ''}&populacao=${populacao ? populacao : ''}&indexFormula=${indexFormula}`).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public filtrarCidadesPaginaInicialIndicadores(idEstado, populacaoMin, populacaoMax, idEixo, idOds) {
    return this.http.get<any []>(`${this.urlEndPoint}/filtrarCidadesPaginaInicialIndicadores?idEstado=${idEstado ? idEstado : '' }&populacaoMin=${populacaoMin ? populacaoMin : '' }&populacaoMax=${populacaoMax ? populacaoMax : '' }&idEixo=${idEixo ? idEixo : '' }&idOds=${idOds ? idOds : '' }`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public filtrarIndicadoresPaginaInicialIndicadores(idEstado, idCidade, populacaoMin, populacaoMax, idEixo, idOds, idIndicador) {
    return this.http.get<any []>(`${this.urlEndPoint}/filtrarIndicadoresPaginaInicialIndicadores?idEstado=${idEstado ? idEstado : '' }&idCidade=${idCidade ? idCidade : '' }&populacaoMin=${populacaoMin ? populacaoMin : '' }&populacaoMax=${populacaoMax ? populacaoMax : '' }&idEixo=${idEixo ? idEixo : '' }&idOds=${idOds ? idOds : '' }&idIndicador=${idIndicador ? idIndicador : '' }`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public filtrarMapaResultadoPaginaInicialIndicadores(idEstado, idCidade, populacaoMin, populacaoMax, idEixo, idOds, idIndicador, anoInicialMandato) {
    return this.http.get<any []>(`${this.urlEndPoint}/filtrarMapaResultadoPaginaInicialIndicadores?idEstado=${idEstado ? idEstado : '' }&idCidade=${idCidade ? idCidade : '' }&populacaoMin=${populacaoMin ? populacaoMin : '' }&populacaoMax=${populacaoMax ? populacaoMax : '' }&idEixo=${idEixo ? idEixo : '' }&idOds=${idOds ? idOds : '' }&idIndicador=${idIndicador ? idIndicador : '' }&anoInicialMandato=${anoInicialMandato ? anoInicialMandato : '' }`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarCidadesPorIndicadorMandato(indicador, cidades, anoInicialMandato) {
    return this.http.get<any []>(`${this.urlEndPoint}/mapa/buscarCidadesPorIndicadorMandato?indicador=${indicador ? indicador : '' }&cidades=${cidades ? cidades : '' }&anoInicialMandato=${anoInicialMandato ? anoInicialMandato : '' }`).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarPreenchidosTabelaComparativoCidades(indicador, cidades) {
    return this.http.get<any []>(`${this.urlEndPoint}/tabela/indicadorescomparativocidades?indicador=${indicador ? indicador : ''}&cidades=${cidades ? cidades : ''}`).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarPreenchidosMapaComparativoCidades(indicador, cidades) {
    return this.http.get<any []>(`${this.urlEndPoint}/mapa/indicadorescomparativocidades?indicador=${indicador ? indicador : ''}&cidades=${cidades ? cidades : ''}`).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarPreenchidosGraficoComparativoCidades(indicador, cidades) {
    return this.http.get<any []>(`${this.urlEndPoint}/grafico/indicadorescomparativocidades?indicador=${indicador ? indicador : ''}&cidades=${cidades ? cidades : ''}`).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarIndicadoresPreenchidosSimples(idIndicador, cidades): Observable<any>{
    if(cidades == null){
      cidades = '';
    }
    return this.http.get<any>(`${this.urlEndPoint}/indicador?idIndicador=${idIndicador}&cidades=${cidades}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }


  public buscarCidadesComIndicadorPreenchido(idIndicador, idEixo, idOds, idCidade, popuMin, popuMax, valorPreenchido, ano, idxFormula, visualizarComoPontos): Observable<Array<IndicadorPreenchidoMapa>> {
    return this.http.get<Array<IndicadorPreenchidoMapa>>(`${this.urlEndPoint}/buscarCidadesComIndicadorPreenchido?idIndicador=${idIndicador ? idIndicador : ''}&idEixo=${idEixo ? idEixo : ''}&idOds=${idOds ? idOds : ''}&idCidade=${idCidade ? idCidade : ''}&popuMin=${popuMin ? popuMin : ''}&popuMax=${popuMax ? popuMax : ''}&valorPreenchido=${valorPreenchido ? valorPreenchido : ''}&ano=${ano ? ano : ''}&formula=${idxFormula != null ? idxFormula : ''}&visualizarComoPontos=${visualizarComoPontos != null ? visualizarComoPontos : ''}`).pipe(
      catchError(e => {
        console.log('Erro ao carregar dados no mapa', '', 'error');
        return throwError(e);
      })
    );
  }

  public recalcularIndicador(idIndicador){
    return this.http.get(`${this.urlEndPoint}/recalcularIndicador?idIndicador=${idIndicador ? idIndicador : ''}`).pipe(
      catchError(e => {
        console.log('Não foi possível recalcular o indicador', '', 'error');
        return throwError(e);
      })
    );
  }

  public inserirSubdivisao(indicadorPreenchido: IndicadoresPreenchidos, idSubdivisao) {
    return this.http.post(`${this.urlEndPoint}/${idSubdivisao}`, indicadorPreenchido).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarPorSubdivisaoIndicador(idIndicador, idSubdivisao) {
    return this.http.get<any []>(`${this.urlEndPoint}/subdivisao/livre/${idIndicador}/${idSubdivisao}`)
  }

  fatorDesigualdade(idIndicador: any, idCidade: any, nivel: any) {
    return this.http.get<any []>(`${this.urlEndPoint}/subdivisao/fator-desigualdade/${idIndicador}/${idCidade}/${nivel}`)
  }
  porNivel(idIndicador: any, idCidade: any, nivel: any, ano: any) {
    return this.http.get<any []>(`${this.urlEndPoint}/subdivisao/nivel/${idIndicador}/${idCidade}/${nivel}/${ano}`)
  }

}


