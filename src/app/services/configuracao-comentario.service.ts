import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ConfiguracaoComentarioService {
  urlEndPoint: string = `${environment.API_URL}configuracaocomentario`;
  constructor(private http: HttpClient, private router: Router) { }

  public buscar() {
    return this.http.get(`${this.urlEndPoint}/tamanhocomentario`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao carregar configurações do comentario', msg, 'error');
        return throwError(e);
      })
    );
  }

  public atualizar(tamanhoComentario: any) {
    return this.http.put(`${this.urlEndPoint}/atualizartamanhocomentario`, tamanhoComentario).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível atualizar o tamanho máximo dos comentários', msg, 'error');
        return throwError(e);
      })
    );
  }

}
