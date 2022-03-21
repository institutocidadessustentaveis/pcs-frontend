import { InstanciaOrgao } from './../model/instancia-orgao';
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

export class InstanciaOrgaoService {

  private urlEndPoint = `${environment.API_URL}instanciaorgao`;
  InstanciaOrgao: any;

  constructor(private http: HttpClient, private router: Router) {}

  public buscarComboBoxInstanciaOrgao(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/carregacomboboxinstanciaorgao`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar instância do orgão', '', 'error');
        return throwError(e);
      })
    );
  }
}
