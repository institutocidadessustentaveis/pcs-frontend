import { SubDivisao } from 'src/app/model/SubDivisao';
import { ShapeFile } from './../model/shapeFile';
import { Cidade } from 'src/app/model/cidade';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { PcsUtil } from './pcs-util.service';
import { ObjetivoDesenvolvimentoSustentavel } from '../model/objetivoDesenvolvimentoSustentavel';
import { ShapefileDetalheDTO } from '../model/shapefileDetalheDTO';

@Injectable({
  providedIn: 'root'
})

export class ShapeFileService {

  private urlEndPoint = `${environment.API_URL}shapefile`;

  constructor(private http: HttpClient, private router: Router) { }

  public buscarShapeFiles(): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/buscarTodosDto`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarShapeFilePorId(id: number): Observable<ShapeFile> {
    return this.http.get<ShapeFile>(`${this.urlEndPoint}/buscarShapeFilePorId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao carregar shapefile', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarShapeFilePorIdValidacao(id: number): Observable<ShapeFile> {
    return this.http.get<ShapeFile>(`${this.urlEndPoint}/buscarShapeFilePorIdValidacao/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao carregar shapefile', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarShapeFileIdPorSubdivisaoId(idSubdivisao: number): Observable<number> {
    return this.http.get<number>(`${this.urlEndPoint}/buscarShapeFileIdPorSubdivisaoId/${idSubdivisao}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao carregar shapefile', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public filtrarShape(query: any): Observable<any> {
    if(query == null) return;

    return this.http.get<any>(`${this.urlEndPoint}/filtrar`, { params: query }).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/planejamento-integrado/planejamento-integrado']);
          swal.fire('Erro ao buscar shapes', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public filtrarPorPalavraChave(query: any): Observable<any> {
    if(query == null) return;

    return this.http.get<any>(`${this.urlEndPoint}/filtrarPorPalavraChave`, { params: query }).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao buscar shapes', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarComPaginacao(page: number, itemsPerPage: number,
                            orderBy: string, direction: string): Observable<any> {
    let query = {};

    query['page'] = page;
    query['itemsPerPage'] =  itemsPerPage;
    query['orderBy'] = orderBy;
    query['direction'] = direction;

    return this.http.get<any>(`${this.urlEndPoint}/buscarComPaginacao`, { params: query }).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/planejamento-integrado/planejamento-integrado']);
          swal.fire('Erro ao buscar shapes', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public salvarVetorial(shapeFile: ShapeFile, arquivoShp: File,arquivoDbf: File, arquivoShx: File ) {

    const formDataShp = new FormData();
    formDataShp.append('arquivoShp', arquivoShp);
    formDataShp.append('arquivoDbf', arquivoDbf);
    formDataShp.append('arquivoShx', arquivoShx);
    formDataShp.append('shapefile', JSON.stringify(shapeFile).toString());

    return this.http.post(`${this.urlEndPoint}/inserir`, formDataShp).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public salvarVetorialSubDivisao(subDivisao: SubDivisao, arquivoZip: File ) {

    const formDataShp = new FormData();
    formDataShp.append('arquivoZip', arquivoZip);
    formDataShp.append('subDivisao', JSON.stringify(subDivisao).toString());

    return this.http.post(`${this.urlEndPoint}/inserirSubdivisao`, formDataShp).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }
  
  public salvarKml(shapeFile: ShapeFile, arquivoKml: File) {

    const formDataShp = new FormData();
    formDataShp.append('arquivoKml', arquivoKml);
    formDataShp.append('shapefile', JSON.stringify(shapeFile).toString());

    return this.http.post(`${this.urlEndPoint}/inserirKml`, formDataShp).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }
  

  public editarShape(arquivoShp: File,arquivoDbf: File, arquivoShx: File, cidade: Cidade ) {

    const formDataShp = new FormData();
    formDataShp.append('arquivoShp', arquivoShp);
    formDataShp.append('arquivoDbf', arquivoDbf);
    formDataShp.append('arquivoShx', arquivoShx);
    formDataShp.append('cidadeDTO', cidade.id.toString());

    return this.http.post(`${this.urlEndPoint}/editarArquivosShape`, formDataShp).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        return throwError(e);
      })
    );
  }

  public excluirShapeFilePorId(id: number): Observable<ShapeFile> {
    return this.http.delete<ShapeFile>(`${this.urlEndPoint}/excluirShapeFilePorId/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao excluir shapefile', '', 'error');
        return throwError(e);
      })
    );
  }

  public salvarRaster(shapeFile: ShapeFile, arquivoTiff: File ) {
    const formDataShp = new FormData();
    formDataShp.append('arquivoTiff', arquivoTiff);
    formDataShp.append('shapefile', JSON.stringify(shapeFile).toString());

    return this.http.post(`${this.urlEndPoint}/inserirRaster`, formDataShp).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Erro ao cadastrar shapefile', msg, 'error');
        return throwError(e);
      })
    );
  }

  public publicar(id: number) {
    return this.http.put<any>(`${this.urlEndPoint}/publicar/${id}`, {}).pipe(
      catchError(e => {
        console.log('Não foi possível editar shapefile', "", 'error');
        return throwError(e);
      })
    );
  }

  public exportarShapeFile(features: any[], nome): Observable<any> {
    if (nome) {
      nome = nome + ' - municipios';
    }
    return this.http.post(`${this.urlEndPoint}/exportarShapeFile?nome=${nome}`, features, { responseType:"blob"} ).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/planejamento-integrado/planejamento-integrado']);
          swal.fire('Erro ao buscar shapes', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public exportarShapeFileCidades(idsCidadesBoasPraticas: any[]): Observable<any> {

    return this.http.post(`${this.urlEndPoint}/exportarShapeFileCidades`, idsCidadesBoasPraticas, { responseType:"blob"} ).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/planejamento-integrado/planejamento-integrado']);
          swal.fire('Erro ao buscar shapes', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarShapesListagemMapa() {
    return this.http.get<any>(`${this.urlEndPoint}/buscarShapesListagemMapa`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/planejamento-integrado/planejamento-integrado']);
          swal.fire('Erro ao buscar shapes', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public mesclarAtributos(dadosMesclagem) {
    return this.http.post(`${this.urlEndPoint}/mesclarAtributos`, dadosMesclagem).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Ocorreu um erro ao mesclar os atributos', e.error.message, 'error');
		}
        return throwError(e);
      })
    );
  }

  public buscarFeaturesPorShapeId(id: number) {
    return this.http.get<any>(`${environment.API_URL}shapeitens/buscarFeaturesPorShapeId/${id}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          this.router.navigate(['/planejamento-integrado/planejamento-integrado']);
          swal.fire('Erro ao buscar shapes', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public downloadAtributos(id: number) {
    return this.http.get(`${this.urlEndPoint}/downloadAtributos/${id}` , {responseType: 'blob'} ).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Não foi possível realizar esta ação.', msg, 'error');
        return throwError(e);
      })
    );
  }

  public editarCamposShapeFile(shapeFile: ShapeFile ) {
    return this.http.post(`${this.urlEndPoint}/editarShapeFile`, shapeFile).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.error) {
          msg = e.error.message;
        }
        swal.fire('Erro ao cadastrar shapefile', msg, 'error');
        return throwError(e);
      })
    );
  }

  public downloadShapeFile(id: number, extensao: string) {
    return this.http.get(`${this.urlEndPoint}/downloadShapeFile/${id}.${extensao}`, {responseType: 'blob'} ).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Não foi possível realizar esta ação.', msg, 'error');
        return throwError(e);
      })
    );
  }

  public buscarFileNameShapeFilePorId(idShapeFile: number): Observable<ShapeFile> {
    return this.http.get<ShapeFile>(`${this.urlEndPoint}/buscarFileNameShapeFilePorId/${idShapeFile}`).pipe(
      catchError(e => {
        if (e.status != 401 && e.error.message){
          swal.fire('Erro ao buscar nome de arquivo', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  
  public buscarShapeFileVisualizarDetalheDTOPorIdShapeFile(idShapeFile): Observable<any>{
    return this.http.get<ShapefileDetalheDTO>(`${this.urlEndPoint}/buscarShapeFileVisualizarDetalheDTOPorIdShapeFile/${idShapeFile}` ).pipe(
      catchError(e => {
        PcsUtil.swal().fire('Erro ao carregar ShapeFile', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarOdsDoShapeFileId(idShapeFile: number): Observable<ObjetivoDesenvolvimentoSustentavel[]> {
    return this.http.get<ObjetivoDesenvolvimentoSustentavel[]>(`${this.urlEndPoint}/buscarOdsDoShapeFileId/${idShapeFile}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os ODS.', '', 'error');
        return throwError(e);
      })
    );
  }

  public downloadShapeFileCGEE(nome: string) {
    return this.http.get(`${this.urlEndPoint}/downloadShapeFileCGEE/${nome}.shp`, {responseType: 'blob'} ).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Não foi possível realizar esta ação.', msg, 'error');
        return throwError(e);
      })
    );
  }
}
