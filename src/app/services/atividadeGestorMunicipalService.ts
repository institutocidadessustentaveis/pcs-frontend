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

export class AtividadeGestorMunicipalService {

  private urlEndPoint = `${environment.API_URL}atividadeGestorMunicipal`;
  atividadeGestorMunicipal: any;

  constructor(private http: HttpClient, private router: Router) {}

  public buscarComboBoxAcao(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarComboBoxAcao`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Provincia/Estado', "", 'error');
        return throwError(e);
      })
    );
  }
}
