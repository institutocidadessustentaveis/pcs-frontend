import { UsuarioPerfisCidade } from './../model/usuarioPerfisCidade';
import { ItemCombo } from './../model/ItemCombo ';
import { AlterarSenha } from './../model/alterarSenha';
import { Usuario } from './../model/usuario';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { filtroUsuario } from '../model/filtroUsuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private urlEndPoint = `${environment.API_URL}usuarios`;

  constructor(private http: HttpClient, private router: Router) { }



  public alterarSenha(alterarSenha: AlterarSenha) {
    let error: string;
    return this.http.put(`${this.urlEndPoint}/trocarsenha`, alterarSenha).pipe(
      catchError(e => {
        error = e.error.message;
        swal.fire(error, '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarUsuarios(page: number, linesPerPage: number, orderBy: string, direction: string): Observable<any> {
    
    return this.http.get(`${this.urlEndPoint}/buscar`, {
      params: {
        page: page.toString(),
        linesPerPage: linesPerPage.toString(),
        orderBy : orderBy.toString(),
        direction : direction.toString()
      }
    }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar usuários', '', 'error');
        return throwError(e);
      })
    );
  }


  public buscarUsuariosPrefeitura(page: number, linesPerPage: number, orderBy: string, direction: string, nome, uf, cidade, perfil): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarPrefeitura`, {
      params: {
        page: page.toString(),
        linesPerPage: linesPerPage.toString(),
        orderBy : orderBy.toString(),
        direction : direction.toString(),
        'nome': nome ? nome : '',
        'uf' : uf ? uf : '',
        'cidade' : cidade ? cidade : '',
        'perfil' :  (perfil && perfil.length > 0) ? perfil : ''
      }
    }).pipe(
      catchError(e => {
        console.log('Erro ao carregar usuários', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarUsuariosPrefeituraFiltrado(nome, uf, cidade, perfil): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarPrefeituraFiltrada`, {
      params: {
        'nome': nome ? nome : '',
        'uf' : uf ? uf : '',
        'cidade' : cidade ? cidade : '',
        'perfil' :  (perfil && perfil.length > 0) ? perfil : ''
      }
    }).pipe(
      catchError(e => {
        console.log('Erro ao carregar usuários', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarTodos(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarTodos`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar usuários', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarFiltrado(filtrousuario: filtroUsuario): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarFiltrado?nome=${filtrousuario.nome ? filtrousuario.nome : ''}&cidade=${filtrousuario.cidade ? filtrousuario.cidade : ''}&perfil=${filtrousuario.perfil ? filtrousuario.perfil : ''}&organizacao=${filtrousuario.organizacao ? filtrousuario.organizacao : ''}
    `).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar usuários', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/buscar/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/usuarios']);
          swal.fire('Erro ao carregar usuário', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }
  public buscarUsuarioSimples(id: number): Observable<any> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/simples/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarPerfisCidade(id: number): Observable<UsuarioPerfisCidade> {
    return this.http.get<UsuarioPerfisCidade>(`${this.urlEndPoint}/buscarPerfisCidade/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public inserirListaResponsaveis(usuarios: Usuario[]) {
    return this.http.post(`${this.urlEndPoint}/inserirResponsavel`, usuarios).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.message) {
          msg = e.error.message;
        }
        swal.fire('Ação cancelada', msg, 'error');
        return throwError(e);
      })
    );
  }

  public inserirResponsavel(usuario) {
    return this.http.post(`${this.urlEndPoint}/inserirResponsavelSimples`, usuario).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.message) {
          msg = e.error.message;
        }
        swal.fire('Não foi possível salvar o registro', msg, 'error');
        return throwError(e);
      })
    );
  }


  public alterarResponsavel(usuario) {
    return this.http.put(`${this.urlEndPoint}/alterarResponsavelSimples`, usuario).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.message) {
          msg = e.error.message;
        }
        swal.fire('Não foi possível salvar o registro', msg, 'error');
        return throwError(e);
      })
    );
  }

  public inserirGestorPlataforma(usuario: Usuario) {
    return this.http.post(`${this.urlEndPoint}/inserirGestorPlataforma`, usuario).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar usuário Gestor de Desenvolvimento da Plataforma', msg, 'error');
        return throwError(e);
      })
    );
  }

  public inserir(usuario: Usuario) {
    return this.http.post(`${this.urlEndPoint}/inserir`, usuario).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar usuário', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editar(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.urlEndPoint}/editar/${usuario.id}`, usuario).pipe(
      catchError(e => {
        swal.fire('Erro ao editar usuário', '', 'error');
        return throwError(e);
      })
    );
  }

  public editarBloqueioForum(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.urlEndPoint}/editarBloqueadoForum/${usuario.id}`, usuario).pipe(
      catchError(e => {
        swal.fire('Erro ao editar usuário', '', 'error');
        return throwError(e);
      })
    );
  }


  public deletar(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.urlEndPoint}/deletar/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir usuário', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public existe(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.urlEndPoint}/existe/${email}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public esqueciSenha(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.urlEndPoint}/esquecisenha`, email).pipe(
      catchError(e => {
        swal.fire('Erro ao solicitar nova senha', '', 'error');
        return throwError(e);
      })
    );
  }

  public criarNovaSenha(dadosSenha: AlterarSenha) {
    let error: string;
    return this.http.put(`${this.urlEndPoint}/criarNovaSenha`, dadosSenha).pipe(
      catchError(e => {
        error = e.error.message;
        swal.fire(error, '', 'error');
        return throwError(e);
      })
    );
  }

  public cadastrarSenha(dadosSenha: AlterarSenha) {
    let error: string;
    return this.http.put(`${this.urlEndPoint}/cadastrarSenha`, dadosSenha).pipe(
      catchError(e => {
        error = e.error.message;
        swal.fire(error, '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarUsuarioByToken(token: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/buscarPorToken/${token}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          swal.fire('Erro ao carregar usuário', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarPorEmail(email: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/buscarPorEmail/${email}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          swal.fire('Erro ao carregar usuário', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public editarUsuarioLogado(usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.urlEndPoint}/editarUsuarioLogado/${usuario.id}`, usuario).pipe(
      catchError(e => {
        swal.fire('Erro ao editar usuário', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarUsuarioLogado(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlEndPoint}/buscarUsuarioLogado`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/institucional']);
          swal.fire('Erro ao carregar usuário', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarComboBoxUsuario(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarComboBoxUsuario`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar usuário', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarComboBoxUsuarioSemPrefeitura(): Observable<ItemCombo[]> {
    return this.http.get<ItemCombo[]>(`${this.urlEndPoint}/buscarComboBoxUsuarioSemPrefeitura`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar usuário', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarComboBoxUsuarioDePrefeitura(): Observable<ItemCombo[]> {
    return this.http.get<ItemCombo[]>(`${this.urlEndPoint}/buscarComboBoxUsuarioDePrefeitura`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar usuário', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorPerfil(idPerfil: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarPorPerfil/${idPerfil}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          swal.fire('Erro ao carregar usuário', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaUsuariosPorPrefeitura(idPrefeitura: number): Observable<Array<Usuario>> {
    return this.http.get<Array<Usuario>>(`${this.urlEndPoint}/buscarListaUsuariosPorPrefeitura/${idPrefeitura}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          swal.fire('Erro ao carregar usuários', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public criarUsuariosPrefeitos() {
    return this.http.get(`${this.urlEndPoint}/criarUsuariosPrefeitos`).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.message) {
          msg = e.error.message;
        }
        swal.fire('Ação cancelada', msg, 'error');
        return throwError(e);
      })
    );
  }

  public deletarResponsavel(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.urlEndPoint}/deletar-responsavel/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir usuário', e.error.message, 'error');
        return throwError(e);
      })
    );
  }


}
