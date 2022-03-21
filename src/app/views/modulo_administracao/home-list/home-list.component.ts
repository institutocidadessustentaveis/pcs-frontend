import { InstitucionalDinamicoSecao1 } from '../../../model/institucional-dinamico-secao1';
import { Component, OnInit, ElementRef, ChangeDetectorRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog} from '@angular/material';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import { InstitucionalDinamico } from 'src/app/model/institucional-dinamico';
import { InstitucionalDinamicoService } from 'src/app/services/institucional-dinamico.service';
import { environment } from 'src/environments/environment';
import { InstitucionalInternoService } from 'src/app/services/institucional-interno.service';
import { HomeService } from 'src/app/services/home.service';
declare var $;

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.css', './home-list.component.scss']
})
export class HomeListComponent implements OnInit {

  public institucionalDinamico: InstitucionalDinamico = new InstitucionalDinamico();

  loading: any;

  public urlBase;
  scrollUp: any;

  public step;
  public todasSecoes: any[] = [];
  public todasSecoesResumidas: any[] = [];
  public dataSourceSecao: any;
  public displayedColumnsSecao: string[] = ['titulo', 'link','exibir', 'acoes'];


  constructor(public homeService: HomeService,
              public institucionalInternoService: InstitucionalInternoService,
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
    this.buscarListaPaginaHomeResumida();
  }

  public hasRole(role: string): boolean {
    return this.authService.hasRole(role);
  }

  private async buscarListaPaginaHomeResumida() {
      await this.homeService.buscarTodasPaginasHome().subscribe(response => {
        this.dataSourceSecao = response as Array<any>;
      });
  }

  public excluirPagina(id: number) {
    this.loading = true;
    PcsUtil.swal().fire({
      title: 'Deseja Continuar?',
      text: `Deseja realmente excluir a página selecionada?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      reverseButtons: false
    }).then((result) => {
      if (result.value) {
        this.loading = false;
         this.homeService.excluir(id).subscribe(pagina => {
           PcsUtil.swal().fire('Excluído!', `Página excluída.`, 'success');
           this.buscarListaPaginaHomeResumida();
         });
      } else {
        this.loading = false;
      }
    });
  }

  public cadastrarPagina() {
    this.router.navigate([`home/cadastrar`]);
  }

  public editarPagina(id: number){
    this.router.navigate([`/home/editar/${id}`]);
  }

  public setStep(index: number) {
    this.step = index;
  }

  public openPageNewTab(link_pagina) {
    if(link_pagina === 'boas-praticas' || link_pagina === 'indicadores'){
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`/${link_pagina}`])
        );
        window.open(url, '_blank');
    } else {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`/inicial/${link_pagina}`])
      );
      window.open(url, '_blank');
    }
   
  }

  public verificaPaginasEstaticas(link_pagina: string) : boolean{
    if(link_pagina == 'home'){
      return false
    } else  if(link_pagina == 'boas-praticas'){
      return false
    } else  if(link_pagina == 'indicadores'){
      return false
    }
    return true;
  }
}


