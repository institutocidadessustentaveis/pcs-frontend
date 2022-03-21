import { Orgao } from './../model/orgao';
import { InstituicaoFonte } from '../model/instituicao-fonte';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class OrgaoService {

  private urlEndPoint = `${environment.API_URL}orgao`;
  Orgao: any;

  constructor(private http: HttpClient, private router: Router) {}

  public buscarComboBoxOrgao(id: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/carregacomboboxorgao/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar orgão', '', 'error');
        return throwError(e);
      })
    );
  }
}
