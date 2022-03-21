import { RelatorioContagemBoasPraticas } from './../model/Relatorio/RelatorioContagemBoasPraticas';
import { RelatorioBoasPraticasCidadesSignatariasFiltro } from './../model/Relatorio/RelatorioBoasPraticasCidadesSignatariasFiltro';
import { RelatorioBoasPraticasPcsFiltro } from './../model/Relatorio/RelatorioBoasPraticasPcsFiltro';
import { RelatorioBoasPraticasCidadesSignatarias } from './../model/Relatorio/RelatorioBoasPraticasCidadesSignatarias';
import { RelatorioBoasPraticasPCS } from './../model/Relatorio/RelatorioBoasPraticasPCS';
import { RelatorioEventos } from './../model/Relatorio/RelatorioEventos';
import { RelatorioPlanoDeMetasPrestacaoDeContas } from './../model/Relatorio/RelatorioPlanoMetasPrestacaoContas';
import { RelatorioShapesExportados } from './../model/Relatorio/RelatorioShapesExportardos';
import { RelatorioSessaoUsuario } from "./../model/relatorio-sessao-usuario";
import { environment } from "src/environments/environment";
import { Injectable, EventEmitter } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import swal from "sweetalert2";
// Models de Relatorio
import { HistoricoRelatorioGerado } from "../model/Relatorio/HistoricoRelatorioGerado";
import { AtividadeUsuario } from "../model/Relatorio/AtividadeUsuario";
import { RelatorioConteudoCompartilhado } from "../model/relatorio-conteudo-compartilhado";
import { DownloadsExportacoes } from "../model/Relatorio/DownloadsExportacoes";
import { RelatorioIndicadoresPreenchidos } from "../model/relatorio-indicadores-preenchidos";
import { AtividadeGestorMunicipal } from "../model/Relatorio/AtividadeGestorMunicipal";
import { VisualizacaoCartografica } from "../model/Relatorio/VisualizacaoCartografica";
import { Cidade } from "../model/cidade";
import { Eventos } from "../model/Relatorio/Eventos";
import { QuantidadeIndicadoresPreenchidos } from "../model/Relatorio/QuantidadeIndicadoresPreenchidos";
import { QuantidadeIndicadoresCadastrados } from "../model/Relatorio/QuantidadeIndicadoresCadastrados";
import { InteracaoComFerramentas } from "../model/Relatorio/InteracaoComFerramentas";
import { InteracaoChatForum } from "../model/Relatorio/InteracaoChatForum";
import { RelatorioPlanoDeMetas } from "../model/Relatorio/RelatorioPlanoDeMetas";
import { RelatorioShapesCadastrados } from '../model/Relatorio/RelatorioShapesCadastrados';
import { RegistroUsuariosFiltro } from '../model/registro-usuarios';
import { Usuario } from '../model/usuario';
import { RelatorioIndicadoresCompleto } from '../model/relatorio-indicadores-completo';
import { PcsUtil } from './pcs-util.service';
import { RelatorioApiPublica } from '../model/relatorio-api-publica';

@Injectable({
  providedIn: "root"
})
export class RelatorioService {
  IdRelatorio = new EventEmitter<number>();
  urlEndPoint = `${environment.API_URL}relatorio`;

  constructor(private http: HttpClient, private router: Router) {}

  public tradeComponent(idRelatorio: number) {
    this.IdRelatorio.emit(idRelatorio);
  }

  public carregarCidades(): Observable<Array<Cidade>> {
    return this.http.get<Array<Cidade>>(`${this.urlEndPoint}`).pipe(
      catchError(e => {
        swal.fire("Erro ao carregar cidades", "", "error");
        return throwError(e);
      })
    );
  }

