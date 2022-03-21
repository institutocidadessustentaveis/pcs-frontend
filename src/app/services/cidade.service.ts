import { Arquivo } from 'src/app/model/arquivo';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import { Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Cidade } from '../model/cidade';
import { ProvinciaEstado } from '../model/provincia-estado';
import { id } from '@swimlane/ngx-charts/release/utils';
import { CidadeDetalhe } from '../model/cidadeDetalhe';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {


  private urlEndPoint = `${environment.API_URL}cidade`;

  constructor(private http: HttpClient, private router: Router) {}

  public carregarDadosIBGE(): Observable<any> {
    return this.http.get('https://servicodados.ibge.gov.br/api/v1/localidades/municipios/').pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados do IBGE', '', 'error');
        return throwError(e);
      })
    );
  }

  public enviarDadosAtualizadosDoIBGE(cidades: any[]): Observable<any> {
    return this.http.put<string>(`${this.urlEndPoint}/atualizarCidadesIBGE`, cidades).pipe(
      catchError(e => {
        swal.fire('Erro ao atualizar cidades de acordo com IBGE', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscar(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarComPaginacao(page: number, itemsPerPage: number, orderBy: string , direction: string): Observable<any> {
    return this.http.get(`${this.urlEndPoint}`, {
      params: {
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString(),
        orderBy : orderBy.toString(),
        direction : direction.toString()
      }
    }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorNome(nome: string, page: number, itemsPerPage: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscar/` + nome, {
      params: {
        page: page.toString(),
        itemsPerPage: itemsPerPage.toString()
      }
    }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', '', 'error');
        return throwError(e);
      })
    );
  }


  public buscarEstadoECidadesPorNome(nomeCidade: string): Observable<any> {
    if (!nomeCidade) {
      nomeCidade = '';
    }
    return this.http.get(`${this.urlEndPoint}/buscarEstadoECidadesPorNome?nomeCidade=${nomeCidade}`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorEstado(estado: ProvinciaEstado): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/porEstadoItemCombo/${estado.id}`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorEstadoPCS(estado): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/porEstadoPCSCombo/${estado}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarCidade(id: number): Observable<Cidade> {
    return this.http.get<Cidade>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/cidade']);
          swal.fire('Erro ao carregar cidade', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarCidadeEdicao(id: number): Observable<Cidade> {
    return this.http.get<Cidade>(`${this.urlEndPoint}/buscarCidadeEdicao/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/cidade']);
          swal.fire('Erro ao carregar cidade', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public calcularNumeroCidadesSignatariasPorEstado(): Observable<Array<Object>> {
    return this.http.get<Array<Object>>(`${this.urlEndPoint}/signatarias/quantidadePorEstado`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/cidade']);
          swal.fire('Erro ao carregar cidade', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public calcularPorcentagemCidadesSignatariasPorEstado(): Observable<Array<Object>> {
    return this.http.get<Array<Object>>(`${this.urlEndPoint}/signatarias/porcentagensPorEstado`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/cidade']);
          swal.fire('Erro ao carregar cidade', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public cadastrar(cidade: Cidade) {
    return this.http.post(`${this.urlEndPoint}`, cidade).pipe(
      catchError(e => {
        let msg = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar cidade', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editar(cidade: Cidade) {
    return this.http.put<any>(`${this.urlEndPoint}/${cidade.id}`, cidade).pipe(
      catchError(e => {
        swal.fire('Erro ao editar cidade', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public deletar(id: number): Observable<Cidade> {
    return this.http.delete<Cidade>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir cidade', '', 'error');
        return throwError(e);
      })
    );
  }

  public atualizarCoordenadas(idCidade, x , y ) {
    let cidade: Cidade = new Cidade();
    cidade.id = idCidade;
    cidade.eixoX = x;
    cidade.eixoY = y;
    return this.http.put(`${this.urlEndPoint}/editarCordenadas`, cidade).pipe(
      catchError(e => {
        swal.fire('Erro ao editar cidade', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorIdEstado(idEstado: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/porEstadoItemCombo/${idEstado}`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorCidadePorIdEstado(idEstado: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/porEstado/${idEstado}`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorCidadePorNomeEstado(nomeEstado: string): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/porEstado/${nomeEstado}`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }


  public buscarCidadeParaEditarViaPrefeitura(id: number): Observable<Cidade> {
    return this.http.get<Cidade>(`${this.urlEndPoint}/buscarParaEditarViaPrefeitura/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/institucional']);
          swal.fire('Erro ao carregar cidade', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }


  public buscarCidadesSignatarias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.urlEndPoint}/buscarCidadesSignatariasComparacaoIndicadores`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadesSignatariasParaCombo(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/signatarias/buscarParaCombo`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarSignatarias(): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(`${this.urlEndPoint}/cidadesSignatarias`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/institucional']);
          swal.fire('Erro ao carregar cidades', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarCidadeParaComboPorIdEstado(idEstado: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/listarComboPorEstado/${idEstado}`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadeParaComboPorListaIdsEstados(idsEstados): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarCidadeParaComboPorListaIdsEstados/?idsEstados=${idsEstados}`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadeComboPorId(id: number): Observable<Cidade> {
    return this.http.get<Cidade>(`${this.urlEndPoint}/buscarCidadeComboPorId/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/cidade']);
          swal.fire('Erro ao carregar cidade', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarCidadeComboBox(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarCidadeComboBox`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarCidadeEstadoComboBox(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarCidadeEstadoComboBox`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar cidades', '', 'error');
        return throwError(e);
      })
    );
  }


  public buscarCidadePorId(idCidade: number): Observable<CidadeDetalhe> {
    return this.http.get<CidadeDetalhe>(`${this.urlEndPoint}/buscarCidadePorId/${idCidade}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/cidade']);
          swal.fire('Erro ao carregar cidade', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public download(id: number): Observable<Arquivo> {
    return this.http.get<Arquivo>(`${this.urlEndPoint}/download/${id}`).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        swal.fire('Não foi possível realizar o download.', msg, 'error');
        return throwError(e);
      })
    );
  }

  buscarPorSiglaCidade(sigla: string, cidade: string) {
    return this.http.get<any>(`${this.urlEndPoint}/buscarPorSiglaCidade?sigla=${sigla}&nome=${cidade}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarSignatariasComboPorIdEstado(idEstado: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarSignatariasComboPorIdEstado/${idEstado}`).pipe(
      catchError(e => {
        swal.fire( '', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

}
