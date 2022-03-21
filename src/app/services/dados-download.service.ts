import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "src/environments/environment";
import swal from 'sweetalert2';
import { DadosDownload } from "../model/dados-download";
import { DadosDownloadDTO } from "../model/dados-download-dto";
import { PcsUtil } from "./pcs-util.service";

@Injectable({
    providedIn: 'root'
  })
  export class DadosDownloadService {
  
    private urlEndPoint = `${environment.API_URL}dadosDownload`;
  
    constructor(private http: HttpClient,
                private router: Router) { }
  
    public cadastrarDados(dadosDownload: DadosDownload){
        return this.http.post(`${this.urlEndPoint}/cadastrar`, dadosDownload).pipe(
          catchError(e => {
            let msg: string = "";
            if (e.error.errors) {
              msg = e.error.errors[0].message;
            }
            return throwError(e);
          })
        );
    }

    public buscarTodosDadosDownload(): Observable<any> {
      return this.http.get<DadosDownloadDTO>(`${this.urlEndPoint}/buscarTodosDadosDownload`).pipe(
        catchError(e => {
          PcsUtil.swal().fire('Erro ao carregar Dados de Download', '', 'error');
          return throwError(e);
        })
      );
    }

    public buscarComboBoxAcao(): Observable<any> {
      return this.http.get(`${this.urlEndPoint}/buscarComboBoxAcao`).pipe(
        catchError(e => {
          swal.fire('Erro ao carregar Ação', '', 'error');
          return throwError(e);
        })
      );
    }

    public buscarComboBoxPagina(): Observable<any> {
      return this.http.get(`${this.urlEndPoint}/buscarComboBoxPagina`).pipe(
        catchError(e => {
          swal.fire('Erro ao carregar Páginas', '', 'error');
          return throwError(e);
        })
      );
    }

    public buscarComboBoxCidade(): Observable<any> {
      return this.http.get(`${this.urlEndPoint}/buscarComboBoxCidade`).pipe(
        catchError(e => {
          swal.fire('Erro ao carregar Cidades', '', 'error');
          return throwError(e);
        })
      );
    }

  public buscarComPaginacao(page: number, itemsPerPage: number,
    orderBy: string, direction: string): Observable<any> {
    let query = {};

    query['page'] = page;
    query['itemsPerPage'] = itemsPerPage;
    query['orderBy'] = orderBy;
    query['direction'] = direction;

    return this.http.get<any>(`${this.urlEndPoint}/buscarComPaginacao`, { params: query }).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message) {
          this.router.navigate(['/lista-dados-download']);
          swal.fire('Erro ao buscar dados', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

    public searchDadosDownload(relObj: DadosDownloadDTO): Observable<Array<DadosDownloadDTO>> {
      return this.http.post<Array<DadosDownloadDTO>>(`${this.urlEndPoint}/buscarFiltro`,relObj)
        .pipe(
          catchError(e => {
            swal.fire(
              "Erro ao carregar os dados solicitado",
              "",
              "error"
            );
            return throwError(e);
          })
        );
    }
  }