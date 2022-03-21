import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable, EventEmitter } from '@angular/core';
import swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { throwError, Observable } from 'rxjs';
import { GrupoAcademico } from '../model/grupo-academico';
import { GrupoAcademicoCard } from '../model/GrupoAcademicoCard';
import { FiltroGrupoAcademico } from '../model/filtroGrupoAcademico';
import { GrupoAcademicoPainel } from '../model/grupoAcademicoPainel';
import { FiltroInstituicao } from '../model/filtro-instituicao';
import { GrupoAcademicoDetalheDTO } from '../model/grupo-academico-detalhe-dto';
import { ObjetivoDesenvolvimentoSustentavel } from '../model/objetivoDesenvolvimentoSustentavel';

@Injectable({
  providedIn: 'root'
})
export class GrupoAcademicoService {
  urlEndPoint: string = `${environment.API_URL}grupoAcademico`;

  constructor(
    private http: HttpClient,
  ) { }

  public cadastrarGrupoAcademico(grupoAcademico: GrupoAcademico){
    return this.http.post(`${this.urlEndPoint}/cadastrar`, grupoAcademico).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.errors) {
          msg = e.error.errors[0].message;
        }
        swal.fire('Não foi possível cadastrar o Grupo Acadêmico', msg, 'error');
        return throwError(e);
      })
    );
  }
  public buscarGrupoAcademicoPorId(id: number): Observable<GrupoAcademico> {
    return this.http.get<GrupoAcademico>(`${this.urlEndPoint}/buscarGrupoAcademicoPorId/${id}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarGruposAcademicos(): Observable<any> {
    return this.http.get<GrupoAcademico>(`${this.urlEndPoint}/buscarGruposAcademicosToList`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public filtrarGruposAcademicos(nomeGrupoAcademico: string): Observable<any> {
    return this.http.get<GrupoAcademico>(`${this.urlEndPoint}/filtrarGruposAcademicosToList/${nomeGrupoAcademico}`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public editarGrupoAcademico(grupoAcademico: GrupoAcademico) {
    return this.http.put<GrupoAcademico>(`${this.urlEndPoint}/editar/${grupoAcademico.id}`, grupoAcademico).pipe(
      catchError(e => {
        swal.fire('Erro ao editar Instituição', "", 'error');
        return throwError(e);
      })
    );
  }

  public excluirGrupoAcademico(id: number): Observable<GrupoAcademico> {
    return this.http.delete<GrupoAcademico>(`${this.urlEndPoint}/excluir/${id}`).pipe(
      catchError(e => {
        swal.fire('Não foi possível excluir Instituição', '', 'error');
        return throwError(e);
      })
    );
  }

  public buscarGruposAcademicosFiltrados(
    relObj: FiltroGrupoAcademico
  ): Observable<Array<any>> {    
    return this.http.get<Array<any>>(`${this.urlEndPoint}/buscarGruposAcademicosFiltrados?
    &idAreaInteresse=${relObj.idAreaInteresse ? relObj.idAreaInteresse : ''}
    &tipoCadastro=${relObj.tipoCadastro ? relObj.tipoCadastro : ''}
    &idEixo=${relObj.idEixo ? relObj.idEixo : ''}
    &idOds=${relObj.idOds ? relObj.idOds : ''}
    &idCidade=${relObj.idCidade ? relObj.idCidade : ''}
    &idProvinciaEstado=${relObj.idProvinciaEstado ? relObj.idProvinciaEstado : ''}
    &idPais=${relObj.idPais ? relObj.idPais : ''}
    &palavraChave=${relObj.palavraChave ? relObj.palavraChave : ''}
    &vinculo=${relObj.vinculo ? relObj.vinculo : ''}
    &nomeGrupo=${relObj.nomeGrupo ? relObj.nomeGrupo : ''}
    &setoresApl=${relObj.setoresApl ? relObj.setoresApl : ''}
    &cidadesApl=${relObj.cidadesApl ? relObj.cidadesApl : ''}
    &receitaAnual=${relObj.receitaAnual ? relObj.receitaAnual : ''}
    &participaApl=${relObj.participaApl ? relObj.participaApl : false}
    &associadaEthos=${relObj.associadaEthos ? relObj.associadaEthos : false}
    &setorEconomico=${relObj.setorEconomico ? relObj.setorEconomico : ''}
    &quantidadeFuncionarios=${relObj.quantidadeFuncionarios ? relObj.quantidadeFuncionarios : ''}
    &atuaProjetoSustentabilidade=${relObj.atuaProjetoSustentabilidade ? relObj.atuaProjetoSustentabilidade : false}
    &quantidadeAlunosMin=${relObj.quantidadeAlunosMin ? relObj.quantidadeAlunosMin : ''}
    &quantidadeAlunosMax=${relObj.quantidadeAlunosMax ? relObj.quantidadeAlunosMax : ''}
    &possuiExperiencias=${relObj.possuiExperiencias ? relObj.possuiExperiencias : false}
    &tipoInstituicaoAcademia=${relObj.tipoInstituicaoAcademia ? relObj.tipoInstituicaoAcademia : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao filtrar Instituição",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

  public buscarGrupoAcademicoCard(id: number): Observable<GrupoAcademicoCard> {
    return this.http.get<GrupoAcademicoCard>(`${this.urlEndPoint}/buscarGrupoAcademicoCard/${id}`).pipe(
      catchError(e => {
        if (e.error.message){
          swal.fire('Erro ao carregar Instituição', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }

  public buscarGrupoAcademicoPorIdPainel(id: number): Observable<GrupoAcademicoPainel> {
    return this.http.get<GrupoAcademicoPainel>(`${this.urlEndPoint}/buscarGrupoAcademicoPorIdPainel/${id}`).pipe(
      catchError(e => {
        if (e.error.message){
          swal.fire('Erro ao carregar grupo acadêmico', e.error.message, 'error');
        }
        return throwError(e);
      })
    );
  }
  
    public buscarGruposAcademicosMapa(): Observable<any> {
    return this.http.get<GrupoAcademico>(`${this.urlEndPoint}/buscarGruposAcademicosMapa`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarComboGruposAcademicos(): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/buscarComboGruposAcademicos`).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarGrupoAcademicoPorIdDetalhesDTO(id): Observable<any>{
    return this.http.get<GrupoAcademicoDetalheDTO>(`${this.urlEndPoint}/buscarGrupoAcademicoPorIdDetalhesDTO/${id}` ).pipe(
      catchError(e => {
        return throwError(e);
      })
    );
  }

  public buscarOdsDoGrupoAcademicoPorId(id: number): Observable<ObjetivoDesenvolvimentoSustentavel[]> {
    return this.http.get<ObjetivoDesenvolvimentoSustentavel[]>(`${this.urlEndPoint}/buscarOdsDoGrupoAcademicoPorId/${id}`).pipe(
      catchError(e => {
        swal.fire('Erro ao carregar os ODS.', '', 'error');
        return throwError(e);
      })
    );
  }
}
