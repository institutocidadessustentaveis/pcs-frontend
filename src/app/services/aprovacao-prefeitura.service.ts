import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { PedidoAprovacaoPrefeitura } from '../model/pedido-aprovacao-prefeitura';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { PedidoAprovacaoPrefeituraSimples } from 'src/app/model/pedido-aprovacao-prefeitura-simples';
import { FiltroAprovacaoPrefeitura } from '../model/filtroAprovacaoPrefeitura';

@Injectable({
  providedIn: 'root'
})
export class AprovacaoPrefeituraService {

  private urlEndPoint = `${environment.API_URL}aprovacaoPrefeitura`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscar(): Observable<any> {
    return this.http.get<Array<PedidoAprovacaoPrefeitura>>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar pedidos de aprovação de prefeitura.', '', 'error');
        return throwError(e);
      })
    );
  }

  public filtrarAprovacaoPrefeitura(filtroAprovacaoPrefeitura: FiltroAprovacaoPrefeitura) {
    return this.http.post(`${this.urlEndPoint}/filtrarAprovacaoPrefeitura`, filtroAprovacaoPrefeitura).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
          swal.fire('Erro ao filtrar pedidos da prefeitura.', '', 'error');
        }
        return throwError(e);
      })
    );
  }

  public aprovar(pedido: PedidoAprovacaoPrefeitura): Observable<any> {
    return this.http.post<Array<PedidoAprovacaoPrefeitura>>(`${this.urlEndPoint}/aprovar`, pedido ).pipe(
      catchError(e => {
        swal.fire('Erro ao aprovar pedido da prefeitura.', '', 'error');
        return throwError(e);
      })
    );
  }

  public reprovar(id: number, justificativa: string): Observable<any> {
    return this.http.post<Array<PedidoAprovacaoPrefeitura>>(`${this.urlEndPoint}/reprovar/${id}`,
    { "justificativa": justificativa }).pipe(
      catchError(e => {
        swal.fire('Erro ao reprovar pedido da prefeitura.', '', 'error');
        return throwError(e);
      })
    );
  }

  public reenviarEmail(idPrefeitura:Number, listaEmail:string):Observable<any>{
    return this.http.post<boolean>(`${this.urlEndPoint}/reenviaremail/${idPrefeitura}`, listaEmail).pipe(
      catchError(e => {
        swal.fire('Erro ao aprovar reenviar email.', '', 'error');
        return throwError(e);
      })
    );
  }
}
