import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PcsUtil } from './pcs-util.service';

@Injectable({
  providedIn: 'root'
})
export class FormularioPreenchidoService {

  urlEndPoint: string = `${environment.API_URL}formulario-preenchido`;
  constructor(private http: HttpClient, private router: Router) { }

  public salvar(respostas,link): Observable<any> {
    return this.http.post(`${this.urlEndPoint}?formulario=${link}`, respostas).pipe( );
  }

  public exportarFormularioPreenchido(id): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/exportarFormularioPreenchido/${id}`).pipe( );
  }

  }
