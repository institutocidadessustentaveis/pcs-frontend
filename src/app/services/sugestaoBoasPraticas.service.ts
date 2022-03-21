import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SugestaoBoasPraticas } from 'src/app/model/sugestaoBoasPraticas';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SugestaoBoasPraticasService {

  private urlEndPoint = `${environment.API_URL}solicitacoesBoasPraticas`;

  constructor(private http: HttpClient, private router: Router) { }

  public inserirSugestaoBoasPraticas(sugestaoBoasPraticas: SugestaoBoasPraticas) {
    let params: HttpParams = new HttpParams();
    params = params.append("tokenRecaptcha", sugestaoBoasPraticas.tokenRecaptcha);
    return this.http.post(`${this.urlEndPoint}/cadastrar`, sugestaoBoasPraticas, { params: params }).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar solicitação de boas práticas', msg, 'error');
        return throwError(e);
      })
    );
  }

  public salvarImagemCorpoSugestaoBoaPratica(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.API_URL}imagens/upload`, formData).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar imagem', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public apagarImagemCorpoSugestaoBoaPratica(id: number): Observable<any> {
    return this.http.delete(`${environment.API_URL}imagens/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao apagar imagem', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarSugestoesBoasPraticas(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarSolicitacoesToList`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar solicitação de boas práticas', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarSugestaoBoasPraticasId(id: number): Observable<SugestaoBoasPraticas>{
    return this.http.get<SugestaoBoasPraticas>(`${this.urlEndPoint}/buscarSolicitacaoPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/versugestaoboaspraticas']);
          swal.fire('Erro ao carregar solicitação de boa prática', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }
}


