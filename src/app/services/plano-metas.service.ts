import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { PcsUtil } from './pcs-util.service';
import { throwError, Observable } from 'rxjs';
import { PlanoMeta } from '../model/PlanoMetas/plano-meta';
import Swal from 'sweetalert2';
import { PlanoMetaDetalhes } from '../model/PlanoMetas/plano-meta-detalhes';

@Injectable({
  providedIn: 'root'
})
export class PlanoMetasService {

  private urlEndPoint = `${environment.API_URL}planodemetas`;
  constructor(private http: HttpClient, private router: Router) { }

  public download(id: number) {
    return this.http.get(`${this.urlEndPoint}/download/${id}`, { responseType: "blob" }).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Não foi possível realizar o download.', msg, 'error');
        return throwError(e);
      })
    );
  }

  //Se existir o plano de metas, será carregado os dados referente ao plano de metas
  public buscarPlanoDeMetasPorId(idPrefeitura: Number): Observable<PlanoMeta> {
    return this.http.get<PlanoMeta>(`${this.urlEndPoint}/buscarPorPrefeitura/${idPrefeitura}`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Erro para buscar o plano de meta', msg, 'error');
        return throwError(e);
      })
    );
  }

    //Se existir o plano de metas, será carregado os dados referente ao plano de metas
    public buscarPlanoDeMetasPorIdCidade(idCidade: Number): Observable<PlanoMeta> {
      return this.http.get<PlanoMeta>(`${this.urlEndPoint}/buscarPorCidade/${idCidade}`).pipe(
        catchError(e => {
          let msg: string = "";
          if (e.error.message) {
            msg = e.error.message;
          }
          PcsUtil.swal().fire('Erro para buscar o plano de meta', msg, 'error');
          return throwError(e);
        })
      );
    }

  //Será criado um indicador para o plano de metas atual
  public criarPlanoDeMetasDetalhadoParaIndicador(idPlanoDeMetas:Number, idIndicador: Number):Observable<PlanoMetaDetalhes>{
    return this.http.get<PlanoMetaDetalhes>(`${this.urlEndPoint}/criarPlanoDeMetasDetalhadoParaIndicador/${idPlanoDeMetas}/${idIndicador}`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Não foi possível realizar esta ação.', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editarPlanoDeMetasDetalhado(planoMetasDetalhes:PlanoMetaDetalhes, idPlanoMeta:Number):Observable<PlanoMetaDetalhes>{
    return this.http.put<PlanoMetaDetalhes>(`${this.urlEndPoint}/editarPlanoDeMetasDetalhado/${idPlanoMeta}`, planoMetasDetalhes).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Não foi possível realizar esta ação.', msg, 'error');
        return throwError(e);
      })
    );
  }

  public deletarPlanoDeMetasDetalhado(idPlanoDeMetas:Number):Observable<PlanoMetaDetalhes>{
    return this.http.delete<PlanoMetaDetalhes>(`${this.urlEndPoint}/deletarPlanoDeMetasDetalhado/${idPlanoDeMetas}`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Não foi possível realizar esta ação.', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editar(planoMeta:PlanoMeta){
    return this.http.put<PlanoMetaDetalhes>(`${this.urlEndPoint}/editar/${planoMeta.id}`, planoMeta).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Não foi possível realizar esta ação.', msg, 'error');
        return throwError(e);
      })
    );
  }
}
