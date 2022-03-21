import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FormularioAtendimento } from '../model/formulario-atendimento';

@Injectable({
  providedIn: 'root'
})
export class FormularioAtendimentoService {

  private urlEndPoint = `${environment.API_URL}formulario-atendimento`;

  constructor(private http: HttpClient) { }

  public salvar(form: FormularioAtendimento) : Observable<FormularioAtendimento> {
    return this.http.post<any>(`${this.urlEndPoint}/salvar`, form).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          Swal.fire('Erro ao cadastrar sua solicitação', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarTodos() : Observable<Array<FormularioAtendimento>> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarTodosDto`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          Swal.fire('Erro ao buscar solicitações', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }
}
