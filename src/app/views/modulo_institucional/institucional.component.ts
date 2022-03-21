import { Premiacao } from 'src/app/model/premiacao';
import { Component, OnInit, ElementRef } from '@angular/core';
import { PcsUtil } from 'src/app/services/pcs-util.service';
import swal from 'sweetalert2';
import { PremiacaoService } from 'src/app/services/premiacao.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: "app-institucional",
  templateUrl: "./institucional.component.html",
  styleUrls: ["./institucional.component.css"]
})
export class InstitucionalComponent implements OnInit {
  scrollUp: any;

  constructor(
    public premiacaoService: PremiacaoService,
    private domSanitizer: DomSanitizer,
    private element: ElementRef,
    private router: Router
  ) {
    this.scrollUp = this.router.events.subscribe(path => {
      element.nativeElement.scrollIntoView();
    });
  }

  loading = true;

  listaPremiacao: Premiacao[];

  ngOnInit() {
    if (localStorage.getItem("usuarioLogado") != null) {
      this.carregaLista();
    }
  }

  public participarPremiacao(id: number): void {
    const swalWithBootstrapButtons = swal.mixin({
      confirmButtonClass: "btn btn-success",
      cancelButtonClass: "btn btn-danger",
      buttonsStyling: true
    });

    PcsUtil.swal()
      .fire({
        title: "Deseja Continuar?",
        text: `Deseja realmente participar da premiação`,
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        reverseButtons: false
      })
      .then(result => {
        if (result.value) {
          this.premiacaoService.participarPremiacao(id).subscribe(response => {
            PcsUtil.swal().fire(
              "Participando da Premiação!",
              `Agora você está participando.`,
              "success"
            );
          });
        }
      });
  }

  public isUsuarioPrefeitura(): boolean {
    if (localStorage.getItem("usuarioLogado") != null) {
      if (
        Boolean(
          JSON.parse(localStorage.getItem("usuarioLogado")).usuarioPrefeitura
        ) === true
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public carregaLista() {
    this.premiacaoService.buscarTodasInscricoesAbertas().subscribe(response => {
      this.listaPremiacao = response as Premiacao[];

      this.listaPremiacao.forEach(p => {
        p.bannerPremiacaoConv = this.domSanitizer.bypassSecurityTrustUrl(
          "data:image/png;base64, " + p.bannerPremiacao.conteudo
        );
      });
    });
  }
}


