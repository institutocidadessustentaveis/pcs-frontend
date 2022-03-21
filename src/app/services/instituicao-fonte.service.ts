import { VariaveisPreenchidas } from 'src/app/model/variaveis-preenchidas';
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

export class InstituicaoFonteService {

  private urlEndPoint = `${environment.API_URL}instituicaofonte`;
  InstituicaoFonte: any;

  constructor(private http: HttpClient, private router: Router) {}

  public buscarComboBoxInstituicaoFonte(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/carregacomboboxinstituicaofonte`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar instituição fonte', '', 'error');
        return throwError(e);
      })
    );
  }

  public inserir(variaveisPreechidas: VariaveisPreenchidas) {
    return this.http.post(`${this.urlEndPoint}/inserirFonte`, variaveisPreechidas).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar instituição da fonte', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editar(variaveisPreechidas: VariaveisPreenchidas) {
    return this.http.put<VariaveisPreenchidas>(`${this.urlEndPoint}`, variaveisPreechidas).pipe(
      catchError(e => {
        swal.fire('Erro ao editar instituicao da fonte', '', 'error');
        return throwError(e);
      })
    );
  }
}
