import { InstitucionalDinamicoImagem } from './../model/institucional-dinamico-imagem';
import { InstitucionalDinamicoSecao1 } from '../model/institucional-dinamico-secao1';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { InstitucionalDinamico } from '../model/institucional-dinamico';
import { InstitucionalDinamicoSecao2 } from '../model/institucional-dinamico-secao2';
import { InstitucionalDinamicoSecao4 } from '../model/institucional-dinamico-secao4';
import { InstitucionalDinamicoSecao3 } from '../model/institucional-dinamico-secao3';
import { InstitucionalDinamicoPublicacao } from '../model/institucional-dinamico-publicacao';

@Injectable({
  providedIn: 'root'
})

export class InstitucionalDinamicoService {
  urlEndPoint: string = `${environment.API_URL}institucionalDinamico`;
  constructor(private http: HttpClient, private router: Router) { }

  //INSTITUCIONAL DINÂMICO
  public buscarTodasPaginasInstitucional(): Observable<InstitucionalDinamico[]> {
    return this.http.get<InstitucionalDinamico[]>(`${this.urlEndPoint}/buscar`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }


  public buscarPaginaInstitucionalDinamicoPorLink(link: string): Observable<InstitucionalDinamico> {
    return this.http.get<InstitucionalDinamico>(`${this.urlEndPoint}/buscarPaginaInstitucionalDinamicoPorLink/${link}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public existeInstitucionalDinamicoComLink(link: string): Observable<InstitucionalDinamico> {
    return this.http.get<InstitucionalDinamico>(`${this.urlEndPoint}/existeInstitucionalDinamicoComLink/${link}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public inserir(institucionalDinamico: InstitucionalDinamico) {
    return this.http.post(`${this.urlEndPoint}`, institucionalDinamico).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar institucional', msg, 'warning');
        return throwError(e);
      })
    );
  }

