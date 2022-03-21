import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class HistoricoUsoShapesService {

  private urlEndPoint = `${environment.API_URL}historicoUsoShape`;

  constructor(private http: HttpClient, private router: Router) { }

  public filtrarHistoricoUsoShape(query: any): Observable <any[]> {
    if(query == null) return;

    return this.http.get<any>(`${this.urlEndPoint}/filtrar`, { params: query }).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/planejamento-integrado/planejamento-integrado']);
          swal.fire('Erro ao carregar dados do histórico', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarHistoricoUsoShape(page: number, quantity: number,
                                  orderBy: string, direction: string): Observable <any[]> {
    let params = {};

    params['page'] = `${page}`;
    params['itemsPerPage'] = `${quantity}`;

    if (orderBy != undefined) {
      params['orderBy'] = `${orderBy}`;
    }

    if (direction != undefined) {
      params['direction'] = `${direction}`;
    }

    return this.http.get<any[]>(`${this.urlEndPoint}`, { params: params }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados do histórico', '', 'error');
        return throwError(e);
      })
    );
  }
  

}
