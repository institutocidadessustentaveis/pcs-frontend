import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Indicador } from 'src/app/model/indicadores';
import { Variavel } from '../model/variaveis';
import { Eixo } from '../model/eixo';
import { Cidade } from '../model/cidade';
import { ObjetivoDesenvolvimentoSustentavel } from 'src/app/model/objetivoDesenvolvimentoSustentavel';
import { FiltroIndicadores } from '../model/filtroIndicadores';

export interface DropDownList {
  value: number;
  viewValue: string;
}

@Injectable({
  providedIn: 'root'
})

export class IndicadoresService {

  private urlEndPointIndicador: string = `${environment.API_URL}indicador`;
  private urlEndPoint: string = `${environment.API_URL}visualizarindicador`;
  private urlEndPointIndicadorComparativo: string = `${environment.API_URL}buscarindicadorcomparativodecidades`;
  private urlEndPointVariavel: string = `${environment.API_URL}variavel`;
  private urlEndPointEixo: string = `${environment.API_URL}eixo`;
  private urlEndPointOds: string = `${environment.API_URL}ods`;
  private urlEndPointCidade: string = `${environment.API_URL}cidade`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscarIndicador(page: number, itemsPerPage: number, orderBy: string, direction: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('itemsPerPage', itemsPerPage.toString());
    params = params.append('orderBy', orderBy);
    params = params.append('direction', direction);

    return this.http.get(`${this.urlEndPointIndicador}/buscarTodos`, { params: params }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicadores', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadorFiltrado(objFiltro: FiltroIndicadores): Observable<any> {
    return this.http.post<Array<FiltroIndicadores>>(`${this.urlEndPointIndicador}/buscarTodosFiltrados`, objFiltro ).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicadores', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadorId(id: number): Observable<Indicador> {
    return this.http.get<Indicador>(`${this.urlEndPointIndicador}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/indicador']);
          swal.fire('Erro ao carregar indicador', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }
  public buscarIndicadorSimplesId(id: number): Observable<Indicador> {
    return this.http.get<Indicador>(`${this.urlEndPointIndicador}/simples/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
        }
        return throwError(e);
      })
    );
  }

  public buscarIndicadorPorIdJoinMetaOds(idIndicador): Observable<Indicador> {
    return this.http.get<Indicador>(`${this.urlEndPoint}/indicador/${idIndicador}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicador', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadesPorIndicador(id: number): Observable<any> {
    return this.http.get<Cidade>(`${this.urlEndPointIndicadorComparativo}/cidades/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/indicador']);
          swal.fire('Erro ao carregar cidades', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarCidadesPorIndicadorENome(id: number, nome: string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('id', id + "");
    params = params.append('nome', nome);

    return this.http.get<Cidade>(`${this.urlEndPointIndicadorComparativo}/cidades/porNome`, { params: params }).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/indicador']);
          swal.fire('Erro ao carregar cidades', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }


  public inserir(indicador: Indicador) {
    return this.http.post(`${this.urlEndPointIndicador}`, indicador).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar indicador', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editar(indicador: Indicador) {
    return this.http.put<Indicador>(`${this.urlEndPointIndicador}/${indicador.id}`, indicador).pipe(
      catchError(e => {
        swal.fire('Erro ao editar indicador', "", 'error');
        return throwError(e);
      })
    );
  }

  public deletar(id: number): Observable<Indicador> {
    return this.http.delete<Indicador>(`${this.urlEndPointIndicador}/${id}`).pipe(
      catchError(e => {
        if (e.error.message.includes('indicador_preenchido')) {
          swal.fire('Erro ao excluir indicador', "Ainda existem dados vinculados a este indicador, portanto não pode ser apagado.", 'error');
        }
        else{
          swal.fire('Erro ao excluir indicador', "", 'error');
          return throwError(e);
        }
      })
    );
  }

  public carregaOrdemClassificacao(): DropDownList[]{
    let listaOrdemClassificacao: DropDownList[] = new Array<DropDownList>();
    listaOrdemClassificacao.push({ value: 1, viewValue: "Maior valor, melhor" });
    listaOrdemClassificacao.push({ value: 2, viewValue: "Menor valor, melhor" });
    return listaOrdemClassificacao;
  }

  public carregaTipoResultado(): DropDownList[]{
    let listaTipoResultado: DropDownList[] = new Array<DropDownList>();
    listaTipoResultado.push({ value: 1, viewValue: "Único" })
    listaTipoResultado.push({ value: 2, viewValue: "Múltiplo" })
    return listaTipoResultado;
  }

  public carregaVariaveis(): Observable<Array<Variavel>>{
    return this.http.get<Array<Variavel>>(`${this.urlEndPointVariavel}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista de variaveis', '', 'error');
        return throwError(e);
      })
    );
  }

  public carregaTodasVariaveis(): Observable<Array<Variavel>>{
    return this.http.get<Array<Variavel>>(`${this.urlEndPointVariavel}/buscarTodas`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar todas as variaveis', '', 'error');
        return throwError(e);
      })
    );
  }

  public carregaVariaveisAdmin(): Observable<Array<Variavel>>{
    return this.http.get<Array<Variavel>>(`${this.urlEndPointVariavel}/carregaVariaveisAdmin`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar todas as variaveis', '', 'error');
        return throwError(e);
      })
    );
  }


  public carregaVariaveisResponsavelIndicador(idPrefeitura): Observable<Array<Variavel>>{
    return this.http.get<Array<Variavel>>(`${this.urlEndPointVariavel}/buscarPorPrefeitura/${idPrefeitura}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar todas as variaveis', '', 'error');
        return throwError(e);
      })
    );
  }

  public carregaEixo(): Observable<Array<Eixo>>{
    return this.http.get<Array<Eixo>>(`${this.urlEndPointEixo}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista de eixo', '', 'error');
        return throwError(e);
      })
    );
  }

  public carregaOds(): Observable<Array<ObjetivoDesenvolvimentoSustentavel>>{
    return this.http.get<Array<ObjetivoDesenvolvimentoSustentavel>>(`${this.urlEndPointOds}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista de ods', '', 'error');
        return throwError(e);
      })
    );
  }

  public carregaCidade(): Observable<Array<Cidade>>{
    return this.http.get<Array<Cidade>>(`${this.urlEndPointCidade}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista de cidade', '', 'error');
        return throwError(e);
      })
    );
  }

  public carregaCidadeSignataria(): Observable<Array<Cidade>>{
    return this.http.get<Array<Cidade>>(`${this.urlEndPointCidade}/cidadesSignatarias`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar lista de cidade', '', 'error');
        return throwError(e);
      })
    );
  }


  public buscarIndicadoresPcs(): Observable<any> {
    return this.http.get(`${this.urlEndPointIndicador}/buscarIndicadoresPcs`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicadores', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadorPorIdCidade(id: number): Observable<any> {
    return this.http.get(`${this.urlEndPointIndicadorComparativo}/buscarindicadorporcidade/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadorPorIdCidadePorAno(id: number, ano: number): Observable<any> {
    return this.http.get(`${this.urlEndPointIndicadorComparativo}/buscarindicadorporcidadeporano/${id}/${ano}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicadores', e.error.message, 'error');
        return throwError(e);
      })
    );
  }


  public buscarIndicadorItemCombo(): Observable<any> {
    return this.http.get(`${this.urlEndPointIndicador}/buscarItemCombo`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicadores', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadoresPorIdEixoItemCombo(idEixo: number[]): Observable<any> {
    return this.http.get(`${this.urlEndPointIndicador}/buscarIndicadoresPorIdEixoItemCombo?idEixo=${idEixo}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicadores', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadoresPcsParaCombo(): Observable<any> {
    return this.http.get(`${this.urlEndPointIndicador}/buscarIndicadoresPcsParaCombo`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicadores', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarTodosIndicadoresPcsParaComboIndicadorInicial(): Observable<any> {
    return this.http.get(`${this.urlEndPointIndicador}/buscarTodosIndicadoresPcsParaComboIndicadorInicial`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicadores', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadoresParaComboPorPreenchidos(): Observable<any> {
    return this.http.get(`${this.urlEndPointIndicador}/buscarIndicadoresParaComboPorPreenchidos`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicadores', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarIndicadorPorIdOds(id: number): Observable<any> {
    return this.http.get(`${this.urlEndPointIndicador}/buscarIndicadoresPcs/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar indicadores', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public filtrarIndicadoresInicial(idEixo, idOds) {
    return this.http.get<any[]>(`${this.urlEndPointIndicador}/filtrarIndicadoresInicial?idEixo=${idEixo ? idEixo : ''}&idOds=${idOds ? idOds : ''}`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public buscarIndicadoresPcsParaComboPorVariavel(id: number): Observable<any> {
    return this.http.get(`${this.urlEndPointIndicador}/buscarIndicadoresPcsParaComboPorVariavel/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public carregarComboAnosPreenchidosPorIndicador(idIndicador: number): Observable<Array<number>> {
    return this.http.get<Array<number>>(`${this.urlEndPointIndicador}/carregarComboAnosPreenchidosPorIndicador?idIndicador=${idIndicador ? idIndicador : ''}`).pipe(
      catchError(e => {
        console.log('Erro ao carregar dados', '', 'error');
        return throwError(e);
      })
    );
  }

  buscarComboCidade(idCidade){
    return this.http.get<Array<number>>(`${this.urlEndPointIndicador}/cidade/${idCidade}`);
  }
}
