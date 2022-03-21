import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { AvaliacaoVariavelDTO } from '../views/modulo_indicadores/avaliacao-variaveis/avaliacao-variaveis-list.component';
import { VariavelReferencia } from '../model/variaveis-referencia';
import { AvaliacaoVariavelPreenchidaDTO } from '../views/modulo_indicadores/avaliacao-variaveis/avaliacao-variaveis.component';
import { VariaveisPreenchidas } from '../model/variaveis-preenchidas';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoVariavelService {

  private urlEndPoint = `${environment.API_URL}avaliacaoVariavel`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscar(): Observable<Array<AvaliacaoVariavelDTO>> {
    return this.http.get<Array<AvaliacaoVariavelDTO>>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar variáveis para avaliação', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarPorIdPrefeitura(idPrefeitura: number): Observable<Array<AvaliacaoVariavelPreenchidaDTO>> {
    return this.http.get<Array<AvaliacaoVariavelPreenchidaDTO>>(`${this.urlEndPoint}/prefeitura/${idPrefeitura}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          swal.fire('Erro ao carregar avaliação da variável', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public atualizarVariavel(variavelPreenchida: VariaveisPreenchidas): Observable<VariaveisPreenchidas> {
    return this.http.put<VariaveisPreenchidas>(`${this.urlEndPoint}/editar/${variavelPreenchida.id}`, variavelPreenchida).pipe(
      catchError(e => {
        let msg: string = '';
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao atualizar avaliação da variável', msg, 'error');
        return throwError(e);
      })
    );
  }
}
