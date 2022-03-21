import { ArquivoInstitucional } from '../model/arquivo-institucional';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { InstitucionalInterno } from 'src/app/model/institucional-interno';
import { environment } from 'src/environments/environment';
import { Home } from '../model/home';
import { HomeImagem } from '../model/home-imagem';
import { HomeBarra } from '../model/home-barra';
import { PrimeiraSecao } from '../model/primeira-secao';
import { SecaoLateral } from '../model/secao-lateral';
import { QuintaSecao } from '../model/quinta-secao';
import { QuartaSecao } from '../model/quarta-secao';
import { TerceiraSecao } from '../model/terceira-secao';
import { SegundaSecao } from '../model/segunda-secao';
import { SextaSecao } from '../model/sexta-secao';
import { SetimaSecao } from '../model/setima-secao';

@Injectable({
  providedIn: 'root'
})

export class HomeService {
  urlEndPoint: string = `${environment.API_URL}home`;
  constructor(private http: HttpClient, private router: Router) { }



  public buscarPaginaHomePorLink(link: string): Observable<Home> {
    return this.http.get<Home>(`${this.urlEndPoint}/buscarPaginaHomePorLink/${link}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public existePaginaHomeComLink(link: string): Observable<Home> {
    return this.http.get<Home>(`${this.urlEndPoint}/existePaginaHomeComLink/${link}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public inserir(home: Home) {
    return this.http.post(`${this.urlEndPoint}`, home).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar home', msg, 'warning');
        return throwError(e);
      })
    );
  }

  public editar(home: Home) {
    return this.http.put<Home>(`${this.urlEndPoint}/${home.id}`, home).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Home', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluir(id: number): Observable<Home> {
    return this.http.delete<Home>(`${this.urlEndPoint}/excluirPaginaHome/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Página Home', '', 'error');
        return throwError(e);
      })
    );
  }

  public editarHomeBarra(idHome: number, homeBarra: HomeBarra) {
    return this.http.put<HomeBarra>(`${this.urlEndPoint}/editarHomeBarra/${idHome}`, homeBarra).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Barra de Chamadas', "", 'error');
        return throwError(e);
      })
    );
  }

  public editarHomeGaleria(id: number , homeImagem: HomeImagem) {
    return this.http.put<HomeImagem>(`${this.urlEndPoint}/editarHomeGaleria/${id}`, homeImagem).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Galeria', "", 'error');
        return throwError(e);
      })
    );
  }

  public editarPrimeiraSecao(id: number , primeiraSecao: PrimeiraSecao) {
    return this.http.put<PrimeiraSecao>(`${this.urlEndPoint}/editarPrimeiraSecao/${id}`, primeiraSecao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção A', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirPrimeiraSecao(id: number): Observable<PrimeiraSecao> {
    return this.http.delete<PrimeiraSecao>(`${this.urlEndPoint}/excluirPrimeiraSecao/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção A', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPrimeiraSecaoDetalhe(id: number ): Observable<PrimeiraSecao> {
    return this.http.get<PrimeiraSecao>(`${this.urlEndPoint}/buscarPrimeiraSecaoDetalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção A não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public buscarSegundaSecaoDetalhe(id: number ): Observable<SegundaSecao> {
    return this.http.get<SegundaSecao>(`${this.urlEndPoint}/buscarSegundaSecaoDetalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção B não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }


  public editarSegundaSecao(id: number , segundaSecao: SegundaSecao) {
    return this.http.put<SegundaSecao>(`${this.urlEndPoint}/editarSegundaSecao/${id}`, segundaSecao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção B', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirSegundaSecao(id: number): Observable<SegundaSecao> {
    return this.http.delete<SegundaSecao>(`${this.urlEndPoint}/excluirSegundaSecao/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção B', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarTerceiraSecaoDetalhe(id: number ): Observable<TerceiraSecao> {
    return this.http.get<TerceiraSecao>(`${this.urlEndPoint}/buscarTerceiraSecaoDetalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção C não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public editarTerceiraSecao(id: number , terceiraSecao: TerceiraSecao) {
    return this.http.put<TerceiraSecao>(`${this.urlEndPoint}/editarTerceiraSecao/${id}`, terceiraSecao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção C', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirTerceiraSecao(id: number): Observable<TerceiraSecao> {
    return this.http.delete<TerceiraSecao>(`${this.urlEndPoint}/excluirTerceiraSecao/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção C', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarQuartaSecaoDetalhe(id: number ): Observable<QuartaSecao> {
    return this.http.get<QuartaSecao>(`${this.urlEndPoint}/buscarQuartaSecaoDetalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção D não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public editarQuartaSecao(id: number , quartaSecao: QuartaSecao) {
    return this.http.put<QuartaSecao>(`${this.urlEndPoint}/editarQuartaSecao/${id}`, quartaSecao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção D', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirQuartaSecao(id: number): Observable<QuartaSecao> {
    return this.http.delete<QuartaSecao>(`${this.urlEndPoint}/excluirQuartaSecao/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção D', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarQuintaSecaoDetalhe(id: number ): Observable<QuintaSecao> {
    return this.http.get<QuintaSecao>(`${this.urlEndPoint}/buscarQuintaSecaoDetalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção E não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public editarQuintaSecao(id: number , quintaSecao: QuintaSecao) {
    return this.http.put<QuintaSecao>(`${this.urlEndPoint}/editarQuintaSecao/${id}`, quintaSecao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção E', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirQuintaSecao(id: number): Observable<QuintaSecao> {
    return this.http.delete<QuintaSecao>(`${this.urlEndPoint}/excluirQuintaSecao/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção E', '', 'error');
        return throwError(e);
      })
    );
  }

  public excluirSecaoLateral(id: number): Observable<SecaoLateral> {
    return this.http.delete<SecaoLateral>(`${this.urlEndPoint}/excluirSecaoLateral/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção Lateral', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarSecaoLateralDetalhe(id: number ): Observable<SecaoLateral> {
    return this.http.get<SecaoLateral>(`${this.urlEndPoint}/buscarSecaoLateralDetalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção Lateral não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public editarSecaoLateral(id: number , secaoLateral: SecaoLateral) {
    return this.http.put<SecaoLateral>(`${this.urlEndPoint}/editarSecaoLateral/${id}`, secaoLateral).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção Lateral', "", 'error');
        return throwError(e);
      })
    );
  }

  public buscarSextaSecaoDetalhe(id: number ): Observable<TerceiraSecao> {
    return this.http.get<SextaSecao>(`${this.urlEndPoint}/buscarSextaSecaoDetalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção F não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public editarSextaSecao(id: number , sextaSecao: SextaSecao) {
    return this.http.put<SextaSecao>(`${this.urlEndPoint}/editarSextaSecao/${id}`, sextaSecao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção F', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirSextaSecao(id: number): Observable<SextaSecao> {
    return this.http.delete<SextaSecao>(`${this.urlEndPoint}/excluirSextaSecao/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção F', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarSetimaSecaoDetalhe(id: number ): Observable<SetimaSecao> {
    return this.http.get<SetimaSecao>(`${this.urlEndPoint}/buscarSetimaSecaoDetalhe/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Seção G não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public editarSetimaSecao(id: number , setimaSecao: SetimaSecao) {
    return this.http.put<SetimaSecao>(`${this.urlEndPoint}/editarSetimaSecao/${id}`, setimaSecao).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Seção F', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirSetimaSecao(id: number): Observable<SetimaSecao> {
    return this.http.delete<SetimaSecao>(`${this.urlEndPoint}/excluirSetimaSecao/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Seção G', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarHomeParaEdicao(id: number): Observable<Home>{
    return this.http.get<Home>(`${this.urlEndPoint}/buscarParaEdicao/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Institucional', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public excluirHomeImagem(id: number): Observable<HomeImagem> {
    return this.http.delete<HomeImagem>(`${this.urlEndPoint}/excluirHomeImagem/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir imagem', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarIdsPaginaHomePorLink(link: string): Observable<Home> {
    return this.http.get<Home>(`${this.urlEndPoint}/buscarIdsPaginaHomePorLink/${link}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public buscarIdsPaginaHomePorId(id: number): Observable<Home> {
    return this.http.get<Home>(`${this.urlEndPoint}/buscarPaginaHomePorId/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Página não encontrada', '', 'warning');
        }
        return throwError(e);
      })
    );
  }

  public buscarHomeBarraPorId(id: number): Observable<HomeBarra>{
    return this.http.get<HomeBarra>(`${this.urlEndPoint}/buscarHomeBarraPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Barra da Home', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarPrimeiraSecaoPorId(id: number): Observable<PrimeiraSecao[]> {
    return this.http.get<PrimeiraSecao[]>(`${this.urlEndPoint}/buscarPrimeiraSecaoPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Primeira Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaPrimeiraSecaoResumidaPorId(id: number): Observable<PrimeiraSecao[]> {
    return this.http.get<PrimeiraSecao[]>(`${this.urlEndPoint}/buscarListaPrimeiraSecaoResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Primeira Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarSegundaSecaoPorId(id: number): Observable<SegundaSecao[]> {
    return this.http.get<SegundaSecao[]>(`${this.urlEndPoint}/buscarSegundaSecaoPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Segunda Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaSegundaSecaoResumidaPorId(id: number): Observable<SegundaSecao[]> {
    return this.http.get<SegundaSecao[]>(`${this.urlEndPoint}/buscarListaSegundaSecaoResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Segunda Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarTerceiraSecaoPorId(id: number): Observable<TerceiraSecao[]> {
    return this.http.get<TerceiraSecao[]>(`${this.urlEndPoint}/buscarTerceiraSecaoPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Terceira Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaTerceiraSecaoResumidaPorId(id: number): Observable<TerceiraSecao[]> {
    return this.http.get<TerceiraSecao[]>(`${this.urlEndPoint}/buscarListaTerceiraSecaoResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Terceira Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarQuartaSecaoPorId(id: number): Observable<QuartaSecao[]> {
    return this.http.get<QuartaSecao[]>(`${this.urlEndPoint}/buscarQuartaSecaoPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Quarta Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaQuartaSecaoResumidaPorId(id: number): Observable<QuartaSecao[]> {
    return this.http.get<QuartaSecao[]>(`${this.urlEndPoint}/buscarListaQuartaSecaoResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Quarta Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarQuintaSecaoPorId(id: number): Observable<QuintaSecao[]> {
    return this.http.get<QuintaSecao[]>(`${this.urlEndPoint}/buscarQuintaSecaoPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Quinta Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaQuintaSecaoResumidaPorId(id: number): Observable<QuintaSecao[]> {
    return this.http.get<QuintaSecao[]>(`${this.urlEndPoint}/buscarListaQuintaSecaoResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Quinta Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarSecaoLateralPorId(id: number): Observable<SecaoLateral[]>{
    return this.http.get<SecaoLateral[]>(`${this.urlEndPoint}/buscarSecaoLateralPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Seção Lateral', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarSextaSecaoPorId(id: number): Observable<SextaSecao[]> {
    return this.http.get<SextaSecao[]>(`${this.urlEndPoint}/buscarSextaSecaoPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Sexta Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarSetimaSecaoPorId(id: number): Observable<SetimaSecao[]> {
    return this.http.get<SetimaSecao[]>(`${this.urlEndPoint}/buscarSetimaSecaoPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Sstima Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaSecaoLateralResumidaPorId(id: number): Observable<SecaoLateral[]> {
    return this.http.get<SecaoLateral[]>(`${this.urlEndPoint}/buscarListaSecaoLateralResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Seção Lateral', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaSextaSecaoResumidaPorId(id: number): Observable<SextaSecao[]> {
    return this.http.get<TerceiraSecao[]>(`${this.urlEndPoint}/buscarListaSextaSecaoResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Sexta Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaSetimaSecaoResumidaPorId(id: number): Observable<SetimaSecao[]> {
    return this.http.get<SetimaSecao[]>(`${this.urlEndPoint}/buscarListaSetimaSecaoResumidaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Setima Seção', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarListaImagensGaleriaPorId(id: number): Observable<HomeImagem[]>{
    return this.http.get<HomeImagem[]>(`${this.urlEndPoint}/buscarListaImagensGaleriaPorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Imagens galeria', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarTodasSemConteudoPorIdHome(id: number): Observable<HomeImagem[]>{
    return this.http.get<HomeImagem[]>(`${this.urlEndPoint}/buscarTodasSemConteudoPorIdHome/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/']);
          swal.fire('Erro ao carregar Imagens galeria', e.error.message, 'error');
        }
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

    public buscarTodasPaginasHome(): Observable<Home[]> {
      return this.http.get<Home[]>(`${this.urlEndPoint}/buscar`).pipe(
        catchError(e => {
          if (e.status !== 401 && e.error.message){
            this.router.navigate(['/']);
            swal.fire('Página não encontrada', '', 'warning');
          }
          return throwError(e);
        })
      );
    }



}
