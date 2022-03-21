import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { CombosMaterialApoio } from '../model/combosMaterialApoio';
import { MaterialApoio } from '../model/MaterialApoio';
import { MaterialApoioDetalhado } from '../model/MaterialApoioDetalhado';
import { FiltroMaterialApoio } from '../model/filtroMaterialApoio';

@Injectable({
  providedIn: 'root'
})

export class MaterialApoioService {
  urlEndPoint: string = `${environment.API_URL}materialapoio`;
  constructor(private http: HttpClient, private router: Router) { }

  public carregarCombosMaterialApoio(): Observable<CombosMaterialApoio> {
    return this.http.get<CombosMaterialApoio>(`${this.urlEndPoint}/carregarCombosMaterialApoio`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/planejamento-integrado/material-apoio']);
          console.log('Não foi possível carregar os combos');
        }
        return throwError(e);
      })
    );
  }

  public buscarMaterialDeApoioPorId(idMaterialDeApoio: number): Observable<MaterialApoio> {
    return this.http.get<MaterialApoio>(`${this.urlEndPoint}/buscarMaterialDeApoioPorId/${idMaterialDeApoio}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/planejamento-integrado/material-apoio']);
          console.log('Não foi possível');
        }
        return throwError(e);
      })
    );
  }

  public buscarMaterialDeApoioDetalhadoPorId(idMaterialDeApoio: number): Observable<MaterialApoioDetalhado> {
    return this.http.get<MaterialApoioDetalhado>(`${this.urlEndPoint}/buscarMaterialDeApoioDetalhadoPorId/${idMaterialDeApoio}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/planejamento-integrado/material-apoio']);
          console.log('Não foi possível');
        }
        return throwError(e);
      })
    );
  }

  public buscarMateriaisDeApoio(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarMateriaisDeApoio`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public inserir(materialApoio: MaterialApoio) {
    return this.http.post(`${this.urlEndPoint}/inserir`, materialApoio).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível inserir a publicação', msg, 'error');
        return throwError(e);
      })
    );
  }

  public excluirMaterialApoio(id: number): Observable<MaterialApoio> {
    return this.http.delete<MaterialApoio>(`${this.urlEndPoint}/excluirMaterialApoio/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir o Material de Apoio', '', 'error');
        return throwError(e);
      })
    );
  }

  public editar(materialApoio: MaterialApoio) {
    return this.http.put<MaterialApoio>(`${this.urlEndPoint}/editar`, materialApoio).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Material de Apoio', "", 'error');
        return throwError(e);
      })
    );
  }

  public buscarParaCombo(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarParaCombo`).pipe(
      catchError(e => {
        console.log('Erro ao carregar material de apoio', '', 'error');
        return throwError(e);
      })
    );
  }

  public download(idMaterialApoio: string ) {
    return this.http.get(`${this.urlEndPoint}/download/${idMaterialApoio}`, { responseType:'blob', observe: 'response' as 'response'} ).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarMaterialApoioFiltrado(
    relObj: FiltroMaterialApoio
  ): Observable<Array<FiltroMaterialApoio>> {
    return this.http.get<Array<FiltroMaterialApoio>>(`${this.urlEndPoint}/buscarMaterialApoioFiltrado?idAreaInteresse=${relObj.idAreaInteresse ? relObj.idAreaInteresse : ''}&idEixo=${relObj.idEixo ? relObj.idEixo : ''}&idOds=${relObj.idOds ? relObj.idOds : ''}&idMetasOds=${relObj.idMetasOds ? relObj.idMetasOds : ''}&idIndicador=${relObj.idIndicador ? relObj.idIndicador : ''}&idCidade=${relObj.idCidade ? relObj.idCidade : ''}&idProvinciaEstado=${relObj.idProvinciaEstado ? relObj.idProvinciaEstado : ''}&regiao=${relObj.regiao ? relObj.regiao : ''}&idPais=${relObj.idPais ? relObj.idPais : ''}&continente=${relObj.continente ? relObj.continente : ''}&populacaoMin=${relObj.populacaoMin ? relObj.populacaoMin : ''}&populacaoMax=${relObj.populacaoMax ? relObj.populacaoMax : ''}&palavraChave=${relObj.palavraChave ? relObj.palavraChave : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

}
