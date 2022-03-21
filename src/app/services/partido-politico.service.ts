import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Router } from "@angular/router";
import { PartidoPolitico } from "../model/partido-politico";
import { catchError } from "rxjs/operators";
import swal from "sweetalert2";
import { throwError, Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PartidoPoliticoService {
  private urlEndPoint = `${environment.API_URL}partidoPolitico`;
  constructor(private http: HttpClient, private router: Router) {}

  public inserir(partido: PartidoPolitico) {
    return this.http.post(`${this.urlEndPoint}`, partido).pipe(
      catchError(exception => {
        let msg: string = "";
        if (exception.error.errors) {
          msg = exception.error.errors[0].message;
        }
        swal.fire("Erro ao cadastrar o Partido", msg, "error");
        return throwError(exception);
      })
    );
  }

  public buscar(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}`).pipe(
      catchError(exception => {
        swal.fire("Erro ao carregar os Partidos Políticos", "", "error");
        return throwError(exception);
      })
    );
  }

  public editar(partido: PartidoPolitico): Observable<PartidoPolitico> {
    return this.http
      .put<PartidoPolitico>(`${this.urlEndPoint}/${partido.id}`, partido)
      .pipe(
        catchError(exception => {
          swal.fire("Erro ao editar o Partido", "", "error");
          return throwError(exception);
        })
      );
  }

  public deletar(id: number): Observable<PartidoPolitico> {
    return this.http.delete<PartidoPolitico>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(exception => {
        swal.fire("Erro ao excluir o Partido", "", "error");
        return throwError(exception);
      })
    );
  }

  public buscarItemCombo(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscaritemcombo`).pipe(
      catchError(exception => {
        swal.fire("Erro ao carregar os Partidos Políticos", "", "error");
        return throwError(exception);
      })
    );
  }
}
