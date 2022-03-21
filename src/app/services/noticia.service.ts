import { FiltroNoticiasInicial } from './../model/filtroNoticiasInicial';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { Noticia } from '../model/noticia';
import { NoticiasFiltradas } from '../model/noticiasFiltradas';
import { InformacaoLivre } from '../model/InformacaoLivre';
import { BoletimInformativo } from '../model/boletimInformativo';
import { ItemCombo } from '../model/ItemCombo ';
import { BoletimTemplate01 } from '../model/BoletimTemplate01';

@Injectable({
  providedIn: 'root'
})

export class NoticiaService {
  urlEndPoint: string = `${environment.API_URL}noticia`;
  constructor(private http: HttpClient, private router: Router) { }

  public buscar(): Observable<Array<Noticia>> {
    return this.http.get<Array<Noticia>>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados a notícia', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarNoticiaTituloEId(): Observable<Array<ItemCombo>> {
    return this.http.get<Array<ItemCombo>>(`${this.urlEndPoint}/buscarNoticiaTituloEId`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados a notícia', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarUltimasDezNoticiaTituloEId(): Observable<Array<ItemCombo>> {
    return this.http.get<Array<ItemCombo>>(`${this.urlEndPoint}/buscarUltimasDezNoticiaTituloEId`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados a notícia', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarId(id: number): Observable<Noticia>{
    return this.http.get<Noticia>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/noticia']);
          swal.fire('Erro ao carregar a notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public countNoticias(): Observable<number> {
    return this.http.get<number>(`${this.urlEndPoint}/countNoticias`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Erro ao carregar a notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarIdNoticia(id: number): Observable<Noticia>{
    return this.http.get<Noticia>(`${this.urlEndPoint}/id/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Erro ao carregar a notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarIdNoticiaPublicada(id: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.urlEndPoint}/idPublicada/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Erro ao carregar a notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarTitulo(titulo: string): Observable<Noticia>{
    return this.http.get<Noticia>(`${this.urlEndPoint}/titulo/${titulo}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Erro ao carregar notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarUltimasNoticias(qtd: number): Observable<Noticia> {
    return this.http.get<Noticia>(`${this.urlEndPoint}/ultimasNoticias/${qtd}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarIdNoticiasEventos(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/idNoticiasEventos/`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public inserir(noticia: Noticia) {
    return this.http.post(`${this.urlEndPoint}`, noticia).pipe(
      catchError(e => {
        swal.fire('Erro ao cadastrar a notícia', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public editar(noticia: Noticia) {
    return this.http.put<Noticia>(`${this.urlEndPoint}/${noticia.id}`, noticia).pipe(
      catchError(e => {
        swal.fire('Erro ao editar a notícia', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public deletar(id: number): Observable<Noticia> {
    return this.http.delete<Noticia>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir a notícia', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarNoticia(palavrasChave: string): Observable<Noticia[]> {
    let params: HttpParams = new HttpParams();
    params =  params.append("q", palavrasChave);
    return this.http.get<Noticia[]>(`${this.urlEndPoint}/buscar`, { params: params }).pipe(
      catchError(e => {
        this.router.navigate(['/noticias']);
        swal.fire('Erro ao carregar notícias', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarNoticiaUsandoDataInicioFimPalavraChave(palavrasChave: string, dtInicio: any, dtFim: any): Observable<Noticia[]> {
    let params: HttpParams = new HttpParams();
    if (palavrasChave === null) {
      params =  params.append('q', '');
    } else {
      params =  params.append('q', palavrasChave);
    }
    if (dtInicio === '') {
      params =  params.append('dtInicio', '1989-09-01T14:06:00.000Z');
    } else {
      params =  params.append('dtInicio', dtInicio.toISOString());
    }
    if (dtFim === '') {
      params =  params.append('dtFim', '2099-09-01T14:06:00.000Z');
    } else {
      params =  params.append('dtFim', dtFim.toISOString());
    }
    return this.http.get<Noticia[]>(`${this.urlEndPoint}/buscarNoticiaUsandoDataInicioFimPalavraChave`, { params: params }).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Erro ao carregar notícias', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public salvarBoletimTemplate01(boletim: BoletimTemplate01): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}newsletter/salvarBoletimTemplate01`,  boletim ).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar boletim', '', 'error');
        return throwError(e);
      })
    );
  }

  public deletarBoletim(id: number): Observable<any> {
    return this.http.delete<any>(`${environment.API_URL}newsletter/deletarBoletim/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar boletim', '', 'error');
        return throwError(e);
      })
    );
  }

  public editarBoletimTemplate01(boletim: BoletimTemplate01): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}newsletter/editarBoletimTemplate01`,  boletim ).pipe(
      catchError(e => {
        swal.fire('Erro ao editar boletim', '', 'error');
        return throwError(e);
      })
    );
  }

  public enviarBoletimTemplate01(boletim: BoletimTemplate01): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}newsletter/enviarBoletimTemplate01`,  boletim ).pipe(
      catchError(e => {
        swal.fire('Erro ao enviar boletim', '', 'error');
        return throwError(e);
      })
    );
  }

  public enviarTesteBoletimTemplate01(boletim: BoletimTemplate01, emailTeste: string): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}newsletter/salvarBoletimEnviarTesteTemplate01/${emailTeste}`,  boletim ).pipe(
      catchError(e => {
        swal.fire('Erro ao enviar boletim', '', 'error');
        return throwError(e);
      })
    );
  }

  public enviarBoletimTemplate01PorId(id: number): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}newsletter/enviarBoletimTemplate01PorId`, id ).pipe(
      catchError(e => {
        swal.fire('Erro ao enviar boletim', '', 'error');
        return throwError(e);
      })
    );
  }

  public salvarEnviarBoletimTemplate01(boletim: BoletimTemplate01): Observable<any> {
    return this.http.post<any>(`${environment.API_URL}newsletter/salvarBoletimEnviarTemplate01`,  boletim ).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar e enviar boletim', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarCombosFiltrarNoticias(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarCombosFiltrarNoticias`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Erro ao carregar notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarNoticiasFiltradas(filtroNoticiasInicial: FiltroNoticiasInicial): Observable<any> {
    return this.http.post<NoticiasFiltradas>(`${this.urlEndPoint}/buscarNoticiasFiltradas`,
     filtroNoticiasInicial ).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Erro ao carregar notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarNoticiasDeEventoFiltradas(idsNoticias): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarNoticiasDeEvento`, {
      params: {
        idsNoticias: idsNoticias
      }
    }).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
        }
        return throwError(e);
      })
    );
  }

  public buscarComPaginacao(page: number, itemsPerPage: number, orderBy: string, direction: string): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/paginacao`, {
      params: {
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString(),
        orderBy: orderBy,
        direction: direction
      }
    }).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Erro ao carregar notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarPorUrl(url: string): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/url/${url}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Erro ao carregar notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarPorUrlPublicada(url: string): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/urlPublicada/${url}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Erro ao carregar notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public salvarImagemCorpoNoticia(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${environment.API_URL}imagens/upload`, formData).pipe(
      catchError(e => {
        swal.fire('Erro ao salvar imagem', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public apagarImagemCorpoNoticia(id: number): Observable<any> {
    return this.http.delete(`${environment.API_URL}imagens/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao apagar imagem', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarUltimasNoticiasAgenda(qtd: number): Observable<any> {
    return this.http.get<Noticia>(`${this.urlEndPoint}/ultimasNoticiasAgenda/${qtd}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarUltimasNoticiasPaginaInicial(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarUltimasNoticiasPaginaInicial`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/noticias']);
          swal.fire('Não foi possível carregar a notícia', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }


}
