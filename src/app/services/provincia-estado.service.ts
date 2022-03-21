import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ProvinciaEstado } from 'src/app/model/provincia-estado';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class ProvinciaEstadoService {

  private urlEndPoint = `${environment.API_URL}provinciaEstado`;
  estados: any;

  constructor(private http: HttpClient, private router: Router) {}

  public getJSON(): Observable<any> {
      return this.http.get("assets/paises-estado.json").pipe(
        catchError(e => {
          swal.fire('Erro ao carregar arquivo', '', 'error');
          return throwError(e);
        })
      );
  }


  public cadastrarProvinciaEstado(provinciaEstado: ProvinciaEstado) {
    return this.http.post(`${this.urlEndPoint}/inserirProvinciaEstado`, provinciaEstado).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors){
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar Província/estado', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarProvinciasEstados(page: number, linesPerPage: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscar`, {
      params: {
        page: page.toString(),
        linesPerPage: linesPerPage.toString()
      }
    }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Provincia/Estado', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarTodos(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarTodos`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Província/Estado', "", 'error');
        return throwError(e);
      })
    );
  }

  public buscarTodosBrasil(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarTodosBrasil`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Província/Estado', "", 'error');
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


  public buscarIdPorNome(nome: string): Observable<any> {
    return this.http.get<ProvinciaEstado>(`${this.urlEndPoint}/buscarIdPorNome/` + nome).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/provincia-estado']);
          swal.fire('Erro ao carregar cidade', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }


  public buscarProvinciaEstado(id: number): Observable<ProvinciaEstado> {
    return this.http.get<ProvinciaEstado>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if (e.status !== 401 && e.error.message) {
          this.router.navigate(['/provincia-estado']);
          swal.fire('Erro ao carregar cidade', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public editarProvinciaEstado(provinciaEstado: ProvinciaEstado): Observable<ProvinciaEstado>{
    return this.http.put<ProvinciaEstado>(`${this.urlEndPoint}/${provinciaEstado.id}`, provinciaEstado).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Provincia/Estado', '', 'error');
        return throwError(e);
      })
    );
  }

  public deletarProvinciaEstado(id: number): Observable<ProvinciaEstado>{
    return this.http.delete<ProvinciaEstado>(`${this.urlEndPoint}/deletar/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir Provincia/Estado', '', 'error');
        return throwError(e);
      })
    );
  }

  async buscarEstadosNaoCadastradosPorPais(pais: string) {
    await this.getJSON().subscribe((dados) => {
      for (const item in dados.countries) {
        if (dados.countries[item].name  === pais) {
          localStorage.setItem('estados_' + pais, JSON.stringify(dados.countries[item].states));
        }
      }
    });
  }

  public buscarPorPais(idPais: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarPorPais/${idPais}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Província/Estado', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarProvinciaEstadoComboPorPais(idPais: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarPorPaisCombo/${idPais}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Província/Estado', '', 'error');
        return throwError(e);
      })
    );
  }


  public buscarPorPaisAutoComplete(idPais: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.urlEndPoint}/buscarPorPaisAutoComplete/${idPais}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Província/Estado', '', 'error');
        return throwError(e);
      })
    );
  }


  public buscarComboBoxEstado(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarComboBoxEstado`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Província/Estado', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarComboBoxEstadosBrasil(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarComboBoxEstadoBrasil`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Província/Estado', '', 'error');
        return throwError(e);
      })
    );
  }
}
