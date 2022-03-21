import { Injectable, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RedeSocialRodapeService {

  private urlEndPoint: string = `${environment.API_URL}redeSocialRodape`;

  @Output() redeSocialChanged: EventEmitter<any[]> = new EventEmitter();

  constructor(private http: HttpClient) { }

  public salvarRedesSociais(redes: any[]) {
    return this.http.put(`${this.urlEndPoint}`, redes).pipe(
      catchError(e => {
        console.log('Erro ao salvar dados das redes sociais do rodapé');
        return throwError(e);
      })
    );
  }

  public buscarRedesSociais() {
    return this.http.get(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        console.log('Erro ao carregar dados das redes sociais do rodapé');
        return throwError(e);
      })
    );
  }

  public buscarRedesSociaisComCache() {
    return this.http.get(`${this.urlEndPoint}/cache`).pipe(
      catchError(e => {
        console.log('Erro ao carregar dados das redes sociais do rodapé');
        return throwError(e);
      })
    );
  }

  public excluirRedeSocial(id: number) {
    return this.http.delete(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        console.log('Erro ao excluir rede social do rodapé');
        return throwError(e);
      })
    );
  }

}
