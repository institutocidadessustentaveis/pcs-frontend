import { AlterarSenha } from '../model/alterarSenha';
import { Usuario } from '../model/usuario';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { DownloadsExportacoes } from '../model/Relatorio/DownloadsExportacoes';

@Injectable({
  providedIn: 'root'
})
export class DownloadsExportacoesService {

  private urlEndPoint = `${environment.API_URL}downloadsexportacoes`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscarComboBoxArquivo(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarComboBoxArquivo`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar Downloads e exportações', '', 'error');
        return throwError(e);
      })
    );
  }

  public gravaLogDownExport(usuarioLogado: string, tipoRelatorio: string) : Observable<DownloadsExportacoes> {
      return this.http.get<DownloadsExportacoes>(`${this.urlEndPoint}/registraLogDownloadsExportacoes/${usuarioLogado}/${tipoRelatorio}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar dados do relatório solicitado', '', 'error');
        return throwError(e);
      })
    );
  }

}
