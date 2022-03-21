import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Credencial } from '../model/credencial';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _credencial: Credencial;
  private _token: string;
  private _refreshToken: string;
  private _isPrefeitura : boolean;
  private _timestampUltimaRequisicao: number = -1;
  private urlEndPoint: string = environment.API_URL + 'oauth/token';

  constructor(private httpClient: HttpClient) { }

  public get credencial(): Credencial {
    if (this._credencial != null){
      return this._credencial;

    }else if (this._credencial == null && localStorage.getItem('usuarioLogado') != null){
      this._credencial = JSON.parse(localStorage.getItem('usuarioLogado')) as Credencial;
      return this._credencial;
    }
    return new Credencial();
  }

  public get token(): string {
    if (this._token != null){
      return this._token;

    } else if (this._token == null && localStorage.getItem('token') != null){
      this._token = localStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  public get refreshToken(): string {
    if(this._refreshToken != null) {
      return this._refreshToken;
    } else if(this._refreshToken == null && localStorage.getItem('refreshToken') != null) {
      this._refreshToken = localStorage.getItem('refreshToken');
      return this._refreshToken;
    }

    return null;
  }

  public doLogin(credencial: Credencial): Observable<any>{
    const credenciais = btoa('1111');
    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic '+ credenciais});

    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username',credencial.login);
    params.set('password',credencial.senha);

    return this.httpClient.post<any>(this.urlEndPoint, params.toString(), {headers: httpHeaders});
  }

  public doRefresh(refreshToken: string) {
    let params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('refresh_token', refreshToken);

    const credenciais = btoa('111111');
    const headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic '+ credenciais});

    return this.httpClient.post<any>(this.urlEndPoint, params.toString(), { headers: headers })
  }

  public guardarUsuario(accessToken: string): void{
    let payload = this.obterDadosToken(accessToken);
    this._credencial = new Credencial();
    this._credencial.login = payload.user_name;
    this._credencial.roles = payload.authorities;
    this._credencial.nome = payload.nome;
    this._credencial.id = payload.id;
    this._credencial.expiracao = payload.exp;
    localStorage.setItem('usuarioLogado', JSON.stringify(this._credencial));
  }

  public guardarToken(accessToken: string): void{
    this._token = accessToken;
    localStorage.setItem('token', accessToken);
  }

  public guardarRefreshToken(refreshToken: string): void {
    this._refreshToken = refreshToken;
    localStorage.setItem('refreshToken', refreshToken);
  }

  public obterDadosToken(accessToken: string): any{
    if (accessToken != null){
      return JSON.parse(this.b64DecodeUnicode(accessToken.split(".")[1]));
    }
    return null;
  }

  public isAuthenticated(): boolean{
    this._token = localStorage.getItem('token');
    let payload = this.obterDadosToken(this.token);
    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  public logout(): void{
    this.doLogout().subscribe(
      res => {
        this._token = null;
        this._credencial = null;
        this._isPrefeitura = false;
        localStorage.clear();
      }
      , error => {
        this._token = null;
        this._credencial = null;
        this._isPrefeitura = false;
        localStorage.clear();
      }
    );
  }

  public doLogout() {
    const urlEndPoint = environment.API_URL + 'sessao/logout';
    return this.httpClient.get(`${urlEndPoint}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public hasRole(role: string): boolean{
    if (this.credencial.roles && this.credencial.roles.includes(role)) {
      return true;
    }
    return false;
  }

  public hasPerfil(perfil: string): boolean {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    let temPerfil = false;
    if (!usuarioLogado) {
      return false;
    }
    usuarioLogado.listaPerfil.forEach(element => {
      if (element.nome == perfil) {
        temPerfil =  true;
      }
    });
    return temPerfil;
  }

  public b64DecodeUnicode(str) {
    const padding = '='.repeat((4 - str.length % 4) % 4);
    const base64 = (str + padding).replace(/-/g, '+').replace(/_/g, '/');

    return decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  }

  public setUsuarioPrefeitura(){
    if (Boolean(JSON.parse(localStorage.getItem('usuarioLogado')).usuarioPrefeitura) === true) {
      this._isPrefeitura = true;
    }
  }

  public isUsuarioPrefeitura() {
    if ( this._isPrefeitura == null) {
      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      if ( usuarioLogado && usuarioLogado.usuarioPrefeitura) {
        this._isPrefeitura = true;
      } else {
        this._isPrefeitura = false;
      }
    }
    return this._isPrefeitura;
  }

  public getSecondsToSessionExpiration(): number {
    if(this.isAuthenticated()) {
      return this._credencial.expiracao - Math.floor(Date.now() / 1000);
    }

    return -1;
  }

  public registrarRequisicaoUsuario() {
    this._timestampUltimaRequisicao = Math.floor(Date.now() / 1000);
  }

  public getTempoDesdeUltimaRequisicao(): number {
    if(this._timestampUltimaRequisicao == -1) return -1;

    return Math.floor(Date.now() / 1000) - this._timestampUltimaRequisicao ;
  }

  getUsuarioLogado() {
    return localStorage.getItem('usuarioLogado');
  }

}
