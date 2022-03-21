import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})



export class AddReponsavelService {
  dialogData: any;
  private urlEndPoint = `${environment.API_URL}responsavel`;

  constructor(private http: HttpClient, private router: Router) { }

  buscaPapeis(): Observable<any[]> {
    return this.http.get<any[]>(this.urlEndPoint+'/papeis/').pipe(
      catchError(e => {
        swal.fire('Erro ao carregar papeis', "", 'error');
        return throwError(e);
      })
    );
  }

  public inserarResponsavel(usuario: Usuario) {
    return this.http.post(`${this.urlEndPoint}/inserirResponsavel`, usuario).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar responsavel', msg, 'error');
        return throwError(e);
      })
    );
  }




}