  public editar(institucionalDinamico: InstitucionalDinamico) {
    return this.http.put<InstitucionalDinamico>(`${this.urlEndPoint}/${institucionalDinamico.id}`, institucionalDinamico).pipe(
      catchError(e => {
        swal.fire('Erro ao editar institucional', "", 'error');
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalDinamicoParaEdicao(id: number): Observable<InstitucionalDinamico>{
    return this.http.get<InstitucionalDinamico>(`${this.urlEndPoint}/buscarParaEdicao/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Institucional', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }


  public buscarIdsInstitucionalDinamicoPorLink(link: string): Observable<InstitucionalDinamico> {
    return this.http.get<InstitucionalDinamico>(`${this.urlEndPoint}/buscarIdsInstitucionalDinamicoPorLink/${link}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public buscarIdsInstitucionalDinamicoPorId(id: number): Observable<InstitucionalDinamico> {
    return this.http.get<InstitucionalDinamico>(`${this.urlEndPoint}/buscarInstitucionalDinamicoPorId/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public excluirInstitucionalDinamico(id: number): Observable<InstitucionalDinamico> {
    return this.http.delete<InstitucionalDinamico>(`${this.urlEndPoint}/excluirInstitucionalDinamico/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir a página', '', 'error');
        return throwError(e);
      })
    );
  }

  public editarIndiceSecao(tipo: string , id: number, indice: number) {
    return this.http.put<null>(`${this.urlEndPoint}/editarIndiceSecao/${tipo}/${id}/${indice}`, null).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Indíce da Seção', "", 'error');
        return throwError(e);
      })
    );
  }

  public editarGaleria(id: number , institucionalDinamicoImagem: InstitucionalDinamicoImagem) {
    return this.http.put<InstitucionalDinamicoImagem>(`${this.urlEndPoint}/editarGaleria/${id}`, institucionalDinamicoImagem).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Galeria', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirImagem(id: number): Observable<InstitucionalDinamicoImagem> {
    return this.http.delete<InstitucionalDinamicoImagem>(`${this.urlEndPoint}/excluirImagem/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir imagem', '', 'error');
        return throwError(e);
      })
    );
  }

  //SECÃO 01
  public editarInstitucionalDinamicoSecao01(id: number , primeiraSecao: InstitucionalDinamicoSecao1) {
    return this.http.put<InstitucionalDinamicoSecao1>(`${this.urlEndPoint}/editarInstitucionalDinamicoSecao01/${id}`, primeiraSecao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção A', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirInstitucionalDinamicoSecao01(id: number): Observable<InstitucionalDinamicoSecao1> {
    return this.http.delete<InstitucionalDinamicoSecao1>(`${this.urlEndPoint}/excluirInstitucionalDinamicoSecao01/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção A', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalDinamicoSecao01Detalhe(id: number ): Observable<InstitucionalDinamicoSecao1> {
    return this.http.get<InstitucionalDinamicoSecao1>(`${this.urlEndPoint}/buscarInstitucionalDinamicoSecao01Detalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção A não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalDinamicoSecao01PorId(id: number): Observable<InstitucionalDinamicoSecao1[]> {
    return this.http.get<InstitucionalDinamicoSecao1[]>(`${this.urlEndPoint}/buscarInstitucionalDinamicoSecao01PorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Seção A', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaInstitucionalDinamicoSecao01ResumidaPorId(id: number): Observable<InstitucionalDinamicoSecao1[]> {
    return this.http.get<InstitucionalDinamicoSecao1[]>(`${this.urlEndPoint}/buscarListaInstitucionalDinamicoSecao01ResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Seção A', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }


  //SECÃO 02
  public editarInstitucionalDinamicoSecao02(id: number , primeiraSecao: InstitucionalDinamicoSecao2) {
    return this.http.put<InstitucionalDinamicoSecao2>(`${this.urlEndPoint}/editarInstitucionalDinamicoSecao02/${id}`, primeiraSecao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção B', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirInstitucionalDinamicoSecao02(id: number): Observable<InstitucionalDinamicoSecao2> {
    return this.http.delete<InstitucionalDinamicoSecao2>(`${this.urlEndPoint}/excluirInstitucionalDinamicoSecao02/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção B', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalDinamicoSecao02Detalhe(id: number ): Observable<InstitucionalDinamicoSecao2> {
    return this.http.get<InstitucionalDinamicoSecao2>(`${this.urlEndPoint}/buscarInstitucionalDinamicoSecao02Detalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção B não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalDinamicoSecao02PorId(id: number): Observable<InstitucionalDinamicoSecao2[]> {
    return this.http.get<InstitucionalDinamicoSecao2[]>(`${this.urlEndPoint}/buscarInstitucionalDinamicoSecao02PorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Seção B', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaInstitucionalDinamicoSecao02ResumidaPorId(id: number): Observable<InstitucionalDinamicoSecao2[]> {
    return this.http.get<InstitucionalDinamicoSecao2[]>(`${this.urlEndPoint}/buscarListaInstitucionalDinamicoSecao02ResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Seção B', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }




  //SECÃO 03
  public editarInstitucionalDinamicoSecao03(id: number , primeiraSecao: InstitucionalDinamicoSecao3) {
    return this.http.put<InstitucionalDinamicoSecao3>(`${this.urlEndPoint}/editarInstitucionalDinamicoSecao03/${id}`, primeiraSecao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção C', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirInstitucionalDinamicoSecao03(id: number): Observable<InstitucionalDinamicoSecao3> {
    return this.http.delete<InstitucionalDinamicoSecao3>(`${this.urlEndPoint}/excluirInstitucionalDinamicoSecao03/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção C', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalDinamicoSecao03Detalhe(id: number ): Observable<InstitucionalDinamicoSecao3> {
    return this.http.get<InstitucionalDinamicoSecao3>(`${this.urlEndPoint}/buscarInstitucionalDinamicoSecao03Detalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção C não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalDinamicoSecao03PorId(id: number): Observable<InstitucionalDinamicoSecao3[]> {
    return this.http.get<InstitucionalDinamicoSecao3[]>(`${this.urlEndPoint}/buscarInstitucionalDinamicoSecao03PorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Seção C', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaInstitucionalDinamicoSecao03ResumidaPorId(id: number): Observable<InstitucionalDinamicoSecao3[]> {
    return this.http.get<InstitucionalDinamicoSecao3[]>(`${this.urlEndPoint}/buscarListaInstitucionalDinamicoSecao03ResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Seção C', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  

  //SECÃO 04
  public editarInstitucionalDinamicoSecao04(id: number , secao: InstitucionalDinamicoSecao4) {
    return this.http.put<InstitucionalDinamicoSecao4>(`${this.urlEndPoint}/editarInstitucionalDinamicoSecao04/${id}`, secao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção D', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirInstitucionalDinamicoSecao04(id: number): Observable<InstitucionalDinamicoSecao4> {
    return this.http.delete<InstitucionalDinamicoSecao4>(`${this.urlEndPoint}/excluirInstitucionalDinamicoSecao04/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção D', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalDinamicoSecao04Detalhe(id: number ): Observable<InstitucionalDinamicoSecao4> {
    return this.http.get<InstitucionalDinamicoSecao4>(`${this.urlEndPoint}/buscarInstitucionalDinamicoSecao04Detalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção D não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public buscarInstitucionalDinamicoSecao04PorId(id: number): Observable<InstitucionalDinamicoSecao4[]> {
    return this.http.get<InstitucionalDinamicoSecao4[]>(`${this.urlEndPoint}/buscarInstitucionalDinamicoSecao04PorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Seção D', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaInstitucionalDinamicoSecao04ResumidaPorId(id: number): Observable<InstitucionalDinamicoSecao4[]> {
    return this.http.get<InstitucionalDinamicoSecao4[]>(`${this.urlEndPoint}/buscarListaInstitucionalDinamicoSecao04ResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Seção D', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  //PUBLICAÇÃO
  public excluirPublicacaoDinamica(id: number): Observable<any> {
    return this.http.delete<any>(`${this.urlEndPoint}/publicacao/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir a publicação', '', 'error');
        return throwError(e);
      })
    );
  }

  public inserirPublicacaoDinamica(publicacao: InstitucionalDinamicoPublicacao) {
    return this.http.post<InstitucionalDinamicoPublicacao>(`${this.urlEndPoint}/publicacao/inserir`, publicacao).pipe(
      catchError(e => {
        swal.fire('Erro ao inserir Publicação', "", 'error');
        return throwError(e);
      })
    );
  }

  public alterarPublicacaoDinamica(publicacao: InstitucionalDinamicoPublicacao) {
    return this.http.put<InstitucionalDinamicoPublicacao>(`${this.urlEndPoint}/publicacao/editar/${publicacao.id}`, publicacao).pipe(
      catchError(e => {
        swal.fire('Erro ao alterar Publicação', "", 'error');
        return throwError(e);
      })
    );
  }

  public alterarOrdemExibicao(id: number, ordem: number) {
    return this.http.put<InstitucionalDinamicoPublicacao>(`${this.urlEndPoint}/publicacao/ordem-exibicao/${id}/${ordem}`, null).pipe(
      catchError(e => {
        swal.fire('Erro ao alterar Publicação', "", 'error');
        return throwError(e);
      })
    );
  }
}
