import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NavItemDetalhe } from '../model/nav-itemDetalhe';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})

export class NavItemService {

  private urlEndPoint = `${environment.API_URL}menuitem`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscar(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscar`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarNavItem(id: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscar/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarNavItemCombos(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscar/Combos`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarTodosNavItemParaCombo(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscar/Todos`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public editar(navItemDetalhe: NavItemDetalhe) {
    return this.http.put<NavItemDetalhe>(`${this.urlEndPoint}/editar/${navItemDetalhe.id}`, navItemDetalhe).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public inserir(navItemDetalhe: NavItemDetalhe) {
    return this.http.post(`${this.urlEndPoint}/inserir`, navItemDetalhe).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public excluir(id: number): Observable<NavItemDetalhe> {
    return this.http.delete<NavItemDetalhe>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir item do menu', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarNavItemPorTipoParaCombo(tipoItem: string): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarNavItemPorTipoParaCombo?tipoItem=${tipoItem}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

}


