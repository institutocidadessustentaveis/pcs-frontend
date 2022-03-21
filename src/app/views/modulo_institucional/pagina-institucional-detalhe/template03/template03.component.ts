import { HttpHeaders } from '@angular/common/http';
import { MaterialInstitucionalService } from 'src/app/services/material-institucional.service';
import { Component, OnInit, Input, SimpleChanges, AfterViewInit, OnChanges } from '@angular/core';
import { InstitucionalInterno } from 'src/app/model/institucional-interno';
import { ActivatedRoute, Router } from '@angular/router';
import { InstitucionalInternoService } from 'src/app/services/institucional-interno.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Publicacao } from 'src/app/model/publicacao';
import { saveAs } from 'file-saver';
import { MaterialApoioService } from 'src/app/services/materialApoio.service';
import { PublicacaoService } from 'src/app/services/publicacao.service';
import { DadosDownload } from 'src/app/model/dados-download';

@Component({
  selector: 'app-template03',
  templateUrl: './template03.component.html',
  styleUrls: ['./template03.component.css']
})

export class Template03Component implements OnInit, OnChanges {

  paginaChild: InstitucionalInterno;
  public destaques: Array<Publicacao>;
  public todasPublicacoes: any = [];
  public todasPublicacoes2: any = [];
  public qtdPublicacoes1 = 6;
  public qtdPublicacoes2 = 6;
  public mostrarVerMais1 = true;
  public mostrarVerMais2 = true;


  private dadosDownload = new DadosDownload;

  @Input() tituloPagina;
  @Input() dadosDownloadUser: DadosDownload;
  @Input()
  set pagina(pagina: InstitucionalInterno ) {
      this.paginaChild = pagina;
      this.carregarSafeUrls(this.paginaChild);
      this.configurarTodasPublicacoes();
      this.carregarPublicacoesSeNecessario();
  }

  get pagina() {
      return this.paginaChild;
  }

  constructor(
    private domSanitizer: DomSanitizer,
    private materialInstitucionalService: MaterialInstitucionalService,
    private  materialApoioService: MaterialApoioService,
    private publicacaoService: PublicacaoService) { }


  private getSafeUrl(url: string): SafeUrl {
    return this.domSanitizer.bypassSecurityTrustUrl('data:image/png;base64, ' + url);
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.pagina.template03.id) {
      if ((!this.pagina.template03.publicacoes2 || this.pagina.template03.publicacoes2.length == 0) && !this.pagina.template03.verMaisInstituicao && !this.pagina.template03.tituloCatalogo2){
        this.mostrarVerMais1 = false;
        this.qtdPublicacoes1 = 99999;
      }

      if ((!this.pagina.template03.publicacoes || this.pagina.template03.publicacoes.length == 0) && !this.pagina.template03.verMaisPCS && !this.pagina.template03.tituloCatalogo1){
        this.mostrarVerMais2 = false;
        this.qtdPublicacoes2 = 99999;
      }
    }
  }

  private carregarSafeUrls(pagina: InstitucionalInterno) {
    if (pagina.template03 && pagina.template03.imagemPrimeiraSecao) {
      pagina.template03.imagemPrimeiraSecaoSafeUrl = this.getSafeUrl(pagina.template03.imagemPrimeiraSecao);
    }
  }

  public getImagePath(publicacao: Publicacao): any {
    if (publicacao.idImagem == null && publicacao.imagem == null) {
      return `${environment.APP_IMAGEM}img-deafult-publicacao.png`;
    } else if (publicacao.imagem) {
      return this.getSafeUrl(publicacao.imagem);
    } else {
      return `${environment.API_URL}imagens/` + publicacao.idImagem;
    }
  }

  public irParaLink(nomeArquivo: string, link: string, arquivos: number[]) {

    if (this.paginaChild.template03.tipoPublicacao === 'livre') {
      return window.open('https://' + link, '__blank');

    } else if (this.paginaChild.template03.tipoPublicacao === 'material_institucional') {

      arquivos.forEach(idArquivo => {
        this.materialInstitucionalService.download(idArquivo).subscribe(res => {
          const contentType: string = res.headers.get('content-type');
          const nomeArquivoDownload: string = contentType.substring(contentType.indexOf('/') + 1, contentType.length);
          const blob = new Blob([res.body], { type: 'application/octet-stream' });
          saveAs(blob, nomeArquivo + '.' + nomeArquivoDownload);
        });
      });

    } else if (this.paginaChild.template03.tipoPublicacao === 'material_apoio') {
      this.materialApoioService.download(link).subscribe(res => {
        const contentType: string = res.headers.get('content-type');
        const nomeArquivoDownload: string = contentType.substring(contentType.indexOf('/') + 1, contentType.length);
        const blob = new Blob([res.body], { type: 'application/octet-stream' });
        saveAs(blob, nomeArquivo + '.' + nomeArquivoDownload);
      });
    }
  }

  configurarTodasPublicacoes() {
    if (this.pagina.template03) {
      if (this.pagina.template03.publicacoes) {
        this.pagina.template03.publicacoes.forEach(p => {
          this.todasPublicacoes.push(p);
        });
      }
      if (this.pagina.template03.publicacoes2) {
        this.pagina.template03.publicacoes2.forEach(p => {
          this.todasPublicacoes2.push(p);
        });
      }
      this.carregarPublicacoesSeNecessario();
    }
  }

  carregarMais(qualSecao){
    if (qualSecao == 1) {
      this.qtdPublicacoes1 += 3;
    } else {
      this.qtdPublicacoes2 += 3;
    }
  }

  carregarPublicacoes(ehPCS) {
    if ( ehPCS ) {
      this.publicacaoService.listar(-1, ehPCS , this.paginaChild.id ).subscribe(res => {
        const lista: any = res;
        for ( const item of lista ) {
          this.todasPublicacoes.push(item);
        }
      });
    } else {
      this.publicacaoService.listar(-1, ehPCS, this.paginaChild.id ).subscribe(res => {
        const lista: any = res;
        for ( const item of lista ) {
          this.todasPublicacoes2.push(item);
        }
      });
    }
  }

  carregarPublicacoesSeNecessario() {
    if ( this.paginaChild.template03.verMaisPCS ) {
        this.carregarPublicacoes(true);
    }
    if ( this.paginaChild.template03.verMaisInstituicao ) {
        this.carregarPublicacoes(false);
    }
  }
}
