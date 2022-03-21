import { FiltroVariaveisPorMunicipios } from './../model/filtroVariaveisPorMunicipio';
import { Arquivo } from 'src/app/model/arquivo';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Cidade } from '../model/cidade';
import { ProvinciaEstado } from '../model/provincia-estado';
import { id } from '@swimlane/ngx-charts/release/utils';
import { CidadeDetalhe } from '../model/cidadeDetalhe';
import { FiltroCidadesComBoasPraticas } from '../model/filtroCidadesComBoasPraticas';
import { FiltroIndicadoresPorMunicipios } from '../model/filtroIndicadoresPorMunicipio';

@Injectable({
  providedIn: 'root'
})
export class PlanejamentoIntegradoConsulta {

  private urlEndPoint:string = `${environment.API_URL}planejamentoIntegrado`;

  constructor(private http: HttpClient, private router: Router) {}


  public inserirConsultaBoaPratica(filtroCidadesComBoasPraticas: FiltroCidadesComBoasPraticas) {
    return this.http.post(`${this.urlEndPoint}/inserirConsultaBoaPratica`, filtroCidadesComBoasPraticas).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar consulta boa pratica', msg, 'error');
        return throwError(e);
      })
    );
  }
  
  public buscarConsultasBoaPratica(): Observable<FiltroCidadesComBoasPraticas[]> {
    return this.http.get<FiltroCidadesComBoasPraticas[]>(`${this.urlEndPoint}/buscarConsultasBoaPratica`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os consultas boas práticas.', '', 'error');
        return throwError(e);
      })
    );
  }

  public excluirConsultaBoaPratica(id: number): Observable<FiltroCidadesComBoasPraticas> {
    return this.http.delete<FiltroCidadesComBoasPraticas>(`${this.urlEndPoint}/excluirConsultaBoaPratica/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir consulta boa prática', '', 'error');
        return throwError(e);
      })
    );
  }


  public inserirConsultaVariavel(filtroVariaveisPorMunicipios: FiltroVariaveisPorMunicipios) {
    return this.http.post(`${this.urlEndPoint}/inserirConsultaVariavel`, filtroVariaveisPorMunicipios).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar consulta variável', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarConsultasVariavel(): Observable<FiltroVariaveisPorMunicipios[]> {
    return this.http.get<FiltroVariaveisPorMunicipios[]>(`${this.urlEndPoint}/buscarConsultasVariavel`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os consultas variáveis.', '', 'error');
        return throwError(e);
      })
    );
  }

  public excluirConsultaVariavel(id: number): Observable<FiltroVariaveisPorMunicipios> {
    return this.http.delete<FiltroVariaveisPorMunicipios>(`${this.urlEndPoint}/excluirConsultaVariavel/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir consulta variável', '', 'error');
        return throwError(e);
      })
    );
  }


  public inserirConsultaIndicador(filtroIndicadoresPorMunicipios: FiltroIndicadoresPorMunicipios) {
    return this.http.post(`${this.urlEndPoint}/inserirConsultaIndicador`, filtroIndicadoresPorMunicipios).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar consulta indicador', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarConsultasIndicador(): Observable<FiltroIndicadoresPorMunicipios[]> {
    return this.http.get<FiltroIndicadoresPorMunicipios[]>(`${this.urlEndPoint}/buscarConsultasIndicador`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os consultas indicadores.', '', 'error');
        return throwError(e);
      })
    );
  }

  public excluirConsultaIndicador(id: number): Observable<FiltroIndicadoresPorMunicipios> {
    return this.http.delete<FiltroIndicadoresPorMunicipios>(`${this.urlEndPoint}/excluirConsultaIndicador/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir consulta indicadores', '', 'error');
        return throwError(e);
      })
    );
  }

}
