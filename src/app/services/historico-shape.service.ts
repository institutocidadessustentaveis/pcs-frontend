import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HistoricoShapeService {

  private urlEndPoint = `${environment.API_URL}historicoShapes`;

  constructor(public http: HttpClient, private router: Router) { }

  public buscarHistoricoShape(page: number, quantity: number, 
                              orderBy: string, direction: string): Observable<any[]> {
    let params = {};
    params['page'] = `${page}`;
    params['itemsPerPage'] = `${quantity}`;

    if(orderBy != undefined) {
      params['orderBy'] = `${orderBy}`;
    }

    if(direction != undefined) {
      params['direction'] = `${direction}`;
    }

    return this.http.get<any[]>(`${this.urlEndPoint}`, { params: params }).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados do histórico', '', 'error');
        return throwError(e);
      })
    );
  }

  public filtrarHistoricoShape(query: any) {
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

}
