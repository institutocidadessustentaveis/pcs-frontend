import { Injectable } from '@angular/core';
import { throwError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
// Models Eixo

@Injectable({
  providedIn: 'root'
})

export class IntegracaoService {

  objetoSolucoesBoasPraticas = {"tema":null,"desafio":null,"status":null,"categoria":null,"termo":"","ods":null,"meta":null,"paginate":{"append":false,"lastPage":0,"max":999999,"ordem":"","skip":0}}
  

  constructor(private http: HttpClient, private router: Router) { }

  public consultarBoasPraticasPlataformaCGEE(): Observable<any> {
    return this.http.post(`https://apigef.cgee.org.br/api/gef/v2/observatorio/solucoes`, this.objetoSolucoesBoasPraticas).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao consultar plataforma CGEE', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarCamadasCGEE(): Observable<any> {
    return this.http.get(`https://api-sigweb.cgee.org.br/`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao buscar camadas na plataforma CGEE', msg, 'error');
        return throwError(e);
      })
    );
  }
}
