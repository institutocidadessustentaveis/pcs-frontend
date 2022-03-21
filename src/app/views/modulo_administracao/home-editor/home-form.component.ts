import { HomeBarra } from './../../../model/home-barra';
import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog, MatSort, MatTableDataSource} from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { Arquivo } from 'src/app/model/arquivo';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Home } from 'src/app/model/home';
import { PrimeiraSecao } from 'src/app/model/primeira-secao';
import { HomeService } from 'src/app/services/home.service';
import { HomeImagem } from 'src/app/model/home-imagem';
import { SegundaSecao } from 'src/app/model/segunda-secao';
import { TerceiraSecao } from 'src/app/model/terceira-secao';
import { QuartaSecao } from 'src/app/model/quarta-secao';
import { QuintaSecao } from 'src/app/model/quinta-secao';
import { SecaoLateral } from 'src/app/model/secao-lateral';
import { EditarIndiceSecaoComponent } from './editar-indice-secao/editar-indice-secao.component';
import { SextaSecao } from 'src/app/model/sexta-secao';
import { SetimaSecao } from 'src/app/model/setima-secao';

@Component({
  selector: 'app-home-form',
  templateUrl: './home-form.component.html',
  styleUrls: ['./home-form.component.css', './home-form.component.scss']
})
export class HomeFormComponent implements OnInit {

  public editorConfig: any = {
    height: '200px',
    toolbar: [
      ['misc', ['undo', 'redo']],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', ['fontname', 'fontsize', 'color']],
      ['para', ['style0', 'ul', 'ol', 'paragraph', 'height']],
      ['insert', ['table', 'picture', 'link', 'video', 'hr']],
      ['view', ['fullscreen']]
    ],
    fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  public editorSubtituloConfig: any = {
    height: '100px',
    toolbar: [
      ['misc', []],
      ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
      ['fontsize', []],
      ['para', ['height']],
      ['insert', ['table', 'link', 'hr']],
      ['view', ['fullscreen']]
    ],
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  public editorCleanConfig: any = {
    height: '100px',
    toolbar: [
      [, []],
      [, []],
      [, []],
      [, []],
      [, []],
      [, []]
    ],
    callbacks: { onPaste: function (e) { var bufferText = ((e.originalEvent || e).clipboardData || window["clipboardData"]).getData('Text'); e.preventDefault(); document.execCommand('insertText', false, bufferText); } }
  };

  public imagemHomeGaleriaChangedEvent: any = '';

  public home: Home = new Home();
  private linkAnterior: string;

  arquivo = new Arquivo();
  loading: any;

  public urlBase;
  scrollUp: any;

  public homeImagemCropGaleriaAux: HomeImagem = null;
  public homeImagemRef: HomeImagem = new HomeImagem();
  public homeImageSelected = false;

  public homeBarraRef: HomeBarra;
  public homeBarraDivSelecionada = null;

  public step;

  public isShowPreview = false;

  public dataSourcePrimeiraSecao: MatTableDataSource<PrimeiraSecao>;
  public displayedColumnsPrimeiraSecao: string[] = ['indicePrimeiraSecao', 'primeiroTituloPrimeiraSecao', 'exibirPrimeiraSecao', 'acoesPrimeiraSecao'];
  public primeiraSecaoSelecionada: PrimeiraSecao = null;

  public dataSourceSegundaSecao: MatTableDataSource<SegundaSecao>;
  public displayedColumnsSegundaSecao: string[] = ['indiceSegundaSecao', 'tituloPrincipalSegundaSecao', 'exibirSegundaSecao', 'acoesSegundaSecao'];
  public segundaSecaoSelecionada: SegundaSecao = null;

  public dataSourceTerceiraSecao: MatTableDataSource<TerceiraSecao>;
  public displayedColumnsTerceiraSecao: string[] = ['indiceTerceiraSecao', 'tituloPrincipalTerceiraSecao', 'exibirTerceiraSecao', 'acoesTerceiraSecao'];
  public terceiraSecaoSelecionada: TerceiraSecao = null;

  public dataSourceQuartaSecao: MatTableDataSource<QuartaSecao>;
  public displayedColumnsQuartaSecao: string[] = ['indiceQuartaSecao', 'tituloPrincipalQuartaSecao', 'exibirQuartaSecao', 'acoesQuartaSecao'];
  public quartaSecaoSelecionada: QuartaSecao = null;

  public dataSourceQuintaSecao: MatTableDataSource<QuintaSecao>;
  public displayedColumnsQuintaSecao: string[] = ['indiceQuintaSecao', 'tituloPrincipalQuintaSecao', 'exibirQuintaSecao', 'acoesQuintaSecao'];
  public quintaSecaoSelecionada: QuintaSecao = null;

  public dataSourceSecaoLateral: MatTableDataSource<SecaoLateral>;
  public displayedColumnsSecaoLateral: string[] = ['indiceSecaoLateral', 'primeiroTituloPrincipalSecaoLateral', 'exibirSecaoLateral', 'acoesSecaoLateral'];
  public secaoLateralSelecionada: SecaoLateral = null;

  public dataSourceSextaSecao: MatTableDataSource<SextaSecao>;
  public displayedColumnsSextaSecao: string[] = ['indiceSextaSecao', 'tituloPrincipalSextaSecao', 'exibirSextaSecao', 'acoesSextaSecao'];
  public sextaSecaoSelecionada: SextaSecao = null;

  public dataSourceSetimaSecao: MatTableDataSource<SetimaSecao>;
  public displayedColumnsSetimaSecao: string[] = ['indiceSetimaSecao', 'tituloPrincipalSetimaSecao', 'exibirSetimaSecao', 'acoesSetimaSecao'];
  public setimaSecaoSelecionada: SetimaSecao = null;

  public todasSecoes: any[] = [];

  public todasSecoesResumidas: any[] = [];
  public dataSourceSecao: any;
  public displayedColumnsSecao: string[] = ['indiceSecao', 'tipoSecao', 'tituloSecao', 'exibirSecao', 'acoesSecao'];

  public homeVisualizacao: Home = new Home();


  public setStep(index: number) {
    this.step = index;
  }

  public nextStep() {
    this.step++;
  }

  public prevStep() {
    this.step--;
  }

  constructor(public homeService: HomeService,
              public dialog: MatDialog,
              public authService: AuthService,
              private router: Router,
              private element: ElementRef,
              private changeDetectorRef: ChangeDetectorRef,
              private activatedRoute: ActivatedRoute, public domSanitizationService: DomSanitizer) {
                this.scrollUp = this.router.events.subscribe((path) => {
                  element.nativeElement.scrollIntoView();
                });
              }

  ngOnInit() {
    this.urlBase = window.location.origin;
    this.buscarHome();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  private buscarHome(): void {
    this.activatedRoute.params.subscribe(params => {
      const id = params.id;
      if (id) {
        this.homeService.buscarIdsPaginaHomePorId(id).subscribe((response) => {
          this.home = response;
          this.linkAnterior = this.home.link_pagina;

          if (this.home.homeBarra && this.home.homeBarra.id) {
            this.buscarHomeBarraPorId(this.home);
          } else {
            this.home.homeBarra = new HomeBarra();
          }

          this.buscarListaSecoesResumida();

        });
      }
    });
  }

  private buscarListaSecoesResumida() {

    this.todasSecoesResumidas = [];

    this.buscarListaPrimeiraSecaoResumidaPorId(this.home.id);

    this.buscarListaSegundaSecaoResumidaPorId(this.home.id);

    this.buscarListaTerceiraSecaoResumidaPorId(this.home.id);

    this.buscarListaQuartaSecaoResumidaPorId(this.home.id);

    this.buscarListaQuintaSecaoResumidaPorId(this.home.id);

    this.buscarListaSecaoLateralResumidaPorId(this.home.id);

    this.buscarListaSextaSecaoResumidaPorId(this.home.id);

    this.buscarListaSetimaSecaoResumidaPorId(this.home.id);
  }

  private async buscarListaImagensGaleriaPorId(home: Home) {
    this.loading = true;
    await this.homeService.buscarListaImagensGaleriaPorId(home.id).subscribe(response => {
      this.loading = false;
      home.galeriaDeImagens = response;
      if ( home && home.galeriaDeImagens) {
        for (let item of home.galeriaDeImagens) {
          item.safeUrl = this.domSanitizationService.bypassSecurityTrustUrl('data:image/png;base64, ' + item.conteudo);
        }
      }
      if (!home.galeriaDeImagens) {
        home.galeriaDeImagens = [];
      }
    });
  }

  private async buscarHomeBarraPorId(home: Home) {
    await this.homeService.buscarHomeBarraPorId(this.home.homeBarra.id).subscribe(response => {
      home.homeBarra = response;
    });
  }

  private async buscarListaPrimeiraSecaoResumidaPorId(id: number) {
      await this.homeService.buscarListaPrimeiraSecaoResumidaPorId(id).subscribe(response => {
        this.home.listaPrimeiraSecao = response as Array<any>;
        this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.home.listaPrimeiraSecao];
        this.dataSourceSecao = this.todasSecoesResumidas;
        this.ordernarPorIndiceTodasSecoesResumidas();
      });
  }

  private async buscarListaSegundaSecaoResumidaPorId(id: number) {
    await this.homeService.buscarListaSegundaSecaoResumidaPorId(id).subscribe(response => {
      this.home.listaSegundaSecao = response as Array<any>;
      this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.home.listaSegundaSecao];
      this.dataSourceSecao = this.todasSecoesResumidas;
      this.ordernarPorIndiceTodasSecoesResumidas();
    });
  }

  private async buscarListaTerceiraSecaoResumidaPorId(id: number) {
    await this.homeService.buscarListaTerceiraSecaoResumidaPorId(id).subscribe(response => {
      this.home.listaTerceiraSecao = response as Array<any>;
      this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.home.listaTerceiraSecao];
      this.dataSourceSecao = this.todasSecoesResumidas;
      this.ordernarPorIndiceTodasSecoesResumidas();
    });
  }