  public searchHistoricoRelatorio(
    relObj: HistoricoRelatorioGerado
  ): Observable<Array<HistoricoRelatorioGerado>> {
    return this.http
      .post<Array<HistoricoRelatorioGerado>>(
        `${this.urlEndPoint}/buscarHistoricoRelatorio`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchAcaoGestorMunicipal(
    relObj: AtividadeGestorMunicipal
  ): Observable<Array<AtividadeGestorMunicipal>> {
    return this.http
      .post<Array<AtividadeGestorMunicipal>>(
        `${this.urlEndPoint}/buscarAtividadeGestorMunicipal`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchAtividadeUsuario(
    relObj: AtividadeUsuario
  ): Observable<Array<AtividadeUsuario>> {
    return this.http
      .post<Array<AtividadeUsuario>>(
        `${this.urlEndPoint}/buscarAtividadeUsuario`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchRegistroUsuarios(
    relObj: RegistroUsuariosFiltro
  ): Observable<Array<Usuario>> {
    return this.http
      .post<Array<Usuario>>(
        `${this.urlEndPoint}/buscarRegistroUsuarios`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchEventos(relObj: Eventos): Observable<Array<Eventos>> {
    return this.http
      .post<Array<Eventos>>(`${this.urlEndPoint}/buscarEventos`, relObj)
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatórios solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  getFiltroRelatorioConteudoCompartilhado(
    relObj: RelatorioConteudoCompartilhado
  ): Observable<any[]> {
    return this.http
      .post<[]>(
        `${this.urlEndPoint}/buscarFiltroRelatorioConteudoCompartilhado`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchDownloadsExportacoes(
    relObj: DownloadsExportacoes
  ): Observable<Array<DownloadsExportacoes>> {
    return this.http
      .post<Array<DownloadsExportacoes>>(
        `${this.urlEndPoint}/buscarDownloadsExportacoes`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public gravaLogDownExport(
    usuarioLogado: string,
    tipoRelatorio: string
  ): Observable<DownloadsExportacoes> {
    return this.http
      .get<DownloadsExportacoes>(
        `${this.urlEndPoint}/gravaLogDownloadExportacao/${usuarioLogado}/${tipoRelatorio}`
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  getRelatorioSessoesUsuarios(
    relobj: RelatorioSessaoUsuario
  ): Observable<any[]> {
    return this.http
      .post<Array<RelatorioSessaoUsuario>>(
        `${this.urlEndPoint}/buscarRelatorioSessoesUsuarios`,
        relobj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchIndicadoresPreenchidosComPaginacao(
    relObj: RelatorioIndicadoresPreenchidos
  ): Observable<Array<RelatorioIndicadoresPreenchidos>> {
    return this.http
      .post<Array<RelatorioIndicadoresPreenchidos>>(
        `${this.urlEndPoint}/buscarIndicadoresPreenchidosComPaginacao`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchIndicadoresPreenchidos(
    relObj: RelatorioIndicadoresPreenchidos
  ): Observable<Array<RelatorioIndicadoresPreenchidos>> {
    return this.http
      .post<Array<RelatorioIndicadoresPreenchidos>>(
        `${this.urlEndPoint}/buscarIndicadoresPreenchidos`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchVisualizacaoCartografica(
    relObj: VisualizacaoCartografica
  ): Observable<Array<VisualizacaoCartografica>> {
    return this.http
      .post<Array<VisualizacaoCartografica>>(
        `${this.urlEndPoint}/buscarVisualizacaoCartografica`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchQuantidadeIndicadoresPreenchidos(
    relObj: QuantidadeIndicadoresPreenchidos
  ): Observable<Array<QuantidadeIndicadoresPreenchidos>> {
    return this.http
      .post<Array<QuantidadeIndicadoresPreenchidos>>(
        `${this.urlEndPoint}/buscarQuantidadeIndicadoresPreenchidos`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchQuantidadeIndicadoresCadastrados(
    relObj: QuantidadeIndicadoresCadastrados
  ): Observable<Array<QuantidadeIndicadoresCadastrados>> {
    return this.http
      .post<Array<QuantidadeIndicadoresCadastrados>>(
        `${this.urlEndPoint}/buscarQuantidadeIndicadoresCadastrados`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchInteracaoComFerramentas(
    relObj: InteracaoComFerramentas
  ): Observable<Array<InteracaoComFerramentas>> {
    return this.http
      .post<Array<InteracaoComFerramentas>>(
        `${this.urlEndPoint}/buscarInteracaoComFerramentas`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchInteracaoChatForum(
    relObj: InteracaoChatForum
  ): Observable<Array<InteracaoChatForum>> {
    return this.http.post<Array<InteracaoChatForum>>(`${this.urlEndPoint}/buscarInteracaoChatForum`,relObj).pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchPlanoDeMetas(
    relObj: RelatorioPlanoDeMetas
  ): Observable<Array<RelatorioPlanoDeMetas>> {
    return this.http
      .post<Array<RelatorioPlanoDeMetas>>(
        `${this.urlEndPoint}/buscarRelatorioPlanoDeMetas`,
        relObj
      )
      .pipe(
        catchError(e => {
          swal.fire(
            "Erro ao carregar dados do relatório solicitado",
            "",
            "error"
          );
          return throwError(e);
        })
      );
  }

  public searchShapesCadastrados(idUsuario: number, dtCadastro: string, dtEdicao: string, tituloShape: string): Observable<Array<RelatorioShapesCadastrados>> {
    return this.http.get<Array<RelatorioShapesCadastrados>>(`${this.urlEndPoint}/buscarRelatorioShapesCadastrados?idUsuario=${idUsuario ? idUsuario : ''}&dtCadastro=${dtCadastro ? dtCadastro : ''}&dtEdicao=${dtEdicao ? dtEdicao : ''}&tituloShape=${tituloShape ? tituloShape : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

  public searchShapesExportados(idPerfil: number, idCidade: number): Observable<Array<RelatorioShapesExportados>> {
    return this.http.get<Array<RelatorioShapesExportados>>(`${this.urlEndPoint}/buscarRelatorioShapesExportados?idPerfil=${idPerfil ? idPerfil : ''}&idCidade=${idCidade ? idCidade : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

  public searchShapesCadastradosPrefeitura(idUsuario: number, idCidade: number, dtCadastro: string, dtEdicao: string, tituloShape: string): Observable<Array<RelatorioShapesCadastrados>> {
    return this.http.get<Array<RelatorioShapesCadastrados>>(`${this.urlEndPoint}/buscarRelatorioShapesCadastradosPrefeitura?idUsuario=${idUsuario ? idUsuario : ''}&idCidade=${idCidade ? idCidade : ''}&dtCadastro=${dtCadastro ? dtCadastro : ''}&dtEdicao=${dtEdicao ? dtEdicao : ''}&tituloShape=${tituloShape ? tituloShape : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

  public searchPlanoDeMetasPrestacaoDeContas(idCidade: number): Observable<Array<RelatorioPlanoDeMetasPrestacaoDeContas>> {
    return this.http.get<Array<RelatorioPlanoDeMetasPrestacaoDeContas>>(`${this.urlEndPoint}/buscarRelatorioPlanoDeMetasPrestacaoDeContas?idCidade=${idCidade ? idCidade : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

  public searchRelatorioEventos(tipo: string, dataInicial: string, dataFinal: string, endereco: string, titulo: string, cidade: number, estado: number, pais: number): Observable<Array<RelatorioEventos>> {
    return this.http.get<Array<RelatorioEventos>>(`${this.urlEndPoint}/buscarRelatorioEventos?tipo=${tipo ? tipo : ''}&dataInicial=${dataInicial ? dataInicial : ''}&dataFinal=${dataFinal ? dataFinal : ''}&endereco=${endereco ? endereco : ''}&titulo=${titulo ? titulo : ''}&cidade=${cidade ? cidade : ''}&estado=${estado ? estado : ''}&pais=${pais ? pais : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

    public searchRelatorioBoasPraticasPcs(relatorio: RelatorioBoasPraticasPcsFiltro): Observable<Array<RelatorioBoasPraticasPCS>> {
    return this.http.get<Array<RelatorioBoasPraticasPCS>>(`${this.urlEndPoint}/buscarRelatorioBoasPraticasPCS?titulo=${relatorio.titulo ? relatorio.titulo : ''}&idPais=${relatorio.idPais ? relatorio.idPais : ''}&idEstado=${relatorio.idEstado ? relatorio.idEstado : ''}&idCidade=${relatorio.idCidade ? relatorio.idCidade : ''}&idEixo=${relatorio.idEixo ? relatorio.idEixo : ''}&idOds=${relatorio.idOds ? relatorio.idOds : ''}&idMetaOds=${relatorio.idMetaOds ? relatorio.idMetaOds : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

  public searchRelatorioBoasPraticasCidadesSignatarias(relatorio: RelatorioBoasPraticasCidadesSignatariasFiltro): Observable<Array<RelatorioBoasPraticasCidadesSignatarias>> {
    return this.http.get<Array<RelatorioBoasPraticasCidadesSignatarias>>(`${this.urlEndPoint}/buscarRelatorioBoasPraticasCidadesSignatarias?titulo=${relatorio.titulo ? relatorio.titulo : ''}&idPais=${relatorio.idPais ? relatorio.idPais : ''}&idEstado=${relatorio.idEstado ? relatorio.idEstado : ''}&idCidade=${relatorio.idCidade ? relatorio.idCidade : ''}&idEixo=${relatorio.idEixo ? relatorio.idEixo : ''}&idOds=${relatorio.idOds ? relatorio.idOds : ''}&idMetaOds=${relatorio.idMetaOds ? relatorio.idMetaOds : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

  public searchRelatorioContagemBoasPraticas(tipoVariavel: string, tipoBoaPratica: string): Observable<Array<RelatorioContagemBoasPraticas>> {
    return this.http.get<Array<RelatorioContagemBoasPraticas>>(`${this.urlEndPoint}/buscarContagemRelatorioBoasPraticas?tipoVariavel=${tipoVariavel ? tipoVariavel : ''}&tipoBoaPratica=${tipoBoaPratica ? tipoBoaPratica : ''}`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

  public buscarRelatorioIndicadoresCompletos(): Observable<Array<RelatorioIndicadoresCompleto>> {
    return this.http.get<Array<RelatorioIndicadoresCompleto>>(`${this.urlEndPoint}/buscarRelatorioIndicadoresCompletos`).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

  public downloadRelatorioIndicadoresCompleto() {
    return this.http.get(`${this.urlEndPoint}/downloadIndicadoresCompletos`,{responseType: "blob" } ).pipe(
      catchError(e => {
        let msg: string = "";
        if (e.error.message) {
          msg = e.error.message;
        }
        PcsUtil.swal().fire('Não foi possível realizar o download.', msg, 'error');
        return throwError(e);
      })
    );
  }

  public searchRelatorioApiPublica(filtro: RelatorioApiPublica): Observable<Array<RelatorioApiPublica>> {
    return this.http.post<Array<RelatorioApiPublica>>(`${this.urlEndPoint}/buscarRelatorioApiPublica`, filtro).pipe(
      catchError(e => {
        swal.fire(
          "Erro ao carregar dados do relatório solicitado",
          "",
          "error"
        );
        return throwError(e);
      })
    );
  }

}

