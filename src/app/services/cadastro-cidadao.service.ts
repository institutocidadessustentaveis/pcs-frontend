import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Usuario } from '../model/usuario';
import { environment } from 'src/environments/environment';
import { Cidade } from '../model/cidade';
import { UsuarioCadastro } from '../model/usuario_cadastro';

@Injectable({
  providedIn: 'root'
})
export class CadastroCidadaoService {


  private urlEndPoint: string = environment.API_URL;

  constructor(private http: HttpClient, private router: Router) { }


  buscaCidadeInteresse(): Observable<String[]> {
    return this.http.get<String[]>( `${this.urlEndPoint}cidade/signatarias/buscarParaCombo`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades de interesse', '', 'error');
        return throwError(e);
      })
    );
  }

  buscaAreaAtuacoes(): Observable<any[]>{
    return this.http.get<any[]>(this.urlEndPoint + 'areaAtuacao/').pipe(
      catchError(e => {
        swal.fire('Erro ao carregar area atuação', '', 'error');
        return throwError(e);
      })
    );
  }

  buscaIntituicoes(): Observable<any[]> {
    return this.http.get<any[]>(this.urlEndPoint + 'instituicoes/').pipe(
      catchError(e => {
        swal.fire('Erro ao carregar instituições', '', 'error');
        return throwError(e);
      })
    );
  }

  public inserir(usuario: UsuarioCadastro) {
    let params: HttpParams = new HttpParams();
    params = params.append("tokenRecaptcha", usuario.tokenRecaptcha);
    return this.http.post(this.urlEndPoint + 'usuarios/inserircidadao', usuario, { params: params }).pipe(
      catchError(e => {
        swal.fire('Erro ao cadastrar usuário', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

}