  private async buscarListaQuartaSecaoResumidaPorId(id: number) {
    await this.homeService.buscarListaQuartaSecaoResumidaPorId(id).subscribe(response => {
      this.home.listaQuartaSecao = response as Array<any>;
      this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.home.listaQuartaSecao];
      this.dataSourceSecao = this.todasSecoesResumidas;
      this.ordernarPorIndiceTodasSecoesResumidas();
    });
  }

  private async buscarListaQuintaSecaoResumidaPorId(id: number) {
    await this.homeService.buscarListaQuintaSecaoResumidaPorId(id).subscribe(response => {
      this.home.listaQuintaSecao = response as Array<any>;
      this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.home.listaQuintaSecao];
      this.dataSourceSecao = this.todasSecoesResumidas;
      this.ordernarPorIndiceTodasSecoesResumidas();
    });
  }

  private async buscarListaSecaoLateralResumidaPorId(id: number) {
    await this.homeService.buscarListaSecaoLateralResumidaPorId(id).subscribe(response => {
      this.home.listaSecaoLateral = response as Array<SecaoLateral>;
      this.dataSourceSecaoLateral = new MatTableDataSource<SecaoLateral>(response);
    });
  }

  private async buscarListaSextaSecaoResumidaPorId(id: number) {
    await this.homeService.buscarListaSextaSecaoResumidaPorId(id).subscribe(response => {
      this.home.listaSextaSecao = response as Array<any>;
      this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.home.listaSextaSecao];
      this.dataSourceSecao = this.todasSecoesResumidas;
      this.ordernarPorIndiceTodasSecoesResumidas();
    });
  }

  private async buscarListaSetimaSecaoResumidaPorId(id: number) {
    await this.homeService.buscarListaSetimaSecaoResumidaPorId(id).subscribe(response => {
      this.home.listaSetimaSecao = response as Array<any>;
      this.todasSecoesResumidas = [...this.todasSecoesResumidas, ...this.home.listaSetimaSecao];
      this.dataSourceSecao = this.todasSecoesResumidas;
      this.ordernarPorIndiceTodasSecoesResumidas();
    });
  }

  public salvar(){

    if (this.linkAnterior !== this.home.link_pagina) {
      this.homeService
        .existePaginaHomeComLink(this.home.link_pagina)
        .subscribe(response => {
          if (response.id !== null) {
            this.home.link_pagina = "";
            PcsUtil.swal().fire({
                title: "Inválido!",
                text: `Link já está sendo utilizado.`,
                type: "warning",
                showCancelButton: false,
                confirmButtonText: "Ok"
              })
              .then(result => {});
          }else{
            if (this.home.id) {
              this.editar();
            } else {
              this.cadastrar();
            }
          }
        });
    } else if (this.home.id) {
        this.editar();
    }
  }

  public cadastrar(): void {
    this.loading = true;
    this.homeService.inserir(this.home).subscribe(response => {
      PcsUtil.swal().fire({
        title: 'Home',
        text: `Home ${this.home.titulo} cadastrada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
        this.router.navigate(['home-editor/lista']);
      }, error => {this.loading = false;});
    });
  }

  public editar(): void {
    this.loading = true;
    this.homeService.editar(this.home).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Home',
        text: `${this.home.titulo} atualizada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
        this.router.navigate(['/home/editar/' + this.home.id]);
      }, error => {this.loading = false;});
    });
  }

  public editarHomeBarra(): void {
    this.loading = true;
    this.homeService.editarHomeBarra(this.home.id, this.home.homeBarra).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Barra de chamadas',
        text: `Atualizada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
        this.router.navigate(['/home/editar/' + this.home.id]);
      }, error => {this.loading = false;});
    });
  }

  public editarHomeGaleria(): void {
    this.loading = true;
    this.homeService.editarHomeGaleria(this.home.id, this.homeImagemRef).subscribe(response => {
      const foundIndex = this.home.galeriaDeImagens.findIndex(x => x == this.homeImagemRef);
      this.home.galeriaDeImagens[foundIndex].id = response.id;
      PcsUtil.swal().fire({
        title: 'Galeria',
        text: `Atualizada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
        this.router.navigate(['/home/editar/' + this.home.id]);
      }, error => {this.loading = false;});
    });
  }

  public buscarPrimeiraSecaoDetalhe(id: number){
    this.loading = true;
    this.homeService.buscarPrimeiraSecaoDetalhe(id).subscribe(primeiraSecao => {
      this.primeiraSecaoSelecionada = primeiraSecao;
      this.loading = false;
      this.segundaSecaoSelecionada = null;
      this.terceiraSecaoSelecionada = null;
      this.quartaSecaoSelecionada = null;
      this.quintaSecaoSelecionada = null;
      this.sextaSecaoSelecionada = null;
      this.setimaSecaoSelecionada = null;
    });
  }

  public excluirPrimeiraSecao(id: number) {
    this.primeiraSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.homeService.excluirPrimeiraSecao(id).subscribe(primeiraSecao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');
          this.buscarListaSecoesResumida();
        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarPrimeiraSecao(): void {
    if (this.primeiraSecaoSelecionada.id == 999999) {
      this.primeiraSecaoSelecionada.id = null;
    }
    this.loading = true;
    this.homeService.editarPrimeiraSecao(this.home.id , this.primeiraSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção A',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.primeiraSecaoSelecionada = null;
    });
  }

  public cadastrarNovaPrimeiraSecao() {
    this.primeiraSecaoSelecionada = new PrimeiraSecao();
    this.segundaSecaoSelecionada = null;
    this.terceiraSecaoSelecionada = null;
    this.quartaSecaoSelecionada = null;
    this.quintaSecaoSelecionada = null;
    this.sextaSecaoSelecionada = null;
    this.setimaSecaoSelecionada = null;
  }

  public cadastrarNovaSegundaSecao() {
    this.segundaSecaoSelecionada = new SegundaSecao();
    this.primeiraSecaoSelecionada = null;
    this.terceiraSecaoSelecionada = null;
    this.quartaSecaoSelecionada = null;
    this.quintaSecaoSelecionada = null;
    this.sextaSecaoSelecionada = null;
    this.setimaSecaoSelecionada = null;
  }

  public cadastrarNovaTerceiraSecao() {
    this.terceiraSecaoSelecionada = new SegundaSecao();
    this.primeiraSecaoSelecionada = null;
    this.segundaSecaoSelecionada = null;
    this.quartaSecaoSelecionada = null;
    this.quintaSecaoSelecionada = null;
    this.sextaSecaoSelecionada = null;
    this.setimaSecaoSelecionada = null;
  }

  public cadastrarNovaQuartaSecao() {
    this.quartaSecaoSelecionada = new QuartaSecao();
    this.primeiraSecaoSelecionada = null;
    this.segundaSecaoSelecionada = null;
    this.terceiraSecaoSelecionada = null;
    this.quintaSecaoSelecionada = null;
    this.sextaSecaoSelecionada = null;
    this.setimaSecaoSelecionada = null;
  }

  public cadastrarNovaQuintaSecao() {
    this.quintaSecaoSelecionada = new QuintaSecao();
    this.primeiraSecaoSelecionada = null;
    this.segundaSecaoSelecionada = null;
    this.terceiraSecaoSelecionada = null;
    this.quartaSecaoSelecionada = null;
    this.sextaSecaoSelecionada = null;
    this.setimaSecaoSelecionada = null;
  }

  public cadastrarNovaSextaSecao() {
    this.sextaSecaoSelecionada = new SextaSecao();
    this.primeiraSecaoSelecionada = null;
    this.segundaSecaoSelecionada = null;
    this.terceiraSecaoSelecionada = null;
    this.quartaSecaoSelecionada = null;
    this.quintaSecaoSelecionada = null;
    this.setimaSecaoSelecionada = null;
  }

  public cadastrarNovaSetimaSecao() {
    this.setimaSecaoSelecionada = new SetimaSecao();
    this.primeiraSecaoSelecionada = null;
    this.segundaSecaoSelecionada = null;
    this.terceiraSecaoSelecionada = null;
    this.quartaSecaoSelecionada = null;
    this.quintaSecaoSelecionada = null;
    this.sextaSecaoSelecionada = null;
  }

  public cadastrarNovaSecaoLateral() {
    this.secaoLateralSelecionada = new SecaoLateral();
  }

  public fecharPrimeiraSecao() {
    this.primeiraSecaoSelecionada = null;
  }

  public fecharSegundaSecao() {
    this.segundaSecaoSelecionada = null;
  }

  public fecharTerceiraSecao() {
    this.terceiraSecaoSelecionada = null;
  }

  public fecharQuartaSecao() {
    this.quartaSecaoSelecionada = null;
  }

  public fecharQuintaSecao() {
    this.quintaSecaoSelecionada = null;
  }

  public fecharSextaSecao() {
    this.sextaSecaoSelecionada = null;
  }

  public fecharSetimaSecao() {
    this.setimaSecaoSelecionada = null;
  }

  public fecharSecaoLateral() {
    this.secaoLateralSelecionada = null;
  }

  public buscarSegundaSecaoDetalhe(id: number){
    this.loading = true;
    this.homeService.buscarSegundaSecaoDetalhe(id).subscribe(segundaSecao => {
      this.segundaSecaoSelecionada = segundaSecao;
      this.loading = false;
      this.primeiraSecaoSelecionada = null;
      this.terceiraSecaoSelecionada = null;
      this.quartaSecaoSelecionada = null;
      this.quintaSecaoSelecionada = null;
      this.sextaSecaoSelecionada = null;
      this.setimaSecaoSelecionada = null;
    });
  }

  public excluirSegundaSecao(id: number) {
    this.segundaSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.homeService.excluirSegundaSecao(id).subscribe(segundaSecao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');
          this.buscarListaSecoesResumida();
        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarSegundaSecao(): void {
    if (this.segundaSecaoSelecionada.id == 999999) {
      this.segundaSecaoSelecionada.id = null;
    }
    this.loading = true;
    this.homeService.editarSegundaSecao(this.home.id , this.segundaSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção B',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.segundaSecaoSelecionada =  null;
    });
  }

  public buscarTerceiraSecaoDetalhe(id: number){
    this.loading = true;
    this.homeService.buscarTerceiraSecaoDetalhe(id).subscribe(terceiraSecao => {
      this.terceiraSecaoSelecionada = terceiraSecao;
      this.loading = false;
      this.primeiraSecaoSelecionada = null;
      this.segundaSecaoSelecionada = null;
      this.quartaSecaoSelecionada = null;
      this.quintaSecaoSelecionada = null;
      this.sextaSecaoSelecionada = null;
      this.setimaSecaoSelecionada = null;
    });
  }

  public excluirTerceiraSecao(id: number) {
    this.terceiraSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.homeService.excluirTerceiraSecao(id).subscribe(segundaSecao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');
          this.buscarListaSecoesResumida();
        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarTerceiraSecao(): void {
    if (this.terceiraSecaoSelecionada.id == 999999) {
      this.terceiraSecaoSelecionada.id = null;
    }
    this.loading = true;
    this.homeService.editarTerceiraSecao(this.home.id , this.terceiraSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção C',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.terceiraSecaoSelecionada = null;
    });
  }

  public buscarQuartaSecaoDetalhe(id: number){
    this.loading = true;
    this.homeService.buscarQuartaSecaoDetalhe(id).subscribe(quartaSecao => {
      this.quartaSecaoSelecionada = quartaSecao;
      this.loading = false;
      this.primeiraSecaoSelecionada = null;
      this.segundaSecaoSelecionada = null;
      this.terceiraSecaoSelecionada = null;
      this.quintaSecaoSelecionada = null;
      this.sextaSecaoSelecionada = null;
      this.setimaSecaoSelecionada = null;
    });
  }

  public excluirQuartaSecao(id: number) {
    this.quartaSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.homeService.excluirQuartaSecao(id).subscribe(quartaSecao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');
          this.buscarListaSecoesResumida();
        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarQuartaSecao(): void {
    if (this.quartaSecaoSelecionada.id == 999999) {
      this.quartaSecaoSelecionada.id = null;
    }
    this.loading = true;
    this.homeService.editarQuartaSecao(this.home.id , this.quartaSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção D',
        text: `Atualizada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.quartaSecaoSelecionada = null;
    });
  }

  public buscarQuintaSecaoDetalhe(id: number) {
    this.loading = true;
    this.homeService.buscarQuintaSecaoDetalhe(id).subscribe(quintaSecao => {
      this.quintaSecaoSelecionada = quintaSecao;
      this.loading = false;
      this.primeiraSecaoSelecionada = null;
      this.segundaSecaoSelecionada = null;
      this.terceiraSecaoSelecionada = null;
      this.quartaSecaoSelecionada = null;
      this.sextaSecaoSelecionada = null;
      this.setimaSecaoSelecionada = null;
    });
  }

  public excluirQuintaSecao(id: number) {
    this.quintaSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.homeService.excluirQuintaSecao(id).subscribe(quintaSecao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');
          this.buscarListaSecoesResumida();
        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarQuintaSecao(): void {
    if (this.quintaSecaoSelecionada.id == 999999) {
      this.quintaSecaoSelecionada.id = null;
    }
    this.loading = true;
    this.homeService.editarQuintaSecao(this.home.id , this.quintaSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção E',
        text: `Atualizada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.quintaSecaoSelecionada = null;
    });
  }

  public excluirSecaoLateral(id: number) {
    this.secaoLateralSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.homeService.excluirSecaoLateral(id).subscribe(secaoLateral => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');
          this.buscarListaSecaoLateralResumidaPorId(this.home.id);
        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarSecaoLateral(): void {
    if (this.secaoLateralSelecionada.id == 999999) {
      this.secaoLateralSelecionada.id = null;
    }
    this.loading = true;
    this.homeService.editarSecaoLateral(this.home.id , this.secaoLateralSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção Lateral',
        text: `Atualizada.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecaoLateralResumidaPorId(this.home.id);
    });
  }

  public buscarSecaoLateralDetalhe(id: number) {
    this.loading = true;
    this.homeService.buscarSecaoLateralDetalhe(id).subscribe(secaoLateral => {
      this.secaoLateralSelecionada = secaoLateral;
      this.loading = false;
    });
  }

  public buscarSextaSecaoDetalhe(id: number){
    this.loading = true;
    this.homeService.buscarSextaSecaoDetalhe(id).subscribe(sextaSecao => {
      this.sextaSecaoSelecionada = sextaSecao;
      this.loading = false;
      this.primeiraSecaoSelecionada = null;
      this.segundaSecaoSelecionada = null;
      this.quartaSecaoSelecionada = null;
      this.quintaSecaoSelecionada = null;
      this.terceiraSecaoSelecionada = null;
      this.setimaSecaoSelecionada = null;
    });
  }

  public excluirSextaSecao(id: number) {
    this.sextaSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.homeService.excluirSextaSecao(id).subscribe(segundaSecao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');
          this.buscarListaSecoesResumida();
        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarSextaSecao(): void {
    if (this.sextaSecaoSelecionada.id == 999999) {
      this.sextaSecaoSelecionada.id = null;
    }
    this.loading = true;
    this.homeService.editarSextaSecao(this.home.id , this.sextaSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção F',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.sextaSecaoSelecionada = null;
    });
  }


  public buscarSetimaSecaoDetalhe(id: number){
    this.loading = true;
    this.homeService.buscarSetimaSecaoDetalhe(id).subscribe(setimaSecao => {
      this.setimaSecaoSelecionada = setimaSecao;
      this.loading = false;
      this.primeiraSecaoSelecionada = null;
      this.segundaSecaoSelecionada = null;
      this.quartaSecaoSelecionada = null;
      this.quintaSecaoSelecionada = null;
      this.terceiraSecaoSelecionada = null;
      this.sextaSecaoSelecionada = null;
    });
  }

  public excluirSetimaSecao(id: number) {
    this.setimaSecaoSelecionada = null;
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a Seção selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
        this.homeService.excluirSetimaSecao(id).subscribe(setimaSecao => {
          PcsUtil.swal().fire('Excluído!', `Seção excluída.`, 'success');
          this.buscarListaSecoesResumida();
        });
      } else {
        this.loading = false;
      }
    });
  }

  public editarSetimaSecao(): void {
    if (this.setimaSecaoSelecionada.id == 999999) {
      this.setimaSecaoSelecionada.id = null;
    }
    this.loading = true;
    this.homeService.editarSetimaSecao(this.home.id , this.setimaSecaoSelecionada).subscribe(institucional => {
      PcsUtil.swal().fire({
        title: 'Seção G',
        text: `Salva.`,
        type: 'success',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.loading = false;
      }, error => {this.loading = false;});
      this.loading = false;
      this.buscarListaSecoesResumida();
      this.setimaSecaoSelecionada = null;
    });
  }


  processImage(eventInput: any, nomeInput: string, secao: any) {
    this.loading = true;
    const reader = new FileReader();
    reader.readAsDataURL(eventInput.target.files[0]);
    reader.onload = () => {

      this.arquivo.nomeArquivo = eventInput.target.files[0].name;
      this.arquivo.extensao = reader.result.toString().split(',')[0];
      this.arquivo.conteudo = reader.result.toString().split(',')[1];

      if (PcsUtil.tamanhoArquivoEstaDentroDoLimite(reader.result.toString().split(',')[1])) {
        const file: File = eventInput.target.files[0];
        const reader = new FileReader();
        if (nomeInput === 'galeria') {
          reader.onload = this._handleReaderLoadedGaleria.bind(this);
          this.imagemHomeGaleriaChangedEvent = eventInput;
        } else if (nomeInput === 'segundaSecaoPrimeiraImagem') {
          reader.onload = function(readerEvt: any) {
            secao.primeiraImagem = btoa(readerEvt.target.result);
            secao.primeiraImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.primeiraImagem);
          }.bind(this);
        } else if (nomeInput === 'segundaSecaoSegundaImagem') {
          reader.onload = function(readerEvt: any) {
            secao.segundaImagem = btoa(readerEvt.target.result);
            secao.segundaImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.segundaImagem);
          }.bind(this);
        } else if (nomeInput === 'terceiraSecaoPrimeiraImagem') {
          reader.onload = function(readerEvt: any) {
            secao.primeiraImagem = btoa(readerEvt.target.result);
            secao.primeiraImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.primeiraImagem);
          }.bind(this);
        } else if (nomeInput === 'terceiraSecaoSegundaImagem') {
          reader.onload = function(readerEvt: any) {
            secao.segundaImagem = btoa(readerEvt.target.result);
            secao.segundaImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.segundaImagem);
          }.bind(this);
        } else if (nomeInput === 'quartaSecaoPrimeiraImagem') {
          reader.onload = function(readerEvt: any) {
            secao.primeiraImagem = btoa(readerEvt.target.result);
            secao.primeiraImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.primeiraImagem);
          }.bind(this);
        } else if (nomeInput === 'secaoLateralPrimeiraImagem') {
          reader.onload = function(readerEvt: any) {
            secao.primeiraImagem = btoa(readerEvt.target.result);
            secao.primeiraImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.primeiraImagem);
          }.bind(this);
        } else if (nomeInput === 'secaoLateralSegundaImagem') {
          reader.onload = function(readerEvt: any) {
            secao.segundaImagem = btoa(readerEvt.target.result);
            secao.segundaImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.segundaImagem);
          }.bind(this);
        } else if (nomeInput === 'secaoLateralTerceiraImagem') {
          reader.onload = function(readerEvt: any) {
            secao.terceiraImagem = btoa(readerEvt.target.result);
            secao.terceiraImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.terceiraImagem);
          }.bind(this);
        } else if (nomeInput === 'sextaSecaoPrimeiraImagem') {
          reader.onload = function(readerEvt: any) {
            secao.primeiraImagem = btoa(readerEvt.target.result);
            secao.primeiraImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.primeiraImagem);
          }.bind(this);
        } else if (nomeInput === 'sextaSecaoSegundaImagem') {
          reader.onload = function(readerEvt: any) {
            secao.segundaImagem = btoa(readerEvt.target.result);
            secao.segundaImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.segundaImagem);
          }.bind(this);
        } else if (nomeInput === 'setimaSecaoPrimeiraImagem') {
          reader.onload = function(readerEvt: any) {
            secao.primeiraImagem = btoa(readerEvt.target.result);
            secao.primeiraImagemSafeUrl = this.domSanitizationService.bypassSecurityTrustUrl(
            'data:image/png;base64, ' + secao.primeiraImagem);
          }.bind(this);
        }
        reader.readAsBinaryString(file);
      } else {
        PcsUtil.swal().fire({
          title: 'Cadastro de Imagem',
          text: `Arquivo excede o tamanho limite de 10 MB`,
          type: 'warning',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {

        }, error => { });
      }

    };
    this.loading = false;
   }

  _handleReaderLoadedGaleria(readerEvt) {
    if (this.home.galeriaDeImagens.length < 20) {
      const imagem: HomeImagem = new HomeImagem();
      imagem.conteudo = btoa(readerEvt.target.result);
      imagem.tipo = 'galeria';
      imagem.safeUrl = this.domSanitizationService.bypassSecurityTrustUrl('data:image/png;base64, ' + imagem.conteudo);
      this.homeImagemCropGaleriaAux = imagem;
      this.home.galeriaDeImagens.push(imagem);
    } else {
      PcsUtil.swal().fire({
        title: 'Limite de arquivos atingido',
        text: `Máximo de vinte arquivos`,
        type: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then((result) => {
        this.imagemHomeGaleriaChangedEvent = '';
        this.homeImagemCropGaleriaAux = null;
      }, error => { });
    }
  }

  public carregaTituloSubtitulo(imagem: HomeImagem) {
    this.homeImagemRef = imagem;
    this.homeImageSelected = true;
    this.imagemHomeGaleriaChangedEvent = '';
  }

  public deletarImagemDaGaleria(imagem: HomeImagem) {
    const swalWithBootstrapButtons =  PcsUtil.swal().mixin({
      confirmButtonClass: 'btn btn-success',
      cancelButtonClass: 'btn btn-danger',
      buttonsStyling: true,
    });

    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a imagem?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.home.galeriaDeImagens.splice(this.home.galeriaDeImagens.indexOf(imagem), 1);
        if (imagem.id != null) {
          this.homeService.excluirHomeImagem(imagem.id).subscribe();
        }
        this.homeImagemCropGaleriaAux = null;
        this.homeImagemRef = new HomeImagem();
        this.homeImageSelected = false;
        this.imagemHomeGaleriaChangedEvent = '';
      }
    });
  }

  public cortarImagem() {
    this.imagemHomeGaleriaChangedEvent = '';
    this.homeImagemCropGaleriaAux = null;
  }

  public onEnter(value: string, item: HomeImagem ) {
    item.nomeAutor = value;
  }


  imageCropped(event: ImageCroppedEvent) {
    this.homeImagemCropGaleriaAux.conteudo = event.base64.split('base64,')[1];
    this.homeImagemCropGaleriaAux.safeUrl = this.domSanitizationService.bypassSecurityTrustUrl('data:image/png;base64, ' + this.homeImagemCropGaleriaAux.conteudo);
  }

  public selecionarDivHomeBarra(divNumero: number) {
    this.homeBarraDivSelecionada = divNumero;
  }


  public removerPrimeiraImagemSegundaSecao(secao: any) {
    secao.primeiraImagem = null;
    secao.primeiraImagemSafeUrl = null;
  }

  public removerSegundaImagemSegundaSecao(secao: any) {
    secao.segundaImagem = null;
    secao.segundaImagemSafeUrl = null;
  }

  public removerPrimeiraImagemTerceiraSecao(secao: any) {
    secao.primeiraImagem = null;
    secao.primeiraImagemSafeUrl = null;
  }

  public removerSegundaImagemTerceiraSecao(secao: any) {
    secao.segundaImagem = null;
    secao.segundaImagemSafeUrl = null;
  }

  public removerPrimeiraImagemQuartaSecao(secao: any) {
    secao.primeiraImagem = null;
    secao.primeiraImagemSafeUrl = null;
  }

  public removerPrimeiraImagemSecaoLateral(secao: any) {
    secao.primeiraImagem = null;
    secao.primeiraImagemSafeUrl = null;
  }

  public removerSegundaImagemSecaoLateral(secao: any) {
    secao.segundaImagem = null;
    secao.segundaImagemSafeUrl = null;
  }

  public removerTerceiraImagemSecaoLateral(secao: any) {
    secao.terceiraImagem = null;
    secao.terceiraImagemSafeUrl = null;
  }

  public removerPrimeiraImagemSextaSecao(secao: any) {
    secao.primeiraImagem = null;
    secao.primeiraImagemSafeUrl = null;
  }

  public removerSegundaImagemSextaSecao(secao: any) {
    secao.segundaImagem = null;
    secao.segundaImagemSafeUrl = null;
  }

  public removerPrimeiraImagemSetimaSecao(secao: any) {
    secao.primeiraImagem = null;
    secao.primeiraImagemSafeUrl = null;
  }

  public ordernarGaleriaDeImagens(newValue) {
    if (this.home && this.home.galeriaDeImagens) {
      this.home.galeriaDeImagens.sort(function(a, b) {
        return a.indice - b.indice;
      });
    }
  }


  toggleDisplayPreview() {
    this.isShowPreview = !this.isShowPreview;
    if ( this.isShowPreview) {
      this.preVisualizarSecoes(null, null);
    }
  }


  private preVisualizarSecoes(secaoSelecionada: any, tipo: string) {

    this.todasSecoes = [];

    this.homeVisualizacao = this.home;

    if (this.homeVisualizacao && this.homeVisualizacao.id && !this.homeVisualizacao.galeriaDeImagens) {
      this.buscarListaImagensGaleriaPorId(this.homeVisualizacao);
    }

    this.buscarPrimeiraSecaoPorId(this.homeVisualizacao.id, secaoSelecionada, tipo);

    this.buscarSegundaSecaoPorId(this.homeVisualizacao.id, secaoSelecionada, tipo);

    this.buscarTerceiraSecaoPorId(this.homeVisualizacao.id, secaoSelecionada, tipo);

    this.buscarQuartaSecaoPorId(this.homeVisualizacao.id, secaoSelecionada, tipo);

    this.buscarQuintaSecaoPorId(this.homeVisualizacao.id, secaoSelecionada, tipo);

    this.buscarSecaoLateralPorId(this.homeVisualizacao.id, secaoSelecionada, tipo);

    this.buscarSextaSecaoPorId(this.homeVisualizacao.id, secaoSelecionada, tipo);

    this.buscarSetimaSecaoPorId(this.homeVisualizacao.id, secaoSelecionada, tipo);

  }

  private atualizarPreVisualizacaoSecao(secaoSelecionada: any, tipo: string){
    let novo = true;
    this.todasSecoes.forEach(secao => {
    if (secao.id == secaoSelecionada.id && secao.tipo == tipo) {
      Object.assign(secao, secaoSelecionada);
      novo = false;
      secao.tipo = tipo;
      }
    });
    if (novo) {
      secaoSelecionada.id = 999999;
      secaoSelecionada.tipo = tipo;
      this.todasSecoes.push(secaoSelecionada);
    }
  }

  private atualizarPreVisualizacaoSecaoLateral(secaoSelecionada: any) {
    let novo = true;
    this.homeVisualizacao.listaSecaoLateral.forEach(secao => {
      if (secao.id == secaoSelecionada.id) {
      Object.assign(secao, secaoSelecionada);
      novo = false;
      }
    });
    if (novo) {
      secaoSelecionada.id = 999999;
      this.homeVisualizacao.listaSecaoLateral.push(secaoSelecionada);
    }
  }

  private async buscarPrimeiraSecaoPorId(id: number, secaoSelecionada: any, tipo: string) {
    await this.homeService.buscarPrimeiraSecaoPorId(id).subscribe(response => {
      this.homeVisualizacao.listaPrimeiraSecao = response as PrimeiraSecao[];
      if (this.homeVisualizacao.listaPrimeiraSecao) {
        this.todasSecoes = [...this.todasSecoes, ...this.homeVisualizacao.listaPrimeiraSecao];
        this.ordernarPorIndiceTodasSecoes();
      }
      if (tipo && tipo == 'primeiraSecao' && secaoSelecionada) {
        this.atualizarPreVisualizacaoSecao(secaoSelecionada, tipo);
      }
    });
  }

  private async buscarSegundaSecaoPorId(id: number, secaoSelecionada: any, tipo: string) {
      await this.homeService.buscarSegundaSecaoPorId(id).subscribe(response => {
        this.homeVisualizacao.listaSegundaSecao = response as SegundaSecao[];
        if (this.homeVisualizacao.listaSegundaSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.homeVisualizacao.listaSegundaSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
        if (tipo && tipo == 'segundaSecao' && secaoSelecionada) {
          this.atualizarPreVisualizacaoSecao(secaoSelecionada, tipo);
        }
      });
  }

  private async buscarTerceiraSecaoPorId(id: number, secaoSelecionada: any, tipo: string) {
      await this.homeService.buscarTerceiraSecaoPorId(id).subscribe(response => {
        this.homeVisualizacao.listaTerceiraSecao = response as TerceiraSecao[];
        if (this.homeVisualizacao.listaTerceiraSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.homeVisualizacao.listaTerceiraSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
        if (tipo && tipo == 'terceiraSecao' && secaoSelecionada) {
          this.atualizarPreVisualizacaoSecao(secaoSelecionada, tipo);
        }
      });
  }

  private async buscarQuartaSecaoPorId(id: number, secaoSelecionada: any, tipo: string) {
      await this.homeService.buscarQuartaSecaoPorId(id).subscribe(response => {
        this.homeVisualizacao.listaQuartaSecao = response as QuartaSecao[];
        if (this.homeVisualizacao.listaQuartaSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.homeVisualizacao.listaQuartaSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
        if (tipo && tipo == 'quartaSecao' && secaoSelecionada) {
          this.atualizarPreVisualizacaoSecao(secaoSelecionada, tipo);
        }
      });
  }

  private async buscarQuintaSecaoPorId(id: number, secaoSelecionada: any, tipo: string) {
      await this.homeService.buscarQuintaSecaoPorId(id).subscribe(response => {
        this.homeVisualizacao.listaQuintaSecao = response as QuintaSecao[];
        if (this.homeVisualizacao.listaQuintaSecao) {
          this.todasSecoes = [...this.todasSecoes, ...this.homeVisualizacao.listaQuintaSecao];
          this.ordernarPorIndiceTodasSecoes();
        }
        if (tipo && tipo == 'quintaSecao' && secaoSelecionada) {
          this.atualizarPreVisualizacaoSecao(secaoSelecionada, tipo);
        }
      });
  }

  private async buscarSecaoLateralPorId(id: number, secaoSelecionada, tipo: string) {
      await this.homeService.buscarSecaoLateralPorId(id).subscribe(response => {
        this.homeVisualizacao.listaSecaoLateral = response as SecaoLateral[];

        if (tipo && tipo == 'secaoLateral' && secaoSelecionada) {
          this.atualizarPreVisualizacaoSecaoLateral(secaoSelecionada);
        }
      });
  }

  private async buscarSextaSecaoPorId(id: number, secaoSelecionada: any, tipo: string) {
    await this.homeService.buscarSextaSecaoPorId(id).subscribe(response => {
      this.homeVisualizacao.listaSextaSecao = response as SextaSecao[];
      if (this.homeVisualizacao.listaSextaSecao) {
        this.todasSecoes = [...this.todasSecoes, ...this.homeVisualizacao.listaSextaSecao];
        this.ordernarPorIndiceTodasSecoes();
      }
      if (tipo && tipo == 'sextaSecao' && secaoSelecionada) {
        this.atualizarPreVisualizacaoSecao(secaoSelecionada, tipo);
      }
    });
  }

  private async buscarSetimaSecaoPorId(id: number, secaoSelecionada: any, tipo: string) {
    await this.homeService.buscarSetimaSecaoPorId(id).subscribe(response => {
      this.homeVisualizacao.listaSetimaSecao = response as SetimaSecao[];
      if (this.homeVisualizacao.listaSetimaSecao) {
        this.todasSecoes = [...this.todasSecoes, ...this.homeVisualizacao.listaSetimaSecao];
        this.ordernarPorIndiceTodasSecoes();
      }
      if (tipo && tipo == 'setimaSecao' && secaoSelecionada) {
        this.atualizarPreVisualizacaoSecao(secaoSelecionada, tipo);
      }
    });
  }

  private ordernarPorIndiceTodasSecoes() {
    this.todasSecoes.sort((n1, n2) => {
      if (n1.indice > n2.indice) {
          return 1;
      }
      if (n1.indice < n2.indice) {
          return -1;
      }
      return 0;
    });
  }

  private ordernarPorIndiceSecoesLateral() {
    if (this.home && this.home.listaSecaoLateral) {
      this.home.listaSecaoLateral.sort((n1, n2) => {
        if (n1.indice > n2.indice) {
            return 1;
        }
        if (n1.indice < n2.indice) {
            return -1;
        }
        return 0;
      });
    }

  }

  private ordernarPorIndiceTodasSecoesResumidas() {
    this.todasSecoesResumidas.sort((n1, n2) => {
      if (n1.indice > n2.indice) {
          return 1;
      }
      if (n1.indice < n2.indice) {
          return -1;
      }
      return 0;
    });
  }

  public carregarImagensGaleria() {
    if (this.home && this.home.id && !this.home.galeriaDeImagens) {
      this.buscarListaImagensGaleriaPorId(this.home);
    }

  }

  public preVisulizarSecao(secaoSelecionada: any, tipo: string) {
    this.isShowPreview = true;
    this.preVisualizarSecoes(secaoSelecionada, tipo);
  }

  public alteraIndiceSecao(secaoSelecionado: any) {

    const secao = secaoSelecionado;
    const dialogRef = this.dialog.open(EditarIndiceSecaoComponent, {
      width: '25%',
      data: {
        obj : secao
      }
    });

    dialogRef.afterClosed().subscribe( response => {
      if (response) {
        const secaoSel = response as any;
        this.editarIndiceSecao(secaoSel);
      }
    });
  }

  private editarIndiceSecao(secao: any): void {
    this.loading = true;
    this.homeService.editarIndiceSecao(secao.tipo, secao.id, secao.indice).subscribe(response => {
      const id = response as any;
      if (id) {
        PcsUtil.swal().fire({
          title: 'Indíce',
          text: `Salvo.`,
          type: 'success',
          showCancelButton: false,
          confirmButtonText: 'Ok',
        }).then((result) => {
          this.loading = false;
        }, error => {this.loading = false;});
      }
      this.loading = false;
      if (secao && secao.tipo == 'secaoLateral') {
        this.dataSourceSecaoLateral = new MatTableDataSource<SecaoLateral>(this.home.listaSecaoLateral);
        this.ordernarPorIndiceSecoesLateral();
      } else {
        this.todasSecoesResumidas = [...this.todasSecoesResumidas];
        this.dataSourceSecao = this.todasSecoesResumidas;
        this.ordernarPorIndiceTodasSecoesResumidas();
      }

    });
  }

  public voltarListaPaginas() {
    this.router.navigate([`/home-editor/lista`]);
  }

}


