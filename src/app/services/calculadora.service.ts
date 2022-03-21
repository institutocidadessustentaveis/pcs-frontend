import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CalculadoraService {

  private urlEndPoint = `${environment.API_URL}calculadora`;

  constructor(private http: HttpClient, private router: Router) { }

  public validarFormula(formula: string) {
    return this.http.post(`${this.urlEndPoint}/validar`, { 'formula' : formula}).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        Swal.fire('Erro ao validar fórmula', msg, 'error');
        return throwError(e);
      })
    );
  }
}
